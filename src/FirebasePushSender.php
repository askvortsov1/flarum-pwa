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

use Flarum\Notification\Blueprint\BlueprintInterface;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class FirebasePushSender
{
    private Messaging $messaging;

    protected NotificationBuilder $notifications;

    public function __construct(
        Messaging $messaging,
        NotificationBuilder $notifications,
    ) {
        $this->messaging = $messaging;
        $this->notifications = $notifications;
    }

    public function notify(BlueprintInterface $blueprint, array $userIds = []): void
    {
        FirebasePushSubscription::whereIn('user_id', $userIds)->each(function (FirebasePushSubscription $subscription) use ($blueprint) {
            $this->messaging->send(
                $this->newFirebaseCloudMessage($subscription, $blueprint)
            );
        });
    }

    private function newFirebaseCloudMessage(FirebasePushSubscription $subscription, BlueprintInterface $blueprint): CloudMessage
    {
        $message = $this->notifications->build($blueprint);

        return CloudMessage::new()
            ->withTarget('token', $subscription->token)
            ->withNotification(
                Notification::fromArray([
                    'title' => $message->title(),
                    'body' => strip_tags($message->body()),
                ])
            );
    }
}
