<?php

namespace Askvortsov\FlarumPWA;

class NotificationMessage
{
    protected string $title;

    protected string $body;

    protected ?string $url = null;

    public function __construct(
        string $title,
        string $body,
        ?string $url = null,
    ) {
        $this->title = $title;
        $this->body = $body;
        $this->url = $url;
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
