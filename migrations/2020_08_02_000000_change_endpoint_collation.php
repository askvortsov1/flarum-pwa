<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2020 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('push_subscriptions', function (Blueprint $table) {
            $table->string('endpoint')->collation('utf8mb4_bin')->change();
        });
    },
    'down' => function (Builder $schema) {
    },
];
