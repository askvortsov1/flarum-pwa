<?php

/*
 * This file is part of askvortsov/flarum-pwa.
 *
 * Copyright (c) 2020 Alexander Skvortsov.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA;

use Flarum\Extend;
use Flarum\Foundation\Application;
use Flarum\Frontend\Document;

use Askvortsov\FlarumPWA\Api\Controller;

return [
    (new Extend\Routes('api'))
        ->post('/pwa/refresh', 'askvortsov-pwa.refresh', Controller\RefreshPWAController::class)
        ->get('/pwa/settings', 'askvortsov-pwa.settings', Controller\ShowPWASettingsController::class)
        ->delete('/pwa/logo/{size}', 'askvortsov-pwa.size_delete', Controller\DeleteLogoController::class)
        ->post('/pwa/logo/{size}', 'askvortsov-pwa.size_upload', Controller\UploadLogoController::class),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less')
        ->content(function (Document $document) {
            $document->head[] = "<link rel='manifest' id='manifest'>";
            $document->head[] = '<meta name="apple-mobile-web-app-capable" content="yes">';
            $document->head[] = '<meta id="apple-style" name="apple-mobile-web-app-status-bar-style" content="default">';
            $document->head[] = '<meta id="apple-title" name="apple-mobile-web-app-title" content="Forum">';

            $document->head[] = '<link id="apple-icon-48" rel="apple-touch-icon" href="/assets/pwa-icon-48x48.png">';
            $document->head[] = '<link id="apple-icon-72" rel="apple-touch-icon" sizes="72x72" href="/assets/pwa-icon-72x72.png">';
            $document->head[] = '<link id="apple-icon-96" rel="apple-touch-icon" sizes="96x96" href="/assets/pwa-icon-96x96.png">';
            $document->head[] = '<link id="apple-icon-144" rel="apple-touch-icon" sizes="144x144" href="/assets/pwa-icon-144x144.png">';
            $document->head[] = '<link id="apple-icon-192" rel="apple-touch-icon" sizes="192x192" href="/assets/pwa-icon-192x192.png">';
            $document->head[] = '<link id="apple-icon-256" rel="apple-touch-icon" sizes="256x256" href="/assets/pwa-icon-256x256.png">';
            $document->head[] = '<link id="apple-icon-512" rel="apple-touch-icon" sizes="512x512" href="/assets/pwa-icon-512x512.png">';
        }),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),
    new Extend\Locales(__DIR__ . '/resources/locale')
];
