<?php

namespace Askvortsov\FlarumPWA\Api\Resource;

use Askvortsov\FlarumPWA\Event\SetVapidKeyEvent;
use Askvortsov\FlarumPWA\PushSubscription;
use Askvortsov\FlarumPWA\PWATrait;
use Askvortsov\FlarumPWA\Util;
use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource\AbstractResource;
use Flarum\Http\Exception\RouteNotFoundException;
use Flarum\Http\UrlGenerator;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Contracts\Filesystem\Filesystem;
use Flarum\Locale\TranslatorInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Laminas\Diactoros\Response\JsonResponse;
use Minishlink\WebPush\VAPID;

class PWASettingsResource extends AbstractResource
{
    use PWATrait;
    protected Filesystem $uploadDir;

    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected TranslatorInterface $translator,
        protected UrlGenerator $url,
        protected Factory $filesystemFactory
    ){
        $this->uploadDir = $filesystemFactory->disk('flarum-assets');
    }

    public function type(): string
    {
        return 'pwa-settings';
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Endpoint::make('askvortsov-pwa.settings')
                ->route('GET', '/')
                ->action(function (){
                    $status_messages = [];

                    $logo = false;
                    
                    foreach (Util::$ICON_SIZES as $size) {
                        if ($size >= 144 && $this->settings->get("askvortsov-pwa.icon_{$size}_path")) {
                            $logo = true;
                        }
                    }

                    if (! isset($this->buildManifest()['name'])) {
                        $status_messages[] = [
                            'type' => 'error',
                            'message' => $this->translator->trans('askvortsov-pwa.admin.status.no_name'),
                        ];
                    }

                    if (! $logo) {
                        $status_messages[] = [
                            'type' => 'error',
                            'message' => $this->translator->trans('askvortsov-pwa.admin.status.no_logo'),
                        ];
                    }

                    if ((empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') && $_SERVER['SERVER_PORT'] != 443) {
                        $status_messages[] = [
                            'type' => 'warning',
                            'message' => $this->translator->trans('askvortsov-pwa.admin.status.possible_https_disabled'),
                        ];
                    }

                    if (parse_url($this->url->to('forum')->base(), PHP_URL_SCHEME) !== 'https') {
                        $status_messages[] = [
                            'type' => 'error',
                            'message' => $this->translator->trans('askvortsov-pwa.admin.status.config_no_https'),
                        ];
                    }

                    if (! function_exists('gmp_init')) {
                        $status_messages[] = [
                            'type' => 'warning',
                            'message' => $this->translator->trans('askvortsov-pwa.admin.status.suggest_gmp'),
                        ];
                    }

                    if (! $this->settings->get('askvortsov-pwa.vapid.private') || ! $this->settings->get('askvortsov-pwa.vapid.public')) {
                        $status_messages[] = [
                            'type' => 'error',
                            'message' => $this->translator->trans('askvortsov-pwa.admin.status.no_vapid_keys'),
                        ];
                    }

                    if (! $this->settings->get('askvortsov-pwa.vapid.success', true)) {
                        $status_messages[] = [
                            'type' => 'error',
                            'message' => $this->translator->trans(
                                'askvortsov-pwa.admin.status.key_gen_failed',
                                ['error' => $this->settings->get('askvortsov-pwa.vapid.error', '')]
                            ),
                        ];
                    }

                    if (empty($status_messages)) {
                        $status_messages[] = [
                            'type' => 'success',
                            'message' => $this->translator->trans('askvortsov-pwa.admin.status.success'),
                        ];
                    }

                    return [
                        'manifest' => $this->buildManifest(),
                        'sizes' => Util::$ICON_SIZES,
                        'status_messages' => $status_messages,
                    ];
                })
                ->response(function(Context $context, array $results){
                    return new JsonResponse([
                        'data' => [
                            'attributes' => $results,
                            'id' => 'global',
                            'type' => 'pwa-settings'
                        ]
                    ]);
                }),
            Endpoint\Endpoint::make('askvortsov-pwa.size_delete')
                ->route('DELETE', '/logo/{size}')
                ->action(function (Context $context){
                    $size = Arr::get($context->request->getQueryParams(), 'size');
                    $request = $context->request;
                    $context->getActor()->assertAdmin();

                    $size = Arr::get($request->getQueryParams(), 'size');

                    if (! in_array($size, Util::$ICON_SIZES)) {
                        throw new RouteNotFoundException();
                    }

                    $pathKey = "askvortsov-pwa.icon_{$size}_path";
                    $path = $this->settings->get($pathKey);

                    $this->uploadDir->delete($path);

                    $this->settings->set($pathKey, null);
                })
                ->response(fn () => new EmptyResponse(204)),
            Endpoint\Endpoint::make('askvortsov-pwa.reset_vapid')
                ->route('POST', '/reset_vapid')
                ->action(function(Context $context){
                    $context->getActor()->assertAdmin();
                    
                    $keys = VAPID::createVapidKeys();
                    $this->events->dispatch(new SetVapidKeyEvent($keys));

                    $query = PushSubscription::query()
                        ->where('vapid_public_key', $keys['publicKey']);
                    $count = $query->count();
                    $query->delete();

                    return ["count" => $count];
                })
                ->response(fn(Context $context, array $results) => new JsonResponse(['deleted' => $results["count"]])),
            Endpoint\Endpoint::make('askvortsov-pwa.firebase-config.store')
                ->route('POST', '/firebase-config')
                ->action(function(Context $context){
                    $request = $context->request;
                    $files = $request->getUploadedFiles();

                    /** @var \Laminas\Diactoros\UploadedFile $config */
                    $config = $files['file'];

                    $this->settings->set(
                        'askvortsov-pwa.firebaseConfig',
                        $config->getStream()->getContents(),
                    );
                })
                ->response(function(){
                    return new JsonResponse(["data" => null]);
                })
        ];
    }
}
