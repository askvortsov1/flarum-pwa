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

use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\MountManager;

trait PWATrait
{
    protected $mount;
    public static $SIZES = [48, 72, 96, 144, 196, 256, 512];

    protected function buildManifest()
    {
        $basePath = rtrim(parse_url($this->app->url(), PHP_URL_PATH), '/').'/' ?: '/';
        $manifest = [
            'name'        => $this->settings->get('askvortsov-pwa.longName', $this->settings->get('forum_title')),
            'short_name'  => $this->settings->get('forum_title'),
            'description' => $this->settings->get('forum_description', ''),
            //"categories" => $this->settings->get('askvortsov-pwa.categories', []),
            'start_url'        => $basePath,
            'scope'            => $basePath,
            'dir'              => 'auto',
            'theme_color'      => $this->settings->get('theme_primary_color'),
            'background_color' => $this->settings->get('askvortsov-pwa.backgroundColor', '#ffffff'),
            'display'          => 'standalone',
            'icons'            => [],
        ];

        foreach (PWATrait::$SIZES as $size) {
            if ($this->settings->get("askvortsov-pwa.icon_${size}_path")) {
                $icon = [
                    'src'   => $basePath.'assets/'.$this->settings->get("askvortsov-pwa.icon_${size}_path"),
                    'sizes' => "${size}x${size}",
                    'type'  => 'image/png',
                ];
                $manifest['icons'][] = $icon;
            }
        }

        return $manifest;
    }

    protected function mount()
    {
        if (is_null($this->mount)) {
            $this->mount = new MountManager([
                'ext'     => new Filesystem(new Local(dirname(__FILE__, 2).'/assets')),
                'storage' => new Filesystem(new Local($this->paths->storage.'/tmp')),
                'assets'  => new Filesystem(new Local($this->paths->public.'/assets')),
                'public'  => new Filesystem(new Local($this->paths->public)),
            ]);
        }

        return $this->mount;
    }
}
