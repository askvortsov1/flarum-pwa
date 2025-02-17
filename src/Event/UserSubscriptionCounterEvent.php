<?php

namespace Askvortsov\FlarumPWA\Event;

use Flarum\User\User;

class UserSubscriptionCounterEvent
{
    public function __construct(
        public User $user
    ) {}
}