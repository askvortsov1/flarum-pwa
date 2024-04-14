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

use Flarum\Discussion\Discussion;
use Flarum\Http\UrlGenerator;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Notification\MailableInterface;
use Flarum\Post\CommentPost;
use Flarum\Post\Post;
use Flarum\User\User;
use ReflectionClass;
use Symfony\Contracts\Translation\TranslatorInterface;

class NotificationBuilder
{
    protected TranslatorInterface $translator;

    protected UrlGenerator $url;

    const SUPPORTED_NON_EMAIL_BLUEPRINTS = [
        "Flarum\Likes\Notification\PostLikedBlueprint",
        "Flarum\Notification\DiscussionRenamedBlueprint",
    ];

    public function __construct(
        TranslatorInterface $translator,
        UrlGenerator $url
    ) {
        $this->translator = $translator;
        $this->url = $url;
    }

    public function supports(string $blueprintClass): bool
    {
        return (new ReflectionClass($blueprintClass))->implementsInterface(MailableInterface::class)
            || in_array($blueprintClass, self::SUPPORTED_NON_EMAIL_BLUEPRINTS);
    }

    public function build(BlueprintInterface $blueprint): NotificationMessage
    {
        return new NotificationMessage(
            $this->getTitle($blueprint),
            $this->getBody($blueprint),
            $this->getUrl($blueprint),
        );
    }

    protected function getTitle(BlueprintInterface $blueprint): string
    {
        if ($blueprint instanceof MailableInterface) {
            return $blueprint->getEmailSubject($this->translator);
        } elseif (in_array(get_class($blueprint), self::SUPPORTED_NON_EMAIL_BLUEPRINTS)) {
            if ($blueprint->getType() == 'postLiked') {
                return $this->translator->trans(
                    'flarum-likes.forum.notifications.post_liked_text',
                    ['username' => $blueprint->getFromUser()->getDisplayNameAttribute()]
                );
            }
        }

        return '';
    }

    protected function getBody(BlueprintInterface $blueprint)
    {
        $content = '';

        $subject = $blueprint->getSubject();

        switch ($blueprint::getSubjectModel()) {
            case Discussion::class:
                /** @var Discussion $subject */
                $content = $this->getRelevantPostContent($subject);
                break;
            case Post::class:
                /** @var Post $subject */
                if ($subject instanceof CommentPost) {
                    $content = $subject->formatContent();
                }
                break;
        }

        return $content;
    }

    protected function getRelevantPostContent($discussion): string
    {
        $relevantPost = $discussion->mostRelevantPost ?: $discussion->firstPost ?: $discussion->comments->first();

        if ($relevantPost === null) {
            return '';
        }

        return $relevantPost->formatContent();
    }

    protected function getUrl(BlueprintInterface $blueprint): string
    {
        $link = $this->url->to('forum')->base();

        $subject = $blueprint->getSubject();

        switch ($blueprint::getSubjectModel()) {
            case User::class:
                /** @var User $subject */
                return $this->url->to('forum')->route('user', ['username' => $subject->display_name]);

            case Discussion::class:
                /** @var Discussion $subject */
                return $this->url->to('forum')->route('discussion', ['id' => $subject->id]);

            case Post::class:
                /** @var Post $subject */
                return $this->url->to('forum')->route(
                    'discussion',
                    ['id' => $subject->discussion_id, 'near' => $subject->number]
                );

            default:
                return $this->url->to('forum')->base();
        }
    }
}
