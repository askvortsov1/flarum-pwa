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

use Carbon\Carbon;
use ErrorException;
use Exception;
use Flarum\Discussion\Discussion;
use Flarum\Http\UrlGenerator;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Notification\MailableInterface;
use Flarum\Post\CommentPost;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Minishlink\WebPush\MessageSentReport;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;
use Psr\Log\LoggerInterface;
use ReflectionException;
use Symfony\Contracts\Translation\TranslatorInterface;

class PushSender
{
    use PWATrait;

    protected Cloud $assetsFilesystem;

    protected LoggerInterface $logger;

    protected SettingsRepositoryInterface $settings;

    protected TranslatorInterface $translator;

    protected UrlGenerator $url;

    public function __construct(
        Factory $filesystemFactory,
        LoggerInterface $logger,
        SettingsRepositoryInterface $settings,
        TranslatorInterface $translator,
        UrlGenerator $url
    ) {
        $this->assetsFilesystem = $filesystemFactory->disk('flarum-assets');
        $this->logger = $logger;
        $this->settings = $settings;
        $this->translator = $translator;
        $this->url = $url;
    }

    /**
     * @throws ReflectionException
     */
    public static function canSend(string $blueprintClass): bool
    {
        return (new \ReflectionClass($blueprintClass))->implementsInterface(MailableInterface::class) || in_array(
            $blueprintClass,
            static::$SUPPORTED_NON_EMAIL_BLUEPRINTS
        );
    }

    /**
     * @throws ErrorException
     * @throws Exception
     */
    public function notify(BlueprintInterface $blueprint, array $userIds = []): void
    {
        $users = User::whereIn('id', $userIds)->get()->all();

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
                        'endpoint' => $subscription->endpoint,
                        'keys' => json_decode($subscription->keys, true),
                    ]),
                    'payload' => $payload,
                ];
            }
        }

        $auth = [
            'VAPID' => [
                'subject' => $this->url->to('forum')->base(),
                'publicKey' => Util::url_encode($this->settings->get('askvortsov-pwa.vapid.public')),
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
            $webPush->queueNotification(
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
            if (! $report->isSuccess() && in_array($report->getResponse()->getStatusCode(), [401, 403, 404, 410])) {
                PushSubscription::where('endpoint', $report->getEndpoint())->delete();
            } elseif (! $report->isSuccess()) {
                $this->log("[PWA PUSH] Message failed to sent for subscription {$report->getEndpoint()}: {$report->getReason()}");
            } else {
                $subscription = PushSubscription::where('endpoint', $report->getEndpoint())->first();
                $subscription->last_used = Carbon::now();
                $subscription->save();
                $sentCounter++;
            }
        }

        $this->log("[PWA PUSH] Sent $sentCounter notifications successfully.\n\n");
    }

    protected function getPayload(BlueprintInterface $blueprint): array
    {
        $content = '';
        $link = $this->url->to('forum')->base();

        $subject = $blueprint->getSubject();
        $subjectModel = $blueprint::getSubjectModel();

        switch ($subjectModel) {
            case User::class:
                /** @var User $subject */
                $link = $this->url->to('forum')->route('user', ['username' => $subject->display_name]);
                break;
            case Discussion::class:
                /** @var Discussion $subject */
                $content = $this->getRelevantPostContent($subject);
                $link = $this->url->to('forum')->route('discussion', ['id' => $subject->id]);
                break;
            case Post::class:
                /** @var Post $subject */
                if ($subject instanceof CommentPost) {
                    $content = $subject->formatContent();
                }
                $link = $this->url->to('forum')->route(
                    'discussion',
                    ['id' => $subject->discussion_id, 'near' => $subject->number]
                );
                break;
        }

        $payload = [
            'title' => $this->excerpt($this->getTitle($blueprint), 30),
            'content' => $this->excerpt($content),
            'link' => $link,
        ];

        if ($faviconPath = $this->settings->get('favicon_path')) {
            $payload['badge'] = $this->assetsFilesystem->url($faviconPath);
        }

        $pwaIcons = array_reverse($this->getIcons());

        if (! empty($pwaIcons)) {
            $payload['icon'] = $pwaIcons[0]['src'];
        } elseif ($logoPath = $this->settings->get('logo_path')) {
            $payload['icon'] = $this->assetsFilesystem->url($logoPath);
        }

        return $payload;
    }

    protected function excerpt(string $str, int $maxLen = 200): string
    {
        $str = strip_tags($str);
        if (mb_strlen($str) > $maxLen) {
            $str = mb_substr($str, 0, $maxLen);
            $str .= '...';
        }

        return $str;
    }

    protected function getRelevantPostContent($discussion): string
    {
        $relevantPost = $discussion->mostRelevantPost ?: $discussion->firstPost ?: $discussion->comments->first();

        if ($relevantPost === null) {
            return '';
        }

        return $relevantPost->formatContent();
    }

    protected function getTitle(BlueprintInterface $blueprint): string
    {
        if ($blueprint instanceof MailableInterface) {
            return $blueprint->getEmailSubject($this->translator);
        } elseif (in_array(get_class($blueprint), static::$SUPPORTED_NON_EMAIL_BLUEPRINTS)) {
            if ($blueprint->getType() == 'postLiked') {
                return $this->translator->trans(
                    'flarum-likes.forum.notifications.post_liked_text',
                    ['username' => $blueprint->getFromUser()->getDisplayNameAttribute()]
                );
            }
        }

        return '';
    }

    protected function log(string $message): void
    {
        if ($this->settings->get('askvortsov-pwa.debug', false)) {
            $this->logger->info($message);
        }
    }

    public static array $SUPPORTED_NON_EMAIL_BLUEPRINTS = [
        "Flarum\Likes\Notification\PostLikedBlueprint",
        "Flarum\Notification\DiscussionRenamedBlueprint",
    ];
}
