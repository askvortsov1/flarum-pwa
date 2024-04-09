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
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Notification\MailableInterface;
use Flarum\Post\CommentPost;
use Flarum\Post\Post;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Symfony\Contracts\Translation\TranslatorInterface;

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

    /**
     * @throws \ReflectionException
     */
    public static function canSend(string $blueprintClass): bool
    {
        return (new \ReflectionClass($blueprintClass))->implementsInterface(MailableInterface::class) || in_array(
            $blueprintClass,
            static::$SUPPORTED_NON_EMAIL_BLUEPRINTS
        );
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
        [$title, $body] = $this->newNotificationMessage($blueprint);

        return CloudMessage::new()
            ->withTarget('token', $subscription->token)
            ->withNotification(
                Notification::fromArray([
                    'title' => $title,
                    'body' => strip_tags($body),
                ])
            );
    }

    private function newNotificationMessage(BlueprintInterface $blueprint): array
    {
        $message = $this->notifications->build($blueprint);

        return [$message->title(), $message->body()];
    }

    public static array $SUPPORTED_NON_EMAIL_BLUEPRINTS = [
        "Flarum\Likes\Notification\PostLikedBlueprint",
        "Flarum\Notification\DiscussionRenamedBlueprint",
    ];
}
