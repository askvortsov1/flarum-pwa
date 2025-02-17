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

use Askvortsov\FlarumPWA\FirebasePushSender;
use Askvortsov\FlarumPWA\PushSender;
use ErrorException;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Queue\AbstractJob;

class SendPushNotificationsJob extends AbstractJob
{
    public function __construct(private BlueprintInterface $blueprint, private array $recipientIds = [])
    {
    }

    /**
     * @throws ErrorException
     */
    public function handle(PushSender $native, FirebasePushSender $firebase): void
    {
        $native->notify($this->blueprint, $this->recipientIds);

        $firebase->notify($this->blueprint, $this->recipientIds);
    }
}
