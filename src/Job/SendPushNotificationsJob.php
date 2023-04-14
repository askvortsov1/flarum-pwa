<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Job;

use Askvortsov\FlarumPWA\PushSender;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Queue\AbstractJob;

class SendPushNotificationsJob extends AbstractJob
{
    /**
     * @var BlueprintInterface
     */
    private $blueprint;

    /**
     * @var int[]
     */
    private $recipientIds;

    public function __construct(BlueprintInterface $blueprint, array $recipientIds = [])
    {
        $this->blueprint = $blueprint;
        $this->recipientIds = $recipientIds;
    }

    public function handle(PushSender $pushSender)
    {
        $pushSender->notify($this->blueprint, $this->recipientIds);
    }
}
