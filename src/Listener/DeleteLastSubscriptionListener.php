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

use Askvortsov\FlarumPWA\Event\DeleteLastSubscriptionEvent;
use Askvortsov\FlarumPWA\PushSubscription;

class DeleteLastSubscriptionListener
{
    public function __construct(protected PushSubscription $pushSubscription)
    {
    }

    public function handle(DeleteLastSubscriptionEvent $event): void
    {
        // Add logic to handle the event here.
        // See https://docs.flarum.org/2.x/extend/backend-events.html for more information.
        $user_id = $event->user->id;
        $exceed = $event->exceed;

        $this->pushSubscription->query()->where('user_id', $user_id)
            ->orderBy('last_used')
            ->take($exceed)->delete();
    }
}
