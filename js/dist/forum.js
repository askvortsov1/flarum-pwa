/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/idb/build/esm/index.js":
/*!*********************************************!*\
  !*** ./node_modules/idb/build/esm/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteDB: () => (/* binding */ deleteDB),
/* harmony export */   openDB: () => (/* binding */ openDB),
/* harmony export */   unwrap: () => (/* reexport safe */ _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.u),
/* harmony export */   wrap: () => (/* reexport safe */ _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)
/* harmony export */ });
/* harmony import */ var _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wrap-idb-value.js */ "./node_modules/idb/build/esm/wrap-idb-value.js");



/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, _temp) {
  let {
    blocked,
    upgrade,
    blocking,
    terminated
  } = _temp === void 0 ? {} : _temp;
  const request = indexedDB.open(name, version);
  const openPromise = (0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request);
  if (upgrade) {
    request.addEventListener('upgradeneeded', event => {
      upgrade((0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request.result), event.oldVersion, event.newVersion, (0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request.transaction));
    });
  }
  if (blocked) request.addEventListener('blocked', () => blocked());
  openPromise.then(db => {
    if (terminated) db.addEventListener('close', () => terminated());
    if (blocking) db.addEventListener('versionchange', () => blocking());
  }).catch(() => {});
  return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */
function deleteDB(name, _temp2) {
  let {
    blocked
  } = _temp2 === void 0 ? {} : _temp2;
  const request = indexedDB.deleteDatabase(name);
  if (blocked) request.addEventListener('blocked', () => blocked());
  return (0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request).then(() => undefined);
}
const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === 'string')) {
    return;
  }
  if (cachedMethods.get(prop)) return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, '');
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
  // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
  !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
    return;
  }
  const method = async function (storeName) {
    // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
    const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
    let target = tx.store;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (useIndex) target = target.index(args.shift());
    const returnVal = await target[targetFuncName](...args);
    if (isWrite) await tx.done;
    return returnVal;
  };
  cachedMethods.set(prop, method);
  return method;
}
(0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.r)(oldTraps => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));


/***/ }),

/***/ "./node_modules/idb/build/esm/wrap-idb-value.js":
/*!******************************************************!*\
  !*** ./node_modules/idb/build/esm/wrap-idb-value.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ reverseTransformCache),
/* harmony export */   i: () => (/* binding */ instanceOfAny),
/* harmony export */   r: () => (/* binding */ replaceTraps),
/* harmony export */   u: () => (/* binding */ unwrap),
/* harmony export */   w: () => (/* binding */ wrap)
/* harmony export */ });
const instanceOfAny = (object, constructors) => constructors.some(c => object instanceof c);
let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]);
}
const cursorRequestMap = new WeakMap();
const transactionDoneMap = new WeakMap();
const transactionStoreNamesMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener('success', success);
      request.removeEventListener('error', error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener('success', success);
    request.addEventListener('error', error);
  });
  promise.then(value => {
    // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
    // (see wrapFunction).
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
    // Catching to avoid "Uncaught Promise exceptions"
  }).catch(() => {});
  // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
  // is because we create many promises from a single IDBRequest.
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  // Early bail if we've already created a done promise for this transaction.
  if (transactionDoneMap.has(tx)) return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener('complete', complete);
      tx.removeEventListener('error', error);
      tx.removeEventListener('abort', error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException('AbortError', 'AbortError'));
      unlisten();
    };
    tx.addEventListener('complete', complete);
    tx.addEventListener('error', error);
    tx.addEventListener('abort', error);
  });
  // Cache it for later retrieval.
  transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      // Special handling for transaction.done.
      if (prop === 'done') return transactionDoneMap.get(target);
      // Polyfill for objectStoreNames because of Edge.
      if (prop === 'objectStoreNames') {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      // Make tx.store return the only store in the transaction, or undefined if there are many.
      if (prop === 'store') {
        return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    // Else transform whatever we get back.
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === 'done' || prop === 'store')) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  // Due to expected object equality (which is enforced by the caching in `wrap`), we
  // only create one new func per func.
  // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
  if (func === IDBDatabase.prototype.transaction && !('objectStoreNames' in IDBTransaction.prototype)) {
    return function (storeNames) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
  // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
  // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
  // with real promises, so each advance methods returns a new promise for the cursor object, or
  // undefined if the end of the cursor has been reached.
  if (getCursorAdvanceMethods().includes(func)) {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
      // the original object.
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
    // the original object.
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === 'function') return wrapFunction(value);
  // This doesn't return, it just creates a 'done' promise for the transaction,
  // which is later returned for transaction.done (see idbObjectHandler).
  if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
  // Return the same value back if we're not going to transform it.
  return value;
}
function wrap(value) {
  // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
  // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
  if (value instanceof IDBRequest) return promisifyRequest(value);
  // If we've already transformed this value before, reuse the transformed value.
  // This is faster, but it also provides object equality.
  if (transformCache.has(value)) return transformCache.get(value);
  const newValue = transformCachableValue(value);
  // Not all types are transformed.
  // These may be primitive types, so they can't be WeakMap keys.
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
const unwrap = value => reverseTransformCache.get(value);


/***/ }),

