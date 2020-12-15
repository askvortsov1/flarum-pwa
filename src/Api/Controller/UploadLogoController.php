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
use Flarum\Api\Controller\ShowForumController;
use Flarum\Foundation\Application;
use Flarum\Foundation\Paths;
use Flarum\Http\Exception\RouteNotFoundException;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Intervention\Image\ImageManager;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UploadLogoController extends ShowForumController
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
    public function data(ServerRequestInterface $request, Document $document)
    {
        $request->getAttribute('actor')->assertAdmin();

        $size = intval(Arr::get($request->getQueryParams(), 'size'));

        if (!in_array($size, PWATrait::$SIZES)) {
            throw new RouteNotFoundException();
        }

        $file = Arr::get($request->getUploadedFiles(), strval($size));

        $tmpFile = tempnam($this->paths->storage.'/tmp', 'favicon');
        $file->moveTo($tmpFile);

        $manager = new ImageManager();

        $encodedImage = $manager->make($tmpFile)->resize($size, $size)->encode('png');
        file_put_contents($tmpFile, $encodedImage);

        $path = "pwa-icon-${size}x${size}.png";

        if ($this->mount()->has($file = "assets://$path")) {
            $this->mount()->delete($file);
        }

        $this->mount()->move('storage://'.pathinfo($tmpFile, PATHINFO_BASENAME), "assets://$path");

        $this->settings->set("askvortsov-pwa.icon_${size}_path", $path);

        return parent::data($request, $document);
    }
}
