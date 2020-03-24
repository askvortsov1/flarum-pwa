<?php

namespace Askvortsov\FlarumPWA\Api\Controller;

use Flarum\Foundation\Application;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

use Flarum\Api\Controller\ShowForumController;

class RefreshPWAController extends ShowForumController
{
    use AssertPermissionTrait;
    use PWATrait;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Application
     */
    protected $app;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings, Application $app)
    {
        $this->settings = $settings;
        $this->app = $app;
    }

    /**
     * {@inheritdoc}
     */
    public function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        foreach ($this->sizes as $size) {
            if (!$this->mount()->has('assets://'.$this->settings->get("askvortsov-pwa.icon_${size}_path"))) {
                $this->settings->set("askvortsov-pwa.icon_${size}_path", null);
            }
        }

        if ($this->mount()->has('public://webmanifest.json')) {
            $this->mount()->delete('public://webmanifest.json');
        }
        if ($this->mount()->has('public://sw.js')) {
            $this->mount()->delete('public://sw.js');
        }
        if ($this->mount()->has('public://offline.html')) {
            $this->mount()->delete('public://offline.html');
        }

        if ($this->settings->get('askvortsov-pwa.enable')) {
            $this->mount()->write('public://webmanifest.json', json_encode($this->buildManifest()));
            $this->mount()->copy('ext://sw.js', 'public://sw.js');
            $this->mount()->copy('ext://offline.html', 'public://offline.html');
        }
    }
}
