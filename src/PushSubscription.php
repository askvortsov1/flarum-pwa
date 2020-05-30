<?php

/*
 * This file is part of fof/drafts.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\User\User;

class PushSubscription extends AbstractModel
{
    use ScopeVisibilityTrait;

    protected $table = "push_subscriptions";

    /**
     * {@inheritdoc}
     */
    protected $dates = ['expires_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
