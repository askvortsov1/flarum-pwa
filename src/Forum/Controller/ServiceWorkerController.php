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
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Contracts\Filesystem\Filesystem;
use Laminas\Diactoros\Response\TextResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ServiceWorkerController implements RequestHandlerInterface
{
    use PWATrait;

    /**
     * @var Filesystem
     */
    protected $assetDir;

    public function __construct(Factory $filesystemFactory)
    {
        $this->assetDir = $filesystemFactory->disk('flarum-assets');
    }
    
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $response = new TextResponse($this->assetDir->get('askvortsov-pwa/sw.js'), 200, ['content-type' => 'text/javascript; charset=utf-8']);

        return $response;
    }
}
