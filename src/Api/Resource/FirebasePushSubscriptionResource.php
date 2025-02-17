<?php

namespace Askvortsov\FlarumPWA\Api\Resource;

use Askvortsov\FlarumPWA\Event\CreateOrUpdateFirebasePushSubscriptionEvent;
use Askvortsov\FlarumPWA\FirebasePushSubscription;
use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource\AbstractDatabaseResource;
use Flarum\Api\Schema;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Tobyz\JsonApiServer\Context as OriginalContext;

class FirebasePushSubscriptionResource extends AbstractDatabaseResource
{
    public function type(): string
    {
        return 'pwa/firebase-push-subscriptions';
    }

    public function model(): string
    {
        return FirebasePushSubscription::class;
    }

    public function scope(Builder $query, OriginalContext $context): void
    {
        /** @phpstan-ignore-next-line */
        $query->whereVisibleTo($context->getActor());
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Endpoint::make('askvortsov-pwa.firebase-subscriptions.create')
                ->route('POST', '/')
                ->action(function (Context $context){
                    $actor = $context->getActor();
                    $actor->assertRegistered();
                    $token = Arr::get($context->request->getParsedBody(), 'token', []);

                    $this->events->dispatch(
                        new CreateOrUpdateFirebasePushSubscriptionEvent($actor, $token)
                    );
                })
        ];
    }

    public function fields(): array
    {
        return [

            /**
             * @see https://docs.flarum.org/2.x/extend/api#api-resources
             */

            // Example:
            Schema\Str::make('token')
                ->requiredOnCreate()
                ->writable(),

            Schema\Relationship\ToOne::make('user')
                ->includable()
                ->type('users')
        ];
    }

    public function sorts(): array
    {
        return [];
    }
}
