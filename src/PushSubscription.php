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

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property string $endpoint
 * @property string $vapid_public_key
 * @property string $keys
 * @property Carbon $expires_at
 * @property Carbon $last_used
 *
 * @property User|null $user
 */
class PushSubscription extends AbstractModel
{
    use ScopeVisibilityTrait;

    protected $table = 'push_subscriptions';

    protected $casts = ['expires_at' => 'datetime'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
