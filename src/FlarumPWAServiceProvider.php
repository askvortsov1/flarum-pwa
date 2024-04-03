<?php

namespace Askvortsov\FlarumPWA;

use Flarum\Foundation\AbstractServiceProvider;
use Flarum\Settings\SettingsRepositoryInterface;
use Kreait\Firebase\Contract\Messaging as FirebaseMessagingContract;
use Kreait\Firebase\Factory as FirebaseFactory;

class FlarumPWAServiceProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->bind(FirebaseMessagingContract::class, function ($container) {
            $settings = $container[SettingsRepositoryInterface::class];

            return (new FirebaseFactory)
                ->withServiceAccount(json_decode($settings->get('askvortsov-pwa.firebaseConfig'), true))
                ->createMessaging();
        });
    }
}
