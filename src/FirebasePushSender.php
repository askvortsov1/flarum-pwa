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

use Flarum\User\User;
use Flarum\Notification\MailableInterface;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class FirebasePushSender
{
    private Messaging $messaging;

    public function __construct(Messaging $messaging)
    {
        $this->messaging = $messaging;
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
        // $users = User::whereIn('id', $userIds)->get()->all();
        //
        // FirebasePushSubscription::whereIn('user_id', $userIds)->get();


        $this->messaging->send(
            $this->newMessage()
        );
    }

    private function newMessage(): CloudMessage
    {
        return CloudMessage::new()->withNotification(
            Notification::fromArray([
                'title' => 'Notification Title',
                'body' => 'Notification Body',
            ])
        );
    }

    public static array $SUPPORTED_NON_EMAIL_BLUEPRINTS = [
        "Flarum\Likes\Notification\PostLikedBlueprint",
        "Flarum\Notification\DiscussionRenamedBlueprint",
    ];
}
