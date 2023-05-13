<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA\Api\Controller;

use Askvortsov\FlarumPWA\Api\Serializer\PWASettingsSerializer;
use Askvortsov\FlarumPWA\PWATrait;
use Askvortsov\FlarumPWA\Util;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use Psr\Http\Message\ServerRequestInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Tobscure\JsonApi\Document;

class ShowPWASettingsController extends AbstractShowController
{
    use PWATrait;

    /**
     * {@inheritdoc}
     */
    public $serializer = PWASettingsSerializer::class;

    protected SettingsRepositoryInterface $settings;

    protected TranslatorInterface $translator;

    protected UrlGenerator $url;

    public function __construct(
        SettingsRepositoryInterface $settings,
        TranslatorInterface $translator,
        UrlGenerator $url
    ) {
        $this->settings = $settings;
        $this->translator = $translator;
        $this->url = $url;
    }

    /**
     * {@inheritdoc}
     * @throws PermissionDeniedException
     */
    protected function data(ServerRequestInterface $request, Document $document): array
    {
        RequestUtil::getActor($request)->assertAdmin();

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
    }
}
