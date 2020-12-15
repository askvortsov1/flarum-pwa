<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2020 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Api\Controller;

use Askvortsov\FlarumPWA\Api\Serializer\PWASettingsSerializer;
use Askvortsov\FlarumPWA\PWATrait;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\Foundation\Application;
use Flarum\Foundation\Paths;
use Flarum\Settings\SettingsRepositoryInterface;
use Minishlink\WebPush\VAPID;
use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\Translation\TranslatorInterface;
use Tobscure\JsonApi\Document;

class ShowPWASettingsController extends AbstractShowController
{
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
     * @var Paths
     */
    protected $paths;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings, Application $app, TranslatorInterface $translator, Paths $paths)
    {
        $this->settings = $settings;
        $this->app = $app;
        $this->translator = $translator;
        $this->paths = $paths;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $request->getAttribute('actor')->assertAdmin();

        $basePath = rtrim(parse_url($this->app->url(), PHP_URL_PATH), '/').'/' ?: '/';

        $status_messages = [];

        $logo = false;

        foreach (PWATrait::$SIZES as $size) {
            if ($size >= 196 && $this->settings->get("askvortsov-pwa.icon_${size}_path")) {
                $logo = true;
            }
        }

        if (!$this->settings->get('askvortsov-pwa.longName')) {
            $status_messages[] = [
                'type'    => 'error',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.no_name'),
            ];
        }

        if (!$logo) {
            $status_messages[] = [
                'type'    => 'error',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.no_logo'),
            ];
        }

        if ((empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') && $_SERVER['SERVER_PORT'] != 443) {
            $status_messages[] = [
                'type'    => 'warning',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.possible_https_disabled'),
            ];
        }

        if (parse_url($this->app->url(), PHP_URL_SCHEME) !== 'https') {
            $status_messages[] = [
                'type'    => 'error',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.config_no_https'),
            ];
        }

        if (!class_exists(VAPID::class) || !function_exists('gmp_init')) {
            $status_messages[] = [
                'type'    => 'error',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.push_needs_gmp_and_web_push'),
            ];
        }

        if (empty($status_messages)) {
            $status_messages[] = [
                'type'    => 'success',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.success'),
            ];
        }

        return [
            'manifest'        => $this->buildManifest(),
            'sizes'           => PWATrait::$SIZES,
            'status_messages' => $status_messages,
            'base_path'       => $basePath,
        ];
    }
}
