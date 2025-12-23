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
     * Required fields for a valid Firebase service account config.
     */
    private const array REQUIRED_FIELDS = [
        'type',
        'project_id',
        'private_key_id',
        'private_key',
        'client_email',
        'client_id',
    ];

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

        $contents = $config->getStream()->getContents();
        $this->validateFirebaseConfig($contents);

        $this->settings->set(
            'askvortsov-pwa.firebaseConfig',
            $contents,
        );
    }

    /**
     * Validate that the uploaded file is a valid Firebase service account config.
     *
     * @throws InvalidParameterException
     */
    private function validateFirebaseConfig(string $contents): void
    {
        $decoded = json_decode($contents, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new InvalidParameterException('The uploaded file is not valid JSON.');
        }
        if (! \is_array($decoded)) {
            throw new InvalidParameterException('The uploaded file must contain a JSON object.');
        }
        if (($decoded['type'] ?? null) !== 'service_account') {
            throw new InvalidParameterException('The uploaded file must be a Firebase service account configuration (type must be "service_account").');
        }

        $missingFields = [];
        foreach (self::REQUIRED_FIELDS as $field) {
            if (! isset($decoded[$field]) || $decoded[$field] === '') {
                $missingFields[] = $field;
            }
        }

        if (! empty($missingFields)) {
            throw new InvalidParameterException('The Firebase config is missing required fields: '.implode(', ', $missingFields));
        }
    }
}
