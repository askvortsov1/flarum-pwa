module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./admin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./admin.js":
/*!******************!*\
  !*** ./admin.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.js");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _assertThisInitialized; });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _getPrototypeOf; });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _inheritsLoose; });
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _possibleConstructorReturn; });
/* harmony import */ var _helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _assertThisInitialized__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(self, call) {
  if (call && (Object(_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(call) === "object" || typeof call === "function")) {
    return call;
  }

  return Object(_assertThisInitialized__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _typeof; });
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/***/ }),

/***/ "./src/admin/components/PWALogoUploadButton.js":
/*!*****************************************************!*\
  !*** ./src/admin/components/PWALogoUploadButton.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PWALogoUploadButton; });
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/UploadImageButton */ "flarum/components/UploadImageButton");
/* harmony import */ var flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_Alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/Alert */ "flarum/components/Alert");
/* harmony import */ var flarum_components_Alert__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Alert__WEBPACK_IMPORTED_MODULE_4__);




function _createSuper(Derived) { return function () { var Super = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Object(_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }




var PWALogoUploadButton = /*#__PURE__*/function (_UploadImageButton) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(PWALogoUploadButton, _UploadImageButton);

  var _super = _createSuper(PWALogoUploadButton);

  function PWALogoUploadButton() {
    return _UploadImageButton.apply(this, arguments) || this;
  }

  var _proto = PWALogoUploadButton.prototype;

  _proto.view = function view() {
    var settings = app.data.settings;
    this.props.loading = this.loading;
    this.props.className = (this.props.className || '') + ' Button';

    if (app.data.settings['askvortsov-pwa.icon_' + this.props.name + '_path']) {
      this.props.onclick = this.remove.bind(this);
      this.props.children = app.translator.trans('core.admin.upload_image.remove_button');
      return m("div", null, m("p", null, m("img", {
        src: '/assets/' + app.data.settings['askvortsov-pwa.icon_' + this.props.name + '_path'],
        alt: ""
      })), m("p", null, _UploadImageButton.prototype.view.call(this)));
    } else {
      this.props.onclick = this.upload.bind(this);
      this.props.children = app.translator.trans('core.admin.upload_image.upload_button');
    }

    return _UploadImageButton.prototype.view.call(this);
  };

  _proto.resourceUrl = function resourceUrl() {
    return app.forum.attribute('apiUrl') + '/pwa/logo/' + this.props.name;
  };

  _proto.success = function success(response) {
    var _this = this;

    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/pwa/refresh'
    }).then(function () {
      app.alerts.show(_this.successAlert = new flarum_components_Alert__WEBPACK_IMPORTED_MODULE_4___default.a({
        type: 'success',
        children: app.translator.trans('askvortsov-pwa.admin.pwa.refreshed_message')
      }));
    })["catch"](function () {}).then(function () {
      _this.saving = false;
      window.location.reload();
    });
  };

  return PWALogoUploadButton;
}(flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3___default.a);



/***/ }),

/***/ "./src/admin/components/PWAPage.js":
/*!*****************************************!*\
  !*** ./src/admin/components/PWAPage.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PWAPage; });
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_components_Page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/Page */ "flarum/components/Page");
/* harmony import */ var flarum_components_Page__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Page__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_components_Alert__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/components/Alert */ "flarum/components/Alert");
/* harmony import */ var flarum_components_Alert__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Alert__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/components/LoadingIndicator */ "flarum/components/LoadingIndicator");
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/components/Switch */ "flarum/components/Switch");
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Switch__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/utils/saveSettings */ "flarum/utils/saveSettings");
/* harmony import */ var flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _PWALogoUploadButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./PWALogoUploadButton */ "./src/admin/components/PWALogoUploadButton.js");




