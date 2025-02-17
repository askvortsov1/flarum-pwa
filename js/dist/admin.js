/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/components/PWALogoUploadButton.js":
/*!*****************************************************!*\
  !*** ./src/admin/components/PWALogoUploadButton.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PWALogoUploadButton)
/* harmony export */ });
/* harmony import */ var flarum_common_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/components/UploadImageButton */ "flarum/common/components/UploadImageButton");
/* harmony import */ var flarum_common_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_0__);

class PWALogoUploadButton extends (flarum_common_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_0___default()) {
  static initAttrs(attrs) {
    super.initAttrs(attrs);
    attrs.name = `pwa-icon-${attrs.size}x${attrs.size}`;
  }
  view(vnode) {
    this.attrs.loading = this.loading;
    this.attrs.className = (this.attrs.className || '') + ' Button';
    if (app.data.settings['askvortsov-pwa.icon_' + this.attrs.size + '_path']) {
      this.attrs.onclick = this.remove.bind(this);
      this.attrs.value = app.data.settings['askvortsov-pwa.icon_' + this.attrs.size + '_path'];
      this.attrs.url = app.forum.attribute(this.attrs.name + 'Url');
    } else {
      this.attrs.onclick = this.upload.bind(this);
    }
    return super.view({
      ...vnode,
      children: app.translator.trans('core.admin.upload_image.upload_buttonx')
    });
  }
  remove() {
    this.loading = true;
    m.redraw();
    app.request({
      method: 'DELETE',
      url: this.deleteUrl()
    }).then(this.success.bind(this), this.failure.bind(this));
  }
  deleteUrl() {
    return app.forum.attribute('apiUrl') + '/pwa-settings/logo/' + this.attrs.size;
  }
  resourceUrl() {
    return app.forum.attribute('apiUrl') + '/pwa/logo/' + this.attrs.size;
  }
}
flarum.reg.add('askvortsov-pwa', 'admin/components/PWALogoUploadButton', PWALogoUploadButton);

/***/ }),

/***/ "./src/admin/components/PWAPage.js":
/*!*****************************************!*\
  !*** ./src/admin/components/PWAPage.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PWAPage)
/* harmony export */ });
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/components/ExtensionPage */ "flarum/admin/components/ExtensionPage");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Alert */ "flarum/common/components/Alert");
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _PWALogoUploadButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PWALogoUploadButton */ "./src/admin/components/PWALogoUploadButton.js");
/* harmony import */ var _PWAUploadFirebaseConfigForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PWAUploadFirebaseConfigForm */ "./src/admin/components/PWAUploadFirebaseConfigForm.js");






