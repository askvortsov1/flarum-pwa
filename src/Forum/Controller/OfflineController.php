<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Forum\Controller;

use Askvortsov\FlarumPWA\PWATrait;
use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Laminas\Diactoros\Response\HtmlResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class OfflineController implements RequestHandlerInterface
{
    use PWATrait;

    protected Filesystem $assetDir;

    public function __construct(FilesystemFactory $filesystemFactory, protected ViewFactory $viewFactory)
    {
        $this->assetDir = $filesystemFactory->disk('flarum-assets');
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $html = $this->viewFactory->make('askvortsov-pwa::offline')->render();

        return new HtmlResponse($html);
    }
}
