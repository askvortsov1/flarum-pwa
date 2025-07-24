<?php

/*
 * This file is part of askvortsov/flarum-pwa
 *
 *  Copyright (c) 2021 Alexander Skvortsov.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Askvortsov\FlarumPWA;

class NotificationMessage
{
    public function __construct(protected string $title, protected string $body, protected ?string $url = null)
    {
    }

    public function title(): string
    {
        return $this->excerpt($this->title, $max = 30);
    }

    public function body(): string
    {
        return $this->excerpt($this->body, $max = 200);
    }

    private function excerpt(string $text, int $max): string
    {
        $text = strip_tags($text);

        if (mb_strlen($text) > $max) {
            $text = mb_substr($text, 0, $max);

            $text .= '...';
        }

        return $text;
    }

    public function url(): ?string
    {
        return $this->url;
    }
}
