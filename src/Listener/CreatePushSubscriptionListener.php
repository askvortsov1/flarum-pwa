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

use Askvortsov\FlarumPWA\Event\CreatePushSubscriptionEvent;
use Askvortsov\FlarumPWA\PushSubscription;

class CreatePushSubscriptionListener
{
    public function handle(CreatePushSubscriptionEvent $event): void
    {
        // Add logic to handle the event here.
        // See https://docs.flarum.org/2.x/extend/backend-events.html for more information.
        $subscription = new PushSubscription();

        $subscription->user_id = $event->user->id;
        $subscription->endpoint = $event->endpoint;
        $subscription->expires_at = $event->expired_at;
        $subscription->vapid_public_key = $event->vapid_public_key;
        $subscription->keys = $event->keys;

        $subscription->save();
    }
}
