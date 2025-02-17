<?php

namespace Askvortsov\FlarumPWA\Event;

use Flarum\User\User;

class CreateOrUpdateFirebasePushSubscriptionEvent
{
    public function __construct(
        public User $user,
        public string $token
    ) {}
}