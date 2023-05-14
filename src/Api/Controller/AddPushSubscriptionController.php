<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Api\Controller;

use Askvortsov\FlarumPWA\Api\Serializer\PushSubscriptionSerializer;
use Askvortsov\FlarumPWA\PushSubscription;
use Carbon\Carbon;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\NotAuthenticatedException;
use Flarum\User\Exception\PermissionDeniedException;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
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

    protected SettingsRepositoryInterface $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * {@inheritdoc}
     * @throws NotAuthenticatedException
     * @throws InvalidParameterException|PermissionDeniedException
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $data = Arr::get($request->getParsedBody(), 'subscription', []);

        if (! ($endpoint = Arr::get($data, 'endpoint'))) {
            throw new InvalidParameterException('Endpoint must be provided');
        }

        $existing = PushSubscription::where('endpoint', $endpoint)->first();
        if ($existing) {
            return $existing;
        }

        $subscriptions = $actor->pushSubscriptions();
        $subscriptionCount = $subscriptions->count() + 1;
        $maxSubscriptionCount = $this->settings->get('askvortsov-pwa.userMaxSubscriptions');

        if ($subscriptionCount > $maxSubscriptionCount) {
            $subscriptions->orderBy('last_used')->take($subscriptionCount - $maxSubscriptionCount)->delete();
        }

        $host = parse_url($endpoint, PHP_URL_HOST);
        $allowed = Str::endsWith($host, static::$push_host_allowlist);

        if (! $allowed) {
            throw new PermissionDeniedException();
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

    /**
     * Taken from https://github.com/pushpad/known-push-services/blob/master/whitelist.
     *
     * @var string[]
     */
    public static array $push_host_allowlist = [
        'android.googleapis.com',
        'fcm.googleapis.com',
        'updates.push.services.mozilla.com',
        'updates-autopush.stage.mozaws.net',
        'updates-autopush.dev.mozaws.net',
        'notify.windows.com',
        'push.apple.com',
    ];
}
