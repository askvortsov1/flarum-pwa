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
use Flarum\Http\Exception\RouteNotFoundException;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ServerRequestInterface;

class DeleteLogoController extends AbstractDeleteController
{
    use AssertPermissionTrait;
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
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings, Application $app)
    {
        $this->settings = $settings;
        $this->app = $app;
    }

    /**
     * {@inheritdoc}
     */
    protected function delete(ServerRequestInterface $request)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $size = Arr::get($request->getQueryParams(), 'size');

        if (!in_array($size, $this->sizes)) {
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
