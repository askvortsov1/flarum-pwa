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
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;

trait PWATrait
{
    /**
     * @return string
     */
    protected function getBasePath(): string
    {
        /** @var UrlGenerator $url */
        $url = resolve(UrlGenerator::class);

        return rtrim(parse_url($url->to('forum')->base(), PHP_URL_PATH) ?? '/', '/').'/';
    }

    /**
     * @return array<array{'src': string, 'sizes': string, 'type': string}>
     */
    protected function getIcons(): array
    {
        /** @var Cloud $assetsFilesystem */
        $assetsFilesystem = resolve(Factory::class)->disk('flarum-assets');
        /** @var SettingsRepositoryInterface $settings */
        $settings = resolve(SettingsRepositoryInterface::class);

        $icons = [];
        foreach (Util::$ICON_SIZES as $size) {
            if ($path = $settings->get("askvortsov-pwa.icon_{$size}_path")) {
                $icons[] = [
                    'src' => $assetsFilesystem->url($path),
                    'sizes' => "{$size}x{$size}",
                    'type' => 'image/png',
                ];
            }
        }

        return $icons;
    }

    protected function buildManifest(): array
    {
        /** @var SettingsRepositoryInterface $settings */
        $settings = resolve(SettingsRepositoryInterface::class);

        $basePath = $this->getBasePath();
        $manifest = [
            'name' => $settings->get('askvortsov-pwa.longName') ?: $settings->get('forum_title'),
            'description' => $settings->get('forum_description', ''),
            //"categories" => $settings->get('askvortsov-pwa.categories', []),
            'start_url' => $basePath,
            'scope' => $basePath,
            'dir' => 'auto',
            'theme_color' => $settings->get('askvortsov-pwa.themeColor') ?: $settings->get('theme_primary_color'),
            'display' => 'standalone',
            'icons' => $this->getIcons(),
        ];

        if ($backgroundColor = $settings->get('askvortsov-pwa.backgroundColor')) {
            $manifest['background_color'] = $backgroundColor;
        }

        if ($settings->get('askvortsov-pwa.forcePortrait')) {
            $manifest['orientation'] = 'portrait';
        }

        $shortName = $settings->get('askvortsov-pwa.shortName');
        if ($shortName) {
            $manifest['short_name'] = $shortName;
        }

        return $manifest;
    }
}
