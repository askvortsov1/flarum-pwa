<?php

use Flarum\Database\Migration;

return Migration::addColumns('push_subscriptions', ['last_used' => ['dateTime', 'nullable' => true]]);