/***/ "./src/forum/addPushNotifications.js":
/*!*******************************************!*\
  !*** ./src/forum/addPushNotifications.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   refreshSubscription: () => (/* binding */ refreshSubscription)
/* harmony export */ });
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Alert */ "flarum/common/components/Alert");
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Page */ "flarum/common/components/Page");
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Icon */ "flarum/common/components/Icon");
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _use_pwa_builder__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./use-pwa-builder */ "./src/forum/use-pwa-builder.js");







const subscribeUser = save => {
  return app.sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: app.forum.attribute('vapidPublicKey')
  }).then(subscription => {
    if (!save) return;
    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/pwa/push',
      body: {
        subscription
      }
    });
  });
};
const pushEnabled = () => {
  if (!app.session.user) return false;
  const obj = app.session.user.preferences();
  let key;
  for (key in obj) {
    if ((typeof key === 'string' || key instanceof String) && key.startsWith('notify_') && key.endsWith('_push') && obj[key]) {
      return true;
    }
  }
  return false;
};
const supportsBrowserNotifications = () => 'Notification' in window;
const refreshSubscription = async sw => {
  if (!app.cache.pwaRefreshed && 'Notification' in window && window.Notification.permission === 'granted' && pushEnabled()) try {
    await subscribeUser(true);
  } catch (e) {
    if (!sw.pushManager) {
      return;
    }
    sw.pushManager.getSubscription().then(s => s.unsubscribe().then(subscribeUser.bind(undefined, true)));
  }
  app.cache.pwaRefreshed = true;
};
const pushConfigured = () => {
  return app.forum.attribute('vapidPublicKey');
};
let {
  registerFirebasePushNotificationListeners,
  removeFirebasePushNotificationListeners,
  firebasePushNotificationState,
  hasFirebasePushState
} = (0,_use_pwa_builder__WEBPACK_IMPORTED_MODULE_6__.usePWABuilder)();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_4___default().prototype), 'oncreate', () => {
    if (!pushConfigured()) return;
    const dismissAlert = () => {
      localStorage.setItem('askvortov-pwa.notif-alert.dismissed', JSON.stringify({
        timestamp: new Date().getTime()
      }));
    };
    app.alerts.dismiss(app.cache.pwaNotifsAlert);
    if (!localStorage.getItem('askvortov-pwa.notif-alert.dismissed') && 'Notification' in window && window.Notification.permission === 'default' && pushEnabled()) {
      app.cache.pwaNotifsAlert = app.alerts.show({
        controls: [m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3___default()), {
          class: "Button Button--link",
          href: app.route('settings'),
          onclick: () => dismissAlert()
        }, app.translator.trans('askvortsov-pwa.forum.alerts.optin_button'))],
        ondismiss: dismissAlert
      }, app.translator.trans('askvortsov-pwa.forum.alerts.optin'));
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)('flarum/forum/components/NotificationGrid', 'notificationMethods', function (items) {
    if (!pushConfigured()) return;
    items.add('push', {
      name: 'push',
      icon: 'fas fa-mobile',
      label: app.translator.trans('askvortsov-pwa.forum.settings.push_header')
    });
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)('flarum/forum/components/SettingsPage', 'notificationsItems', function (items) {
    if ((0,_use_pwa_builder__WEBPACK_IMPORTED_MODULE_6__.usingAppleWebview)()) return;
    if (!pushConfigured()) return;
    if (!supportsBrowserNotifications()) {
      items.add('push-no-browser-support', flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1___default().component({
        dismissible: false,
        controls: [m("a", {
          class: "Button Button--link",
          href: "https://developer.mozilla.org/en-US/docs/Web/API/Push_API"
        }, app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.no_browser_support_button'))]
      }, [m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5___default()), {
        name: "fas fa-exclamation-triangle"
      }), app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.no_browser_support')]), 10);
      return;
    }
    if (window.Notification.permission === 'default') {
      if (!pushConfigured()) return;
      items.add('push-optin-default', flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1___default().component({
        itemClassName: 'pwa-setting-alert',
        dismissible: false,
        controls: [flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default().component({
          className: 'Button Button--link',
          onclick: () => {
            window.Notification.requestPermission(res => {
              m.redraw();
              if (res === 'granted') {
                subscribeUser(true);
              }
            });
          }
        }, app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_default_button'))]
      }, [m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5___default()), {
        name: "fas fa-exclamation-circle"
      }), app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_default')]), 10);
    } else if (window.Notification.permission === 'denied') {
      items.add('push-optin-denied', flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1___default().component({
        itemClassName: 'pwa-setting-alert',
        dismissible: false,
        type: 'error',
        controls: [m("a", {
          class: "Button Button--link",
          href: "https://support.humblebundle.com/hc/en-us/articles/360008513933-Enabling-and-Disabling-Browser-Notifications-in-Various-Browsers"
        }, app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_denied_button'))]
      }, [m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5___default()), {
        name: "fas fa-exclamation-triangle"
      }), app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_denied')]), 10);
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)('flarum/forum/components/SettingsPage', 'notificationsItems', function (items) {
    if (!(0,_use_pwa_builder__WEBPACK_IMPORTED_MODULE_6__.usingAppleWebview)()) return;
    if (!hasFirebasePushState('authorized')) {
      items.add('firebase-push-optin-default', flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1___default().component({
        itemClassName: 'pwa-setting-alert',
        dismissible: false,
        controls: [flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default().component({
          className: 'Button Button--link',
          onclick: () => (0,_use_pwa_builder__WEBPACK_IMPORTED_MODULE_6__.requestPushPermissions)()
        }, app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_default_button'))]
      }, [m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5___default()), {
        name: "fas fa-exclamation-circle"
      }), app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_default')]), 10);
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)('flarum/forum/components/SettingsPage', 'oncreate', function () {
    registerFirebasePushNotificationListeners();
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)('flarum/forum/components/SettingsPage', 'onremove', function () {
    removeFirebasePushNotificationListeners();
  });
});

/***/ }),

/***/ "./src/forum/addShareButtons.js":
/*!**************************************!*\
  !*** ./src/forum/addShareButtons.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/utils/DiscussionControls */ "flarum/forum/utils/DiscussionControls");
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/utils/PostControls */ "flarum/forum/utils/PostControls");
/* harmony import */ var flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_utils_UserControls__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/utils/UserControls */ "flarum/forum/utils/UserControls");
/* harmony import */ var flarum_forum_utils_UserControls__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_UserControls__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__);






async function shareContent(data) {
  try {
    const title = flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_1___default()(data.title);
    await navigator.share({
      title,
      url: data.url
    });
    resultPara.textContent = 'MDN shared successfully';
  } catch (err) {
    console.log('Error: ' + err);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_2___default()), 'userControls', function (items, discussion) {
    if (!navigator.share) return;
    items.add('share', flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default().component({
      icon: 'fas fa-share-square',
      onclick: () => shareContent({
        title: discussion.title(),
        url: window.location.protocol + '//' + window.location.hostname + app.route.discussion(discussion)
      })
    }, app.translator.trans('askvortsov-pwa.forum.discussion_controls.share_button')), -1);
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3___default()), 'userControls', function (items, post) {
    if (!navigator.share) return;
    items.add('share', flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default().component({
      icon: 'fas fa-share-square',
      onclick: () => shareContent({
        title: app.translator.trans('askvortsov-pwa.forum.post_controls.share_api.title', {
          username: post.user().displayName(),
          title: post.discussion().title()
        }),
        url: window.location.protocol + '//' + window.location.hostname + app.route.post(post)
      })
    }, app.translator.trans('askvortsov-pwa.forum.post_controls.share_button')), 100);
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_utils_UserControls__WEBPACK_IMPORTED_MODULE_4___default()), 'userControls', function (items, user) {
    if (!navigator.share) return;
    items.add('share', flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default().component({
      icon: 'fas fa-share-square',
      onclick: () => shareContent({
        title: user.displayName(),
        url: window.location.protocol + '//' + window.location.hostname + app.route.user(user)
      })
    }, app.translator.trans('askvortsov-pwa.forum.user_controls.share_button')), 100);
  });
});

/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! idb */ "./node_modules/idb/build/esm/index.js");
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Page */ "flarum/common/components/Page");
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_components_SessionDropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/components/SessionDropdown */ "flarum/forum/components/SessionDropdown");
/* harmony import */ var flarum_forum_components_SessionDropdown__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_SessionDropdown__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _addShareButtons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./addShareButtons */ "./src/forum/addShareButtons.js");
/* harmony import */ var _addPushNotifications__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./addPushNotifications */ "./src/forum/addPushNotifications.js");







app.initializers.add('askvortsov/flarum-pwa', () => {
  const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'oninit', () => {
    const basePath = app.forum.attribute('basePath').trimRight('/');
    const registerSW = async () => {
      const dbPromise = (0,idb__WEBPACK_IMPORTED_MODULE_1__.openDB)('keyval-store', 1, {
        upgrade(db) {
          db.createObjectStore('keyval');
        }
      });
      (await dbPromise).put('keyval', app.forum.data.attributes, 'flarum.forumPayload');
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(basePath + '/sw', {
          scope: basePath + '/'
        }).then(sw => {
          navigator.serviceWorker.ready.then(() => {
            app.sw = sw;
            (0,_addPushNotifications__WEBPACK_IMPORTED_MODULE_6__.refreshSubscription)(sw);
          });
        });
      }
    };
    registerSW();
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_SessionDropdown__WEBPACK_IMPORTED_MODULE_4___default().prototype), 'items', items => {
    if (isInStandaloneMode() && items.has('administration')) {
      items.remove('administration');
      items.add('administration', flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default().component({
        icon: 'fas fa-wrench',
        href: app.forum.attribute('adminUrl'),
        target: '_self',
        external: true
      }, app.translator.trans('core.forum.header.admin_button')));
    }
  });
  (0,_addShareButtons__WEBPACK_IMPORTED_MODULE_5__["default"])();
  (0,_addPushNotifications__WEBPACK_IMPORTED_MODULE_6__["default"])();
});

/***/ }),

