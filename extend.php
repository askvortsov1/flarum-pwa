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
use Askvortsov\FlarumPWA\Forum\Controller as ForumController;
use Flarum\Extend;
use Flarum\Frontend\Document;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Support\Arr;

$metaClosure = function (Document $document) {
    $forumApiDocument = $document->getForumApiDocument();
    $forumName = Arr::get($forumApiDocument, 'data.attributes.title');
    $basePath = rtrim(Arr::get($forumApiDocument, 'data.attributes.basePath'), '/');

    $document->head[] = "<link rel='manifest' href='$basePath/webmanifest'>";
    $document->head[] = "<meta name='apple-mobile-web-app-capable' content='yes'>";
    $document->head[] = "<meta id='apple-style' name='apple-mobile-web-app-status-bar-style' content='default'>";
    $document->head[] = "<meta id='apple-title' name='apple-mobile-web-app-title' content='$forumName'>";

    $settings = app(SettingsRepositoryInterface::class);

    foreach (PWATrait::$SIZES as $size) {
        if (($sizePath = $settings->get('askvortsov-pwa.icon_'.strval($size).'_path'))) {
            $document->head[] = "<link id='apple-icon-$size' rel='apple-touch-icon' ".($size === 48 ? '' : "sizes='${size}x$size'")." href='$basePath/assets/$sizePath'>";
        }
    }
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

    (new Extend\Settings())
        ->serializeToForum('vapidPublicKey', 'askvortsov-pwa.vapid.public', function ($val) {
            return Util::url_encode($val);
        }),

    (new Extend\Notification())
        ->driver('push', PushNotificationDriver::class),

    new InitializeVAPIDKeys(),
];
