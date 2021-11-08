import { extend } from 'flarum/common/extend';
import extractText from 'flarum/common/utils/extractText';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import PostControls from 'flarum/forum/utils/PostControls';
import UserControls from 'flarum/forum/utils/UserControls';
import Button from 'flarum/common/components/Button';

async function shareContent(data) {
  try {
    const title = extractText(data.title);
    await navigator.share({ title, url: data.url });
    resultPara.textContent = 'MDN shared successfully';
  } catch (err) {
    console.log('Error: ' + err);
  }
}

export default () => {
  extend(DiscussionControls, 'userControls', function (items, discussion) {
    if (!navigator.share) return;

    items.add(
      'share',
      Button.component(
        {
          icon: 'fas fa-share-square',
          onclick: () =>
            shareContent({
              title: discussion.title(),
              url: window.location.protocol + '//' + window.location.hostname + app.route.discussion(discussion),
            }),
        },
        app.translator.trans('askvortsov-pwa.forum.discussion_controls.share_button')
      ),
      -1
    );
  });

  extend(PostControls, 'userControls', function (items, post) {
    if (!navigator.share) return;

    items.add(
      'share',
      Button.component(
        {
          icon: 'fas fa-share-square',
          onclick: () =>
            shareContent({
              title: app.translator.trans('askvortsov-pwa.forum.post_controls.share_api.title', {
                username: post.user().displayName(),
                title: post.discussion().title(),
              }),
              url: window.location.protocol + '//' + window.location.hostname + app.route.post(post),
            }),
        },
        app.translator.trans('askvortsov-pwa.forum.post_controls.share_button')
      ),
      100
    );
  });

  extend(UserControls, 'userControls', function (items, user) {
    if (!navigator.share) return;

    items.add(
      'share',
      Button.component(
        {
          icon: 'fas fa-share-square',
          onclick: () =>
            shareContent({
              title: user.displayName(),
              url: window.location.protocol + '//' + window.location.hostname + app.route.user(user),
            }),
        },
        app.translator.trans('askvortsov-pwa.forum.user_controls.share_button')
      ),
      100
    );
  });
};
