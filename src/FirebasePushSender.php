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

class FirebasePushSender
{
    public function __construct()
    {
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

    public function notify(BlueprintInterface $blueprint, array $userIds = []): void
    {
        $users = User::whereIn('id', $userIds)->get()->all();
    }

    public static array $SUPPORTED_NON_EMAIL_BLUEPRINTS = [
        "Flarum\Likes\Notification\PostLikedBlueprint",
        "Flarum\Notification\DiscussionRenamedBlueprint",
    ];
}