/***/ "./src/forum/use-pwa-builder.js":
/*!**************************************!*\
  !*** ./src/forum/use-pwa-builder.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PushPermissionRequest: () => (/* binding */ PushPermissionRequest),
/* harmony export */   PushPermissionState: () => (/* binding */ PushPermissionState),
/* harmony export */   PushToken: () => (/* binding */ PushToken),
/* harmony export */   requestPushPermissionState: () => (/* binding */ requestPushPermissionState),
/* harmony export */   requestPushPermissions: () => (/* binding */ requestPushPermissions),
/* harmony export */   requestPushToken: () => (/* binding */ requestPushToken),
/* harmony export */   usePWABuilder: () => (/* binding */ usePWABuilder),
/* harmony export */   usingAppleWebview: () => (/* binding */ usingAppleWebview)
/* harmony export */ });
/**
 * Triggered when the push token is generated by the device.
 */
const PushToken = 'push-token';

/**
 * Triggered when the user requests permission on the push event.
 */
const PushPermissionRequest = 'push-permission-request';

/**
 * Returns the state of the push request of the device.
 */
const PushPermissionState = 'push-permission-state';

/**
 * Check if the client is a webview in an iOS or iPadOS device.
 * @returns {boolean}
 */
const usingAppleWebview = () => window.webkit && window.webkit.messageHandlers;
const requestPushPermissionState = () => window.webkit.messageHandlers[PushPermissionState].postMessage(PushPermissionState);
const requestPushPermissions = () => window.webkit.messageHandlers[PushPermissionRequest].postMessage(PushPermissionRequest);
const requestPushToken = () => window.webkit.messageHandlers[PushToken].postMessage(PushToken);
const usePWABuilder = () => {
  /**
   * @type {'notDetermined' | 'denied' | 'authorized' | 'ephemeral' | 'provisional' | 'unknown' | 'granted'}
   */
  let permissionState = 'granted';
  const handlePushPermissionRequest = event => {
    if (event.detail !== 'granted') {
      return;
    }
    permissionState = 'granted';
    requestPushToken();
  };
  const handlePushToken = event => {
    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/pwa/firebase-push-subscriptions',
      body: {
        token: event.detail
      }
    });
  };
  const handlePushPermissionState = event => {
    permissionState = event.detail;
    m.redraw();
  };

  /**
   * @param {'notDetermined' | 'denied' | 'authorized' | 'ephemeral' | 'provisional' | 'unknown' | 'granted'} state
   *
   * @returns {boolean}
   */
  const hasFirebasePushState = state => state === permissionState;
  function registerFirebasePushNotificationListeners() {
    if (!usingAppleWebview()) {
      return;
    }
    requestPushPermissionState();
    window.addEventListener(PushPermissionRequest, handlePushPermissionRequest);
    window.addEventListener(PushPermissionState, handlePushPermissionState);
    window.addEventListener(PushToken, handlePushToken);
  }
  function removeFirebasePushNotificationListeners() {
    if (!usingAppleWebview()) {
      return;
    }
    window.removeEventListener(PushPermissionRequest, handlePushPermissionRequest);
    window.removeEventListener(PushPermissionState, handlePushPermissionState);
    window.removeEventListener(PushToken, handlePushToken);
  }
  return {
    hasFirebasePushState,
    registerFirebasePushNotificationListeners,
    removeFirebasePushNotificationListeners
  };
};

