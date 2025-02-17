<?php

namespace Askvortsov\FlarumPWA\Event;

use Carbon\Carbon;
use Flarum\User\User;

class CreatePushSubscriptionEvent
{
    public function __construct(
        public User $user,
        public string $endpoint,
        public Carbon|null $expired_at,
        public string $vapid_public_key,
        public string $keys
    ) {}
}