function _createSuper(Derived) { return function () { var Super = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Object(_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }









var PWAPage = /*#__PURE__*/function (_Page) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(PWAPage, _Page);

  var _super = _createSuper(PWAPage);

  function PWAPage() {
    return _Page.apply(this, arguments) || this;
  }

  var _proto = PWAPage.prototype;

  _proto.init = function init() {
    _Page.prototype.init.call(this);

    this.saving = false;
    this.refresh();
  };

  _proto.refresh = function refresh() {
    var _this = this;

    this.loading = true;
    var settings = app.data.settings;
    this.status_messages = [];
    this.manifest = {};
    this.sizes = [];
    this.values = {};
    this.fields = ['askvortsov-pwa.enable', 'askvortsov-pwa.longName', 'askvortsov-pwa.backgroundColor'];
    this.fields.forEach(function (key) {
      return _this.values[key] = m.prop(settings[key]);
    }); // if (Array.isArray(settings['askvortsov-pwa.categories'])) {
    //     this.values['askvortsov-pwa.categories'] = m.prop(settings['askvortsov-pwa.categories'].join(','));
    // }

    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/pwa/settings'
    }).then(function (response) {
      _this.manifest = response['data']['attributes']['manifest'];
      _this.sizes = response['data']['attributes']['sizes'];
      _this.status_messages = response['data']['attributes']['status_messages'];
      console.log(_this.status_messages);
      _this.loading = false;
      m.redraw();
    });
  };

  _proto.view = function view() {
    if (this.loading || this.saving) {
      return m("div", {
        className: "PWAPage"
      }, m("div", {
        className: "container"
      }, m(flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6___default.a, null)));
    }

    return m("div", {
      className: "PWAPage"
    }, m("div", {
      className: "container"
    }, m("form", {
      onsubmit: this.onsubmit.bind(this)
    }, m("h2", null, app.translator.trans('askvortsov-pwa.admin.pwa.heading')), m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.text')), m("fieldset", null, flarum_components_Switch__WEBPACK_IMPORTED_MODULE_7___default.a.component({
      state: this.values['askvortsov-pwa.enable'](),
      onchange: this.values['askvortsov-pwa.enable'],
      children: app.translator.trans('askvortsov-pwa.admin.pwa.enable_label')
    })), m("div", {
      "class": "statusCheck"
    }, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.status_check_heading')), this.status_messages.map(function (message) {
      return flarum_components_Alert__WEBPACK_IMPORTED_MODULE_5___default.a.component({
        type: message.type,
        children: [message.message],
        dismissible: false
      });
    })), m("fieldset", {
      "class": "parent"
    }, m("fieldset", null, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.about.heading')), m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.about.short_name_text')), m("input", {
      className: "FormControl",
      value: this.manifest.short_name,
      disabled: true
    })), m("fieldset", null, m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.about.name_text')), m("input", {
      className: "FormControl",
      value: this.values['askvortsov-pwa.longName'](),
      oninput: m.withAttr('value', this.values['askvortsov-pwa.longName'])
    })), m("fieldset", null, m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.about.description_text')), m("textarea", {
      className: "FormControl",
      value: this.manifest.description,
      disabled: true
    }, this.manifest.description))), m("fieldset", {
      "class": "parent"
    }, m("fieldset", null, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.colors.heading')), m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.colors.theme_color_text')), m("input", {
      className: "FormControl",
      type: "text",
      placeholder: "#aaaaaa",
      value: this.manifest.theme_color,
      disabled: true
    })), m("fieldset", null, m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.colors.background_color_text')), m("input", {
      className: "FormControl",
      type: "text",
      placeholder: "#aaaaaa",
      value: this.values['askvortsov-pwa.backgroundColor']()
    }))), m("fieldset", null, m("legend", null, app.translator.trans('askvortsov-pwa.admin.pwa.logo_heading')), m("div", {
      className: "helpText"
    }, app.translator.trans('askvortsov-pwa.admin.pwa.logo_text')), this.sizes.map(function (size) {
      return m("fieldset", {
        "class": "logoFieldset"
      }, m(_PWALogoUploadButton__WEBPACK_IMPORTED_MODULE_9__["default"], {
        name: size
      }), m("div", {
        className: "helpText"
      }, app.translator.trans('askvortsov-pwa.admin.pwa.logo_size_text', {
        size: size
      })));
    })), flarum_components_Button__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      type: 'submit',
      className: 'Button Button--primary',
      children: app.translator.trans('askvortsov-pwa.admin.pwa.submit_button')
    }))));
  };

  _proto.onsubmit = function onsubmit(e) {
    e.preventDefault();
    var hex = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;

    if (!hex.test(this.values['askvortsov-pwa.backgroundColor']())) {
      alert(app.translator.trans('core.admin.about.enter_hex_message'));
      return;
    } // this.values['askvortsov-pwa.categories'](this.values['askvortsov-pwa.categories']().split(',').map(function (item) {
    //     return item.trim();
    // }));


    this.saveSettings();
  };

  _proto.saveSettings = function saveSettings() {
    var _this2 = this;

    if (this.saving) return;
    this.saving = true;
    app.alerts.dismiss(this.successAlert);
    var settings = {};
    this.fields.forEach(function (key) {
      return settings[key] = _this2.values[key]();
    });

    flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_8___default()(settings).then(function () {
      app.alerts.show(_this2.successAlert = new flarum_components_Alert__WEBPACK_IMPORTED_MODULE_5___default.a({
        type: 'success',
        children: app.translator.trans('core.admin.basics.saved_message')
      }));
    })["catch"](function () {}).then(function () {
      app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/pwa/refresh'
      }).then(function () {
        app.alerts.show(_this2.successAlert = new flarum_components_Alert__WEBPACK_IMPORTED_MODULE_5___default.a({
          type: 'success',
          children: app.translator.trans('askvortsov-pwa.admin.pwa.refreshed_message')
        }));
      })["catch"](function () {}).then(function () {
        _this2.saving = false;

        _this2.refresh();
      });
    });
  };

  return PWAPage;
}(flarum_components_Page__WEBPACK_IMPORTED_MODULE_3___default.a);



