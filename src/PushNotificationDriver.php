<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA;

use Flarum\Discussion\Discussion;
use Flarum\Http\UrlGenerator;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Notification\Driver\NotificationDriverInterface;
use Flarum\Notification\MailableInterface;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Support\Arr;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class PushNotificationDriver implements NotificationDriverInterface
{
    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @var UrlGenerator
     */
    protected $url;

    public function __construct(LoggerInterface $logger, SettingsRepositoryInterface $settings, TranslatorInterface $translator, UrlGenerator $url)
    {
        $this->logger = $logger;
        $this->settings = $settings;
        $this->translator = $translator;
        $this->url = $url;
    }

    /**
     * {@inheritDoc}
     */
    public function registerType(string $blueprintClass, array $enabled): void
    {
        if ((new \ReflectionClass($blueprintClass))->implementsInterface(MailableInterface::class) || in_array($blueprintClass, static::$SUPPORTED_NON_EMAIL_BLUEPRINTS)) {
            User::registerPreference(
                User::getNotificationPreferenceKey($blueprintClass::getType(), 'push'),
                'boolval',
                in_array('email', $enabled)
            );
        }
    }

    /**
     * {@inheritDoc}
     */
    public function send(BlueprintInterface $blueprint, array $users): void
    {
        if (!class_exists(WebPush::class) || !function_exists('gmp_init')) {
            return;
        }

        if (!is_subclass_of($blueprint, MailableInterface::class) && !in_array(get_class($blueprint), self::$SUPPORTED_NON_EMAIL_BLUEPRINTS)) {
            return;
        }

        $users = array_filter($users, function ($user) use ($blueprint) {
            return $user->getPreference(User::getNotificationPreferenceKey($blueprint->getType(), 'push'));
        });

        $this->log('[PWA PUSH] Notification Type: '.$blueprint::getType());
        $this->log('[PWA PUSH] Sending for users with ids: '.json_encode(Arr::pluck($users, 'id')));

        $notifications = [];

        $payload = json_encode($this->getPayload($blueprint));

        $sendingCounter = 0;

        foreach ($users as $user) {
            $subscriptions = $user->pushSubscriptions;
            $sendingCounter += $subscriptions->count();
            foreach ($subscriptions as $subscription) {
                $notifications[] = [
                    'subscription' => Subscription::create([
                        'endpoint'        => $subscription->endpoint,
                        'keys'            => json_decode($subscription->keys, true),
                    ]),
                    'payload' => $payload,
                ];
            }
        }

        $auth = [
            'VAPID' => [
                'subject'    => $this->url->to('forum')->base(),
                'publicKey'  => Util::url_encode($this->settings->get('askvortsov-pwa.vapid.public')),
                'privateKey' => Util::url_encode($this->settings->get('askvortsov-pwa.vapid.private')),
            ],
        ];

        $options = [
            'topic' => $blueprint->getType(),
        ];

        $this->log("[PWA PUSH] Attempting to send $sendingCounter notifications.\n\n");

        $webPush = new WebPush($auth, $options);
        $webPush->setReuseVAPIDHeaders(true);
        $webPush->setAutomaticPadding(false);

        // send multiple notifications with payload
        foreach ($notifications as $notification) {
            $webPush->sendNotification(
                $notification['subscription'],
                $notification['payload']
            );
        }

        $sentCounter = 0;

        /**
         * Check sent results.
         *
         * @var MessageSentReport $report
         */
        foreach ($webPush->flush() as $report) {
            if (!$report->isSuccess() && in_array($report->getResponse()->getStatusCode(), [401, 403, 404, 410])) {
                PushSubscription::where('endpoint', $report->getEndpoint())->delete();
            } elseif (!$report->isSuccess()) {
                echo "[x] Message failed to sent for subscription {$report->getEndpoint()}: {$report->getReason()}";
            } else {
                $sentCounter++;
            }
        }

        $this->log("[PWA PUSH] Sent $sentCounter notifications successfully.\n\n");
    }

    protected function getPayload($blueprint)
    {
        $content = '';
        $link = $this->url->to('forum')->base();

        $subject = $blueprint->getSubject();
        switch ($blueprint->getSubjectModel()) {
            case User::class:
                $link = $this->url->to('forum')->route('user', ['id' =>  $subject->username]);
                break;
            case Discussion::class:
                $content = $this->getRelevantPostContent($subject);
                $link = $this->url->to('forum')->route('discussion', ['id' => $subject->id]);
                break;
            case Post::class:
                $content = $subject->formatContent();
                $link = $this->url->to('forum')->route('discussion', ['id' => $subject->discussion_id]).'/'.$subject->number;
                break;
        }

        return [
            'title'   => $this->excerpt($this->getTitle($blueprint), 30),
            'content' => $this->excerpt($content),
            'link'    => $link,
        ];
    }

    protected function excerpt($str, $maxLen = 200)
    {
        $str = strip_tags($str);
        if (mb_strlen($str) > $maxLen) {
            $str = mb_substr($str, 0, $maxLen);
            $str .= '...';
        }

        return $str;
    }

    protected function getRelevantPostContent($discussion)
    {
        $relevantPost = $discussion->mostRelevantPost ?: $discussion->firstPost ?: $discussion->comments->first();

        if ($relevantPost === null) {
            return '';
        }

        return $relevantPost->formatContent();
    }

    protected function getTitle($blueprint)
    {
        if (is_subclass_of($blueprint, MailableInterface::class)) {
            return $blueprint->getEmailSubject($this->translator);
        } elseif (in_array(get_class($blueprint), static::$SUPPORTED_NON_EMAIL_BLUEPRINTS)) {
            switch ($blueprint->getType()) {
                case 'postLiked':
                    return $this->translator->transChoice(
                        'flarum-likes.forum.notifications.post_liked_text',
                        1,
                        ['{username}' => $blueprint->getFromUser()->getDisplayNameAttribute()]
                    );
            }
        }

        return '';
    }

    protected function log($message)
    {
        if ($this->settings->get('askvortsov-pwa.debug', false)) {
            $this->logger->info($message);
        }
    }

    public static $SUPPORTED_NON_EMAIL_BLUEPRINTS = [
        "Flarum\Likes\Notification\PostLikedBlueprint",
        "Flarum\Notification\DiscussionRenamedBlueprint",
    ];
}
