<?php

namespace Askvortsov\FlarumPWA;

use ReflectionClass;
use Flarum\Discussion\Discussion;
use Flarum\Notification\MailableInterface;
use Flarum\Post\CommentPost;
use Flarum\Post\Post;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Flarum\Http\UrlGenerator;

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

    public function supports(BlueprintInterface $blueprint): bool
    {
        $class = get_class($blueprint);

        return (new ReflectionClass($class))->implementsInterface(MailableInterface::class)
            || in_array($class, self::SUPPORTED_NON_EMAIL_BLUEPRINTS);
    }

    public function build(BlueprintInterface $blueprint): NotificationMessage
    {
        return new NotificationMessage(
            $this->getTitle($blueprint),
            $this->getBody($blueprint),
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
}
