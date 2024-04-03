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
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/admin/components/UploadImageButton */ "flarum/admin/components/UploadImageButton");
/* harmony import */ var flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3__);




var PWALogoUploadButton = /*#__PURE__*/function (_UploadImageButton) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(PWALogoUploadButton, _UploadImageButton);
  function PWALogoUploadButton() {
    return _UploadImageButton.apply(this, arguments) || this;
  }
  PWALogoUploadButton.initAttrs = function initAttrs(attrs) {
    _UploadImageButton.initAttrs.call(this, attrs);
    attrs.name = "pwa-icon-" + attrs.size + "x" + attrs.size;
  };
  var _proto = PWALogoUploadButton.prototype;
  _proto.view = function view(vnode) {
    this.attrs.loading = this.loading;
    this.attrs.className = (this.attrs.className || '') + ' Button';
    if (app.data.settings['askvortsov-pwa.icon_' + this.attrs.size + '_path']) {
      this.attrs.onclick = this.remove.bind(this);
      return m("div", null, m("p", null, m("img", {
        src: app.forum.attribute(this.attrs.name + 'Url'),
        alt: ""
      })), m("p", null, _UploadImageButton.prototype.view.call(this, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, vnode, {
        children: app.translator.trans('core.admin.upload_image.remove_button')
      }))));
    } else {
      this.attrs.onclick = this.upload.bind(this);
    }
    return _UploadImageButton.prototype.view.call(this, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, vnode, {
      children: app.translator.trans('core.admin.upload_image.upload_button')
    }));
  };
  _proto.resourceUrl = function resourceUrl() {
    return app.forum.attribute('apiUrl') + '/pwa/logo/' + this.attrs.size;
  };
  return PWALogoUploadButton;
}((flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3___default()));


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
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/components/ExtensionPage */ "flarum/admin/components/ExtensionPage");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Alert */ "flarum/common/components/Alert");
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _PWALogoUploadButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PWALogoUploadButton */ "./src/admin/components/PWALogoUploadButton.js");
/* harmony import */ var _PWAUploadFirebaseConfigForm__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PWAUploadFirebaseConfigForm */ "./src/admin/components/PWAUploadFirebaseConfigForm.js");







