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

        $status_messages = [];

        if (! $this->settings->get('askvortsov-pwa.enable', false)) {
            $status_messages[] = [
                'type' => 'error',
                'message' => $this->translator->trans('askvortsov-pwa.admin.status.disabled')
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
            "status_messages" => $status_messages
        ];
    }
}
