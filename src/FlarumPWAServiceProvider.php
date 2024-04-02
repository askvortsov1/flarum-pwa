<?php

namespace Askvortsov\FlarumPWA;

use Flarum\Foundation\AbstractServiceProvider;
use Kreait\Firebase\Contract\Messaging as FirebaseMessagingContract;
use Kreait\Firebase\Factory as FirebaseFactory;

class FlarumPWAServiceProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->bind(FirebaseMessagingContract::class, function ($container) {
            return (new FirebaseFactory)->createMessaging();
        });
    }
}
