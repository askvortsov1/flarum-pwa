<?php

namespace Askvortsov\FlarumPWA\Listener;

use Askvortsov\FlarumPWA\Event\SetVapidKeyEvent;
use ErrorException;
use Exception;
use Flarum\Settings\SettingsRepositoryInterface;
use Minishlink\WebPush\VAPID;

class SetVapidKeyListener
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    ){}

    public function handle(SetVapidKeyEvent $event)
    {
        // Add logic to handle the event here.
        // See https://docs.flarum.org/2.x/extend/backend-events.html for more information.
        $keys = $event->keys;
        try {
            $this->settings->set('askvortsov-pwa.vapid.success', true);
            $this->settings->set('askvortsov-pwa.vapid.private', $keys['privateKey']);
            $this->settings->set('askvortsov-pwa.vapid.public', $keys['publicKey']);
        } catch (ErrorException $e) {
            $this->settings->set('askvortsov-pwa.vapid.success', false);
            $this->settings->set('askvortsov-pwa.vapid.error', $e->getMessage());

            throw new Exception($e->getMessage());
        }
    }
}
