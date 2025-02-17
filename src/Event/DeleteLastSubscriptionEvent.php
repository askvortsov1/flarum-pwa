<?php

namespace Askvortsov\FlarumPWA\Event;

use Flarum\User\User;

class DeleteLastSubscriptionEvent
{
    public function __construct(
        public User $user,
        public int $exceed
    ) {}
}