class PWAPage extends (flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_0___default()) {
  oninit(vnode) {
    super.oninit(vnode);
    this.saving = false;
    this.refresh();
  }
  refresh() {
    this.loading = true;
    this.status_messages = [];
    this.manifest = {};
    this.sizes = [];
    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/pwa-settings'
    }).then(response => {
      this.manifest = response['data']['attributes']['manifest'];
      this.sizes = response['data']['attributes']['sizes'];
      this.status_messages = response['data']['attributes']['status_messages'];
      this.loading = false;
      m.redraw();
    });
  }
  checkExistence(url) {
    let http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
  }
  content() {
    if (this.loading || this.saving) {
      return m("div", {
        className: "PWAPage"
      }, m("div", {
        className: "container"
      }, m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default()), null)));
    }
    return m("div", {
      className: "PWAPage"
    }, m("div", {
      className: "container"
    }, m("form", null, m("h2", null, app.translator.trans('askvortsov-pwa.admin.pwa.heading')), m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.text')), m("div", {
      class: "statusCheck"
    }, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.status_check_heading')), this.status_messages.map(message => m((flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_1___default()), {
      type: message.type,
      dismissible: false
    }, [message.message]))), m("fieldset", {
      class: "parent"
    }, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.heading')), this.buildSettingComponent({
      setting: 'askvortsov-pwa.debug',
      label: app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.debug_label'),
      help: app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.debug_text'),
      type: 'boolean'
    }), this.buildSettingComponent(() => {
      return m("div", null, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
        className: "Button",
        onclick: this.resetVapid.bind(this)
      }, "Reset VAPID keys"), m("div", {
        className: "helpText"
      }, app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.reset_vapid_text')));
    })), m("fieldset", {
      class: "parent"
    }, m("fieldset", null, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.about.heading')), this.buildSettingComponent({
      setting: 'askvortsov-pwa.shortName',
      placeholder: this.setting('forum_title')(),
      label: app.translator.trans('askvortsov-pwa.admin.pwa.about.short_name_label'),
      help: app.translator.trans('askvortsov-pwa.admin.pwa.about.short_name_text'),
      type: 'text'
    })), m("fieldset", null, this.buildSettingComponent({
      setting: 'askvortsov-pwa.longName',
      placeholder: this.setting('forum_title')(),
      label: app.translator.trans('askvortsov-pwa.admin.pwa.about.long_name_label'),
      help: app.translator.trans('askvortsov-pwa.admin.pwa.about.long_name_text'),
      type: 'text'
    })), m("fieldset", null, m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.about.description_text')), m("textarea", {
      className: "FormControl",
      value: this.manifest.description,
      disabled: true
    }, this.manifest.description))), m("fieldset", {
      class: "parent"
    }, m("fieldset", null, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.colors.heading')), this.buildSettingComponent({
      setting: 'askvortsov-pwa.themeColor',
      placeholder: this.setting('theme_primary_color')(),
      label: app.translator.trans('askvortsov-pwa.admin.pwa.colors.theme_color_label'),
      help: app.translator.trans('askvortsov-pwa.admin.pwa.colors.theme_color_text'),
      type: 'color-preview'
    })), m("fieldset", null, this.buildSettingComponent({
      setting: 'askvortsov-pwa.backgroundColor',
      label: app.translator.trans('askvortsov-pwa.admin.pwa.colors.background_color_label'),
      help: app.translator.trans('askvortsov-pwa.admin.pwa.colors.background_color_text'),
      type: 'color-preview'
    }))), m("fieldset", {
      class: "parent"
    }, m("fieldset", null, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.other.heading')), this.buildSettingComponent({
      setting: 'askvortsov-pwa.forcePortrait',
      label: app.translator.trans('askvortsov-pwa.admin.pwa.other.force_portrait_text'),
      type: 'boolean'
    })), m("fieldset", null, this.buildSettingComponent({
      setting: 'askvortsov-pwa.userMaxSubscriptions',
      label: app.translator.trans('askvortsov-pwa.admin.pwa.other.user_max_subscriptions_label'),
      help: app.translator.trans('askvortsov-pwa.admin.pwa.other.user_max_subscriptions_text'),
      type: 'number',
      placeholder: 20
    })), m("fieldset", null, this.buildSettingComponent({
      setting: 'askvortsov-pwa.pushNotifPreferenceDefaultToEmail',
      label: app.translator.trans('askvortsov-pwa.admin.pwa.other.push_notif_preference_default_to_email_label'),
      help: app.translator.trans('askvortsov-pwa.admin.pwa.other.push_notif_preference_default_to_email_text'),
      type: 'bool'
    })), m("fieldset", null, this.buildSettingComponent({
      setting: 'askvortsov-pwa.windowControlsOverlay',
      label: app.translator.trans('askvortsov-pwa.admin.pwa.other.window_controls_overlay_label'),
      help: app.translator.trans('askvortsov-pwa.admin.pwa.other.window_controls_overlay_text', {
        compatibilitylink: m("a", {
          href: "https://caniuse.com/mdn-api_windowcontrolsoverlay",
          tabindex: "-1"
        }),
        learnlink: m("a", {
          href: "https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/window-controls-overlay",
          tabindex: "-1"
        })
      }),
      type: 'bool'
    }))), this.submitButton(), m("fieldset", null, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.logo_heading')), m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.logo_text')), this.sizes.map(size => {
      return m("fieldset", {
        class: "logoFieldset"
      }, m(_PWALogoUploadButton__WEBPACK_IMPORTED_MODULE_4__["default"], {
        size: size
      }), m("div", {
        className: "helpText"
      }, app.translator.trans('askvortsov-pwa.admin.pwa.logo_size_text', {
        size
      })));
    }))), m(_PWAUploadFirebaseConfigForm__WEBPACK_IMPORTED_MODULE_5__["default"], null)));
  }
  resetVapid() {
    if (confirm(app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.reset_vapid_confirm'))) {
      app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/pwa-settings/reset_vapid'
      }).then(response => {
        app.alerts.show({
          type: 'success'
        }, app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.reset_vapid_success', {
          count: response.deleted
        }));
      });
    }
  }
  saveSettings(e) {
    const hex = /^(#[0-9a-f]{3}([0-9a-f]{3})?)?$/i;
    if (!hex.test(this.setting('askvortsov-pwa.backgroundColor')())) {
      alert(app.translator.trans('core.admin.appearance.enter_hex_message'));
      return;
    }
    return super.saveSettings(e);
  }
}
flarum.reg.add('askvortsov-pwa', 'admin/components/PWAPage', PWAPage);

