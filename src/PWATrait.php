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

use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;

trait PWATrait
{
    public static $SIZES = [48, 72, 96, 144, 196, 256, 512];

    protected function buildManifest(): array
    {
        /** @var SettingsRepositoryInterface $settings */
        $settings = resolve(SettingsRepositoryInterface::class);

        /** @var UrlGenerator $url */
        $url = resolve(UrlGenerator::class);

        $basePath = rtrim(parse_url($url->to('forum')->base(), PHP_URL_PATH), '/').'/' ?: '/';
        $manifest = [
            'name'        => $settings->get('askvortsov-pwa.longName') ?: $settings->get('forum_title'),
            'description' => $settings->get('forum_description', ''),
            //"categories" => $settings->get('askvortsov-pwa.categories', []),
            'start_url'        => $basePath,
            'scope'            => $basePath,
            'dir'              => 'auto',
            'theme_color'      => $settings->get('askvortsov-pwa.themeColor') ?: $settings->get('theme_primary_color'),
            'display'          => 'standalone',
            'icons'            => [],
        ];

        $backgroundColor = $settings->get('askvortsov-pwa.backgroundColor');
        if($backgroundColor){
            $manifest['background_color'] = $backgroundColor;
        }

        if ($settings->get('askvortsov-pwa.forcePortrait')) {
            $manifest['orientation'] = 'portrait';
        }

        $shortName = $settings->get('askvortsov-pwa.shortName');
        if ($shortName) {
            $manifest['short_name'] = $shortName;
        }

        foreach (PWATrait::$SIZES as $size) {
            if ($settings->get("askvortsov-pwa.icon_${size}_path")) {
                $icon = [
                    'src'   => $basePath.'assets/'.$settings->get("askvortsov-pwa.icon_${size}_path"),
                    'sizes' => "${size}x${size}",
                    'type'  => 'image/png',
                ];
                $manifest['icons'][] = $icon;
            }
        }

        return $manifest;
    }
}
