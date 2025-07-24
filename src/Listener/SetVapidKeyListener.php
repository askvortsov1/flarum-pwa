<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Listener;

use Askvortsov\FlarumPWA\Event\SetVapidKeyEvent;
use ErrorException;
use Exception;
use Flarum\Settings\SettingsRepositoryInterface;

class SetVapidKeyListener
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function handle(SetVapidKeyEvent $event): void
    {
        // Add logic to handle the event here.
        // See https://docs.flarum.org/2.x/extend/backend-events.html for more information.
        $keys = $event->keys;

        try {
            $this->settings->set('askvortsov-pwa.vapid.success', true);
            $this->settings->set('askvortsov-pwa.vapid.private', $keys['privateKey']);
            $this->settings->set('askvortsov-pwa.vapid.public', $keys['publicKey']);
        } catch (ErrorException $e) {
            $this->settings->set('askvortsov-pwa.vapid.success', false);
            $this->settings->set('askvortsov-pwa.vapid.error', $e->getMessage());

            throw new Exception($e->getMessage());
        }
    }
}
