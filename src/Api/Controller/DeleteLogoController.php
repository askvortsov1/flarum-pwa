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

use Askvortsov\FlarumPWA\PWATrait;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Foundation\Application;
use Flarum\Foundation\Paths;
use Flarum\Http\Exception\RouteNotFoundException;
use Flarum\Settings\SettingsRepositoryInterface;
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
     * @var Application
     */
    protected $app;

    /**
     * @var Paths
     */
    protected $paths;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings, Application $app, Paths $paths)
    {
        $this->settings = $settings;
        $this->app = $app;
        $this->paths = $paths;
    }

    /**
     * {@inheritdoc}
     */
    protected function delete(ServerRequestInterface $request)
    {
        $request->getAttribute('actor')->assertAdmin();

        $size = Arr::get($request->getQueryParams(), 'size');

        if (!in_array($size, PWATrait::$SIZES)) {
            throw new RouteNotFoundException();
        }

        $path = $this->settings->get("askvortsov-pwa.icon_${size}_path");

        $this->settings->set($path, null);

        if ($this->mount()->has($file = "assets://$path")) {
            $this->mount()->delete($file);
        }

        $this->settings->set("askvortsov-pwa.icon_${size}_path", null);

        return new EmptyResponse(204);
    }
}
