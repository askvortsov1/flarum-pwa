<?php

namespace Askvortsov\FlarumPWA;

use Flarum\Foundation\AbstractServiceProvider;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Filesystem\FilesystemAdapter;
use Kreait\Firebase\Contract\Messaging as FirebaseMessagingContract;
use Kreait\Firebase\Factory as FirebaseFactory;

class FlarumPWAServiceProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->bind(FirebaseMessagingContract::class, function ($container) {
            /** @var FilesystemAdapter $filesystem */
            $filesystem = $container[Factory::class]->disk('flarum-pwa-storage');
            $settings = $container[SettingsRepositoryInterface::class];

            $path = $filesystem->path($settings->get('askvortsov-pwa.firebaseConfigPath'));

            return (new FirebaseFactory)
                ->withServiceAccount($path)
                ->createMessaging();
        });
    }
}
