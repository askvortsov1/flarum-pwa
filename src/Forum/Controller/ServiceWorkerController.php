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
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Contracts\Filesystem\Filesystem;
use Laminas\Diactoros\Response\TextResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Flarum\Settings\SettingsRepositoryInterface;

$settings = resolve(SettingsRepositoryInterface::class);
$offlinePath = $settings->get('askvortsov-pwa.customOfflinePage', 'offline');
$timestamp = '// Generated on ' . date("Y-m-d H:i:s") . PHP_EOL;
$offlineVar = 'const offlineFallbackPage = "' . $offlinePath . '";' . PHP_EOL;

class ServiceWorkerController implements RequestHandlerInterface
{
    use PWATrait;
    use Askvortsov\FlarumPWA\Forum\Controller;

    protected Filesystem $assetDir;

    public function __construct(Factory $filesystemFactory)
    {
        $this->assetDir = $filesystemFactory->disk('flarum-assets');
    }

    /**
     * @throws FileNotFoundException
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return new TextResponse($timestamp . $offlineVar . $this->assetDir->get('extensions/askvortsov-pwa/sw.js'), 200, ['content-type' => 'text/javascript; charset=utf-8']);
    }
}
