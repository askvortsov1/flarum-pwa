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

use Askvortsov\FlarumPWA\Util;
use Flarum\Api\Controller\UploadImageController;
use Flarum\Http\Exception\RouteNotFoundException;
use Illuminate\Support\Arr;
use Intervention\Image\Interfaces\EncodedImageInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UploadedFileInterface;

class UploadLogoController extends UploadImageController
{
    protected int $size;

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $size = intval(Arr::get($request->getQueryParams(), 'size'));
        $this->size = $size;

        if (! in_array($size, Util::$ICON_SIZES)) {
            throw new RouteNotFoundException();
        }

        $this->filenamePrefix = "pwa-icon-{$size}x{$size}";
        $this->filePathSettingKey = "askvortsov-pwa.icon_{$size}_path";

        return parent::handle($request);
    }

    protected function makeImage(UploadedFileInterface $file): EncodedImageInterface|StreamInterface
    {
        return $this->imageManager->read($file->getStream()->getMetadata('uri'))
            ->scale(height: $this->size)
            ->toPng();
    }
}
