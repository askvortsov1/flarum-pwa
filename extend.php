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
        }),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),
    new Extend\Locales(__DIR__ . '/resources/locale')
];
