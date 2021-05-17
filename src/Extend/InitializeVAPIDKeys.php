<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Extend;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Container\Container;
use Minishlink\WebPush\VAPID;
use RuntimeException;

class InitializeVAPIDKeys implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $settings = $container->make(SettingsRepositoryInterface::class);

        if (!$settings->get('askvortsov-pwa.vapid.private') || !$settings->get('askvortsov-pwa.vapid.private')) {
            try {
                $keys = VAPID::createVapidKeys();
            } catch (RuntimeException $e) {
                $settings->set('askvortsov-pwa.vapid.success', false);
                $settings->set('askvortsov-pwa.vapid.error', $e->getMessage());

                return;
            }

            $settings->set('askvortsov-pwa.vapid.success', true);
            $settings->set('askvortsov-pwa.vapid.private', $keys['privateKey']);
            $settings->set('askvortsov-pwa.vapid.public', $keys['publicKey']);
        }
    }
}
