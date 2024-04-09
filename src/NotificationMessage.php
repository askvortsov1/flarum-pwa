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
        return $this->title;
    }

    public function body(): string
    {
        return $this->body;
    }
}
