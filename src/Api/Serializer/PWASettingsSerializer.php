<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2020 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

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
     *
     * @throws InvalidArgumentException
     */
    protected function getDefaultAttributes($settings)
    {
        return [
            'manifest'        => $settings['manifest'],
            'sizes'           => $settings['sizes'],
            'status_messages' => $settings['status_messages'],
            'base_path'       => $settings['base_path'],
        ];
    }

    public function getId($model)
    {
        return 'global';
    }
}
