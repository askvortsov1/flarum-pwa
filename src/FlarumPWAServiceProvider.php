<?php

namespace Askvortsov\FlarumPWA;

use Flarum\Foundation\AbstractServiceProvider;
use Flarum\Settings\SettingsRepositoryInterface;
use Kreait\Firebase\Contract\Messaging as FirebaseMessagingContract;
use Kreait\Firebase\Factory as FirebaseFactory;

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */
class FlarumPWAServiceProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->bind(FirebaseMessagingContract::class, function ($container) {
            $settings = $container[SettingsRepositoryInterface::class];

            return (new FirebaseFactory)
                ->withServiceAccount(json_decode($settings->get('askvortsov-pwa.firebaseConfig'), true))
                ->createMessaging();
        });
    }
}