/***/ }),

/***/ "./src/admin/components/PWAUploadFirebaseConfigForm.js":
/*!*************************************************************!*\
  !*** ./src/admin/components/PWAUploadFirebaseConfigForm.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PWAUploadFirebaseConfigForm)
/* harmony export */ });
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_0__);

class PWAUploadFirebaseConfigForm extends (flarum_common_Component__WEBPACK_IMPORTED_MODULE_0___default()) {
  view(vnode) {
    return m('[', null, m("form", {
      action: "/pwa/firebase-config",
      method: "POST",
      onsubmit: this.updateFirebaseConfig.bind(this)
    }, m("fieldset", null, m("fieldset", null, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.heading')), m("div", {
      className: "helpText"
    }, m("span", null, app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.help_text')), m("a", {
      href: "https://docs.pwabuilder.com/#/builder/app-store?id=push-notifications",
      target: "_blank"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.see_documentation_here'))), m("button", {
      type: "button",
      className: "Button",
      onclick: () => document.querySelector('#flarum-pwa-upload-button').click()
    }, app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.upload_file')), m("input", {
      id: "flarum-pwa-upload-button",
      type: "file",
      onchange: this.updateFirebaseConfig.bind(this),
      style: {
        opacity: 0
      }
    })))));
  }
  updateFirebaseConfig(event) {
    const body = new FormData();
    body.append('file', event.target.files[0]);
    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/pwa-settings/firebase-config',
      body: body
    }).then(response => {
      app.alerts.show({
        type: 'success'
      }, app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.upload_successful'));
    });
  }
}
flarum.reg.add('askvortsov-pwa', 'admin/components/PWAUploadFirebaseConfigForm', PWAUploadFirebaseConfigForm);

/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_PWAPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/PWAPage */ "./src/admin/components/PWAPage.js");

app.initializers.add('askvortsov/flarum-pwa', () => {
  app.registry.for('askvortsov-pwa').registerPage(_components_PWAPage__WEBPACK_IMPORTED_MODULE_0__["default"]);
});

/***/ }),

/***/ "flarum/admin/components/ExtensionPage":
/*!***************************************************************************!*\
  !*** external "flarum.reg.get('core', 'admin/components/ExtensionPage')" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'admin/components/ExtensionPage');

/***/ }),

/***/ "flarum/common/Component":
/*!*************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/Component')" ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/Component');

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

/***/ "flarum/common/components/LoadingIndicator":
/*!*******************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/LoadingIndicator')" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/LoadingIndicator');

/***/ }),

/***/ "flarum/common/components/UploadImageButton":
/*!********************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/UploadImageButton')" ***!
  \********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/UploadImageButton');

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
  !*** ./admin.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.js");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=admin.js.map