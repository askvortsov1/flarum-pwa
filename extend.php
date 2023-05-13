<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA;

use Askvortsov\FlarumPWA\Api\Controller as ApiController;
use Askvortsov\FlarumPWA\Forum\Controller as ForumController;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;
use Flarum\Frontend\Document;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;

$metaClosure = function (Document $document) {
    $forumApiDocument = $document->getForumApiDocument();
    $basePath = rtrim(Arr::get($forumApiDocument, 'data.attributes.basePath'), '/');

    $settings = resolve(SettingsRepositoryInterface::class);
    $appName = $settings->get('askvortsov-pwa.shortName', $settings->get('askvortsov-pwa.longName', $settings->get('forum_title')));

    $document->head[] = "<link rel='manifest' href='$basePath/webmanifest'>";
    $document->head[] = "<meta name='apple-mobile-web-app-capable' content='yes'>";
    $document->head[] = "<meta id='apple-style' name='apple-mobile-web-app-status-bar-style' content='default'>";
    $document->head[] = "<meta id='apple-title' name='apple-mobile-web-app-title' content='$appName'>";

    /** @var Cloud $assets */
    $assets = resolve(Factory::class)->disk('flarum-assets');

    foreach (Util::$ICON_SIZES as $size) {
        if ($sizePath = $settings->get('askvortsov-pwa.icon_'.strval($size).'_path')) {
            $assetUrl = $assets->url($sizePath);
            $document->head[] = "<link id='apple-icon-$size' rel='apple-touch-icon' ".($size === 48 ? '' : "sizes='{$size}x$size'")." href='$assetUrl'>";
        }
    }
};

return [
    (new Extend\Routes('api'))
        ->get('/pwa/settings', 'askvortsov-pwa.settings', ApiController\ShowPWASettingsController::class)
        ->delete('/pwa/logo/{size}', 'askvortsov-pwa.size_delete', ApiController\DeleteLogoController::class)
        ->post('/pwa/logo/{size}', 'askvortsov-pwa.size_upload', ApiController\UploadLogoController::class)
        ->post('/pwa/push', 'askvortsov-pwa.push.create', ApiController\AddPushSubscriptionController::class)
        ->post('/reset_vapid', 'askvortsov-pwa.reset_vapid', ApiController\ResetVAPIDKeysController::class),

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

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(function ($serializer, $model, $attributes) {
            $settings = resolve(SettingsRepositoryInterface::class);
            /** @var Cloud $assets */
            $assets = resolve(Factory::class)->disk('flarum-assets');

            foreach (Util::$ICON_SIZES as $size) {
                if ($sizePath = $settings->get('askvortsov-pwa.icon_'.strval($size).'_path')) {
                    $attributes["pwa-icon-{$size}x{$size}Url"] = $assets->url($sizePath);
                }
            }

            return $attributes;
        }),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Model(User::class))
        ->hasMany('pushSubscriptions', PushSubscription::class, 'user_id'),

    (new Extend\Settings())
        ->serializeToForum('vapidPublicKey', 'askvortsov-pwa.vapid.public', [Util::class, 'url_encode'])
        ->default('askvortsov-pwa.pushNotifPreferenceDefaultToEmail', true)
        ->default('askvortsov-pwa.userMaxSubscriptions', 20),

    (new Extend\Notification())
        ->driver('push', PushNotificationDriver::class),

    (new Extend\View())
        ->namespace('askvortsov-pwa', __DIR__.'/views'),
];
