<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2020 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Extend;

use Askvortsov\FlarumPWA\Listener\SendPushNotifications;
use Flarum\Event\ConfigureNotificationTypes;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Foundation\Application;
use Flarum\Notification\Blueprint\DiscussionRenamedBlueprint;
use Flarum\Notification\MailableInterface;
use Flarum\User\User;
use Illuminate\Contracts\Container\Container;
use ReflectionClass;

class RegisterPushNotificationPreferences implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $application = $container->make(Application::class);

        $application->booted(function () use ($container) {
            // We really need to improve notification channel extenders...
            $blueprints = [
                DiscussionRenamedBlueprint::class => ['alert'],
            ];

            $container->make('events')->dispatch(
                new ConfigureNotificationTypes($blueprints)
            );

            foreach ($blueprints as $blueprint => $enabled) {
                $type = $blueprint::getType();

                if ((new ReflectionClass($blueprint))->implementsInterface(MailableInterface::class) || in_array($blueprint, SendPushNotifications::$SUPPORTED_NON_EMAIL_BLUEPRINTS)) {
                    User::addPreference(
                        User::getNotificationPreferenceKey($type, 'push'),
                        'boolval',
                        in_array('email', $enabled)
                    );
                }
            }
        });
    }
}
