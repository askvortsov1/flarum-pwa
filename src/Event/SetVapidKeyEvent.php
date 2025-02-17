<?php

namespace Askvortsov\FlarumPWA\Event;

class SetVapidKeyEvent
{
    public function __construct(
        public array $keys
    ) {}
}