/***/ }),

/***/ "flarum/common/components/Alert":
/*!********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Alert')" ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Alert');

/***/ }),

/***/ "flarum/common/components/Button":
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Button')" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Button');

/***/ }),

/***/ "flarum/common/components/Icon":
/*!*******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Icon')" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Icon');

/***/ }),

/***/ "flarum/common/components/Link":
/*!*******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Link')" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Link');

/***/ }),

/***/ "flarum/common/components/LinkButton":
/*!*************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/LinkButton')" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/LinkButton');

/***/ }),

/***/ "flarum/common/components/Page":
/*!*******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Page')" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Page');

/***/ }),

/***/ "flarum/common/extend":
/*!**********************************************************!*\
  !*** external "flarum.reg.get('core', 'common/extend')" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/extend');

/***/ }),

/***/ "flarum/common/utils/extractText":
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/utils/extractText')" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/utils/extractText');

/***/ }),

/***/ "flarum/forum/components/SessionDropdown":
/*!*****************************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/SessionDropdown')" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/SessionDropdown');

/***/ }),

/***/ "flarum/forum/utils/DiscussionControls":
/*!***************************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/utils/DiscussionControls')" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'forum/utils/DiscussionControls');

/***/ }),

/***/ "flarum/forum/utils/PostControls":
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/utils/PostControls')" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'forum/utils/PostControls');

/***/ }),

/***/ "flarum/forum/utils/UserControls":
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/utils/UserControls')" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'forum/utils/UserControls');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		flarum.reg._webpack_runtimes["askvortsov-pwa"] ||= __webpack_require__;// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map