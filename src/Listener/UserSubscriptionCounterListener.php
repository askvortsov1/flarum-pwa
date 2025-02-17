<?php

namespace Askvortsov\FlarumPWA\Listener;

use Askvortsov\FlarumPWA\Event\DeleteLastSubscriptionEvent;
use Askvortsov\FlarumPWA\Event\UserSubscriptionCounterEvent;
use Askvortsov\FlarumPWA\PushSubscription;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class UserSubscriptionCounterListener
{
    public function __construct(
        protected PushSubscription $pushSubscription,
        protected SettingsRepositoryInterface $settings,
        protected Dispatcher $events
    ){}

    public function handle(UserSubscriptionCounterEvent $event)
    {
        // Add logic to handle the event here.
        // See https://docs.flarum.org/2.x/extend/backend-events.html for more information.
        $user_id = $event->user->id;

        $subscriptions = PushSubscription::query()->where('user_id', $user_id)->get();
            
        $subscriptionCount = $subscriptions->count() + 1;
        $maxSubscriptionCount = $this->settings->get('askvortsov-pwa.userMaxSubscriptions');

        $exceed = $subscriptionCount - $maxSubscriptionCount;
        if ( $exceed > 0 ) {
            $this->events->dispatch(
                new DeleteLastSubscriptionEvent($event->user, $exceed)
            );
        }
    }
}
