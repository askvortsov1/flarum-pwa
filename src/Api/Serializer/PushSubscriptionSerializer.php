<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2020 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;

class PushSubscriptionSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'push_subscriptions';

    /**
     * {@inheritdoc}
     */
    protected function getDefaultAttributes($subscription)
    {
        return [
            'endpoint'                 => $subscription->endpoint,
            'vapidPublicKey'           => $subscription->vapid_public_key,
            'expiresAt'                => $this->formatDate($subscription->expires_at),
        ];
    }

    /**
     * @param $username_request
     *
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function user($subscription)
    {
        return $this->hasOne($subscription, BasicUserSerializer::class);
    }
}