/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/AdminNav */ "flarum/components/AdminNav");
/* harmony import */ var flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/AdminLinkButton */ "flarum/components/AdminLinkButton");
/* harmony import */ var flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_PWAPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/PWAPage */ "./src/admin/components/PWAPage.js");




app.initializers.add('askvortsov/flarum-pwa', function () {
  app.routes.pwa = {
    path: '/pwa',
    component: _components_PWAPage__WEBPACK_IMPORTED_MODULE_3__["default"].component()
  };

  app.extensionSettings['askvortsov-pwa'] = function () {
    return m.route(app.route('tags'));
  };

  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'items', function (items) {
    items.add('pwa', flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      href: app.route('pwa'),
      icon: 'fas fa-mobile-alt',
      children: app.translator.trans('askvortsov-pwa.admin.nav.pwa_button'),
      description: app.translator.trans('askvortsov-pwa.admin.nav.pwa_text')
    }));
  });
});

/***/ }),

/***/ "flarum/components/AdminLinkButton":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['components/AdminLinkButton']" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AdminLinkButton'];

/***/ }),

/***/ "flarum/components/AdminNav":
/*!************************************************************!*\
  !*** external "flarum.core.compat['components/AdminNav']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AdminNav'];

/***/ }),

/***/ "flarum/components/Alert":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['components/Alert']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Alert'];

/***/ }),

/***/ "flarum/components/Button":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Button']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Button'];

/***/ }),

/***/ "flarum/components/LoadingIndicator":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['components/LoadingIndicator']" ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/LoadingIndicator'];

/***/ }),

/***/ "flarum/components/Page":
/*!********************************************************!*\
  !*** external "flarum.core.compat['components/Page']" ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Page'];

/***/ }),

/***/ "flarum/components/Switch":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Switch']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Switch'];

/***/ }),

/***/ "flarum/components/UploadImageButton":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['components/UploadImageButton']" ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/UploadImageButton'];

/***/ }),

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/utils/saveSettings":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['utils/saveSettings']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/saveSettings'];

/***/ })

/******/ });
//# sourceMappingURL=admin.js.map