var PWAPage = /*#__PURE__*/function (_ExtensionPage) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PWAPage, _ExtensionPage);
  function PWAPage() {
    return _ExtensionPage.apply(this, arguments) || this;
  }
  var _proto = PWAPage.prototype;
  _proto.oninit = function oninit(vnode) {
    _ExtensionPage.prototype.oninit.call(this, vnode);
    this.saving = false;
    this.refresh();
  };
  _proto.refresh = function refresh() {
    var _this = this;
    this.loading = true;
    this.status_messages = [];
    this.manifest = {};
    this.sizes = [];
    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/pwa/settings'
    }).then(function (response) {
      _this.manifest = response['data']['attributes']['manifest'];
      _this.sizes = response['data']['attributes']['sizes'];
      _this.status_messages = response['data']['attributes']['status_messages'];
      _this.loading = false;
      m.redraw();
    });
  };
  _proto.checkExistence = function checkExistence(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
  };
  _proto.content = function content() {
    var _this2 = this;
    if (this.loading || this.saving) {
      return m("div", {
        className: "PWAPage"
      }, m("div", {
        className: "container"
      }, m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4___default()), null)));
    }
    return m("div", {
      className: "PWAPage"
    }, m("div", {
      className: "container"
    }, m("form", null, m("h2", null, app.translator.trans('askvortsov-pwa.admin.pwa.heading')), m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.text')), m("div", {
      "class": "statusCheck"
    }, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.status_check_heading')), this.status_messages.map(function (message) {
      return m((flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_2___default()), {
        type: message.type,
        dismissible: false
      }, [message.message]);
    })), m("fieldset", {
      "class": "parent"
    }, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.heading')), this.buildSettingComponent({
      setting: 'askvortsov-pwa.debug',
      label: app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.debug_label'),
      help: app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.debug_text'),
      type: 'boolean'
    }), this.buildSettingComponent(function () {
      return m("div", null, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
        className: "Button",
        onclick: _this2.resetVapid.bind(_this2)
      }, "Reset VAPID keys"), m("div", {
        className: "helpText"
      }, app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.reset_vapid_text')));
    })), m("fieldset", {
      "class": "parent"
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
      "class": "parent"
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
      "class": "parent"
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
    }))), this.submitButton(), m("fieldset", null, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.logo_heading')), m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.logo_text')), this.sizes.map(function (size) {
      return m("fieldset", {
        "class": "logoFieldset"
      }, m(_PWALogoUploadButton__WEBPACK_IMPORTED_MODULE_5__["default"], {
        size: size
      }), m("div", {
        className: "helpText"
      }, app.translator.trans('askvortsov-pwa.admin.pwa.logo_size_text', {
        size: size
      })));
    }))), m(_PWAUploadFirebaseConfigForm__WEBPACK_IMPORTED_MODULE_6__["default"], null)));
  };
  _proto.resetVapid = function resetVapid() {
    if (confirm(app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.reset_vapid_confirm'))) {
      app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/reset_vapid'
      }).then(function (response) {
        app.alerts.show({
          type: 'success'
        }, app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.reset_vapid_success', {
          count: response.deleted
        }));
      });
    }
  };
  _proto.saveSettings = function saveSettings(e) {
    var hex = /^(#[0-9a-f]{3}([0-9a-f]{3})?)?$/i;
    if (!hex.test(this.setting('askvortsov-pwa.backgroundColor')())) {
      alert(app.translator.trans('core.admin.appearance.enter_hex_message'));
      return;
    }
    return _ExtensionPage.prototype.saveSettings.call(this, e);
  };
  return PWAPage;
}((flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1___default()));


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
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);


var PWAUploadFirebaseConfigForm = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PWAUploadFirebaseConfigForm, _Component);
  function PWAUploadFirebaseConfigForm() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = PWAUploadFirebaseConfigForm.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.file = null;
  };
  _proto.view = function view(vnode) {
    return m('[', null, m("form", {
      action: "/pwa/firebase-config",
      method: "POST",
      onsubmit: this.updateFirebaseConfig.bind(this)
    }, m("fieldset", null, m("fieldset", null, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.heading')), m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.help_text')), m("input", {
      type: "file",
      onchange: this.handleFileChange.bind(this)
    })), m("button", {
      type: "submit"
    }, "SUBMIT"))));
  };
  _proto.handleFileChange = function handleFileChange(event) {
    this.file = event.target.files[0];
  };
  _proto.updateFirebaseConfig = function updateFirebaseConfig(event) {
    event.preventDefault();
    var body = new FormData();
    body.append('file', this.file);
    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/pwa/firebase-config',
      body: body
    }).then(function (response) {
      app.alerts.show({
        type: 'success'
      }, app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.upload_successful'));
    });
  };
  return PWAUploadFirebaseConfigForm;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_PWAPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/PWAPage */ "./src/admin/components/PWAPage.js");

app.initializers.add('askvortsov/flarum-pwa', function () {
  app.extensionData["for"]('askvortsov-pwa').registerPage(_components_PWAPage__WEBPACK_IMPORTED_MODULE_0__["default"]);
});

/***/ }),

/***/ "flarum/admin/components/ExtensionPage":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['admin/components/ExtensionPage']" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/ExtensionPage'];

/***/ }),

/***/ "flarum/admin/components/UploadImageButton":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['admin/components/UploadImageButton']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/UploadImageButton'];

/***/ }),

/***/ "flarum/common/Component":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/Component']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Component'];

/***/ }),

/***/ "flarum/common/components/Alert":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Alert']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Alert'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/LoadingIndicator":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['common/components/LoadingIndicator']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LoadingIndicator'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
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