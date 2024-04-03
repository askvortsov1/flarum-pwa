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
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\NotAuthenticatedException;
use Flarum\User\Exception\PermissionDeniedException;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Tobscure\JsonApi\Exception\InvalidParameterException;

class AddFirebaseConfigController extends AbstractCreateController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = FirebasePushSubscriptionSerializer::class;

    /**
     * @var SettingsRepositoryInterface
     */
    private $settings;

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
        RequestUtil::getActor($request)->assertAdmin();

        $files = $request->getUploadedFiles();

        /** @var \Laminas\Diactoros\UploadedFile $config */
        $config = $files['file'];

        $this->settings->set(
            'askvortsov-pwa.firebaseConfig',
            $config->getStream()->getContents(),
        );
    }
}
