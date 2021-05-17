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
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\Exception\RouteNotFoundException;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ServerRequestInterface;

class DeleteLogoController extends AbstractDeleteController
{
    use PWATrait;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Filesystem
     */
    protected $uploadDir;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings, Factory $filesystemFactory)
    {
        $this->settings = $settings;
        $this->uploadDir = $filesystemFactory->disk('flarum-assets');
    }

    /**
     * {@inheritdoc}
     */
    protected function delete(ServerRequestInterface $request)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $size = Arr::get($request->getQueryParams(), 'size');

        if (!in_array($size, PWATrait::$SIZES)) {
            throw new RouteNotFoundException();
        }

        $pathKey = "askvortsov-pwa.icon_${size}_path";
        $path = $this->settings->get($pathKey);

        $this->uploadDir->delete($path);

        $this->settings->set($pathKey, null);

        return new EmptyResponse(204);
    }
}
