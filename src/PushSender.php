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

use Base64Url\Base64Url;
use Carbon\Carbon;
use ErrorException;
use Exception;
use Flarum\Http\UrlGenerator;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Minishlink\WebPush\MessageSentReport;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;
use Psr\Log\LoggerInterface;

class PushSender
{
    use PWATrait;

    protected Cloud $assetsFilesystem;

    protected LoggerInterface $logger;

    protected SettingsRepositoryInterface $settings;

    protected UrlGenerator $url;

    protected NotificationBuilder $notifications;

    public function __construct(
        Factory $filesystemFactory,
        LoggerInterface $logger,
        SettingsRepositoryInterface $settings,
        UrlGenerator $url,
        NotificationBuilder $notifications,
    ) {
        $this->assetsFilesystem = $filesystemFactory->disk('flarum-assets');
        $this->logger = $logger;
        $this->settings = $settings;
        $this->url = $url;
        $this->notifications = $notifications;
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

        // Safari web push seems to require that topic strings be a multiple of 4.
        // https://stackoverflow.com/questions/75685856/what-is-the-cause-of-badwebpushtopic-from-https-web-push-apple-com
        // As suggested, we Base64Url::encode, pad with 0s up to at least 32, and then trim down to exactly 32.
        $safariTopicLen = 32;
        $typeAndId = $blueprint->getType().strval($blueprint->getSubject()->id ?? -1);
        $topic = substr(str_pad(Base64Url::encode($typeAndId), $safariTopicLen, '0'), 0, $safariTopicLen);

        $options = [
            'topic' => $topic
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
            if (! $report->isSuccess() && $report->getResponse() && in_array($report->getResponse()->getStatusCode(), [401, 403, 404, 410])) {
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
        $message = $this->notifications->build($blueprint);

        $payload = [
            'title' => $message->title(),
            'content' => $message->body(),
            'link' => $message->url(),
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

    protected function log(string $message): void
    {
        if ($this->settings->get('askvortsov-pwa.debug', false)) {
            $this->logger->info($message);
        }
    }
}
