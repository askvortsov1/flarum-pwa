<?php

namespace Askvortsov\FlarumPWA\Api\Resource;

use Askvortsov\FlarumPWA\Event\CreatePushSubscriptionEvent;
use Askvortsov\FlarumPWA\Event\UserSubscriptionCounterEvent;
use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Askvortsov\FlarumPWA\PushSubscription;
use Carbon\Carbon;
use Flarum\Api\Resource\AbstractDatabaseResource;
use Flarum\Http\Exception\InvalidParameterException;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Laminas\Diactoros\Response\JsonResponse;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<PushSubscription>
 */
class PushSubscriptionResource extends AbstractDatabaseResource
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    ){}

    public function type(): string
    {
        return 'pwa/push';
    }

    public function model(): string
    {
        return PushSubscription::class;
    }

    public function scope(Builder $query, OriginalContext $context): void
    {
        /** @phpstan-ignore-next-line */
        $query->whereVisibleTo($context->getActor());
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Endpoint::make('askvortsov-pwa.push.create')
                ->route('POST', '/')
                ->action(function (Context $context){
                    $actor = $context->getActor();
                    $request = $context->request;
                    $actor->assertRegistered();

                    $data = Arr::get($request->getParsedBody(), 'subscription', []);
                    
                    if (! ($endpoint = Arr::get($data, 'endpoint'))) {
                        throw new InvalidParameterException('Endpoint must be provided');
                    }

                    $existing = $this->query($context)->where('endpoint', $endpoint)->first();
                    
                    if ($existing) {
                        return ["results" => $existing];
                    }
                    
                    $this->events->dispatch(
                        new UserSubscriptionCounterEvent($actor)
                    );

                    $host = parse_url($endpoint, PHP_URL_HOST);
                    $allowed = Str::endsWith($host, static::$push_host_allowlist);

                    if (! $allowed) {
                        throw new PermissionDeniedException();
                    }
                    
                    $this->events->dispatch(
                        new CreatePushSubscriptionEvent(
                            $actor,
                            $endpoint,
                            isset($data['expirationTime']) ? Carbon::parse($data['expirationTime']) : null,
                            $this->settings->get('askvortsov-pwa.vapid.public'),
                            isset($data['keys']) ? json_encode($data['keys']) : null
                        )
                    );

                    $subscription = [];
                    if ( $context->model ) {
                        $subscription = $context->model->where('user_id', $actor->id)->orderBy('id', 'desc')->first();
                    }
                    

                    return ["results" => $subscription];
                })
                ->response(fn (Context $context, array $results) => new JsonResponse($results["results"]))
        ];
    }

    public function fields(): array
    {
        return [

            /**
             * @todo migrate logic from old serializer and controllers to this API Resource.
             * @see https://docs.flarum.org/2.x/extend/api#api-resources
             */

            // Example:
            Schema\Str::make('endpoint')
                ->requiredOnCreate()
                ->writable(),
            Schema\Str::make('validPublicKey')
                ->requiredOnCreate()
                ->writable(),
            Schema\DateTime::make('expiresAt')
                ->writable(),


            Schema\Relationship\ToOne::make('user')
                ->includable()
                // ->inverse('?') // the inverse relationship name if any.
                ->type('users'), // the serialized type of this relation (type of the relation model's API resource).
        ];
    }

    public function sorts(): array
    {
        return [
            // SortColumn::make('createdAt'),
        ];
    }

    /**
     * Taken from https://github.com/pushpad/known-push-services/blob/master/whitelist.
     *
     * @var string[]
     */
    public static array $push_host_allowlist = [
        'android.googleapis.com',
        'fcm.googleapis.com',
        'updates.push.services.mozilla.com',
        'updates-autopush.stage.mozaws.net',
        'updates-autopush.dev.mozaws.net',
        'notify.windows.com',
        'push.apple.com',
    ];
}
