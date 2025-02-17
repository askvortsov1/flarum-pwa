<?php

namespace Askvortsov\FlarumPWA\Listener;

use Askvortsov\FlarumPWA\Event\CreateOrUpdateFirebasePushSubscriptionEvent;
use Askvortsov\FlarumPWA\FirebasePushSubscription;

class CreateOrUpdateFirebasePushSubscriptionListener
{
    protected $firebasePushSubscription;

    public function __construct(FirebasePushSubscription $firebasePushSubscription)
    {
        $this->firebasePushSubscription = $firebasePushSubscription;    
    }

    public function handle(CreateOrUpdateFirebasePushSubscriptionEvent $event)
    {
        // Add logic to handle the event here.
        // See https://docs.flarum.org/2.x/extend/backend-events.html for more information.
        $user_id = $event->user->id;
        $token = $event->token;

        $checkRecord = $this->firebasePushSubscription
            ->where('user_id', $user_id)
            ->first();

        if ( $checkRecord ) {
            $checkRecord->token = $token;
            $checkRecord->save();
        } else {
            FirebasePushSubscription::query()->create([
                'user_id' => $user_id,
                'token' => $token
            ]);
        }
    }
}
