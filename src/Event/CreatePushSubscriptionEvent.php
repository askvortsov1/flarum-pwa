<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Event;

use Carbon\Carbon;
use Flarum\User\User;

class CreatePushSubscriptionEvent
{
    public function __construct(
        public User $user,
        public string $endpoint,
        public ?Carbon $expired_at,
        public string $vapid_public_key,
        public string $keys
    ) {
    }
}
