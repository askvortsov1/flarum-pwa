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

use Flarum\User\User;
use Flarum\Discussion\Discussion;
use Flarum\Post\CommentPost;
use Flarum\Post\Post;
use Flarum\Notification\MailableInterface;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Symfony\Contracts\Translation\TranslatorInterface;

class FirebasePushSender
{
    private Messaging $messaging;

    protected TranslatorInterface $translator;

    public function __construct(
        Messaging $messaging,
        TranslatorInterface $translator,
    )
    {
        $this->messaging = $messaging;
        $this->translator = $translator;
    }

    /**
     * @throws \ReflectionException
     */
    public static function canSend(string $blueprintClass): bool
    {
        return (new \ReflectionClass($blueprintClass))->implementsInterface(MailableInterface::class) || in_array(
            $blueprintClass,
            static::$SUPPORTED_NON_EMAIL_BLUEPRINTS
        );
    }

    public function notify(BlueprintInterface $blueprint, array $userIds = []): void
    {
        FirebasePushSubscription::whereIn('user_id', $userIds)->each(function (FirebasePushSubscription $subscription) use ($blueprint) {
            $this->messaging->send(
                $this->newMessage($subscription, $blueprint)
            );
        });
    }

    private function newMessage(FirebasePushSubscription $subscription, BlueprintInterface $blueprint): CloudMessage
    {
        return CloudMessage::new()
            ->withTarget('token', $subscription->token)
            ->withNotification(
                Notification::fromArray([
                    'title' => $this->getTitle($blueprint),
                    'body' => $this->getBody($blueprint),
                ])
            );
    }

    private function getBody(BlueprintInterface $blueprint)
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

    protected function getTitle(BlueprintInterface $blueprint): string
    {
        if ($blueprint instanceof MailableInterface) {
            return $blueprint->getEmailSubject($this->translator);
        } elseif (in_array(get_class($blueprint), static::$SUPPORTED_NON_EMAIL_BLUEPRINTS)) {
            if ($blueprint->getType() == 'postLiked') {
                return $this->translator->trans(
                    'flarum-likes.forum.notifications.post_liked_text',
                    ['username' => $blueprint->getFromUser()->getDisplayNameAttribute()]
                );
            }
        }

        return '';
    }

    public static array $SUPPORTED_NON_EMAIL_BLUEPRINTS = [
        "Flarum\Likes\Notification\PostLikedBlueprint",
        "Flarum\Notification\DiscussionRenamedBlueprint",
    ];
}
