<?php

namespace Askvortsov\FlarumPWA\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use InvalidArgumentException;

class PWASettingsSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'pwa-settings';

    /**
     * {@inheritdoc}
     *
     * @param array $settings
     * @throws InvalidArgumentException
     */
    protected function getDefaultAttributes($settings)
    {
        return [
            'manifest' => $settings['manifest'],
            'sizes' => $settings['sizes'],
            'status_messages' => $settings['status_messages']
        ];
    }

    public function getId($model)
    {
        return 'global';
    }
}
