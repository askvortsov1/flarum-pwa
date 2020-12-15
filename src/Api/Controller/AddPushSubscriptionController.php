<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2020 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Api\Controller;

use Askvortsov\FlarumPWA\Api\Serializer\PushSubscriptionSerializer;
use Askvortsov\FlarumPWA\PushSubscription;
use Carbon\Carbon;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Tobscure\JsonApi\Exception\InvalidParameterException;

class AddPushSubscriptionController extends AbstractCreateController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = PushSubscriptionSerializer::class;

    /**
     * {@inheritdoc}
     */
    public $include = [
        'user',
    ];

    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $actor->assertRegistered();

        $data = Arr::get($request->getParsedBody(), 'subscription', []);

        if (!($endpoint = Arr::get($data, 'endpoint'))) {
            throw new InvalidParameterException('Endpoint must be provided');
        }

        $existing = PushSubscription::where('endpoint', $endpoint)->first();
        if ($existing) {
            return $existing;
        }

        $subscription = new PushSubscription();

        $subscription->user_id = $actor->id;
        $subscription->endpoint = $endpoint;
        $subscription->expires_at = isset($data['expirationTime']) ? Carbon::parse($data['expirationTime']) : null;
        $subscription->vapid_public_key = $this->settings->get('askvortsov-pwa.vapid.public');
        $subscription->keys = isset($data['keys']) ? json_encode($data['keys']) : null;

        $subscription->save();

        return $subscription;
    }
}
