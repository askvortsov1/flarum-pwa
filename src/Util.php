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

class Util
{
    public static function url_encode($data)
    {
        return rtrim(strtr($data, ['+' => '-', '/' => '_']), '=');
    }
}
