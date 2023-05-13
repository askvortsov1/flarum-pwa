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

use Askvortsov\FlarumPWA\PWATrait;
use Askvortsov\FlarumPWA\Util;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\Exception\RouteNotFoundException;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ServerRequestInterface;

class DeleteLogoController extends AbstractDeleteController
{
    use PWATrait;

    protected SettingsRepositoryInterface $settings;

    protected Filesystem $uploadDir;

    public function __construct(SettingsRepositoryInterface $settings, Factory $filesystemFactory)
    {
        $this->settings = $settings;
        $this->uploadDir = $filesystemFactory->disk('flarum-assets');
    }

    /**
     * {@inheritdoc}
     * @throws PermissionDeniedException|RouteNotFoundException
     */
    protected function delete(ServerRequestInterface $request): EmptyResponse
    {
        RequestUtil::getActor($request)->assertAdmin();

        $size = Arr::get($request->getQueryParams(), 'size');

        if (! in_array($size, Util::$ICON_SIZES)) {
            throw new RouteNotFoundException();
        }

        $pathKey = "askvortsov-pwa.icon_{$size}_path";
        $path = $this->settings->get($pathKey);

        $this->uploadDir->delete($path);

        $this->settings->set($pathKey, null);

        return new EmptyResponse(204);
    }
}
