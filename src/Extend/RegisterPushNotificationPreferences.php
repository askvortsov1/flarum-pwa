<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Extend;

use Flarum\Event\ConfigureNotificationTypes;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Notification\Blueprint\DiscussionRenamedBlueprint;
use Flarum\User\User;
use Illuminate\Contracts\Container\Container;

class RegisterPushNotificationPreferences implements ExtenderInterface
{

    public function extend(Container $container, Extension $extension = null)
    {
        // We really need to improve notification channel extenders...
        $blueprints = [
            DiscussionRenamedBlueprint::class => ['alert']
        ];

        $container->make('events')->dispatch(
            new ConfigureNotificationTypes($blueprints)
        );

        foreach ($blueprints as $blueprint => $enabled) {
            $type = $blueprint::getType();

            User::addPreference(
                User::getNotificationPreferenceKey($type, 'push'),
                'boolval',
                in_array('email', $enabled)
            );
        }
    }
}
