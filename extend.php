<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2020 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA;

use Askvortsov\FlarumPWA\Api\Controller as ApiController;
use Askvortsov\FlarumPWA\Extend\InitializeVAPIDKeys;
use Askvortsov\FlarumPWA\Extend\RegisterPushNotificationPreferences;
use Askvortsov\FlarumPWA\Forum\Controller as ForumController;
use Flarum\Api\Event\Serializing;
use Flarum\Extend;
use Flarum\Frontend\Document;
use Flarum\Notification\Event\Sending;
use Flarum\User\User;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

$metaClosure = function (Document $document) {
    $forumApiDocument = $document->getForumApiDocument();
    $forumName = Arr::get($forumApiDocument, 'data.attributes.title');
    $basePath = rtrim(Arr::get($forumApiDocument, 'data.attributes.basePath'), '/');

    $document->head[] = "<link rel='manifest' href='$basePath/webmanifest'>";
    $document->head[] = "<meta name='apple-mobile-web-app-capable' content='yes'>";
    $document->head[] = "<meta id='apple-style' name='apple-mobile-web-app-status-bar-style' content='default'>";
    $document->head[] = "<meta id='apple-title' name='apple-mobile-web-app-title' content='$forumName'>";

    $document->head[] = "<link id='apple-icon-48' rel='apple-touch-icon' href='$basePath/assets/pwa-icon-48x48.png'>";
    $document->head[] = "<link id='apple-icon-72' rel='apple-touch-icon' sizes='72x72' href='$basePath/assets/pwa-icon-72x72.png'>";
    $document->head[] = "<link id='apple-icon-96' rel='apple-touch-icon' sizes='96x96' href='$basePath/assets/pwa-icon-96x96.png'>";
    $document->head[] = "<link id='apple-icon-144' rel='apple-touch-icon' sizes='144x144' href='$basePath/assets/pwa-icon-144x144.png'>";
    $document->head[] = "<link id='apple-icon-192' rel='apple-touch-icon' sizes='192x192' href='$basePath/assets/pwa-icon-192x192.png'>";
    $document->head[] = "<link id='apple-icon-256' rel='apple-touch-icon' sizes='256x256' href='$basePath/assets/pwa-icon-256x256.png'>";
    $document->head[] = "<link id='apple-icon-512' rel='apple-touch-icon' sizes='512x512' href='$basePath/assets/pwa-icon-512x512.png'>";
};

return [
    (new Extend\Routes('api'))
        ->get('/pwa/settings', 'askvortsov-pwa.settings', ApiController\ShowPWASettingsController::class)
        ->delete('/pwa/logo/{size}', 'askvortsov-pwa.size_delete', ApiController\DeleteLogoController::class)
        ->post('/pwa/logo/{size}', 'askvortsov-pwa.size_upload', ApiController\UploadLogoController::class)
        ->post('/pwa/push', 'askvortsov-pwa.push.create', ApiController\AddPushSubscriptionController::class),

    (new Extend\Routes('forum'))
        ->get('/webmanifest', 'askvortsov-pwa.webmanifest', ForumController\WebManifestController::class)
        ->get('/sw', 'askvortsov-pwa.sw', ForumController\ServiceWorkerController::class)
        ->get('/offline', 'askvortsov-pwa.offline', ForumController\OfflineController::class),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less')
        ->content($metaClosure),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less')
        ->content($metaClosure),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Model(User::class))
        ->relationship('pushSubscriptions', function ($model) {
            return $model->hasMany(PushSubscription::class, 'user_id');
        }),

    (new Extend\Event())->listen(Serializing::class, Listener\AddApiAttributes::class),

    function (Dispatcher $events) {
        $events->listen(Sending::class, Listener\SendPushNotifications::class);
    },

    new RegisterPushNotificationPreferences(),
    new InitializeVAPIDKeys(),
];
