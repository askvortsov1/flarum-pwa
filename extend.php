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

use Askvortsov\FlarumPWA\Api\Controller\UploadLogoController;
use Askvortsov\FlarumPWA\Api\Resource\FirebasePushSubscriptionResource;
use Askvortsov\FlarumPWA\Api\Resource\PushSubscriptionResource;
use Askvortsov\FlarumPWA\Api\Resource\PWASettingsResource;
use Askvortsov\FlarumPWA\Event\CreateOrUpdateFirebasePushSubscriptionEvent;
use Askvortsov\FlarumPWA\Event\CreatePushSubscriptionEvent;
use Askvortsov\FlarumPWA\Event\DeleteLastSubscriptionEvent;
use Askvortsov\FlarumPWA\Event\SetVapidKeyEvent;
use Askvortsov\FlarumPWA\Event\UserSubscriptionCounterEvent;
use Askvortsov\FlarumPWA\Forum\Controller\OfflineController;
use Askvortsov\FlarumPWA\Forum\Controller\ServiceWorkerController;
use Askvortsov\FlarumPWA\Forum\Controller\WebManifestController;
use Askvortsov\FlarumPWA\Listener\CreateOrUpdateFirebasePushSubscriptionListener;
use Flarum\Extend;
use Flarum\Frontend\Document;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Flarum\Api\Resource\ForumResource;
use Flarum\Api\Schema;

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

function icon_attr_arr() : array {
    $settings = resolve(SettingsRepositoryInterface::class);
    $assets = resolve(Factory::class)->disk('flarum-assets');
    $icon_attr = [];
    foreach (Util::$ICON_SIZES as $size) {
        if ($sizePath = $settings->get('askvortsov-pwa.icon_'.strval($size).'_path')) {
            $icon_attr = array_merge($icon_attr, [Schema\Str::make("pwa-icon-{$size}x{$size}Url")->get( fn()=>$assets->url($sizePath) )]);
        }
    }

    return $icon_attr;
};

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less')
        ->content($metaClosure),
    
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less')
        ->content($metaClosure),

    new Extend\ApiResource(FirebasePushSubscriptionResource::class),
    new Extend\ApiResource(PushSubscriptionResource::class),
    new Extend\ApiResource(PWASettingsResource::class),

    (new Extend\Routes('api'))
        ->post('/pwa/logo/{size}', 'askvortsov-pwa.size_upload', UploadLogoController::class),
    
    (new Extend\Routes('forum'))
        ->get('/webmanifest', 'askvortsov-pwa.webmanifest', WebManifestController::class)
        ->get('/sw', 'askvortsov-pwa.sw', ServiceWorkerController::class)
        ->get('/offline', 'askvortsov-pwa.offline', OfflineController::class),

    (new Extend\ApiResource(ForumResource::class))
        ->fields(fn () => [
            ...icon_attr_arr()
        ]),

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

    (new Extend\ServiceProvider())
        ->register(FlarumPWAServiceProvider::class),
    
    (new Extend\Event())
        ->listen(CreateOrUpdateFirebasePushSubscriptionEvent::class, CreateOrUpdateFirebasePushSubscriptionListener::class)
        ->listen(UserSubscriptionCounterEvent::class, Listener\UserSubscriptionCounterListener::class)
        ->listen(DeleteLastSubscriptionEvent::class, Listener\DeleteLastSubscriptionListener::class)
        ->listen(CreatePushSubscriptionEvent::class, Listener\CreatePushSubscriptionListener::class)
        ->listen(SetVapidKeyEvent::class, Listener\SetVapidKeyListener::class),
];
