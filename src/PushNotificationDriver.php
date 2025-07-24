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
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\Queue\Queue;
use Illuminate\Support\Arr;
use ReflectionException;

class PushNotificationDriver implements NotificationDriverInterface
{
    public function __construct(protected Queue $queue, protected SettingsRepositoryInterface $settings, protected NotificationBuilder $notifications)
    {
    }

    /**
     * {@inheritDoc}
     * @throws ReflectionException
     */
    public function registerType(string $blueprintClass, array $enabled): void
    {
        $defaultPrefToEmail = $this->settings->get('askvortsov-pwa.pushNotifPreferenceDefaultToEmail');

        if ($this->notifications->supports($blueprintClass)) {
            User::registerPreference(
                User::getNotificationPreferenceKey($blueprintClass::getType(), 'push'),
                'boolval',
                $defaultPrefToEmail && in_array('email', $enabled)
            );
        }
    }

    /**
     * {@inheritDoc}
     * @throws ReflectionException
     */
    public function send(BlueprintInterface $blueprint, array $users): void
    {
        if (! $this->notifications->supports(get_class($blueprint))) {
            return;
        }

        $users = array_filter($users, function ($user) use ($blueprint) {
            return $user->getPreference(User::getNotificationPreferenceKey($blueprint->getType(), 'push'));
        });

        $userIds = Arr::pluck($users, 'id');

        $this->queue->push(new SendPushNotificationsJob($blueprint, $userIds));
    }
}
