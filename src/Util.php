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

class Util
{
    public static array $ICON_SIZES = [48, 72, 96, 144, 196, 256, 512];

    public static function url_encode($data): string
    {
        if (empty($data)) {
            return '';
        }

        return rtrim(strtr($data, ['+' => '-', '/' => '_']), '=');
    }
}
