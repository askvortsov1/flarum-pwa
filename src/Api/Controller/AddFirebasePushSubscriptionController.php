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

use Askvortsov\FlarumPWA\Api\Serializer\FirebasePushSubscriptionSerializer;
use Askvortsov\FlarumPWA\FirebasePushSubscription;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Flarum\User\Exception\NotAuthenticatedException;
use Flarum\User\Exception\PermissionDeniedException;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Tobscure\JsonApi\Exception\InvalidParameterException;

class AddFirebasePushSubscriptionController extends AbstractCreateController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = FirebasePushSubscriptionSerializer::class;

    /**
     * {@inheritdoc}
     */
    public $include = [
        'user',
    ];

    /**
     * {@inheritdoc}
     * @throws NotAuthenticatedException
     * @throws InvalidParameterException|PermissionDeniedException
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        return FirebasePushSubscription::updateOrCreate([
            'user_id' => $actor->id,
            'token' => Arr::get($request->getParsedBody(), 'token', []),
        ]);
    }
}
