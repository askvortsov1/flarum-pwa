<?php

namespace Askvortsov\FlarumPWA\Api\Controller;

use Askvortsov\FlarumPWA\Api\Serializer\PWASettingsSerializer;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\Foundation\Application;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\Translation\TranslatorInterface;
use Tobscure\JsonApi\Document;

class ShowPWASettingsController extends AbstractShowController
{
    use AssertPermissionTrait;
    use PWATrait;

    /**
     * {@inheritdoc}
     */
    public $serializer = PWASettingsSerializer::class;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Application
     */
    protected $app;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings, Application $app, TranslatorInterface $translator)
    {
        $this->settings = $settings;
        $this->app = $app;
        $this->translator = $translator;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $basePath = rtrim(parse_url($this->app->url(), PHP_URL_PATH), '/') . '/' ?: '/';

        $status_messages = [];

        if (!$this->settings->get('askvortsov-pwa.enable', false)) {
            $status_messages[] = [
                'type' => 'error',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.disabled')
            ];
        } else {
            if (!$this->mount()->has('public://sw.js')) {
                $status_messages[] = [
                    'type' => 'error',
                    'message' => $this->translator->trans('askvortsov-pwa.admin.status.sw_does_not_exist')
                ];
            }

            if (!$this->mount()->has('public://webmanifest.json')) {
                $status_messages[] = [
                    'type' => 'error',
                    'message' => $this->translator->trans('askvortsov-pwa.admin.status.manifest_does_not_exist')
                ];
            }
        }

        $logo = false;

        foreach ($this->sizes as $size) {
            if ($this->settings->get("askvortsov-pwa.icon_${size}_path")) {
                $logo = true;
            }
        }

        if (!$this->settings->get('askvortsov-pwa.longName')) {
            $status_messages[] = [
                'type' => 'error',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.no_name')
            ];
        }

        if (!$logo) {
            $status_messages[] = [
                'type' => 'error',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.no_logo')
            ];
        }

        if ((empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') && $_SERVER['SERVER_PORT'] != 443) {
            $status_messages[] = [
                'type' => 'warning',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.possible_https_disabled')
            ];
        }

        if (parse_url($this->app->url(), PHP_URL_SCHEME) !== 'https') {
            $status_messages[] = [
                'type' => 'error',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.config_no_https')
            ];
        }

        if (empty($status_messages)) {
            $status_messages[] = [
                'type' => 'success',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.success')
            ];
        }

        return [
            "manifest" => $this->buildManifest(),
            "sizes" => $this->sizes,
            "status_messages" => $status_messages,
            "base_path" => $basePath,
        ];
    }
}
