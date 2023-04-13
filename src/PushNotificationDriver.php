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

use Askvortsov\FlarumPWA\Job\SendPushNotificationsJob;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Notification\Driver\NotificationDriverInterface;
use Flarum\User\User;
use Illuminate\Contracts\Queue\Queue;

class PushNotificationDriver implements NotificationDriverInterface
{
    /**
     * @var Queue
     */
    protected $queue;

    public function __construct(Queue $queue)
    {
        $this->queue = $queue;
    }

    /**
     * {@inheritDoc}
     */
    public function registerType(string $blueprintClass, array $enabled): void
    {
        if (PushSender::canSend($blueprintClass)) {
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
        if (! PushSender::canSend(get_class($blueprint))) {
            return;
        }

        $users = array_filter($users, function ($user) use ($blueprint) {
            return $user->getPreference(User::getNotificationPreferenceKey($blueprint->getType(), 'push'));
        });

        $this->queue->push(new SendPushNotificationsJob($blueprint, $users));
    }
}
