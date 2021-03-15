import { extend } from 'flarum/extend';
import DiscussionControls from 'flarum/utils/DiscussionControls';
import PostControls from 'flarum/utils/PostControls';
import UserControls from 'flarum/utils/UserControls';
import Button from 'flarum/components/Button';

async function shareContent(data) {
  try {
    await navigator.share(data);
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
