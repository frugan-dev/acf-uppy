(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["npm/uppy"],{

/***/ "../node_modules/@uppy/companion-client/lib/AuthError.js":
/*!***************************************************************!*\
  !*** ../node_modules/@uppy/companion-client/lib/AuthError.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AuthError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(AuthError, _Error);

  function AuthError() {
    var _this;

    _this = _Error.call(this, 'Authorization required') || this;
    _this.name = 'AuthError';
    _this.isAuthError = true;
    return _this;
  }

  return AuthError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

module.exports = AuthError;

/***/ }),

/***/ "../node_modules/@uppy/companion-client/lib/Provider.js":
/*!**************************************************************!*\
  !*** ../node_modules/@uppy/companion-client/lib/Provider.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var RequestClient = __webpack_require__(/*! ./RequestClient */ "../node_modules/@uppy/companion-client/lib/RequestClient.js");

var tokenStorage = __webpack_require__(/*! ./tokenStorage */ "../node_modules/@uppy/companion-client/lib/tokenStorage.js");

var _getName = function _getName(id) {
  return id.split('-').map(function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }).join(' ');
};

module.exports = /*#__PURE__*/function (_RequestClient) {
  _inheritsLoose(Provider, _RequestClient);

  function Provider(uppy, opts) {
    var _this;

    _this = _RequestClient.call(this, uppy, opts) || this;
    _this.provider = opts.provider;
    _this.id = _this.provider;
    _this.name = _this.opts.name || _getName(_this.id);
    _this.pluginId = _this.opts.pluginId;
    _this.tokenKey = "companion-" + _this.pluginId + "-auth-token";
    return _this;
  }

  var _proto = Provider.prototype;

  _proto.headers = function headers() {
    return Promise.all([_RequestClient.prototype.headers.call(this), this.getAuthToken()]).then(function (_ref) {
      var headers = _ref[0],
          token = _ref[1];
      return _extends({}, headers, {
        'uppy-auth-token': token
      });
    });
  };

  _proto.onReceiveResponse = function onReceiveResponse(response) {
    response = _RequestClient.prototype.onReceiveResponse.call(this, response);
    var plugin = this.uppy.getPlugin(this.pluginId);
    var oldAuthenticated = plugin.getPluginState().authenticated;
    var authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
    plugin.setPluginState({
      authenticated: authenticated
    });
    return response;
  } // @todo(i.olarewaju) consider whether or not this method should be exposed
  ;

  _proto.setAuthToken = function setAuthToken(token) {
    return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
  };

  _proto.getAuthToken = function getAuthToken() {
    return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
  };

  _proto.authUrl = function authUrl() {
    return this.hostname + "/" + this.id + "/connect";
  };

  _proto.fileUrl = function fileUrl(id) {
    return this.hostname + "/" + this.id + "/get/" + id;
  };

  _proto.list = function list(directory) {
    return this.get(this.id + "/list/" + (directory || ''));
  };

  _proto.logout = function logout() {
    var _this2 = this;

    return this.get(this.id + "/logout").then(function (response) {
      return Promise.all([response, _this2.uppy.getPlugin(_this2.pluginId).storage.removeItem(_this2.tokenKey)]);
    }).then(function (_ref2) {
      var response = _ref2[0];
      return response;
    });
  };

  Provider.initPlugin = function initPlugin(plugin, opts, defaultOpts) {
    plugin.type = 'acquirer';
    plugin.files = [];

    if (defaultOpts) {
      plugin.opts = _extends({}, defaultOpts, opts);
    }

    if (opts.serverUrl || opts.serverPattern) {
      throw new Error('`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`');
    }

    if (opts.companionAllowedHosts) {
      var pattern = opts.companionAllowedHosts; // validate companionAllowedHosts param

      if (typeof pattern !== 'string' && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
        throw new TypeError(plugin.id + ": the option \"companionAllowedHosts\" must be one of string, Array, RegExp");
      }

      plugin.opts.companionAllowedHosts = pattern;
    } else {
      // does not start with https://
      if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
        plugin.opts.companionAllowedHosts = "https://" + opts.companionUrl.replace(/^\/\//, '');
      } else {
        plugin.opts.companionAllowedHosts = opts.companionUrl;
      }
    }

    plugin.storage = plugin.opts.storage || tokenStorage;
  };

  return Provider;
}(RequestClient);

/***/ }),

/***/ "../node_modules/@uppy/companion-client/lib/RequestClient.js":
/*!*******************************************************************!*\
  !*** ../node_modules/@uppy/companion-client/lib/RequestClient.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthError = __webpack_require__(/*! ./AuthError */ "../node_modules/@uppy/companion-client/lib/AuthError.js");

var fetchWithNetworkError = __webpack_require__(/*! @uppy/utils/lib/fetchWithNetworkError */ "../node_modules/@uppy/utils/lib/fetchWithNetworkError.js"); // Remove the trailing slash so we can always safely append /xyz.


function stripSlash(url) {
  return url.replace(/\/$/, '');
}

module.exports = (_temp = _class = /*#__PURE__*/function () {
  function RequestClient(uppy, opts) {
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    this.allowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];
    this.preflightDone = false;
  }

  var _proto = RequestClient.prototype;

  _proto.headers = function headers() {
    var userHeaders = this.opts.companionHeaders || this.opts.serverHeaders || {};
    return Promise.resolve(_extends({}, this.defaultHeaders, userHeaders));
  };

  _proto._getPostResponseFunc = function _getPostResponseFunc(skip) {
    var _this = this;

    return function (response) {
      if (!skip) {
        return _this.onReceiveResponse(response);
      }

      return response;
    };
  };

  _proto.onReceiveResponse = function onReceiveResponse(response) {
    var state = this.uppy.getState();
    var companion = state.companion || {};
    var host = this.opts.companionUrl;
    var headers = response.headers; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      var _extends2;

      this.uppy.setState({
        companion: _extends({}, companion, (_extends2 = {}, _extends2[host] = headers.get('i-am'), _extends2))
      });
    }

    return response;
  };

  _proto._getUrl = function _getUrl(url) {
    if (/^(https?:|)\/\//.test(url)) {
      return url;
    }

    return this.hostname + "/" + url;
  };

  _proto._json = function _json(res) {
    if (res.status === 401) {
      throw new AuthError();
    }

    if (res.status < 200 || res.status > 300) {
      var errMsg = "Failed request with status: " + res.status + ". " + res.statusText;
      return res.json().then(function (errData) {
        errMsg = errData.message ? errMsg + " message: " + errData.message : errMsg;
        errMsg = errData.requestId ? errMsg + " request-Id: " + errData.requestId : errMsg;
        throw new Error(errMsg);
      }).catch(function () {
        throw new Error(errMsg);
      });
    }

    return res.json();
  };

  _proto.preflight = function preflight(path) {
    var _this2 = this;

    if (this.preflightDone) {
      return Promise.resolve(this.allowedHeaders.slice());
    }

    return fetch(this._getUrl(path), {
      method: 'OPTIONS'
    }).then(function (response) {
      if (response.headers.has('access-control-allow-headers')) {
        _this2.allowedHeaders = response.headers.get('access-control-allow-headers').split(',').map(function (headerName) {
          return headerName.trim().toLowerCase();
        });
      }

      _this2.preflightDone = true;
      return _this2.allowedHeaders.slice();
    }).catch(function (err) {
      _this2.uppy.log("[CompanionClient] unable to make preflight request " + err, 'warning');

      _this2.preflightDone = true;
      return _this2.allowedHeaders.slice();
    });
  };

  _proto.preflightAndHeaders = function preflightAndHeaders(path) {
    var _this3 = this;

    return Promise.all([this.preflight(path), this.headers()]).then(function (_ref) {
      var allowedHeaders = _ref[0],
          headers = _ref[1];
      // filter to keep only allowed Headers
      Object.keys(headers).forEach(function (header) {
        if (allowedHeaders.indexOf(header.toLowerCase()) === -1) {
          _this3.uppy.log("[CompanionClient] excluding unallowed header " + header);

          delete headers[header];
        }
      });
      return headers;
    });
  };

  _proto.get = function get(path, skipPostResponse) {
    var _this4 = this;

    return this.preflightAndHeaders(path).then(function (headers) {
      return fetchWithNetworkError(_this4._getUrl(path), {
        method: 'get',
        headers: headers,
        credentials: 'same-origin'
      });
    }).then(this._getPostResponseFunc(skipPostResponse)).then(function (res) {
      return _this4._json(res);
    }).catch(function (err) {
      err = err.isAuthError ? err : new Error("Could not get " + _this4._getUrl(path) + ". " + err);
      return Promise.reject(err);
    });
  };

  _proto.post = function post(path, data, skipPostResponse) {
    var _this5 = this;

    return this.preflightAndHeaders(path).then(function (headers) {
      return fetchWithNetworkError(_this5._getUrl(path), {
        method: 'post',
        headers: headers,
        credentials: 'same-origin',
        body: JSON.stringify(data)
      });
    }).then(this._getPostResponseFunc(skipPostResponse)).then(function (res) {
      return _this5._json(res);
    }).catch(function (err) {
      err = err.isAuthError ? err : new Error("Could not post " + _this5._getUrl(path) + ". " + err);
      return Promise.reject(err);
    });
  };

  _proto.delete = function _delete(path, data, skipPostResponse) {
    var _this6 = this;

    return this.preflightAndHeaders(path).then(function (headers) {
      return fetchWithNetworkError(_this6.hostname + "/" + path, {
        method: 'delete',
        headers: headers,
        credentials: 'same-origin',
        body: data ? JSON.stringify(data) : null
      });
    }).then(this._getPostResponseFunc(skipPostResponse)).then(function (res) {
      return _this6._json(res);
    }).catch(function (err) {
      err = err.isAuthError ? err : new Error("Could not delete " + _this6._getUrl(path) + ". " + err);
      return Promise.reject(err);
    });
  };

  _createClass(RequestClient, [{
    key: "hostname",
    get: function get() {
      var _this$uppy$getState = this.uppy.getState(),
          companion = _this$uppy$getState.companion;

      var host = this.opts.companionUrl;
      return stripSlash(companion && companion[host] ? companion[host] : host);
    }
  }, {
    key: "defaultHeaders",
    get: function get() {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Uppy-Versions': "@uppy/companion-client=" + RequestClient.VERSION
      };
    }
  }]);

  return RequestClient;
}(), _class.VERSION = "1.7.0", _temp);

/***/ }),

/***/ "../node_modules/@uppy/companion-client/lib/SearchProvider.js":
/*!********************************************************************!*\
  !*** ../node_modules/@uppy/companion-client/lib/SearchProvider.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var RequestClient = __webpack_require__(/*! ./RequestClient */ "../node_modules/@uppy/companion-client/lib/RequestClient.js");

var _getName = function _getName(id) {
  return id.split('-').map(function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }).join(' ');
};

module.exports = /*#__PURE__*/function (_RequestClient) {
  _inheritsLoose(SearchProvider, _RequestClient);

  function SearchProvider(uppy, opts) {
    var _this;

    _this = _RequestClient.call(this, uppy, opts) || this;
    _this.provider = opts.provider;
    _this.id = _this.provider;
    _this.name = _this.opts.name || _getName(_this.id);
    _this.pluginId = _this.opts.pluginId;
    return _this;
  }

  var _proto = SearchProvider.prototype;

  _proto.fileUrl = function fileUrl(id) {
    return this.hostname + "/search/" + this.id + "/get/" + id;
  };

  _proto.search = function search(text, queries) {
    queries = queries ? "&" + queries : '';
    return this.get("search/" + this.id + "/list?q=" + encodeURIComponent(text) + queries);
  };

  return SearchProvider;
}(RequestClient);

/***/ }),

/***/ "../node_modules/@uppy/companion-client/lib/Socket.js":
/*!************************************************************!*\
  !*** ../node_modules/@uppy/companion-client/lib/Socket.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ee = __webpack_require__(/*! namespace-emitter */ "../node_modules/namespace-emitter/index.js");

module.exports = /*#__PURE__*/function () {
  function UppySocket(opts) {
    this.opts = opts;
    this._queued = [];
    this.isOpen = false;
    this.emitter = ee();
    this._handleMessage = this._handleMessage.bind(this);
    this.close = this.close.bind(this);
    this.emit = this.emit.bind(this);
    this.on = this.on.bind(this);
    this.once = this.once.bind(this);
    this.send = this.send.bind(this);

    if (!opts || opts.autoOpen !== false) {
      this.open();
    }
  }

  var _proto = UppySocket.prototype;

  _proto.open = function open() {
    var _this = this;

    this.socket = new WebSocket(this.opts.target);

    this.socket.onopen = function (e) {
      _this.isOpen = true;

      while (_this._queued.length > 0 && _this.isOpen) {
        var first = _this._queued[0];

        _this.send(first.action, first.payload);

        _this._queued = _this._queued.slice(1);
      }
    };

    this.socket.onclose = function (e) {
      _this.isOpen = false;
    };

    this.socket.onmessage = this._handleMessage;
  };

  _proto.close = function close() {
    if (this.socket) {
      this.socket.close();
    }
  };

  _proto.send = function send(action, payload) {
    // attach uuid
    if (!this.isOpen) {
      this._queued.push({
        action: action,
        payload: payload
      });

      return;
    }

    this.socket.send(JSON.stringify({
      action: action,
      payload: payload
    }));
  };

  _proto.on = function on(action, handler) {
    this.emitter.on(action, handler);
  };

  _proto.emit = function emit(action, payload) {
    this.emitter.emit(action, payload);
  };

  _proto.once = function once(action, handler) {
    this.emitter.once(action, handler);
  };

  _proto._handleMessage = function _handleMessage(e) {
    try {
      var message = JSON.parse(e.data);
      this.emit(message.action, message.payload);
    } catch (err) {
      console.log(err);
    }
  };

  return UppySocket;
}();

/***/ }),

/***/ "../node_modules/@uppy/companion-client/lib/index.js":
/*!***********************************************************!*\
  !*** ../node_modules/@uppy/companion-client/lib/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Manages communications with Companion
 */

var RequestClient = __webpack_require__(/*! ./RequestClient */ "../node_modules/@uppy/companion-client/lib/RequestClient.js");

var Provider = __webpack_require__(/*! ./Provider */ "../node_modules/@uppy/companion-client/lib/Provider.js");

var SearchProvider = __webpack_require__(/*! ./SearchProvider */ "../node_modules/@uppy/companion-client/lib/SearchProvider.js");

var Socket = __webpack_require__(/*! ./Socket */ "../node_modules/@uppy/companion-client/lib/Socket.js");

module.exports = {
  RequestClient: RequestClient,
  Provider: Provider,
  SearchProvider: SearchProvider,
  Socket: Socket
};

/***/ }),

/***/ "../node_modules/@uppy/companion-client/lib/tokenStorage.js":
/*!******************************************************************!*\
  !*** ../node_modules/@uppy/companion-client/lib/tokenStorage.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * This module serves as an Async wrapper for LocalStorage
 */

module.exports.setItem = function (key, value) {
  return new Promise(function (resolve) {
    localStorage.setItem(key, value);
    resolve();
  });
};

module.exports.getItem = function (key) {
  return Promise.resolve(localStorage.getItem(key));
};

module.exports.removeItem = function (key) {
  return new Promise(function (resolve) {
    localStorage.removeItem(key);
    resolve();
  });
};

/***/ }),

/***/ "../node_modules/@uppy/core/lib/Plugin.js":
/*!************************************************!*\
  !*** ../node_modules/@uppy/core/lib/Plugin.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var preact = __webpack_require__(/*! preact */ "../node_modules/preact/dist/preact.esm.js");

var findDOMElement = __webpack_require__(/*! @uppy/utils/lib/findDOMElement */ "../node_modules/@uppy/utils/lib/findDOMElement.js");
/**
 * Defer a frequent call to the microtask queue.
 */


function debounce(fn) {
  var calling = null;
  var latestArgs = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    latestArgs = args;

    if (!calling) {
      calling = Promise.resolve().then(function () {
        calling = null; // At this point `args` may be different from the most
        // recent state, if multiple calls happened since this task
        // was queued. So we use the `latestArgs`, which definitely
        // is the most recent call.

        return fn.apply(void 0, latestArgs);
      });
    }

    return calling;
  };
}
/**
 * Boilerplate that all Plugins share - and should not be used
 * directly. It also shows which methods final plugins should implement/override,
 * this deciding on structure.
 *
 * @param {object} main Uppy core object
 * @param {object} object with plugin options
 * @returns {Array|string} files or success/fail message
 */


module.exports = /*#__PURE__*/function () {
  function Plugin(uppy, opts) {
    this.uppy = uppy;
    this.opts = opts || {};
    this.update = this.update.bind(this);
    this.mount = this.mount.bind(this);
    this.install = this.install.bind(this);
    this.uninstall = this.uninstall.bind(this);
  }

  var _proto = Plugin.prototype;

  _proto.getPluginState = function getPluginState() {
    var _this$uppy$getState = this.uppy.getState(),
        plugins = _this$uppy$getState.plugins;

    return plugins[this.id] || {};
  };

  _proto.setPluginState = function setPluginState(update) {
    var _extends2;

    var _this$uppy$getState2 = this.uppy.getState(),
        plugins = _this$uppy$getState2.plugins;

    this.uppy.setState({
      plugins: _extends({}, plugins, (_extends2 = {}, _extends2[this.id] = _extends({}, plugins[this.id], update), _extends2))
    });
  };

  _proto.setOptions = function setOptions(newOpts) {
    this.opts = _extends({}, this.opts, newOpts);
    this.setPluginState(); // so that UI re-renders with new options
  };

  _proto.update = function update(state) {
    if (typeof this.el === 'undefined') {
      return;
    }

    if (this._updateUI) {
      this._updateUI(state);
    }
  } // Called after every state update, after everything's mounted. Debounced.
  ;

  _proto.afterUpdate = function afterUpdate() {}
  /**
   * Called when plugin is mounted, whether in DOM or into another plugin.
   * Needed because sometimes plugins are mounted separately/after `install`,
   * so this.el and this.parent might not be available in `install`.
   * This is the case with @uppy/react plugins, for example.
   */
  ;

  _proto.onMount = function onMount() {}
  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   *
   * @param {string|object} target
   *
   */
  ;

  _proto.mount = function mount(target, plugin) {
    var _this = this;

    var callerPluginName = plugin.id;
    var targetElement = findDOMElement(target);

    if (targetElement) {
      this.isTargetDOMEl = true; // API for plugins that require a synchronous rerender.

      this.rerender = function (state) {
        // plugin could be removed, but this.rerender is debounced below,
        // so it could still be called even after uppy.removePlugin or uppy.close
        // hence the check
        if (!_this.uppy.getPlugin(_this.id)) return;
        _this.el = preact.render(_this.render(state), targetElement, _this.el);

        _this.afterUpdate();
      };

      this._updateUI = debounce(this.rerender);
      this.uppy.log("Installing " + callerPluginName + " to a DOM element '" + target + "'"); // clear everything inside the target container

      if (this.opts.replaceTargetContent) {
        targetElement.innerHTML = '';
      }

      this.el = preact.render(this.render(this.uppy.getState()), targetElement);
      this.onMount();
      return this.el;
    }

    var targetPlugin;

    if (typeof target === 'object' && target instanceof Plugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      var Target = target; // Find the target plugin instance.

      this.uppy.iteratePlugins(function (plugin) {
        if (plugin instanceof Target) {
          targetPlugin = plugin;
          return false;
        }
      });
    }

    if (targetPlugin) {
      this.uppy.log("Installing " + callerPluginName + " to " + targetPlugin.id);
      this.parent = targetPlugin;
      this.el = targetPlugin.addTarget(plugin);
      this.onMount();
      return this.el;
    }

    this.uppy.log("Not installing " + callerPluginName);
    var message = "Invalid target option given to " + callerPluginName + ".";

    if (typeof target === 'function') {
      message += ' The given target is not a Plugin class. ' + 'Please check that you\'re not specifying a React Component instead of a plugin. ' + 'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' + 'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
    } else {
      message += 'If you meant to target an HTML element, please make sure that the element exists. ' + 'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' + '(see https://github.com/transloadit/uppy/issues/1042)\n\n' + 'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
    }

    throw new Error(message);
  };

  _proto.render = function render(state) {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  };

  _proto.addTarget = function addTarget(plugin) {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  };

  _proto.unmount = function unmount() {
    if (this.isTargetDOMEl && this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  };

  _proto.install = function install() {};

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  return Plugin;
}();

/***/ }),

/***/ "../node_modules/@uppy/core/lib/index.js":
/*!***********************************************!*\
  !*** ../node_modules/@uppy/core/lib/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Translator = __webpack_require__(/*! @uppy/utils/lib/Translator */ "../node_modules/@uppy/utils/lib/Translator.js");

var ee = __webpack_require__(/*! namespace-emitter */ "../node_modules/namespace-emitter/index.js");

var cuid = __webpack_require__(/*! cuid */ "../node_modules/cuid/index.js");

var throttle = __webpack_require__(/*! lodash.throttle */ "../node_modules/lodash.throttle/index.js");

var prettierBytes = __webpack_require__(/*! @transloadit/prettier-bytes */ "../node_modules/@transloadit/prettier-bytes/prettierBytes.js");

var match = __webpack_require__(/*! mime-match */ "../node_modules/mime-match/index.js");

var DefaultStore = __webpack_require__(/*! @uppy/store-default */ "../node_modules/@uppy/store-default/lib/index.js");

var getFileType = __webpack_require__(/*! @uppy/utils/lib/getFileType */ "../node_modules/@uppy/utils/lib/getFileType.js");

var getFileNameAndExtension = __webpack_require__(/*! @uppy/utils/lib/getFileNameAndExtension */ "../node_modules/@uppy/utils/lib/getFileNameAndExtension.js");

var generateFileID = __webpack_require__(/*! @uppy/utils/lib/generateFileID */ "../node_modules/@uppy/utils/lib/generateFileID.js");

var supportsUploadProgress = __webpack_require__(/*! ./supportsUploadProgress */ "../node_modules/@uppy/core/lib/supportsUploadProgress.js");

var _require = __webpack_require__(/*! ./loggers */ "../node_modules/@uppy/core/lib/loggers.js"),
    justErrorsLogger = _require.justErrorsLogger,
    debugLogger = _require.debugLogger;

var Plugin = __webpack_require__(/*! ./Plugin */ "../node_modules/@uppy/core/lib/Plugin.js"); // Exported from here.


var RestrictionError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(RestrictionError, _Error);

  function RestrictionError() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Error.call.apply(_Error, [this].concat(args)) || this;
    _this.isRestriction = true;
    return _this;
  }

  return RestrictionError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */


var Uppy = /*#__PURE__*/function () {
  /**
   * Instantiate Uppy
   *
   * @param {object} opts — Uppy options
   */
  function Uppy(opts) {
    var _this2 = this;

    this.defaultLocale = {
      strings: {
        addBulkFilesFailed: {
          0: 'Failed to add %{smart_count} file due to an internal error',
          1: 'Failed to add %{smart_count} files due to internal errors'
        },
        youCanOnlyUploadX: {
          0: 'You can only upload %{smart_count} file',
          1: 'You can only upload %{smart_count} files'
        },
        youHaveToAtLeastSelectX: {
          0: 'You have to select at least %{smart_count} file',
          1: 'You have to select at least %{smart_count} files'
        },
        // The default `exceedsSize2` string only combines the `exceedsSize` string (%{backwardsCompat}) with the size.
        // Locales can override `exceedsSize2` to specify a different word order. This is for backwards compat with
        // Uppy 1.9.x and below which did a naive concatenation of `exceedsSize2 + size` instead of using a locale-specific
        // substitution.
        // TODO: In 2.0 `exceedsSize2` should be removed in and `exceedsSize` updated to use substitution.
        exceedsSize2: '%{backwardsCompat} %{size}',
        exceedsSize: 'This file exceeds maximum allowed size of',
        inferiorSize: 'This file is smaller than the allowed size of %{size}',
        youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
        noNewAlreadyUploading: 'Cannot add new files: already uploading',
        noDuplicates: 'Cannot add the duplicate file \'%{fileName}\', it already exists',
        companionError: 'Connection with Companion failed',
        companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
        failedToUpload: 'Failed to upload %{file}',
        noInternetConnection: 'No Internet connection',
        connectedToInternet: 'Connected to the Internet',
        // Strings for remote providers
        noFilesFound: 'You have no files or folders here',
        selectX: {
          0: 'Select %{smart_count}',
          1: 'Select %{smart_count}'
        },
        selectAllFilesFromFolderNamed: 'Select all files from folder %{name}',
        unselectAllFilesFromFolderNamed: 'Unselect all files from folder %{name}',
        selectFileNamed: 'Select file %{name}',
        unselectFileNamed: 'Unselect file %{name}',
        openFolderNamed: 'Open folder %{name}',
        cancel: 'Cancel',
        logOut: 'Log out',
        filter: 'Filter',
        resetFilter: 'Reset filter',
        loading: 'Loading...',
        authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
        authenticateWith: 'Connect to %{pluginName}',
        searchImages: 'Search for images',
        enterTextToSearch: 'Enter text to search for images',
        backToSearch: 'Back to Search',
        emptyFolderAdded: 'No files were added from empty folder',
        folderAdded: {
          0: 'Added %{smart_count} file from %{folder}',
          1: 'Added %{smart_count} files from %{folder}'
        }
      }
    };
    var defaultOptions = {
      id: 'uppy',
      autoProceed: false,
      allowMultipleUploads: true,
      debug: false,
      restrictions: {
        maxFileSize: null,
        minFileSize: null,
        maxTotalFileSize: null,
        maxNumberOfFiles: null,
        minNumberOfFiles: null,
        allowedFileTypes: null
      },
      meta: {},
      onBeforeFileAdded: function onBeforeFileAdded(currentFile, files) {
        return currentFile;
      },
      onBeforeUpload: function onBeforeUpload(files) {
        return files;
      },
      store: DefaultStore(),
      logger: justErrorsLogger,
      infoTimeout: 5000
    }; // Merge default options with the ones set by user,
    // making sure to merge restrictions too

    this.opts = _extends({}, defaultOptions, opts, {
      restrictions: _extends({}, defaultOptions.restrictions, opts && opts.restrictions)
    }); // Support debug: true for backwards-compatability, unless logger is set in opts
    // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions

    if (opts && opts.logger && opts.debug) {
      this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
    } else if (opts && opts.debug) {
      this.opts.logger = debugLogger;
    }

    this.log("Using Core v" + this.constructor.VERSION);

    if (this.opts.restrictions.allowedFileTypes && this.opts.restrictions.allowedFileTypes !== null && !Array.isArray(this.opts.restrictions.allowedFileTypes)) {
      throw new TypeError('`restrictions.allowedFileTypes` must be an array');
    }

    this.i18nInit(); // Container for different types of plugins

    this.plugins = {};
    this.getState = this.getState.bind(this);
    this.getPlugin = this.getPlugin.bind(this);
    this.setFileMeta = this.setFileMeta.bind(this);
    this.setFileState = this.setFileState.bind(this);
    this.log = this.log.bind(this);
    this.info = this.info.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.addFile = this.addFile.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.pauseResume = this.pauseResume.bind(this);
    this.validateRestrictions = this.validateRestrictions.bind(this); // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file, and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

    this._calculateProgress = throttle(this._calculateProgress.bind(this), 500, {
      leading: true,
      trailing: true
    });
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
    this.resetProgress = this.resetProgress.bind(this);
    this.pauseAll = this.pauseAll.bind(this);
    this.resumeAll = this.resumeAll.bind(this);
    this.retryAll = this.retryAll.bind(this);
    this.cancelAll = this.cancelAll.bind(this);
    this.retryUpload = this.retryUpload.bind(this);
    this.upload = this.upload.bind(this);
    this.emitter = ee();
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.once = this.emitter.once.bind(this.emitter);
    this.emit = this.emitter.emit.bind(this.emitter);
    this.preProcessors = [];
    this.uploaders = [];
    this.postProcessors = [];
    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      allowNewUpload: true,
      capabilities: {
        uploadProgress: supportsUploadProgress(),
        individualCancellation: true,
        resumableUploads: false
      },
      totalProgress: 0,
      meta: _extends({}, this.opts.meta),
      info: {
        isHidden: true,
        type: 'info',
        message: ''
      }
    });
    this._storeUnsubscribe = this.store.subscribe(function (prevState, nextState, patch) {
      _this2.emit('state-update', prevState, nextState, patch);

      _this2.updateAll(nextState);
    }); // Exposing uppy object on window for debugging and testing

    if (this.opts.debug && typeof window !== 'undefined') {
      window[this.opts.id] = this;
    }

    this._addListeners(); // Re-enable if we’ll need some capabilities on boot, like isMobileDevice
    // this._setCapabilities()

  } // _setCapabilities = () => {
  //   const capabilities = {
  //     isMobileDevice: isMobileDevice()
  //   }
  //   this.setState({
  //     ...this.getState().capabilities,
  //     capabilities
  //   })
  // }


  var _proto = Uppy.prototype;

  _proto.on = function on(event, callback) {
    this.emitter.on(event, callback);
    return this;
  };

  _proto.off = function off(event, callback) {
    this.emitter.off(event, callback);
    return this;
  }
  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */
  ;

  _proto.updateAll = function updateAll(state) {
    this.iteratePlugins(function (plugin) {
      plugin.update(state);
    });
  }
  /**
   * Updates state with a patch
   *
   * @param {object} patch {foo: 'bar'}
   */
  ;

  _proto.setState = function setState(patch) {
    this.store.setState(patch);
  }
  /**
   * Returns current state.
   *
   * @returns {object}
   */
  ;

  _proto.getState = function getState() {
    return this.store.getState();
  }
  /**
   * Back compat for when uppy.state is used instead of uppy.getState().
   */
  ;

  /**
   * Shorthand to set state for a specific file.
   */
  _proto.setFileState = function setFileState(fileID, state) {
    var _extends2;

    if (!this.getState().files[fileID]) {
      throw new Error("Can\u2019t set state for " + fileID + " (the file could have been removed)");
    }

    this.setState({
      files: _extends({}, this.getState().files, (_extends2 = {}, _extends2[fileID] = _extends({}, this.getState().files[fileID], state), _extends2))
    });
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.opts.locale]);
    this.locale = this.translator.locale;
    this.i18n = this.translator.translate.bind(this.translator);
    this.i18nArray = this.translator.translateArray.bind(this.translator);
  };

  _proto.setOptions = function setOptions(newOpts) {
    this.opts = _extends({}, this.opts, newOpts, {
      restrictions: _extends({}, this.opts.restrictions, newOpts && newOpts.restrictions)
    });

    if (newOpts.meta) {
      this.setMeta(newOpts.meta);
    }

    this.i18nInit();

    if (newOpts.locale) {
      this.iteratePlugins(function (plugin) {
        plugin.setOptions();
      });
    }

    this.setState(); // so that UI re-renders with new options
  };

  _proto.resetProgress = function resetProgress() {
    var defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: null
    };

    var files = _extends({}, this.getState().files);

    var updatedFiles = {};
    Object.keys(files).forEach(function (fileID) {
      var updatedFile = _extends({}, files[fileID]);

      updatedFile.progress = _extends({}, updatedFile.progress, defaultProgress);
      updatedFiles[fileID] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      totalProgress: 0
    });
    this.emit('reset-progress');
  };

  _proto.addPreProcessor = function addPreProcessor(fn) {
    this.preProcessors.push(fn);
  };

  _proto.removePreProcessor = function removePreProcessor(fn) {
    var i = this.preProcessors.indexOf(fn);

    if (i !== -1) {
      this.preProcessors.splice(i, 1);
    }
  };

  _proto.addPostProcessor = function addPostProcessor(fn) {
    this.postProcessors.push(fn);
  };

  _proto.removePostProcessor = function removePostProcessor(fn) {
    var i = this.postProcessors.indexOf(fn);

    if (i !== -1) {
      this.postProcessors.splice(i, 1);
    }
  };

  _proto.addUploader = function addUploader(fn) {
    this.uploaders.push(fn);
  };

  _proto.removeUploader = function removeUploader(fn) {
    var i = this.uploaders.indexOf(fn);

    if (i !== -1) {
      this.uploaders.splice(i, 1);
    }
  };

  _proto.setMeta = function setMeta(data) {
    var updatedMeta = _extends({}, this.getState().meta, data);

    var updatedFiles = _extends({}, this.getState().files);

    Object.keys(updatedFiles).forEach(function (fileID) {
      updatedFiles[fileID] = _extends({}, updatedFiles[fileID], {
        meta: _extends({}, updatedFiles[fileID].meta, data)
      });
    });
    this.log('Adding metadata:');
    this.log(data);
    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  };

  _proto.setFileMeta = function setFileMeta(fileID, data) {
    var updatedFiles = _extends({}, this.getState().files);

    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that has been removed: ', fileID);
      return;
    }

    var newMeta = _extends({}, updatedFiles[fileID].meta, data);

    updatedFiles[fileID] = _extends({}, updatedFiles[fileID], {
      meta: newMeta
    });
    this.setState({
      files: updatedFiles
    });
  }
  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */
  ;

  _proto.getFile = function getFile(fileID) {
    return this.getState().files[fileID];
  }
  /**
   * Get all files in an array.
   */
  ;

  _proto.getFiles = function getFiles() {
    var _this$getState = this.getState(),
        files = _this$getState.files;

    return Object.keys(files).map(function (fileID) {
      return files[fileID];
    });
  }
  /**
   * A public wrapper for _checkRestrictions — checks if a file passes a set of restrictions.
   * For use in UI pluigins (like Providers), to disallow selecting files that won’t pass restrictions.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @returns {object} { result: true/false, reason: why file didn’t pass restrictions }
   */
  ;

  _proto.validateRestrictions = function validateRestrictions(file, files) {
    try {
      this._checkRestrictions(file, files);

      return {
        result: true
      };
    } catch (err) {
      return {
        result: false,
        reason: err.message
      };
    }
  }
  /**
   * Check if file passes a set of restrictions set in options: maxFileSize, minFileSize,
   * maxNumberOfFiles and allowedFileTypes.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @private
   */
  ;

  _proto._checkRestrictions = function _checkRestrictions(file, files) {
    if (files === void 0) {
      files = this.getFiles();
    }

    var _this$opts$restrictio = this.opts.restrictions,
        maxFileSize = _this$opts$restrictio.maxFileSize,
        minFileSize = _this$opts$restrictio.minFileSize,
        maxTotalFileSize = _this$opts$restrictio.maxTotalFileSize,
        maxNumberOfFiles = _this$opts$restrictio.maxNumberOfFiles,
        allowedFileTypes = _this$opts$restrictio.allowedFileTypes;

    if (maxNumberOfFiles) {
      if (files.length + 1 > maxNumberOfFiles) {
        throw new RestrictionError("" + this.i18n('youCanOnlyUploadX', {
          smart_count: maxNumberOfFiles
        }));
      }
    }

    if (allowedFileTypes) {
      var isCorrectFileType = allowedFileTypes.some(function (type) {
        // check if this is a mime-type
        if (type.indexOf('/') > -1) {
          if (!file.type) return false;
          return match(file.type.replace(/;.*?$/, ''), type);
        } // otherwise this is likely an extension


        if (type[0] === '.' && file.extension) {
          return file.extension.toLowerCase() === type.substr(1).toLowerCase();
        }

        return false;
      });

      if (!isCorrectFileType) {
        var allowedFileTypesString = allowedFileTypes.join(', ');
        throw new RestrictionError(this.i18n('youCanOnlyUploadFileTypes', {
          types: allowedFileTypesString
        }));
      }
    } // We can't check maxTotalFileSize if the size is unknown.


    if (maxTotalFileSize && file.size != null) {
      var totalFilesSize = 0;
      totalFilesSize += file.size;
      files.forEach(function (file) {
        totalFilesSize += file.size;
      });

      if (totalFilesSize > maxTotalFileSize) {
        throw new RestrictionError(this.i18n('exceedsSize2', {
          backwardsCompat: this.i18n('exceedsSize'),
          size: prettierBytes(maxTotalFileSize)
        }));
      }
    } // We can't check maxFileSize if the size is unknown.


    if (maxFileSize && file.size != null) {
      if (file.size > maxFileSize) {
        throw new RestrictionError(this.i18n('exceedsSize2', {
          backwardsCompat: this.i18n('exceedsSize'),
          size: prettierBytes(maxFileSize)
        }));
      }
    } // We can't check minFileSize if the size is unknown.


    if (minFileSize && file.size != null) {
      if (file.size < minFileSize) {
        throw new RestrictionError(this.i18n('inferiorSize', {
          size: prettierBytes(minFileSize)
        }));
      }
    }
  }
  /**
   * Check if minNumberOfFiles restriction is reached before uploading.
   *
   * @private
   */
  ;

  _proto._checkMinNumberOfFiles = function _checkMinNumberOfFiles(files) {
    var minNumberOfFiles = this.opts.restrictions.minNumberOfFiles;

    if (Object.keys(files).length < minNumberOfFiles) {
      throw new RestrictionError("" + this.i18n('youHaveToAtLeastSelectX', {
        smart_count: minNumberOfFiles
      }));
    }
  }
  /**
   * Logs an error, sets Informer message, then throws the error.
   * Emits a 'restriction-failed' event if it’s a restriction error
   *
   * @param {object | string} err — Error object or plain string message
   * @param {object} [options]
   * @param {boolean} [options.showInformer=true] — Sometimes developer might want to show Informer manually
   * @param {object} [options.file=null] — File object used to emit the restriction error
   * @param {boolean} [options.throwErr=true] — Errors shouldn’t be thrown, for example, in `upload-error` event
   * @private
   */
  ;

  _proto._showOrLogErrorAndThrow = function _showOrLogErrorAndThrow(err, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$showInformer = _ref.showInformer,
        showInformer = _ref$showInformer === void 0 ? true : _ref$showInformer,
        _ref$file = _ref.file,
        file = _ref$file === void 0 ? null : _ref$file,
        _ref$throwErr = _ref.throwErr,
        throwErr = _ref$throwErr === void 0 ? true : _ref$throwErr;

    var message = typeof err === 'object' ? err.message : err;
    var details = typeof err === 'object' && err.details ? err.details : ''; // Restriction errors should be logged, but not as errors,
    // as they are expected and shown in the UI.

    var logMessageWithDetails = message;

    if (details) {
      logMessageWithDetails += ' ' + details;
    }

    if (err.isRestriction) {
      this.log(logMessageWithDetails);
      this.emit('restriction-failed', file, err);
    } else {
      this.log(logMessageWithDetails, 'error');
    } // Sometimes informer has to be shown manually by the developer,
    // for example, in `onBeforeFileAdded`.


    if (showInformer) {
      this.info({
        message: message,
        details: details
      }, 'error', this.opts.infoTimeout);
    }

    if (throwErr) {
      throw typeof err === 'object' ? err : new Error(err);
    }
  };

  _proto._assertNewUploadAllowed = function _assertNewUploadAllowed(file) {
    var _this$getState2 = this.getState(),
        allowNewUpload = _this$getState2.allowNewUpload;

    if (allowNewUpload === false) {
      this._showOrLogErrorAndThrow(new RestrictionError(this.i18n('noNewAlreadyUploading')), {
        file: file
      });
    }
  }
  /**
   * Create a file state object based on user-provided `addFile()` options.
   *
   * Note this is extremely side-effectful and should only be done when a file state object will be added to state immediately afterward!
   *
   * The `files` value is passed in because it may be updated by the caller without updating the store.
   */
  ;

  _proto._checkAndCreateFileStateObject = function _checkAndCreateFileStateObject(files, file) {
    var fileType = getFileType(file);
    file.type = fileType;
    var onBeforeFileAddedResult = this.opts.onBeforeFileAdded(file, files);

    if (onBeforeFileAddedResult === false) {
      // Don’t show UI info for this error, as it should be done by the developer
      this._showOrLogErrorAndThrow(new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.'), {
        showInformer: false,
        file: file
      });
    }

    if (typeof onBeforeFileAddedResult === 'object' && onBeforeFileAddedResult) {
      file = onBeforeFileAddedResult;
    }

    var fileName;

    if (file.name) {
      fileName = file.name;
    } else if (fileType.split('/')[0] === 'image') {
      fileName = fileType.split('/')[0] + '.' + fileType.split('/')[1];
    } else {
      fileName = 'noname';
    }

    var fileExtension = getFileNameAndExtension(fileName).extension;
    var isRemote = file.isRemote || false;
    var fileID = generateFileID(file);

    if (files[fileID]) {
      this._showOrLogErrorAndThrow(new RestrictionError(this.i18n('noDuplicates', {
        fileName: fileName
      })), {
        file: file
      });
    }

    var meta = file.meta || {};
    meta.name = fileName;
    meta.type = fileType; // `null` means the size is unknown.

    var size = isFinite(file.data.size) ? file.data.size : null;
    var newFile = {
      source: file.source || '',
      id: fileID,
      name: fileName,
      extension: fileExtension || '',
      meta: _extends({}, this.getState().meta, meta),
      type: fileType,
      data: file.data,
      progress: {
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: size,
        uploadComplete: false,
        uploadStarted: null
      },
      size: size,
      isRemote: isRemote,
      remote: file.remote || '',
      preview: file.preview
    };

    try {
      var filesArray = Object.keys(files).map(function (i) {
        return files[i];
      });

      this._checkRestrictions(newFile, filesArray);
    } catch (err) {
      this._showOrLogErrorAndThrow(err, {
        file: newFile
      });
    }

    return newFile;
  } // Schedule an upload if `autoProceed` is enabled.
  ;

  _proto._startIfAutoProceed = function _startIfAutoProceed() {
    var _this3 = this;

    if (this.opts.autoProceed && !this.scheduledAutoProceed) {
      this.scheduledAutoProceed = setTimeout(function () {
        _this3.scheduledAutoProceed = null;

        _this3.upload().catch(function (err) {
          if (!err.isRestriction) {
            _this3.log(err.stack || err.message || err);
          }
        });
      }, 4);
    }
  }
  /**
   * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
   * try to guess file type in a clever way, check file against restrictions,
   * and start an upload if `autoProceed === true`.
   *
   * @param {object} file object to add
   * @returns {string} id for the added file
   */
  ;

  _proto.addFile = function addFile(file) {
    var _extends3;

    this._assertNewUploadAllowed(file);

    var _this$getState3 = this.getState(),
        files = _this$getState3.files;

    var newFile = this._checkAndCreateFileStateObject(files, file);

    this.setState({
      files: _extends({}, files, (_extends3 = {}, _extends3[newFile.id] = newFile, _extends3))
    });
    this.emit('file-added', newFile);
    this.emit('files-added', [newFile]);
    this.log("Added file: " + newFile.name + ", " + newFile.id + ", mime type: " + newFile.type);

    this._startIfAutoProceed();

    return newFile.id;
  }
  /**
   * Add multiple files to `state.files`. See the `addFile()` documentation.
   *
   * This cuts some corners for performance, so should typically only be used in cases where there may be a lot of files.
   *
   * If an error occurs while adding a file, it is logged and the user is notified. This is good for UI plugins, but not for programmatic use. Programmatic users should usually still use `addFile()` on individual files.
   */
  ;

  _proto.addFiles = function addFiles(fileDescriptors) {
    var _this4 = this;

    this._assertNewUploadAllowed(); // create a copy of the files object only once


    var files = _extends({}, this.getState().files);

    var newFiles = [];
    var errors = [];

    for (var i = 0; i < fileDescriptors.length; i++) {
      try {
        var newFile = this._checkAndCreateFileStateObject(files, fileDescriptors[i]);

        newFiles.push(newFile);
        files[newFile.id] = newFile;
      } catch (err) {
        if (!err.isRestriction) {
          errors.push(err);
        }
      }
    }

    this.setState({
      files: files
    });
    newFiles.forEach(function (newFile) {
      _this4.emit('file-added', newFile);
    });
    this.emit('files-added', newFiles);

    if (newFiles.length > 5) {
      this.log("Added batch of " + newFiles.length + " files");
    } else {
      Object.keys(newFiles).forEach(function (fileID) {
        _this4.log("Added file: " + newFiles[fileID].name + "\n id: " + newFiles[fileID].id + "\n type: " + newFiles[fileID].type);
      });
    }

    if (newFiles.length > 0) {
      this._startIfAutoProceed();
    }

    if (errors.length > 0) {
      var message = 'Multiple errors occurred while adding files:\n';
      errors.forEach(function (subError) {
        message += "\n * " + subError.message;
      });
      this.info({
        message: this.i18n('addBulkFilesFailed', {
          smart_count: errors.length
        }),
        details: message
      }, 'error', this.opts.infoTimeout);
      var err = new Error(message);
      err.errors = errors;
      throw err;
    }
  };

  _proto.removeFiles = function removeFiles(fileIDs, reason) {
    var _this5 = this;

    var _this$getState4 = this.getState(),
        files = _this$getState4.files,
        currentUploads = _this$getState4.currentUploads;

    var updatedFiles = _extends({}, files);

    var updatedUploads = _extends({}, currentUploads);

    var removedFiles = Object.create(null);
    fileIDs.forEach(function (fileID) {
      if (files[fileID]) {
        removedFiles[fileID] = files[fileID];
        delete updatedFiles[fileID];
      }
    }); // Remove files from the `fileIDs` list in each upload.

    function fileIsNotRemoved(uploadFileID) {
      return removedFiles[uploadFileID] === undefined;
    }

    var uploadsToRemove = [];
    Object.keys(updatedUploads).forEach(function (uploadID) {
      var newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved); // Remove the upload if no files are associated with it anymore.

      if (newFileIDs.length === 0) {
        uploadsToRemove.push(uploadID);
        return;
      }

      updatedUploads[uploadID] = _extends({}, currentUploads[uploadID], {
        fileIDs: newFileIDs
      });
    });
    uploadsToRemove.forEach(function (uploadID) {
      delete updatedUploads[uploadID];
    });
    var stateUpdate = {
      currentUploads: updatedUploads,
      files: updatedFiles
    }; // If all files were removed - allow new uploads!

    if (Object.keys(updatedFiles).length === 0) {
      stateUpdate.allowNewUpload = true;
      stateUpdate.error = null;
    }

    this.setState(stateUpdate);

    this._calculateTotalProgress();

    var removedFileIDs = Object.keys(removedFiles);
    removedFileIDs.forEach(function (fileID) {
      _this5.emit('file-removed', removedFiles[fileID], reason);
    });

    if (removedFileIDs.length > 5) {
      this.log("Removed " + removedFileIDs.length + " files");
    } else {
      this.log("Removed files: " + removedFileIDs.join(', '));
    }
  };

  _proto.removeFile = function removeFile(fileID, reason) {
    if (reason === void 0) {
      reason = null;
    }

    this.removeFiles([fileID], reason);
  };

  _proto.pauseResume = function pauseResume(fileID) {
    if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
      return;
    }

    var wasPaused = this.getFile(fileID).isPaused || false;
    var isPaused = !wasPaused;
    this.setFileState(fileID, {
      isPaused: isPaused
    });
    this.emit('upload-pause', fileID, isPaused);
    return isPaused;
  };

  _proto.pauseAll = function pauseAll() {
    var updatedFiles = _extends({}, this.getState().files);

    var inProgressUpdatedFiles = Object.keys(updatedFiles).filter(function (file) {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: true
      });

      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('pause-all');
  };

  _proto.resumeAll = function resumeAll() {
    var updatedFiles = _extends({}, this.getState().files);

    var inProgressUpdatedFiles = Object.keys(updatedFiles).filter(function (file) {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: false,
        error: null
      });

      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('resume-all');
  };

  _proto.retryAll = function retryAll() {
    var updatedFiles = _extends({}, this.getState().files);

    var filesToRetry = Object.keys(updatedFiles).filter(function (file) {
      return updatedFiles[file].error;
    });
    filesToRetry.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: false,
        error: null
      });

      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });
    this.emit('retry-all', filesToRetry);

    if (filesToRetry.length === 0) {
      return Promise.resolve({
        successful: [],
        failed: []
      });
    }

    var uploadID = this._createUpload(filesToRetry, {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return this._runUpload(uploadID);
  };

  _proto.cancelAll = function cancelAll() {
    this.emit('cancel-all');

    var _this$getState5 = this.getState(),
        files = _this$getState5.files;

    var fileIDs = Object.keys(files);

    if (fileIDs.length) {
      this.removeFiles(fileIDs, 'cancel-all');
    }

    this.setState({
      totalProgress: 0,
      error: null
    });
  };

  _proto.retryUpload = function retryUpload(fileID) {
    this.setFileState(fileID, {
      error: null,
      isPaused: false
    });
    this.emit('upload-retry', fileID);

    var uploadID = this._createUpload([fileID], {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return this._runUpload(uploadID);
  };

  _proto.reset = function reset() {
    this.cancelAll();
  };

  _proto._calculateProgress = function _calculateProgress(file, data) {
    if (!this.getFile(file.id)) {
      this.log("Not setting progress for a file that has been removed: " + file.id);
      return;
    } // bytesTotal may be null or zero; in that case we can't divide by it


    var canHavePercentage = isFinite(data.bytesTotal) && data.bytesTotal > 0;
    this.setFileState(file.id, {
      progress: _extends({}, this.getFile(file.id).progress, {
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: canHavePercentage // TODO(goto-bus-stop) flooring this should probably be the choice of the UI?
        // we get more accurate calculations if we don't round this at all.
        ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
      })
    });

    this._calculateTotalProgress();
  };

  _proto._calculateTotalProgress = function _calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    var files = this.getFiles();
    var inProgress = files.filter(function (file) {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });

    if (inProgress.length === 0) {
      this.emit('progress', 0);
      this.setState({
        totalProgress: 0
      });
      return;
    }

    var sizedFiles = inProgress.filter(function (file) {
      return file.progress.bytesTotal != null;
    });
    var unsizedFiles = inProgress.filter(function (file) {
      return file.progress.bytesTotal == null;
    });

    if (sizedFiles.length === 0) {
      var progressMax = inProgress.length * 100;
      var currentProgress = unsizedFiles.reduce(function (acc, file) {
        return acc + file.progress.percentage;
      }, 0);

      var _totalProgress = Math.round(currentProgress / progressMax * 100);

      this.setState({
        totalProgress: _totalProgress
      });
      return;
    }

    var totalSize = sizedFiles.reduce(function (acc, file) {
      return acc + file.progress.bytesTotal;
    }, 0);
    var averageSize = totalSize / sizedFiles.length;
    totalSize += averageSize * unsizedFiles.length;
    var uploadedSize = 0;
    sizedFiles.forEach(function (file) {
      uploadedSize += file.progress.bytesUploaded;
    });
    unsizedFiles.forEach(function (file) {
      uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
    });
    var totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100); // hot fix, because:
    // uploadedSize ended up larger than totalSize, resulting in 1325% total

    if (totalProgress > 100) {
      totalProgress = 100;
    }

    this.setState({
      totalProgress: totalProgress
    });
    this.emit('progress', totalProgress);
  }
  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-removed`, `upload-progress`
   */
  ;

  _proto._addListeners = function _addListeners() {
    var _this6 = this;

    this.on('error', function (error) {
      var errorMsg = 'Unknown error';

      if (error.message) {
        errorMsg = error.message;
      }

      if (error.details) {
        errorMsg += ' ' + error.details;
      }

      _this6.setState({
        error: errorMsg
      });
    });
    this.on('upload-error', function (file, error, response) {
      var errorMsg = 'Unknown error';

      if (error.message) {
        errorMsg = error.message;
      }

      if (error.details) {
        errorMsg += ' ' + error.details;
      }

      _this6.setFileState(file.id, {
        error: errorMsg,
        response: response
      });

      _this6.setState({
        error: error.message
      });

      if (typeof error === 'object' && error.message) {
        var newError = new Error(error.message);
        newError.details = error.message;

        if (error.details) {
          newError.details += ' ' + error.details;
        }

        newError.message = _this6.i18n('failedToUpload', {
          file: file.name
        });

        _this6._showOrLogErrorAndThrow(newError, {
          throwErr: false
        });
      } else {
        _this6._showOrLogErrorAndThrow(error, {
          throwErr: false
        });
      }
    });
    this.on('upload', function () {
      _this6.setState({
        error: null
      });
    });
    this.on('upload-started', function (file, upload) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      _this6.setFileState(file.id, {
        progress: {
          uploadStarted: Date.now(),
          uploadComplete: false,
          percentage: 0,
          bytesUploaded: 0,
          bytesTotal: file.size
        }
      });
    });
    this.on('upload-progress', this._calculateProgress);
    this.on('upload-success', function (file, uploadResp) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      var currentProgress = _this6.getFile(file.id).progress;

      _this6.setFileState(file.id, {
        progress: _extends({}, currentProgress, {
          postprocess: _this6.postProcessors.length > 0 ? {
            mode: 'indeterminate'
          } : null,
          uploadComplete: true,
          percentage: 100,
          bytesUploaded: currentProgress.bytesTotal
        }),
        response: uploadResp,
        uploadURL: uploadResp.uploadURL,
        isPaused: false
      });

      _this6._calculateTotalProgress();
    });
    this.on('preprocess-progress', function (file, progress) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      _this6.setFileState(file.id, {
        progress: _extends({}, _this6.getFile(file.id).progress, {
          preprocess: progress
        })
      });
    });
    this.on('preprocess-complete', function (file) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      var files = _extends({}, _this6.getState().files);

      files[file.id] = _extends({}, files[file.id], {
        progress: _extends({}, files[file.id].progress)
      });
      delete files[file.id].progress.preprocess;

      _this6.setState({
        files: files
      });
    });
    this.on('postprocess-progress', function (file, progress) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      _this6.setFileState(file.id, {
        progress: _extends({}, _this6.getState().files[file.id].progress, {
          postprocess: progress
        })
      });
    });
    this.on('postprocess-complete', function (file) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      var files = _extends({}, _this6.getState().files);

      files[file.id] = _extends({}, files[file.id], {
        progress: _extends({}, files[file.id].progress)
      });
      delete files[file.id].progress.postprocess; // TODO should we set some kind of `fullyComplete` property on the file object
      // so it's easier to see that the file is upload…fully complete…rather than
      // what we have to do now (`uploadComplete && !postprocess`)

      _this6.setState({
        files: files
      });
    });
    this.on('restored', function () {
      // Files may have changed--ensure progress is still accurate.
      _this6._calculateTotalProgress();
    }); // show informer if offline

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('online', function () {
        return _this6.updateOnlineStatus();
      });
      window.addEventListener('offline', function () {
        return _this6.updateOnlineStatus();
      });
      setTimeout(function () {
        return _this6.updateOnlineStatus();
      }, 3000);
    }
  };

  _proto.updateOnlineStatus = function updateOnlineStatus() {
    var online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;

    if (!online) {
      this.emit('is-offline');
      this.info(this.i18n('noInternetConnection'), 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');

      if (this.wasOffline) {
        this.emit('back-online');
        this.info(this.i18n('connectedToInternet'), 'success', 3000);
        this.wasOffline = false;
      }
    }
  };

  _proto.getID = function getID() {
    return this.opts.id;
  }
  /**
   * Registers a plugin with Core.
   *
   * @param {object} Plugin object
   * @param {object} [opts] object with options to be passed to Plugin
   * @returns {object} self for chaining
   */
  ;

  _proto.use = function use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      var msg = "Expected a plugin class, but got " + (Plugin === null ? 'null' : typeof Plugin) + "." + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    } // Instantiate


    var plugin = new Plugin(this, opts);
    var pluginId = plugin.id;
    this.plugins[plugin.type] = this.plugins[plugin.type] || [];

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    var existsPluginAlready = this.getPlugin(pluginId);

    if (existsPluginAlready) {
      var _msg = "Already found a plugin named '" + existsPluginAlready.id + "'. " + ("Tried to use: '" + pluginId + "'.\n") + 'Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.';

      throw new Error(_msg);
    }

    if (Plugin.VERSION) {
      this.log("Using " + pluginId + " v" + Plugin.VERSION);
    }

    this.plugins[plugin.type].push(plugin);
    plugin.install();
    return this;
  }
  /**
   * Find one Plugin by name.
   *
   * @param {string} id plugin id
   * @returns {object|boolean}
   */
  ;

  _proto.getPlugin = function getPlugin(id) {
    var foundPlugin = null;
    this.iteratePlugins(function (plugin) {
      if (plugin.id === id) {
        foundPlugin = plugin;
        return false;
      }
    });
    return foundPlugin;
  }
  /**
   * Iterate through all `use`d plugins.
   *
   * @param {Function} method that will be run on each plugin
   */
  ;

  _proto.iteratePlugins = function iteratePlugins(method) {
    var _this7 = this;

    Object.keys(this.plugins).forEach(function (pluginType) {
      _this7.plugins[pluginType].forEach(method);
    });
  }
  /**
   * Uninstall and remove a plugin.
   *
   * @param {object} instance The plugin instance to remove.
   */
  ;

  _proto.removePlugin = function removePlugin(instance) {
    this.log("Removing plugin " + instance.id);
    this.emit('plugin-remove', instance);

    if (instance.uninstall) {
      instance.uninstall();
    }

    var list = this.plugins[instance.type].slice();
    var index = list.indexOf(instance);

    if (index !== -1) {
      list.splice(index, 1);
      this.plugins[instance.type] = list;
    }

    var updatedState = this.getState();
    delete updatedState.plugins[instance.id];
    this.setState(updatedState);
  }
  /**
   * Uninstall all plugins and close down this Uppy instance.
   */
  ;

  _proto.close = function close() {
    var _this8 = this;

    this.log("Closing Uppy instance " + this.opts.id + ": removing all files and uninstalling plugins");
    this.reset();

    this._storeUnsubscribe();

    this.iteratePlugins(function (plugin) {
      _this8.removePlugin(plugin);
    });
  }
  /**
   * Set info message in `state.info`, so that UI plugins like `Informer`
   * can display the message.
   *
   * @param {string | object} message Message to be displayed by the informer
   * @param {string} [type]
   * @param {number} [duration]
   */
  ;

  _proto.info = function info(message, type, duration) {
    if (type === void 0) {
      type = 'info';
    }

    if (duration === void 0) {
      duration = 3000;
    }

    var isComplexMessage = typeof message === 'object';
    this.setState({
      info: {
        isHidden: false,
        type: type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }
    });
    this.emit('info-visible');
    clearTimeout(this.infoTimeoutID);

    if (duration === 0) {
      this.infoTimeoutID = undefined;
      return;
    } // hide the informer after `duration` milliseconds


    this.infoTimeoutID = setTimeout(this.hideInfo, duration);
  };

  _proto.hideInfo = function hideInfo() {
    var newInfo = _extends({}, this.getState().info, {
      isHidden: true
    });

    this.setState({
      info: newInfo
    });
    this.emit('info-hidden');
  }
  /**
   * Passes messages to a function, provided in `opts.logger`.
   * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
   *
   * @param {string|object} message to log
   * @param {string} [type] optional `error` or `warning`
   */
  ;

  _proto.log = function log(message, type) {
    var logger = this.opts.logger;

    switch (type) {
      case 'error':
        logger.error(message);
        break;

      case 'warning':
        logger.warn(message);
        break;

      default:
        logger.debug(message);
        break;
    }
  }
  /**
   * Obsolete, event listeners are now added in the constructor.
   */
  ;

  _proto.run = function run() {
    this.log('Calling run() is no longer necessary.', 'warning');
    return this;
  }
  /**
   * Restore an upload by its ID.
   */
  ;

  _proto.restore = function restore(uploadID) {
    this.log("Core: attempting to restore upload \"" + uploadID + "\"");

    if (!this.getState().currentUploads[uploadID]) {
      this._removeUpload(uploadID);

      return Promise.reject(new Error('Nonexistent upload'));
    }

    return this._runUpload(uploadID);
  }
  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @returns {string} ID of this upload.
   */
  ;

  _proto._createUpload = function _createUpload(fileIDs, opts) {
    var _extends4;

    if (opts === void 0) {
      opts = {};
    }

    var _opts = opts,
        _opts$forceAllowNewUp = _opts.forceAllowNewUpload,
        forceAllowNewUpload = _opts$forceAllowNewUp === void 0 ? false : _opts$forceAllowNewUp;

    var _this$getState6 = this.getState(),
        allowNewUpload = _this$getState6.allowNewUpload,
        currentUploads = _this$getState6.currentUploads;

    if (!allowNewUpload && !forceAllowNewUpload) {
      throw new Error('Cannot create a new upload: already uploading.');
    }

    var uploadID = cuid();
    this.emit('upload', {
      id: uploadID,
      fileIDs: fileIDs
    });
    this.setState({
      allowNewUpload: this.opts.allowMultipleUploads !== false,
      currentUploads: _extends({}, currentUploads, (_extends4 = {}, _extends4[uploadID] = {
        fileIDs: fileIDs,
        step: 0,
        result: {}
      }, _extends4))
    });
    return uploadID;
  };

  _proto._getUpload = function _getUpload(uploadID) {
    var _this$getState7 = this.getState(),
        currentUploads = _this$getState7.currentUploads;

    return currentUploads[uploadID];
  }
  /**
   * Add data to an upload's result object.
   *
   * @param {string} uploadID The ID of the upload.
   * @param {object} data Data properties to add to the result object.
   */
  ;

  _proto.addResultData = function addResultData(uploadID, data) {
    var _extends5;

    if (!this._getUpload(uploadID)) {
      this.log("Not setting result for an upload that has been removed: " + uploadID);
      return;
    }

    var currentUploads = this.getState().currentUploads;

    var currentUpload = _extends({}, currentUploads[uploadID], {
      result: _extends({}, currentUploads[uploadID].result, data)
    });

    this.setState({
      currentUploads: _extends({}, currentUploads, (_extends5 = {}, _extends5[uploadID] = currentUpload, _extends5))
    });
  }
  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */
  ;

  _proto._removeUpload = function _removeUpload(uploadID) {
    var currentUploads = _extends({}, this.getState().currentUploads);

    delete currentUploads[uploadID];
    this.setState({
      currentUploads: currentUploads
    });
  }
  /**
   * Run an upload. This picks up where it left off in case the upload is being restored.
   *
   * @private
   */
  ;

  _proto._runUpload = function _runUpload(uploadID) {
    var _this9 = this;

    var uploadData = this.getState().currentUploads[uploadID];
    var restoreStep = uploadData.step;
    var steps = [].concat(this.preProcessors, this.uploaders, this.postProcessors);
    var lastStep = Promise.resolve();
    steps.forEach(function (fn, step) {
      // Skip this step if we are restoring and have already completed this step before.
      if (step < restoreStep) {
        return;
      }

      lastStep = lastStep.then(function () {
        var _extends6;

        var _this9$getState = _this9.getState(),
            currentUploads = _this9$getState.currentUploads;

        var currentUpload = currentUploads[uploadID];

        if (!currentUpload) {
          return;
        }

        var updatedUpload = _extends({}, currentUpload, {
          step: step
        });

        _this9.setState({
          currentUploads: _extends({}, currentUploads, (_extends6 = {}, _extends6[uploadID] = updatedUpload, _extends6))
        }); // TODO give this the `updatedUpload` object as its only parameter maybe?
        // Otherwise when more metadata may be added to the upload this would keep getting more parameters


        return fn(updatedUpload.fileIDs, uploadID);
      }).then(function (result) {
        return null;
      });
    }); // Not returning the `catch`ed promise, because we still want to return a rejected
    // promise from this method if the upload failed.

    lastStep.catch(function (err) {
      _this9.emit('error', err, uploadID);

      _this9._removeUpload(uploadID);
    });
    return lastStep.then(function () {
      // Set result data.
      var _this9$getState2 = _this9.getState(),
          currentUploads = _this9$getState2.currentUploads;

      var currentUpload = currentUploads[uploadID];

      if (!currentUpload) {
        return;
      }

      var files = currentUpload.fileIDs.map(function (fileID) {
        return _this9.getFile(fileID);
      });
      var successful = files.filter(function (file) {
        return !file.error;
      });
      var failed = files.filter(function (file) {
        return file.error;
      });

      _this9.addResultData(uploadID, {
        successful: successful,
        failed: failed,
        uploadID: uploadID
      });
    }).then(function () {
      // Emit completion events.
      // This is in a separate function so that the `currentUploads` variable
      // always refers to the latest state. In the handler right above it refers
      // to an outdated object without the `.result` property.
      var _this9$getState3 = _this9.getState(),
          currentUploads = _this9$getState3.currentUploads;

      if (!currentUploads[uploadID]) {
        return;
      }

      var currentUpload = currentUploads[uploadID];
      var result = currentUpload.result;

      _this9.emit('complete', result);

      _this9._removeUpload(uploadID);

      return result;
    }).then(function (result) {
      if (result == null) {
        _this9.log("Not setting result for an upload that has been removed: " + uploadID);
      }

      return result;
    });
  }
  /**
   * Start an upload for all the files that are not currently being uploaded.
   *
   * @returns {Promise}
   */
  ;

  _proto.upload = function upload() {
    var _this10 = this;

    if (!this.plugins.uploader) {
      this.log('No uploader type plugins are used', 'warning');
    }

    var files = this.getState().files;
    var onBeforeUploadResult = this.opts.onBeforeUpload(files);

    if (onBeforeUploadResult === false) {
      return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
    }

    if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
      files = onBeforeUploadResult; // Updating files in state, because uploader plugins receive file IDs,
      // and then fetch the actual file object from state

      this.setState({
        files: files
      });
    }

    return Promise.resolve().then(function () {
      return _this10._checkMinNumberOfFiles(files);
    }).catch(function (err) {
      _this10._showOrLogErrorAndThrow(err);
    }).then(function () {
      var _this10$getState = _this10.getState(),
          currentUploads = _this10$getState.currentUploads; // get a list of files that are currently assigned to uploads


      var currentlyUploadingFiles = Object.keys(currentUploads).reduce(function (prev, curr) {
        return prev.concat(currentUploads[curr].fileIDs);
      }, []);
      var waitingFileIDs = [];
      Object.keys(files).forEach(function (fileID) {
        var file = _this10.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..


        if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
          waitingFileIDs.push(file.id);
        }
      });

      var uploadID = _this10._createUpload(waitingFileIDs);

      return _this10._runUpload(uploadID);
    }).catch(function (err) {
      _this10._showOrLogErrorAndThrow(err, {
        showInformer: false
      });
    });
  };

  _createClass(Uppy, [{
    key: "state",
    get: function get() {
      return this.getState();
    }
  }]);

  return Uppy;
}();

Uppy.VERSION = "1.15.0";

module.exports = function (opts) {
  return new Uppy(opts);
}; // Expose class constructor.


module.exports.Uppy = Uppy;
module.exports.Plugin = Plugin;
module.exports.debugLogger = debugLogger;

/***/ }),

/***/ "../node_modules/@uppy/core/lib/loggers.js":
/*!*************************************************!*\
  !*** ../node_modules/@uppy/core/lib/loggers.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getTimeStamp = __webpack_require__(/*! @uppy/utils/lib/getTimeStamp */ "../node_modules/@uppy/utils/lib/getTimeStamp.js"); // Swallow all logs, except errors.
// default if logger is not set or debug: false


var justErrorsLogger = {
  debug: function debug() {},
  warn: function warn() {},
  error: function error() {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_console = console).error.apply(_console, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  }
}; // Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true

var debugLogger = {
  debug: function debug() {
    // IE 10 doesn’t support console.debug
    var debug = console.debug || console.log;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    debug.call.apply(debug, [console, "[Uppy] [" + getTimeStamp() + "]"].concat(args));
  },
  warn: function warn() {
    var _console2;

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return (_console2 = console).warn.apply(_console2, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  },
  error: function error() {
    var _console3;

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return (_console3 = console).error.apply(_console3, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  }
};
module.exports = {
  justErrorsLogger: justErrorsLogger,
  debugLogger: debugLogger
};

/***/ }),

/***/ "../node_modules/@uppy/core/lib/supportsUploadProgress.js":
/*!****************************************************************!*\
  !*** ../node_modules/@uppy/core/lib/supportsUploadProgress.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
module.exports = function supportsUploadProgress(userAgent) {
  // Allow passing in userAgent for tests
  if (userAgent == null) {
    userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  } // Assume it works because basically everything supports progress events.


  if (!userAgent) return true;
  var m = /Edge\/(\d+\.\d+)/.exec(userAgent);
  if (!m) return true;
  var edgeVersion = m[1];

  var _edgeVersion$split = edgeVersion.split('.'),
      major = _edgeVersion$split[0],
      minor = _edgeVersion$split[1];

  major = parseInt(major, 10);
  minor = parseInt(minor, 10); // Worked before:
  // Edge 40.15063.0.0
  // Microsoft EdgeHTML 15.15063

  if (major < 15 || major === 15 && minor < 15063) {
    return true;
  } // Fixed in:
  // Microsoft EdgeHTML 18.18218


  if (major > 18 || major === 18 && minor >= 18218) {
    return true;
  } // other versions don't work.


  return false;
};

/***/ }),

/***/ "../node_modules/@uppy/file-input/lib/index.js":
/*!*****************************************************!*\
  !*** ../node_modules/@uppy/file-input/lib/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = __webpack_require__(/*! @uppy/core */ "../node_modules/@uppy/core/lib/index.js"),
    Plugin = _require.Plugin;

var toArray = __webpack_require__(/*! @uppy/utils/lib/toArray */ "../node_modules/@uppy/utils/lib/toArray.js");

var Translator = __webpack_require__(/*! @uppy/utils/lib/Translator */ "../node_modules/@uppy/utils/lib/Translator.js");

var _require2 = __webpack_require__(/*! preact */ "../node_modules/preact/dist/preact.esm.js"),
    h = _require2.h;

module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(FileInput, _Plugin);

  function FileInput(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.id = _this.opts.id || 'FileInput';
    _this.title = 'File Input';
    _this.type = 'acquirer';
    _this.defaultLocale = {
      strings: {
        // The same key is used for the same purpose by @uppy/robodog's `form()` API, but our
        // locale pack scripts can't access it in Robodog. If it is updated here, it should
        // also be updated there!
        chooseFiles: 'Choose files'
      }
    }; // Default options

    var defaultOptions = {
      target: null,
      pretty: true,
      inputName: 'files[]'
    }; // Merge default options with the ones set by user

    _this.opts = _extends({}, defaultOptions, opts);

    _this.i18nInit();

    _this.render = _this.render.bind(_assertThisInitialized(_this));
    _this.handleInputChange = _this.handleInputChange.bind(_assertThisInitialized(_this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = FileInput.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.i18nArray = this.translator.translateArray.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.addFiles = function addFiles(files) {
    var _this2 = this;

    var descriptors = files.map(function (file) {
      return {
        source: _this2.id,
        name: file.name,
        type: file.type,
        data: file
      };
    });

    try {
      this.uppy.addFiles(descriptors);
    } catch (err) {
      this.uppy.log(err);
    }
  };

  _proto.handleInputChange = function handleInputChange(event) {
    this.uppy.log('[FileInput] Something selected through input...');
    var files = toArray(event.target.files);
    this.addFiles(files); // We clear the input after a file is selected, because otherwise
    // change event is not fired in Chrome and Safari when a file
    // with the same name is selected.
    // ___Why not use value="" on <input/> instead?
    //    Because if we use that method of clearing the input,
    //    Chrome will not trigger change if we drop the same file twice (Issue #768).

    event.target.value = null;
  };

  _proto.handleClick = function handleClick(ev) {
    this.input.click();
  };

  _proto.render = function render(state) {
    var _this3 = this;

    /* http://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/ */
    var hiddenInputStyle = {
      width: '0.1px',
      height: '0.1px',
      opacity: 0,
      overflow: 'hidden',
      position: 'absolute',
      zIndex: -1
    };
    var restrictions = this.uppy.opts.restrictions;
    var accept = restrictions.allowedFileTypes ? restrictions.allowedFileTypes.join(',') : null;
    return h("div", {
      class: "uppy-Root uppy-FileInput-container"
    }, h("input", {
      class: "uppy-FileInput-input",
      style: this.opts.pretty && hiddenInputStyle,
      type: "file",
      name: this.opts.inputName,
      onchange: this.handleInputChange,
      multiple: restrictions.maxNumberOfFiles !== 1,
      accept: accept,
      ref: function ref(input) {
        _this3.input = input;
      }
    }), this.opts.pretty && h("button", {
      class: "uppy-FileInput-btn",
      type: "button",
      onclick: this.handleClick
    }, this.i18n('chooseFiles')));
  };

  _proto.install = function install() {
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  return FileInput;
}(Plugin), _class.VERSION = "1.4.20", _temp);

/***/ }),

/***/ "../node_modules/@uppy/informer/lib/index.js":
/*!***************************************************!*\
  !*** ../node_modules/@uppy/informer/lib/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = __webpack_require__(/*! @uppy/core */ "../node_modules/@uppy/core/lib/index.js"),
    Plugin = _require.Plugin;

var _require2 = __webpack_require__(/*! preact */ "../node_modules/preact/dist/preact.esm.js"),
    h = _require2.h;
/**
 * Informer
 * Shows rad message bubbles
 * used like this: `uppy.info('hello world', 'info', 5000)`
 * or for errors: `uppy.info('Error uploading img.jpg', 'error', 5000)`
 *
 */


module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(Informer, _Plugin);

  function Informer(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;

    _this.render = function (state) {
      var _state$info = state.info,
          isHidden = _state$info.isHidden,
          message = _state$info.message,
          details = _state$info.details;

      function displayErrorAlert() {
        var errorMessage = message + " \n\n " + details;
        alert(errorMessage);
      }

      var handleMouseOver = function handleMouseOver() {
        clearTimeout(_this.uppy.infoTimeoutID);
      };

      var handleMouseLeave = function handleMouseLeave() {
        _this.uppy.infoTimeoutID = setTimeout(_this.uppy.hideInfo, 2000);
      };

      return h("div", {
        class: "uppy uppy-Informer",
        "aria-hidden": isHidden
      }, h("p", {
        role: "alert"
      }, message, ' ', details && h("span", {
        "aria-label": details,
        "data-microtip-position": "top-left",
        "data-microtip-size": "medium",
        role: "tooltip",
        onclick: displayErrorAlert,
        onMouseOver: handleMouseOver,
        onMouseLeave: handleMouseLeave
      }, "?")));
    };

    _this.type = 'progressindicator';
    _this.id = _this.opts.id || 'Informer';
    _this.title = 'Informer'; // set default options

    var defaultOptions = {}; // merge default options with the ones set by user

    _this.opts = _extends({}, defaultOptions, opts);
    return _this;
  }

  var _proto = Informer.prototype;

  _proto.install = function install() {
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  return Informer;
}(Plugin), _class.VERSION = "1.5.14", _temp);

/***/ }),

/***/ "../node_modules/@uppy/status-bar/lib/StatusBar.js":
/*!*********************************************************!*\
  !*** ../node_modules/@uppy/status-bar/lib/StatusBar.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var throttle = __webpack_require__(/*! lodash.throttle */ "../node_modules/lodash.throttle/index.js");

var classNames = __webpack_require__(/*! classnames */ "../node_modules/classnames/index.js");

var statusBarStates = __webpack_require__(/*! ./StatusBarStates */ "../node_modules/@uppy/status-bar/lib/StatusBarStates.js");

var prettierBytes = __webpack_require__(/*! @transloadit/prettier-bytes */ "../node_modules/@transloadit/prettier-bytes/prettierBytes.js");

var prettyETA = __webpack_require__(/*! @uppy/utils/lib/prettyETA */ "../node_modules/@uppy/utils/lib/prettyETA.js");

var _require = __webpack_require__(/*! preact */ "../node_modules/preact/dist/preact.esm.js"),
    h = _require.h;

function calculateProcessingProgress(files) {
  // Collect pre or postprocessing progress states.
  var progresses = [];
  Object.keys(files).forEach(function (fileID) {
    var progress = files[fileID].progress;

    if (progress.preprocess) {
      progresses.push(progress.preprocess);
    }

    if (progress.postprocess) {
      progresses.push(progress.postprocess);
    }
  }); // In the future we should probably do this differently. For now we'll take the
  // mode and message from the first file…

  var _progresses$ = progresses[0],
      mode = _progresses$.mode,
      message = _progresses$.message;
  var value = progresses.filter(isDeterminate).reduce(function (total, progress, index, all) {
    return total + progress.value / all.length;
  }, 0);

  function isDeterminate(progress) {
    return progress.mode === 'determinate';
  }

  return {
    mode: mode,
    message: message,
    value: value
  };
}

function togglePauseResume(props) {
  if (props.isAllComplete) return;

  if (!props.resumableUploads) {
    return props.cancelAll();
  }

  if (props.isAllPaused) {
    return props.resumeAll();
  }

  return props.pauseAll();
}

module.exports = function (props) {
  props = props || {};
  var _props = props,
      newFiles = _props.newFiles,
      allowNewUpload = _props.allowNewUpload,
      isUploadInProgress = _props.isUploadInProgress,
      isAllPaused = _props.isAllPaused,
      resumableUploads = _props.resumableUploads,
      error = _props.error,
      hideUploadButton = _props.hideUploadButton,
      hidePauseResumeButton = _props.hidePauseResumeButton,
      hideCancelButton = _props.hideCancelButton,
      hideRetryButton = _props.hideRetryButton;
  var uploadState = props.uploadState;
  var progressValue = props.totalProgress;
  var progressMode;
  var progressBarContent;

  if (uploadState === statusBarStates.STATE_PREPROCESSING || uploadState === statusBarStates.STATE_POSTPROCESSING) {
    var progress = calculateProcessingProgress(props.files);
    progressMode = progress.mode;

    if (progressMode === 'determinate') {
      progressValue = progress.value * 100;
    }

    progressBarContent = ProgressBarProcessing(progress);
  } else if (uploadState === statusBarStates.STATE_COMPLETE) {
    progressBarContent = ProgressBarComplete(props);
  } else if (uploadState === statusBarStates.STATE_UPLOADING) {
    if (!props.supportsUploadProgress) {
      progressMode = 'indeterminate';
      progressValue = null;
    }

    progressBarContent = ProgressBarUploading(props);
  } else if (uploadState === statusBarStates.STATE_ERROR) {
    progressValue = undefined;
    progressBarContent = ProgressBarError(props);
  }

  var width = typeof progressValue === 'number' ? progressValue : 100;
  var isHidden = uploadState === statusBarStates.STATE_WAITING && props.hideUploadButton || uploadState === statusBarStates.STATE_WAITING && !props.newFiles > 0 || uploadState === statusBarStates.STATE_COMPLETE && props.hideAfterFinish;
  var showUploadBtn = !error && newFiles && !isUploadInProgress && !isAllPaused && allowNewUpload && !hideUploadButton;
  var showCancelBtn = !hideCancelButton && uploadState !== statusBarStates.STATE_WAITING && uploadState !== statusBarStates.STATE_COMPLETE;
  var showPauseResumeBtn = resumableUploads && !hidePauseResumeButton && uploadState === statusBarStates.STATE_UPLOADING;
  var showRetryBtn = error && !hideRetryButton;
  var showDoneBtn = props.doneButtonHandler && uploadState === statusBarStates.STATE_COMPLETE;
  var progressClassNames = "uppy-StatusBar-progress\n                           " + (progressMode ? 'is-' + progressMode : '');
  var statusBarClassNames = classNames({
    'uppy-Root': props.isTargetDOMEl
  }, 'uppy-StatusBar', "is-" + uploadState);
  return h("div", {
    class: statusBarClassNames,
    "aria-hidden": isHidden
  }, h("div", {
    class: progressClassNames,
    style: {
      width: width + '%'
    },
    role: "progressbar",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": progressValue
  }), progressBarContent, h("div", {
    class: "uppy-StatusBar-actions"
  }, showUploadBtn ? h(UploadBtn, _extends({}, props, {
    uploadState: uploadState
  })) : null, showRetryBtn ? h(RetryBtn, props) : null, showPauseResumeBtn ? h(PauseResumeButton, props) : null, showCancelBtn ? h(CancelBtn, props) : null, showDoneBtn ? h(DoneBtn, props) : null));
};

var UploadBtn = function UploadBtn(props) {
  var uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--upload', {
    'uppy-c-btn-primary': props.uploadState === statusBarStates.STATE_WAITING
  });
  return h("button", {
    type: "button",
    class: uploadBtnClassNames,
    "aria-label": props.i18n('uploadXFiles', {
      smart_count: props.newFiles
    }),
    onclick: props.startUpload,
    "data-uppy-super-focusable": true
  }, props.newFiles && props.isUploadStarted ? props.i18n('uploadXNewFiles', {
    smart_count: props.newFiles
  }) : props.i18n('uploadXFiles', {
    smart_count: props.newFiles
  }));
};

var RetryBtn = function RetryBtn(props) {
  return h("button", {
    type: "button",
    class: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry",
    "aria-label": props.i18n('retryUpload'),
    onclick: props.retryAll,
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-c-icon",
    width: "8",
    height: "10",
    viewBox: "0 0 8 10"
  }, h("path", {
    d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z"
  })), props.i18n('retry'));
};

var CancelBtn = function CancelBtn(props) {
  return h("button", {
    type: "button",
    class: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    title: props.i18n('cancel'),
    "aria-label": props.i18n('cancel'),
    onclick: props.cancelAll,
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    "fill-rule": "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z"
  }))));
};

var PauseResumeButton = function PauseResumeButton(props) {
  var isAllPaused = props.isAllPaused,
      i18n = props.i18n;
  var title = isAllPaused ? i18n('resume') : i18n('pause');
  return h("button", {
    title: title,
    "aria-label": title,
    class: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    type: "button",
    onclick: function onclick() {
      return togglePauseResume(props);
    },
    "data-uppy-super-focusable": true
  }, isAllPaused ? h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    "fill-rule": "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: "M6 4.25L11.5 8 6 11.75z"
  }))) : h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    "fill-rule": "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    d: "M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z",
    fill: "#FFF"
  }))));
};

var DoneBtn = function DoneBtn(props) {
  var i18n = props.i18n;
  return h("button", {
    type: "button",
    class: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--done",
    onClick: props.doneButtonHandler,
    "data-uppy-super-focusable": true
  }, i18n('done'));
};

var LoadingSpinner = function LoadingSpinner() {
  return h("svg", {
    class: "uppy-StatusBar-spinner",
    "aria-hidden": "true",
    focusable: "false",
    width: "14",
    height: "14"
  }, h("path", {
    d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0",
    "fill-rule": "evenodd"
  }));
};

var ProgressBarProcessing = function ProgressBarProcessing(props) {
  var value = Math.round(props.value * 100);
  return h("div", {
    class: "uppy-StatusBar-content"
  }, h(LoadingSpinner, null), props.mode === 'determinate' ? value + "% \xB7 " : '', props.message);
};

var renderDot = function renderDot() {
  return " \xB7 ";
};

var ProgressDetails = function ProgressDetails(props) {
  var ifShowFilesUploadedOfTotal = props.numUploads > 1;
  return h("div", {
    class: "uppy-StatusBar-statusSecondary"
  }, ifShowFilesUploadedOfTotal && props.i18n('filesUploadedOfTotal', {
    complete: props.complete,
    smart_count: props.numUploads
  }), h("span", {
    class: "uppy-StatusBar-additionalInfo"
  }, ifShowFilesUploadedOfTotal && renderDot(), props.i18n('dataUploadedOfTotal', {
    complete: prettierBytes(props.totalUploadedSize),
    total: prettierBytes(props.totalSize)
  }), renderDot(), props.i18n('xTimeLeft', {
    time: prettyETA(props.totalETA)
  })));
};

var UnknownProgressDetails = function UnknownProgressDetails(props) {
  return h("div", {
    class: "uppy-StatusBar-statusSecondary"
  }, props.i18n('filesUploadedOfTotal', {
    complete: props.complete,
    smart_count: props.numUploads
  }));
};

var UploadNewlyAddedFiles = function UploadNewlyAddedFiles(props) {
  var uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--uploadNewlyAdded');
  return h("div", {
    class: "uppy-StatusBar-statusSecondary"
  }, h("div", {
    class: "uppy-StatusBar-statusSecondaryHint"
  }, props.i18n('xMoreFilesAdded', {
    smart_count: props.newFiles
  })), h("button", {
    type: "button",
    class: uploadBtnClassNames,
    "aria-label": props.i18n('uploadXFiles', {
      smart_count: props.newFiles
    }),
    onclick: props.startUpload
  }, props.i18n('upload')));
};

var ThrottledProgressDetails = throttle(ProgressDetails, 500, {
  leading: true,
  trailing: true
});

var ProgressBarUploading = function ProgressBarUploading(props) {
  if (!props.isUploadStarted || props.isAllComplete) {
    return null;
  }

  var title = props.isAllPaused ? props.i18n('paused') : props.i18n('uploading');
  var showUploadNewlyAddedFiles = props.newFiles && props.isUploadStarted;
  return h("div", {
    class: "uppy-StatusBar-content",
    "aria-label": title,
    title: title
  }, !props.isAllPaused ? h(LoadingSpinner, null) : null, h("div", {
    class: "uppy-StatusBar-status"
  }, h("div", {
    class: "uppy-StatusBar-statusPrimary"
  }, props.supportsUploadProgress ? title + ": " + props.totalProgress + "%" : title), !props.isAllPaused && !showUploadNewlyAddedFiles && props.showProgressDetails ? props.supportsUploadProgress ? h(ThrottledProgressDetails, props) : h(UnknownProgressDetails, props) : null, showUploadNewlyAddedFiles ? h(UploadNewlyAddedFiles, props) : null));
};

var ProgressBarComplete = function ProgressBarComplete(_ref) {
  var totalProgress = _ref.totalProgress,
      i18n = _ref.i18n;
  return h("div", {
    class: "uppy-StatusBar-content",
    role: "status",
    title: i18n('complete')
  }, h("div", {
    class: "uppy-StatusBar-status"
  }, h("div", {
    class: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "15",
    height: "11",
    viewBox: "0 0 15 11"
  }, h("path", {
    d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z"
  })), i18n('complete'))));
};

var ProgressBarError = function ProgressBarError(_ref2) {
  var error = _ref2.error,
      retryAll = _ref2.retryAll,
      hideRetryButton = _ref2.hideRetryButton,
      i18n = _ref2.i18n;

  function displayErrorAlert() {
    var errorMessage = i18n('uploadFailed') + " \n\n " + error;
    alert(errorMessage);
  }

  return h("div", {
    class: "uppy-StatusBar-content",
    role: "alert",
    title: i18n('uploadFailed')
  }, h("div", {
    class: "uppy-StatusBar-status"
  }, h("div", {
    class: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "11",
    height: "11",
    viewBox: "0 0 11 11"
  }, h("path", {
    d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z"
  })), i18n('uploadFailed'))), h("span", {
    class: "uppy-StatusBar-details",
    "aria-label": error,
    "data-microtip-position": "top-right",
    "data-microtip-size": "medium",
    role: "tooltip",
    onclick: displayErrorAlert
  }, "?"));
};

/***/ }),

/***/ "../node_modules/@uppy/status-bar/lib/StatusBarStates.js":
/*!***************************************************************!*\
  !*** ../node_modules/@uppy/status-bar/lib/StatusBarStates.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete'
};

/***/ }),

/***/ "../node_modules/@uppy/status-bar/lib/index.js":
/*!*****************************************************!*\
  !*** ../node_modules/@uppy/status-bar/lib/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = __webpack_require__(/*! @uppy/core */ "../node_modules/@uppy/core/lib/index.js"),
    Plugin = _require.Plugin;

var Translator = __webpack_require__(/*! @uppy/utils/lib/Translator */ "../node_modules/@uppy/utils/lib/Translator.js");

var StatusBarUI = __webpack_require__(/*! ./StatusBar */ "../node_modules/@uppy/status-bar/lib/StatusBar.js");

var statusBarStates = __webpack_require__(/*! ./StatusBarStates */ "../node_modules/@uppy/status-bar/lib/StatusBarStates.js");

var getSpeed = __webpack_require__(/*! @uppy/utils/lib/getSpeed */ "../node_modules/@uppy/utils/lib/getSpeed.js");

var getBytesRemaining = __webpack_require__(/*! @uppy/utils/lib/getBytesRemaining */ "../node_modules/@uppy/utils/lib/getBytesRemaining.js");
/**
 * StatusBar: renders a status bar with upload/pause/resume/cancel/retry buttons,
 * progress percentage and time remaining.
 */


module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(StatusBar, _Plugin);

  function StatusBar(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;

    _this.startUpload = function () {
      return _this.uppy.upload().catch(function () {// Error logged in Core
      });
    };

    _this.id = _this.opts.id || 'StatusBar';
    _this.title = 'StatusBar';
    _this.type = 'progressindicator';
    _this.defaultLocale = {
      strings: {
        uploading: 'Uploading',
        upload: 'Upload',
        complete: 'Complete',
        uploadFailed: 'Upload failed',
        paused: 'Paused',
        retry: 'Retry',
        retryUpload: 'Retry upload',
        cancel: 'Cancel',
        pause: 'Pause',
        resume: 'Resume',
        done: 'Done',
        filesUploadedOfTotal: {
          0: '%{complete} of %{smart_count} file uploaded',
          1: '%{complete} of %{smart_count} files uploaded'
        },
        dataUploadedOfTotal: '%{complete} of %{total}',
        xTimeLeft: '%{time} left',
        uploadXFiles: {
          0: 'Upload %{smart_count} file',
          1: 'Upload %{smart_count} files'
        },
        uploadXNewFiles: {
          0: 'Upload +%{smart_count} file',
          1: 'Upload +%{smart_count} files'
        },
        xMoreFilesAdded: {
          0: '%{smart_count} more file added',
          1: '%{smart_count} more files added'
        }
      }
    }; // set default options

    var defaultOptions = {
      target: 'body',
      hideUploadButton: false,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideCancelButton: false,
      showProgressDetails: false,
      hideAfterFinish: true,
      doneButtonHandler: null
    };
    _this.opts = _extends({}, defaultOptions, opts);

    _this.i18nInit();

    _this.render = _this.render.bind(_assertThisInitialized(_this));
    _this.install = _this.install.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = StatusBar.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.getTotalSpeed = function getTotalSpeed(files) {
    var totalSpeed = 0;
    files.forEach(function (file) {
      totalSpeed = totalSpeed + getSpeed(file.progress);
    });
    return totalSpeed;
  };

  _proto.getTotalETA = function getTotalETA(files) {
    var totalSpeed = this.getTotalSpeed(files);

    if (totalSpeed === 0) {
      return 0;
    }

    var totalBytesRemaining = files.reduce(function (total, file) {
      return total + getBytesRemaining(file.progress);
    }, 0);
    return Math.round(totalBytesRemaining / totalSpeed * 10) / 10;
  };

  _proto.getUploadingState = function getUploadingState(isAllErrored, isAllComplete, files) {
    if (isAllErrored) {
      return statusBarStates.STATE_ERROR;
    }

    if (isAllComplete) {
      return statusBarStates.STATE_COMPLETE;
    }

    var state = statusBarStates.STATE_WAITING;
    var fileIDs = Object.keys(files);

    for (var i = 0; i < fileIDs.length; i++) {
      var progress = files[fileIDs[i]].progress; // If ANY files are being uploaded right now, show the uploading state.

      if (progress.uploadStarted && !progress.uploadComplete) {
        return statusBarStates.STATE_UPLOADING;
      } // If files are being preprocessed AND postprocessed at this time, we show the
      // preprocess state. If any files are being uploaded we show uploading.


      if (progress.preprocess && state !== statusBarStates.STATE_UPLOADING) {
        state = statusBarStates.STATE_PREPROCESSING;
      } // If NO files are being preprocessed or uploaded right now, but some files are
      // being postprocessed, show the postprocess state.


      if (progress.postprocess && state !== statusBarStates.STATE_UPLOADING && state !== statusBarStates.STATE_PREPROCESSING) {
        state = statusBarStates.STATE_POSTPROCESSING;
      }
    }

    return state;
  };

  _proto.render = function render(state) {
    var capabilities = state.capabilities,
        files = state.files,
        allowNewUpload = state.allowNewUpload,
        totalProgress = state.totalProgress,
        error = state.error; // TODO: move this to Core, to share between Status Bar and Dashboard
    // (and any other plugin that might need it, too)

    var filesArray = Object.keys(files).map(function (file) {
      return files[file];
    });
    var newFiles = filesArray.filter(function (file) {
      return !file.progress.uploadStarted && !file.progress.preprocess && !file.progress.postprocess;
    });
    var uploadStartedFiles = filesArray.filter(function (file) {
      return file.progress.uploadStarted;
    });
    var pausedFiles = uploadStartedFiles.filter(function (file) {
      return file.isPaused;
    });
    var completeFiles = filesArray.filter(function (file) {
      return file.progress.uploadComplete;
    });
    var erroredFiles = filesArray.filter(function (file) {
      return file.error;
    });
    var inProgressFiles = filesArray.filter(function (file) {
      return !file.progress.uploadComplete && file.progress.uploadStarted;
    });
    var inProgressNotPausedFiles = inProgressFiles.filter(function (file) {
      return !file.isPaused;
    });
    var startedFiles = filesArray.filter(function (file) {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });
    var processingFiles = filesArray.filter(function (file) {
      return file.progress.preprocess || file.progress.postprocess;
    });
    var totalETA = this.getTotalETA(inProgressNotPausedFiles);
    var totalSize = 0;
    var totalUploadedSize = 0;
    startedFiles.forEach(function (file) {
      totalSize = totalSize + (file.progress.bytesTotal || 0);
      totalUploadedSize = totalUploadedSize + (file.progress.bytesUploaded || 0);
    });
    var isUploadStarted = startedFiles.length > 0;
    var isAllComplete = totalProgress === 100 && completeFiles.length === Object.keys(files).length && processingFiles.length === 0;
    var isAllErrored = error && erroredFiles.length === filesArray.length;
    var isAllPaused = inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length;
    var isUploadInProgress = inProgressFiles.length > 0;
    var resumableUploads = capabilities.resumableUploads || false;
    var supportsUploadProgress = capabilities.uploadProgress !== false;
    return StatusBarUI({
      error: error,
      uploadState: this.getUploadingState(isAllErrored, isAllComplete, state.files || {}),
      allowNewUpload: allowNewUpload,
      totalProgress: totalProgress,
      totalSize: totalSize,
      totalUploadedSize: totalUploadedSize,
      isAllComplete: isAllComplete,
      isAllPaused: isAllPaused,
      isAllErrored: isAllErrored,
      isUploadStarted: isUploadStarted,
      isUploadInProgress: isUploadInProgress,
      complete: completeFiles.length,
      newFiles: newFiles.length,
      numUploads: startedFiles.length,
      totalETA: totalETA,
      files: files,
      i18n: this.i18n,
      pauseAll: this.uppy.pauseAll,
      resumeAll: this.uppy.resumeAll,
      retryAll: this.uppy.retryAll,
      cancelAll: this.uppy.cancelAll,
      startUpload: this.startUpload,
      doneButtonHandler: this.opts.doneButtonHandler,
      resumableUploads: resumableUploads,
      supportsUploadProgress: supportsUploadProgress,
      showProgressDetails: this.opts.showProgressDetails,
      hideUploadButton: this.opts.hideUploadButton,
      hideRetryButton: this.opts.hideRetryButton,
      hidePauseResumeButton: this.opts.hidePauseResumeButton,
      hideCancelButton: this.opts.hideCancelButton,
      hideAfterFinish: this.opts.hideAfterFinish,
      isTargetDOMEl: this.isTargetDOMEl
    });
  };

  _proto.install = function install() {
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  return StatusBar;
}(Plugin), _class.VERSION = "1.8.1", _temp);

/***/ }),

/***/ "../node_modules/@uppy/store-default/lib/index.js":
/*!********************************************************!*\
  !*** ../node_modules/@uppy/store-default/lib/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Default store that keeps state in a simple object.
 */
var DefaultStore = /*#__PURE__*/function () {
  function DefaultStore() {
    this.state = {};
    this.callbacks = [];
  }

  var _proto = DefaultStore.prototype;

  _proto.getState = function getState() {
    return this.state;
  };

  _proto.setState = function setState(patch) {
    var prevState = _extends({}, this.state);

    var nextState = _extends({}, this.state, patch);

    this.state = nextState;

    this._publish(prevState, nextState, patch);
  };

  _proto.subscribe = function subscribe(listener) {
    var _this = this;

    this.callbacks.push(listener);
    return function () {
      // Remove the listener.
      _this.callbacks.splice(_this.callbacks.indexOf(listener), 1);
    };
  };

  _proto._publish = function _publish() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.callbacks.forEach(function (listener) {
      listener.apply(void 0, args);
    });
  };

  return DefaultStore;
}();

DefaultStore.VERSION = "1.2.4";

module.exports = function defaultStore() {
  return new DefaultStore();
};

/***/ }),

/***/ "../node_modules/@uppy/tus/lib/getFingerprint.js":
/*!*******************************************************!*\
  !*** ../node_modules/@uppy/tus/lib/getFingerprint.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tus = __webpack_require__(/*! tus-js-client */ "../node_modules/tus-js-client/lib.esm/browser/index.js");

function isCordova() {
  return typeof window !== 'undefined' && (typeof window.PhoneGap !== 'undefined' || typeof window.Cordova !== 'undefined' || typeof window.cordova !== 'undefined');
}

function isReactNative() {
  return typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
} // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
// now also includes `relativePath` for files added from folders.
// This means you can add 2 identical files, if one is in folder a,
// the other in folder b — `a/file.jpg` and `b/file.jpg`, when added
// together with a folder, will be treated as 2 separate files.
//
// For React Native and Cordova, we let tus-js-client’s default
// fingerprint handling take charge.


module.exports = function getFingerprint(uppyFileObj) {
  return function (file, options) {
    if (isCordova() || isReactNative()) {
      return tus.defaultOptions.fingerprint(file, options);
    }

    var uppyFingerprint = ['tus', uppyFileObj.id, options.endpoint].join('-');
    return Promise.resolve(uppyFingerprint);
  };
};

/***/ }),

/***/ "../node_modules/@uppy/tus/lib/index.js":
/*!**********************************************!*\
  !*** ../node_modules/@uppy/tus/lib/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = __webpack_require__(/*! @uppy/core */ "../node_modules/@uppy/core/lib/index.js"),
    Plugin = _require.Plugin;

var tus = __webpack_require__(/*! tus-js-client */ "../node_modules/tus-js-client/lib.esm/browser/index.js");

var _require2 = __webpack_require__(/*! @uppy/companion-client */ "../node_modules/@uppy/companion-client/lib/index.js"),
    Provider = _require2.Provider,
    RequestClient = _require2.RequestClient,
    Socket = _require2.Socket;

var emitSocketProgress = __webpack_require__(/*! @uppy/utils/lib/emitSocketProgress */ "../node_modules/@uppy/utils/lib/emitSocketProgress.js");

var getSocketHost = __webpack_require__(/*! @uppy/utils/lib/getSocketHost */ "../node_modules/@uppy/utils/lib/getSocketHost.js");

var settle = __webpack_require__(/*! @uppy/utils/lib/settle */ "../node_modules/@uppy/utils/lib/settle.js");

var EventTracker = __webpack_require__(/*! @uppy/utils/lib/EventTracker */ "../node_modules/@uppy/utils/lib/EventTracker.js");

var NetworkError = __webpack_require__(/*! @uppy/utils/lib/NetworkError */ "../node_modules/@uppy/utils/lib/NetworkError.js");

var isNetworkError = __webpack_require__(/*! @uppy/utils/lib/isNetworkError */ "../node_modules/@uppy/utils/lib/isNetworkError.js");

var RateLimitedQueue = __webpack_require__(/*! @uppy/utils/lib/RateLimitedQueue */ "../node_modules/@uppy/utils/lib/RateLimitedQueue.js");

var hasProperty = __webpack_require__(/*! @uppy/utils/lib/hasProperty */ "../node_modules/@uppy/utils/lib/hasProperty.js");

var getFingerprint = __webpack_require__(/*! ./getFingerprint */ "../node_modules/@uppy/tus/lib/getFingerprint.js");
/** @typedef {import('..').TusOptions} TusOptions */

/** @typedef {import('tus-js-client').UploadOptions} RawTusOptions */

/** @typedef {import('@uppy/core').Uppy} Uppy */

/** @typedef {import('@uppy/core').UppyFile} UppyFile */

/** @typedef {import('@uppy/core').FailedUppyFile<{}>} FailedUppyFile */

/**
 * Extracted from https://github.com/tus/tus-js-client/blob/master/lib/upload.js#L13
 * excepted we removed 'fingerprint' key to avoid adding more dependencies
 *
 * @type {RawTusOptions}
 */


var tusDefaultOptions = {
  endpoint: '',
  uploadUrl: null,
  metadata: {},
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  storeFingerprintForResuming: true,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false
};
/**
 * Tus resumable file uploader
 */

module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(Tus, _Plugin);

  /**
   * @param {Uppy} uppy
   * @param {TusOptions} opts
   */
  function Tus(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.type = 'uploader';
    _this.id = _this.opts.id || 'Tus';
    _this.title = 'Tus'; // set default options

    var defaultOptions = {
      autoRetry: true,
      resume: true,
      useFastRemoteRetry: true,
      limit: 0,
      retryDelays: [0, 1000, 3000, 5000],
      withCredentials: false
    }; // merge default options with the ones set by user

    /** @type {import("..").TusOptions} */

    _this.opts = _extends({}, defaultOptions, opts);
    /**
     * Simultaneous upload limiting is shared across all uploads with this plugin.
     *
     * @type {RateLimitedQueue}
     */

    _this.requests = new RateLimitedQueue(_this.opts.limit);
    _this.uploaders = Object.create(null);
    _this.uploaderEvents = Object.create(null);
    _this.uploaderSockets = Object.create(null);
    _this.handleResetProgress = _this.handleResetProgress.bind(_assertThisInitialized(_this));
    _this.handleUpload = _this.handleUpload.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Tus.prototype;

  _proto.handleResetProgress = function handleResetProgress() {
    var files = _extends({}, this.uppy.getState().files);

    Object.keys(files).forEach(function (fileID) {
      // Only clone the file object if it has a Tus `uploadUrl` attached.
      if (files[fileID].tus && files[fileID].tus.uploadUrl) {
        var tusState = _extends({}, files[fileID].tus);

        delete tusState.uploadUrl;
        files[fileID] = _extends({}, files[fileID], {
          tus: tusState
        });
      }
    });
    this.uppy.setState({
      files: files
    });
  }
  /**
   * Clean up all references for a file's upload: the tus.Upload instance,
   * any events related to the file, and the Companion WebSocket connection.
   *
   * @param {string} fileID
   */
  ;

  _proto.resetUploaderReferences = function resetUploaderReferences(fileID, opts) {
    if (opts === void 0) {
      opts = {};
    }

    if (this.uploaders[fileID]) {
      var uploader = this.uploaders[fileID];
      uploader.abort();

      if (opts.abort) {
        // to avoid 423 error from tus server, we wait
        // to be sure the previous request has been aborted before terminating the upload
        // @todo remove the timeout when this "wait" is handled in tus-js-client internally
        setTimeout(function () {
          return uploader.abort(true);
        }, 1000);
      }

      this.uploaders[fileID] = null;
    }

    if (this.uploaderEvents[fileID]) {
      this.uploaderEvents[fileID].remove();
      this.uploaderEvents[fileID] = null;
    }

    if (this.uploaderSockets[fileID]) {
      this.uploaderSockets[fileID].close();
      this.uploaderSockets[fileID] = null;
    }
  }
  /**
   * Create a new Tus upload.
   *
   * A lot can happen during an upload, so this is quite hard to follow!
   * - First, the upload is started. If the file was already paused by the time the upload starts, nothing should happen.
   *   If the `limit` option is used, the upload must be queued onto the `this.requests` queue.
   *   When an upload starts, we store the tus.Upload instance, and an EventTracker instance that manages the event listeners
   *   for pausing, cancellation, removal, etc.
   * - While the upload is in progress, it may be paused or cancelled.
   *   Pausing aborts the underlying tus.Upload, and removes the upload from the `this.requests` queue. All other state is
   *   maintained.
   *   Cancelling removes the upload from the `this.requests` queue, and completely aborts the upload--the tus.Upload instance
   *   is aborted and discarded, the EventTracker instance is destroyed (removing all listeners).
   *   Resuming the upload uses the `this.requests` queue as well, to prevent selectively pausing and resuming uploads from
   *   bypassing the limit.
   * - After completing an upload, the tus.Upload and EventTracker instances are cleaned up, and the upload is marked as done
   *   in the `this.requests` queue.
   * - When an upload completed with an error, the same happens as on successful completion, but the `upload()` promise is rejected.
   *
   * When working on this function, keep in mind:
   *  - When an upload is completed or cancelled for any reason, the tus.Upload and EventTracker instances need to be cleaned up using this.resetUploaderReferences().
   *  - When an upload is cancelled or paused, for any reason, it needs to be removed from the `this.requests` queue using `queuedRequest.abort()`.
   *  - When an upload is completed for any reason, including errors, it needs to be marked as such using `queuedRequest.done()`.
   *  - When an upload is started or resumed, it needs to go through the `this.requests` queue. The `queuedRequest` variable must be updated so the other uses of it are valid.
   *  - Before replacing the `queuedRequest` variable, the previous `queuedRequest` must be aborted, else it will keep taking up a spot in the queue.
   *
   * @param {UppyFile} file for use with upload
   * @param {number} current file in a queue
   * @param {number} total number of files in a queue
   * @returns {Promise<void>}
   */
  ;

  _proto.upload = function upload(file, current, total) {
    var _this2 = this;

    this.resetUploaderReferences(file.id); // Create a new tus upload

    return new Promise(function (resolve, reject) {
      _this2.uppy.emit('upload-started', file);

      var opts = _extends({}, _this2.opts, file.tus || {});
      /** @type {RawTusOptions} */


      var uploadOptions = _extends({}, tusDefaultOptions, opts);

      delete uploadOptions.resume; // Make `resume: true` work like it did in tus-js-client v1.
      // TODO: Remove in @uppy/tus v2

      if (opts.resume) {
        uploadOptions.storeFingerprintForResuming = true;
      } // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
      // now also includes `relativePath` for files added from folders.
      // This means you can add 2 identical files, if one is in folder a,
      // the other in folder b.


      uploadOptions.fingerprint = getFingerprint(file);

      uploadOptions.onBeforeRequest = function (req) {
        var xhr = req.getUnderlyingObject();
        xhr.withCredentials = !!opts.withCredentials;

        if (typeof opts.onBeforeRequest === 'function') {
          opts.onBeforeRequest(req);
        }
      };

      uploadOptions.onError = function (err) {
        _this2.uppy.log(err);

        var xhr = err.originalRequest ? err.originalRequest.getUnderlyingObject() : null;

        if (isNetworkError(xhr)) {
          err = new NetworkError(err, xhr);
        }

        _this2.resetUploaderReferences(file.id);

        queuedRequest.done();

        _this2.uppy.emit('upload-error', file, err);

        reject(err);
      };

      uploadOptions.onProgress = function (bytesUploaded, bytesTotal) {
        _this2.onReceiveUploadUrl(file, upload.url);

        _this2.uppy.emit('upload-progress', file, {
          uploader: _this2,
          bytesUploaded: bytesUploaded,
          bytesTotal: bytesTotal
        });
      };

      uploadOptions.onSuccess = function () {
        var uploadResp = {
          uploadURL: upload.url
        };

        _this2.resetUploaderReferences(file.id);

        queuedRequest.done();

        _this2.uppy.emit('upload-success', file, uploadResp);

        if (upload.url) {
          _this2.uppy.log('Download ' + upload.file.name + ' from ' + upload.url);
        }

        resolve(upload);
      };

      var copyProp = function copyProp(obj, srcProp, destProp) {
        if (hasProperty(obj, srcProp) && !hasProperty(obj, destProp)) {
          obj[destProp] = obj[srcProp];
        }
      };
      /** @type {Record<string, string>} */


      var meta = {};
      var metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
      : Object.keys(file.meta);
      metaFields.forEach(function (item) {
        meta[item] = file.meta[item];
      }); // tusd uses metadata fields 'filetype' and 'filename'

      copyProp(meta, 'type', 'filetype');
      copyProp(meta, 'name', 'filename');
      uploadOptions.metadata = meta;
      var upload = new tus.Upload(file.data, uploadOptions);
      _this2.uploaders[file.id] = upload;
      _this2.uploaderEvents[file.id] = new EventTracker(_this2.uppy); // Make `resume: true` work like it did in tus-js-client v1.
      // TODO: Remove in @uppy/tus v2.

      if (opts.resume) {
        upload.findPreviousUploads().then(function (previousUploads) {
          var previousUpload = previousUploads[0];

          if (previousUpload) {
            _this2.uppy.log("[Tus] Resuming upload of " + file.id + " started at " + previousUpload.creationTime);

            upload.resumeFromPreviousUpload(previousUpload);
          }
        });
      }

      var queuedRequest = _this2.requests.run(function () {
        if (!file.isPaused) {
          // Ensure this gets scheduled to run _after_ `findPreviousUploads()` returns.
          // TODO: Remove in @uppy/tus v2.
          Promise.resolve().then(function () {
            upload.start();
          });
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.
        // Also, we need to remove the request from the queue _without_ destroying everything
        // related to this upload to handle pauses.


        return function () {};
      });

      _this2.onFileRemove(file.id, function (targetFileID) {
        queuedRequest.abort();

        _this2.resetUploaderReferences(file.id, {
          abort: !!upload.url
        });

        resolve("upload " + targetFileID + " was removed");
      });

      _this2.onPause(file.id, function (isPaused) {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          upload.abort();
        } else {
          // Resuming an upload should be queued, else you could pause and then resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = _this2.requests.run(function () {
            upload.start();
            return function () {};
          });
        }
      });

      _this2.onPauseAll(file.id, function () {
        queuedRequest.abort();
        upload.abort();
      });

      _this2.onCancelAll(file.id, function () {
        queuedRequest.abort();

        _this2.resetUploaderReferences(file.id, {
          abort: !!upload.url
        });

        resolve("upload " + file.id + " was canceled");
      });

      _this2.onResumeAll(file.id, function () {
        queuedRequest.abort();

        if (file.error) {
          upload.abort();
        }

        queuedRequest = _this2.requests.run(function () {
          upload.start();
          return function () {};
        });
      });
    }).catch(function (err) {
      _this2.uppy.emit('upload-error', file, err);

      throw err;
    });
  }
  /**
   * @param {UppyFile} file for use with upload
   * @param {number} current file in a queue
   * @param {number} total number of files in a queue
   * @returns {Promise<void>}
   */
  ;

  _proto.uploadRemote = function uploadRemote(file, current, total) {
    var _this3 = this;

    this.resetUploaderReferences(file.id);

    var opts = _extends({}, this.opts);

    if (file.tus) {
      // Install file-specific upload overrides.
      _extends(opts, file.tus);
    }

    this.uppy.emit('upload-started', file);
    this.uppy.log(file.remote.url);

    if (file.serverToken) {
      return this.connectToServerSocket(file);
    }

    return new Promise(function (resolve, reject) {
      var Client = file.remote.providerOptions.provider ? Provider : RequestClient;
      var client = new Client(_this3.uppy, file.remote.providerOptions); // !! cancellation is NOT supported at this stage yet

      client.post(file.remote.url, _extends({}, file.remote.body, {
        endpoint: opts.endpoint,
        uploadUrl: opts.uploadUrl,
        protocol: 'tus',
        size: file.data.size,
        headers: opts.headers,
        metadata: file.meta
      })).then(function (res) {
        _this3.uppy.setFileState(file.id, {
          serverToken: res.token
        });

        file = _this3.uppy.getFile(file.id);
        return _this3.connectToServerSocket(file);
      }).then(function () {
        resolve();
      }).catch(function (err) {
        _this3.uppy.emit('upload-error', file, err);

        reject(err);
      });
    });
  }
  /**
   * See the comment on the upload() method.
   *
   * Additionally, when an upload is removed, completed, or cancelled, we need to close the WebSocket connection. This is handled by the resetUploaderReferences() function, so the same guidelines apply as in upload().
   *
   * @param {UppyFile} file
   */
  ;

  _proto.connectToServerSocket = function connectToServerSocket(file) {
    var _this4 = this;

    return new Promise(function (resolve, reject) {
      var token = file.serverToken;
      var host = getSocketHost(file.remote.companionUrl);
      var socket = new Socket({
        target: host + "/api/" + token,
        autoOpen: false
      });
      _this4.uploaderSockets[file.id] = socket;
      _this4.uploaderEvents[file.id] = new EventTracker(_this4.uppy);

      _this4.onFileRemove(file.id, function () {
        queuedRequest.abort(); // still send pause event in case we are dealing with older version of companion
        // @todo don't send pause event in the next major release.

        socket.send('pause', {});
        socket.send('cancel', {});

        _this4.resetUploaderReferences(file.id);

        resolve("upload " + file.id + " was removed");
      });

      _this4.onPause(file.id, function (isPaused) {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          socket.send('pause', {});
        } else {
          // Resuming an upload should be queued, else you could pause and then resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = _this4.requests.run(function () {
            socket.send('resume', {});
            return function () {};
          });
        }
      });

      _this4.onPauseAll(file.id, function () {
        queuedRequest.abort();
        socket.send('pause', {});
      });

      _this4.onCancelAll(file.id, function () {
        queuedRequest.abort(); // still send pause event in case we are dealing with older version of companion
        // @todo don't send pause event in the next major release.

        socket.send('pause', {});
        socket.send('cancel', {});

        _this4.resetUploaderReferences(file.id);

        resolve("upload " + file.id + " was canceled");
      });

      _this4.onResumeAll(file.id, function () {
        queuedRequest.abort();

        if (file.error) {
          socket.send('pause', {});
        }

        queuedRequest = _this4.requests.run(function () {
          socket.send('resume', {});
          return function () {};
        });
      });

      _this4.onRetry(file.id, function () {
        // Only do the retry if the upload is actually in progress;
        // else we could try to send these messages when the upload is still queued.
        // We may need a better check for this since the socket may also be closed
        // for other reasons, like network failures.
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });

      _this4.onRetryAll(file.id, function () {
        // See the comment in the onRetry() call
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });

      socket.on('progress', function (progressData) {
        return emitSocketProgress(_this4, progressData, file);
      });
      socket.on('error', function (errData) {
        var message = errData.error.message;

        var error = _extends(new Error(message), {
          cause: errData.error
        }); // If the remote retry optimisation should not be used,
        // close the socket—this will tell companion to clear state and delete the file.


        if (!_this4.opts.useFastRemoteRetry) {
          _this4.resetUploaderReferences(file.id); // Remove the serverToken so that a new one will be created for the retry.


          _this4.uppy.setFileState(file.id, {
            serverToken: null
          });
        } else {
          socket.close();
        }

        _this4.uppy.emit('upload-error', file, error);

        queuedRequest.done();
        reject(error);
      });
      socket.on('success', function (data) {
        var uploadResp = {
          uploadURL: data.url
        };

        _this4.uppy.emit('upload-success', file, uploadResp);

        _this4.resetUploaderReferences(file.id);

        queuedRequest.done();
        resolve();
      });

      var queuedRequest = _this4.requests.run(function () {
        socket.open();

        if (file.isPaused) {
          socket.send('pause', {});
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.
        // Also, we need to remove the request from the queue _without_ destroying everything
        // related to this upload to handle pauses.


        return function () {};
      });
    });
  }
  /**
   * Store the uploadUrl on the file options, so that when Golden Retriever
   * restores state, we will continue uploading to the correct URL.
   *
   * @param {UppyFile} file
   * @param {string} uploadURL
   */
  ;

  _proto.onReceiveUploadUrl = function onReceiveUploadUrl(file, uploadURL) {
    var currentFile = this.uppy.getFile(file.id);
    if (!currentFile) return; // Only do the update if we didn't have an upload URL yet.

    if (!currentFile.tus || currentFile.tus.uploadUrl !== uploadURL) {
      this.uppy.log('[Tus] Storing upload url');
      this.uppy.setFileState(currentFile.id, {
        tus: _extends({}, currentFile.tus, {
          uploadUrl: uploadURL
        })
      });
    }
  }
  /**
   * @param {string} fileID
   * @param {function(string): void} cb
   */
  ;

  _proto.onFileRemove = function onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', function (file) {
      if (fileID === file.id) cb(file.id);
    });
  }
  /**
   * @param {string} fileID
   * @param {function(boolean): void} cb
   */
  ;

  _proto.onPause = function onPause(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-pause', function (targetFileID, isPaused) {
      if (fileID === targetFileID) {
        // const isPaused = this.uppy.pauseResume(fileID)
        cb(isPaused);
      }
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */
  ;

  _proto.onRetry = function onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', function (targetFileID) {
      if (fileID === targetFileID) {
        cb();
      }
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */
  ;

  _proto.onRetryAll = function onRetryAll(fileID, cb) {
    var _this5 = this;

    this.uploaderEvents[fileID].on('retry-all', function (filesToRetry) {
      if (!_this5.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */
  ;

  _proto.onPauseAll = function onPauseAll(fileID, cb) {
    var _this6 = this;

    this.uploaderEvents[fileID].on('pause-all', function () {
      if (!_this6.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */
  ;

  _proto.onCancelAll = function onCancelAll(fileID, cb) {
    var _this7 = this;

    this.uploaderEvents[fileID].on('cancel-all', function () {
      if (!_this7.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */
  ;

  _proto.onResumeAll = function onResumeAll(fileID, cb) {
    var _this8 = this;

    this.uploaderEvents[fileID].on('resume-all', function () {
      if (!_this8.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {(UppyFile | FailedUppyFile)[]} files
   */
  ;

  _proto.uploadFiles = function uploadFiles(files) {
    var _this9 = this;

    var promises = files.map(function (file, i) {
      var current = i + 1;
      var total = files.length;

      if ('error' in file && file.error) {
        return Promise.reject(new Error(file.error));
      } else if (file.isRemote) {
        return _this9.uploadRemote(file, current, total);
      } else {
        return _this9.upload(file, current, total);
      }
    });
    return settle(promises);
  }
  /**
   * @param {string[]} fileIDs
   */
  ;

  _proto.handleUpload = function handleUpload(fileIDs) {
    var _this10 = this;

    if (fileIDs.length === 0) {
      this.uppy.log('[Tus] No files to upload');
      return Promise.resolve();
    }

    if (this.opts.limit === 0) {
      this.uppy.log('[Tus] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/tus/#limit-0', 'warning');
    }

    this.uppy.log('[Tus] Uploading...');
    var filesToUpload = fileIDs.map(function (fileID) {
      return _this10.uppy.getFile(fileID);
    });
    return this.uploadFiles(filesToUpload).then(function () {
      return null;
    });
  };

  _proto.install = function install() {
    this.uppy.setState({
      capabilities: _extends({}, this.uppy.getState().capabilities, {
        resumableUploads: true
      })
    });
    this.uppy.addUploader(this.handleUpload);
    this.uppy.on('reset-progress', this.handleResetProgress);

    if (this.opts.autoRetry) {
      this.uppy.on('back-online', this.uppy.retryAll);
    }
  };

  _proto.uninstall = function uninstall() {
    this.uppy.setState({
      capabilities: _extends({}, this.uppy.getState().capabilities, {
        resumableUploads: false
      })
    });
    this.uppy.removeUploader(this.handleUpload);

    if (this.opts.autoRetry) {
      this.uppy.off('back-online', this.uppy.retryAll);
    }
  };

  return Tus;
}(Plugin), _class.VERSION = "1.8.2", _temp);

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/EventTracker.js":
/*!*******************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/EventTracker.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
module.exports = /*#__PURE__*/function () {
  function EventTracker(emitter) {
    this._events = [];
    this._emitter = emitter;
  }

  var _proto = EventTracker.prototype;

  _proto.on = function on(event, fn) {
    this._events.push([event, fn]);

    return this._emitter.on(event, fn);
  };

  _proto.remove = function remove() {
    var _this = this;

    this._events.forEach(function (_ref) {
      var event = _ref[0],
          fn = _ref[1];

      _this._emitter.off(event, fn);
    });
  };

  return EventTracker;
}();

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/NetworkError.js":
/*!*******************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/NetworkError.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var NetworkError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(NetworkError, _Error);

  function NetworkError(error, xhr) {
    var _this;

    if (xhr === void 0) {
      xhr = null;
    }

    _this = _Error.call(this, "This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.\n\nSource error: [" + error + "]") || this;
    _this.isNetworkError = true;
    _this.request = xhr;
    return _this;
  }

  return NetworkError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

module.exports = NetworkError;

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/RateLimitedQueue.js":
/*!***********************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/RateLimitedQueue.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Array.prototype.findIndex ponyfill for old browsers.
 */
function findIndex(array, predicate) {
  for (var i = 0; i < array.length; i++) {
    if (predicate(array[i])) return i;
  }

  return -1;
}

function createCancelError() {
  return new Error('Cancelled');
}

module.exports = /*#__PURE__*/function () {
  function RateLimitedQueue(limit) {
    if (typeof limit !== 'number' || limit === 0) {
      this.limit = Infinity;
    } else {
      this.limit = limit;
    }

    this.activeRequests = 0;
    this.queuedHandlers = [];
  }

  var _proto = RateLimitedQueue.prototype;

  _proto._call = function _call(fn) {
    var _this = this;

    this.activeRequests += 1;
    var _done = false;
    var cancelActive;

    try {
      cancelActive = fn();
    } catch (err) {
      this.activeRequests -= 1;
      throw err;
    }

    return {
      abort: function abort() {
        if (_done) return;
        _done = true;
        _this.activeRequests -= 1;
        cancelActive();

        _this._queueNext();
      },
      done: function done() {
        if (_done) return;
        _done = true;
        _this.activeRequests -= 1;

        _this._queueNext();
      }
    };
  };

  _proto._queueNext = function _queueNext() {
    var _this2 = this;

    // Do it soon but not immediately, this allows clearing out the entire queue synchronously
    // one by one without continuously _advancing_ it (and starting new tasks before immediately
    // aborting them)
    Promise.resolve().then(function () {
      _this2._next();
    });
  };

  _proto._next = function _next() {
    if (this.activeRequests >= this.limit) {
      return;
    }

    if (this.queuedHandlers.length === 0) {
      return;
    } // Dispatch the next request, and update the abort/done handlers
    // so that cancelling it does the Right Thing (and doesn't just try
    // to dequeue an already-running request).


    var next = this.queuedHandlers.shift();

    var handler = this._call(next.fn);

    next.abort = handler.abort;
    next.done = handler.done;
  };

  _proto._queue = function _queue(fn, options) {
    var _this3 = this;

    if (options === void 0) {
      options = {};
    }

    var handler = {
      fn: fn,
      priority: options.priority || 0,
      abort: function abort() {
        _this3._dequeue(handler);
      },
      done: function done() {
        throw new Error('Cannot mark a queued request as done: this indicates a bug');
      }
    };
    var index = findIndex(this.queuedHandlers, function (other) {
      return handler.priority > other.priority;
    });

    if (index === -1) {
      this.queuedHandlers.push(handler);
    } else {
      this.queuedHandlers.splice(index, 0, handler);
    }

    return handler;
  };

  _proto._dequeue = function _dequeue(handler) {
    var index = this.queuedHandlers.indexOf(handler);

    if (index !== -1) {
      this.queuedHandlers.splice(index, 1);
    }
  };

  _proto.run = function run(fn, queueOptions) {
    if (this.activeRequests < this.limit) {
      return this._call(fn);
    }

    return this._queue(fn, queueOptions);
  };

  _proto.wrapPromiseFunction = function wrapPromiseFunction(fn, queueOptions) {
    var _this4 = this;

    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var queuedRequest;
      var outerPromise = new Promise(function (resolve, reject) {
        queuedRequest = _this4.run(function () {
          var cancelError;
          var innerPromise;

          try {
            innerPromise = Promise.resolve(fn.apply(void 0, args));
          } catch (err) {
            innerPromise = Promise.reject(err);
          }

          innerPromise.then(function (result) {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              resolve(result);
            }
          }, function (err) {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              reject(err);
            }
          });
          return function () {
            cancelError = createCancelError();
          };
        }, queueOptions);
      });

      outerPromise.abort = function () {
        queuedRequest.abort();
      };

      return outerPromise;
    };
  };

  return RateLimitedQueue;
}();

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/Translator.js":
/*!*****************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/Translator.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var has = __webpack_require__(/*! ./hasProperty */ "../node_modules/@uppy/utils/lib/hasProperty.js");
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */


module.exports = /*#__PURE__*/function () {
  /**
   * @param {object|Array<object>} locales - locale or list of locales.
   */
  function Translator(locales) {
    var _this = this;

    this.locale = {
      strings: {},
      pluralize: function pluralize(n) {
        if (n === 1) {
          return 0;
        }

        return 1;
      }
    };

    if (Array.isArray(locales)) {
      locales.forEach(function (locale) {
        return _this._apply(locale);
      });
    } else {
      this._apply(locales);
    }
  }

  var _proto = Translator.prototype;

  _proto._apply = function _apply(locale) {
    if (!locale || !locale.strings) {
      return;
    }

    var prevLocale = this.locale;
    this.locale = _extends({}, prevLocale, {
      strings: _extends({}, prevLocale.strings, locale.strings)
    });
    this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
  }
  /**
   * Takes a string with placeholder variables like `%{smart_count} file selected`
   * and replaces it with values from options `{smart_count: 5}`
   *
   * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
   * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
   *
   * @param {string} phrase that needs interpolation, with placeholders
   * @param {object} options with values that will be used to replace placeholders
   * @returns {string} interpolated
   */
  ;

  _proto.interpolate = function interpolate(phrase, options) {
    var _String$prototype = String.prototype,
        split = _String$prototype.split,
        replace = _String$prototype.replace;
    var dollarRegex = /\$/g;
    var dollarBillsYall = '$$$$';
    var interpolated = [phrase];

    for (var arg in options) {
      if (arg !== '_' && has(options, arg)) {
        // Ensure replacement value is escaped to prevent special $-prefixed
        // regex replace tokens. the "$$$$" is needed because each "$" needs to
        // be escaped with "$" itself, and we need two in the resulting output.
        var replacement = options[arg];

        if (typeof replacement === 'string') {
          replacement = replace.call(options[arg], dollarRegex, dollarBillsYall);
        } // We create a new `RegExp` each time instead of using a more-efficient
        // string replace so that the same argument can be replaced multiple times
        // in the same phrase.


        interpolated = insertReplacement(interpolated, new RegExp('%\\{' + arg + '\\}', 'g'), replacement);
      }
    }

    return interpolated;

    function insertReplacement(source, rx, replacement) {
      var newParts = [];
      source.forEach(function (chunk) {
        // When the source contains multiple placeholders for interpolation,
        // we should ignore chunks that are not strings, because those
        // can be JSX objects and will be otherwise incorrectly turned into strings.
        // Without this condition we’d get this: [object Object] hello [object Object] my <button>
        if (typeof chunk !== 'string') {
          return newParts.push(chunk);
        }

        split.call(chunk, rx).forEach(function (raw, i, list) {
          if (raw !== '') {
            newParts.push(raw);
          } // Interlace with the `replacement` value


          if (i < list.length - 1) {
            newParts.push(replacement);
          }
        });
      });
      return newParts;
    }
  }
  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @returns {string} translated (and interpolated)
   */
  ;

  _proto.translate = function translate(key, options) {
    return this.translateArray(key, options).join('');
  }
  /**
   * Get a translation and return the translated and interpolated parts as an array.
   *
   * @param {string} key
   * @param {object} options with values that will be used to replace placeholders
   * @returns {Array} The translated and interpolated parts, in order.
   */
  ;

  _proto.translateArray = function translateArray(key, options) {
    if (!has(this.locale.strings, key)) {
      throw new Error("missing string: " + key);
    }

    var string = this.locale.strings[key];
    var hasPluralForms = typeof string === 'object';

    if (hasPluralForms) {
      if (options && typeof options.smart_count !== 'undefined') {
        var plural = this.locale.pluralize(options.smart_count);
        return this.interpolate(string[plural], options);
      } else {
        throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
      }
    }

    return this.interpolate(string, options);
  };

  return Translator;
}();

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/emitSocketProgress.js":
/*!*************************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/emitSocketProgress.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var throttle = __webpack_require__(/*! lodash.throttle */ "../node_modules/lodash.throttle/index.js");

function _emitSocketProgress(uploader, progressData, file) {
  var progress = progressData.progress,
      bytesUploaded = progressData.bytesUploaded,
      bytesTotal = progressData.bytesTotal;

  if (progress) {
    uploader.uppy.log("Upload progress: " + progress);
    uploader.uppy.emit('upload-progress', file, {
      uploader: uploader,
      bytesUploaded: bytesUploaded,
      bytesTotal: bytesTotal
    });
  }
}

module.exports = throttle(_emitSocketProgress, 300, {
  leading: true,
  trailing: true
});

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/fetchWithNetworkError.js":
/*!****************************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/fetchWithNetworkError.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var NetworkError = __webpack_require__(/*! @uppy/utils/lib/NetworkError */ "../node_modules/@uppy/utils/lib/NetworkError.js");
/**
 * Wrapper around window.fetch that throws a NetworkError when appropriate
 */


module.exports = function fetchWithNetworkError() {
  return fetch.apply(void 0, arguments).catch(function (err) {
    if (err.name === 'AbortError') {
      throw err;
    } else {
      throw new NetworkError(err);
    }
  });
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/findDOMElement.js":
/*!*********************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/findDOMElement.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isDOMElement = __webpack_require__(/*! ./isDOMElement */ "../node_modules/@uppy/utils/lib/isDOMElement.js");
/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @returns {Node|null}
 */


module.exports = function findDOMElement(element, context) {
  if (context === void 0) {
    context = document;
  }

  if (typeof element === 'string') {
    return context.querySelector(element);
  }

  if (isDOMElement(element)) {
    return element;
  }
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/generateFileID.js":
/*!*********************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/generateFileID.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {object} file
 * @returns {string} the fileID
 */
module.exports = function generateFileID(file) {
  // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
  // is slower! simple string concatenation is fast
  var id = 'uppy';

  if (typeof file.name === 'string') {
    id += '-' + encodeFilename(file.name.toLowerCase());
  }

  if (file.type !== undefined) {
    id += '-' + file.type;
  }

  if (file.meta && typeof file.meta.relativePath === 'string') {
    id += '-' + encodeFilename(file.meta.relativePath.toLowerCase());
  }

  if (file.data.size !== undefined) {
    id += '-' + file.data.size;
  }

  if (file.data.lastModified !== undefined) {
    id += '-' + file.data.lastModified;
  }

  return id;
};

function encodeFilename(name) {
  var suffix = '';
  return name.replace(/[^A-Z0-9]/ig, function (character) {
    suffix += '-' + encodeCharacter(character);
    return '/';
  }) + suffix;
}

function encodeCharacter(character) {
  return character.charCodeAt(0).toString(32);
}

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/getBytesRemaining.js":
/*!************************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/getBytesRemaining.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function getBytesRemaining(fileProgress) {
  return fileProgress.bytesTotal - fileProgress.bytesUploaded;
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/getFileNameAndExtension.js":
/*!******************************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/getFileNameAndExtension.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Takes a full filename string and returns an object {name, extension}
 *
 * @param {string} fullFileName
 * @returns {object} {name, extension}
 */
module.exports = function getFileNameAndExtension(fullFileName) {
  var lastDot = fullFileName.lastIndexOf('.'); // these count as no extension: "no-dot", "trailing-dot."

  if (lastDot === -1 || lastDot === fullFileName.length - 1) {
    return {
      name: fullFileName,
      extension: undefined
    };
  } else {
    return {
      name: fullFileName.slice(0, lastDot),
      extension: fullFileName.slice(lastDot + 1)
    };
  }
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/getFileType.js":
/*!******************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/getFileType.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getFileNameAndExtension = __webpack_require__(/*! ./getFileNameAndExtension */ "../node_modules/@uppy/utils/lib/getFileNameAndExtension.js");

var mimeTypes = __webpack_require__(/*! ./mimeTypes */ "../node_modules/@uppy/utils/lib/mimeTypes.js");

module.exports = function getFileType(file) {
  var fileExtension = file.name ? getFileNameAndExtension(file.name).extension : null;
  fileExtension = fileExtension ? fileExtension.toLowerCase() : null;

  if (file.type) {
    // if mime type is set in the file object already, use that
    return file.type;
  } else if (fileExtension && mimeTypes[fileExtension]) {
    // else, see if we can map extension to a mime type
    return mimeTypes[fileExtension];
  } else {
    // if all fails, fall back to a generic byte stream type
    return 'application/octet-stream';
  }
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/getSocketHost.js":
/*!********************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/getSocketHost.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function getSocketHost(url) {
  // get the host domain
  var regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
  var host = regex.exec(url)[1];
  var socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
  return socketProtocol + "://" + host;
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/getSpeed.js":
/*!***************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/getSpeed.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function getSpeed(fileProgress) {
  if (!fileProgress.bytesUploaded) return 0;
  var timeElapsed = new Date() - fileProgress.uploadStarted;
  var uploadSpeed = fileProgress.bytesUploaded / (timeElapsed / 1000);
  return uploadSpeed;
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/getTimeStamp.js":
/*!*******************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/getTimeStamp.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */
module.exports = function getTimeStamp() {
  var date = new Date();
  var hours = pad(date.getHours().toString());
  var minutes = pad(date.getMinutes().toString());
  var seconds = pad(date.getSeconds().toString());
  return hours + ':' + minutes + ':' + seconds;
};
/**
 * Adds zero to strings shorter than two characters
 */


function pad(str) {
  return str.length !== 2 ? 0 + str : str;
}

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/hasProperty.js":
/*!******************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/hasProperty.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/isDOMElement.js":
/*!*******************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/isDOMElement.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
module.exports = function isDOMElement(obj) {
  return obj && typeof obj === 'object' && obj.nodeType === Node.ELEMENT_NODE;
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/isNetworkError.js":
/*!*********************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/isNetworkError.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function isNetworkError(xhr) {
  if (!xhr) {
    return false;
  }

  return xhr.readyState !== 0 && xhr.readyState !== 4 || xhr.status === 0;
}

module.exports = isNetworkError;

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/mimeTypes.js":
/*!****************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/mimeTypes.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
module.exports = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  tab: 'text/tab-separated-values',
  avi: 'video/x-msvideo',
  mks: 'video/x-matroska',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  doc: 'application/msword',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  xla: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlc: 'application/vnd.ms-excel',
  xlf: 'application/x-xliff+xml',
  xlm: 'application/vnd.ms-excel',
  xls: 'application/vnd.ms-excel',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlt: 'application/vnd.ms-excel',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  xlw: 'application/vnd.ms-excel',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  log: 'text/plain',
  pdf: 'application/pdf',
  zip: 'application/zip',
  '7z': 'application/x-7z-compressed',
  rar: 'application/x-rar-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  dmg: 'application/x-apple-diskimage'
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/prettyETA.js":
/*!****************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/prettyETA.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var secondsToTime = __webpack_require__(/*! ./secondsToTime */ "../node_modules/@uppy/utils/lib/secondsToTime.js");

module.exports = function prettyETA(seconds) {
  var time = secondsToTime(seconds); // Only display hours and minutes if they are greater than 0 but always
  // display minutes if hours is being displayed
  // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s

  var hoursStr = time.hours ? time.hours + 'h ' : '';
  var minutesVal = time.hours ? ('0' + time.minutes).substr(-2) : time.minutes;
  var minutesStr = minutesVal ? minutesVal + 'm' : '';
  var secondsVal = minutesVal ? ('0' + time.seconds).substr(-2) : time.seconds;
  var secondsStr = time.hours ? '' : minutesVal ? ' ' + secondsVal + 's' : secondsVal + 's';
  return "" + hoursStr + minutesStr + secondsStr;
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/secondsToTime.js":
/*!********************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/secondsToTime.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function secondsToTime(rawSeconds) {
  var hours = Math.floor(rawSeconds / 3600) % 24;
  var minutes = Math.floor(rawSeconds / 60) % 60;
  var seconds = Math.floor(rawSeconds % 60);
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/settle.js":
/*!*************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/settle.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function settle(promises) {
  var resolutions = [];
  var rejections = [];

  function resolved(value) {
    resolutions.push(value);
  }

  function rejected(error) {
    rejections.push(error);
  }

  var wait = Promise.all(promises.map(function (promise) {
    return promise.then(resolved, rejected);
  }));
  return wait.then(function () {
    return {
      successful: resolutions,
      failed: rejections
    };
  });
};

/***/ }),

/***/ "../node_modules/@uppy/utils/lib/toArray.js":
/*!**************************************************!*\
  !*** ../node_modules/@uppy/utils/lib/toArray.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Converts list into array
 */
module.exports = function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvbGliL0F1dGhFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvbGliL1Byb3ZpZGVyLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9saWIvUmVxdWVzdENsaWVudC5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvbGliL1NlYXJjaFByb3ZpZGVyLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9saWIvU29ja2V0LmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L2xpYi90b2tlblN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS9jb3JlL2xpYi9QbHVnaW4uanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS9jb3JlL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L2NvcmUvbGliL2xvZ2dlcnMuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS9jb3JlL2xpYi9zdXBwb3J0c1VwbG9hZFByb2dyZXNzLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvZmlsZS1pbnB1dC9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS9pbmZvcm1lci9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS9zdGF0dXMtYmFyL2xpYi9TdGF0dXNCYXIuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS9zdGF0dXMtYmFyL2xpYi9TdGF0dXNCYXJTdGF0ZXMuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS9zdGF0dXMtYmFyL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3N0b3JlLWRlZmF1bHQvbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvdHVzL2xpYi9nZXRGaW5nZXJwcmludC5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3R1cy9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS91dGlscy9saWIvRXZlbnRUcmFja2VyLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvdXRpbHMvbGliL05ldHdvcmtFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi9SYXRlTGltaXRlZFF1ZXVlLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvdXRpbHMvbGliL1RyYW5zbGF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS91dGlscy9saWIvZW1pdFNvY2tldFByb2dyZXNzLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvdXRpbHMvbGliL2ZldGNoV2l0aE5ldHdvcmtFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi9maW5kRE9NRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi9nZW5lcmF0ZUZpbGVJRC5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi9nZXRCeXRlc1JlbWFpbmluZy5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbi5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlVHlwZS5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi9nZXRTb2NrZXRIb3N0LmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvdXRpbHMvbGliL2dldFNwZWVkLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvdXRpbHMvbGliL2dldFRpbWVTdGFtcC5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi9oYXNQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi9pc0RPTUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS91dGlscy9saWIvaXNOZXR3b3JrRXJyb3IuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AdXBweS91dGlscy9saWIvbWltZVR5cGVzLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvdXRpbHMvbGliL3ByZXR0eUVUQS5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi9zZWNvbmRzVG9UaW1lLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvQHVwcHkvdXRpbHMvbGliL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL0B1cHB5L3V0aWxzL2xpYi90b0FycmF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTs7QUFFYiwrQ0FBK0MsMERBQTBELDJDQUEyQyxpQ0FBaUM7O0FBRXJMLGtDQUFrQyxnRUFBZ0Usc0RBQXNELCtEQUErRCxtQ0FBbUMs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QUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDOztBQUVsQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0M7O0FBRWxDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDOztBQUVsQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLG1DQUFtQzs7O0FBR3hDO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTCx5RkFBeUY7QUFDekY7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsNkJBQTZCOztBQUU3QixrQ0FBa0M7QUFDbEMsNkJBQTZCO0FBQzdCLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDZCQUE2Qjs7QUFFN0Isa0NBQWtDO0FBQ2xDLDZCQUE2QjtBQUM3QixPQUFPO0FBQ1AsaURBQWlEO0FBQ2pEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSyxFQUFFOztBQUVQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGVBQWU7QUFDZjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxnQkFBZ0I7QUFDN0IsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLGNBQWM7QUFDM0IsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7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QUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEU7Ozs7Ozs7Ozs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFIiwiZmlsZSI6ImpzL25wbS91cHB5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTsgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxuZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykgeyB2YXIgX2NhY2hlID0gdHlwZW9mIE1hcCA9PT0gXCJmdW5jdGlvblwiID8gbmV3IE1hcCgpIDogdW5kZWZpbmVkOyBfd3JhcE5hdGl2ZVN1cGVyID0gZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykgeyBpZiAoQ2xhc3MgPT09IG51bGwgfHwgIV9pc05hdGl2ZUZ1bmN0aW9uKENsYXNzKSkgcmV0dXJuIENsYXNzOyBpZiAodHlwZW9mIENsYXNzICE9PSBcImZ1bmN0aW9uXCIpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IGlmICh0eXBlb2YgX2NhY2hlICE9PSBcInVuZGVmaW5lZFwiKSB7IGlmIChfY2FjaGUuaGFzKENsYXNzKSkgcmV0dXJuIF9jYWNoZS5nZXQoQ2xhc3MpOyBfY2FjaGUuc2V0KENsYXNzLCBXcmFwcGVyKTsgfSBmdW5jdGlvbiBXcmFwcGVyKCkgeyByZXR1cm4gX2NvbnN0cnVjdChDbGFzcywgYXJndW1lbnRzLCBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3IpOyB9IFdyYXBwZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IFdyYXBwZXIsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IHJldHVybiBfc2V0UHJvdG90eXBlT2YoV3JhcHBlciwgQ2xhc3MpOyB9OyByZXR1cm4gX3dyYXBOYXRpdmVTdXBlcihDbGFzcyk7IH1cblxuZnVuY3Rpb24gX2NvbnN0cnVjdChQYXJlbnQsIGFyZ3MsIENsYXNzKSB7IGlmIChfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkpIHsgX2NvbnN0cnVjdCA9IFJlZmxlY3QuY29uc3RydWN0OyB9IGVsc2UgeyBfY29uc3RydWN0ID0gZnVuY3Rpb24gX2NvbnN0cnVjdChQYXJlbnQsIGFyZ3MsIENsYXNzKSB7IHZhciBhID0gW251bGxdOyBhLnB1c2guYXBwbHkoYSwgYXJncyk7IHZhciBDb25zdHJ1Y3RvciA9IEZ1bmN0aW9uLmJpbmQuYXBwbHkoUGFyZW50LCBhKTsgdmFyIGluc3RhbmNlID0gbmV3IENvbnN0cnVjdG9yKCk7IGlmIChDbGFzcykgX3NldFByb3RvdHlwZU9mKGluc3RhbmNlLCBDbGFzcy5wcm90b3R5cGUpOyByZXR1cm4gaW5zdGFuY2U7IH07IH0gcmV0dXJuIF9jb25zdHJ1Y3QuYXBwbHkobnVsbCwgYXJndW1lbnRzKTsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZUZ1bmN0aW9uKGZuKSB7IHJldHVybiBGdW5jdGlvbi50b1N0cmluZy5jYWxsKGZuKS5pbmRleE9mKFwiW25hdGl2ZSBjb2RlXVwiKSAhPT0gLTE7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG52YXIgQXV0aEVycm9yID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfRXJyb3IpIHtcbiAgX2luaGVyaXRzTG9vc2UoQXV0aEVycm9yLCBfRXJyb3IpO1xuXG4gIGZ1bmN0aW9uIEF1dGhFcnJvcigpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfdGhpcyA9IF9FcnJvci5jYWxsKHRoaXMsICdBdXRob3JpemF0aW9uIHJlcXVpcmVkJykgfHwgdGhpcztcbiAgICBfdGhpcy5uYW1lID0gJ0F1dGhFcnJvcic7XG4gICAgX3RoaXMuaXNBdXRoRXJyb3IgPSB0cnVlO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIHJldHVybiBBdXRoRXJyb3I7XG59KCAvKiNfX1BVUkVfXyovX3dyYXBOYXRpdmVTdXBlcihFcnJvcikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGhFcnJvcjsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpO1xuXG52YXIgdG9rZW5TdG9yYWdlID0gcmVxdWlyZSgnLi90b2tlblN0b3JhZ2UnKTtcblxudmFyIF9nZXROYW1lID0gZnVuY3Rpb24gX2dldE5hbWUoaWQpIHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgcmV0dXJuIHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpO1xuICB9KS5qb2luKCcgJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX1JlcXVlc3RDbGllbnQpIHtcbiAgX2luaGVyaXRzTG9vc2UoUHJvdmlkZXIsIF9SZXF1ZXN0Q2xpZW50KTtcblxuICBmdW5jdGlvbiBQcm92aWRlcih1cHB5LCBvcHRzKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX3RoaXMgPSBfUmVxdWVzdENsaWVudC5jYWxsKHRoaXMsIHVwcHksIG9wdHMpIHx8IHRoaXM7XG4gICAgX3RoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyO1xuICAgIF90aGlzLmlkID0gX3RoaXMucHJvdmlkZXI7XG4gICAgX3RoaXMubmFtZSA9IF90aGlzLm9wdHMubmFtZSB8fCBfZ2V0TmFtZShfdGhpcy5pZCk7XG4gICAgX3RoaXMucGx1Z2luSWQgPSBfdGhpcy5vcHRzLnBsdWdpbklkO1xuICAgIF90aGlzLnRva2VuS2V5ID0gXCJjb21wYW5pb24tXCIgKyBfdGhpcy5wbHVnaW5JZCArIFwiLWF1dGgtdG9rZW5cIjtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gUHJvdmlkZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5oZWFkZXJzID0gZnVuY3Rpb24gaGVhZGVycygpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW19SZXF1ZXN0Q2xpZW50LnByb3RvdHlwZS5oZWFkZXJzLmNhbGwodGhpcyksIHRoaXMuZ2V0QXV0aFRva2VuKCldKS50aGVuKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICB2YXIgaGVhZGVycyA9IF9yZWZbMF0sXG4gICAgICAgICAgdG9rZW4gPSBfcmVmWzFdO1xuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBoZWFkZXJzLCB7XG4gICAgICAgICd1cHB5LWF1dGgtdG9rZW4nOiB0b2tlblxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLm9uUmVjZWl2ZVJlc3BvbnNlID0gZnVuY3Rpb24gb25SZWNlaXZlUmVzcG9uc2UocmVzcG9uc2UpIHtcbiAgICByZXNwb25zZSA9IF9SZXF1ZXN0Q2xpZW50LnByb3RvdHlwZS5vblJlY2VpdmVSZXNwb25zZS5jYWxsKHRoaXMsIHJlc3BvbnNlKTtcbiAgICB2YXIgcGx1Z2luID0gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKTtcbiAgICB2YXIgb2xkQXV0aGVudGljYXRlZCA9IHBsdWdpbi5nZXRQbHVnaW5TdGF0ZSgpLmF1dGhlbnRpY2F0ZWQ7XG4gICAgdmFyIGF1dGhlbnRpY2F0ZWQgPSBvbGRBdXRoZW50aWNhdGVkID8gcmVzcG9uc2Uuc3RhdHVzICE9PSA0MDEgOiByZXNwb25zZS5zdGF0dXMgPCA0MDA7XG4gICAgcGx1Z2luLnNldFBsdWdpblN0YXRlKHtcbiAgICAgIGF1dGhlbnRpY2F0ZWQ6IGF1dGhlbnRpY2F0ZWRcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0gLy8gQHRvZG8oaS5vbGFyZXdhanUpIGNvbnNpZGVyIHdoZXRoZXIgb3Igbm90IHRoaXMgbWV0aG9kIHNob3VsZCBiZSBleHBvc2VkXG4gIDtcblxuICBfcHJvdG8uc2V0QXV0aFRva2VuID0gZnVuY3Rpb24gc2V0QXV0aFRva2VuKHRva2VuKSB7XG4gICAgcmV0dXJuIHRoaXMudXBweS5nZXRQbHVnaW4odGhpcy5wbHVnaW5JZCkuc3RvcmFnZS5zZXRJdGVtKHRoaXMudG9rZW5LZXksIHRva2VuKTtcbiAgfTtcblxuICBfcHJvdG8uZ2V0QXV0aFRva2VuID0gZnVuY3Rpb24gZ2V0QXV0aFRva2VuKCkge1xuICAgIHJldHVybiB0aGlzLnVwcHkuZ2V0UGx1Z2luKHRoaXMucGx1Z2luSWQpLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnRva2VuS2V5KTtcbiAgfTtcblxuICBfcHJvdG8uYXV0aFVybCA9IGZ1bmN0aW9uIGF1dGhVcmwoKSB7XG4gICAgcmV0dXJuIHRoaXMuaG9zdG5hbWUgKyBcIi9cIiArIHRoaXMuaWQgKyBcIi9jb25uZWN0XCI7XG4gIH07XG5cbiAgX3Byb3RvLmZpbGVVcmwgPSBmdW5jdGlvbiBmaWxlVXJsKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuaG9zdG5hbWUgKyBcIi9cIiArIHRoaXMuaWQgKyBcIi9nZXQvXCIgKyBpZDtcbiAgfTtcblxuICBfcHJvdG8ubGlzdCA9IGZ1bmN0aW9uIGxpc3QoZGlyZWN0b3J5KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KHRoaXMuaWQgKyBcIi9saXN0L1wiICsgKGRpcmVjdG9yeSB8fCAnJykpO1xuICB9O1xuXG4gIF9wcm90by5sb2dvdXQgPSBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy5nZXQodGhpcy5pZCArIFwiL2xvZ291dFwiKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtyZXNwb25zZSwgX3RoaXMyLnVwcHkuZ2V0UGx1Z2luKF90aGlzMi5wbHVnaW5JZCkuc3RvcmFnZS5yZW1vdmVJdGVtKF90aGlzMi50b2tlbktleSldKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgdmFyIHJlc3BvbnNlID0gX3JlZjJbMF07XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgUHJvdmlkZXIuaW5pdFBsdWdpbiA9IGZ1bmN0aW9uIGluaXRQbHVnaW4ocGx1Z2luLCBvcHRzLCBkZWZhdWx0T3B0cykge1xuICAgIHBsdWdpbi50eXBlID0gJ2FjcXVpcmVyJztcbiAgICBwbHVnaW4uZmlsZXMgPSBbXTtcblxuICAgIGlmIChkZWZhdWx0T3B0cykge1xuICAgICAgcGx1Z2luLm9wdHMgPSBfZXh0ZW5kcyh7fSwgZGVmYXVsdE9wdHMsIG9wdHMpO1xuICAgIH1cblxuICAgIGlmIChvcHRzLnNlcnZlclVybCB8fCBvcHRzLnNlcnZlclBhdHRlcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHNlcnZlclVybGAgYW5kIGBzZXJ2ZXJQYXR0ZXJuYCBoYXZlIGJlZW4gcmVuYW1lZCB0byBgY29tcGFuaW9uVXJsYCBhbmQgYGNvbXBhbmlvbkFsbG93ZWRIb3N0c2AgcmVzcGVjdGl2ZWx5IGluIHRoZSAwLjMwLjUgcmVsZWFzZS4gUGxlYXNlIGNvbnN1bHQgdGhlIGRvY3MgKGZvciBleGFtcGxlLCBodHRwczovL3VwcHkuaW8vZG9jcy9pbnN0YWdyYW0vIGZvciB0aGUgSW5zdGFncmFtIHBsdWdpbikgYW5kIHVzZSB0aGUgdXBkYXRlZCBvcHRpb25zLmAnKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMpIHtcbiAgICAgIHZhciBwYXR0ZXJuID0gb3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHM7IC8vIHZhbGlkYXRlIGNvbXBhbmlvbkFsbG93ZWRIb3N0cyBwYXJhbVxuXG4gICAgICBpZiAodHlwZW9mIHBhdHRlcm4gIT09ICdzdHJpbmcnICYmICFBcnJheS5pc0FycmF5KHBhdHRlcm4pICYmICEocGF0dGVybiBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihwbHVnaW4uaWQgKyBcIjogdGhlIG9wdGlvbiBcXFwiY29tcGFuaW9uQWxsb3dlZEhvc3RzXFxcIiBtdXN0IGJlIG9uZSBvZiBzdHJpbmcsIEFycmF5LCBSZWdFeHBcIik7XG4gICAgICB9XG5cbiAgICAgIHBsdWdpbi5vcHRzLmNvbXBhbmlvbkFsbG93ZWRIb3N0cyA9IHBhdHRlcm47XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRvZXMgbm90IHN0YXJ0IHdpdGggaHR0cHM6Ly9cbiAgICAgIGlmICgvXig/IWh0dHBzPzpcXC9cXC8pLiokL2kudGVzdChvcHRzLmNvbXBhbmlvblVybCkpIHtcbiAgICAgICAgcGx1Z2luLm9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzID0gXCJodHRwczovL1wiICsgb3B0cy5jb21wYW5pb25VcmwucmVwbGFjZSgvXlxcL1xcLy8sICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsdWdpbi5vcHRzLmNvbXBhbmlvbkFsbG93ZWRIb3N0cyA9IG9wdHMuY29tcGFuaW9uVXJsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBsdWdpbi5zdG9yYWdlID0gcGx1Z2luLm9wdHMuc3RvcmFnZSB8fCB0b2tlblN0b3JhZ2U7XG4gIH07XG5cbiAgcmV0dXJuIFByb3ZpZGVyO1xufShSZXF1ZXN0Q2xpZW50KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfY2xhc3MsIF90ZW1wO1xuXG5mdW5jdGlvbiBfZXh0ZW5kcygpIHsgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBBdXRoRXJyb3IgPSByZXF1aXJlKCcuL0F1dGhFcnJvcicpO1xuXG52YXIgZmV0Y2hXaXRoTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2ZldGNoV2l0aE5ldHdvcmtFcnJvcicpOyAvLyBSZW1vdmUgdGhlIHRyYWlsaW5nIHNsYXNoIHNvIHdlIGNhbiBhbHdheXMgc2FmZWx5IGFwcGVuZCAveHl6LlxuXG5cbmZ1bmN0aW9uIHN0cmlwU2xhc2godXJsKSB7XG4gIHJldHVybiB1cmwucmVwbGFjZSgvXFwvJC8sICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoX3RlbXAgPSBfY2xhc3MgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBSZXF1ZXN0Q2xpZW50KHVwcHksIG9wdHMpIHtcbiAgICB0aGlzLnVwcHkgPSB1cHB5O1xuICAgIHRoaXMub3B0cyA9IG9wdHM7XG4gICAgdGhpcy5vblJlY2VpdmVSZXNwb25zZSA9IHRoaXMub25SZWNlaXZlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmFsbG93ZWRIZWFkZXJzID0gWydhY2NlcHQnLCAnY29udGVudC10eXBlJywgJ3VwcHktYXV0aC10b2tlbiddO1xuICAgIHRoaXMucHJlZmxpZ2h0RG9uZSA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFJlcXVlc3RDbGllbnQucHJvdG90eXBlO1xuXG4gIF9wcm90by5oZWFkZXJzID0gZnVuY3Rpb24gaGVhZGVycygpIHtcbiAgICB2YXIgdXNlckhlYWRlcnMgPSB0aGlzLm9wdHMuY29tcGFuaW9uSGVhZGVycyB8fCB0aGlzLm9wdHMuc2VydmVySGVhZGVycyB8fCB7fTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKF9leHRlbmRzKHt9LCB0aGlzLmRlZmF1bHRIZWFkZXJzLCB1c2VySGVhZGVycykpO1xuICB9O1xuXG4gIF9wcm90by5fZ2V0UG9zdFJlc3BvbnNlRnVuYyA9IGZ1bmN0aW9uIF9nZXRQb3N0UmVzcG9uc2VGdW5jKHNraXApIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKCFza2lwKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5vblJlY2VpdmVSZXNwb25zZShyZXNwb25zZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuICB9O1xuXG4gIF9wcm90by5vblJlY2VpdmVSZXNwb25zZSA9IGZ1bmN0aW9uIG9uUmVjZWl2ZVJlc3BvbnNlKHJlc3BvbnNlKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cHB5LmdldFN0YXRlKCk7XG4gICAgdmFyIGNvbXBhbmlvbiA9IHN0YXRlLmNvbXBhbmlvbiB8fCB7fTtcbiAgICB2YXIgaG9zdCA9IHRoaXMub3B0cy5jb21wYW5pb25Vcmw7XG4gICAgdmFyIGhlYWRlcnMgPSByZXNwb25zZS5oZWFkZXJzOyAvLyBTdG9yZSB0aGUgc2VsZi1pZGVudGlmaWVkIGRvbWFpbiBuYW1lIGZvciB0aGUgQ29tcGFuaW9uIGluc3RhbmNlIHdlIGp1c3QgaGl0LlxuXG4gICAgaWYgKGhlYWRlcnMuaGFzKCdpLWFtJykgJiYgaGVhZGVycy5nZXQoJ2ktYW0nKSAhPT0gY29tcGFuaW9uW2hvc3RdKSB7XG4gICAgICB2YXIgX2V4dGVuZHMyO1xuXG4gICAgICB0aGlzLnVwcHkuc2V0U3RhdGUoe1xuICAgICAgICBjb21wYW5pb246IF9leHRlbmRzKHt9LCBjb21wYW5pb24sIChfZXh0ZW5kczIgPSB7fSwgX2V4dGVuZHMyW2hvc3RdID0gaGVhZGVycy5nZXQoJ2ktYW0nKSwgX2V4dGVuZHMyKSlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfTtcblxuICBfcHJvdG8uX2dldFVybCA9IGZ1bmN0aW9uIF9nZXRVcmwodXJsKSB7XG4gICAgaWYgKC9eKGh0dHBzPzp8KVxcL1xcLy8udGVzdCh1cmwpKSB7XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhvc3RuYW1lICsgXCIvXCIgKyB1cmw7XG4gIH07XG5cbiAgX3Byb3RvLl9qc29uID0gZnVuY3Rpb24gX2pzb24ocmVzKSB7XG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgdGhyb3cgbmV3IEF1dGhFcnJvcigpO1xuICAgIH1cblxuICAgIGlmIChyZXMuc3RhdHVzIDwgMjAwIHx8IHJlcy5zdGF0dXMgPiAzMDApIHtcbiAgICAgIHZhciBlcnJNc2cgPSBcIkZhaWxlZCByZXF1ZXN0IHdpdGggc3RhdHVzOiBcIiArIHJlcy5zdGF0dXMgKyBcIi4gXCIgKyByZXMuc3RhdHVzVGV4dDtcbiAgICAgIHJldHVybiByZXMuanNvbigpLnRoZW4oZnVuY3Rpb24gKGVyckRhdGEpIHtcbiAgICAgICAgZXJyTXNnID0gZXJyRGF0YS5tZXNzYWdlID8gZXJyTXNnICsgXCIgbWVzc2FnZTogXCIgKyBlcnJEYXRhLm1lc3NhZ2UgOiBlcnJNc2c7XG4gICAgICAgIGVyck1zZyA9IGVyckRhdGEucmVxdWVzdElkID8gZXJyTXNnICsgXCIgcmVxdWVzdC1JZDogXCIgKyBlcnJEYXRhLnJlcXVlc3RJZCA6IGVyck1zZztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZyk7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gIH07XG5cbiAgX3Byb3RvLnByZWZsaWdodCA9IGZ1bmN0aW9uIHByZWZsaWdodChwYXRoKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5wcmVmbGlnaHREb25lKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuYWxsb3dlZEhlYWRlcnMuc2xpY2UoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZldGNoKHRoaXMuX2dldFVybChwYXRoKSwge1xuICAgICAgbWV0aG9kOiAnT1BUSU9OUydcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMuaGFzKCdhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJykpIHtcbiAgICAgICAgX3RoaXMyLmFsbG93ZWRIZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnKS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbiAoaGVhZGVyTmFtZSkge1xuICAgICAgICAgIHJldHVybiBoZWFkZXJOYW1lLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMyLnByZWZsaWdodERvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIF90aGlzMi5hbGxvd2VkSGVhZGVycy5zbGljZSgpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIF90aGlzMi51cHB5LmxvZyhcIltDb21wYW5pb25DbGllbnRdIHVuYWJsZSB0byBtYWtlIHByZWZsaWdodCByZXF1ZXN0IFwiICsgZXJyLCAnd2FybmluZycpO1xuXG4gICAgICBfdGhpczIucHJlZmxpZ2h0RG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gX3RoaXMyLmFsbG93ZWRIZWFkZXJzLnNsaWNlKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLnByZWZsaWdodEFuZEhlYWRlcnMgPSBmdW5jdGlvbiBwcmVmbGlnaHRBbmRIZWFkZXJzKHBhdGgpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChbdGhpcy5wcmVmbGlnaHQocGF0aCksIHRoaXMuaGVhZGVycygpXSkudGhlbihmdW5jdGlvbiAoX3JlZikge1xuICAgICAgdmFyIGFsbG93ZWRIZWFkZXJzID0gX3JlZlswXSxcbiAgICAgICAgICBoZWFkZXJzID0gX3JlZlsxXTtcbiAgICAgIC8vIGZpbHRlciB0byBrZWVwIG9ubHkgYWxsb3dlZCBIZWFkZXJzXG4gICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChoZWFkZXIpIHtcbiAgICAgICAgaWYgKGFsbG93ZWRIZWFkZXJzLmluZGV4T2YoaGVhZGVyLnRvTG93ZXJDYXNlKCkpID09PSAtMSkge1xuICAgICAgICAgIF90aGlzMy51cHB5LmxvZyhcIltDb21wYW5pb25DbGllbnRdIGV4Y2x1ZGluZyB1bmFsbG93ZWQgaGVhZGVyIFwiICsgaGVhZGVyKTtcblxuICAgICAgICAgIGRlbGV0ZSBoZWFkZXJzW2hlYWRlcl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGhlYWRlcnM7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLmdldCA9IGZ1bmN0aW9uIGdldChwYXRoLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy5wcmVmbGlnaHRBbmRIZWFkZXJzKHBhdGgpLnRoZW4oZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgICAgIHJldHVybiBmZXRjaFdpdGhOZXR3b3JrRXJyb3IoX3RoaXM0Ll9nZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcbiAgICAgIH0pO1xuICAgIH0pLnRoZW4odGhpcy5fZ2V0UG9zdFJlc3BvbnNlRnVuYyhza2lwUG9zdFJlc3BvbnNlKSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICByZXR1cm4gX3RoaXM0Ll9qc29uKHJlcyk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgZXJyID0gZXJyLmlzQXV0aEVycm9yID8gZXJyIDogbmV3IEVycm9yKFwiQ291bGQgbm90IGdldCBcIiArIF90aGlzNC5fZ2V0VXJsKHBhdGgpICsgXCIuIFwiICsgZXJyKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5wb3N0ID0gZnVuY3Rpb24gcG9zdChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy5wcmVmbGlnaHRBbmRIZWFkZXJzKHBhdGgpLnRoZW4oZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgICAgIHJldHVybiBmZXRjaFdpdGhOZXR3b3JrRXJyb3IoX3RoaXM1Ll9nZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKVxuICAgICAgfSk7XG4gICAgfSkudGhlbih0aGlzLl9nZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIHJldHVybiBfdGhpczUuX2pzb24ocmVzKTtcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBlcnIgPSBlcnIuaXNBdXRoRXJyb3IgPyBlcnIgOiBuZXcgRXJyb3IoXCJDb3VsZCBub3QgcG9zdCBcIiArIF90aGlzNS5fZ2V0VXJsKHBhdGgpICsgXCIuIFwiICsgZXJyKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5kZWxldGUgPSBmdW5jdGlvbiBfZGVsZXRlKHBhdGgsIGRhdGEsIHNraXBQb3N0UmVzcG9uc2UpIHtcbiAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgIHJldHVybiB0aGlzLnByZWZsaWdodEFuZEhlYWRlcnMocGF0aCkudGhlbihmdW5jdGlvbiAoaGVhZGVycykge1xuICAgICAgcmV0dXJuIGZldGNoV2l0aE5ldHdvcmtFcnJvcihfdGhpczYuaG9zdG5hbWUgKyBcIi9cIiArIHBhdGgsIHtcbiAgICAgICAgbWV0aG9kOiAnZGVsZXRlJyxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgIGJvZHk6IGRhdGEgPyBKU09OLnN0cmluZ2lmeShkYXRhKSA6IG51bGxcbiAgICAgIH0pO1xuICAgIH0pLnRoZW4odGhpcy5fZ2V0UG9zdFJlc3BvbnNlRnVuYyhza2lwUG9zdFJlc3BvbnNlKSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICByZXR1cm4gX3RoaXM2Ll9qc29uKHJlcyk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgZXJyID0gZXJyLmlzQXV0aEVycm9yID8gZXJyIDogbmV3IEVycm9yKFwiQ291bGQgbm90IGRlbGV0ZSBcIiArIF90aGlzNi5fZ2V0VXJsKHBhdGgpICsgXCIuIFwiICsgZXJyKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9jcmVhdGVDbGFzcyhSZXF1ZXN0Q2xpZW50LCBbe1xuICAgIGtleTogXCJob3N0bmFtZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIF90aGlzJHVwcHkkZ2V0U3RhdGUgPSB0aGlzLnVwcHkuZ2V0U3RhdGUoKSxcbiAgICAgICAgICBjb21wYW5pb24gPSBfdGhpcyR1cHB5JGdldFN0YXRlLmNvbXBhbmlvbjtcblxuICAgICAgdmFyIGhvc3QgPSB0aGlzLm9wdHMuY29tcGFuaW9uVXJsO1xuICAgICAgcmV0dXJuIHN0cmlwU2xhc2goY29tcGFuaW9uICYmIGNvbXBhbmlvbltob3N0XSA/IGNvbXBhbmlvbltob3N0XSA6IGhvc3QpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZWZhdWx0SGVhZGVyc1wiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdVcHB5LVZlcnNpb25zJzogXCJAdXBweS9jb21wYW5pb24tY2xpZW50PVwiICsgUmVxdWVzdENsaWVudC5WRVJTSU9OXG4gICAgICB9O1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBSZXF1ZXN0Q2xpZW50O1xufSgpLCBfY2xhc3MuVkVSU0lPTiA9IFwiMS43LjBcIiwgX3RlbXApOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2luaGVyaXRzTG9vc2Uoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7IHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzOyBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBSZXF1ZXN0Q2xpZW50ID0gcmVxdWlyZSgnLi9SZXF1ZXN0Q2xpZW50Jyk7XG5cbnZhciBfZ2V0TmFtZSA9IGZ1bmN0aW9uIF9nZXROYW1lKGlkKSB7XG4gIHJldHVybiBpZC5zcGxpdCgnLScpLm1hcChmdW5jdGlvbiAocykge1xuICAgIHJldHVybiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbiAgfSkuam9pbignICcpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9SZXF1ZXN0Q2xpZW50KSB7XG4gIF9pbmhlcml0c0xvb3NlKFNlYXJjaFByb3ZpZGVyLCBfUmVxdWVzdENsaWVudCk7XG5cbiAgZnVuY3Rpb24gU2VhcmNoUHJvdmlkZXIodXBweSwgb3B0cykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX1JlcXVlc3RDbGllbnQuY2FsbCh0aGlzLCB1cHB5LCBvcHRzKSB8fCB0aGlzO1xuICAgIF90aGlzLnByb3ZpZGVyID0gb3B0cy5wcm92aWRlcjtcbiAgICBfdGhpcy5pZCA9IF90aGlzLnByb3ZpZGVyO1xuICAgIF90aGlzLm5hbWUgPSBfdGhpcy5vcHRzLm5hbWUgfHwgX2dldE5hbWUoX3RoaXMuaWQpO1xuICAgIF90aGlzLnBsdWdpbklkID0gX3RoaXMub3B0cy5wbHVnaW5JZDtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gU2VhcmNoUHJvdmlkZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5maWxlVXJsID0gZnVuY3Rpb24gZmlsZVVybChpZCkge1xuICAgIHJldHVybiB0aGlzLmhvc3RuYW1lICsgXCIvc2VhcmNoL1wiICsgdGhpcy5pZCArIFwiL2dldC9cIiArIGlkO1xuICB9O1xuXG4gIF9wcm90by5zZWFyY2ggPSBmdW5jdGlvbiBzZWFyY2godGV4dCwgcXVlcmllcykge1xuICAgIHF1ZXJpZXMgPSBxdWVyaWVzID8gXCImXCIgKyBxdWVyaWVzIDogJyc7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KFwic2VhcmNoL1wiICsgdGhpcy5pZCArIFwiL2xpc3Q/cT1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh0ZXh0KSArIHF1ZXJpZXMpO1xuICB9O1xuXG4gIHJldHVybiBTZWFyY2hQcm92aWRlcjtcbn0oUmVxdWVzdENsaWVudCk7IiwidmFyIGVlID0gcmVxdWlyZSgnbmFtZXNwYWNlLWVtaXR0ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBVcHB5U29ja2V0KG9wdHMpIHtcbiAgICB0aGlzLm9wdHMgPSBvcHRzO1xuICAgIHRoaXMuX3F1ZXVlZCA9IFtdO1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5lbWl0dGVyID0gZWUoKTtcbiAgICB0aGlzLl9oYW5kbGVNZXNzYWdlID0gdGhpcy5faGFuZGxlTWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5lbWl0ID0gdGhpcy5lbWl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbiA9IHRoaXMub24uYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uY2UgPSB0aGlzLm9uY2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcblxuICAgIGlmICghb3B0cyB8fCBvcHRzLmF1dG9PcGVuICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgdmFyIF9wcm90byA9IFVwcHlTb2NrZXQucHJvdG90eXBlO1xuXG4gIF9wcm90by5vcGVuID0gZnVuY3Rpb24gb3BlbigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHRoaXMub3B0cy50YXJnZXQpO1xuXG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIF90aGlzLmlzT3BlbiA9IHRydWU7XG5cbiAgICAgIHdoaWxlIChfdGhpcy5fcXVldWVkLmxlbmd0aCA+IDAgJiYgX3RoaXMuaXNPcGVuKSB7XG4gICAgICAgIHZhciBmaXJzdCA9IF90aGlzLl9xdWV1ZWRbMF07XG5cbiAgICAgICAgX3RoaXMuc2VuZChmaXJzdC5hY3Rpb24sIGZpcnN0LnBheWxvYWQpO1xuXG4gICAgICAgIF90aGlzLl9xdWV1ZWQgPSBfdGhpcy5fcXVldWVkLnNsaWNlKDEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIF90aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLl9oYW5kbGVNZXNzYWdlO1xuICB9O1xuXG4gIF9wcm90by5jbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIGlmICh0aGlzLnNvY2tldCkge1xuICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLnNlbmQgPSBmdW5jdGlvbiBzZW5kKGFjdGlvbiwgcGF5bG9hZCkge1xuICAgIC8vIGF0dGFjaCB1dWlkXG4gICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgdGhpcy5fcXVldWVkLnB1c2goe1xuICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgcGF5bG9hZDogcGF5bG9hZFxuICAgIH0pKTtcbiAgfTtcblxuICBfcHJvdG8ub24gPSBmdW5jdGlvbiBvbihhY3Rpb24sIGhhbmRsZXIpIHtcbiAgICB0aGlzLmVtaXR0ZXIub24oYWN0aW9uLCBoYW5kbGVyKTtcbiAgfTtcblxuICBfcHJvdG8uZW1pdCA9IGZ1bmN0aW9uIGVtaXQoYWN0aW9uLCBwYXlsb2FkKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoYWN0aW9uLCBwYXlsb2FkKTtcbiAgfTtcblxuICBfcHJvdG8ub25jZSA9IGZ1bmN0aW9uIG9uY2UoYWN0aW9uLCBoYW5kbGVyKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uY2UoYWN0aW9uLCBoYW5kbGVyKTtcbiAgfTtcblxuICBfcHJvdG8uX2hhbmRsZU1lc3NhZ2UgPSBmdW5jdGlvbiBfaGFuZGxlTWVzc2FnZShlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBtZXNzYWdlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgICAgdGhpcy5lbWl0KG1lc3NhZ2UuYWN0aW9uLCBtZXNzYWdlLnBheWxvYWQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFVwcHlTb2NrZXQ7XG59KCk7IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBNYW5hZ2VzIGNvbW11bmljYXRpb25zIHdpdGggQ29tcGFuaW9uXG4gKi9cblxudmFyIFJlcXVlc3RDbGllbnQgPSByZXF1aXJlKCcuL1JlcXVlc3RDbGllbnQnKTtcblxudmFyIFByb3ZpZGVyID0gcmVxdWlyZSgnLi9Qcm92aWRlcicpO1xuXG52YXIgU2VhcmNoUHJvdmlkZXIgPSByZXF1aXJlKCcuL1NlYXJjaFByb3ZpZGVyJyk7XG5cbnZhciBTb2NrZXQgPSByZXF1aXJlKCcuL1NvY2tldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgUmVxdWVzdENsaWVudDogUmVxdWVzdENsaWVudCxcbiAgUHJvdmlkZXI6IFByb3ZpZGVyLFxuICBTZWFyY2hQcm92aWRlcjogU2VhcmNoUHJvdmlkZXIsXG4gIFNvY2tldDogU29ja2V0XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogVGhpcyBtb2R1bGUgc2VydmVzIGFzIGFuIEFzeW5jIHdyYXBwZXIgZm9yIExvY2FsU3RvcmFnZVxuICovXG5cbm1vZHVsZS5leHBvcnRzLnNldEl0ZW0gPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICByZXNvbHZlKCk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuZ2V0SXRlbSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgcmVzb2x2ZSgpO1xuICB9KTtcbn07IiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxudmFyIHByZWFjdCA9IHJlcXVpcmUoJ3ByZWFjdCcpO1xuXG52YXIgZmluZERPTUVsZW1lbnQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmluZERPTUVsZW1lbnQnKTtcbi8qKlxuICogRGVmZXIgYSBmcmVxdWVudCBjYWxsIHRvIHRoZSBtaWNyb3Rhc2sgcXVldWUuXG4gKi9cblxuXG5mdW5jdGlvbiBkZWJvdW5jZShmbikge1xuICB2YXIgY2FsbGluZyA9IG51bGw7XG4gIHZhciBsYXRlc3RBcmdzID0gbnVsbDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgbGF0ZXN0QXJncyA9IGFyZ3M7XG5cbiAgICBpZiAoIWNhbGxpbmcpIHtcbiAgICAgIGNhbGxpbmcgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FsbGluZyA9IG51bGw7IC8vIEF0IHRoaXMgcG9pbnQgYGFyZ3NgIG1heSBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgbW9zdFxuICAgICAgICAvLyByZWNlbnQgc3RhdGUsIGlmIG11bHRpcGxlIGNhbGxzIGhhcHBlbmVkIHNpbmNlIHRoaXMgdGFza1xuICAgICAgICAvLyB3YXMgcXVldWVkLiBTbyB3ZSB1c2UgdGhlIGBsYXRlc3RBcmdzYCwgd2hpY2ggZGVmaW5pdGVseVxuICAgICAgICAvLyBpcyB0aGUgbW9zdCByZWNlbnQgY2FsbC5cblxuICAgICAgICByZXR1cm4gZm4uYXBwbHkodm9pZCAwLCBsYXRlc3RBcmdzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBjYWxsaW5nO1xuICB9O1xufVxuLyoqXG4gKiBCb2lsZXJwbGF0ZSB0aGF0IGFsbCBQbHVnaW5zIHNoYXJlIC0gYW5kIHNob3VsZCBub3QgYmUgdXNlZFxuICogZGlyZWN0bHkuIEl0IGFsc28gc2hvd3Mgd2hpY2ggbWV0aG9kcyBmaW5hbCBwbHVnaW5zIHNob3VsZCBpbXBsZW1lbnQvb3ZlcnJpZGUsXG4gKiB0aGlzIGRlY2lkaW5nIG9uIHN0cnVjdHVyZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gbWFpbiBVcHB5IGNvcmUgb2JqZWN0XG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IHdpdGggcGx1Z2luIG9wdGlvbnNcbiAqIEByZXR1cm5zIHtBcnJheXxzdHJpbmd9IGZpbGVzIG9yIHN1Y2Nlc3MvZmFpbCBtZXNzYWdlXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFBsdWdpbih1cHB5LCBvcHRzKSB7XG4gICAgdGhpcy51cHB5ID0gdXBweTtcbiAgICB0aGlzLm9wdHMgPSBvcHRzIHx8IHt9O1xuICAgIHRoaXMudXBkYXRlID0gdGhpcy51cGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLm1vdW50ID0gdGhpcy5tb3VudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5zdGFsbCA9IHRoaXMuaW5zdGFsbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMudW5pbnN0YWxsID0gdGhpcy51bmluc3RhbGwuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBQbHVnaW4ucHJvdG90eXBlO1xuXG4gIF9wcm90by5nZXRQbHVnaW5TdGF0ZSA9IGZ1bmN0aW9uIGdldFBsdWdpblN0YXRlKCkge1xuICAgIHZhciBfdGhpcyR1cHB5JGdldFN0YXRlID0gdGhpcy51cHB5LmdldFN0YXRlKCksXG4gICAgICAgIHBsdWdpbnMgPSBfdGhpcyR1cHB5JGdldFN0YXRlLnBsdWdpbnM7XG5cbiAgICByZXR1cm4gcGx1Z2luc1t0aGlzLmlkXSB8fCB7fTtcbiAgfTtcblxuICBfcHJvdG8uc2V0UGx1Z2luU3RhdGUgPSBmdW5jdGlvbiBzZXRQbHVnaW5TdGF0ZSh1cGRhdGUpIHtcbiAgICB2YXIgX2V4dGVuZHMyO1xuXG4gICAgdmFyIF90aGlzJHVwcHkkZ2V0U3RhdGUyID0gdGhpcy51cHB5LmdldFN0YXRlKCksXG4gICAgICAgIHBsdWdpbnMgPSBfdGhpcyR1cHB5JGdldFN0YXRlMi5wbHVnaW5zO1xuXG4gICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgIHBsdWdpbnM6IF9leHRlbmRzKHt9LCBwbHVnaW5zLCAoX2V4dGVuZHMyID0ge30sIF9leHRlbmRzMlt0aGlzLmlkXSA9IF9leHRlbmRzKHt9LCBwbHVnaW5zW3RoaXMuaWRdLCB1cGRhdGUpLCBfZXh0ZW5kczIpKVxuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhuZXdPcHRzKSB7XG4gICAgdGhpcy5vcHRzID0gX2V4dGVuZHMoe30sIHRoaXMub3B0cywgbmV3T3B0cyk7XG4gICAgdGhpcy5zZXRQbHVnaW5TdGF0ZSgpOyAvLyBzbyB0aGF0IFVJIHJlLXJlbmRlcnMgd2l0aCBuZXcgb3B0aW9uc1xuICB9O1xuXG4gIF9wcm90by51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoc3RhdGUpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuZWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3VwZGF0ZVVJKSB7XG4gICAgICB0aGlzLl91cGRhdGVVSShzdGF0ZSk7XG4gICAgfVxuICB9IC8vIENhbGxlZCBhZnRlciBldmVyeSBzdGF0ZSB1cGRhdGUsIGFmdGVyIGV2ZXJ5dGhpbmcncyBtb3VudGVkLiBEZWJvdW5jZWQuXG4gIDtcblxuICBfcHJvdG8uYWZ0ZXJVcGRhdGUgPSBmdW5jdGlvbiBhZnRlclVwZGF0ZSgpIHt9XG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBwbHVnaW4gaXMgbW91bnRlZCwgd2hldGhlciBpbiBET00gb3IgaW50byBhbm90aGVyIHBsdWdpbi5cbiAgICogTmVlZGVkIGJlY2F1c2Ugc29tZXRpbWVzIHBsdWdpbnMgYXJlIG1vdW50ZWQgc2VwYXJhdGVseS9hZnRlciBgaW5zdGFsbGAsXG4gICAqIHNvIHRoaXMuZWwgYW5kIHRoaXMucGFyZW50IG1pZ2h0IG5vdCBiZSBhdmFpbGFibGUgaW4gYGluc3RhbGxgLlxuICAgKiBUaGlzIGlzIHRoZSBjYXNlIHdpdGggQHVwcHkvcmVhY3QgcGx1Z2lucywgZm9yIGV4YW1wbGUuXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLm9uTW91bnQgPSBmdW5jdGlvbiBvbk1vdW50KCkge31cbiAgLyoqXG4gICAqIENoZWNrIGlmIHN1cHBsaWVkIGB0YXJnZXRgIGlzIGEgRE9NIGVsZW1lbnQgb3IgYW4gYG9iamVjdGAuXG4gICAqIElmIGl04oCZcyBhbiBvYmplY3Qg4oCUIHRhcmdldCBpcyBhIHBsdWdpbiwgYW5kIHdlIHNlYXJjaCBgcGx1Z2luc2BcbiAgICogZm9yIGEgcGx1Z2luIHdpdGggc2FtZSBuYW1lIGFuZCByZXR1cm4gaXRzIHRhcmdldC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSB0YXJnZXRcbiAgICpcbiAgICovXG4gIDtcblxuICBfcHJvdG8ubW91bnQgPSBmdW5jdGlvbiBtb3VudCh0YXJnZXQsIHBsdWdpbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgY2FsbGVyUGx1Z2luTmFtZSA9IHBsdWdpbi5pZDtcbiAgICB2YXIgdGFyZ2V0RWxlbWVudCA9IGZpbmRET01FbGVtZW50KHRhcmdldCk7XG5cbiAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgdGhpcy5pc1RhcmdldERPTUVsID0gdHJ1ZTsgLy8gQVBJIGZvciBwbHVnaW5zIHRoYXQgcmVxdWlyZSBhIHN5bmNocm9ub3VzIHJlcmVuZGVyLlxuXG4gICAgICB0aGlzLnJlcmVuZGVyID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIC8vIHBsdWdpbiBjb3VsZCBiZSByZW1vdmVkLCBidXQgdGhpcy5yZXJlbmRlciBpcyBkZWJvdW5jZWQgYmVsb3csXG4gICAgICAgIC8vIHNvIGl0IGNvdWxkIHN0aWxsIGJlIGNhbGxlZCBldmVuIGFmdGVyIHVwcHkucmVtb3ZlUGx1Z2luIG9yIHVwcHkuY2xvc2VcbiAgICAgICAgLy8gaGVuY2UgdGhlIGNoZWNrXG4gICAgICAgIGlmICghX3RoaXMudXBweS5nZXRQbHVnaW4oX3RoaXMuaWQpKSByZXR1cm47XG4gICAgICAgIF90aGlzLmVsID0gcHJlYWN0LnJlbmRlcihfdGhpcy5yZW5kZXIoc3RhdGUpLCB0YXJnZXRFbGVtZW50LCBfdGhpcy5lbCk7XG5cbiAgICAgICAgX3RoaXMuYWZ0ZXJVcGRhdGUoKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuX3VwZGF0ZVVJID0gZGVib3VuY2UodGhpcy5yZXJlbmRlcik7XG4gICAgICB0aGlzLnVwcHkubG9nKFwiSW5zdGFsbGluZyBcIiArIGNhbGxlclBsdWdpbk5hbWUgKyBcIiB0byBhIERPTSBlbGVtZW50ICdcIiArIHRhcmdldCArIFwiJ1wiKTsgLy8gY2xlYXIgZXZlcnl0aGluZyBpbnNpZGUgdGhlIHRhcmdldCBjb250YWluZXJcblxuICAgICAgaWYgKHRoaXMub3B0cy5yZXBsYWNlVGFyZ2V0Q29udGVudCkge1xuICAgICAgICB0YXJnZXRFbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVsID0gcHJlYWN0LnJlbmRlcih0aGlzLnJlbmRlcih0aGlzLnVwcHkuZ2V0U3RhdGUoKSksIHRhcmdldEVsZW1lbnQpO1xuICAgICAgdGhpcy5vbk1vdW50KCk7XG4gICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICB9XG5cbiAgICB2YXIgdGFyZ2V0UGx1Z2luO1xuXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCBpbnN0YW5jZW9mIFBsdWdpbikge1xuICAgICAgLy8gVGFyZ2V0aW5nIGEgcGx1Z2luICppbnN0YW5jZSpcbiAgICAgIHRhcmdldFBsdWdpbiA9IHRhcmdldDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIFRhcmdldGluZyBhIHBsdWdpbiB0eXBlXG4gICAgICB2YXIgVGFyZ2V0ID0gdGFyZ2V0OyAvLyBGaW5kIHRoZSB0YXJnZXQgcGx1Z2luIGluc3RhbmNlLlxuXG4gICAgICB0aGlzLnVwcHkuaXRlcmF0ZVBsdWdpbnMoZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgICBpZiAocGx1Z2luIGluc3RhbmNlb2YgVGFyZ2V0KSB7XG4gICAgICAgICAgdGFyZ2V0UGx1Z2luID0gcGx1Z2luO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldFBsdWdpbikge1xuICAgICAgdGhpcy51cHB5LmxvZyhcIkluc3RhbGxpbmcgXCIgKyBjYWxsZXJQbHVnaW5OYW1lICsgXCIgdG8gXCIgKyB0YXJnZXRQbHVnaW4uaWQpO1xuICAgICAgdGhpcy5wYXJlbnQgPSB0YXJnZXRQbHVnaW47XG4gICAgICB0aGlzLmVsID0gdGFyZ2V0UGx1Z2luLmFkZFRhcmdldChwbHVnaW4pO1xuICAgICAgdGhpcy5vbk1vdW50KCk7XG4gICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICB9XG5cbiAgICB0aGlzLnVwcHkubG9nKFwiTm90IGluc3RhbGxpbmcgXCIgKyBjYWxsZXJQbHVnaW5OYW1lKTtcbiAgICB2YXIgbWVzc2FnZSA9IFwiSW52YWxpZCB0YXJnZXQgb3B0aW9uIGdpdmVuIHRvIFwiICsgY2FsbGVyUGx1Z2luTmFtZSArIFwiLlwiO1xuXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1lc3NhZ2UgKz0gJyBUaGUgZ2l2ZW4gdGFyZ2V0IGlzIG5vdCBhIFBsdWdpbiBjbGFzcy4gJyArICdQbGVhc2UgY2hlY2sgdGhhdCB5b3VcXCdyZSBub3Qgc3BlY2lmeWluZyBhIFJlYWN0IENvbXBvbmVudCBpbnN0ZWFkIG9mIGEgcGx1Z2luLiAnICsgJ0lmIHlvdSBhcmUgdXNpbmcgQHVwcHkvKiBwYWNrYWdlcyBkaXJlY3RseSwgbWFrZSBzdXJlIHlvdSBoYXZlIG9ubHkgMSB2ZXJzaW9uIG9mIEB1cHB5L2NvcmUgaW5zdGFsbGVkOiAnICsgJ3J1biBgbnBtIGxzIEB1cHB5L2NvcmVgIG9uIHRoZSBjb21tYW5kIGxpbmUgYW5kIHZlcmlmeSB0aGF0IGFsbCB0aGUgdmVyc2lvbnMgbWF0Y2ggYW5kIGFyZSBkZWR1cGVkIGNvcnJlY3RseS4nO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlICs9ICdJZiB5b3UgbWVhbnQgdG8gdGFyZ2V0IGFuIEhUTUwgZWxlbWVudCwgcGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBlbGVtZW50IGV4aXN0cy4gJyArICdDaGVjayB0aGF0IHRoZSA8c2NyaXB0PiB0YWcgaW5pdGlhbGl6aW5nIFVwcHkgaXMgcmlnaHQgYmVmb3JlIHRoZSBjbG9zaW5nIDwvYm9keT4gdGFnIGF0IHRoZSBlbmQgb2YgdGhlIHBhZ2UuICcgKyAnKHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXMvMTA0MilcXG5cXG4nICsgJ0lmIHlvdSBtZWFudCB0byB0YXJnZXQgYSBwbHVnaW4sIHBsZWFzZSBjb25maXJtIHRoYXQgeW91ciBgaW1wb3J0YCBzdGF0ZW1lbnRzIG9yIGByZXF1aXJlYCBjYWxscyBhcmUgY29ycmVjdC4nO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfTtcblxuICBfcHJvdG8ucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKHN0YXRlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHRlbmQgdGhlIHJlbmRlciBtZXRob2QgdG8gYWRkIHlvdXIgcGx1Z2luIHRvIGEgRE9NIGVsZW1lbnQnKTtcbiAgfTtcblxuICBfcHJvdG8uYWRkVGFyZ2V0ID0gZnVuY3Rpb24gYWRkVGFyZ2V0KHBsdWdpbikge1xuICAgIHRocm93IG5ldyBFcnJvcignRXh0ZW5kIHRoZSBhZGRUYXJnZXQgbWV0aG9kIHRvIGFkZCB5b3VyIHBsdWdpbiB0byBhbm90aGVyIHBsdWdpblxcJ3MgdGFyZ2V0Jyk7XG4gIH07XG5cbiAgX3Byb3RvLnVubW91bnQgPSBmdW5jdGlvbiB1bm1vdW50KCkge1xuICAgIGlmICh0aGlzLmlzVGFyZ2V0RE9NRWwgJiYgdGhpcy5lbCAmJiB0aGlzLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmluc3RhbGwgPSBmdW5jdGlvbiBpbnN0YWxsKCkge307XG5cbiAgX3Byb3RvLnVuaW5zdGFsbCA9IGZ1bmN0aW9uIHVuaW5zdGFsbCgpIHtcbiAgICB0aGlzLnVubW91bnQoKTtcbiAgfTtcblxuICByZXR1cm4gUGx1Z2luO1xufSgpOyIsImZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzTG9vc2Uoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7IHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzOyBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbmZ1bmN0aW9uIF93cmFwTmF0aXZlU3VwZXIoQ2xhc3MpIHsgdmFyIF9jYWNoZSA9IHR5cGVvZiBNYXAgPT09IFwiZnVuY3Rpb25cIiA/IG5ldyBNYXAoKSA6IHVuZGVmaW5lZDsgX3dyYXBOYXRpdmVTdXBlciA9IGZ1bmN0aW9uIF93cmFwTmF0aXZlU3VwZXIoQ2xhc3MpIHsgaWYgKENsYXNzID09PSBudWxsIHx8ICFfaXNOYXRpdmVGdW5jdGlvbihDbGFzcykpIHJldHVybiBDbGFzczsgaWYgKHR5cGVvZiBDbGFzcyAhPT0gXCJmdW5jdGlvblwiKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBpZiAodHlwZW9mIF9jYWNoZSAhPT0gXCJ1bmRlZmluZWRcIikgeyBpZiAoX2NhY2hlLmhhcyhDbGFzcykpIHJldHVybiBfY2FjaGUuZ2V0KENsYXNzKTsgX2NhY2hlLnNldChDbGFzcywgV3JhcHBlcik7IH0gZnVuY3Rpb24gV3JhcHBlcigpIHsgcmV0dXJuIF9jb25zdHJ1Y3QoQ2xhc3MsIGFyZ3VtZW50cywgX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yKTsgfSBXcmFwcGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBXcmFwcGVyLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyByZXR1cm4gX3NldFByb3RvdHlwZU9mKFdyYXBwZXIsIENsYXNzKTsgfTsgcmV0dXJuIF93cmFwTmF0aXZlU3VwZXIoQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykgeyBpZiAoX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpKSB7IF9jb25zdHJ1Y3QgPSBSZWZsZWN0LmNvbnN0cnVjdDsgfSBlbHNlIHsgX2NvbnN0cnVjdCA9IGZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykgeyB2YXIgYSA9IFtudWxsXTsgYS5wdXNoLmFwcGx5KGEsIGFyZ3MpOyB2YXIgQ29uc3RydWN0b3IgPSBGdW5jdGlvbi5iaW5kLmFwcGx5KFBhcmVudCwgYSk7IHZhciBpbnN0YW5jZSA9IG5ldyBDb25zdHJ1Y3RvcigpOyBpZiAoQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihpbnN0YW5jZSwgQ2xhc3MucHJvdG90eXBlKTsgcmV0dXJuIGluc3RhbmNlOyB9OyB9IHJldHVybiBfY29uc3RydWN0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVGdW5jdGlvbihmbikgeyByZXR1cm4gRnVuY3Rpb24udG9TdHJpbmcuY2FsbChmbikuaW5kZXhPZihcIltuYXRpdmUgY29kZV1cIikgIT09IC0xOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpO1xuXG52YXIgZWUgPSByZXF1aXJlKCduYW1lc3BhY2UtZW1pdHRlcicpO1xuXG52YXIgY3VpZCA9IHJlcXVpcmUoJ2N1aWQnKTtcblxudmFyIHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJyk7XG5cbnZhciBwcmV0dGllckJ5dGVzID0gcmVxdWlyZSgnQHRyYW5zbG9hZGl0L3ByZXR0aWVyLWJ5dGVzJyk7XG5cbnZhciBtYXRjaCA9IHJlcXVpcmUoJ21pbWUtbWF0Y2gnKTtcblxudmFyIERlZmF1bHRTdG9yZSA9IHJlcXVpcmUoJ0B1cHB5L3N0b3JlLWRlZmF1bHQnKTtcblxudmFyIGdldEZpbGVUeXBlID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2dldEZpbGVUeXBlJyk7XG5cbnZhciBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbiA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbicpO1xuXG52YXIgZ2VuZXJhdGVGaWxlSUQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2VuZXJhdGVGaWxlSUQnKTtcblxudmFyIHN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MgPSByZXF1aXJlKCcuL3N1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MnKTtcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgnLi9sb2dnZXJzJyksXG4gICAganVzdEVycm9yc0xvZ2dlciA9IF9yZXF1aXJlLmp1c3RFcnJvcnNMb2dnZXIsXG4gICAgZGVidWdMb2dnZXIgPSBfcmVxdWlyZS5kZWJ1Z0xvZ2dlcjtcblxudmFyIFBsdWdpbiA9IHJlcXVpcmUoJy4vUGx1Z2luJyk7IC8vIEV4cG9ydGVkIGZyb20gaGVyZS5cblxuXG52YXIgUmVzdHJpY3Rpb25FcnJvciA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX0Vycm9yKSB7XG4gIF9pbmhlcml0c0xvb3NlKFJlc3RyaWN0aW9uRXJyb3IsIF9FcnJvcik7XG5cbiAgZnVuY3Rpb24gUmVzdHJpY3Rpb25FcnJvcigpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgX3RoaXMgPSBfRXJyb3IuY2FsbC5hcHBseShfRXJyb3IsIFt0aGlzXS5jb25jYXQoYXJncykpIHx8IHRoaXM7XG4gICAgX3RoaXMuaXNSZXN0cmljdGlvbiA9IHRydWU7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgcmV0dXJuIFJlc3RyaWN0aW9uRXJyb3I7XG59KCAvKiNfX1BVUkVfXyovX3dyYXBOYXRpdmVTdXBlcihFcnJvcikpO1xuLyoqXG4gKiBVcHB5IENvcmUgbW9kdWxlLlxuICogTWFuYWdlcyBwbHVnaW5zLCBzdGF0ZSB1cGRhdGVzLCBhY3RzIGFzIGFuIGV2ZW50IGJ1cyxcbiAqIGFkZHMvcmVtb3ZlcyBmaWxlcyBhbmQgbWV0YWRhdGEuXG4gKi9cblxuXG52YXIgVXBweSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSBVcHB5XG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzIOKAlCBVcHB5IG9wdGlvbnNcbiAgICovXG4gIGZ1bmN0aW9uIFVwcHkob3B0cykge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgdGhpcy5kZWZhdWx0TG9jYWxlID0ge1xuICAgICAgc3RyaW5nczoge1xuICAgICAgICBhZGRCdWxrRmlsZXNGYWlsZWQ6IHtcbiAgICAgICAgICAwOiAnRmFpbGVkIHRvIGFkZCAle3NtYXJ0X2NvdW50fSBmaWxlIGR1ZSB0byBhbiBpbnRlcm5hbCBlcnJvcicsXG4gICAgICAgICAgMTogJ0ZhaWxlZCB0byBhZGQgJXtzbWFydF9jb3VudH0gZmlsZXMgZHVlIHRvIGludGVybmFsIGVycm9ycydcbiAgICAgICAgfSxcbiAgICAgICAgeW91Q2FuT25seVVwbG9hZFg6IHtcbiAgICAgICAgICAwOiAnWW91IGNhbiBvbmx5IHVwbG9hZCAle3NtYXJ0X2NvdW50fSBmaWxlJyxcbiAgICAgICAgICAxOiAnWW91IGNhbiBvbmx5IHVwbG9hZCAle3NtYXJ0X2NvdW50fSBmaWxlcydcbiAgICAgICAgfSxcbiAgICAgICAgeW91SGF2ZVRvQXRMZWFzdFNlbGVjdFg6IHtcbiAgICAgICAgICAwOiAnWW91IGhhdmUgdG8gc2VsZWN0IGF0IGxlYXN0ICV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdZb3UgaGF2ZSB0byBzZWxlY3QgYXQgbGVhc3QgJXtzbWFydF9jb3VudH0gZmlsZXMnXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFRoZSBkZWZhdWx0IGBleGNlZWRzU2l6ZTJgIHN0cmluZyBvbmx5IGNvbWJpbmVzIHRoZSBgZXhjZWVkc1NpemVgIHN0cmluZyAoJXtiYWNrd2FyZHNDb21wYXR9KSB3aXRoIHRoZSBzaXplLlxuICAgICAgICAvLyBMb2NhbGVzIGNhbiBvdmVycmlkZSBgZXhjZWVkc1NpemUyYCB0byBzcGVjaWZ5IGEgZGlmZmVyZW50IHdvcmQgb3JkZXIuIFRoaXMgaXMgZm9yIGJhY2t3YXJkcyBjb21wYXQgd2l0aFxuICAgICAgICAvLyBVcHB5IDEuOS54IGFuZCBiZWxvdyB3aGljaCBkaWQgYSBuYWl2ZSBjb25jYXRlbmF0aW9uIG9mIGBleGNlZWRzU2l6ZTIgKyBzaXplYCBpbnN0ZWFkIG9mIHVzaW5nIGEgbG9jYWxlLXNwZWNpZmljXG4gICAgICAgIC8vIHN1YnN0aXR1dGlvbi5cbiAgICAgICAgLy8gVE9ETzogSW4gMi4wIGBleGNlZWRzU2l6ZTJgIHNob3VsZCBiZSByZW1vdmVkIGluIGFuZCBgZXhjZWVkc1NpemVgIHVwZGF0ZWQgdG8gdXNlIHN1YnN0aXR1dGlvbi5cbiAgICAgICAgZXhjZWVkc1NpemUyOiAnJXtiYWNrd2FyZHNDb21wYXR9ICV7c2l6ZX0nLFxuICAgICAgICBleGNlZWRzU2l6ZTogJ1RoaXMgZmlsZSBleGNlZWRzIG1heGltdW0gYWxsb3dlZCBzaXplIG9mJyxcbiAgICAgICAgaW5mZXJpb3JTaXplOiAnVGhpcyBmaWxlIGlzIHNtYWxsZXIgdGhhbiB0aGUgYWxsb3dlZCBzaXplIG9mICV7c2l6ZX0nLFxuICAgICAgICB5b3VDYW5Pbmx5VXBsb2FkRmlsZVR5cGVzOiAnWW91IGNhbiBvbmx5IHVwbG9hZDogJXt0eXBlc30nLFxuICAgICAgICBub05ld0FscmVhZHlVcGxvYWRpbmc6ICdDYW5ub3QgYWRkIG5ldyBmaWxlczogYWxyZWFkeSB1cGxvYWRpbmcnLFxuICAgICAgICBub0R1cGxpY2F0ZXM6ICdDYW5ub3QgYWRkIHRoZSBkdXBsaWNhdGUgZmlsZSBcXCcle2ZpbGVOYW1lfVxcJywgaXQgYWxyZWFkeSBleGlzdHMnLFxuICAgICAgICBjb21wYW5pb25FcnJvcjogJ0Nvbm5lY3Rpb24gd2l0aCBDb21wYW5pb24gZmFpbGVkJyxcbiAgICAgICAgY29tcGFuaW9uVW5hdXRob3JpemVIaW50OiAnVG8gdW5hdXRob3JpemUgdG8geW91ciAle3Byb3ZpZGVyfSBhY2NvdW50LCBwbGVhc2UgZ28gdG8gJXt1cmx9JyxcbiAgICAgICAgZmFpbGVkVG9VcGxvYWQ6ICdGYWlsZWQgdG8gdXBsb2FkICV7ZmlsZX0nLFxuICAgICAgICBub0ludGVybmV0Q29ubmVjdGlvbjogJ05vIEludGVybmV0IGNvbm5lY3Rpb24nLFxuICAgICAgICBjb25uZWN0ZWRUb0ludGVybmV0OiAnQ29ubmVjdGVkIHRvIHRoZSBJbnRlcm5ldCcsXG4gICAgICAgIC8vIFN0cmluZ3MgZm9yIHJlbW90ZSBwcm92aWRlcnNcbiAgICAgICAgbm9GaWxlc0ZvdW5kOiAnWW91IGhhdmUgbm8gZmlsZXMgb3IgZm9sZGVycyBoZXJlJyxcbiAgICAgICAgc2VsZWN0WDoge1xuICAgICAgICAgIDA6ICdTZWxlY3QgJXtzbWFydF9jb3VudH0nLFxuICAgICAgICAgIDE6ICdTZWxlY3QgJXtzbWFydF9jb3VudH0nXG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdEFsbEZpbGVzRnJvbUZvbGRlck5hbWVkOiAnU2VsZWN0IGFsbCBmaWxlcyBmcm9tIGZvbGRlciAle25hbWV9JyxcbiAgICAgICAgdW5zZWxlY3RBbGxGaWxlc0Zyb21Gb2xkZXJOYW1lZDogJ1Vuc2VsZWN0IGFsbCBmaWxlcyBmcm9tIGZvbGRlciAle25hbWV9JyxcbiAgICAgICAgc2VsZWN0RmlsZU5hbWVkOiAnU2VsZWN0IGZpbGUgJXtuYW1lfScsXG4gICAgICAgIHVuc2VsZWN0RmlsZU5hbWVkOiAnVW5zZWxlY3QgZmlsZSAle25hbWV9JyxcbiAgICAgICAgb3BlbkZvbGRlck5hbWVkOiAnT3BlbiBmb2xkZXIgJXtuYW1lfScsXG4gICAgICAgIGNhbmNlbDogJ0NhbmNlbCcsXG4gICAgICAgIGxvZ091dDogJ0xvZyBvdXQnLFxuICAgICAgICBmaWx0ZXI6ICdGaWx0ZXInLFxuICAgICAgICByZXNldEZpbHRlcjogJ1Jlc2V0IGZpbHRlcicsXG4gICAgICAgIGxvYWRpbmc6ICdMb2FkaW5nLi4uJyxcbiAgICAgICAgYXV0aGVudGljYXRlV2l0aFRpdGxlOiAnUGxlYXNlIGF1dGhlbnRpY2F0ZSB3aXRoICV7cGx1Z2luTmFtZX0gdG8gc2VsZWN0IGZpbGVzJyxcbiAgICAgICAgYXV0aGVudGljYXRlV2l0aDogJ0Nvbm5lY3QgdG8gJXtwbHVnaW5OYW1lfScsXG4gICAgICAgIHNlYXJjaEltYWdlczogJ1NlYXJjaCBmb3IgaW1hZ2VzJyxcbiAgICAgICAgZW50ZXJUZXh0VG9TZWFyY2g6ICdFbnRlciB0ZXh0IHRvIHNlYXJjaCBmb3IgaW1hZ2VzJyxcbiAgICAgICAgYmFja1RvU2VhcmNoOiAnQmFjayB0byBTZWFyY2gnLFxuICAgICAgICBlbXB0eUZvbGRlckFkZGVkOiAnTm8gZmlsZXMgd2VyZSBhZGRlZCBmcm9tIGVtcHR5IGZvbGRlcicsXG4gICAgICAgIGZvbGRlckFkZGVkOiB7XG4gICAgICAgICAgMDogJ0FkZGVkICV7c21hcnRfY291bnR9IGZpbGUgZnJvbSAle2ZvbGRlcn0nLFxuICAgICAgICAgIDE6ICdBZGRlZCAle3NtYXJ0X2NvdW50fSBmaWxlcyBmcm9tICV7Zm9sZGVyfSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgaWQ6ICd1cHB5JyxcbiAgICAgIGF1dG9Qcm9jZWVkOiBmYWxzZSxcbiAgICAgIGFsbG93TXVsdGlwbGVVcGxvYWRzOiB0cnVlLFxuICAgICAgZGVidWc6IGZhbHNlLFxuICAgICAgcmVzdHJpY3Rpb25zOiB7XG4gICAgICAgIG1heEZpbGVTaXplOiBudWxsLFxuICAgICAgICBtaW5GaWxlU2l6ZTogbnVsbCxcbiAgICAgICAgbWF4VG90YWxGaWxlU2l6ZTogbnVsbCxcbiAgICAgICAgbWF4TnVtYmVyT2ZGaWxlczogbnVsbCxcbiAgICAgICAgbWluTnVtYmVyT2ZGaWxlczogbnVsbCxcbiAgICAgICAgYWxsb3dlZEZpbGVUeXBlczogbnVsbFxuICAgICAgfSxcbiAgICAgIG1ldGE6IHt9LFxuICAgICAgb25CZWZvcmVGaWxlQWRkZWQ6IGZ1bmN0aW9uIG9uQmVmb3JlRmlsZUFkZGVkKGN1cnJlbnRGaWxlLCBmaWxlcykge1xuICAgICAgICByZXR1cm4gY3VycmVudEZpbGU7XG4gICAgICB9LFxuICAgICAgb25CZWZvcmVVcGxvYWQ6IGZ1bmN0aW9uIG9uQmVmb3JlVXBsb2FkKGZpbGVzKSB7XG4gICAgICAgIHJldHVybiBmaWxlcztcbiAgICAgIH0sXG4gICAgICBzdG9yZTogRGVmYXVsdFN0b3JlKCksXG4gICAgICBsb2dnZXI6IGp1c3RFcnJvcnNMb2dnZXIsXG4gICAgICBpbmZvVGltZW91dDogNTAwMFxuICAgIH07IC8vIE1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBvbmVzIHNldCBieSB1c2VyLFxuICAgIC8vIG1ha2luZyBzdXJlIHRvIG1lcmdlIHJlc3RyaWN0aW9ucyB0b29cblxuICAgIHRoaXMub3B0cyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0cywge1xuICAgICAgcmVzdHJpY3Rpb25zOiBfZXh0ZW5kcyh7fSwgZGVmYXVsdE9wdGlvbnMucmVzdHJpY3Rpb25zLCBvcHRzICYmIG9wdHMucmVzdHJpY3Rpb25zKVxuICAgIH0pOyAvLyBTdXBwb3J0IGRlYnVnOiB0cnVlIGZvciBiYWNrd2FyZHMtY29tcGF0YWJpbGl0eSwgdW5sZXNzIGxvZ2dlciBpcyBzZXQgaW4gb3B0c1xuICAgIC8vIG9wdHMgaW5zdGVhZCBvZiB0aGlzLm9wdHMgdG8gYXZvaWQgY29tcGFyaW5nIG9iamVjdHMg4oCUIHdlIHNldCBsb2dnZXI6IGp1c3RFcnJvcnNMb2dnZXIgaW4gZGVmYXVsdE9wdGlvbnNcblxuICAgIGlmIChvcHRzICYmIG9wdHMubG9nZ2VyICYmIG9wdHMuZGVidWcpIHtcbiAgICAgIHRoaXMubG9nKCdZb3UgYXJlIHVzaW5nIGEgY3VzdG9tIGBsb2dnZXJgLCBidXQgYWxzbyBzZXQgYGRlYnVnOiB0cnVlYCwgd2hpY2ggdXNlcyBidWlsdC1pbiBsb2dnZXIgdG8gb3V0cHV0IGxvZ3MgdG8gY29uc29sZS4gSWdub3JpbmcgYGRlYnVnOiB0cnVlYCBhbmQgdXNpbmcgeW91ciBjdXN0b20gYGxvZ2dlcmAuJywgJ3dhcm5pbmcnKTtcbiAgICB9IGVsc2UgaWYgKG9wdHMgJiYgb3B0cy5kZWJ1Zykge1xuICAgICAgdGhpcy5vcHRzLmxvZ2dlciA9IGRlYnVnTG9nZ2VyO1xuICAgIH1cblxuICAgIHRoaXMubG9nKFwiVXNpbmcgQ29yZSB2XCIgKyB0aGlzLmNvbnN0cnVjdG9yLlZFUlNJT04pO1xuXG4gICAgaWYgKHRoaXMub3B0cy5yZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlcyAmJiB0aGlzLm9wdHMucmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXMgIT09IG51bGwgJiYgIUFycmF5LmlzQXJyYXkodGhpcy5vcHRzLnJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYHJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzYCBtdXN0IGJlIGFuIGFycmF5Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpOyAvLyBDb250YWluZXIgZm9yIGRpZmZlcmVudCB0eXBlcyBvZiBwbHVnaW5zXG5cbiAgICB0aGlzLnBsdWdpbnMgPSB7fTtcbiAgICB0aGlzLmdldFN0YXRlID0gdGhpcy5nZXRTdGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0UGx1Z2luID0gdGhpcy5nZXRQbHVnaW4uYmluZCh0aGlzKTtcbiAgICB0aGlzLnNldEZpbGVNZXRhID0gdGhpcy5zZXRGaWxlTWV0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2V0RmlsZVN0YXRlID0gdGhpcy5zZXRGaWxlU3RhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmxvZyA9IHRoaXMubG9nLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbmZvID0gdGhpcy5pbmZvLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oaWRlSW5mbyA9IHRoaXMuaGlkZUluZm8uYmluZCh0aGlzKTtcbiAgICB0aGlzLmFkZEZpbGUgPSB0aGlzLmFkZEZpbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUZpbGUgPSB0aGlzLnJlbW92ZUZpbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnBhdXNlUmVzdW1lID0gdGhpcy5wYXVzZVJlc3VtZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMudmFsaWRhdGVSZXN0cmljdGlvbnMgPSB0aGlzLnZhbGlkYXRlUmVzdHJpY3Rpb25zLmJpbmQodGhpcyk7IC8vIF9fX1doeSB0aHJvdHRsZSBhdCA1MDBtcz9cbiAgICAvLyAgICAtIFdlIG11c3QgdGhyb3R0bGUgYXQgPjI1MG1zIGZvciBzdXBlcmZvY3VzIGluIERhc2hib2FyZCB0byB3b3JrIHdlbGwgKGJlY2F1c2UgYW5pbWF0aW9uIHRha2VzIDAuMjVzLCBhbmQgd2Ugd2FudCB0byB3YWl0IGZvciBhbGwgYW5pbWF0aW9ucyB0byBiZSBvdmVyIGJlZm9yZSByZWZvY3VzaW5nKS5cbiAgICAvLyAgICBbUHJhY3RpY2FsIENoZWNrXTogaWYgdGhvdHRsZSBpcyBhdCAxMDBtcywgdGhlbiBpZiB5b3UgYXJlIHVwbG9hZGluZyBhIGZpbGUsIGFuZCBjbGljayAnQUREIE1PUkUgRklMRVMnLCAtIGZvY3VzIHdvbid0IGFjdGl2YXRlIGluIEZpcmVmb3guXG4gICAgLy8gICAgLSBXZSBtdXN0IHRocm90dGxlIGF0IGFyb3VuZCA+NTAwbXMgdG8gYXZvaWQgcGVyZm9ybWFuY2UgbGFncy5cbiAgICAvLyAgICBbUHJhY3RpY2FsIENoZWNrXSBGaXJlZm94LCB0cnkgdG8gdXBsb2FkIGEgYmlnIGZpbGUgZm9yIGEgcHJvbG9uZ2VkIHBlcmlvZCBvZiB0aW1lLiBMYXB0b3Agd2lsbCBzdGFydCB0byBoZWF0IHVwLlxuXG4gICAgdGhpcy5fY2FsY3VsYXRlUHJvZ3Jlc3MgPSB0aHJvdHRsZSh0aGlzLl9jYWxjdWxhdGVQcm9ncmVzcy5iaW5kKHRoaXMpLCA1MDAsIHtcbiAgICAgIGxlYWRpbmc6IHRydWUsXG4gICAgICB0cmFpbGluZzogdHJ1ZVxuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlT25saW5lU3RhdHVzID0gdGhpcy51cGRhdGVPbmxpbmVTdGF0dXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlc2V0UHJvZ3Jlc3MgPSB0aGlzLnJlc2V0UHJvZ3Jlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLnBhdXNlQWxsID0gdGhpcy5wYXVzZUFsbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVzdW1lQWxsID0gdGhpcy5yZXN1bWVBbGwuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJldHJ5QWxsID0gdGhpcy5yZXRyeUFsbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2FuY2VsQWxsID0gdGhpcy5jYW5jZWxBbGwuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJldHJ5VXBsb2FkID0gdGhpcy5yZXRyeVVwbG9hZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMudXBsb2FkID0gdGhpcy51cGxvYWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBlZSgpO1xuICAgIHRoaXMub24gPSB0aGlzLm9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vZmYgPSB0aGlzLm9mZi5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25jZSA9IHRoaXMuZW1pdHRlci5vbmNlLmJpbmQodGhpcy5lbWl0dGVyKTtcbiAgICB0aGlzLmVtaXQgPSB0aGlzLmVtaXR0ZXIuZW1pdC5iaW5kKHRoaXMuZW1pdHRlcik7XG4gICAgdGhpcy5wcmVQcm9jZXNzb3JzID0gW107XG4gICAgdGhpcy51cGxvYWRlcnMgPSBbXTtcbiAgICB0aGlzLnBvc3RQcm9jZXNzb3JzID0gW107XG4gICAgdGhpcy5zdG9yZSA9IHRoaXMub3B0cy5zdG9yZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBsdWdpbnM6IHt9LFxuICAgICAgZmlsZXM6IHt9LFxuICAgICAgY3VycmVudFVwbG9hZHM6IHt9LFxuICAgICAgYWxsb3dOZXdVcGxvYWQ6IHRydWUsXG4gICAgICBjYXBhYmlsaXRpZXM6IHtcbiAgICAgICAgdXBsb2FkUHJvZ3Jlc3M6IHN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MoKSxcbiAgICAgICAgaW5kaXZpZHVhbENhbmNlbGxhdGlvbjogdHJ1ZSxcbiAgICAgICAgcmVzdW1hYmxlVXBsb2FkczogZmFsc2VcbiAgICAgIH0sXG4gICAgICB0b3RhbFByb2dyZXNzOiAwLFxuICAgICAgbWV0YTogX2V4dGVuZHMoe30sIHRoaXMub3B0cy5tZXRhKSxcbiAgICAgIGluZm86IHtcbiAgICAgICAgaXNIaWRkZW46IHRydWUsXG4gICAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgICAgbWVzc2FnZTogJydcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9zdG9yZVVuc3Vic2NyaWJlID0gdGhpcy5zdG9yZS5zdWJzY3JpYmUoZnVuY3Rpb24gKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBwYXRjaCkge1xuICAgICAgX3RoaXMyLmVtaXQoJ3N0YXRlLXVwZGF0ZScsIHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBwYXRjaCk7XG5cbiAgICAgIF90aGlzMi51cGRhdGVBbGwobmV4dFN0YXRlKTtcbiAgICB9KTsgLy8gRXhwb3NpbmcgdXBweSBvYmplY3Qgb24gd2luZG93IGZvciBkZWJ1Z2dpbmcgYW5kIHRlc3RpbmdcblxuICAgIGlmICh0aGlzLm9wdHMuZGVidWcgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvd1t0aGlzLm9wdHMuaWRdID0gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLl9hZGRMaXN0ZW5lcnMoKTsgLy8gUmUtZW5hYmxlIGlmIHdl4oCZbGwgbmVlZCBzb21lIGNhcGFiaWxpdGllcyBvbiBib290LCBsaWtlIGlzTW9iaWxlRGV2aWNlXG4gICAgLy8gdGhpcy5fc2V0Q2FwYWJpbGl0aWVzKClcblxuICB9IC8vIF9zZXRDYXBhYmlsaXRpZXMgPSAoKSA9PiB7XG4gIC8vICAgY29uc3QgY2FwYWJpbGl0aWVzID0ge1xuICAvLyAgICAgaXNNb2JpbGVEZXZpY2U6IGlzTW9iaWxlRGV2aWNlKClcbiAgLy8gICB9XG4gIC8vICAgdGhpcy5zZXRTdGF0ZSh7XG4gIC8vICAgICAuLi50aGlzLmdldFN0YXRlKCkuY2FwYWJpbGl0aWVzLFxuICAvLyAgICAgY2FwYWJpbGl0aWVzXG4gIC8vICAgfSlcbiAgLy8gfVxuXG5cbiAgdmFyIF9wcm90byA9IFVwcHkucHJvdG90eXBlO1xuXG4gIF9wcm90by5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMuZW1pdHRlci5vbihldmVudCwgY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIF9wcm90by5vZmYgPSBmdW5jdGlvbiBvZmYoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9mZihldmVudCwgY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG9uIGFsbCBwbHVnaW5zIGFuZCBydW4gYHVwZGF0ZWAgb24gdGhlbS5cbiAgICogQ2FsbGVkIGVhY2ggdGltZSBzdGF0ZSBjaGFuZ2VzLlxuICAgKlxuICAgKi9cbiAgO1xuXG4gIF9wcm90by51cGRhdGVBbGwgPSBmdW5jdGlvbiB1cGRhdGVBbGwoc3RhdGUpIHtcbiAgICB0aGlzLml0ZXJhdGVQbHVnaW5zKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICAgIHBsdWdpbi51cGRhdGUoc3RhdGUpO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGVzIHN0YXRlIHdpdGggYSBwYXRjaFxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF0Y2gge2ZvbzogJ2Jhcid9XG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLnNldFN0YXRlID0gZnVuY3Rpb24gc2V0U3RhdGUocGF0Y2gpIHtcbiAgICB0aGlzLnN0b3JlLnNldFN0YXRlKHBhdGNoKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyBjdXJyZW50IHN0YXRlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5nZXRTdGF0ZSA9IGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKCk7XG4gIH1cbiAgLyoqXG4gICAqIEJhY2sgY29tcGF0IGZvciB3aGVuIHVwcHkuc3RhdGUgaXMgdXNlZCBpbnN0ZWFkIG9mIHVwcHkuZ2V0U3RhdGUoKS5cbiAgICovXG4gIDtcblxuICAvKipcbiAgICogU2hvcnRoYW5kIHRvIHNldCBzdGF0ZSBmb3IgYSBzcGVjaWZpYyBmaWxlLlxuICAgKi9cbiAgX3Byb3RvLnNldEZpbGVTdGF0ZSA9IGZ1bmN0aW9uIHNldEZpbGVTdGF0ZShmaWxlSUQsIHN0YXRlKSB7XG4gICAgdmFyIF9leHRlbmRzMjtcblxuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhblxcdTIwMTl0IHNldCBzdGF0ZSBmb3IgXCIgKyBmaWxlSUQgKyBcIiAodGhlIGZpbGUgY291bGQgaGF2ZSBiZWVuIHJlbW92ZWQpXCIpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IF9leHRlbmRzKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMsIChfZXh0ZW5kczIgPSB7fSwgX2V4dGVuZHMyW2ZpbGVJRF0gPSBfZXh0ZW5kcyh7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0sIHN0YXRlKSwgX2V4dGVuZHMyKSlcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uaTE4bkluaXQgPSBmdW5jdGlvbiBpMThuSW5pdCgpIHtcbiAgICB0aGlzLnRyYW5zbGF0b3IgPSBuZXcgVHJhbnNsYXRvcihbdGhpcy5kZWZhdWx0TG9jYWxlLCB0aGlzLm9wdHMubG9jYWxlXSk7XG4gICAgdGhpcy5sb2NhbGUgPSB0aGlzLnRyYW5zbGF0b3IubG9jYWxlO1xuICAgIHRoaXMuaTE4biA9IHRoaXMudHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0aGlzLnRyYW5zbGF0b3IpO1xuICAgIHRoaXMuaTE4bkFycmF5ID0gdGhpcy50cmFuc2xhdG9yLnRyYW5zbGF0ZUFycmF5LmJpbmQodGhpcy50cmFuc2xhdG9yKTtcbiAgfTtcblxuICBfcHJvdG8uc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIHNldE9wdGlvbnMobmV3T3B0cykge1xuICAgIHRoaXMub3B0cyA9IF9leHRlbmRzKHt9LCB0aGlzLm9wdHMsIG5ld09wdHMsIHtcbiAgICAgIHJlc3RyaWN0aW9uczogX2V4dGVuZHMoe30sIHRoaXMub3B0cy5yZXN0cmljdGlvbnMsIG5ld09wdHMgJiYgbmV3T3B0cy5yZXN0cmljdGlvbnMpXG4gICAgfSk7XG5cbiAgICBpZiAobmV3T3B0cy5tZXRhKSB7XG4gICAgICB0aGlzLnNldE1ldGEobmV3T3B0cy5tZXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLmkxOG5Jbml0KCk7XG5cbiAgICBpZiAobmV3T3B0cy5sb2NhbGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0ZVBsdWdpbnMoZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgICBwbHVnaW4uc2V0T3B0aW9ucygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSgpOyAvLyBzbyB0aGF0IFVJIHJlLXJlbmRlcnMgd2l0aCBuZXcgb3B0aW9uc1xuICB9O1xuXG4gIF9wcm90by5yZXNldFByb2dyZXNzID0gZnVuY3Rpb24gcmVzZXRQcm9ncmVzcygpIHtcbiAgICB2YXIgZGVmYXVsdFByb2dyZXNzID0ge1xuICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICB1cGxvYWRTdGFydGVkOiBudWxsXG4gICAgfTtcblxuICAgIHZhciBmaWxlcyA9IF9leHRlbmRzKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpO1xuXG4gICAgdmFyIHVwZGF0ZWRGaWxlcyA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlSUQpIHtcbiAgICAgIHZhciB1cGRhdGVkRmlsZSA9IF9leHRlbmRzKHt9LCBmaWxlc1tmaWxlSURdKTtcblxuICAgICAgdXBkYXRlZEZpbGUucHJvZ3Jlc3MgPSBfZXh0ZW5kcyh7fSwgdXBkYXRlZEZpbGUucHJvZ3Jlc3MsIGRlZmF1bHRQcm9ncmVzcyk7XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZUlEXSA9IHVwZGF0ZWRGaWxlO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDBcbiAgICB9KTtcbiAgICB0aGlzLmVtaXQoJ3Jlc2V0LXByb2dyZXNzJyk7XG4gIH07XG5cbiAgX3Byb3RvLmFkZFByZVByb2Nlc3NvciA9IGZ1bmN0aW9uIGFkZFByZVByb2Nlc3Nvcihmbikge1xuICAgIHRoaXMucHJlUHJvY2Vzc29ycy5wdXNoKGZuKTtcbiAgfTtcblxuICBfcHJvdG8ucmVtb3ZlUHJlUHJvY2Vzc29yID0gZnVuY3Rpb24gcmVtb3ZlUHJlUHJvY2Vzc29yKGZuKSB7XG4gICAgdmFyIGkgPSB0aGlzLnByZVByb2Nlc3NvcnMuaW5kZXhPZihmbik7XG5cbiAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgIHRoaXMucHJlUHJvY2Vzc29ycy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5hZGRQb3N0UHJvY2Vzc29yID0gZnVuY3Rpb24gYWRkUG9zdFByb2Nlc3Nvcihmbikge1xuICAgIHRoaXMucG9zdFByb2Nlc3NvcnMucHVzaChmbik7XG4gIH07XG5cbiAgX3Byb3RvLnJlbW92ZVBvc3RQcm9jZXNzb3IgPSBmdW5jdGlvbiByZW1vdmVQb3N0UHJvY2Vzc29yKGZuKSB7XG4gICAgdmFyIGkgPSB0aGlzLnBvc3RQcm9jZXNzb3JzLmluZGV4T2YoZm4pO1xuXG4gICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICB0aGlzLnBvc3RQcm9jZXNzb3JzLnNwbGljZShpLCAxKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmFkZFVwbG9hZGVyID0gZnVuY3Rpb24gYWRkVXBsb2FkZXIoZm4pIHtcbiAgICB0aGlzLnVwbG9hZGVycy5wdXNoKGZuKTtcbiAgfTtcblxuICBfcHJvdG8ucmVtb3ZlVXBsb2FkZXIgPSBmdW5jdGlvbiByZW1vdmVVcGxvYWRlcihmbikge1xuICAgIHZhciBpID0gdGhpcy51cGxvYWRlcnMuaW5kZXhPZihmbik7XG5cbiAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgIHRoaXMudXBsb2FkZXJzLnNwbGljZShpLCAxKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLnNldE1ldGEgPSBmdW5jdGlvbiBzZXRNZXRhKGRhdGEpIHtcbiAgICB2YXIgdXBkYXRlZE1ldGEgPSBfZXh0ZW5kcyh7fSwgdGhpcy5nZXRTdGF0ZSgpLm1ldGEsIGRhdGEpO1xuXG4gICAgdmFyIHVwZGF0ZWRGaWxlcyA9IF9leHRlbmRzKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpO1xuXG4gICAgT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlSUQpIHtcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0gX2V4dGVuZHMoe30sIHVwZGF0ZWRGaWxlc1tmaWxlSURdLCB7XG4gICAgICAgIG1ldGE6IF9leHRlbmRzKHt9LCB1cGRhdGVkRmlsZXNbZmlsZUlEXS5tZXRhLCBkYXRhKVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5sb2coJ0FkZGluZyBtZXRhZGF0YTonKTtcbiAgICB0aGlzLmxvZyhkYXRhKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1ldGE6IHVwZGF0ZWRNZXRhLFxuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlc1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5zZXRGaWxlTWV0YSA9IGZ1bmN0aW9uIHNldEZpbGVNZXRhKGZpbGVJRCwgZGF0YSkge1xuICAgIHZhciB1cGRhdGVkRmlsZXMgPSBfZXh0ZW5kcyh7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzKTtcblxuICAgIGlmICghdXBkYXRlZEZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRoaXMubG9nKCdXYXMgdHJ5aW5nIHRvIHNldCBtZXRhZGF0YSBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJywgZmlsZUlEKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV3TWV0YSA9IF9leHRlbmRzKHt9LCB1cGRhdGVkRmlsZXNbZmlsZUlEXS5tZXRhLCBkYXRhKTtcblxuICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0gX2V4dGVuZHMoe30sIHVwZGF0ZWRGaWxlc1tmaWxlSURdLCB7XG4gICAgICBtZXRhOiBuZXdNZXRhXG4gICAgfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzXG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBhIGZpbGUgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEIFRoZSBJRCBvZiB0aGUgZmlsZSBvYmplY3QgdG8gcmV0dXJuLlxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5nZXRGaWxlID0gZnVuY3Rpb24gZ2V0RmlsZShmaWxlSUQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF07XG4gIH1cbiAgLyoqXG4gICAqIEdldCBhbGwgZmlsZXMgaW4gYW4gYXJyYXkuXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLmdldEZpbGVzID0gZnVuY3Rpb24gZ2V0RmlsZXMoKSB7XG4gICAgdmFyIF90aGlzJGdldFN0YXRlID0gdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICBmaWxlcyA9IF90aGlzJGdldFN0YXRlLmZpbGVzO1xuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGZpbGVzKS5tYXAoZnVuY3Rpb24gKGZpbGVJRCkge1xuICAgICAgcmV0dXJuIGZpbGVzW2ZpbGVJRF07XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEEgcHVibGljIHdyYXBwZXIgZm9yIF9jaGVja1Jlc3RyaWN0aW9ucyDigJQgY2hlY2tzIGlmIGEgZmlsZSBwYXNzZXMgYSBzZXQgb2YgcmVzdHJpY3Rpb25zLlxuICAgKiBGb3IgdXNlIGluIFVJIHBsdWlnaW5zIChsaWtlIFByb3ZpZGVycyksIHRvIGRpc2FsbG93IHNlbGVjdGluZyBmaWxlcyB0aGF0IHdvbuKAmXQgcGFzcyByZXN0cmljdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlIG9iamVjdCB0byBjaGVja1xuICAgKiBAcGFyYW0ge0FycmF5fSBbZmlsZXNdIGFycmF5IHRvIGNoZWNrIG1heE51bWJlck9mRmlsZXMgYW5kIG1heFRvdGFsRmlsZVNpemVcbiAgICogQHJldHVybnMge29iamVjdH0geyByZXN1bHQ6IHRydWUvZmFsc2UsIHJlYXNvbjogd2h5IGZpbGUgZGlkbuKAmXQgcGFzcyByZXN0cmljdGlvbnMgfVxuICAgKi9cbiAgO1xuXG4gIF9wcm90by52YWxpZGF0ZVJlc3RyaWN0aW9ucyA9IGZ1bmN0aW9uIHZhbGlkYXRlUmVzdHJpY3Rpb25zKGZpbGUsIGZpbGVzKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NoZWNrUmVzdHJpY3Rpb25zKGZpbGUsIGZpbGVzKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdWx0OiB0cnVlXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdWx0OiBmYWxzZSxcbiAgICAgICAgcmVhc29uOiBlcnIubWVzc2FnZVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIGZpbGUgcGFzc2VzIGEgc2V0IG9mIHJlc3RyaWN0aW9ucyBzZXQgaW4gb3B0aW9uczogbWF4RmlsZVNpemUsIG1pbkZpbGVTaXplLFxuICAgKiBtYXhOdW1iZXJPZkZpbGVzIGFuZCBhbGxvd2VkRmlsZVR5cGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZmlsZSBvYmplY3QgdG8gY2hlY2tcbiAgICogQHBhcmFtIHtBcnJheX0gW2ZpbGVzXSBhcnJheSB0byBjaGVjayBtYXhOdW1iZXJPZkZpbGVzIGFuZCBtYXhUb3RhbEZpbGVTaXplXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLl9jaGVja1Jlc3RyaWN0aW9ucyA9IGZ1bmN0aW9uIF9jaGVja1Jlc3RyaWN0aW9ucyhmaWxlLCBmaWxlcykge1xuICAgIGlmIChmaWxlcyA9PT0gdm9pZCAwKSB7XG4gICAgICBmaWxlcyA9IHRoaXMuZ2V0RmlsZXMoKTtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMkb3B0cyRyZXN0cmljdGlvID0gdGhpcy5vcHRzLnJlc3RyaWN0aW9ucyxcbiAgICAgICAgbWF4RmlsZVNpemUgPSBfdGhpcyRvcHRzJHJlc3RyaWN0aW8ubWF4RmlsZVNpemUsXG4gICAgICAgIG1pbkZpbGVTaXplID0gX3RoaXMkb3B0cyRyZXN0cmljdGlvLm1pbkZpbGVTaXplLFxuICAgICAgICBtYXhUb3RhbEZpbGVTaXplID0gX3RoaXMkb3B0cyRyZXN0cmljdGlvLm1heFRvdGFsRmlsZVNpemUsXG4gICAgICAgIG1heE51bWJlck9mRmlsZXMgPSBfdGhpcyRvcHRzJHJlc3RyaWN0aW8ubWF4TnVtYmVyT2ZGaWxlcyxcbiAgICAgICAgYWxsb3dlZEZpbGVUeXBlcyA9IF90aGlzJG9wdHMkcmVzdHJpY3Rpby5hbGxvd2VkRmlsZVR5cGVzO1xuXG4gICAgaWYgKG1heE51bWJlck9mRmlsZXMpIHtcbiAgICAgIGlmIChmaWxlcy5sZW5ndGggKyAxID4gbWF4TnVtYmVyT2ZGaWxlcykge1xuICAgICAgICB0aHJvdyBuZXcgUmVzdHJpY3Rpb25FcnJvcihcIlwiICsgdGhpcy5pMThuKCd5b3VDYW5Pbmx5VXBsb2FkWCcsIHtcbiAgICAgICAgICBzbWFydF9jb3VudDogbWF4TnVtYmVyT2ZGaWxlc1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFsbG93ZWRGaWxlVHlwZXMpIHtcbiAgICAgIHZhciBpc0NvcnJlY3RGaWxlVHlwZSA9IGFsbG93ZWRGaWxlVHlwZXMuc29tZShmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGlzIGlzIGEgbWltZS10eXBlXG4gICAgICAgIGlmICh0eXBlLmluZGV4T2YoJy8nKSA+IC0xKSB7XG4gICAgICAgICAgaWYgKCFmaWxlLnR5cGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbWF0Y2goZmlsZS50eXBlLnJlcGxhY2UoLzsuKj8kLywgJycpLCB0eXBlKTtcbiAgICAgICAgfSAvLyBvdGhlcndpc2UgdGhpcyBpcyBsaWtlbHkgYW4gZXh0ZW5zaW9uXG5cblxuICAgICAgICBpZiAodHlwZVswXSA9PT0gJy4nICYmIGZpbGUuZXh0ZW5zaW9uKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbGUuZXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCkgPT09IHR5cGUuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcblxuICAgICAgaWYgKCFpc0NvcnJlY3RGaWxlVHlwZSkge1xuICAgICAgICB2YXIgYWxsb3dlZEZpbGVUeXBlc1N0cmluZyA9IGFsbG93ZWRGaWxlVHlwZXMuam9pbignLCAnKTtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCd5b3VDYW5Pbmx5VXBsb2FkRmlsZVR5cGVzJywge1xuICAgICAgICAgIHR5cGVzOiBhbGxvd2VkRmlsZVR5cGVzU3RyaW5nXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9IC8vIFdlIGNhbid0IGNoZWNrIG1heFRvdGFsRmlsZVNpemUgaWYgdGhlIHNpemUgaXMgdW5rbm93bi5cblxuXG4gICAgaWYgKG1heFRvdGFsRmlsZVNpemUgJiYgZmlsZS5zaXplICE9IG51bGwpIHtcbiAgICAgIHZhciB0b3RhbEZpbGVzU2l6ZSA9IDA7XG4gICAgICB0b3RhbEZpbGVzU2l6ZSArPSBmaWxlLnNpemU7XG4gICAgICBmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHRvdGFsRmlsZXNTaXplICs9IGZpbGUuc2l6ZTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodG90YWxGaWxlc1NpemUgPiBtYXhUb3RhbEZpbGVTaXplKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignZXhjZWVkc1NpemUyJywge1xuICAgICAgICAgIGJhY2t3YXJkc0NvbXBhdDogdGhpcy5pMThuKCdleGNlZWRzU2l6ZScpLFxuICAgICAgICAgIHNpemU6IHByZXR0aWVyQnl0ZXMobWF4VG90YWxGaWxlU2l6ZSlcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0gLy8gV2UgY2FuJ3QgY2hlY2sgbWF4RmlsZVNpemUgaWYgdGhlIHNpemUgaXMgdW5rbm93bi5cblxuXG4gICAgaWYgKG1heEZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5zaXplID4gbWF4RmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdleGNlZWRzU2l6ZTInLCB7XG4gICAgICAgICAgYmFja3dhcmRzQ29tcGF0OiB0aGlzLmkxOG4oJ2V4Y2VlZHNTaXplJyksXG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtYXhGaWxlU2l6ZSlcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0gLy8gV2UgY2FuJ3QgY2hlY2sgbWluRmlsZVNpemUgaWYgdGhlIHNpemUgaXMgdW5rbm93bi5cblxuXG4gICAgaWYgKG1pbkZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5zaXplIDwgbWluRmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdpbmZlcmlvclNpemUnLCB7XG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtaW5GaWxlU2l6ZSlcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgbWluTnVtYmVyT2ZGaWxlcyByZXN0cmljdGlvbiBpcyByZWFjaGVkIGJlZm9yZSB1cGxvYWRpbmcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLl9jaGVja01pbk51bWJlck9mRmlsZXMgPSBmdW5jdGlvbiBfY2hlY2tNaW5OdW1iZXJPZkZpbGVzKGZpbGVzKSB7XG4gICAgdmFyIG1pbk51bWJlck9mRmlsZXMgPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zLm1pbk51bWJlck9mRmlsZXM7XG5cbiAgICBpZiAoT2JqZWN0LmtleXMoZmlsZXMpLmxlbmd0aCA8IG1pbk51bWJlck9mRmlsZXMpIHtcbiAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKFwiXCIgKyB0aGlzLmkxOG4oJ3lvdUhhdmVUb0F0TGVhc3RTZWxlY3RYJywge1xuICAgICAgICBzbWFydF9jb3VudDogbWluTnVtYmVyT2ZGaWxlc1xuICAgICAgfSkpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogTG9ncyBhbiBlcnJvciwgc2V0cyBJbmZvcm1lciBtZXNzYWdlLCB0aGVuIHRocm93cyB0aGUgZXJyb3IuXG4gICAqIEVtaXRzIGEgJ3Jlc3RyaWN0aW9uLWZhaWxlZCcgZXZlbnQgaWYgaXTigJlzIGEgcmVzdHJpY3Rpb24gZXJyb3JcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3QgfCBzdHJpbmd9IGVyciDigJQgRXJyb3Igb2JqZWN0IG9yIHBsYWluIHN0cmluZyBtZXNzYWdlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5zaG93SW5mb3JtZXI9dHJ1ZV0g4oCUIFNvbWV0aW1lcyBkZXZlbG9wZXIgbWlnaHQgd2FudCB0byBzaG93IEluZm9ybWVyIG1hbnVhbGx5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy5maWxlPW51bGxdIOKAlCBGaWxlIG9iamVjdCB1c2VkIHRvIGVtaXQgdGhlIHJlc3RyaWN0aW9uIGVycm9yXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudGhyb3dFcnI9dHJ1ZV0g4oCUIEVycm9ycyBzaG91bGRu4oCZdCBiZSB0aHJvd24sIGZvciBleGFtcGxlLCBpbiBgdXBsb2FkLWVycm9yYCBldmVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5fc2hvd09yTG9nRXJyb3JBbmRUaHJvdyA9IGZ1bmN0aW9uIF9zaG93T3JMb2dFcnJvckFuZFRocm93KGVyciwgX3RlbXApIHtcbiAgICB2YXIgX3JlZiA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wLFxuICAgICAgICBfcmVmJHNob3dJbmZvcm1lciA9IF9yZWYuc2hvd0luZm9ybWVyLFxuICAgICAgICBzaG93SW5mb3JtZXIgPSBfcmVmJHNob3dJbmZvcm1lciA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9yZWYkc2hvd0luZm9ybWVyLFxuICAgICAgICBfcmVmJGZpbGUgPSBfcmVmLmZpbGUsXG4gICAgICAgIGZpbGUgPSBfcmVmJGZpbGUgPT09IHZvaWQgMCA/IG51bGwgOiBfcmVmJGZpbGUsXG4gICAgICAgIF9yZWYkdGhyb3dFcnIgPSBfcmVmLnRocm93RXJyLFxuICAgICAgICB0aHJvd0VyciA9IF9yZWYkdGhyb3dFcnIgPT09IHZvaWQgMCA/IHRydWUgOiBfcmVmJHRocm93RXJyO1xuXG4gICAgdmFyIG1lc3NhZ2UgPSB0eXBlb2YgZXJyID09PSAnb2JqZWN0JyA/IGVyci5tZXNzYWdlIDogZXJyO1xuICAgIHZhciBkZXRhaWxzID0gdHlwZW9mIGVyciA9PT0gJ29iamVjdCcgJiYgZXJyLmRldGFpbHMgPyBlcnIuZGV0YWlscyA6ICcnOyAvLyBSZXN0cmljdGlvbiBlcnJvcnMgc2hvdWxkIGJlIGxvZ2dlZCwgYnV0IG5vdCBhcyBlcnJvcnMsXG4gICAgLy8gYXMgdGhleSBhcmUgZXhwZWN0ZWQgYW5kIHNob3duIGluIHRoZSBVSS5cblxuICAgIHZhciBsb2dNZXNzYWdlV2l0aERldGFpbHMgPSBtZXNzYWdlO1xuXG4gICAgaWYgKGRldGFpbHMpIHtcbiAgICAgIGxvZ01lc3NhZ2VXaXRoRGV0YWlscyArPSAnICcgKyBkZXRhaWxzO1xuICAgIH1cblxuICAgIGlmIChlcnIuaXNSZXN0cmljdGlvbikge1xuICAgICAgdGhpcy5sb2cobG9nTWVzc2FnZVdpdGhEZXRhaWxzKTtcbiAgICAgIHRoaXMuZW1pdCgncmVzdHJpY3Rpb24tZmFpbGVkJywgZmlsZSwgZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2cobG9nTWVzc2FnZVdpdGhEZXRhaWxzLCAnZXJyb3InKTtcbiAgICB9IC8vIFNvbWV0aW1lcyBpbmZvcm1lciBoYXMgdG8gYmUgc2hvd24gbWFudWFsbHkgYnkgdGhlIGRldmVsb3BlcixcbiAgICAvLyBmb3IgZXhhbXBsZSwgaW4gYG9uQmVmb3JlRmlsZUFkZGVkYC5cblxuXG4gICAgaWYgKHNob3dJbmZvcm1lcikge1xuICAgICAgdGhpcy5pbmZvKHtcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgZGV0YWlsczogZGV0YWlsc1xuICAgICAgfSwgJ2Vycm9yJywgdGhpcy5vcHRzLmluZm9UaW1lb3V0KTtcbiAgICB9XG5cbiAgICBpZiAodGhyb3dFcnIpIHtcbiAgICAgIHRocm93IHR5cGVvZiBlcnIgPT09ICdvYmplY3QnID8gZXJyIDogbmV3IEVycm9yKGVycik7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5fYXNzZXJ0TmV3VXBsb2FkQWxsb3dlZCA9IGZ1bmN0aW9uIF9hc3NlcnROZXdVcGxvYWRBbGxvd2VkKGZpbGUpIHtcbiAgICB2YXIgX3RoaXMkZ2V0U3RhdGUyID0gdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICBhbGxvd05ld1VwbG9hZCA9IF90aGlzJGdldFN0YXRlMi5hbGxvd05ld1VwbG9hZDtcblxuICAgIGlmIChhbGxvd05ld1VwbG9hZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX3Nob3dPckxvZ0Vycm9yQW5kVGhyb3cobmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdub05ld0FscmVhZHlVcGxvYWRpbmcnKSksIHtcbiAgICAgICAgZmlsZTogZmlsZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBmaWxlIHN0YXRlIG9iamVjdCBiYXNlZCBvbiB1c2VyLXByb3ZpZGVkIGBhZGRGaWxlKClgIG9wdGlvbnMuXG4gICAqXG4gICAqIE5vdGUgdGhpcyBpcyBleHRyZW1lbHkgc2lkZS1lZmZlY3RmdWwgYW5kIHNob3VsZCBvbmx5IGJlIGRvbmUgd2hlbiBhIGZpbGUgc3RhdGUgb2JqZWN0IHdpbGwgYmUgYWRkZWQgdG8gc3RhdGUgaW1tZWRpYXRlbHkgYWZ0ZXJ3YXJkIVxuICAgKlxuICAgKiBUaGUgYGZpbGVzYCB2YWx1ZSBpcyBwYXNzZWQgaW4gYmVjYXVzZSBpdCBtYXkgYmUgdXBkYXRlZCBieSB0aGUgY2FsbGVyIHdpdGhvdXQgdXBkYXRpbmcgdGhlIHN0b3JlLlxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5fY2hlY2tBbmRDcmVhdGVGaWxlU3RhdGVPYmplY3QgPSBmdW5jdGlvbiBfY2hlY2tBbmRDcmVhdGVGaWxlU3RhdGVPYmplY3QoZmlsZXMsIGZpbGUpIHtcbiAgICB2YXIgZmlsZVR5cGUgPSBnZXRGaWxlVHlwZShmaWxlKTtcbiAgICBmaWxlLnR5cGUgPSBmaWxlVHlwZTtcbiAgICB2YXIgb25CZWZvcmVGaWxlQWRkZWRSZXN1bHQgPSB0aGlzLm9wdHMub25CZWZvcmVGaWxlQWRkZWQoZmlsZSwgZmlsZXMpO1xuXG4gICAgaWYgKG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgLy8gRG9u4oCZdCBzaG93IFVJIGluZm8gZm9yIHRoaXMgZXJyb3IsIGFzIGl0IHNob3VsZCBiZSBkb25lIGJ5IHRoZSBkZXZlbG9wZXJcbiAgICAgIHRoaXMuX3Nob3dPckxvZ0Vycm9yQW5kVGhyb3cobmV3IFJlc3RyaWN0aW9uRXJyb3IoJ0Nhbm5vdCBhZGQgdGhlIGZpbGUgYmVjYXVzZSBvbkJlZm9yZUZpbGVBZGRlZCByZXR1cm5lZCBmYWxzZS4nKSwge1xuICAgICAgICBzaG93SW5mb3JtZXI6IGZhbHNlLFxuICAgICAgICBmaWxlOiBmaWxlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSAnb2JqZWN0JyAmJiBvbkJlZm9yZUZpbGVBZGRlZFJlc3VsdCkge1xuICAgICAgZmlsZSA9IG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0O1xuICAgIH1cblxuICAgIHZhciBmaWxlTmFtZTtcblxuICAgIGlmIChmaWxlLm5hbWUpIHtcbiAgICAgIGZpbGVOYW1lID0gZmlsZS5uYW1lO1xuICAgIH0gZWxzZSBpZiAoZmlsZVR5cGUuc3BsaXQoJy8nKVswXSA9PT0gJ2ltYWdlJykge1xuICAgICAgZmlsZU5hbWUgPSBmaWxlVHlwZS5zcGxpdCgnLycpWzBdICsgJy4nICsgZmlsZVR5cGUuc3BsaXQoJy8nKVsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZU5hbWUgPSAnbm9uYW1lJztcbiAgICB9XG5cbiAgICB2YXIgZmlsZUV4dGVuc2lvbiA9IGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uKGZpbGVOYW1lKS5leHRlbnNpb247XG4gICAgdmFyIGlzUmVtb3RlID0gZmlsZS5pc1JlbW90ZSB8fCBmYWxzZTtcbiAgICB2YXIgZmlsZUlEID0gZ2VuZXJhdGVGaWxlSUQoZmlsZSk7XG5cbiAgICBpZiAoZmlsZXNbZmlsZUlEXSkge1xuICAgICAgdGhpcy5fc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhuZXcgUmVzdHJpY3Rpb25FcnJvcih0aGlzLmkxOG4oJ25vRHVwbGljYXRlcycsIHtcbiAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lXG4gICAgICB9KSksIHtcbiAgICAgICAgZmlsZTogZmlsZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIG1ldGEgPSBmaWxlLm1ldGEgfHwge307XG4gICAgbWV0YS5uYW1lID0gZmlsZU5hbWU7XG4gICAgbWV0YS50eXBlID0gZmlsZVR5cGU7IC8vIGBudWxsYCBtZWFucyB0aGUgc2l6ZSBpcyB1bmtub3duLlxuXG4gICAgdmFyIHNpemUgPSBpc0Zpbml0ZShmaWxlLmRhdGEuc2l6ZSkgPyBmaWxlLmRhdGEuc2l6ZSA6IG51bGw7XG4gICAgdmFyIG5ld0ZpbGUgPSB7XG4gICAgICBzb3VyY2U6IGZpbGUuc291cmNlIHx8ICcnLFxuICAgICAgaWQ6IGZpbGVJRCxcbiAgICAgIG5hbWU6IGZpbGVOYW1lLFxuICAgICAgZXh0ZW5zaW9uOiBmaWxlRXh0ZW5zaW9uIHx8ICcnLFxuICAgICAgbWV0YTogX2V4dGVuZHMoe30sIHRoaXMuZ2V0U3RhdGUoKS5tZXRhLCBtZXRhKSxcbiAgICAgIHR5cGU6IGZpbGVUeXBlLFxuICAgICAgZGF0YTogZmlsZS5kYXRhLFxuICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgICAgYnl0ZXNVcGxvYWRlZDogMCxcbiAgICAgICAgYnl0ZXNUb3RhbDogc2l6ZSxcbiAgICAgICAgdXBsb2FkQ29tcGxldGU6IGZhbHNlLFxuICAgICAgICB1cGxvYWRTdGFydGVkOiBudWxsXG4gICAgICB9LFxuICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgIGlzUmVtb3RlOiBpc1JlbW90ZSxcbiAgICAgIHJlbW90ZTogZmlsZS5yZW1vdGUgfHwgJycsXG4gICAgICBwcmV2aWV3OiBmaWxlLnByZXZpZXdcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBmaWxlc0FycmF5ID0gT2JqZWN0LmtleXMoZmlsZXMpLm1hcChmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gZmlsZXNbaV07XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fY2hlY2tSZXN0cmljdGlvbnMobmV3RmlsZSwgZmlsZXNBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLl9zaG93T3JMb2dFcnJvckFuZFRocm93KGVyciwge1xuICAgICAgICBmaWxlOiBuZXdGaWxlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3RmlsZTtcbiAgfSAvLyBTY2hlZHVsZSBhbiB1cGxvYWQgaWYgYGF1dG9Qcm9jZWVkYCBpcyBlbmFibGVkLlxuICA7XG5cbiAgX3Byb3RvLl9zdGFydElmQXV0b1Byb2NlZWQgPSBmdW5jdGlvbiBfc3RhcnRJZkF1dG9Qcm9jZWVkKCkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMub3B0cy5hdXRvUHJvY2VlZCAmJiAhdGhpcy5zY2hlZHVsZWRBdXRvUHJvY2VlZCkge1xuICAgICAgdGhpcy5zY2hlZHVsZWRBdXRvUHJvY2VlZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpczMuc2NoZWR1bGVkQXV0b1Byb2NlZWQgPSBudWxsO1xuXG4gICAgICAgIF90aGlzMy51cGxvYWQoKS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKCFlcnIuaXNSZXN0cmljdGlvbikge1xuICAgICAgICAgICAgX3RoaXMzLmxvZyhlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UgfHwgZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgNCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZmlsZSB0byBgc3RhdGUuZmlsZXNgLiBUaGlzIHdpbGwgcnVuIGBvbkJlZm9yZUZpbGVBZGRlZGAsXG4gICAqIHRyeSB0byBndWVzcyBmaWxlIHR5cGUgaW4gYSBjbGV2ZXIgd2F5LCBjaGVjayBmaWxlIGFnYWluc3QgcmVzdHJpY3Rpb25zLFxuICAgKiBhbmQgc3RhcnQgYW4gdXBsb2FkIGlmIGBhdXRvUHJvY2VlZCA9PT0gdHJ1ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlIG9iamVjdCB0byBhZGRcbiAgICogQHJldHVybnMge3N0cmluZ30gaWQgZm9yIHRoZSBhZGRlZCBmaWxlXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLmFkZEZpbGUgPSBmdW5jdGlvbiBhZGRGaWxlKGZpbGUpIHtcbiAgICB2YXIgX2V4dGVuZHMzO1xuXG4gICAgdGhpcy5fYXNzZXJ0TmV3VXBsb2FkQWxsb3dlZChmaWxlKTtcblxuICAgIHZhciBfdGhpcyRnZXRTdGF0ZTMgPSB0aGlzLmdldFN0YXRlKCksXG4gICAgICAgIGZpbGVzID0gX3RoaXMkZ2V0U3RhdGUzLmZpbGVzO1xuXG4gICAgdmFyIG5ld0ZpbGUgPSB0aGlzLl9jaGVja0FuZENyZWF0ZUZpbGVTdGF0ZU9iamVjdChmaWxlcywgZmlsZSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiBfZXh0ZW5kcyh7fSwgZmlsZXMsIChfZXh0ZW5kczMgPSB7fSwgX2V4dGVuZHMzW25ld0ZpbGUuaWRdID0gbmV3RmlsZSwgX2V4dGVuZHMzKSlcbiAgICB9KTtcbiAgICB0aGlzLmVtaXQoJ2ZpbGUtYWRkZWQnLCBuZXdGaWxlKTtcbiAgICB0aGlzLmVtaXQoJ2ZpbGVzLWFkZGVkJywgW25ld0ZpbGVdKTtcbiAgICB0aGlzLmxvZyhcIkFkZGVkIGZpbGU6IFwiICsgbmV3RmlsZS5uYW1lICsgXCIsIFwiICsgbmV3RmlsZS5pZCArIFwiLCBtaW1lIHR5cGU6IFwiICsgbmV3RmlsZS50eXBlKTtcblxuICAgIHRoaXMuX3N0YXJ0SWZBdXRvUHJvY2VlZCgpO1xuXG4gICAgcmV0dXJuIG5ld0ZpbGUuaWQ7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBtdWx0aXBsZSBmaWxlcyB0byBgc3RhdGUuZmlsZXNgLiBTZWUgdGhlIGBhZGRGaWxlKClgIGRvY3VtZW50YXRpb24uXG4gICAqXG4gICAqIFRoaXMgY3V0cyBzb21lIGNvcm5lcnMgZm9yIHBlcmZvcm1hbmNlLCBzbyBzaG91bGQgdHlwaWNhbGx5IG9ubHkgYmUgdXNlZCBpbiBjYXNlcyB3aGVyZSB0aGVyZSBtYXkgYmUgYSBsb3Qgb2YgZmlsZXMuXG4gICAqXG4gICAqIElmIGFuIGVycm9yIG9jY3VycyB3aGlsZSBhZGRpbmcgYSBmaWxlLCBpdCBpcyBsb2dnZWQgYW5kIHRoZSB1c2VyIGlzIG5vdGlmaWVkLiBUaGlzIGlzIGdvb2QgZm9yIFVJIHBsdWdpbnMsIGJ1dCBub3QgZm9yIHByb2dyYW1tYXRpYyB1c2UuIFByb2dyYW1tYXRpYyB1c2VycyBzaG91bGQgdXN1YWxseSBzdGlsbCB1c2UgYGFkZEZpbGUoKWAgb24gaW5kaXZpZHVhbCBmaWxlcy5cbiAgICovXG4gIDtcblxuICBfcHJvdG8uYWRkRmlsZXMgPSBmdW5jdGlvbiBhZGRGaWxlcyhmaWxlRGVzY3JpcHRvcnMpIHtcbiAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgIHRoaXMuX2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQoKTsgLy8gY3JlYXRlIGEgY29weSBvZiB0aGUgZmlsZXMgb2JqZWN0IG9ubHkgb25jZVxuXG5cbiAgICB2YXIgZmlsZXMgPSBfZXh0ZW5kcyh7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzKTtcblxuICAgIHZhciBuZXdGaWxlcyA9IFtdO1xuICAgIHZhciBlcnJvcnMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZURlc2NyaXB0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgbmV3RmlsZSA9IHRoaXMuX2NoZWNrQW5kQ3JlYXRlRmlsZVN0YXRlT2JqZWN0KGZpbGVzLCBmaWxlRGVzY3JpcHRvcnNbaV0pO1xuXG4gICAgICAgIG5ld0ZpbGVzLnB1c2gobmV3RmlsZSk7XG4gICAgICAgIGZpbGVzW25ld0ZpbGUuaWRdID0gbmV3RmlsZTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoIWVyci5pc1Jlc3RyaWN0aW9uKSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IGZpbGVzXG4gICAgfSk7XG4gICAgbmV3RmlsZXMuZm9yRWFjaChmdW5jdGlvbiAobmV3RmlsZSkge1xuICAgICAgX3RoaXM0LmVtaXQoJ2ZpbGUtYWRkZWQnLCBuZXdGaWxlKTtcbiAgICB9KTtcbiAgICB0aGlzLmVtaXQoJ2ZpbGVzLWFkZGVkJywgbmV3RmlsZXMpO1xuXG4gICAgaWYgKG5ld0ZpbGVzLmxlbmd0aCA+IDUpIHtcbiAgICAgIHRoaXMubG9nKFwiQWRkZWQgYmF0Y2ggb2YgXCIgKyBuZXdGaWxlcy5sZW5ndGggKyBcIiBmaWxlc1wiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXMobmV3RmlsZXMpLmZvckVhY2goZnVuY3Rpb24gKGZpbGVJRCkge1xuICAgICAgICBfdGhpczQubG9nKFwiQWRkZWQgZmlsZTogXCIgKyBuZXdGaWxlc1tmaWxlSURdLm5hbWUgKyBcIlxcbiBpZDogXCIgKyBuZXdGaWxlc1tmaWxlSURdLmlkICsgXCJcXG4gdHlwZTogXCIgKyBuZXdGaWxlc1tmaWxlSURdLnR5cGUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG5ld0ZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX3N0YXJ0SWZBdXRvUHJvY2VlZCgpO1xuICAgIH1cblxuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIG1lc3NhZ2UgPSAnTXVsdGlwbGUgZXJyb3JzIG9jY3VycmVkIHdoaWxlIGFkZGluZyBmaWxlczpcXG4nO1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKHN1YkVycm9yKSB7XG4gICAgICAgIG1lc3NhZ2UgKz0gXCJcXG4gKiBcIiArIHN1YkVycm9yLm1lc3NhZ2U7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuaW5mbyh7XG4gICAgICAgIG1lc3NhZ2U6IHRoaXMuaTE4bignYWRkQnVsa0ZpbGVzRmFpbGVkJywge1xuICAgICAgICAgIHNtYXJ0X2NvdW50OiBlcnJvcnMubGVuZ3RoXG4gICAgICAgIH0pLFxuICAgICAgICBkZXRhaWxzOiBtZXNzYWdlXG4gICAgICB9LCAnZXJyb3InLCB0aGlzLm9wdHMuaW5mb1RpbWVvdXQpO1xuICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgIGVyci5lcnJvcnMgPSBlcnJvcnM7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5yZW1vdmVGaWxlcyA9IGZ1bmN0aW9uIHJlbW92ZUZpbGVzKGZpbGVJRHMsIHJlYXNvbikge1xuICAgIHZhciBfdGhpczUgPSB0aGlzO1xuXG4gICAgdmFyIF90aGlzJGdldFN0YXRlNCA9IHRoaXMuZ2V0U3RhdGUoKSxcbiAgICAgICAgZmlsZXMgPSBfdGhpcyRnZXRTdGF0ZTQuZmlsZXMsXG4gICAgICAgIGN1cnJlbnRVcGxvYWRzID0gX3RoaXMkZ2V0U3RhdGU0LmN1cnJlbnRVcGxvYWRzO1xuXG4gICAgdmFyIHVwZGF0ZWRGaWxlcyA9IF9leHRlbmRzKHt9LCBmaWxlcyk7XG5cbiAgICB2YXIgdXBkYXRlZFVwbG9hZHMgPSBfZXh0ZW5kcyh7fSwgY3VycmVudFVwbG9hZHMpO1xuXG4gICAgdmFyIHJlbW92ZWRGaWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgZmlsZUlEcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlSUQpIHtcbiAgICAgIGlmIChmaWxlc1tmaWxlSURdKSB7XG4gICAgICAgIHJlbW92ZWRGaWxlc1tmaWxlSURdID0gZmlsZXNbZmlsZUlEXTtcbiAgICAgICAgZGVsZXRlIHVwZGF0ZWRGaWxlc1tmaWxlSURdO1xuICAgICAgfVxuICAgIH0pOyAvLyBSZW1vdmUgZmlsZXMgZnJvbSB0aGUgYGZpbGVJRHNgIGxpc3QgaW4gZWFjaCB1cGxvYWQuXG5cbiAgICBmdW5jdGlvbiBmaWxlSXNOb3RSZW1vdmVkKHVwbG9hZEZpbGVJRCkge1xuICAgICAgcmV0dXJuIHJlbW92ZWRGaWxlc1t1cGxvYWRGaWxlSURdID09PSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIHVwbG9hZHNUb1JlbW92ZSA9IFtdO1xuICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRVcGxvYWRzKS5mb3JFYWNoKGZ1bmN0aW9uICh1cGxvYWRJRCkge1xuICAgICAgdmFyIG5ld0ZpbGVJRHMgPSBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0uZmlsZUlEcy5maWx0ZXIoZmlsZUlzTm90UmVtb3ZlZCk7IC8vIFJlbW92ZSB0aGUgdXBsb2FkIGlmIG5vIGZpbGVzIGFyZSBhc3NvY2lhdGVkIHdpdGggaXQgYW55bW9yZS5cblxuICAgICAgaWYgKG5ld0ZpbGVJRHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHVwbG9hZHNUb1JlbW92ZS5wdXNoKHVwbG9hZElEKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVkVXBsb2Fkc1t1cGxvYWRJRF0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFVwbG9hZHNbdXBsb2FkSURdLCB7XG4gICAgICAgIGZpbGVJRHM6IG5ld0ZpbGVJRHNcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHVwbG9hZHNUb1JlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uICh1cGxvYWRJRCkge1xuICAgICAgZGVsZXRlIHVwZGF0ZWRVcGxvYWRzW3VwbG9hZElEXTtcbiAgICB9KTtcbiAgICB2YXIgc3RhdGVVcGRhdGUgPSB7XG4gICAgICBjdXJyZW50VXBsb2FkczogdXBkYXRlZFVwbG9hZHMsXG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzXG4gICAgfTsgLy8gSWYgYWxsIGZpbGVzIHdlcmUgcmVtb3ZlZCAtIGFsbG93IG5ldyB1cGxvYWRzIVxuXG4gICAgaWYgKE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICBzdGF0ZVVwZGF0ZS5hbGxvd05ld1VwbG9hZCA9IHRydWU7XG4gICAgICBzdGF0ZVVwZGF0ZS5lcnJvciA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZVVwZGF0ZSk7XG5cbiAgICB0aGlzLl9jYWxjdWxhdGVUb3RhbFByb2dyZXNzKCk7XG5cbiAgICB2YXIgcmVtb3ZlZEZpbGVJRHMgPSBPYmplY3Qua2V5cyhyZW1vdmVkRmlsZXMpO1xuICAgIHJlbW92ZWRGaWxlSURzLmZvckVhY2goZnVuY3Rpb24gKGZpbGVJRCkge1xuICAgICAgX3RoaXM1LmVtaXQoJ2ZpbGUtcmVtb3ZlZCcsIHJlbW92ZWRGaWxlc1tmaWxlSURdLCByZWFzb24pO1xuICAgIH0pO1xuXG4gICAgaWYgKHJlbW92ZWRGaWxlSURzLmxlbmd0aCA+IDUpIHtcbiAgICAgIHRoaXMubG9nKFwiUmVtb3ZlZCBcIiArIHJlbW92ZWRGaWxlSURzLmxlbmd0aCArIFwiIGZpbGVzXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZyhcIlJlbW92ZWQgZmlsZXM6IFwiICsgcmVtb3ZlZEZpbGVJRHMuam9pbignLCAnKSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5yZW1vdmVGaWxlID0gZnVuY3Rpb24gcmVtb3ZlRmlsZShmaWxlSUQsIHJlYXNvbikge1xuICAgIGlmIChyZWFzb24gPT09IHZvaWQgMCkge1xuICAgICAgcmVhc29uID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZUZpbGVzKFtmaWxlSURdLCByZWFzb24pO1xuICB9O1xuXG4gIF9wcm90by5wYXVzZVJlc3VtZSA9IGZ1bmN0aW9uIHBhdXNlUmVzdW1lKGZpbGVJRCkge1xuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmNhcGFiaWxpdGllcy5yZXN1bWFibGVVcGxvYWRzIHx8IHRoaXMuZ2V0RmlsZShmaWxlSUQpLnVwbG9hZENvbXBsZXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHdhc1BhdXNlZCA9IHRoaXMuZ2V0RmlsZShmaWxlSUQpLmlzUGF1c2VkIHx8IGZhbHNlO1xuICAgIHZhciBpc1BhdXNlZCA9ICF3YXNQYXVzZWQ7XG4gICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZUlELCB7XG4gICAgICBpc1BhdXNlZDogaXNQYXVzZWRcbiAgICB9KTtcbiAgICB0aGlzLmVtaXQoJ3VwbG9hZC1wYXVzZScsIGZpbGVJRCwgaXNQYXVzZWQpO1xuICAgIHJldHVybiBpc1BhdXNlZDtcbiAgfTtcblxuICBfcHJvdG8ucGF1c2VBbGwgPSBmdW5jdGlvbiBwYXVzZUFsbCgpIHtcbiAgICB2YXIgdXBkYXRlZEZpbGVzID0gX2V4dGVuZHMoe30sIHRoaXMuZ2V0U3RhdGUoKS5maWxlcyk7XG5cbiAgICB2YXIgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcyA9IE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICByZXR1cm4gIXVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZSAmJiB1cGRhdGVkRmlsZXNbZmlsZV0ucHJvZ3Jlc3MudXBsb2FkU3RhcnRlZDtcbiAgICB9KTtcbiAgICBpblByb2dyZXNzVXBkYXRlZEZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHZhciB1cGRhdGVkRmlsZSA9IF9leHRlbmRzKHt9LCB1cGRhdGVkRmlsZXNbZmlsZV0sIHtcbiAgICAgICAgaXNQYXVzZWQ6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZV0gPSB1cGRhdGVkRmlsZTtcbiAgICB9KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB1cGRhdGVkRmlsZXNcbiAgICB9KTtcbiAgICB0aGlzLmVtaXQoJ3BhdXNlLWFsbCcpO1xuICB9O1xuXG4gIF9wcm90by5yZXN1bWVBbGwgPSBmdW5jdGlvbiByZXN1bWVBbGwoKSB7XG4gICAgdmFyIHVwZGF0ZWRGaWxlcyA9IF9leHRlbmRzKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpO1xuXG4gICAgdmFyIGluUHJvZ3Jlc3NVcGRhdGVkRmlsZXMgPSBPYmplY3Qua2V5cyh1cGRhdGVkRmlsZXMpLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgcmV0dXJuICF1cGRhdGVkRmlsZXNbZmlsZV0ucHJvZ3Jlc3MudXBsb2FkQ29tcGxldGUgJiYgdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQ7XG4gICAgfSk7XG4gICAgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICB2YXIgdXBkYXRlZEZpbGUgPSBfZXh0ZW5kcyh7fSwgdXBkYXRlZEZpbGVzW2ZpbGVdLCB7XG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGxcbiAgICAgIH0pO1xuXG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZV0gPSB1cGRhdGVkRmlsZTtcbiAgICB9KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB1cGRhdGVkRmlsZXNcbiAgICB9KTtcbiAgICB0aGlzLmVtaXQoJ3Jlc3VtZS1hbGwnKTtcbiAgfTtcblxuICBfcHJvdG8ucmV0cnlBbGwgPSBmdW5jdGlvbiByZXRyeUFsbCgpIHtcbiAgICB2YXIgdXBkYXRlZEZpbGVzID0gX2V4dGVuZHMoe30sIHRoaXMuZ2V0U3RhdGUoKS5maWxlcyk7XG5cbiAgICB2YXIgZmlsZXNUb1JldHJ5ID0gT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHJldHVybiB1cGRhdGVkRmlsZXNbZmlsZV0uZXJyb3I7XG4gICAgfSk7XG4gICAgZmlsZXNUb1JldHJ5LmZvckVhY2goZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHZhciB1cGRhdGVkRmlsZSA9IF9leHRlbmRzKHt9LCB1cGRhdGVkRmlsZXNbZmlsZV0sIHtcbiAgICAgICAgaXNQYXVzZWQ6IGZhbHNlLFxuICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgfSk7XG5cbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlXSA9IHVwZGF0ZWRGaWxlO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICAgIGVycm9yOiBudWxsXG4gICAgfSk7XG4gICAgdGhpcy5lbWl0KCdyZXRyeS1hbGwnLCBmaWxlc1RvUmV0cnkpO1xuXG4gICAgaWYgKGZpbGVzVG9SZXRyeS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBzdWNjZXNzZnVsOiBbXSxcbiAgICAgICAgZmFpbGVkOiBbXVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIHVwbG9hZElEID0gdGhpcy5fY3JlYXRlVXBsb2FkKGZpbGVzVG9SZXRyeSwge1xuICAgICAgZm9yY2VBbGxvd05ld1VwbG9hZDogdHJ1ZSAvLyBjcmVhdGUgbmV3IHVwbG9hZCBldmVuIGlmIGFsbG93TmV3VXBsb2FkOiBmYWxzZVxuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5fcnVuVXBsb2FkKHVwbG9hZElEKTtcbiAgfTtcblxuICBfcHJvdG8uY2FuY2VsQWxsID0gZnVuY3Rpb24gY2FuY2VsQWxsKCkge1xuICAgIHRoaXMuZW1pdCgnY2FuY2VsLWFsbCcpO1xuXG4gICAgdmFyIF90aGlzJGdldFN0YXRlNSA9IHRoaXMuZ2V0U3RhdGUoKSxcbiAgICAgICAgZmlsZXMgPSBfdGhpcyRnZXRTdGF0ZTUuZmlsZXM7XG5cbiAgICB2YXIgZmlsZUlEcyA9IE9iamVjdC5rZXlzKGZpbGVzKTtcblxuICAgIGlmIChmaWxlSURzLmxlbmd0aCkge1xuICAgICAgdGhpcy5yZW1vdmVGaWxlcyhmaWxlSURzLCAnY2FuY2VsLWFsbCcpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdG90YWxQcm9ncmVzczogMCxcbiAgICAgIGVycm9yOiBudWxsXG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLnJldHJ5VXBsb2FkID0gZnVuY3Rpb24gcmV0cnlVcGxvYWQoZmlsZUlEKSB7XG4gICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZUlELCB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGlzUGF1c2VkOiBmYWxzZVxuICAgIH0pO1xuICAgIHRoaXMuZW1pdCgndXBsb2FkLXJldHJ5JywgZmlsZUlEKTtcblxuICAgIHZhciB1cGxvYWRJRCA9IHRoaXMuX2NyZWF0ZVVwbG9hZChbZmlsZUlEXSwge1xuICAgICAgZm9yY2VBbGxvd05ld1VwbG9hZDogdHJ1ZSAvLyBjcmVhdGUgbmV3IHVwbG9hZCBldmVuIGlmIGFsbG93TmV3VXBsb2FkOiBmYWxzZVxuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5fcnVuVXBsb2FkKHVwbG9hZElEKTtcbiAgfTtcblxuICBfcHJvdG8ucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcbiAgICB0aGlzLmNhbmNlbEFsbCgpO1xuICB9O1xuXG4gIF9wcm90by5fY2FsY3VsYXRlUHJvZ3Jlc3MgPSBmdW5jdGlvbiBfY2FsY3VsYXRlUHJvZ3Jlc3MoZmlsZSwgZGF0YSkge1xuICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICB0aGlzLmxvZyhcIk5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiBcIiArIGZpbGUuaWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gYnl0ZXNUb3RhbCBtYXkgYmUgbnVsbCBvciB6ZXJvOyBpbiB0aGF0IGNhc2Ugd2UgY2FuJ3QgZGl2aWRlIGJ5IGl0XG5cblxuICAgIHZhciBjYW5IYXZlUGVyY2VudGFnZSA9IGlzRmluaXRlKGRhdGEuYnl0ZXNUb3RhbCkgJiYgZGF0YS5ieXRlc1RvdGFsID4gMDtcbiAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICBwcm9ncmVzczogX2V4dGVuZHMoe30sIHRoaXMuZ2V0RmlsZShmaWxlLmlkKS5wcm9ncmVzcywge1xuICAgICAgICBieXRlc1VwbG9hZGVkOiBkYXRhLmJ5dGVzVXBsb2FkZWQsXG4gICAgICAgIGJ5dGVzVG90YWw6IGRhdGEuYnl0ZXNUb3RhbCxcbiAgICAgICAgcGVyY2VudGFnZTogY2FuSGF2ZVBlcmNlbnRhZ2UgLy8gVE9ETyhnb3RvLWJ1cy1zdG9wKSBmbG9vcmluZyB0aGlzIHNob3VsZCBwcm9iYWJseSBiZSB0aGUgY2hvaWNlIG9mIHRoZSBVST9cbiAgICAgICAgLy8gd2UgZ2V0IG1vcmUgYWNjdXJhdGUgY2FsY3VsYXRpb25zIGlmIHdlIGRvbid0IHJvdW5kIHRoaXMgYXQgYWxsLlxuICAgICAgICA/IE1hdGgucm91bmQoZGF0YS5ieXRlc1VwbG9hZGVkIC8gZGF0YS5ieXRlc1RvdGFsICogMTAwKSA6IDBcbiAgICAgIH0pXG4gICAgfSk7XG5cbiAgICB0aGlzLl9jYWxjdWxhdGVUb3RhbFByb2dyZXNzKCk7XG4gIH07XG5cbiAgX3Byb3RvLl9jYWxjdWxhdGVUb3RhbFByb2dyZXNzID0gZnVuY3Rpb24gX2NhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MoKSB7XG4gICAgLy8gY2FsY3VsYXRlIHRvdGFsIHByb2dyZXNzLCB1c2luZyB0aGUgbnVtYmVyIG9mIGZpbGVzIGN1cnJlbnRseSB1cGxvYWRpbmcsXG4gICAgLy8gbXVsdGlwbGllZCBieSAxMDAgYW5kIHRoZSBzdW1tIG9mIGluZGl2aWR1YWwgcHJvZ3Jlc3Mgb2YgZWFjaCBmaWxlXG4gICAgdmFyIGZpbGVzID0gdGhpcy5nZXRGaWxlcygpO1xuICAgIHZhciBpblByb2dyZXNzID0gZmlsZXMuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICByZXR1cm4gZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkIHx8IGZpbGUucHJvZ3Jlc3MucHJlcHJvY2VzcyB8fCBmaWxlLnByb2dyZXNzLnBvc3Rwcm9jZXNzO1xuICAgIH0pO1xuXG4gICAgaWYgKGluUHJvZ3Jlc3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmVtaXQoJ3Byb2dyZXNzJywgMCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdG90YWxQcm9ncmVzczogMFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHNpemVkRmlsZXMgPSBpblByb2dyZXNzLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgcmV0dXJuIGZpbGUucHJvZ3Jlc3MuYnl0ZXNUb3RhbCAhPSBudWxsO1xuICAgIH0pO1xuICAgIHZhciB1bnNpemVkRmlsZXMgPSBpblByb2dyZXNzLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgcmV0dXJuIGZpbGUucHJvZ3Jlc3MuYnl0ZXNUb3RhbCA9PSBudWxsO1xuICAgIH0pO1xuXG4gICAgaWYgKHNpemVkRmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB2YXIgcHJvZ3Jlc3NNYXggPSBpblByb2dyZXNzLmxlbmd0aCAqIDEwMDtcbiAgICAgIHZhciBjdXJyZW50UHJvZ3Jlc3MgPSB1bnNpemVkRmlsZXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGFjYyArIGZpbGUucHJvZ3Jlc3MucGVyY2VudGFnZTtcbiAgICAgIH0sIDApO1xuXG4gICAgICB2YXIgX3RvdGFsUHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKGN1cnJlbnRQcm9ncmVzcyAvIHByb2dyZXNzTWF4ICogMTAwKTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHRvdGFsUHJvZ3Jlc3M6IF90b3RhbFByb2dyZXNzXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdG90YWxTaXplID0gc2l6ZWRGaWxlcy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgZmlsZSkge1xuICAgICAgcmV0dXJuIGFjYyArIGZpbGUucHJvZ3Jlc3MuYnl0ZXNUb3RhbDtcbiAgICB9LCAwKTtcbiAgICB2YXIgYXZlcmFnZVNpemUgPSB0b3RhbFNpemUgLyBzaXplZEZpbGVzLmxlbmd0aDtcbiAgICB0b3RhbFNpemUgKz0gYXZlcmFnZVNpemUgKiB1bnNpemVkRmlsZXMubGVuZ3RoO1xuICAgIHZhciB1cGxvYWRlZFNpemUgPSAwO1xuICAgIHNpemVkRmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgdXBsb2FkZWRTaXplICs9IGZpbGUucHJvZ3Jlc3MuYnl0ZXNVcGxvYWRlZDtcbiAgICB9KTtcbiAgICB1bnNpemVkRmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgdXBsb2FkZWRTaXplICs9IGF2ZXJhZ2VTaXplICogKGZpbGUucHJvZ3Jlc3MucGVyY2VudGFnZSB8fCAwKSAvIDEwMDtcbiAgICB9KTtcbiAgICB2YXIgdG90YWxQcm9ncmVzcyA9IHRvdGFsU2l6ZSA9PT0gMCA/IDAgOiBNYXRoLnJvdW5kKHVwbG9hZGVkU2l6ZSAvIHRvdGFsU2l6ZSAqIDEwMCk7IC8vIGhvdCBmaXgsIGJlY2F1c2U6XG4gICAgLy8gdXBsb2FkZWRTaXplIGVuZGVkIHVwIGxhcmdlciB0aGFuIHRvdGFsU2l6ZSwgcmVzdWx0aW5nIGluIDEzMjUlIHRvdGFsXG5cbiAgICBpZiAodG90YWxQcm9ncmVzcyA+IDEwMCkge1xuICAgICAgdG90YWxQcm9ncmVzcyA9IDEwMDtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IHRvdGFsUHJvZ3Jlc3NcbiAgICB9KTtcbiAgICB0aGlzLmVtaXQoJ3Byb2dyZXNzJywgdG90YWxQcm9ncmVzcyk7XG4gIH1cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBsaXN0ZW5lcnMgZm9yIGFsbCBnbG9iYWwgYWN0aW9ucywgbGlrZTpcbiAgICogYGVycm9yYCwgYGZpbGUtcmVtb3ZlZGAsIGB1cGxvYWQtcHJvZ3Jlc3NgXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLl9hZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBfYWRkTGlzdGVuZXJzKCkge1xuICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgdGhpcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHZhciBlcnJvck1zZyA9ICdVbmtub3duIGVycm9yJztcblxuICAgICAgaWYgKGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICBlcnJvck1zZyArPSAnICcgKyBlcnJvci5kZXRhaWxzO1xuICAgICAgfVxuXG4gICAgICBfdGhpczYuc2V0U3RhdGUoe1xuICAgICAgICBlcnJvcjogZXJyb3JNc2dcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMub24oJ3VwbG9hZC1lcnJvcicsIGZ1bmN0aW9uIChmaWxlLCBlcnJvciwgcmVzcG9uc2UpIHtcbiAgICAgIHZhciBlcnJvck1zZyA9ICdVbmtub3duIGVycm9yJztcblxuICAgICAgaWYgKGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICBlcnJvck1zZyArPSAnICcgKyBlcnJvci5kZXRhaWxzO1xuICAgICAgfVxuXG4gICAgICBfdGhpczYuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgZXJyb3I6IGVycm9yTXNnLFxuICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpczYuc2V0U3RhdGUoe1xuICAgICAgICBlcnJvcjogZXJyb3IubWVzc2FnZVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0eXBlb2YgZXJyb3IgPT09ICdvYmplY3QnICYmIGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIG5ld0Vycm9yID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICBuZXdFcnJvci5kZXRhaWxzID0gZXJyb3IubWVzc2FnZTtcblxuICAgICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICAgIG5ld0Vycm9yLmRldGFpbHMgKz0gJyAnICsgZXJyb3IuZGV0YWlscztcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0Vycm9yLm1lc3NhZ2UgPSBfdGhpczYuaTE4bignZmFpbGVkVG9VcGxvYWQnLCB7XG4gICAgICAgICAgZmlsZTogZmlsZS5uYW1lXG4gICAgICAgIH0pO1xuXG4gICAgICAgIF90aGlzNi5fc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhuZXdFcnJvciwge1xuICAgICAgICAgIHRocm93RXJyOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzNi5fc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnJvciwge1xuICAgICAgICAgIHRocm93RXJyOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm9uKCd1cGxvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpczYuc2V0U3RhdGUoe1xuICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5vbigndXBsb2FkLXN0YXJ0ZWQnLCBmdW5jdGlvbiAoZmlsZSwgdXBsb2FkKSB7XG4gICAgICBpZiAoIV90aGlzNi5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIF90aGlzNi5sb2coXCJOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogXCIgKyBmaWxlLmlkKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF90aGlzNi5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgIHVwbG9hZFN0YXJ0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgdXBsb2FkQ29tcGxldGU6IGZhbHNlLFxuICAgICAgICAgIHBlcmNlbnRhZ2U6IDAsXG4gICAgICAgICAgYnl0ZXNVcGxvYWRlZDogMCxcbiAgICAgICAgICBieXRlc1RvdGFsOiBmaWxlLnNpemVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5vbigndXBsb2FkLXByb2dyZXNzJywgdGhpcy5fY2FsY3VsYXRlUHJvZ3Jlc3MpO1xuICAgIHRoaXMub24oJ3VwbG9hZC1zdWNjZXNzJywgZnVuY3Rpb24gKGZpbGUsIHVwbG9hZFJlc3ApIHtcbiAgICAgIGlmICghX3RoaXM2LmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgX3RoaXM2LmxvZyhcIk5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiBcIiArIGZpbGUuaWQpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRQcm9ncmVzcyA9IF90aGlzNi5nZXRGaWxlKGZpbGUuaWQpLnByb2dyZXNzO1xuXG4gICAgICBfdGhpczYuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IF9leHRlbmRzKHt9LCBjdXJyZW50UHJvZ3Jlc3MsIHtcbiAgICAgICAgICBwb3N0cHJvY2VzczogX3RoaXM2LnBvc3RQcm9jZXNzb3JzLmxlbmd0aCA+IDAgPyB7XG4gICAgICAgICAgICBtb2RlOiAnaW5kZXRlcm1pbmF0ZSdcbiAgICAgICAgICB9IDogbnVsbCxcbiAgICAgICAgICB1cGxvYWRDb21wbGV0ZTogdHJ1ZSxcbiAgICAgICAgICBwZXJjZW50YWdlOiAxMDAsXG4gICAgICAgICAgYnl0ZXNVcGxvYWRlZDogY3VycmVudFByb2dyZXNzLmJ5dGVzVG90YWxcbiAgICAgICAgfSksXG4gICAgICAgIHJlc3BvbnNlOiB1cGxvYWRSZXNwLFxuICAgICAgICB1cGxvYWRVUkw6IHVwbG9hZFJlc3AudXBsb2FkVVJMLFxuICAgICAgICBpc1BhdXNlZDogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpczYuX2NhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MoKTtcbiAgICB9KTtcbiAgICB0aGlzLm9uKCdwcmVwcm9jZXNzLXByb2dyZXNzJywgZnVuY3Rpb24gKGZpbGUsIHByb2dyZXNzKSB7XG4gICAgICBpZiAoIV90aGlzNi5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIF90aGlzNi5sb2coXCJOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogXCIgKyBmaWxlLmlkKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF90aGlzNi5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICBwcm9ncmVzczogX2V4dGVuZHMoe30sIF90aGlzNi5nZXRGaWxlKGZpbGUuaWQpLnByb2dyZXNzLCB7XG4gICAgICAgICAgcHJlcHJvY2VzczogcHJvZ3Jlc3NcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMub24oJ3ByZXByb2Nlc3MtY29tcGxldGUnLCBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgaWYgKCFfdGhpczYuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICBfdGhpczYubG9nKFwiTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6IFwiICsgZmlsZS5pZCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmlsZXMgPSBfZXh0ZW5kcyh7fSwgX3RoaXM2LmdldFN0YXRlKCkuZmlsZXMpO1xuXG4gICAgICBmaWxlc1tmaWxlLmlkXSA9IF9leHRlbmRzKHt9LCBmaWxlc1tmaWxlLmlkXSwge1xuICAgICAgICBwcm9ncmVzczogX2V4dGVuZHMoe30sIGZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzKVxuICAgICAgfSk7XG4gICAgICBkZWxldGUgZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MucHJlcHJvY2VzcztcblxuICAgICAgX3RoaXM2LnNldFN0YXRlKHtcbiAgICAgICAgZmlsZXM6IGZpbGVzXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLm9uKCdwb3N0cHJvY2Vzcy1wcm9ncmVzcycsIGZ1bmN0aW9uIChmaWxlLCBwcm9ncmVzcykge1xuICAgICAgaWYgKCFfdGhpczYuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICBfdGhpczYubG9nKFwiTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6IFwiICsgZmlsZS5pZCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfdGhpczYuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IF9leHRlbmRzKHt9LCBfdGhpczYuZ2V0U3RhdGUoKS5maWxlc1tmaWxlLmlkXS5wcm9ncmVzcywge1xuICAgICAgICAgIHBvc3Rwcm9jZXNzOiBwcm9ncmVzc1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtY29tcGxldGUnLCBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgaWYgKCFfdGhpczYuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICBfdGhpczYubG9nKFwiTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6IFwiICsgZmlsZS5pZCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmlsZXMgPSBfZXh0ZW5kcyh7fSwgX3RoaXM2LmdldFN0YXRlKCkuZmlsZXMpO1xuXG4gICAgICBmaWxlc1tmaWxlLmlkXSA9IF9leHRlbmRzKHt9LCBmaWxlc1tmaWxlLmlkXSwge1xuICAgICAgICBwcm9ncmVzczogX2V4dGVuZHMoe30sIGZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzKVxuICAgICAgfSk7XG4gICAgICBkZWxldGUgZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MucG9zdHByb2Nlc3M7IC8vIFRPRE8gc2hvdWxkIHdlIHNldCBzb21lIGtpbmQgb2YgYGZ1bGx5Q29tcGxldGVgIHByb3BlcnR5IG9uIHRoZSBmaWxlIG9iamVjdFxuICAgICAgLy8gc28gaXQncyBlYXNpZXIgdG8gc2VlIHRoYXQgdGhlIGZpbGUgaXMgdXBsb2Fk4oCmZnVsbHkgY29tcGxldGXigKZyYXRoZXIgdGhhblxuICAgICAgLy8gd2hhdCB3ZSBoYXZlIHRvIGRvIG5vdyAoYHVwbG9hZENvbXBsZXRlICYmICFwb3N0cHJvY2Vzc2ApXG5cbiAgICAgIF90aGlzNi5zZXRTdGF0ZSh7XG4gICAgICAgIGZpbGVzOiBmaWxlc1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5vbigncmVzdG9yZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBGaWxlcyBtYXkgaGF2ZSBjaGFuZ2VkLS1lbnN1cmUgcHJvZ3Jlc3MgaXMgc3RpbGwgYWNjdXJhdGUuXG4gICAgICBfdGhpczYuX2NhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MoKTtcbiAgICB9KTsgLy8gc2hvdyBpbmZvcm1lciBpZiBvZmZsaW5lXG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpczYudXBkYXRlT25saW5lU3RhdHVzKCk7XG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3RoaXM2LnVwZGF0ZU9ubGluZVN0YXR1cygpO1xuICAgICAgfSk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzNi51cGRhdGVPbmxpbmVTdGF0dXMoKTtcbiAgICAgIH0sIDMwMDApO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8udXBkYXRlT25saW5lU3RhdHVzID0gZnVuY3Rpb24gdXBkYXRlT25saW5lU3RhdHVzKCkge1xuICAgIHZhciBvbmxpbmUgPSB0eXBlb2Ygd2luZG93Lm5hdmlnYXRvci5vbkxpbmUgIT09ICd1bmRlZmluZWQnID8gd2luZG93Lm5hdmlnYXRvci5vbkxpbmUgOiB0cnVlO1xuXG4gICAgaWYgKCFvbmxpbmUpIHtcbiAgICAgIHRoaXMuZW1pdCgnaXMtb2ZmbGluZScpO1xuICAgICAgdGhpcy5pbmZvKHRoaXMuaTE4bignbm9JbnRlcm5ldENvbm5lY3Rpb24nKSwgJ2Vycm9yJywgMCk7XG4gICAgICB0aGlzLndhc09mZmxpbmUgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtaXQoJ2lzLW9ubGluZScpO1xuXG4gICAgICBpZiAodGhpcy53YXNPZmZsaW5lKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnYmFjay1vbmxpbmUnKTtcbiAgICAgICAgdGhpcy5pbmZvKHRoaXMuaTE4bignY29ubmVjdGVkVG9JbnRlcm5ldCcpLCAnc3VjY2VzcycsIDMwMDApO1xuICAgICAgICB0aGlzLndhc09mZmxpbmUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmdldElEID0gZnVuY3Rpb24gZ2V0SUQoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0cy5pZDtcbiAgfVxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgcGx1Z2luIHdpdGggQ29yZS5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IFBsdWdpbiBvYmplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRzXSBvYmplY3Qgd2l0aCBvcHRpb25zIHRvIGJlIHBhc3NlZCB0byBQbHVnaW5cbiAgICogQHJldHVybnMge29iamVjdH0gc2VsZiBmb3IgY2hhaW5pbmdcbiAgICovXG4gIDtcblxuICBfcHJvdG8udXNlID0gZnVuY3Rpb24gdXNlKFBsdWdpbiwgb3B0cykge1xuICAgIGlmICh0eXBlb2YgUGx1Z2luICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgbXNnID0gXCJFeHBlY3RlZCBhIHBsdWdpbiBjbGFzcywgYnV0IGdvdCBcIiArIChQbHVnaW4gPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgUGx1Z2luKSArIFwiLlwiICsgJyBQbGVhc2UgdmVyaWZ5IHRoYXQgdGhlIHBsdWdpbiB3YXMgaW1wb3J0ZWQgYW5kIHNwZWxsZWQgY29ycmVjdGx5Lic7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKG1zZyk7XG4gICAgfSAvLyBJbnN0YW50aWF0ZVxuXG5cbiAgICB2YXIgcGx1Z2luID0gbmV3IFBsdWdpbih0aGlzLCBvcHRzKTtcbiAgICB2YXIgcGx1Z2luSWQgPSBwbHVnaW4uaWQ7XG4gICAgdGhpcy5wbHVnaW5zW3BsdWdpbi50eXBlXSA9IHRoaXMucGx1Z2luc1twbHVnaW4udHlwZV0gfHwgW107XG5cbiAgICBpZiAoIXBsdWdpbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgcGx1Z2luIG11c3QgaGF2ZSBhbiBpZCcpO1xuICAgIH1cblxuICAgIGlmICghcGx1Z2luLnR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciBwbHVnaW4gbXVzdCBoYXZlIGEgdHlwZScpO1xuICAgIH1cblxuICAgIHZhciBleGlzdHNQbHVnaW5BbHJlYWR5ID0gdGhpcy5nZXRQbHVnaW4ocGx1Z2luSWQpO1xuXG4gICAgaWYgKGV4aXN0c1BsdWdpbkFscmVhZHkpIHtcbiAgICAgIHZhciBfbXNnID0gXCJBbHJlYWR5IGZvdW5kIGEgcGx1Z2luIG5hbWVkICdcIiArIGV4aXN0c1BsdWdpbkFscmVhZHkuaWQgKyBcIicuIFwiICsgKFwiVHJpZWQgdG8gdXNlOiAnXCIgKyBwbHVnaW5JZCArIFwiJy5cXG5cIikgKyAnVXBweSBwbHVnaW5zIG11c3QgaGF2ZSB1bmlxdWUgYGlkYCBvcHRpb25zLiBTZWUgaHR0cHM6Ly91cHB5LmlvL2RvY3MvcGx1Z2lucy8jaWQuJztcblxuICAgICAgdGhyb3cgbmV3IEVycm9yKF9tc2cpO1xuICAgIH1cblxuICAgIGlmIChQbHVnaW4uVkVSU0lPTikge1xuICAgICAgdGhpcy5sb2coXCJVc2luZyBcIiArIHBsdWdpbklkICsgXCIgdlwiICsgUGx1Z2luLlZFUlNJT04pO1xuICAgIH1cblxuICAgIHRoaXMucGx1Z2luc1twbHVnaW4udHlwZV0ucHVzaChwbHVnaW4pO1xuICAgIHBsdWdpbi5pbnN0YWxsKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEZpbmQgb25lIFBsdWdpbiBieSBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgcGx1Z2luIGlkXG4gICAqIEByZXR1cm5zIHtvYmplY3R8Ym9vbGVhbn1cbiAgICovXG4gIDtcblxuICBfcHJvdG8uZ2V0UGx1Z2luID0gZnVuY3Rpb24gZ2V0UGx1Z2luKGlkKSB7XG4gICAgdmFyIGZvdW5kUGx1Z2luID0gbnVsbDtcbiAgICB0aGlzLml0ZXJhdGVQbHVnaW5zKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICAgIGlmIChwbHVnaW4uaWQgPT09IGlkKSB7XG4gICAgICAgIGZvdW5kUGx1Z2luID0gcGx1Z2luO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZvdW5kUGx1Z2luO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIHRocm91Z2ggYWxsIGB1c2VgZCBwbHVnaW5zLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2QgdGhhdCB3aWxsIGJlIHJ1biBvbiBlYWNoIHBsdWdpblxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5pdGVyYXRlUGx1Z2lucyA9IGZ1bmN0aW9uIGl0ZXJhdGVQbHVnaW5zKG1ldGhvZCkge1xuICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgT2JqZWN0LmtleXModGhpcy5wbHVnaW5zKS5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnaW5UeXBlKSB7XG4gICAgICBfdGhpczcucGx1Z2luc1twbHVnaW5UeXBlXS5mb3JFYWNoKG1ldGhvZCk7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFVuaW5zdGFsbCBhbmQgcmVtb3ZlIGEgcGx1Z2luLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gaW5zdGFuY2UgVGhlIHBsdWdpbiBpbnN0YW5jZSB0byByZW1vdmUuXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLnJlbW92ZVBsdWdpbiA9IGZ1bmN0aW9uIHJlbW92ZVBsdWdpbihpbnN0YW5jZSkge1xuICAgIHRoaXMubG9nKFwiUmVtb3ZpbmcgcGx1Z2luIFwiICsgaW5zdGFuY2UuaWQpO1xuICAgIHRoaXMuZW1pdCgncGx1Z2luLXJlbW92ZScsIGluc3RhbmNlKTtcblxuICAgIGlmIChpbnN0YW5jZS51bmluc3RhbGwpIHtcbiAgICAgIGluc3RhbmNlLnVuaW5zdGFsbCgpO1xuICAgIH1cblxuICAgIHZhciBsaXN0ID0gdGhpcy5wbHVnaW5zW2luc3RhbmNlLnR5cGVdLnNsaWNlKCk7XG4gICAgdmFyIGluZGV4ID0gbGlzdC5pbmRleE9mKGluc3RhbmNlKTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMucGx1Z2luc1tpbnN0YW5jZS50eXBlXSA9IGxpc3Q7XG4gICAgfVxuXG4gICAgdmFyIHVwZGF0ZWRTdGF0ZSA9IHRoaXMuZ2V0U3RhdGUoKTtcbiAgICBkZWxldGUgdXBkYXRlZFN0YXRlLnBsdWdpbnNbaW5zdGFuY2UuaWRdO1xuICAgIHRoaXMuc2V0U3RhdGUodXBkYXRlZFN0YXRlKTtcbiAgfVxuICAvKipcbiAgICogVW5pbnN0YWxsIGFsbCBwbHVnaW5zIGFuZCBjbG9zZSBkb3duIHRoaXMgVXBweSBpbnN0YW5jZS5cbiAgICovXG4gIDtcblxuICBfcHJvdG8uY2xvc2UgPSBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICB2YXIgX3RoaXM4ID0gdGhpcztcblxuICAgIHRoaXMubG9nKFwiQ2xvc2luZyBVcHB5IGluc3RhbmNlIFwiICsgdGhpcy5vcHRzLmlkICsgXCI6IHJlbW92aW5nIGFsbCBmaWxlcyBhbmQgdW5pbnN0YWxsaW5nIHBsdWdpbnNcIik7XG4gICAgdGhpcy5yZXNldCgpO1xuXG4gICAgdGhpcy5fc3RvcmVVbnN1YnNjcmliZSgpO1xuXG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucyhmdW5jdGlvbiAocGx1Z2luKSB7XG4gICAgICBfdGhpczgucmVtb3ZlUGx1Z2luKHBsdWdpbik7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFNldCBpbmZvIG1lc3NhZ2UgaW4gYHN0YXRlLmluZm9gLCBzbyB0aGF0IFVJIHBsdWdpbnMgbGlrZSBgSW5mb3JtZXJgXG4gICAqIGNhbiBkaXNwbGF5IHRoZSBtZXNzYWdlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IG9iamVjdH0gbWVzc2FnZSBNZXNzYWdlIHRvIGJlIGRpc3BsYXllZCBieSB0aGUgaW5mb3JtZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXVxuICAgKiBAcGFyYW0ge251bWJlcn0gW2R1cmF0aW9uXVxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5pbmZvID0gZnVuY3Rpb24gaW5mbyhtZXNzYWdlLCB0eXBlLCBkdXJhdGlvbikge1xuICAgIGlmICh0eXBlID09PSB2b2lkIDApIHtcbiAgICAgIHR5cGUgPSAnaW5mbyc7XG4gICAgfVxuXG4gICAgaWYgKGR1cmF0aW9uID09PSB2b2lkIDApIHtcbiAgICAgIGR1cmF0aW9uID0gMzAwMDtcbiAgICB9XG5cbiAgICB2YXIgaXNDb21wbGV4TWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09PSAnb2JqZWN0JztcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGluZm86IHtcbiAgICAgICAgaXNIaWRkZW46IGZhbHNlLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBtZXNzYWdlOiBpc0NvbXBsZXhNZXNzYWdlID8gbWVzc2FnZS5tZXNzYWdlIDogbWVzc2FnZSxcbiAgICAgICAgZGV0YWlsczogaXNDb21wbGV4TWVzc2FnZSA/IG1lc3NhZ2UuZGV0YWlscyA6IG51bGxcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVtaXQoJ2luZm8tdmlzaWJsZScpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmluZm9UaW1lb3V0SUQpO1xuXG4gICAgaWYgKGR1cmF0aW9uID09PSAwKSB7XG4gICAgICB0aGlzLmluZm9UaW1lb3V0SUQgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBoaWRlIHRoZSBpbmZvcm1lciBhZnRlciBgZHVyYXRpb25gIG1pbGxpc2Vjb25kc1xuXG5cbiAgICB0aGlzLmluZm9UaW1lb3V0SUQgPSBzZXRUaW1lb3V0KHRoaXMuaGlkZUluZm8sIGR1cmF0aW9uKTtcbiAgfTtcblxuICBfcHJvdG8uaGlkZUluZm8gPSBmdW5jdGlvbiBoaWRlSW5mbygpIHtcbiAgICB2YXIgbmV3SW5mbyA9IF9leHRlbmRzKHt9LCB0aGlzLmdldFN0YXRlKCkuaW5mbywge1xuICAgICAgaXNIaWRkZW46IHRydWVcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5mbzogbmV3SW5mb1xuICAgIH0pO1xuICAgIHRoaXMuZW1pdCgnaW5mby1oaWRkZW4nKTtcbiAgfVxuICAvKipcbiAgICogUGFzc2VzIG1lc3NhZ2VzIHRvIGEgZnVuY3Rpb24sIHByb3ZpZGVkIGluIGBvcHRzLmxvZ2dlcmAuXG4gICAqIElmIGBvcHRzLmxvZ2dlcjogVXBweS5kZWJ1Z0xvZ2dlcmAgb3IgYG9wdHMuZGVidWc6IHRydWVgLCBsb2dzIHRvIHRoZSBicm93c2VyIGNvbnNvbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gbWVzc2FnZSB0byBsb2dcbiAgICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXSBvcHRpb25hbCBgZXJyb3JgIG9yIGB3YXJuaW5nYFxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5sb2cgPSBmdW5jdGlvbiBsb2cobWVzc2FnZSwgdHlwZSkge1xuICAgIHZhciBsb2dnZXIgPSB0aGlzLm9wdHMubG9nZ2VyO1xuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIGxvZ2dlci5lcnJvcihtZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3dhcm5pbmcnOlxuICAgICAgICBsb2dnZXIud2FybihtZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhtZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBPYnNvbGV0ZSwgZXZlbnQgbGlzdGVuZXJzIGFyZSBub3cgYWRkZWQgaW4gdGhlIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5ydW4gPSBmdW5jdGlvbiBydW4oKSB7XG4gICAgdGhpcy5sb2coJ0NhbGxpbmcgcnVuKCkgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeS4nLCAnd2FybmluZycpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBSZXN0b3JlIGFuIHVwbG9hZCBieSBpdHMgSUQuXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLnJlc3RvcmUgPSBmdW5jdGlvbiByZXN0b3JlKHVwbG9hZElEKSB7XG4gICAgdGhpcy5sb2coXCJDb3JlOiBhdHRlbXB0aW5nIHRvIHJlc3RvcmUgdXBsb2FkIFxcXCJcIiArIHVwbG9hZElEICsgXCJcXFwiXCIpO1xuXG4gICAgaWYgKCF0aGlzLmdldFN0YXRlKCkuY3VycmVudFVwbG9hZHNbdXBsb2FkSURdKSB7XG4gICAgICB0aGlzLl9yZW1vdmVVcGxvYWQodXBsb2FkSUQpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb25leGlzdGVudCB1cGxvYWQnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3J1blVwbG9hZCh1cGxvYWRJRCk7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB1cGxvYWQgZm9yIGEgYnVuY2ggb2YgZmlsZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZmlsZUlEcyBGaWxlIElEcyB0byBpbmNsdWRlIGluIHRoaXMgdXBsb2FkLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBJRCBvZiB0aGlzIHVwbG9hZC5cbiAgICovXG4gIDtcblxuICBfcHJvdG8uX2NyZWF0ZVVwbG9hZCA9IGZ1bmN0aW9uIF9jcmVhdGVVcGxvYWQoZmlsZUlEcywgb3B0cykge1xuICAgIHZhciBfZXh0ZW5kczQ7XG5cbiAgICBpZiAob3B0cyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRzID0ge307XG4gICAgfVxuXG4gICAgdmFyIF9vcHRzID0gb3B0cyxcbiAgICAgICAgX29wdHMkZm9yY2VBbGxvd05ld1VwID0gX29wdHMuZm9yY2VBbGxvd05ld1VwbG9hZCxcbiAgICAgICAgZm9yY2VBbGxvd05ld1VwbG9hZCA9IF9vcHRzJGZvcmNlQWxsb3dOZXdVcCA9PT0gdm9pZCAwID8gZmFsc2UgOiBfb3B0cyRmb3JjZUFsbG93TmV3VXA7XG5cbiAgICB2YXIgX3RoaXMkZ2V0U3RhdGU2ID0gdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICBhbGxvd05ld1VwbG9hZCA9IF90aGlzJGdldFN0YXRlNi5hbGxvd05ld1VwbG9hZCxcbiAgICAgICAgY3VycmVudFVwbG9hZHMgPSBfdGhpcyRnZXRTdGF0ZTYuY3VycmVudFVwbG9hZHM7XG5cbiAgICBpZiAoIWFsbG93TmV3VXBsb2FkICYmICFmb3JjZUFsbG93TmV3VXBsb2FkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgYSBuZXcgdXBsb2FkOiBhbHJlYWR5IHVwbG9hZGluZy4nKTtcbiAgICB9XG5cbiAgICB2YXIgdXBsb2FkSUQgPSBjdWlkKCk7XG4gICAgdGhpcy5lbWl0KCd1cGxvYWQnLCB7XG4gICAgICBpZDogdXBsb2FkSUQsXG4gICAgICBmaWxlSURzOiBmaWxlSURzXG4gICAgfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhbGxvd05ld1VwbG9hZDogdGhpcy5vcHRzLmFsbG93TXVsdGlwbGVVcGxvYWRzICE9PSBmYWxzZSxcbiAgICAgIGN1cnJlbnRVcGxvYWRzOiBfZXh0ZW5kcyh7fSwgY3VycmVudFVwbG9hZHMsIChfZXh0ZW5kczQgPSB7fSwgX2V4dGVuZHM0W3VwbG9hZElEXSA9IHtcbiAgICAgICAgZmlsZUlEczogZmlsZUlEcyxcbiAgICAgICAgc3RlcDogMCxcbiAgICAgICAgcmVzdWx0OiB7fVxuICAgICAgfSwgX2V4dGVuZHM0KSlcbiAgICB9KTtcbiAgICByZXR1cm4gdXBsb2FkSUQ7XG4gIH07XG5cbiAgX3Byb3RvLl9nZXRVcGxvYWQgPSBmdW5jdGlvbiBfZ2V0VXBsb2FkKHVwbG9hZElEKSB7XG4gICAgdmFyIF90aGlzJGdldFN0YXRlNyA9IHRoaXMuZ2V0U3RhdGUoKSxcbiAgICAgICAgY3VycmVudFVwbG9hZHMgPSBfdGhpcyRnZXRTdGF0ZTcuY3VycmVudFVwbG9hZHM7XG5cbiAgICByZXR1cm4gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgZGF0YSB0byBhbiB1cGxvYWQncyByZXN1bHQgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXBsb2FkSUQgVGhlIElEIG9mIHRoZSB1cGxvYWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIERhdGEgcHJvcGVydGllcyB0byBhZGQgdG8gdGhlIHJlc3VsdCBvYmplY3QuXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLmFkZFJlc3VsdERhdGEgPSBmdW5jdGlvbiBhZGRSZXN1bHREYXRhKHVwbG9hZElELCBkYXRhKSB7XG4gICAgdmFyIF9leHRlbmRzNTtcblxuICAgIGlmICghdGhpcy5fZ2V0VXBsb2FkKHVwbG9hZElEKSkge1xuICAgICAgdGhpcy5sb2coXCJOb3Qgc2V0dGluZyByZXN1bHQgZm9yIGFuIHVwbG9hZCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6IFwiICsgdXBsb2FkSUQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50VXBsb2FkcyA9IHRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2FkcztcblxuICAgIHZhciBjdXJyZW50VXBsb2FkID0gX2V4dGVuZHMoe30sIGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXSwge1xuICAgICAgcmVzdWx0OiBfZXh0ZW5kcyh7fSwgY3VycmVudFVwbG9hZHNbdXBsb2FkSURdLnJlc3VsdCwgZGF0YSlcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFVwbG9hZHM6IF9leHRlbmRzKHt9LCBjdXJyZW50VXBsb2FkcywgKF9leHRlbmRzNSA9IHt9LCBfZXh0ZW5kczVbdXBsb2FkSURdID0gY3VycmVudFVwbG9hZCwgX2V4dGVuZHM1KSlcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogUmVtb3ZlIGFuIHVwbG9hZCwgZWcuIGlmIGl0IGhhcyBiZWVuIGNhbmNlbGVkIG9yIGNvbXBsZXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElEIFRoZSBJRCBvZiB0aGUgdXBsb2FkLlxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5fcmVtb3ZlVXBsb2FkID0gZnVuY3Rpb24gX3JlbW92ZVVwbG9hZCh1cGxvYWRJRCkge1xuICAgIHZhciBjdXJyZW50VXBsb2FkcyA9IF9leHRlbmRzKHt9LCB0aGlzLmdldFN0YXRlKCkuY3VycmVudFVwbG9hZHMpO1xuXG4gICAgZGVsZXRlIGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRVcGxvYWRzOiBjdXJyZW50VXBsb2Fkc1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBSdW4gYW4gdXBsb2FkLiBUaGlzIHBpY2tzIHVwIHdoZXJlIGl0IGxlZnQgb2ZmIGluIGNhc2UgdGhlIHVwbG9hZCBpcyBiZWluZyByZXN0b3JlZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIDtcblxuICBfcHJvdG8uX3J1blVwbG9hZCA9IGZ1bmN0aW9uIF9ydW5VcGxvYWQodXBsb2FkSUQpIHtcbiAgICB2YXIgX3RoaXM5ID0gdGhpcztcblxuICAgIHZhciB1cGxvYWREYXRhID0gdGhpcy5nZXRTdGF0ZSgpLmN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXTtcbiAgICB2YXIgcmVzdG9yZVN0ZXAgPSB1cGxvYWREYXRhLnN0ZXA7XG4gICAgdmFyIHN0ZXBzID0gW10uY29uY2F0KHRoaXMucHJlUHJvY2Vzc29ycywgdGhpcy51cGxvYWRlcnMsIHRoaXMucG9zdFByb2Nlc3NvcnMpO1xuICAgIHZhciBsYXN0U3RlcCA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHN0ZXBzLmZvckVhY2goZnVuY3Rpb24gKGZuLCBzdGVwKSB7XG4gICAgICAvLyBTa2lwIHRoaXMgc3RlcCBpZiB3ZSBhcmUgcmVzdG9yaW5nIGFuZCBoYXZlIGFscmVhZHkgY29tcGxldGVkIHRoaXMgc3RlcCBiZWZvcmUuXG4gICAgICBpZiAoc3RlcCA8IHJlc3RvcmVTdGVwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGFzdFN0ZXAgPSBsYXN0U3RlcC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9leHRlbmRzNjtcblxuICAgICAgICB2YXIgX3RoaXM5JGdldFN0YXRlID0gX3RoaXM5LmdldFN0YXRlKCksXG4gICAgICAgICAgICBjdXJyZW50VXBsb2FkcyA9IF90aGlzOSRnZXRTdGF0ZS5jdXJyZW50VXBsb2FkcztcblxuICAgICAgICB2YXIgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXTtcblxuICAgICAgICBpZiAoIWN1cnJlbnRVcGxvYWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdXBkYXRlZFVwbG9hZCA9IF9leHRlbmRzKHt9LCBjdXJyZW50VXBsb2FkLCB7XG4gICAgICAgICAgc3RlcDogc3RlcFxuICAgICAgICB9KTtcblxuICAgICAgICBfdGhpczkuc2V0U3RhdGUoe1xuICAgICAgICAgIGN1cnJlbnRVcGxvYWRzOiBfZXh0ZW5kcyh7fSwgY3VycmVudFVwbG9hZHMsIChfZXh0ZW5kczYgPSB7fSwgX2V4dGVuZHM2W3VwbG9hZElEXSA9IHVwZGF0ZWRVcGxvYWQsIF9leHRlbmRzNikpXG4gICAgICAgIH0pOyAvLyBUT0RPIGdpdmUgdGhpcyB0aGUgYHVwZGF0ZWRVcGxvYWRgIG9iamVjdCBhcyBpdHMgb25seSBwYXJhbWV0ZXIgbWF5YmU/XG4gICAgICAgIC8vIE90aGVyd2lzZSB3aGVuIG1vcmUgbWV0YWRhdGEgbWF5IGJlIGFkZGVkIHRvIHRoZSB1cGxvYWQgdGhpcyB3b3VsZCBrZWVwIGdldHRpbmcgbW9yZSBwYXJhbWV0ZXJzXG5cblxuICAgICAgICByZXR1cm4gZm4odXBkYXRlZFVwbG9hZC5maWxlSURzLCB1cGxvYWRJRCk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KTtcbiAgICB9KTsgLy8gTm90IHJldHVybmluZyB0aGUgYGNhdGNoYGVkIHByb21pc2UsIGJlY2F1c2Ugd2Ugc3RpbGwgd2FudCB0byByZXR1cm4gYSByZWplY3RlZFxuICAgIC8vIHByb21pc2UgZnJvbSB0aGlzIG1ldGhvZCBpZiB0aGUgdXBsb2FkIGZhaWxlZC5cblxuICAgIGxhc3RTdGVwLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIF90aGlzOS5lbWl0KCdlcnJvcicsIGVyciwgdXBsb2FkSUQpO1xuXG4gICAgICBfdGhpczkuX3JlbW92ZVVwbG9hZCh1cGxvYWRJRCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxhc3RTdGVwLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gU2V0IHJlc3VsdCBkYXRhLlxuICAgICAgdmFyIF90aGlzOSRnZXRTdGF0ZTIgPSBfdGhpczkuZ2V0U3RhdGUoKSxcbiAgICAgICAgICBjdXJyZW50VXBsb2FkcyA9IF90aGlzOSRnZXRTdGF0ZTIuY3VycmVudFVwbG9hZHM7XG5cbiAgICAgIHZhciBjdXJyZW50VXBsb2FkID0gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdO1xuXG4gICAgICBpZiAoIWN1cnJlbnRVcGxvYWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmlsZXMgPSBjdXJyZW50VXBsb2FkLmZpbGVJRHMubWFwKGZ1bmN0aW9uIChmaWxlSUQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzOS5nZXRGaWxlKGZpbGVJRCk7XG4gICAgICB9KTtcbiAgICAgIHZhciBzdWNjZXNzZnVsID0gZmlsZXMuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiAhZmlsZS5lcnJvcjtcbiAgICAgIH0pO1xuICAgICAgdmFyIGZhaWxlZCA9IGZpbGVzLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gZmlsZS5lcnJvcjtcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpczkuYWRkUmVzdWx0RGF0YSh1cGxvYWRJRCwge1xuICAgICAgICBzdWNjZXNzZnVsOiBzdWNjZXNzZnVsLFxuICAgICAgICBmYWlsZWQ6IGZhaWxlZCxcbiAgICAgICAgdXBsb2FkSUQ6IHVwbG9hZElEXG4gICAgICB9KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIEVtaXQgY29tcGxldGlvbiBldmVudHMuXG4gICAgICAvLyBUaGlzIGlzIGluIGEgc2VwYXJhdGUgZnVuY3Rpb24gc28gdGhhdCB0aGUgYGN1cnJlbnRVcGxvYWRzYCB2YXJpYWJsZVxuICAgICAgLy8gYWx3YXlzIHJlZmVycyB0byB0aGUgbGF0ZXN0IHN0YXRlLiBJbiB0aGUgaGFuZGxlciByaWdodCBhYm92ZSBpdCByZWZlcnNcbiAgICAgIC8vIHRvIGFuIG91dGRhdGVkIG9iamVjdCB3aXRob3V0IHRoZSBgLnJlc3VsdGAgcHJvcGVydHkuXG4gICAgICB2YXIgX3RoaXM5JGdldFN0YXRlMyA9IF90aGlzOS5nZXRTdGF0ZSgpLFxuICAgICAgICAgIGN1cnJlbnRVcGxvYWRzID0gX3RoaXM5JGdldFN0YXRlMy5jdXJyZW50VXBsb2FkcztcblxuICAgICAgaWYgKCFjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXTtcbiAgICAgIHZhciByZXN1bHQgPSBjdXJyZW50VXBsb2FkLnJlc3VsdDtcblxuICAgICAgX3RoaXM5LmVtaXQoJ2NvbXBsZXRlJywgcmVzdWx0KTtcblxuICAgICAgX3RoaXM5Ll9yZW1vdmVVcGxvYWQodXBsb2FkSUQpO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgIF90aGlzOS5sb2coXCJOb3Qgc2V0dGluZyByZXN1bHQgZm9yIGFuIHVwbG9hZCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6IFwiICsgdXBsb2FkSUQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBTdGFydCBhbiB1cGxvYWQgZm9yIGFsbCB0aGUgZmlsZXMgdGhhdCBhcmUgbm90IGN1cnJlbnRseSBiZWluZyB1cGxvYWRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLnVwbG9hZCA9IGZ1bmN0aW9uIHVwbG9hZCgpIHtcbiAgICB2YXIgX3RoaXMxMCA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMucGx1Z2lucy51cGxvYWRlcikge1xuICAgICAgdGhpcy5sb2coJ05vIHVwbG9hZGVyIHR5cGUgcGx1Z2lucyBhcmUgdXNlZCcsICd3YXJuaW5nJyk7XG4gICAgfVxuXG4gICAgdmFyIGZpbGVzID0gdGhpcy5nZXRTdGF0ZSgpLmZpbGVzO1xuICAgIHZhciBvbkJlZm9yZVVwbG9hZFJlc3VsdCA9IHRoaXMub3B0cy5vbkJlZm9yZVVwbG9hZChmaWxlcyk7XG5cbiAgICBpZiAob25CZWZvcmVVcGxvYWRSZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb3Qgc3RhcnRpbmcgdGhlIHVwbG9hZCBiZWNhdXNlIG9uQmVmb3JlVXBsb2FkIHJldHVybmVkIGZhbHNlJykpO1xuICAgIH1cblxuICAgIGlmIChvbkJlZm9yZVVwbG9hZFJlc3VsdCAmJiB0eXBlb2Ygb25CZWZvcmVVcGxvYWRSZXN1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBmaWxlcyA9IG9uQmVmb3JlVXBsb2FkUmVzdWx0OyAvLyBVcGRhdGluZyBmaWxlcyBpbiBzdGF0ZSwgYmVjYXVzZSB1cGxvYWRlciBwbHVnaW5zIHJlY2VpdmUgZmlsZSBJRHMsXG4gICAgICAvLyBhbmQgdGhlbiBmZXRjaCB0aGUgYWN0dWFsIGZpbGUgb2JqZWN0IGZyb20gc3RhdGVcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZpbGVzOiBmaWxlc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzMTAuX2NoZWNrTWluTnVtYmVyT2ZGaWxlcyhmaWxlcyk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgX3RoaXMxMC5fc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF90aGlzMTAkZ2V0U3RhdGUgPSBfdGhpczEwLmdldFN0YXRlKCksXG4gICAgICAgICAgY3VycmVudFVwbG9hZHMgPSBfdGhpczEwJGdldFN0YXRlLmN1cnJlbnRVcGxvYWRzOyAvLyBnZXQgYSBsaXN0IG9mIGZpbGVzIHRoYXQgYXJlIGN1cnJlbnRseSBhc3NpZ25lZCB0byB1cGxvYWRzXG5cblxuICAgICAgdmFyIGN1cnJlbnRseVVwbG9hZGluZ0ZpbGVzID0gT2JqZWN0LmtleXMoY3VycmVudFVwbG9hZHMpLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3Vycikge1xuICAgICAgICByZXR1cm4gcHJldi5jb25jYXQoY3VycmVudFVwbG9hZHNbY3Vycl0uZmlsZUlEcyk7XG4gICAgICB9LCBbXSk7XG4gICAgICB2YXIgd2FpdGluZ0ZpbGVJRHMgPSBbXTtcbiAgICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlSUQpIHtcbiAgICAgICAgdmFyIGZpbGUgPSBfdGhpczEwLmdldEZpbGUoZmlsZUlEKTsgLy8gaWYgdGhlIGZpbGUgaGFzbid0IHN0YXJ0ZWQgdXBsb2FkaW5nIGFuZCBoYXNuJ3QgYWxyZWFkeSBiZWVuIGFzc2lnbmVkIHRvIGFuIHVwbG9hZC4uXG5cblxuICAgICAgICBpZiAoIWZpbGUucHJvZ3Jlc3MudXBsb2FkU3RhcnRlZCAmJiBjdXJyZW50bHlVcGxvYWRpbmdGaWxlcy5pbmRleE9mKGZpbGVJRCkgPT09IC0xKSB7XG4gICAgICAgICAgd2FpdGluZ0ZpbGVJRHMucHVzaChmaWxlLmlkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciB1cGxvYWRJRCA9IF90aGlzMTAuX2NyZWF0ZVVwbG9hZCh3YWl0aW5nRmlsZUlEcyk7XG5cbiAgICAgIHJldHVybiBfdGhpczEwLl9ydW5VcGxvYWQodXBsb2FkSUQpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIF90aGlzMTAuX3Nob3dPckxvZ0Vycm9yQW5kVGhyb3coZXJyLCB7XG4gICAgICAgIHNob3dJbmZvcm1lcjogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIF9jcmVhdGVDbGFzcyhVcHB5LCBbe1xuICAgIGtleTogXCJzdGF0ZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVXBweTtcbn0oKTtcblxuVXBweS5WRVJTSU9OID0gXCIxLjE1LjBcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0cykge1xuICByZXR1cm4gbmV3IFVwcHkob3B0cyk7XG59OyAvLyBFeHBvc2UgY2xhc3MgY29uc3RydWN0b3IuXG5cblxubW9kdWxlLmV4cG9ydHMuVXBweSA9IFVwcHk7XG5tb2R1bGUuZXhwb3J0cy5QbHVnaW4gPSBQbHVnaW47XG5tb2R1bGUuZXhwb3J0cy5kZWJ1Z0xvZ2dlciA9IGRlYnVnTG9nZ2VyOyIsInZhciBnZXRUaW1lU3RhbXAgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0VGltZVN0YW1wJyk7IC8vIFN3YWxsb3cgYWxsIGxvZ3MsIGV4Y2VwdCBlcnJvcnMuXG4vLyBkZWZhdWx0IGlmIGxvZ2dlciBpcyBub3Qgc2V0IG9yIGRlYnVnOiBmYWxzZVxuXG5cbnZhciBqdXN0RXJyb3JzTG9nZ2VyID0ge1xuICBkZWJ1ZzogZnVuY3Rpb24gZGVidWcoKSB7fSxcbiAgd2FybjogZnVuY3Rpb24gd2FybigpIHt9LFxuICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgdmFyIF9jb25zb2xlO1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHJldHVybiAoX2NvbnNvbGUgPSBjb25zb2xlKS5lcnJvci5hcHBseShfY29uc29sZSwgW1wiW1VwcHldIFtcIiArIGdldFRpbWVTdGFtcCgpICsgXCJdXCJdLmNvbmNhdChhcmdzKSk7XG4gIH1cbn07IC8vIFByaW50IGxvZ3MgdG8gY29uc29sZSB3aXRoIG5hbWVzcGFjZSArIHRpbWVzdGFtcCxcbi8vIHNldCBieSBsb2dnZXI6IFVwcHkuZGVidWdMb2dnZXIgb3IgZGVidWc6IHRydWVcblxudmFyIGRlYnVnTG9nZ2VyID0ge1xuICBkZWJ1ZzogZnVuY3Rpb24gZGVidWcoKSB7XG4gICAgLy8gSUUgMTAgZG9lc27igJl0IHN1cHBvcnQgY29uc29sZS5kZWJ1Z1xuICAgIHZhciBkZWJ1ZyA9IGNvbnNvbGUuZGVidWcgfHwgY29uc29sZS5sb2c7XG5cbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgIGFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG5cbiAgICBkZWJ1Zy5jYWxsLmFwcGx5KGRlYnVnLCBbY29uc29sZSwgXCJbVXBweV0gW1wiICsgZ2V0VGltZVN0YW1wKCkgKyBcIl1cIl0uY29uY2F0KGFyZ3MpKTtcbiAgfSxcbiAgd2FybjogZnVuY3Rpb24gd2FybigpIHtcbiAgICB2YXIgX2NvbnNvbGUyO1xuXG4gICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICBhcmdzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgfVxuXG4gICAgcmV0dXJuIChfY29uc29sZTIgPSBjb25zb2xlKS53YXJuLmFwcGx5KF9jb25zb2xlMiwgW1wiW1VwcHldIFtcIiArIGdldFRpbWVTdGFtcCgpICsgXCJdXCJdLmNvbmNhdChhcmdzKSk7XG4gIH0sXG4gIGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICB2YXIgX2NvbnNvbGUzO1xuXG4gICAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW40KSwgX2tleTQgPSAwOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgICBhcmdzW19rZXk0XSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gICAgfVxuXG4gICAgcmV0dXJuIChfY29uc29sZTMgPSBjb25zb2xlKS5lcnJvci5hcHBseShfY29uc29sZTMsIFtcIltVcHB5XSBbXCIgKyBnZXRUaW1lU3RhbXAoKSArIFwiXVwiXS5jb25jYXQoYXJncykpO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGp1c3RFcnJvcnNMb2dnZXI6IGp1c3RFcnJvcnNMb2dnZXIsXG4gIGRlYnVnTG9nZ2VyOiBkZWJ1Z0xvZ2dlclxufTsiLCIvLyBFZGdlIDE1LnggZG9lcyBub3QgZmlyZSAncHJvZ3Jlc3MnIGV2ZW50cyBvbiB1cGxvYWRzLlxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5L2lzc3Vlcy85NDVcbi8vIEFuZCBodHRwczovL2RldmVsb3Blci5taWNyb3NvZnQuY29tL2VuLXVzL21pY3Jvc29mdC1lZGdlL3BsYXRmb3JtL2lzc3Vlcy8xMjIyNDUxMC9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyh1c2VyQWdlbnQpIHtcbiAgLy8gQWxsb3cgcGFzc2luZyBpbiB1c2VyQWdlbnQgZm9yIHRlc3RzXG4gIGlmICh1c2VyQWdlbnQgPT0gbnVsbCkge1xuICAgIHVzZXJBZ2VudCA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnID8gbmF2aWdhdG9yLnVzZXJBZ2VudCA6IG51bGw7XG4gIH0gLy8gQXNzdW1lIGl0IHdvcmtzIGJlY2F1c2UgYmFzaWNhbGx5IGV2ZXJ5dGhpbmcgc3VwcG9ydHMgcHJvZ3Jlc3MgZXZlbnRzLlxuXG5cbiAgaWYgKCF1c2VyQWdlbnQpIHJldHVybiB0cnVlO1xuICB2YXIgbSA9IC9FZGdlXFwvKFxcZCtcXC5cXGQrKS8uZXhlYyh1c2VyQWdlbnQpO1xuICBpZiAoIW0pIHJldHVybiB0cnVlO1xuICB2YXIgZWRnZVZlcnNpb24gPSBtWzFdO1xuXG4gIHZhciBfZWRnZVZlcnNpb24kc3BsaXQgPSBlZGdlVmVyc2lvbi5zcGxpdCgnLicpLFxuICAgICAgbWFqb3IgPSBfZWRnZVZlcnNpb24kc3BsaXRbMF0sXG4gICAgICBtaW5vciA9IF9lZGdlVmVyc2lvbiRzcGxpdFsxXTtcblxuICBtYWpvciA9IHBhcnNlSW50KG1ham9yLCAxMCk7XG4gIG1pbm9yID0gcGFyc2VJbnQobWlub3IsIDEwKTsgLy8gV29ya2VkIGJlZm9yZTpcbiAgLy8gRWRnZSA0MC4xNTA2My4wLjBcbiAgLy8gTWljcm9zb2Z0IEVkZ2VIVE1MIDE1LjE1MDYzXG5cbiAgaWYgKG1ham9yIDwgMTUgfHwgbWFqb3IgPT09IDE1ICYmIG1pbm9yIDwgMTUwNjMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyBGaXhlZCBpbjpcbiAgLy8gTWljcm9zb2Z0IEVkZ2VIVE1MIDE4LjE4MjE4XG5cblxuICBpZiAobWFqb3IgPiAxOCB8fCBtYWpvciA9PT0gMTggJiYgbWlub3IgPj0gMTgyMTgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyBvdGhlciB2ZXJzaW9ucyBkb24ndCB3b3JrLlxuXG5cbiAgcmV0dXJuIGZhbHNlO1xufTsiLCJ2YXIgX2NsYXNzLCBfdGVtcDtcblxuZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdAdXBweS9jb3JlJyksXG4gICAgUGx1Z2luID0gX3JlcXVpcmUuUGx1Z2luO1xuXG52YXIgdG9BcnJheSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi90b0FycmF5Jyk7XG5cbnZhciBUcmFuc2xhdG9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL1RyYW5zbGF0b3InKTtcblxudmFyIF9yZXF1aXJlMiA9IHJlcXVpcmUoJ3ByZWFjdCcpLFxuICAgIGggPSBfcmVxdWlyZTIuaDtcblxubW9kdWxlLmV4cG9ydHMgPSAoX3RlbXAgPSBfY2xhc3MgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9QbHVnaW4pIHtcbiAgX2luaGVyaXRzTG9vc2UoRmlsZUlucHV0LCBfUGx1Z2luKTtcblxuICBmdW5jdGlvbiBGaWxlSW5wdXQodXBweSwgb3B0cykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX1BsdWdpbi5jYWxsKHRoaXMsIHVwcHksIG9wdHMpIHx8IHRoaXM7XG4gICAgX3RoaXMuaWQgPSBfdGhpcy5vcHRzLmlkIHx8ICdGaWxlSW5wdXQnO1xuICAgIF90aGlzLnRpdGxlID0gJ0ZpbGUgSW5wdXQnO1xuICAgIF90aGlzLnR5cGUgPSAnYWNxdWlyZXInO1xuICAgIF90aGlzLmRlZmF1bHRMb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7XG4gICAgICAgIC8vIFRoZSBzYW1lIGtleSBpcyB1c2VkIGZvciB0aGUgc2FtZSBwdXJwb3NlIGJ5IEB1cHB5L3JvYm9kb2cncyBgZm9ybSgpYCBBUEksIGJ1dCBvdXJcbiAgICAgICAgLy8gbG9jYWxlIHBhY2sgc2NyaXB0cyBjYW4ndCBhY2Nlc3MgaXQgaW4gUm9ib2RvZy4gSWYgaXQgaXMgdXBkYXRlZCBoZXJlLCBpdCBzaG91bGRcbiAgICAgICAgLy8gYWxzbyBiZSB1cGRhdGVkIHRoZXJlIVxuICAgICAgICBjaG9vc2VGaWxlczogJ0Nob29zZSBmaWxlcydcbiAgICAgIH1cbiAgICB9OyAvLyBEZWZhdWx0IG9wdGlvbnNcblxuICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIHRhcmdldDogbnVsbCxcbiAgICAgIHByZXR0eTogdHJ1ZSxcbiAgICAgIGlucHV0TmFtZTogJ2ZpbGVzW10nXG4gICAgfTsgLy8gTWVyZ2UgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIG9uZXMgc2V0IGJ5IHVzZXJcblxuICAgIF90aGlzLm9wdHMgPSBfZXh0ZW5kcyh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdHMpO1xuXG4gICAgX3RoaXMuaTE4bkluaXQoKTtcblxuICAgIF90aGlzLnJlbmRlciA9IF90aGlzLnJlbmRlci5iaW5kKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKTtcbiAgICBfdGhpcy5oYW5kbGVJbnB1dENoYW5nZSA9IF90aGlzLmhhbmRsZUlucHV0Q2hhbmdlLmJpbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpO1xuICAgIF90aGlzLmhhbmRsZUNsaWNrID0gX3RoaXMuaGFuZGxlQ2xpY2suYmluZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IEZpbGVJbnB1dC5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLnNldE9wdGlvbnMgPSBmdW5jdGlvbiBzZXRPcHRpb25zKG5ld09wdHMpIHtcbiAgICBfUGx1Z2luLnByb3RvdHlwZS5zZXRPcHRpb25zLmNhbGwodGhpcywgbmV3T3B0cyk7XG5cbiAgICB0aGlzLmkxOG5Jbml0KCk7XG4gIH07XG5cbiAgX3Byb3RvLmkxOG5Jbml0ID0gZnVuY3Rpb24gaTE4bkluaXQoKSB7XG4gICAgdGhpcy50cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3IoW3RoaXMuZGVmYXVsdExvY2FsZSwgdGhpcy51cHB5LmxvY2FsZSwgdGhpcy5vcHRzLmxvY2FsZV0pO1xuICAgIHRoaXMuaTE4biA9IHRoaXMudHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0aGlzLnRyYW5zbGF0b3IpO1xuICAgIHRoaXMuaTE4bkFycmF5ID0gdGhpcy50cmFuc2xhdG9yLnRyYW5zbGF0ZUFycmF5LmJpbmQodGhpcy50cmFuc2xhdG9yKTtcbiAgICB0aGlzLnNldFBsdWdpblN0YXRlKCk7IC8vIHNvIHRoYXQgVUkgcmUtcmVuZGVycyBhbmQgd2Ugc2VlIHRoZSB1cGRhdGVkIGxvY2FsZVxuICB9O1xuXG4gIF9wcm90by5hZGRGaWxlcyA9IGZ1bmN0aW9uIGFkZEZpbGVzKGZpbGVzKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgZGVzY3JpcHRvcnMgPSBmaWxlcy5tYXAoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNvdXJjZTogX3RoaXMyLmlkLFxuICAgICAgICBuYW1lOiBmaWxlLm5hbWUsXG4gICAgICAgIHR5cGU6IGZpbGUudHlwZSxcbiAgICAgICAgZGF0YTogZmlsZVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnVwcHkuYWRkRmlsZXMoZGVzY3JpcHRvcnMpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy51cHB5LmxvZyhlcnIpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uaGFuZGxlSW5wdXRDaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVJbnB1dENoYW5nZShldmVudCkge1xuICAgIHRoaXMudXBweS5sb2coJ1tGaWxlSW5wdXRdIFNvbWV0aGluZyBzZWxlY3RlZCB0aHJvdWdoIGlucHV0Li4uJyk7XG4gICAgdmFyIGZpbGVzID0gdG9BcnJheShldmVudC50YXJnZXQuZmlsZXMpO1xuICAgIHRoaXMuYWRkRmlsZXMoZmlsZXMpOyAvLyBXZSBjbGVhciB0aGUgaW5wdXQgYWZ0ZXIgYSBmaWxlIGlzIHNlbGVjdGVkLCBiZWNhdXNlIG90aGVyd2lzZVxuICAgIC8vIGNoYW5nZSBldmVudCBpcyBub3QgZmlyZWQgaW4gQ2hyb21lIGFuZCBTYWZhcmkgd2hlbiBhIGZpbGVcbiAgICAvLyB3aXRoIHRoZSBzYW1lIG5hbWUgaXMgc2VsZWN0ZWQuXG4gICAgLy8gX19fV2h5IG5vdCB1c2UgdmFsdWU9XCJcIiBvbiA8aW5wdXQvPiBpbnN0ZWFkP1xuICAgIC8vICAgIEJlY2F1c2UgaWYgd2UgdXNlIHRoYXQgbWV0aG9kIG9mIGNsZWFyaW5nIHRoZSBpbnB1dCxcbiAgICAvLyAgICBDaHJvbWUgd2lsbCBub3QgdHJpZ2dlciBjaGFuZ2UgaWYgd2UgZHJvcCB0aGUgc2FtZSBmaWxlIHR3aWNlIChJc3N1ZSAjNzY4KS5cblxuICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IG51bGw7XG4gIH07XG5cbiAgX3Byb3RvLmhhbmRsZUNsaWNrID0gZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXYpIHtcbiAgICB0aGlzLmlucHV0LmNsaWNrKCk7XG4gIH07XG5cbiAgX3Byb3RvLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihzdGF0ZSkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgLyogaHR0cDovL3R5bXBhbnVzLm5ldC9jb2Ryb3BzLzIwMTUvMDkvMTUvc3R5bGluZy1jdXN0b21pemluZy1maWxlLWlucHV0cy1zbWFydC13YXkvICovXG4gICAgdmFyIGhpZGRlbklucHV0U3R5bGUgPSB7XG4gICAgICB3aWR0aDogJzAuMXB4JyxcbiAgICAgIGhlaWdodDogJzAuMXB4JyxcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHpJbmRleDogLTFcbiAgICB9O1xuICAgIHZhciByZXN0cmljdGlvbnMgPSB0aGlzLnVwcHkub3B0cy5yZXN0cmljdGlvbnM7XG4gICAgdmFyIGFjY2VwdCA9IHJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzID8gcmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXMuam9pbignLCcpIDogbnVsbDtcbiAgICByZXR1cm4gaChcImRpdlwiLCB7XG4gICAgICBjbGFzczogXCJ1cHB5LVJvb3QgdXBweS1GaWxlSW5wdXQtY29udGFpbmVyXCJcbiAgICB9LCBoKFwiaW5wdXRcIiwge1xuICAgICAgY2xhc3M6IFwidXBweS1GaWxlSW5wdXQtaW5wdXRcIixcbiAgICAgIHN0eWxlOiB0aGlzLm9wdHMucHJldHR5ICYmIGhpZGRlbklucHV0U3R5bGUsXG4gICAgICB0eXBlOiBcImZpbGVcIixcbiAgICAgIG5hbWU6IHRoaXMub3B0cy5pbnB1dE5hbWUsXG4gICAgICBvbmNoYW5nZTogdGhpcy5oYW5kbGVJbnB1dENoYW5nZSxcbiAgICAgIG11bHRpcGxlOiByZXN0cmljdGlvbnMubWF4TnVtYmVyT2ZGaWxlcyAhPT0gMSxcbiAgICAgIGFjY2VwdDogYWNjZXB0LFxuICAgICAgcmVmOiBmdW5jdGlvbiByZWYoaW5wdXQpIHtcbiAgICAgICAgX3RoaXMzLmlucHV0ID0gaW5wdXQ7XG4gICAgICB9XG4gICAgfSksIHRoaXMub3B0cy5wcmV0dHkgJiYgaChcImJ1dHRvblwiLCB7XG4gICAgICBjbGFzczogXCJ1cHB5LUZpbGVJbnB1dC1idG5cIixcbiAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXG4gICAgICBvbmNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrXG4gICAgfSwgdGhpcy5pMThuKCdjaG9vc2VGaWxlcycpKSk7XG4gIH07XG5cbiAgX3Byb3RvLmluc3RhbGwgPSBmdW5jdGlvbiBpbnN0YWxsKCkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLm9wdHMudGFyZ2V0O1xuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdGhpcy5tb3VudCh0YXJnZXQsIHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8udW5pbnN0YWxsID0gZnVuY3Rpb24gdW5pbnN0YWxsKCkge1xuICAgIHRoaXMudW5tb3VudCgpO1xuICB9O1xuXG4gIHJldHVybiBGaWxlSW5wdXQ7XG59KFBsdWdpbiksIF9jbGFzcy5WRVJTSU9OID0gXCIxLjQuMjBcIiwgX3RlbXApOyIsInZhciBfY2xhc3MsIF90ZW1wO1xuXG5mdW5jdGlvbiBfZXh0ZW5kcygpIHsgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTsgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgnQHVwcHkvY29yZScpLFxuICAgIFBsdWdpbiA9IF9yZXF1aXJlLlBsdWdpbjtcblxudmFyIF9yZXF1aXJlMiA9IHJlcXVpcmUoJ3ByZWFjdCcpLFxuICAgIGggPSBfcmVxdWlyZTIuaDtcbi8qKlxuICogSW5mb3JtZXJcbiAqIFNob3dzIHJhZCBtZXNzYWdlIGJ1YmJsZXNcbiAqIHVzZWQgbGlrZSB0aGlzOiBgdXBweS5pbmZvKCdoZWxsbyB3b3JsZCcsICdpbmZvJywgNTAwMClgXG4gKiBvciBmb3IgZXJyb3JzOiBgdXBweS5pbmZvKCdFcnJvciB1cGxvYWRpbmcgaW1nLmpwZycsICdlcnJvcicsIDUwMDApYFxuICpcbiAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKF90ZW1wID0gX2NsYXNzID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfUGx1Z2luKSB7XG4gIF9pbmhlcml0c0xvb3NlKEluZm9ybWVyLCBfUGx1Z2luKTtcblxuICBmdW5jdGlvbiBJbmZvcm1lcih1cHB5LCBvcHRzKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX3RoaXMgPSBfUGx1Z2luLmNhbGwodGhpcywgdXBweSwgb3B0cykgfHwgdGhpcztcblxuICAgIF90aGlzLnJlbmRlciA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgdmFyIF9zdGF0ZSRpbmZvID0gc3RhdGUuaW5mbyxcbiAgICAgICAgICBpc0hpZGRlbiA9IF9zdGF0ZSRpbmZvLmlzSGlkZGVuLFxuICAgICAgICAgIG1lc3NhZ2UgPSBfc3RhdGUkaW5mby5tZXNzYWdlLFxuICAgICAgICAgIGRldGFpbHMgPSBfc3RhdGUkaW5mby5kZXRhaWxzO1xuXG4gICAgICBmdW5jdGlvbiBkaXNwbGF5RXJyb3JBbGVydCgpIHtcbiAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IG1lc3NhZ2UgKyBcIiBcXG5cXG4gXCIgKyBkZXRhaWxzO1xuICAgICAgICBhbGVydChlcnJvck1lc3NhZ2UpO1xuICAgICAgfVxuXG4gICAgICB2YXIgaGFuZGxlTW91c2VPdmVyID0gZnVuY3Rpb24gaGFuZGxlTW91c2VPdmVyKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoX3RoaXMudXBweS5pbmZvVGltZW91dElEKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBoYW5kbGVNb3VzZUxlYXZlID0gZnVuY3Rpb24gaGFuZGxlTW91c2VMZWF2ZSgpIHtcbiAgICAgICAgX3RoaXMudXBweS5pbmZvVGltZW91dElEID0gc2V0VGltZW91dChfdGhpcy51cHB5LmhpZGVJbmZvLCAyMDAwKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBoKFwiZGl2XCIsIHtcbiAgICAgICAgY2xhc3M6IFwidXBweSB1cHB5LUluZm9ybWVyXCIsXG4gICAgICAgIFwiYXJpYS1oaWRkZW5cIjogaXNIaWRkZW5cbiAgICAgIH0sIGgoXCJwXCIsIHtcbiAgICAgICAgcm9sZTogXCJhbGVydFwiXG4gICAgICB9LCBtZXNzYWdlLCAnICcsIGRldGFpbHMgJiYgaChcInNwYW5cIiwge1xuICAgICAgICBcImFyaWEtbGFiZWxcIjogZGV0YWlscyxcbiAgICAgICAgXCJkYXRhLW1pY3JvdGlwLXBvc2l0aW9uXCI6IFwidG9wLWxlZnRcIixcbiAgICAgICAgXCJkYXRhLW1pY3JvdGlwLXNpemVcIjogXCJtZWRpdW1cIixcbiAgICAgICAgcm9sZTogXCJ0b29sdGlwXCIsXG4gICAgICAgIG9uY2xpY2s6IGRpc3BsYXlFcnJvckFsZXJ0LFxuICAgICAgICBvbk1vdXNlT3ZlcjogaGFuZGxlTW91c2VPdmVyLFxuICAgICAgICBvbk1vdXNlTGVhdmU6IGhhbmRsZU1vdXNlTGVhdmVcbiAgICAgIH0sIFwiP1wiKSkpO1xuICAgIH07XG5cbiAgICBfdGhpcy50eXBlID0gJ3Byb2dyZXNzaW5kaWNhdG9yJztcbiAgICBfdGhpcy5pZCA9IF90aGlzLm9wdHMuaWQgfHwgJ0luZm9ybWVyJztcbiAgICBfdGhpcy50aXRsZSA9ICdJbmZvcm1lcic7IC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcblxuICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHt9OyAvLyBtZXJnZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgb25lcyBzZXQgYnkgdXNlclxuXG4gICAgX3RoaXMub3B0cyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0cyk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IEluZm9ybWVyLnByb3RvdHlwZTtcblxuICBfcHJvdG8uaW5zdGFsbCA9IGZ1bmN0aW9uIGluc3RhbGwoKSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMub3B0cy50YXJnZXQ7XG5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICB0aGlzLm1vdW50KHRhcmdldCwgdGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBJbmZvcm1lcjtcbn0oUGx1Z2luKSwgX2NsYXNzLlZFUlNJT04gPSBcIjEuNS4xNFwiLCBfdGVtcCk7IiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxudmFyIHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJyk7XG5cbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgc3RhdHVzQmFyU3RhdGVzID0gcmVxdWlyZSgnLi9TdGF0dXNCYXJTdGF0ZXMnKTtcblxudmFyIHByZXR0aWVyQnl0ZXMgPSByZXF1aXJlKCdAdHJhbnNsb2FkaXQvcHJldHRpZXItYnl0ZXMnKTtcblxudmFyIHByZXR0eUVUQSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9wcmV0dHlFVEEnKTtcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgncHJlYWN0JyksXG4gICAgaCA9IF9yZXF1aXJlLmg7XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVByb2Nlc3NpbmdQcm9ncmVzcyhmaWxlcykge1xuICAvLyBDb2xsZWN0IHByZSBvciBwb3N0cHJvY2Vzc2luZyBwcm9ncmVzcyBzdGF0ZXMuXG4gIHZhciBwcm9ncmVzc2VzID0gW107XG4gIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlSUQpIHtcbiAgICB2YXIgcHJvZ3Jlc3MgPSBmaWxlc1tmaWxlSURdLnByb2dyZXNzO1xuXG4gICAgaWYgKHByb2dyZXNzLnByZXByb2Nlc3MpIHtcbiAgICAgIHByb2dyZXNzZXMucHVzaChwcm9ncmVzcy5wcmVwcm9jZXNzKTtcbiAgICB9XG5cbiAgICBpZiAocHJvZ3Jlc3MucG9zdHByb2Nlc3MpIHtcbiAgICAgIHByb2dyZXNzZXMucHVzaChwcm9ncmVzcy5wb3N0cHJvY2Vzcyk7XG4gICAgfVxuICB9KTsgLy8gSW4gdGhlIGZ1dHVyZSB3ZSBzaG91bGQgcHJvYmFibHkgZG8gdGhpcyBkaWZmZXJlbnRseS4gRm9yIG5vdyB3ZSdsbCB0YWtlIHRoZVxuICAvLyBtb2RlIGFuZCBtZXNzYWdlIGZyb20gdGhlIGZpcnN0IGZpbGXigKZcblxuICB2YXIgX3Byb2dyZXNzZXMkID0gcHJvZ3Jlc3Nlc1swXSxcbiAgICAgIG1vZGUgPSBfcHJvZ3Jlc3NlcyQubW9kZSxcbiAgICAgIG1lc3NhZ2UgPSBfcHJvZ3Jlc3NlcyQubWVzc2FnZTtcbiAgdmFyIHZhbHVlID0gcHJvZ3Jlc3Nlcy5maWx0ZXIoaXNEZXRlcm1pbmF0ZSkucmVkdWNlKGZ1bmN0aW9uICh0b3RhbCwgcHJvZ3Jlc3MsIGluZGV4LCBhbGwpIHtcbiAgICByZXR1cm4gdG90YWwgKyBwcm9ncmVzcy52YWx1ZSAvIGFsbC5sZW5ndGg7XG4gIH0sIDApO1xuXG4gIGZ1bmN0aW9uIGlzRGV0ZXJtaW5hdGUocHJvZ3Jlc3MpIHtcbiAgICByZXR1cm4gcHJvZ3Jlc3MubW9kZSA9PT0gJ2RldGVybWluYXRlJztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbW9kZTogbW9kZSxcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufVxuXG5mdW5jdGlvbiB0b2dnbGVQYXVzZVJlc3VtZShwcm9wcykge1xuICBpZiAocHJvcHMuaXNBbGxDb21wbGV0ZSkgcmV0dXJuO1xuXG4gIGlmICghcHJvcHMucmVzdW1hYmxlVXBsb2Fkcykge1xuICAgIHJldHVybiBwcm9wcy5jYW5jZWxBbGwoKTtcbiAgfVxuXG4gIGlmIChwcm9wcy5pc0FsbFBhdXNlZCkge1xuICAgIHJldHVybiBwcm9wcy5yZXN1bWVBbGwoKTtcbiAgfVxuXG4gIHJldHVybiBwcm9wcy5wYXVzZUFsbCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwcm9wcykge1xuICBwcm9wcyA9IHByb3BzIHx8IHt9O1xuICB2YXIgX3Byb3BzID0gcHJvcHMsXG4gICAgICBuZXdGaWxlcyA9IF9wcm9wcy5uZXdGaWxlcyxcbiAgICAgIGFsbG93TmV3VXBsb2FkID0gX3Byb3BzLmFsbG93TmV3VXBsb2FkLFxuICAgICAgaXNVcGxvYWRJblByb2dyZXNzID0gX3Byb3BzLmlzVXBsb2FkSW5Qcm9ncmVzcyxcbiAgICAgIGlzQWxsUGF1c2VkID0gX3Byb3BzLmlzQWxsUGF1c2VkLFxuICAgICAgcmVzdW1hYmxlVXBsb2FkcyA9IF9wcm9wcy5yZXN1bWFibGVVcGxvYWRzLFxuICAgICAgZXJyb3IgPSBfcHJvcHMuZXJyb3IsXG4gICAgICBoaWRlVXBsb2FkQnV0dG9uID0gX3Byb3BzLmhpZGVVcGxvYWRCdXR0b24sXG4gICAgICBoaWRlUGF1c2VSZXN1bWVCdXR0b24gPSBfcHJvcHMuaGlkZVBhdXNlUmVzdW1lQnV0dG9uLFxuICAgICAgaGlkZUNhbmNlbEJ1dHRvbiA9IF9wcm9wcy5oaWRlQ2FuY2VsQnV0dG9uLFxuICAgICAgaGlkZVJldHJ5QnV0dG9uID0gX3Byb3BzLmhpZGVSZXRyeUJ1dHRvbjtcbiAgdmFyIHVwbG9hZFN0YXRlID0gcHJvcHMudXBsb2FkU3RhdGU7XG4gIHZhciBwcm9ncmVzc1ZhbHVlID0gcHJvcHMudG90YWxQcm9ncmVzcztcbiAgdmFyIHByb2dyZXNzTW9kZTtcbiAgdmFyIHByb2dyZXNzQmFyQ29udGVudDtcblxuICBpZiAodXBsb2FkU3RhdGUgPT09IHN0YXR1c0JhclN0YXRlcy5TVEFURV9QUkVQUk9DRVNTSU5HIHx8IHVwbG9hZFN0YXRlID09PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfUE9TVFBST0NFU1NJTkcpIHtcbiAgICB2YXIgcHJvZ3Jlc3MgPSBjYWxjdWxhdGVQcm9jZXNzaW5nUHJvZ3Jlc3MocHJvcHMuZmlsZXMpO1xuICAgIHByb2dyZXNzTW9kZSA9IHByb2dyZXNzLm1vZGU7XG5cbiAgICBpZiAocHJvZ3Jlc3NNb2RlID09PSAnZGV0ZXJtaW5hdGUnKSB7XG4gICAgICBwcm9ncmVzc1ZhbHVlID0gcHJvZ3Jlc3MudmFsdWUgKiAxMDA7XG4gICAgfVxuXG4gICAgcHJvZ3Jlc3NCYXJDb250ZW50ID0gUHJvZ3Jlc3NCYXJQcm9jZXNzaW5nKHByb2dyZXNzKTtcbiAgfSBlbHNlIGlmICh1cGxvYWRTdGF0ZSA9PT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX0NPTVBMRVRFKSB7XG4gICAgcHJvZ3Jlc3NCYXJDb250ZW50ID0gUHJvZ3Jlc3NCYXJDb21wbGV0ZShwcm9wcyk7XG4gIH0gZWxzZSBpZiAodXBsb2FkU3RhdGUgPT09IHN0YXR1c0JhclN0YXRlcy5TVEFURV9VUExPQURJTkcpIHtcbiAgICBpZiAoIXByb3BzLnN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MpIHtcbiAgICAgIHByb2dyZXNzTW9kZSA9ICdpbmRldGVybWluYXRlJztcbiAgICAgIHByb2dyZXNzVmFsdWUgPSBudWxsO1xuICAgIH1cblxuICAgIHByb2dyZXNzQmFyQ29udGVudCA9IFByb2dyZXNzQmFyVXBsb2FkaW5nKHByb3BzKTtcbiAgfSBlbHNlIGlmICh1cGxvYWRTdGF0ZSA9PT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX0VSUk9SKSB7XG4gICAgcHJvZ3Jlc3NWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBwcm9ncmVzc0JhckNvbnRlbnQgPSBQcm9ncmVzc0JhckVycm9yKHByb3BzKTtcbiAgfVxuXG4gIHZhciB3aWR0aCA9IHR5cGVvZiBwcm9ncmVzc1ZhbHVlID09PSAnbnVtYmVyJyA/IHByb2dyZXNzVmFsdWUgOiAxMDA7XG4gIHZhciBpc0hpZGRlbiA9IHVwbG9hZFN0YXRlID09PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfV0FJVElORyAmJiBwcm9wcy5oaWRlVXBsb2FkQnV0dG9uIHx8IHVwbG9hZFN0YXRlID09PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfV0FJVElORyAmJiAhcHJvcHMubmV3RmlsZXMgPiAwIHx8IHVwbG9hZFN0YXRlID09PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfQ09NUExFVEUgJiYgcHJvcHMuaGlkZUFmdGVyRmluaXNoO1xuICB2YXIgc2hvd1VwbG9hZEJ0biA9ICFlcnJvciAmJiBuZXdGaWxlcyAmJiAhaXNVcGxvYWRJblByb2dyZXNzICYmICFpc0FsbFBhdXNlZCAmJiBhbGxvd05ld1VwbG9hZCAmJiAhaGlkZVVwbG9hZEJ1dHRvbjtcbiAgdmFyIHNob3dDYW5jZWxCdG4gPSAhaGlkZUNhbmNlbEJ1dHRvbiAmJiB1cGxvYWRTdGF0ZSAhPT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1dBSVRJTkcgJiYgdXBsb2FkU3RhdGUgIT09IHN0YXR1c0JhclN0YXRlcy5TVEFURV9DT01QTEVURTtcbiAgdmFyIHNob3dQYXVzZVJlc3VtZUJ0biA9IHJlc3VtYWJsZVVwbG9hZHMgJiYgIWhpZGVQYXVzZVJlc3VtZUJ1dHRvbiAmJiB1cGxvYWRTdGF0ZSA9PT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1VQTE9BRElORztcbiAgdmFyIHNob3dSZXRyeUJ0biA9IGVycm9yICYmICFoaWRlUmV0cnlCdXR0b247XG4gIHZhciBzaG93RG9uZUJ0biA9IHByb3BzLmRvbmVCdXR0b25IYW5kbGVyICYmIHVwbG9hZFN0YXRlID09PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfQ09NUExFVEU7XG4gIHZhciBwcm9ncmVzc0NsYXNzTmFtZXMgPSBcInVwcHktU3RhdHVzQmFyLXByb2dyZXNzXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgKyAocHJvZ3Jlc3NNb2RlID8gJ2lzLScgKyBwcm9ncmVzc01vZGUgOiAnJyk7XG4gIHZhciBzdGF0dXNCYXJDbGFzc05hbWVzID0gY2xhc3NOYW1lcyh7XG4gICAgJ3VwcHktUm9vdCc6IHByb3BzLmlzVGFyZ2V0RE9NRWxcbiAgfSwgJ3VwcHktU3RhdHVzQmFyJywgXCJpcy1cIiArIHVwbG9hZFN0YXRlKTtcbiAgcmV0dXJuIGgoXCJkaXZcIiwge1xuICAgIGNsYXNzOiBzdGF0dXNCYXJDbGFzc05hbWVzLFxuICAgIFwiYXJpYS1oaWRkZW5cIjogaXNIaWRkZW5cbiAgfSwgaChcImRpdlwiLCB7XG4gICAgY2xhc3M6IHByb2dyZXNzQ2xhc3NOYW1lcyxcbiAgICBzdHlsZToge1xuICAgICAgd2lkdGg6IHdpZHRoICsgJyUnXG4gICAgfSxcbiAgICByb2xlOiBcInByb2dyZXNzYmFyXCIsXG4gICAgXCJhcmlhLXZhbHVlbWluXCI6IFwiMFwiLFxuICAgIFwiYXJpYS12YWx1ZW1heFwiOiBcIjEwMFwiLFxuICAgIFwiYXJpYS12YWx1ZW5vd1wiOiBwcm9ncmVzc1ZhbHVlXG4gIH0pLCBwcm9ncmVzc0JhckNvbnRlbnQsIGgoXCJkaXZcIiwge1xuICAgIGNsYXNzOiBcInVwcHktU3RhdHVzQmFyLWFjdGlvbnNcIlxuICB9LCBzaG93VXBsb2FkQnRuID8gaChVcGxvYWRCdG4sIF9leHRlbmRzKHt9LCBwcm9wcywge1xuICAgIHVwbG9hZFN0YXRlOiB1cGxvYWRTdGF0ZVxuICB9KSkgOiBudWxsLCBzaG93UmV0cnlCdG4gPyBoKFJldHJ5QnRuLCBwcm9wcykgOiBudWxsLCBzaG93UGF1c2VSZXN1bWVCdG4gPyBoKFBhdXNlUmVzdW1lQnV0dG9uLCBwcm9wcykgOiBudWxsLCBzaG93Q2FuY2VsQnRuID8gaChDYW5jZWxCdG4sIHByb3BzKSA6IG51bGwsIHNob3dEb25lQnRuID8gaChEb25lQnRuLCBwcm9wcykgOiBudWxsKSk7XG59O1xuXG52YXIgVXBsb2FkQnRuID0gZnVuY3Rpb24gVXBsb2FkQnRuKHByb3BzKSB7XG4gIHZhciB1cGxvYWRCdG5DbGFzc05hbWVzID0gY2xhc3NOYW1lcygndXBweS11LXJlc2V0JywgJ3VwcHktYy1idG4nLCAndXBweS1TdGF0dXNCYXItYWN0aW9uQnRuJywgJ3VwcHktU3RhdHVzQmFyLWFjdGlvbkJ0bi0tdXBsb2FkJywge1xuICAgICd1cHB5LWMtYnRuLXByaW1hcnknOiBwcm9wcy51cGxvYWRTdGF0ZSA9PT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1dBSVRJTkdcbiAgfSk7XG4gIHJldHVybiBoKFwiYnV0dG9uXCIsIHtcbiAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgIGNsYXNzOiB1cGxvYWRCdG5DbGFzc05hbWVzLFxuICAgIFwiYXJpYS1sYWJlbFwiOiBwcm9wcy5pMThuKCd1cGxvYWRYRmlsZXMnLCB7XG4gICAgICBzbWFydF9jb3VudDogcHJvcHMubmV3RmlsZXNcbiAgICB9KSxcbiAgICBvbmNsaWNrOiBwcm9wcy5zdGFydFVwbG9hZCxcbiAgICBcImRhdGEtdXBweS1zdXBlci1mb2N1c2FibGVcIjogdHJ1ZVxuICB9LCBwcm9wcy5uZXdGaWxlcyAmJiBwcm9wcy5pc1VwbG9hZFN0YXJ0ZWQgPyBwcm9wcy5pMThuKCd1cGxvYWRYTmV3RmlsZXMnLCB7XG4gICAgc21hcnRfY291bnQ6IHByb3BzLm5ld0ZpbGVzXG4gIH0pIDogcHJvcHMuaTE4bigndXBsb2FkWEZpbGVzJywge1xuICAgIHNtYXJ0X2NvdW50OiBwcm9wcy5uZXdGaWxlc1xuICB9KSk7XG59O1xuXG52YXIgUmV0cnlCdG4gPSBmdW5jdGlvbiBSZXRyeUJ0bihwcm9wcykge1xuICByZXR1cm4gaChcImJ1dHRvblwiLCB7XG4gICAgdHlwZTogXCJidXR0b25cIixcbiAgICBjbGFzczogXCJ1cHB5LXUtcmVzZXQgdXBweS1jLWJ0biB1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4gdXBweS1TdGF0dXNCYXItYWN0aW9uQnRuLS1yZXRyeVwiLFxuICAgIFwiYXJpYS1sYWJlbFwiOiBwcm9wcy5pMThuKCdyZXRyeVVwbG9hZCcpLFxuICAgIG9uY2xpY2s6IHByb3BzLnJldHJ5QWxsLFxuICAgIFwiZGF0YS11cHB5LXN1cGVyLWZvY3VzYWJsZVwiOiB0cnVlXG4gIH0sIGgoXCJzdmdcIiwge1xuICAgIFwiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCIsXG4gICAgZm9jdXNhYmxlOiBcImZhbHNlXCIsXG4gICAgY2xhc3M6IFwidXBweS1jLWljb25cIixcbiAgICB3aWR0aDogXCI4XCIsXG4gICAgaGVpZ2h0OiBcIjEwXCIsXG4gICAgdmlld0JveDogXCIwIDAgOCAxMFwiXG4gIH0sIGgoXCJwYXRoXCIsIHtcbiAgICBkOiBcIk00IDIuNDA4YTIuNzUgMi43NSAwIDEgMCAyLjc1IDIuNzUuNjI2LjYyNiAwIDAgMSAxLjI1LjAxOHYuMDIzYTQgNCAwIDEgMS00LTQuMDQxVi4yNWEuMjUuMjUgMCAwIDEgLjM4OS0uMjA4bDIuMjk5IDEuNTMzYS4yNS4yNSAwIDAgMSAwIC40MTZsLTIuMyAxLjUzM0EuMjUuMjUgMCAwIDEgNCAzLjMxNnYtLjkwOHpcIlxuICB9KSksIHByb3BzLmkxOG4oJ3JldHJ5JykpO1xufTtcblxudmFyIENhbmNlbEJ0biA9IGZ1bmN0aW9uIENhbmNlbEJ0bihwcm9wcykge1xuICByZXR1cm4gaChcImJ1dHRvblwiLCB7XG4gICAgdHlwZTogXCJidXR0b25cIixcbiAgICBjbGFzczogXCJ1cHB5LXUtcmVzZXQgdXBweS1TdGF0dXNCYXItYWN0aW9uQ2lyY2xlQnRuXCIsXG4gICAgdGl0bGU6IHByb3BzLmkxOG4oJ2NhbmNlbCcpLFxuICAgIFwiYXJpYS1sYWJlbFwiOiBwcm9wcy5pMThuKCdjYW5jZWwnKSxcbiAgICBvbmNsaWNrOiBwcm9wcy5jYW5jZWxBbGwsXG4gICAgXCJkYXRhLXVwcHktc3VwZXItZm9jdXNhYmxlXCI6IHRydWVcbiAgfSwgaChcInN2Z1wiLCB7XG4gICAgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIixcbiAgICBmb2N1c2FibGU6IFwiZmFsc2VcIixcbiAgICBjbGFzczogXCJ1cHB5LWMtaWNvblwiLFxuICAgIHdpZHRoOiBcIjE2XCIsXG4gICAgaGVpZ2h0OiBcIjE2XCIsXG4gICAgdmlld0JveDogXCIwIDAgMTYgMTZcIlxuICB9LCBoKFwiZ1wiLCB7XG4gICAgZmlsbDogXCJub25lXCIsXG4gICAgXCJmaWxsLXJ1bGVcIjogXCJldmVub2RkXCJcbiAgfSwgaChcImNpcmNsZVwiLCB7XG4gICAgZmlsbDogXCIjODg4XCIsXG4gICAgY3g6IFwiOFwiLFxuICAgIGN5OiBcIjhcIixcbiAgICByOiBcIjhcIlxuICB9KSwgaChcInBhdGhcIiwge1xuICAgIGZpbGw6IFwiI0ZGRlwiLFxuICAgIGQ6IFwiTTkuMjgzIDhsMi41NjcgMi41NjctMS4yODMgMS4yODNMOCA5LjI4MyA1LjQzMyAxMS44NSA0LjE1IDEwLjU2NyA2LjcxNyA4IDQuMTUgNS40MzMgNS40MzMgNC4xNSA4IDYuNzE3bDIuNTY3LTIuNTY3IDEuMjgzIDEuMjgzelwiXG4gIH0pKSkpO1xufTtcblxudmFyIFBhdXNlUmVzdW1lQnV0dG9uID0gZnVuY3Rpb24gUGF1c2VSZXN1bWVCdXR0b24ocHJvcHMpIHtcbiAgdmFyIGlzQWxsUGF1c2VkID0gcHJvcHMuaXNBbGxQYXVzZWQsXG4gICAgICBpMThuID0gcHJvcHMuaTE4bjtcbiAgdmFyIHRpdGxlID0gaXNBbGxQYXVzZWQgPyBpMThuKCdyZXN1bWUnKSA6IGkxOG4oJ3BhdXNlJyk7XG4gIHJldHVybiBoKFwiYnV0dG9uXCIsIHtcbiAgICB0aXRsZTogdGl0bGUsXG4gICAgXCJhcmlhLWxhYmVsXCI6IHRpdGxlLFxuICAgIGNsYXNzOiBcInVwcHktdS1yZXNldCB1cHB5LVN0YXR1c0Jhci1hY3Rpb25DaXJjbGVCdG5cIixcbiAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgIG9uY2xpY2s6IGZ1bmN0aW9uIG9uY2xpY2soKSB7XG4gICAgICByZXR1cm4gdG9nZ2xlUGF1c2VSZXN1bWUocHJvcHMpO1xuICAgIH0sXG4gICAgXCJkYXRhLXVwcHktc3VwZXItZm9jdXNhYmxlXCI6IHRydWVcbiAgfSwgaXNBbGxQYXVzZWQgPyBoKFwic3ZnXCIsIHtcbiAgICBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwiLFxuICAgIGZvY3VzYWJsZTogXCJmYWxzZVwiLFxuICAgIGNsYXNzOiBcInVwcHktYy1pY29uXCIsXG4gICAgd2lkdGg6IFwiMTZcIixcbiAgICBoZWlnaHQ6IFwiMTZcIixcbiAgICB2aWV3Qm94OiBcIjAgMCAxNiAxNlwiXG4gIH0sIGgoXCJnXCIsIHtcbiAgICBmaWxsOiBcIm5vbmVcIixcbiAgICBcImZpbGwtcnVsZVwiOiBcImV2ZW5vZGRcIlxuICB9LCBoKFwiY2lyY2xlXCIsIHtcbiAgICBmaWxsOiBcIiM4ODhcIixcbiAgICBjeDogXCI4XCIsXG4gICAgY3k6IFwiOFwiLFxuICAgIHI6IFwiOFwiXG4gIH0pLCBoKFwicGF0aFwiLCB7XG4gICAgZmlsbDogXCIjRkZGXCIsXG4gICAgZDogXCJNNiA0LjI1TDExLjUgOCA2IDExLjc1elwiXG4gIH0pKSkgOiBoKFwic3ZnXCIsIHtcbiAgICBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwiLFxuICAgIGZvY3VzYWJsZTogXCJmYWxzZVwiLFxuICAgIGNsYXNzOiBcInVwcHktYy1pY29uXCIsXG4gICAgd2lkdGg6IFwiMTZcIixcbiAgICBoZWlnaHQ6IFwiMTZcIixcbiAgICB2aWV3Qm94OiBcIjAgMCAxNiAxNlwiXG4gIH0sIGgoXCJnXCIsIHtcbiAgICBmaWxsOiBcIm5vbmVcIixcbiAgICBcImZpbGwtcnVsZVwiOiBcImV2ZW5vZGRcIlxuICB9LCBoKFwiY2lyY2xlXCIsIHtcbiAgICBmaWxsOiBcIiM4ODhcIixcbiAgICBjeDogXCI4XCIsXG4gICAgY3k6IFwiOFwiLFxuICAgIHI6IFwiOFwiXG4gIH0pLCBoKFwicGF0aFwiLCB7XG4gICAgZDogXCJNNSA0LjVoMnY3SDV2LTd6bTQgMGgydjdIOXYtN3pcIixcbiAgICBmaWxsOiBcIiNGRkZcIlxuICB9KSkpKTtcbn07XG5cbnZhciBEb25lQnRuID0gZnVuY3Rpb24gRG9uZUJ0bihwcm9wcykge1xuICB2YXIgaTE4biA9IHByb3BzLmkxOG47XG4gIHJldHVybiBoKFwiYnV0dG9uXCIsIHtcbiAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgIGNsYXNzOiBcInVwcHktdS1yZXNldCB1cHB5LWMtYnRuIHVwcHktU3RhdHVzQmFyLWFjdGlvbkJ0biB1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4tLWRvbmVcIixcbiAgICBvbkNsaWNrOiBwcm9wcy5kb25lQnV0dG9uSGFuZGxlcixcbiAgICBcImRhdGEtdXBweS1zdXBlci1mb2N1c2FibGVcIjogdHJ1ZVxuICB9LCBpMThuKCdkb25lJykpO1xufTtcblxudmFyIExvYWRpbmdTcGlubmVyID0gZnVuY3Rpb24gTG9hZGluZ1NwaW5uZXIoKSB7XG4gIHJldHVybiBoKFwic3ZnXCIsIHtcbiAgICBjbGFzczogXCJ1cHB5LVN0YXR1c0Jhci1zcGlubmVyXCIsXG4gICAgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIixcbiAgICBmb2N1c2FibGU6IFwiZmFsc2VcIixcbiAgICB3aWR0aDogXCIxNFwiLFxuICAgIGhlaWdodDogXCIxNFwiXG4gIH0sIGgoXCJwYXRoXCIsIHtcbiAgICBkOiBcIk0xMy45ODMgNi41NDdjLS4xMi0yLjUwOS0xLjY0LTQuODkzLTMuOTM5LTUuOTM2LTIuNDgtMS4xMjctNS40ODgtLjY1Ni03LjU1NiAxLjA5NEMuNTI0IDMuMzY3LS4zOTggNi4wNDguMTYyIDguNTYyYy41NTYgMi40OTUgMi40NiA0LjUyIDQuOTQgNS4xODMgMi45MzIuNzg0IDUuNjEtLjYwMiA3LjI1Ni0zLjAxNS0xLjQ5MyAxLjk5My0zLjc0NSAzLjMwOS02LjI5OCAyLjg2OC0yLjUxNC0uNDM0LTQuNTc4LTIuMzQ5LTUuMTUzLTQuODRhNi4yMjYgNi4yMjYgMCAwIDEgMi45OC02Ljc3OEM2LjM0LjU4NiA5Ljc0IDEuMSAxMS4zNzMgMy40OTNjLjQwNy41OTYuNjkzIDEuMjgyLjg0MiAxLjk4OC4xMjcuNTk4LjA3MyAxLjE5Ny4xNjEgMS43OTQuMDc4LjUyNS41NDMgMS4yNTcgMS4xNS44NjQuNTI1LS4zNDEuNDktMS4wNS40NTYtMS41OTItLjAwNy0uMTUuMDIuMyAwIDBcIixcbiAgICBcImZpbGwtcnVsZVwiOiBcImV2ZW5vZGRcIlxuICB9KSk7XG59O1xuXG52YXIgUHJvZ3Jlc3NCYXJQcm9jZXNzaW5nID0gZnVuY3Rpb24gUHJvZ3Jlc3NCYXJQcm9jZXNzaW5nKHByb3BzKSB7XG4gIHZhciB2YWx1ZSA9IE1hdGgucm91bmQocHJvcHMudmFsdWUgKiAxMDApO1xuICByZXR1cm4gaChcImRpdlwiLCB7XG4gICAgY2xhc3M6IFwidXBweS1TdGF0dXNCYXItY29udGVudFwiXG4gIH0sIGgoTG9hZGluZ1NwaW5uZXIsIG51bGwpLCBwcm9wcy5tb2RlID09PSAnZGV0ZXJtaW5hdGUnID8gdmFsdWUgKyBcIiUgXFx4QjcgXCIgOiAnJywgcHJvcHMubWVzc2FnZSk7XG59O1xuXG52YXIgcmVuZGVyRG90ID0gZnVuY3Rpb24gcmVuZGVyRG90KCkge1xuICByZXR1cm4gXCIgXFx4QjcgXCI7XG59O1xuXG52YXIgUHJvZ3Jlc3NEZXRhaWxzID0gZnVuY3Rpb24gUHJvZ3Jlc3NEZXRhaWxzKHByb3BzKSB7XG4gIHZhciBpZlNob3dGaWxlc1VwbG9hZGVkT2ZUb3RhbCA9IHByb3BzLm51bVVwbG9hZHMgPiAxO1xuICByZXR1cm4gaChcImRpdlwiLCB7XG4gICAgY2xhc3M6IFwidXBweS1TdGF0dXNCYXItc3RhdHVzU2Vjb25kYXJ5XCJcbiAgfSwgaWZTaG93RmlsZXNVcGxvYWRlZE9mVG90YWwgJiYgcHJvcHMuaTE4bignZmlsZXNVcGxvYWRlZE9mVG90YWwnLCB7XG4gICAgY29tcGxldGU6IHByb3BzLmNvbXBsZXRlLFxuICAgIHNtYXJ0X2NvdW50OiBwcm9wcy5udW1VcGxvYWRzXG4gIH0pLCBoKFwic3BhblwiLCB7XG4gICAgY2xhc3M6IFwidXBweS1TdGF0dXNCYXItYWRkaXRpb25hbEluZm9cIlxuICB9LCBpZlNob3dGaWxlc1VwbG9hZGVkT2ZUb3RhbCAmJiByZW5kZXJEb3QoKSwgcHJvcHMuaTE4bignZGF0YVVwbG9hZGVkT2ZUb3RhbCcsIHtcbiAgICBjb21wbGV0ZTogcHJldHRpZXJCeXRlcyhwcm9wcy50b3RhbFVwbG9hZGVkU2l6ZSksXG4gICAgdG90YWw6IHByZXR0aWVyQnl0ZXMocHJvcHMudG90YWxTaXplKVxuICB9KSwgcmVuZGVyRG90KCksIHByb3BzLmkxOG4oJ3hUaW1lTGVmdCcsIHtcbiAgICB0aW1lOiBwcmV0dHlFVEEocHJvcHMudG90YWxFVEEpXG4gIH0pKSk7XG59O1xuXG52YXIgVW5rbm93blByb2dyZXNzRGV0YWlscyA9IGZ1bmN0aW9uIFVua25vd25Qcm9ncmVzc0RldGFpbHMocHJvcHMpIHtcbiAgcmV0dXJuIGgoXCJkaXZcIiwge1xuICAgIGNsYXNzOiBcInVwcHktU3RhdHVzQmFyLXN0YXR1c1NlY29uZGFyeVwiXG4gIH0sIHByb3BzLmkxOG4oJ2ZpbGVzVXBsb2FkZWRPZlRvdGFsJywge1xuICAgIGNvbXBsZXRlOiBwcm9wcy5jb21wbGV0ZSxcbiAgICBzbWFydF9jb3VudDogcHJvcHMubnVtVXBsb2Fkc1xuICB9KSk7XG59O1xuXG52YXIgVXBsb2FkTmV3bHlBZGRlZEZpbGVzID0gZnVuY3Rpb24gVXBsb2FkTmV3bHlBZGRlZEZpbGVzKHByb3BzKSB7XG4gIHZhciB1cGxvYWRCdG5DbGFzc05hbWVzID0gY2xhc3NOYW1lcygndXBweS11LXJlc2V0JywgJ3VwcHktYy1idG4nLCAndXBweS1TdGF0dXNCYXItYWN0aW9uQnRuJywgJ3VwcHktU3RhdHVzQmFyLWFjdGlvbkJ0bi0tdXBsb2FkTmV3bHlBZGRlZCcpO1xuICByZXR1cm4gaChcImRpdlwiLCB7XG4gICAgY2xhc3M6IFwidXBweS1TdGF0dXNCYXItc3RhdHVzU2Vjb25kYXJ5XCJcbiAgfSwgaChcImRpdlwiLCB7XG4gICAgY2xhc3M6IFwidXBweS1TdGF0dXNCYXItc3RhdHVzU2Vjb25kYXJ5SGludFwiXG4gIH0sIHByb3BzLmkxOG4oJ3hNb3JlRmlsZXNBZGRlZCcsIHtcbiAgICBzbWFydF9jb3VudDogcHJvcHMubmV3RmlsZXNcbiAgfSkpLCBoKFwiYnV0dG9uXCIsIHtcbiAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgIGNsYXNzOiB1cGxvYWRCdG5DbGFzc05hbWVzLFxuICAgIFwiYXJpYS1sYWJlbFwiOiBwcm9wcy5pMThuKCd1cGxvYWRYRmlsZXMnLCB7XG4gICAgICBzbWFydF9jb3VudDogcHJvcHMubmV3RmlsZXNcbiAgICB9KSxcbiAgICBvbmNsaWNrOiBwcm9wcy5zdGFydFVwbG9hZFxuICB9LCBwcm9wcy5pMThuKCd1cGxvYWQnKSkpO1xufTtcblxudmFyIFRocm90dGxlZFByb2dyZXNzRGV0YWlscyA9IHRocm90dGxlKFByb2dyZXNzRGV0YWlscywgNTAwLCB7XG4gIGxlYWRpbmc6IHRydWUsXG4gIHRyYWlsaW5nOiB0cnVlXG59KTtcblxudmFyIFByb2dyZXNzQmFyVXBsb2FkaW5nID0gZnVuY3Rpb24gUHJvZ3Jlc3NCYXJVcGxvYWRpbmcocHJvcHMpIHtcbiAgaWYgKCFwcm9wcy5pc1VwbG9hZFN0YXJ0ZWQgfHwgcHJvcHMuaXNBbGxDb21wbGV0ZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIHRpdGxlID0gcHJvcHMuaXNBbGxQYXVzZWQgPyBwcm9wcy5pMThuKCdwYXVzZWQnKSA6IHByb3BzLmkxOG4oJ3VwbG9hZGluZycpO1xuICB2YXIgc2hvd1VwbG9hZE5ld2x5QWRkZWRGaWxlcyA9IHByb3BzLm5ld0ZpbGVzICYmIHByb3BzLmlzVXBsb2FkU3RhcnRlZDtcbiAgcmV0dXJuIGgoXCJkaXZcIiwge1xuICAgIGNsYXNzOiBcInVwcHktU3RhdHVzQmFyLWNvbnRlbnRcIixcbiAgICBcImFyaWEtbGFiZWxcIjogdGl0bGUsXG4gICAgdGl0bGU6IHRpdGxlXG4gIH0sICFwcm9wcy5pc0FsbFBhdXNlZCA/IGgoTG9hZGluZ1NwaW5uZXIsIG51bGwpIDogbnVsbCwgaChcImRpdlwiLCB7XG4gICAgY2xhc3M6IFwidXBweS1TdGF0dXNCYXItc3RhdHVzXCJcbiAgfSwgaChcImRpdlwiLCB7XG4gICAgY2xhc3M6IFwidXBweS1TdGF0dXNCYXItc3RhdHVzUHJpbWFyeVwiXG4gIH0sIHByb3BzLnN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MgPyB0aXRsZSArIFwiOiBcIiArIHByb3BzLnRvdGFsUHJvZ3Jlc3MgKyBcIiVcIiA6IHRpdGxlKSwgIXByb3BzLmlzQWxsUGF1c2VkICYmICFzaG93VXBsb2FkTmV3bHlBZGRlZEZpbGVzICYmIHByb3BzLnNob3dQcm9ncmVzc0RldGFpbHMgPyBwcm9wcy5zdXBwb3J0c1VwbG9hZFByb2dyZXNzID8gaChUaHJvdHRsZWRQcm9ncmVzc0RldGFpbHMsIHByb3BzKSA6IGgoVW5rbm93blByb2dyZXNzRGV0YWlscywgcHJvcHMpIDogbnVsbCwgc2hvd1VwbG9hZE5ld2x5QWRkZWRGaWxlcyA/IGgoVXBsb2FkTmV3bHlBZGRlZEZpbGVzLCBwcm9wcykgOiBudWxsKSk7XG59O1xuXG52YXIgUHJvZ3Jlc3NCYXJDb21wbGV0ZSA9IGZ1bmN0aW9uIFByb2dyZXNzQmFyQ29tcGxldGUoX3JlZikge1xuICB2YXIgdG90YWxQcm9ncmVzcyA9IF9yZWYudG90YWxQcm9ncmVzcyxcbiAgICAgIGkxOG4gPSBfcmVmLmkxOG47XG4gIHJldHVybiBoKFwiZGl2XCIsIHtcbiAgICBjbGFzczogXCJ1cHB5LVN0YXR1c0Jhci1jb250ZW50XCIsXG4gICAgcm9sZTogXCJzdGF0dXNcIixcbiAgICB0aXRsZTogaTE4bignY29tcGxldGUnKVxuICB9LCBoKFwiZGl2XCIsIHtcbiAgICBjbGFzczogXCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNcIlxuICB9LCBoKFwiZGl2XCIsIHtcbiAgICBjbGFzczogXCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNQcmltYXJ5XCJcbiAgfSwgaChcInN2Z1wiLCB7XG4gICAgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIixcbiAgICBmb2N1c2FibGU6IFwiZmFsc2VcIixcbiAgICBjbGFzczogXCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNJbmRpY2F0b3IgdXBweS1jLWljb25cIixcbiAgICB3aWR0aDogXCIxNVwiLFxuICAgIGhlaWdodDogXCIxMVwiLFxuICAgIHZpZXdCb3g6IFwiMCAwIDE1IDExXCJcbiAgfSwgaChcInBhdGhcIiwge1xuICAgIGQ6IFwiTS40MTQgNS44NDNMMS42MjcgNC42M2wzLjQ3MiAzLjQ3MkwxMy4yMDIgMGwxLjIxMiAxLjIxM0w1LjEgMTAuNTI4elwiXG4gIH0pKSwgaTE4bignY29tcGxldGUnKSkpKTtcbn07XG5cbnZhciBQcm9ncmVzc0JhckVycm9yID0gZnVuY3Rpb24gUHJvZ3Jlc3NCYXJFcnJvcihfcmVmMikge1xuICB2YXIgZXJyb3IgPSBfcmVmMi5lcnJvcixcbiAgICAgIHJldHJ5QWxsID0gX3JlZjIucmV0cnlBbGwsXG4gICAgICBoaWRlUmV0cnlCdXR0b24gPSBfcmVmMi5oaWRlUmV0cnlCdXR0b24sXG4gICAgICBpMThuID0gX3JlZjIuaTE4bjtcblxuICBmdW5jdGlvbiBkaXNwbGF5RXJyb3JBbGVydCgpIHtcbiAgICB2YXIgZXJyb3JNZXNzYWdlID0gaTE4bigndXBsb2FkRmFpbGVkJykgKyBcIiBcXG5cXG4gXCIgKyBlcnJvcjtcbiAgICBhbGVydChlcnJvck1lc3NhZ2UpO1xuICB9XG5cbiAgcmV0dXJuIGgoXCJkaXZcIiwge1xuICAgIGNsYXNzOiBcInVwcHktU3RhdHVzQmFyLWNvbnRlbnRcIixcbiAgICByb2xlOiBcImFsZXJ0XCIsXG4gICAgdGl0bGU6IGkxOG4oJ3VwbG9hZEZhaWxlZCcpXG4gIH0sIGgoXCJkaXZcIiwge1xuICAgIGNsYXNzOiBcInVwcHktU3RhdHVzQmFyLXN0YXR1c1wiXG4gIH0sIGgoXCJkaXZcIiwge1xuICAgIGNsYXNzOiBcInVwcHktU3RhdHVzQmFyLXN0YXR1c1ByaW1hcnlcIlxuICB9LCBoKFwic3ZnXCIsIHtcbiAgICBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwiLFxuICAgIGZvY3VzYWJsZTogXCJmYWxzZVwiLFxuICAgIGNsYXNzOiBcInVwcHktU3RhdHVzQmFyLXN0YXR1c0luZGljYXRvciB1cHB5LWMtaWNvblwiLFxuICAgIHdpZHRoOiBcIjExXCIsXG4gICAgaGVpZ2h0OiBcIjExXCIsXG4gICAgdmlld0JveDogXCIwIDAgMTEgMTFcIlxuICB9LCBoKFwicGF0aFwiLCB7XG4gICAgZDogXCJNNC4yNzggNS41TDAgMS4yMjIgMS4yMjIgMCA1LjUgNC4yNzggOS43NzggMCAxMSAxLjIyMiA2LjcyMiA1LjUgMTEgOS43NzggOS43NzggMTEgNS41IDYuNzIyIDEuMjIyIDExIDAgOS43Nzh6XCJcbiAgfSkpLCBpMThuKCd1cGxvYWRGYWlsZWQnKSkpLCBoKFwic3BhblwiLCB7XG4gICAgY2xhc3M6IFwidXBweS1TdGF0dXNCYXItZGV0YWlsc1wiLFxuICAgIFwiYXJpYS1sYWJlbFwiOiBlcnJvcixcbiAgICBcImRhdGEtbWljcm90aXAtcG9zaXRpb25cIjogXCJ0b3AtcmlnaHRcIixcbiAgICBcImRhdGEtbWljcm90aXAtc2l6ZVwiOiBcIm1lZGl1bVwiLFxuICAgIHJvbGU6IFwidG9vbHRpcFwiLFxuICAgIG9uY2xpY2s6IGRpc3BsYXlFcnJvckFsZXJ0XG4gIH0sIFwiP1wiKSk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBTVEFURV9FUlJPUjogJ2Vycm9yJyxcbiAgU1RBVEVfV0FJVElORzogJ3dhaXRpbmcnLFxuICBTVEFURV9QUkVQUk9DRVNTSU5HOiAncHJlcHJvY2Vzc2luZycsXG4gIFNUQVRFX1VQTE9BRElORzogJ3VwbG9hZGluZycsXG4gIFNUQVRFX1BPU1RQUk9DRVNTSU5HOiAncG9zdHByb2Nlc3NpbmcnLFxuICBTVEFURV9DT01QTEVURTogJ2NvbXBsZXRlJ1xufTsiLCJ2YXIgX2NsYXNzLCBfdGVtcDtcblxuZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdAdXBweS9jb3JlJyksXG4gICAgUGx1Z2luID0gX3JlcXVpcmUuUGx1Z2luO1xuXG52YXIgVHJhbnNsYXRvciA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9UcmFuc2xhdG9yJyk7XG5cbnZhciBTdGF0dXNCYXJVSSA9IHJlcXVpcmUoJy4vU3RhdHVzQmFyJyk7XG5cbnZhciBzdGF0dXNCYXJTdGF0ZXMgPSByZXF1aXJlKCcuL1N0YXR1c0JhclN0YXRlcycpO1xuXG52YXIgZ2V0U3BlZWQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0U3BlZWQnKTtcblxudmFyIGdldEJ5dGVzUmVtYWluaW5nID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2dldEJ5dGVzUmVtYWluaW5nJyk7XG4vKipcbiAqIFN0YXR1c0JhcjogcmVuZGVycyBhIHN0YXR1cyBiYXIgd2l0aCB1cGxvYWQvcGF1c2UvcmVzdW1lL2NhbmNlbC9yZXRyeSBidXR0b25zLFxuICogcHJvZ3Jlc3MgcGVyY2VudGFnZSBhbmQgdGltZSByZW1haW5pbmcuXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IChfdGVtcCA9IF9jbGFzcyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX1BsdWdpbikge1xuICBfaW5oZXJpdHNMb29zZShTdGF0dXNCYXIsIF9QbHVnaW4pO1xuXG4gIGZ1bmN0aW9uIFN0YXR1c0Jhcih1cHB5LCBvcHRzKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX3RoaXMgPSBfUGx1Z2luLmNhbGwodGhpcywgdXBweSwgb3B0cykgfHwgdGhpcztcblxuICAgIF90aGlzLnN0YXJ0VXBsb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLnVwcHkudXBsb2FkKCkuY2F0Y2goZnVuY3Rpb24gKCkgey8vIEVycm9yIGxvZ2dlZCBpbiBDb3JlXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgX3RoaXMuaWQgPSBfdGhpcy5vcHRzLmlkIHx8ICdTdGF0dXNCYXInO1xuICAgIF90aGlzLnRpdGxlID0gJ1N0YXR1c0Jhcic7XG4gICAgX3RoaXMudHlwZSA9ICdwcm9ncmVzc2luZGljYXRvcic7XG4gICAgX3RoaXMuZGVmYXVsdExvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHtcbiAgICAgICAgdXBsb2FkaW5nOiAnVXBsb2FkaW5nJyxcbiAgICAgICAgdXBsb2FkOiAnVXBsb2FkJyxcbiAgICAgICAgY29tcGxldGU6ICdDb21wbGV0ZScsXG4gICAgICAgIHVwbG9hZEZhaWxlZDogJ1VwbG9hZCBmYWlsZWQnLFxuICAgICAgICBwYXVzZWQ6ICdQYXVzZWQnLFxuICAgICAgICByZXRyeTogJ1JldHJ5JyxcbiAgICAgICAgcmV0cnlVcGxvYWQ6ICdSZXRyeSB1cGxvYWQnLFxuICAgICAgICBjYW5jZWw6ICdDYW5jZWwnLFxuICAgICAgICBwYXVzZTogJ1BhdXNlJyxcbiAgICAgICAgcmVzdW1lOiAnUmVzdW1lJyxcbiAgICAgICAgZG9uZTogJ0RvbmUnLFxuICAgICAgICBmaWxlc1VwbG9hZGVkT2ZUb3RhbDoge1xuICAgICAgICAgIDA6ICcle2NvbXBsZXRlfSBvZiAle3NtYXJ0X2NvdW50fSBmaWxlIHVwbG9hZGVkJyxcbiAgICAgICAgICAxOiAnJXtjb21wbGV0ZX0gb2YgJXtzbWFydF9jb3VudH0gZmlsZXMgdXBsb2FkZWQnXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFVcGxvYWRlZE9mVG90YWw6ICcle2NvbXBsZXRlfSBvZiAle3RvdGFsfScsXG4gICAgICAgIHhUaW1lTGVmdDogJyV7dGltZX0gbGVmdCcsXG4gICAgICAgIHVwbG9hZFhGaWxlczoge1xuICAgICAgICAgIDA6ICdVcGxvYWQgJXtzbWFydF9jb3VudH0gZmlsZScsXG4gICAgICAgICAgMTogJ1VwbG9hZCAle3NtYXJ0X2NvdW50fSBmaWxlcydcbiAgICAgICAgfSxcbiAgICAgICAgdXBsb2FkWE5ld0ZpbGVzOiB7XG4gICAgICAgICAgMDogJ1VwbG9hZCArJXtzbWFydF9jb3VudH0gZmlsZScsXG4gICAgICAgICAgMTogJ1VwbG9hZCArJXtzbWFydF9jb3VudH0gZmlsZXMnXG4gICAgICAgIH0sXG4gICAgICAgIHhNb3JlRmlsZXNBZGRlZDoge1xuICAgICAgICAgIDA6ICcle3NtYXJ0X2NvdW50fSBtb3JlIGZpbGUgYWRkZWQnLFxuICAgICAgICAgIDE6ICcle3NtYXJ0X2NvdW50fSBtb3JlIGZpbGVzIGFkZGVkJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTsgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuXG4gICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdGFyZ2V0OiAnYm9keScsXG4gICAgICBoaWRlVXBsb2FkQnV0dG9uOiBmYWxzZSxcbiAgICAgIGhpZGVSZXRyeUJ1dHRvbjogZmFsc2UsXG4gICAgICBoaWRlUGF1c2VSZXN1bWVCdXR0b246IGZhbHNlLFxuICAgICAgaGlkZUNhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICBzaG93UHJvZ3Jlc3NEZXRhaWxzOiBmYWxzZSxcbiAgICAgIGhpZGVBZnRlckZpbmlzaDogdHJ1ZSxcbiAgICAgIGRvbmVCdXR0b25IYW5kbGVyOiBudWxsXG4gICAgfTtcbiAgICBfdGhpcy5vcHRzID0gX2V4dGVuZHMoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRzKTtcblxuICAgIF90aGlzLmkxOG5Jbml0KCk7XG5cbiAgICBfdGhpcy5yZW5kZXIgPSBfdGhpcy5yZW5kZXIuYmluZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSk7XG4gICAgX3RoaXMuaW5zdGFsbCA9IF90aGlzLmluc3RhbGwuYmluZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFN0YXR1c0Jhci5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLnNldE9wdGlvbnMgPSBmdW5jdGlvbiBzZXRPcHRpb25zKG5ld09wdHMpIHtcbiAgICBfUGx1Z2luLnByb3RvdHlwZS5zZXRPcHRpb25zLmNhbGwodGhpcywgbmV3T3B0cyk7XG5cbiAgICB0aGlzLmkxOG5Jbml0KCk7XG4gIH07XG5cbiAgX3Byb3RvLmkxOG5Jbml0ID0gZnVuY3Rpb24gaTE4bkluaXQoKSB7XG4gICAgdGhpcy50cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3IoW3RoaXMuZGVmYXVsdExvY2FsZSwgdGhpcy51cHB5LmxvY2FsZSwgdGhpcy5vcHRzLmxvY2FsZV0pO1xuICAgIHRoaXMuaTE4biA9IHRoaXMudHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0aGlzLnRyYW5zbGF0b3IpO1xuICAgIHRoaXMuc2V0UGx1Z2luU3RhdGUoKTsgLy8gc28gdGhhdCBVSSByZS1yZW5kZXJzIGFuZCB3ZSBzZWUgdGhlIHVwZGF0ZWQgbG9jYWxlXG4gIH07XG5cbiAgX3Byb3RvLmdldFRvdGFsU3BlZWQgPSBmdW5jdGlvbiBnZXRUb3RhbFNwZWVkKGZpbGVzKSB7XG4gICAgdmFyIHRvdGFsU3BlZWQgPSAwO1xuICAgIGZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHRvdGFsU3BlZWQgPSB0b3RhbFNwZWVkICsgZ2V0U3BlZWQoZmlsZS5wcm9ncmVzcyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRvdGFsU3BlZWQ7XG4gIH07XG5cbiAgX3Byb3RvLmdldFRvdGFsRVRBID0gZnVuY3Rpb24gZ2V0VG90YWxFVEEoZmlsZXMpIHtcbiAgICB2YXIgdG90YWxTcGVlZCA9IHRoaXMuZ2V0VG90YWxTcGVlZChmaWxlcyk7XG5cbiAgICBpZiAodG90YWxTcGVlZCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgdmFyIHRvdGFsQnl0ZXNSZW1haW5pbmcgPSBmaWxlcy5yZWR1Y2UoZnVuY3Rpb24gKHRvdGFsLCBmaWxlKSB7XG4gICAgICByZXR1cm4gdG90YWwgKyBnZXRCeXRlc1JlbWFpbmluZyhmaWxlLnByb2dyZXNzKTtcbiAgICB9LCAwKTtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0b3RhbEJ5dGVzUmVtYWluaW5nIC8gdG90YWxTcGVlZCAqIDEwKSAvIDEwO1xuICB9O1xuXG4gIF9wcm90by5nZXRVcGxvYWRpbmdTdGF0ZSA9IGZ1bmN0aW9uIGdldFVwbG9hZGluZ1N0YXRlKGlzQWxsRXJyb3JlZCwgaXNBbGxDb21wbGV0ZSwgZmlsZXMpIHtcbiAgICBpZiAoaXNBbGxFcnJvcmVkKSB7XG4gICAgICByZXR1cm4gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX0VSUk9SO1xuICAgIH1cblxuICAgIGlmIChpc0FsbENvbXBsZXRlKSB7XG4gICAgICByZXR1cm4gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX0NPTVBMRVRFO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZSA9IHN0YXR1c0JhclN0YXRlcy5TVEFURV9XQUlUSU5HO1xuICAgIHZhciBmaWxlSURzID0gT2JqZWN0LmtleXMoZmlsZXMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcHJvZ3Jlc3MgPSBmaWxlc1tmaWxlSURzW2ldXS5wcm9ncmVzczsgLy8gSWYgQU5ZIGZpbGVzIGFyZSBiZWluZyB1cGxvYWRlZCByaWdodCBub3csIHNob3cgdGhlIHVwbG9hZGluZyBzdGF0ZS5cblxuICAgICAgaWYgKHByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgJiYgIXByb2dyZXNzLnVwbG9hZENvbXBsZXRlKSB7XG4gICAgICAgIHJldHVybiBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfVVBMT0FESU5HO1xuICAgICAgfSAvLyBJZiBmaWxlcyBhcmUgYmVpbmcgcHJlcHJvY2Vzc2VkIEFORCBwb3N0cHJvY2Vzc2VkIGF0IHRoaXMgdGltZSwgd2Ugc2hvdyB0aGVcbiAgICAgIC8vIHByZXByb2Nlc3Mgc3RhdGUuIElmIGFueSBmaWxlcyBhcmUgYmVpbmcgdXBsb2FkZWQgd2Ugc2hvdyB1cGxvYWRpbmcuXG5cblxuICAgICAgaWYgKHByb2dyZXNzLnByZXByb2Nlc3MgJiYgc3RhdGUgIT09IHN0YXR1c0JhclN0YXRlcy5TVEFURV9VUExPQURJTkcpIHtcbiAgICAgICAgc3RhdGUgPSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfUFJFUFJPQ0VTU0lORztcbiAgICAgIH0gLy8gSWYgTk8gZmlsZXMgYXJlIGJlaW5nIHByZXByb2Nlc3NlZCBvciB1cGxvYWRlZCByaWdodCBub3csIGJ1dCBzb21lIGZpbGVzIGFyZVxuICAgICAgLy8gYmVpbmcgcG9zdHByb2Nlc3NlZCwgc2hvdyB0aGUgcG9zdHByb2Nlc3Mgc3RhdGUuXG5cblxuICAgICAgaWYgKHByb2dyZXNzLnBvc3Rwcm9jZXNzICYmIHN0YXRlICE9PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfVVBMT0FESU5HICYmIHN0YXRlICE9PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfUFJFUFJPQ0VTU0lORykge1xuICAgICAgICBzdGF0ZSA9IHN0YXR1c0JhclN0YXRlcy5TVEFURV9QT1NUUFJPQ0VTU0lORztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGU7XG4gIH07XG5cbiAgX3Byb3RvLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihzdGF0ZSkge1xuICAgIHZhciBjYXBhYmlsaXRpZXMgPSBzdGF0ZS5jYXBhYmlsaXRpZXMsXG4gICAgICAgIGZpbGVzID0gc3RhdGUuZmlsZXMsXG4gICAgICAgIGFsbG93TmV3VXBsb2FkID0gc3RhdGUuYWxsb3dOZXdVcGxvYWQsXG4gICAgICAgIHRvdGFsUHJvZ3Jlc3MgPSBzdGF0ZS50b3RhbFByb2dyZXNzLFxuICAgICAgICBlcnJvciA9IHN0YXRlLmVycm9yOyAvLyBUT0RPOiBtb3ZlIHRoaXMgdG8gQ29yZSwgdG8gc2hhcmUgYmV0d2VlbiBTdGF0dXMgQmFyIGFuZCBEYXNoYm9hcmRcbiAgICAvLyAoYW5kIGFueSBvdGhlciBwbHVnaW4gdGhhdCBtaWdodCBuZWVkIGl0LCB0b28pXG5cbiAgICB2YXIgZmlsZXNBcnJheSA9IE9iamVjdC5rZXlzKGZpbGVzKS5tYXAoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHJldHVybiBmaWxlc1tmaWxlXTtcbiAgICB9KTtcbiAgICB2YXIgbmV3RmlsZXMgPSBmaWxlc0FycmF5LmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgcmV0dXJuICFmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgJiYgIWZpbGUucHJvZ3Jlc3MucHJlcHJvY2VzcyAmJiAhZmlsZS5wcm9ncmVzcy5wb3N0cHJvY2VzcztcbiAgICB9KTtcbiAgICB2YXIgdXBsb2FkU3RhcnRlZEZpbGVzID0gZmlsZXNBcnJheS5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHJldHVybiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQ7XG4gICAgfSk7XG4gICAgdmFyIHBhdXNlZEZpbGVzID0gdXBsb2FkU3RhcnRlZEZpbGVzLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgcmV0dXJuIGZpbGUuaXNQYXVzZWQ7XG4gICAgfSk7XG4gICAgdmFyIGNvbXBsZXRlRmlsZXMgPSBmaWxlc0FycmF5LmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgcmV0dXJuIGZpbGUucHJvZ3Jlc3MudXBsb2FkQ29tcGxldGU7XG4gICAgfSk7XG4gICAgdmFyIGVycm9yZWRGaWxlcyA9IGZpbGVzQXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICByZXR1cm4gZmlsZS5lcnJvcjtcbiAgICB9KTtcbiAgICB2YXIgaW5Qcm9ncmVzc0ZpbGVzID0gZmlsZXNBcnJheS5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHJldHVybiAhZmlsZS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZSAmJiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQ7XG4gICAgfSk7XG4gICAgdmFyIGluUHJvZ3Jlc3NOb3RQYXVzZWRGaWxlcyA9IGluUHJvZ3Jlc3NGaWxlcy5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHJldHVybiAhZmlsZS5pc1BhdXNlZDtcbiAgICB9KTtcbiAgICB2YXIgc3RhcnRlZEZpbGVzID0gZmlsZXNBcnJheS5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHJldHVybiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgfHwgZmlsZS5wcm9ncmVzcy5wcmVwcm9jZXNzIHx8IGZpbGUucHJvZ3Jlc3MucG9zdHByb2Nlc3M7XG4gICAgfSk7XG4gICAgdmFyIHByb2Nlc3NpbmdGaWxlcyA9IGZpbGVzQXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICByZXR1cm4gZmlsZS5wcm9ncmVzcy5wcmVwcm9jZXNzIHx8IGZpbGUucHJvZ3Jlc3MucG9zdHByb2Nlc3M7XG4gICAgfSk7XG4gICAgdmFyIHRvdGFsRVRBID0gdGhpcy5nZXRUb3RhbEVUQShpblByb2dyZXNzTm90UGF1c2VkRmlsZXMpO1xuICAgIHZhciB0b3RhbFNpemUgPSAwO1xuICAgIHZhciB0b3RhbFVwbG9hZGVkU2l6ZSA9IDA7XG4gICAgc3RhcnRlZEZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHRvdGFsU2l6ZSA9IHRvdGFsU2l6ZSArIChmaWxlLnByb2dyZXNzLmJ5dGVzVG90YWwgfHwgMCk7XG4gICAgICB0b3RhbFVwbG9hZGVkU2l6ZSA9IHRvdGFsVXBsb2FkZWRTaXplICsgKGZpbGUucHJvZ3Jlc3MuYnl0ZXNVcGxvYWRlZCB8fCAwKTtcbiAgICB9KTtcbiAgICB2YXIgaXNVcGxvYWRTdGFydGVkID0gc3RhcnRlZEZpbGVzLmxlbmd0aCA+IDA7XG4gICAgdmFyIGlzQWxsQ29tcGxldGUgPSB0b3RhbFByb2dyZXNzID09PSAxMDAgJiYgY29tcGxldGVGaWxlcy5sZW5ndGggPT09IE9iamVjdC5rZXlzKGZpbGVzKS5sZW5ndGggJiYgcHJvY2Vzc2luZ0ZpbGVzLmxlbmd0aCA9PT0gMDtcbiAgICB2YXIgaXNBbGxFcnJvcmVkID0gZXJyb3IgJiYgZXJyb3JlZEZpbGVzLmxlbmd0aCA9PT0gZmlsZXNBcnJheS5sZW5ndGg7XG4gICAgdmFyIGlzQWxsUGF1c2VkID0gaW5Qcm9ncmVzc0ZpbGVzLmxlbmd0aCAhPT0gMCAmJiBwYXVzZWRGaWxlcy5sZW5ndGggPT09IGluUHJvZ3Jlc3NGaWxlcy5sZW5ndGg7XG4gICAgdmFyIGlzVXBsb2FkSW5Qcm9ncmVzcyA9IGluUHJvZ3Jlc3NGaWxlcy5sZW5ndGggPiAwO1xuICAgIHZhciByZXN1bWFibGVVcGxvYWRzID0gY2FwYWJpbGl0aWVzLnJlc3VtYWJsZVVwbG9hZHMgfHwgZmFsc2U7XG4gICAgdmFyIHN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MgPSBjYXBhYmlsaXRpZXMudXBsb2FkUHJvZ3Jlc3MgIT09IGZhbHNlO1xuICAgIHJldHVybiBTdGF0dXNCYXJVSSh7XG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgICB1cGxvYWRTdGF0ZTogdGhpcy5nZXRVcGxvYWRpbmdTdGF0ZShpc0FsbEVycm9yZWQsIGlzQWxsQ29tcGxldGUsIHN0YXRlLmZpbGVzIHx8IHt9KSxcbiAgICAgIGFsbG93TmV3VXBsb2FkOiBhbGxvd05ld1VwbG9hZCxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IHRvdGFsUHJvZ3Jlc3MsXG4gICAgICB0b3RhbFNpemU6IHRvdGFsU2l6ZSxcbiAgICAgIHRvdGFsVXBsb2FkZWRTaXplOiB0b3RhbFVwbG9hZGVkU2l6ZSxcbiAgICAgIGlzQWxsQ29tcGxldGU6IGlzQWxsQ29tcGxldGUsXG4gICAgICBpc0FsbFBhdXNlZDogaXNBbGxQYXVzZWQsXG4gICAgICBpc0FsbEVycm9yZWQ6IGlzQWxsRXJyb3JlZCxcbiAgICAgIGlzVXBsb2FkU3RhcnRlZDogaXNVcGxvYWRTdGFydGVkLFxuICAgICAgaXNVcGxvYWRJblByb2dyZXNzOiBpc1VwbG9hZEluUHJvZ3Jlc3MsXG4gICAgICBjb21wbGV0ZTogY29tcGxldGVGaWxlcy5sZW5ndGgsXG4gICAgICBuZXdGaWxlczogbmV3RmlsZXMubGVuZ3RoLFxuICAgICAgbnVtVXBsb2Fkczogc3RhcnRlZEZpbGVzLmxlbmd0aCxcbiAgICAgIHRvdGFsRVRBOiB0b3RhbEVUQSxcbiAgICAgIGZpbGVzOiBmaWxlcyxcbiAgICAgIGkxOG46IHRoaXMuaTE4bixcbiAgICAgIHBhdXNlQWxsOiB0aGlzLnVwcHkucGF1c2VBbGwsXG4gICAgICByZXN1bWVBbGw6IHRoaXMudXBweS5yZXN1bWVBbGwsXG4gICAgICByZXRyeUFsbDogdGhpcy51cHB5LnJldHJ5QWxsLFxuICAgICAgY2FuY2VsQWxsOiB0aGlzLnVwcHkuY2FuY2VsQWxsLFxuICAgICAgc3RhcnRVcGxvYWQ6IHRoaXMuc3RhcnRVcGxvYWQsXG4gICAgICBkb25lQnV0dG9uSGFuZGxlcjogdGhpcy5vcHRzLmRvbmVCdXR0b25IYW5kbGVyLFxuICAgICAgcmVzdW1hYmxlVXBsb2FkczogcmVzdW1hYmxlVXBsb2FkcyxcbiAgICAgIHN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3M6IHN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MsXG4gICAgICBzaG93UHJvZ3Jlc3NEZXRhaWxzOiB0aGlzLm9wdHMuc2hvd1Byb2dyZXNzRGV0YWlscyxcbiAgICAgIGhpZGVVcGxvYWRCdXR0b246IHRoaXMub3B0cy5oaWRlVXBsb2FkQnV0dG9uLFxuICAgICAgaGlkZVJldHJ5QnV0dG9uOiB0aGlzLm9wdHMuaGlkZVJldHJ5QnV0dG9uLFxuICAgICAgaGlkZVBhdXNlUmVzdW1lQnV0dG9uOiB0aGlzLm9wdHMuaGlkZVBhdXNlUmVzdW1lQnV0dG9uLFxuICAgICAgaGlkZUNhbmNlbEJ1dHRvbjogdGhpcy5vcHRzLmhpZGVDYW5jZWxCdXR0b24sXG4gICAgICBoaWRlQWZ0ZXJGaW5pc2g6IHRoaXMub3B0cy5oaWRlQWZ0ZXJGaW5pc2gsXG4gICAgICBpc1RhcmdldERPTUVsOiB0aGlzLmlzVGFyZ2V0RE9NRWxcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uaW5zdGFsbCA9IGZ1bmN0aW9uIGluc3RhbGwoKSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMub3B0cy50YXJnZXQ7XG5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICB0aGlzLm1vdW50KHRhcmdldCwgdGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by51bmluc3RhbGwgPSBmdW5jdGlvbiB1bmluc3RhbGwoKSB7XG4gICAgdGhpcy51bm1vdW50KCk7XG4gIH07XG5cbiAgcmV0dXJuIFN0YXR1c0Jhcjtcbn0oUGx1Z2luKSwgX2NsYXNzLlZFUlNJT04gPSBcIjEuOC4xXCIsIF90ZW1wKTsiLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHsgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuXG4vKipcbiAqIERlZmF1bHQgc3RvcmUgdGhhdCBrZWVwcyBzdGF0ZSBpbiBhIHNpbXBsZSBvYmplY3QuXG4gKi9cbnZhciBEZWZhdWx0U3RvcmUgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBEZWZhdWx0U3RvcmUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gIH1cblxuICB2YXIgX3Byb3RvID0gRGVmYXVsdFN0b3JlLnByb3RvdHlwZTtcblxuICBfcHJvdG8uZ2V0U3RhdGUgPSBmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgfTtcblxuICBfcHJvdG8uc2V0U3RhdGUgPSBmdW5jdGlvbiBzZXRTdGF0ZShwYXRjaCkge1xuICAgIHZhciBwcmV2U3RhdGUgPSBfZXh0ZW5kcyh7fSwgdGhpcy5zdGF0ZSk7XG5cbiAgICB2YXIgbmV4dFN0YXRlID0gX2V4dGVuZHMoe30sIHRoaXMuc3RhdGUsIHBhdGNoKTtcblxuICAgIHRoaXMuc3RhdGUgPSBuZXh0U3RhdGU7XG5cbiAgICB0aGlzLl9wdWJsaXNoKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBwYXRjaCk7XG4gIH07XG5cbiAgX3Byb3RvLnN1YnNjcmliZSA9IGZ1bmN0aW9uIHN1YnNjcmliZShsaXN0ZW5lcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBsaXN0ZW5lci5cbiAgICAgIF90aGlzLmNhbGxiYWNrcy5zcGxpY2UoX3RoaXMuY2FsbGJhY2tzLmluZGV4T2YobGlzdGVuZXIpLCAxKTtcbiAgICB9O1xuICB9O1xuXG4gIF9wcm90by5fcHVibGlzaCA9IGZ1bmN0aW9uIF9wdWJsaXNoKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB0aGlzLmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgbGlzdGVuZXIuYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gRGVmYXVsdFN0b3JlO1xufSgpO1xuXG5EZWZhdWx0U3RvcmUuVkVSU0lPTiA9IFwiMS4yLjRcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZhdWx0U3RvcmUoKSB7XG4gIHJldHVybiBuZXcgRGVmYXVsdFN0b3JlKCk7XG59OyIsInZhciB0dXMgPSByZXF1aXJlKCd0dXMtanMtY2xpZW50Jyk7XG5cbmZ1bmN0aW9uIGlzQ29yZG92YSgpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICh0eXBlb2Ygd2luZG93LlBob25lR2FwICE9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93LkNvcmRvdmEgIT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW5kb3cuY29yZG92YSAhPT0gJ3VuZGVmaW5lZCcpO1xufVxuXG5mdW5jdGlvbiBpc1JlYWN0TmF0aXZlKCkge1xuICByZXR1cm4gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnc3RyaW5nJyAmJiBuYXZpZ2F0b3IucHJvZHVjdC50b0xvd2VyQ2FzZSgpID09PSAncmVhY3RuYXRpdmUnO1xufSAvLyBXZSBvdmVycmlkZSB0dXMgZmluZ2VycHJpbnQgdG8gdXBweeKAmXMgYGZpbGUuaWRgLCBzaW5jZSB0aGUgYGZpbGUuaWRgXG4vLyBub3cgYWxzbyBpbmNsdWRlcyBgcmVsYXRpdmVQYXRoYCBmb3IgZmlsZXMgYWRkZWQgZnJvbSBmb2xkZXJzLlxuLy8gVGhpcyBtZWFucyB5b3UgY2FuIGFkZCAyIGlkZW50aWNhbCBmaWxlcywgaWYgb25lIGlzIGluIGZvbGRlciBhLFxuLy8gdGhlIG90aGVyIGluIGZvbGRlciBiIOKAlCBgYS9maWxlLmpwZ2AgYW5kIGBiL2ZpbGUuanBnYCwgd2hlbiBhZGRlZFxuLy8gdG9nZXRoZXIgd2l0aCBhIGZvbGRlciwgd2lsbCBiZSB0cmVhdGVkIGFzIDIgc2VwYXJhdGUgZmlsZXMuXG4vL1xuLy8gRm9yIFJlYWN0IE5hdGl2ZSBhbmQgQ29yZG92YSwgd2UgbGV0IHR1cy1qcy1jbGllbnTigJlzIGRlZmF1bHRcbi8vIGZpbmdlcnByaW50IGhhbmRsaW5nIHRha2UgY2hhcmdlLlxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmluZ2VycHJpbnQodXBweUZpbGVPYmopIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChmaWxlLCBvcHRpb25zKSB7XG4gICAgaWYgKGlzQ29yZG92YSgpIHx8IGlzUmVhY3ROYXRpdmUoKSkge1xuICAgICAgcmV0dXJuIHR1cy5kZWZhdWx0T3B0aW9ucy5maW5nZXJwcmludChmaWxlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICB2YXIgdXBweUZpbmdlcnByaW50ID0gWyd0dXMnLCB1cHB5RmlsZU9iai5pZCwgb3B0aW9ucy5lbmRwb2ludF0uam9pbignLScpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodXBweUZpbmdlcnByaW50KTtcbiAgfTtcbn07IiwidmFyIF9jbGFzcywgX3RlbXA7XG5cbmZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTsgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgnQHVwcHkvY29yZScpLFxuICAgIFBsdWdpbiA9IF9yZXF1aXJlLlBsdWdpbjtcblxudmFyIHR1cyA9IHJlcXVpcmUoJ3R1cy1qcy1jbGllbnQnKTtcblxudmFyIF9yZXF1aXJlMiA9IHJlcXVpcmUoJ0B1cHB5L2NvbXBhbmlvbi1jbGllbnQnKSxcbiAgICBQcm92aWRlciA9IF9yZXF1aXJlMi5Qcm92aWRlcixcbiAgICBSZXF1ZXN0Q2xpZW50ID0gX3JlcXVpcmUyLlJlcXVlc3RDbGllbnQsXG4gICAgU29ja2V0ID0gX3JlcXVpcmUyLlNvY2tldDtcblxudmFyIGVtaXRTb2NrZXRQcm9ncmVzcyA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9lbWl0U29ja2V0UHJvZ3Jlc3MnKTtcblxudmFyIGdldFNvY2tldEhvc3QgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0U29ja2V0SG9zdCcpO1xuXG52YXIgc2V0dGxlID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL3NldHRsZScpO1xuXG52YXIgRXZlbnRUcmFja2VyID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL0V2ZW50VHJhY2tlcicpO1xuXG52YXIgTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL05ldHdvcmtFcnJvcicpO1xuXG52YXIgaXNOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvaXNOZXR3b3JrRXJyb3InKTtcblxudmFyIFJhdGVMaW1pdGVkUXVldWUgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvUmF0ZUxpbWl0ZWRRdWV1ZScpO1xuXG52YXIgaGFzUHJvcGVydHkgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvaGFzUHJvcGVydHknKTtcblxudmFyIGdldEZpbmdlcnByaW50ID0gcmVxdWlyZSgnLi9nZXRGaW5nZXJwcmludCcpO1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uJykuVHVzT3B0aW9uc30gVHVzT3B0aW9ucyAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgndHVzLWpzLWNsaWVudCcpLlVwbG9hZE9wdGlvbnN9IFJhd1R1c09wdGlvbnMgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ0B1cHB5L2NvcmUnKS5VcHB5fSBVcHB5ICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdAdXBweS9jb3JlJykuVXBweUZpbGV9IFVwcHlGaWxlICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdAdXBweS9jb3JlJykuRmFpbGVkVXBweUZpbGU8e30+fSBGYWlsZWRVcHB5RmlsZSAqL1xuXG4vKipcbiAqIEV4dHJhY3RlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS90dXMvdHVzLWpzLWNsaWVudC9ibG9iL21hc3Rlci9saWIvdXBsb2FkLmpzI0wxM1xuICogZXhjZXB0ZWQgd2UgcmVtb3ZlZCAnZmluZ2VycHJpbnQnIGtleSB0byBhdm9pZCBhZGRpbmcgbW9yZSBkZXBlbmRlbmNpZXNcbiAqXG4gKiBAdHlwZSB7UmF3VHVzT3B0aW9uc31cbiAqL1xuXG5cbnZhciB0dXNEZWZhdWx0T3B0aW9ucyA9IHtcbiAgZW5kcG9pbnQ6ICcnLFxuICB1cGxvYWRVcmw6IG51bGwsXG4gIG1ldGFkYXRhOiB7fSxcbiAgdXBsb2FkU2l6ZTogbnVsbCxcbiAgb25Qcm9ncmVzczogbnVsbCxcbiAgb25DaHVua0NvbXBsZXRlOiBudWxsLFxuICBvblN1Y2Nlc3M6IG51bGwsXG4gIG9uRXJyb3I6IG51bGwsXG4gIG92ZXJyaWRlUGF0Y2hNZXRob2Q6IGZhbHNlLFxuICBoZWFkZXJzOiB7fSxcbiAgYWRkUmVxdWVzdElkOiBmYWxzZSxcbiAgY2h1bmtTaXplOiBJbmZpbml0eSxcbiAgcmV0cnlEZWxheXM6IFswLCAxMDAwLCAzMDAwLCA1MDAwXSxcbiAgcGFyYWxsZWxVcGxvYWRzOiAxLFxuICBzdG9yZUZpbmdlcnByaW50Rm9yUmVzdW1pbmc6IHRydWUsXG4gIHJlbW92ZUZpbmdlcnByaW50T25TdWNjZXNzOiBmYWxzZSxcbiAgdXBsb2FkTGVuZ3RoRGVmZXJyZWQ6IGZhbHNlLFxuICB1cGxvYWREYXRhRHVyaW5nQ3JlYXRpb246IGZhbHNlXG59O1xuLyoqXG4gKiBUdXMgcmVzdW1hYmxlIGZpbGUgdXBsb2FkZXJcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChfdGVtcCA9IF9jbGFzcyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX1BsdWdpbikge1xuICBfaW5oZXJpdHNMb29zZShUdXMsIF9QbHVnaW4pO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1VwcHl9IHVwcHlcbiAgICogQHBhcmFtIHtUdXNPcHRpb25zfSBvcHRzXG4gICAqL1xuICBmdW5jdGlvbiBUdXModXBweSwgb3B0cykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX1BsdWdpbi5jYWxsKHRoaXMsIHVwcHksIG9wdHMpIHx8IHRoaXM7XG4gICAgX3RoaXMudHlwZSA9ICd1cGxvYWRlcic7XG4gICAgX3RoaXMuaWQgPSBfdGhpcy5vcHRzLmlkIHx8ICdUdXMnO1xuICAgIF90aGlzLnRpdGxlID0gJ1R1cyc7IC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcblxuICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGF1dG9SZXRyeTogdHJ1ZSxcbiAgICAgIHJlc3VtZTogdHJ1ZSxcbiAgICAgIHVzZUZhc3RSZW1vdGVSZXRyeTogdHJ1ZSxcbiAgICAgIGxpbWl0OiAwLFxuICAgICAgcmV0cnlEZWxheXM6IFswLCAxMDAwLCAzMDAwLCA1MDAwXSxcbiAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2VcbiAgICB9OyAvLyBtZXJnZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgb25lcyBzZXQgYnkgdXNlclxuXG4gICAgLyoqIEB0eXBlIHtpbXBvcnQoXCIuLlwiKS5UdXNPcHRpb25zfSAqL1xuXG4gICAgX3RoaXMub3B0cyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0cyk7XG4gICAgLyoqXG4gICAgICogU2ltdWx0YW5lb3VzIHVwbG9hZCBsaW1pdGluZyBpcyBzaGFyZWQgYWNyb3NzIGFsbCB1cGxvYWRzIHdpdGggdGhpcyBwbHVnaW4uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7UmF0ZUxpbWl0ZWRRdWV1ZX1cbiAgICAgKi9cblxuICAgIF90aGlzLnJlcXVlc3RzID0gbmV3IFJhdGVMaW1pdGVkUXVldWUoX3RoaXMub3B0cy5saW1pdCk7XG4gICAgX3RoaXMudXBsb2FkZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBfdGhpcy51cGxvYWRlckV2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgX3RoaXMudXBsb2FkZXJTb2NrZXRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBfdGhpcy5oYW5kbGVSZXNldFByb2dyZXNzID0gX3RoaXMuaGFuZGxlUmVzZXRQcm9ncmVzcy5iaW5kKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKTtcbiAgICBfdGhpcy5oYW5kbGVVcGxvYWQgPSBfdGhpcy5oYW5kbGVVcGxvYWQuYmluZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFR1cy5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmhhbmRsZVJlc2V0UHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVSZXNldFByb2dyZXNzKCkge1xuICAgIHZhciBmaWxlcyA9IF9leHRlbmRzKHt9LCB0aGlzLnVwcHkuZ2V0U3RhdGUoKS5maWxlcyk7XG5cbiAgICBPYmplY3Qua2V5cyhmaWxlcykuZm9yRWFjaChmdW5jdGlvbiAoZmlsZUlEKSB7XG4gICAgICAvLyBPbmx5IGNsb25lIHRoZSBmaWxlIG9iamVjdCBpZiBpdCBoYXMgYSBUdXMgYHVwbG9hZFVybGAgYXR0YWNoZWQuXG4gICAgICBpZiAoZmlsZXNbZmlsZUlEXS50dXMgJiYgZmlsZXNbZmlsZUlEXS50dXMudXBsb2FkVXJsKSB7XG4gICAgICAgIHZhciB0dXNTdGF0ZSA9IF9leHRlbmRzKHt9LCBmaWxlc1tmaWxlSURdLnR1cyk7XG5cbiAgICAgICAgZGVsZXRlIHR1c1N0YXRlLnVwbG9hZFVybDtcbiAgICAgICAgZmlsZXNbZmlsZUlEXSA9IF9leHRlbmRzKHt9LCBmaWxlc1tmaWxlSURdLCB7XG4gICAgICAgICAgdHVzOiB0dXNTdGF0ZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnVwcHkuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IGZpbGVzXG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIENsZWFuIHVwIGFsbCByZWZlcmVuY2VzIGZvciBhIGZpbGUncyB1cGxvYWQ6IHRoZSB0dXMuVXBsb2FkIGluc3RhbmNlLFxuICAgKiBhbnkgZXZlbnRzIHJlbGF0ZWQgdG8gdGhlIGZpbGUsIGFuZCB0aGUgQ29tcGFuaW9uIFdlYlNvY2tldCBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzID0gZnVuY3Rpb24gcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZUlELCBvcHRzKSB7XG4gICAgaWYgKG9wdHMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0cyA9IHt9O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnVwbG9hZGVyc1tmaWxlSURdKSB7XG4gICAgICB2YXIgdXBsb2FkZXIgPSB0aGlzLnVwbG9hZGVyc1tmaWxlSURdO1xuICAgICAgdXBsb2FkZXIuYWJvcnQoKTtcblxuICAgICAgaWYgKG9wdHMuYWJvcnQpIHtcbiAgICAgICAgLy8gdG8gYXZvaWQgNDIzIGVycm9yIGZyb20gdHVzIHNlcnZlciwgd2Ugd2FpdFxuICAgICAgICAvLyB0byBiZSBzdXJlIHRoZSBwcmV2aW91cyByZXF1ZXN0IGhhcyBiZWVuIGFib3J0ZWQgYmVmb3JlIHRlcm1pbmF0aW5nIHRoZSB1cGxvYWRcbiAgICAgICAgLy8gQHRvZG8gcmVtb3ZlIHRoZSB0aW1lb3V0IHdoZW4gdGhpcyBcIndhaXRcIiBpcyBoYW5kbGVkIGluIHR1cy1qcy1jbGllbnQgaW50ZXJuYWxseVxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdXBsb2FkZXIuYWJvcnQodHJ1ZSk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnVwbG9hZGVyc1tmaWxlSURdID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdKSB7XG4gICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ucmVtb3ZlKCk7XG4gICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0gPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnVwbG9hZGVyU29ja2V0c1tmaWxlSURdKSB7XG4gICAgICB0aGlzLnVwbG9hZGVyU29ja2V0c1tmaWxlSURdLmNsb3NlKCk7XG4gICAgICB0aGlzLnVwbG9hZGVyU29ja2V0c1tmaWxlSURdID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBUdXMgdXBsb2FkLlxuICAgKlxuICAgKiBBIGxvdCBjYW4gaGFwcGVuIGR1cmluZyBhbiB1cGxvYWQsIHNvIHRoaXMgaXMgcXVpdGUgaGFyZCB0byBmb2xsb3chXG4gICAqIC0gRmlyc3QsIHRoZSB1cGxvYWQgaXMgc3RhcnRlZC4gSWYgdGhlIGZpbGUgd2FzIGFscmVhZHkgcGF1c2VkIGJ5IHRoZSB0aW1lIHRoZSB1cGxvYWQgc3RhcnRzLCBub3RoaW5nIHNob3VsZCBoYXBwZW4uXG4gICAqICAgSWYgdGhlIGBsaW1pdGAgb3B0aW9uIGlzIHVzZWQsIHRoZSB1cGxvYWQgbXVzdCBiZSBxdWV1ZWQgb250byB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLlxuICAgKiAgIFdoZW4gYW4gdXBsb2FkIHN0YXJ0cywgd2Ugc3RvcmUgdGhlIHR1cy5VcGxvYWQgaW5zdGFuY2UsIGFuZCBhbiBFdmVudFRyYWNrZXIgaW5zdGFuY2UgdGhhdCBtYW5hZ2VzIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICogICBmb3IgcGF1c2luZywgY2FuY2VsbGF0aW9uLCByZW1vdmFsLCBldGMuXG4gICAqIC0gV2hpbGUgdGhlIHVwbG9hZCBpcyBpbiBwcm9ncmVzcywgaXQgbWF5IGJlIHBhdXNlZCBvciBjYW5jZWxsZWQuXG4gICAqICAgUGF1c2luZyBhYm9ydHMgdGhlIHVuZGVybHlpbmcgdHVzLlVwbG9hZCwgYW5kIHJlbW92ZXMgdGhlIHVwbG9hZCBmcm9tIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUuIEFsbCBvdGhlciBzdGF0ZSBpc1xuICAgKiAgIG1haW50YWluZWQuXG4gICAqICAgQ2FuY2VsbGluZyByZW1vdmVzIHRoZSB1cGxvYWQgZnJvbSB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLCBhbmQgY29tcGxldGVseSBhYm9ydHMgdGhlIHVwbG9hZC0tdGhlIHR1cy5VcGxvYWQgaW5zdGFuY2VcbiAgICogICBpcyBhYm9ydGVkIGFuZCBkaXNjYXJkZWQsIHRoZSBFdmVudFRyYWNrZXIgaW5zdGFuY2UgaXMgZGVzdHJveWVkIChyZW1vdmluZyBhbGwgbGlzdGVuZXJzKS5cbiAgICogICBSZXN1bWluZyB0aGUgdXBsb2FkIHVzZXMgdGhlIGB0aGlzLnJlcXVlc3RzYCBxdWV1ZSBhcyB3ZWxsLCB0byBwcmV2ZW50IHNlbGVjdGl2ZWx5IHBhdXNpbmcgYW5kIHJlc3VtaW5nIHVwbG9hZHMgZnJvbVxuICAgKiAgIGJ5cGFzc2luZyB0aGUgbGltaXQuXG4gICAqIC0gQWZ0ZXIgY29tcGxldGluZyBhbiB1cGxvYWQsIHRoZSB0dXMuVXBsb2FkIGFuZCBFdmVudFRyYWNrZXIgaW5zdGFuY2VzIGFyZSBjbGVhbmVkIHVwLCBhbmQgdGhlIHVwbG9hZCBpcyBtYXJrZWQgYXMgZG9uZVxuICAgKiAgIGluIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUuXG4gICAqIC0gV2hlbiBhbiB1cGxvYWQgY29tcGxldGVkIHdpdGggYW4gZXJyb3IsIHRoZSBzYW1lIGhhcHBlbnMgYXMgb24gc3VjY2Vzc2Z1bCBjb21wbGV0aW9uLCBidXQgdGhlIGB1cGxvYWQoKWAgcHJvbWlzZSBpcyByZWplY3RlZC5cbiAgICpcbiAgICogV2hlbiB3b3JraW5nIG9uIHRoaXMgZnVuY3Rpb24sIGtlZXAgaW4gbWluZDpcbiAgICogIC0gV2hlbiBhbiB1cGxvYWQgaXMgY29tcGxldGVkIG9yIGNhbmNlbGxlZCBmb3IgYW55IHJlYXNvbiwgdGhlIHR1cy5VcGxvYWQgYW5kIEV2ZW50VHJhY2tlciBpbnN0YW5jZXMgbmVlZCB0byBiZSBjbGVhbmVkIHVwIHVzaW5nIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKS5cbiAgICogIC0gV2hlbiBhbiB1cGxvYWQgaXMgY2FuY2VsbGVkIG9yIHBhdXNlZCwgZm9yIGFueSByZWFzb24sIGl0IG5lZWRzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlIHVzaW5nIGBxdWV1ZWRSZXF1ZXN0LmFib3J0KClgLlxuICAgKiAgLSBXaGVuIGFuIHVwbG9hZCBpcyBjb21wbGV0ZWQgZm9yIGFueSByZWFzb24sIGluY2x1ZGluZyBlcnJvcnMsIGl0IG5lZWRzIHRvIGJlIG1hcmtlZCBhcyBzdWNoIHVzaW5nIGBxdWV1ZWRSZXF1ZXN0LmRvbmUoKWAuXG4gICAqICAtIFdoZW4gYW4gdXBsb2FkIGlzIHN0YXJ0ZWQgb3IgcmVzdW1lZCwgaXQgbmVlZHMgdG8gZ28gdGhyb3VnaCB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLiBUaGUgYHF1ZXVlZFJlcXVlc3RgIHZhcmlhYmxlIG11c3QgYmUgdXBkYXRlZCBzbyB0aGUgb3RoZXIgdXNlcyBvZiBpdCBhcmUgdmFsaWQuXG4gICAqICAtIEJlZm9yZSByZXBsYWNpbmcgdGhlIGBxdWV1ZWRSZXF1ZXN0YCB2YXJpYWJsZSwgdGhlIHByZXZpb3VzIGBxdWV1ZWRSZXF1ZXN0YCBtdXN0IGJlIGFib3J0ZWQsIGVsc2UgaXQgd2lsbCBrZWVwIHRha2luZyB1cCBhIHNwb3QgaW4gdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1VwcHlGaWxlfSBmaWxlIGZvciB1c2Ugd2l0aCB1cGxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnQgZmlsZSBpbiBhIHF1ZXVlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbCBudW1iZXIgb2YgZmlsZXMgaW4gYSBxdWV1ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIDtcblxuICBfcHJvdG8udXBsb2FkID0gZnVuY3Rpb24gdXBsb2FkKGZpbGUsIGN1cnJlbnQsIHRvdGFsKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpOyAvLyBDcmVhdGUgYSBuZXcgdHVzIHVwbG9hZFxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIF90aGlzMi51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSk7XG5cbiAgICAgIHZhciBvcHRzID0gX2V4dGVuZHMoe30sIF90aGlzMi5vcHRzLCBmaWxlLnR1cyB8fCB7fSk7XG4gICAgICAvKiogQHR5cGUge1Jhd1R1c09wdGlvbnN9ICovXG5cblxuICAgICAgdmFyIHVwbG9hZE9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgdHVzRGVmYXVsdE9wdGlvbnMsIG9wdHMpO1xuXG4gICAgICBkZWxldGUgdXBsb2FkT3B0aW9ucy5yZXN1bWU7IC8vIE1ha2UgYHJlc3VtZTogdHJ1ZWAgd29yayBsaWtlIGl0IGRpZCBpbiB0dXMtanMtY2xpZW50IHYxLlxuICAgICAgLy8gVE9ETzogUmVtb3ZlIGluIEB1cHB5L3R1cyB2MlxuXG4gICAgICBpZiAob3B0cy5yZXN1bWUpIHtcbiAgICAgICAgdXBsb2FkT3B0aW9ucy5zdG9yZUZpbmdlcnByaW50Rm9yUmVzdW1pbmcgPSB0cnVlO1xuICAgICAgfSAvLyBXZSBvdmVycmlkZSB0dXMgZmluZ2VycHJpbnQgdG8gdXBweeKAmXMgYGZpbGUuaWRgLCBzaW5jZSB0aGUgYGZpbGUuaWRgXG4gICAgICAvLyBub3cgYWxzbyBpbmNsdWRlcyBgcmVsYXRpdmVQYXRoYCBmb3IgZmlsZXMgYWRkZWQgZnJvbSBmb2xkZXJzLlxuICAgICAgLy8gVGhpcyBtZWFucyB5b3UgY2FuIGFkZCAyIGlkZW50aWNhbCBmaWxlcywgaWYgb25lIGlzIGluIGZvbGRlciBhLFxuICAgICAgLy8gdGhlIG90aGVyIGluIGZvbGRlciBiLlxuXG5cbiAgICAgIHVwbG9hZE9wdGlvbnMuZmluZ2VycHJpbnQgPSBnZXRGaW5nZXJwcmludChmaWxlKTtcblxuICAgICAgdXBsb2FkT3B0aW9ucy5vbkJlZm9yZVJlcXVlc3QgPSBmdW5jdGlvbiAocmVxKSB7XG4gICAgICAgIHZhciB4aHIgPSByZXEuZ2V0VW5kZXJseWluZ09iamVjdCgpO1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gISFvcHRzLndpdGhDcmVkZW50aWFscztcblxuICAgICAgICBpZiAodHlwZW9mIG9wdHMub25CZWZvcmVSZXF1ZXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgb3B0cy5vbkJlZm9yZVJlcXVlc3QocmVxKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdXBsb2FkT3B0aW9ucy5vbkVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICBfdGhpczIudXBweS5sb2coZXJyKTtcblxuICAgICAgICB2YXIgeGhyID0gZXJyLm9yaWdpbmFsUmVxdWVzdCA/IGVyci5vcmlnaW5hbFJlcXVlc3QuZ2V0VW5kZXJseWluZ09iamVjdCgpIDogbnVsbDtcblxuICAgICAgICBpZiAoaXNOZXR3b3JrRXJyb3IoeGhyKSkge1xuICAgICAgICAgIGVyciA9IG5ldyBOZXR3b3JrRXJyb3IoZXJyLCB4aHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMyLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpO1xuXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpO1xuXG4gICAgICAgIF90aGlzMi51cHB5LmVtaXQoJ3VwbG9hZC1lcnJvcicsIGZpbGUsIGVycik7XG5cbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9O1xuXG4gICAgICB1cGxvYWRPcHRpb25zLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoYnl0ZXNVcGxvYWRlZCwgYnl0ZXNUb3RhbCkge1xuICAgICAgICBfdGhpczIub25SZWNlaXZlVXBsb2FkVXJsKGZpbGUsIHVwbG9hZC51cmwpO1xuXG4gICAgICAgIF90aGlzMi51cHB5LmVtaXQoJ3VwbG9hZC1wcm9ncmVzcycsIGZpbGUsIHtcbiAgICAgICAgICB1cGxvYWRlcjogX3RoaXMyLFxuICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IGJ5dGVzVXBsb2FkZWQsXG4gICAgICAgICAgYnl0ZXNUb3RhbDogYnl0ZXNUb3RhbFxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHVwbG9hZE9wdGlvbnMub25TdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdXBsb2FkUmVzcCA9IHtcbiAgICAgICAgICB1cGxvYWRVUkw6IHVwbG9hZC51cmxcbiAgICAgICAgfTtcblxuICAgICAgICBfdGhpczIucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZCk7XG5cbiAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKCk7XG5cbiAgICAgICAgX3RoaXMyLnVwcHkuZW1pdCgndXBsb2FkLXN1Y2Nlc3MnLCBmaWxlLCB1cGxvYWRSZXNwKTtcblxuICAgICAgICBpZiAodXBsb2FkLnVybCkge1xuICAgICAgICAgIF90aGlzMi51cHB5LmxvZygnRG93bmxvYWQgJyArIHVwbG9hZC5maWxlLm5hbWUgKyAnIGZyb20gJyArIHVwbG9hZC51cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSh1cGxvYWQpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGNvcHlQcm9wID0gZnVuY3Rpb24gY29weVByb3Aob2JqLCBzcmNQcm9wLCBkZXN0UHJvcCkge1xuICAgICAgICBpZiAoaGFzUHJvcGVydHkob2JqLCBzcmNQcm9wKSAmJiAhaGFzUHJvcGVydHkob2JqLCBkZXN0UHJvcCkpIHtcbiAgICAgICAgICBvYmpbZGVzdFByb3BdID0gb2JqW3NyY1Byb3BdO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSAqL1xuXG5cbiAgICAgIHZhciBtZXRhID0ge307XG4gICAgICB2YXIgbWV0YUZpZWxkcyA9IEFycmF5LmlzQXJyYXkob3B0cy5tZXRhRmllbGRzKSA/IG9wdHMubWV0YUZpZWxkcyAvLyBTZW5kIGFsb25nIGFsbCBmaWVsZHMgYnkgZGVmYXVsdC5cbiAgICAgIDogT2JqZWN0LmtleXMoZmlsZS5tZXRhKTtcbiAgICAgIG1ldGFGaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBtZXRhW2l0ZW1dID0gZmlsZS5tZXRhW2l0ZW1dO1xuICAgICAgfSk7IC8vIHR1c2QgdXNlcyBtZXRhZGF0YSBmaWVsZHMgJ2ZpbGV0eXBlJyBhbmQgJ2ZpbGVuYW1lJ1xuXG4gICAgICBjb3B5UHJvcChtZXRhLCAndHlwZScsICdmaWxldHlwZScpO1xuICAgICAgY29weVByb3AobWV0YSwgJ25hbWUnLCAnZmlsZW5hbWUnKTtcbiAgICAgIHVwbG9hZE9wdGlvbnMubWV0YWRhdGEgPSBtZXRhO1xuICAgICAgdmFyIHVwbG9hZCA9IG5ldyB0dXMuVXBsb2FkKGZpbGUuZGF0YSwgdXBsb2FkT3B0aW9ucyk7XG4gICAgICBfdGhpczIudXBsb2FkZXJzW2ZpbGUuaWRdID0gdXBsb2FkO1xuICAgICAgX3RoaXMyLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdID0gbmV3IEV2ZW50VHJhY2tlcihfdGhpczIudXBweSk7IC8vIE1ha2UgYHJlc3VtZTogdHJ1ZWAgd29yayBsaWtlIGl0IGRpZCBpbiB0dXMtanMtY2xpZW50IHYxLlxuICAgICAgLy8gVE9ETzogUmVtb3ZlIGluIEB1cHB5L3R1cyB2Mi5cblxuICAgICAgaWYgKG9wdHMucmVzdW1lKSB7XG4gICAgICAgIHVwbG9hZC5maW5kUHJldmlvdXNVcGxvYWRzKCkudGhlbihmdW5jdGlvbiAocHJldmlvdXNVcGxvYWRzKSB7XG4gICAgICAgICAgdmFyIHByZXZpb3VzVXBsb2FkID0gcHJldmlvdXNVcGxvYWRzWzBdO1xuXG4gICAgICAgICAgaWYgKHByZXZpb3VzVXBsb2FkKSB7XG4gICAgICAgICAgICBfdGhpczIudXBweS5sb2coXCJbVHVzXSBSZXN1bWluZyB1cGxvYWQgb2YgXCIgKyBmaWxlLmlkICsgXCIgc3RhcnRlZCBhdCBcIiArIHByZXZpb3VzVXBsb2FkLmNyZWF0aW9uVGltZSk7XG5cbiAgICAgICAgICAgIHVwbG9hZC5yZXN1bWVGcm9tUHJldmlvdXNVcGxvYWQocHJldmlvdXNVcGxvYWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBxdWV1ZWRSZXF1ZXN0ID0gX3RoaXMyLnJlcXVlc3RzLnJ1bihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghZmlsZS5pc1BhdXNlZCkge1xuICAgICAgICAgIC8vIEVuc3VyZSB0aGlzIGdldHMgc2NoZWR1bGVkIHRvIHJ1biBfYWZ0ZXJfIGBmaW5kUHJldmlvdXNVcGxvYWRzKClgIHJldHVybnMuXG4gICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIGluIEB1cHB5L3R1cyB2Mi5cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHVwbG9hZC5zdGFydCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IC8vIERvbid0IGRvIGFueXRoaW5nIGhlcmUsIHRoZSBjYWxsZXIgd2lsbCB0YWtlIGNhcmUgb2YgY2FuY2VsbGluZyB0aGUgdXBsb2FkIGl0c2VsZlxuICAgICAgICAvLyB1c2luZyByZXNldFVwbG9hZGVyUmVmZXJlbmNlcygpLiBUaGlzIGlzIGJlY2F1c2UgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKSBoYXMgdG8gYmVcbiAgICAgICAgLy8gY2FsbGVkIHdoZW4gdGhpcyByZXF1ZXN0IGlzIHN0aWxsIGluIHRoZSBxdWV1ZSwgYW5kIGhhcyBub3QgYmVlbiBzdGFydGVkIHlldCwgdG9vLiBBdFxuICAgICAgICAvLyB0aGF0IHBvaW50IHRoaXMgY2FuY2VsbGF0aW9uIGZ1bmN0aW9uIGlzIG5vdCBnb2luZyB0byBiZSBjYWxsZWQuXG4gICAgICAgIC8vIEFsc28sIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSByZXF1ZXN0IGZyb20gdGhlIHF1ZXVlIF93aXRob3V0XyBkZXN0cm95aW5nIGV2ZXJ5dGhpbmdcbiAgICAgICAgLy8gcmVsYXRlZCB0byB0aGlzIHVwbG9hZCB0byBoYW5kbGUgcGF1c2VzLlxuXG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHt9O1xuICAgICAgfSk7XG5cbiAgICAgIF90aGlzMi5vbkZpbGVSZW1vdmUoZmlsZS5pZCwgZnVuY3Rpb24gKHRhcmdldEZpbGVJRCkge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KCk7XG5cbiAgICAgICAgX3RoaXMyLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQsIHtcbiAgICAgICAgICBhYm9ydDogISF1cGxvYWQudXJsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmUoXCJ1cGxvYWQgXCIgKyB0YXJnZXRGaWxlSUQgKyBcIiB3YXMgcmVtb3ZlZFwiKTtcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpczIub25QYXVzZShmaWxlLmlkLCBmdW5jdGlvbiAoaXNQYXVzZWQpIHtcbiAgICAgICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHRoaXMgZmlsZSBmcm9tIHRoZSBxdWV1ZSBzbyBhbm90aGVyIGZpbGUgY2FuIHN0YXJ0IGluIGl0cyBwbGFjZS5cbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgICAgdXBsb2FkLmFib3J0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmVzdW1pbmcgYW4gdXBsb2FkIHNob3VsZCBiZSBxdWV1ZWQsIGVsc2UgeW91IGNvdWxkIHBhdXNlIGFuZCB0aGVuIHJlc3VtZSBhIHF1ZXVlZCB1cGxvYWQgdG8gbWFrZSBpdCBza2lwIHRoZSBxdWV1ZS5cbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgICAgcXVldWVkUmVxdWVzdCA9IF90aGlzMi5yZXF1ZXN0cy5ydW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXBsb2FkLnN0YXJ0KCk7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBfdGhpczIub25QYXVzZUFsbChmaWxlLmlkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgdXBsb2FkLmFib3J0KCk7XG4gICAgICB9KTtcblxuICAgICAgX3RoaXMyLm9uQ2FuY2VsQWxsKGZpbGUuaWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpO1xuXG4gICAgICAgIF90aGlzMi5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkLCB7XG4gICAgICAgICAgYWJvcnQ6ICEhdXBsb2FkLnVybFxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlKFwidXBsb2FkIFwiICsgZmlsZS5pZCArIFwiIHdhcyBjYW5jZWxlZFwiKTtcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpczIub25SZXN1bWVBbGwoZmlsZS5pZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KCk7XG5cbiAgICAgICAgaWYgKGZpbGUuZXJyb3IpIHtcbiAgICAgICAgICB1cGxvYWQuYWJvcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QgPSBfdGhpczIucmVxdWVzdHMucnVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB1cGxvYWQuc3RhcnQoKTtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgX3RoaXMyLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyKTtcblxuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge1VwcHlGaWxlfSBmaWxlIGZvciB1c2Ugd2l0aCB1cGxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnQgZmlsZSBpbiBhIHF1ZXVlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbCBudW1iZXIgb2YgZmlsZXMgaW4gYSBxdWV1ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIDtcblxuICBfcHJvdG8udXBsb2FkUmVtb3RlID0gZnVuY3Rpb24gdXBsb2FkUmVtb3RlKGZpbGUsIGN1cnJlbnQsIHRvdGFsKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpO1xuXG4gICAgdmFyIG9wdHMgPSBfZXh0ZW5kcyh7fSwgdGhpcy5vcHRzKTtcblxuICAgIGlmIChmaWxlLnR1cykge1xuICAgICAgLy8gSW5zdGFsbCBmaWxlLXNwZWNpZmljIHVwbG9hZCBvdmVycmlkZXMuXG4gICAgICBfZXh0ZW5kcyhvcHRzLCBmaWxlLnR1cyk7XG4gICAgfVxuXG4gICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSk7XG4gICAgdGhpcy51cHB5LmxvZyhmaWxlLnJlbW90ZS51cmwpO1xuXG4gICAgaWYgKGZpbGUuc2VydmVyVG9rZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3RUb1NlcnZlclNvY2tldChmaWxlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIENsaWVudCA9IGZpbGUucmVtb3RlLnByb3ZpZGVyT3B0aW9ucy5wcm92aWRlciA/IFByb3ZpZGVyIDogUmVxdWVzdENsaWVudDtcbiAgICAgIHZhciBjbGllbnQgPSBuZXcgQ2xpZW50KF90aGlzMy51cHB5LCBmaWxlLnJlbW90ZS5wcm92aWRlck9wdGlvbnMpOyAvLyAhISBjYW5jZWxsYXRpb24gaXMgTk9UIHN1cHBvcnRlZCBhdCB0aGlzIHN0YWdlIHlldFxuXG4gICAgICBjbGllbnQucG9zdChmaWxlLnJlbW90ZS51cmwsIF9leHRlbmRzKHt9LCBmaWxlLnJlbW90ZS5ib2R5LCB7XG4gICAgICAgIGVuZHBvaW50OiBvcHRzLmVuZHBvaW50LFxuICAgICAgICB1cGxvYWRVcmw6IG9wdHMudXBsb2FkVXJsLFxuICAgICAgICBwcm90b2NvbDogJ3R1cycsXG4gICAgICAgIHNpemU6IGZpbGUuZGF0YS5zaXplLFxuICAgICAgICBoZWFkZXJzOiBvcHRzLmhlYWRlcnMsXG4gICAgICAgIG1ldGFkYXRhOiBmaWxlLm1ldGFcbiAgICAgIH0pKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgX3RoaXMzLnVwcHkuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgICBzZXJ2ZXJUb2tlbjogcmVzLnRva2VuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZpbGUgPSBfdGhpczMudXBweS5nZXRGaWxlKGZpbGUuaWQpO1xuICAgICAgICByZXR1cm4gX3RoaXMzLmNvbm5lY3RUb1NlcnZlclNvY2tldChmaWxlKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzMy51cHB5LmVtaXQoJ3VwbG9hZC1lcnJvcicsIGZpbGUsIGVycik7XG5cbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogU2VlIHRoZSBjb21tZW50IG9uIHRoZSB1cGxvYWQoKSBtZXRob2QuXG4gICAqXG4gICAqIEFkZGl0aW9uYWxseSwgd2hlbiBhbiB1cGxvYWQgaXMgcmVtb3ZlZCwgY29tcGxldGVkLCBvciBjYW5jZWxsZWQsIHdlIG5lZWQgdG8gY2xvc2UgdGhlIFdlYlNvY2tldCBjb25uZWN0aW9uLiBUaGlzIGlzIGhhbmRsZWQgYnkgdGhlIHJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKCkgZnVuY3Rpb24sIHNvIHRoZSBzYW1lIGd1aWRlbGluZXMgYXBwbHkgYXMgaW4gdXBsb2FkKCkuXG4gICAqXG4gICAqIEBwYXJhbSB7VXBweUZpbGV9IGZpbGVcbiAgICovXG4gIDtcblxuICBfcHJvdG8uY29ubmVjdFRvU2VydmVyU29ja2V0ID0gZnVuY3Rpb24gY29ubmVjdFRvU2VydmVyU29ja2V0KGZpbGUpIHtcbiAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgdG9rZW4gPSBmaWxlLnNlcnZlclRva2VuO1xuICAgICAgdmFyIGhvc3QgPSBnZXRTb2NrZXRIb3N0KGZpbGUucmVtb3RlLmNvbXBhbmlvblVybCk7XG4gICAgICB2YXIgc29ja2V0ID0gbmV3IFNvY2tldCh7XG4gICAgICAgIHRhcmdldDogaG9zdCArIFwiL2FwaS9cIiArIHRva2VuLFxuICAgICAgICBhdXRvT3BlbjogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgX3RoaXM0LnVwbG9hZGVyU29ja2V0c1tmaWxlLmlkXSA9IHNvY2tldDtcbiAgICAgIF90aGlzNC51cGxvYWRlckV2ZW50c1tmaWxlLmlkXSA9IG5ldyBFdmVudFRyYWNrZXIoX3RoaXM0LnVwcHkpO1xuXG4gICAgICBfdGhpczQub25GaWxlUmVtb3ZlKGZpbGUuaWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpOyAvLyBzdGlsbCBzZW5kIHBhdXNlIGV2ZW50IGluIGNhc2Ugd2UgYXJlIGRlYWxpbmcgd2l0aCBvbGRlciB2ZXJzaW9uIG9mIGNvbXBhbmlvblxuICAgICAgICAvLyBAdG9kbyBkb24ndCBzZW5kIHBhdXNlIGV2ZW50IGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuXG5cbiAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pO1xuICAgICAgICBzb2NrZXQuc2VuZCgnY2FuY2VsJywge30pO1xuXG4gICAgICAgIF90aGlzNC5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKTtcblxuICAgICAgICByZXNvbHZlKFwidXBsb2FkIFwiICsgZmlsZS5pZCArIFwiIHdhcyByZW1vdmVkXCIpO1xuICAgICAgfSk7XG5cbiAgICAgIF90aGlzNC5vblBhdXNlKGZpbGUuaWQsIGZ1bmN0aW9uIChpc1BhdXNlZCkge1xuICAgICAgICBpZiAoaXNQYXVzZWQpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgdGhpcyBmaWxlIGZyb20gdGhlIHF1ZXVlIHNvIGFub3RoZXIgZmlsZSBjYW4gc3RhcnQgaW4gaXRzIHBsYWNlLlxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmVzdW1pbmcgYW4gdXBsb2FkIHNob3VsZCBiZSBxdWV1ZWQsIGVsc2UgeW91IGNvdWxkIHBhdXNlIGFuZCB0aGVuIHJlc3VtZSBhIHF1ZXVlZCB1cGxvYWQgdG8gbWFrZSBpdCBza2lwIHRoZSBxdWV1ZS5cbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgICAgcXVldWVkUmVxdWVzdCA9IF90aGlzNC5yZXF1ZXN0cy5ydW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc29ja2V0LnNlbmQoJ3Jlc3VtZScsIHt9KTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIF90aGlzNC5vblBhdXNlQWxsKGZpbGUuaWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSk7XG4gICAgICB9KTtcblxuICAgICAgX3RoaXM0Lm9uQ2FuY2VsQWxsKGZpbGUuaWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpOyAvLyBzdGlsbCBzZW5kIHBhdXNlIGV2ZW50IGluIGNhc2Ugd2UgYXJlIGRlYWxpbmcgd2l0aCBvbGRlciB2ZXJzaW9uIG9mIGNvbXBhbmlvblxuICAgICAgICAvLyBAdG9kbyBkb24ndCBzZW5kIHBhdXNlIGV2ZW50IGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuXG5cbiAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pO1xuICAgICAgICBzb2NrZXQuc2VuZCgnY2FuY2VsJywge30pO1xuXG4gICAgICAgIF90aGlzNC5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKTtcblxuICAgICAgICByZXNvbHZlKFwidXBsb2FkIFwiICsgZmlsZS5pZCArIFwiIHdhcyBjYW5jZWxlZFwiKTtcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpczQub25SZXN1bWVBbGwoZmlsZS5pZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KCk7XG5cbiAgICAgICAgaWYgKGZpbGUuZXJyb3IpIHtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSk7XG4gICAgICAgIH1cblxuICAgICAgICBxdWV1ZWRSZXF1ZXN0ID0gX3RoaXM0LnJlcXVlc3RzLnJ1bihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3Jlc3VtZScsIHt9KTtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIF90aGlzNC5vblJldHJ5KGZpbGUuaWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gT25seSBkbyB0aGUgcmV0cnkgaWYgdGhlIHVwbG9hZCBpcyBhY3R1YWxseSBpbiBwcm9ncmVzcztcbiAgICAgICAgLy8gZWxzZSB3ZSBjb3VsZCB0cnkgdG8gc2VuZCB0aGVzZSBtZXNzYWdlcyB3aGVuIHRoZSB1cGxvYWQgaXMgc3RpbGwgcXVldWVkLlxuICAgICAgICAvLyBXZSBtYXkgbmVlZCBhIGJldHRlciBjaGVjayBmb3IgdGhpcyBzaW5jZSB0aGUgc29ja2V0IG1heSBhbHNvIGJlIGNsb3NlZFxuICAgICAgICAvLyBmb3Igb3RoZXIgcmVhc29ucywgbGlrZSBuZXR3b3JrIGZhaWx1cmVzLlxuICAgICAgICBpZiAoc29ja2V0LmlzT3Blbikge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdwYXVzZScsIHt9KTtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncmVzdW1lJywge30pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgX3RoaXM0Lm9uUmV0cnlBbGwoZmlsZS5pZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBTZWUgdGhlIGNvbW1lbnQgaW4gdGhlIG9uUmV0cnkoKSBjYWxsXG4gICAgICAgIGlmIChzb2NrZXQuaXNPcGVuKSB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pO1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdyZXN1bWUnLCB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBzb2NrZXQub24oJ3Byb2dyZXNzJywgZnVuY3Rpb24gKHByb2dyZXNzRGF0YSkge1xuICAgICAgICByZXR1cm4gZW1pdFNvY2tldFByb2dyZXNzKF90aGlzNCwgcHJvZ3Jlc3NEYXRhLCBmaWxlKTtcbiAgICAgIH0pO1xuICAgICAgc29ja2V0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJEYXRhKSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gZXJyRGF0YS5lcnJvci5tZXNzYWdlO1xuXG4gICAgICAgIHZhciBlcnJvciA9IF9leHRlbmRzKG5ldyBFcnJvcihtZXNzYWdlKSwge1xuICAgICAgICAgIGNhdXNlOiBlcnJEYXRhLmVycm9yXG4gICAgICAgIH0pOyAvLyBJZiB0aGUgcmVtb3RlIHJldHJ5IG9wdGltaXNhdGlvbiBzaG91bGQgbm90IGJlIHVzZWQsXG4gICAgICAgIC8vIGNsb3NlIHRoZSBzb2NrZXTigJR0aGlzIHdpbGwgdGVsbCBjb21wYW5pb24gdG8gY2xlYXIgc3RhdGUgYW5kIGRlbGV0ZSB0aGUgZmlsZS5cblxuXG4gICAgICAgIGlmICghX3RoaXM0Lm9wdHMudXNlRmFzdFJlbW90ZVJldHJ5KSB7XG4gICAgICAgICAgX3RoaXM0LnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpOyAvLyBSZW1vdmUgdGhlIHNlcnZlclRva2VuIHNvIHRoYXQgYSBuZXcgb25lIHdpbGwgYmUgY3JlYXRlZCBmb3IgdGhlIHJldHJ5LlxuXG5cbiAgICAgICAgICBfdGhpczQudXBweS5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICAgICAgc2VydmVyVG9rZW46IG51bGxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzNC51cHB5LmVtaXQoJ3VwbG9hZC1lcnJvcicsIGZpbGUsIGVycm9yKTtcblxuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKTtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH0pO1xuICAgICAgc29ja2V0Lm9uKCdzdWNjZXNzJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIHVwbG9hZFJlc3AgPSB7XG4gICAgICAgICAgdXBsb2FkVVJMOiBkYXRhLnVybFxuICAgICAgICB9O1xuXG4gICAgICAgIF90aGlzNC51cHB5LmVtaXQoJ3VwbG9hZC1zdWNjZXNzJywgZmlsZSwgdXBsb2FkUmVzcCk7XG5cbiAgICAgICAgX3RoaXM0LnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpO1xuXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIHF1ZXVlZFJlcXVlc3QgPSBfdGhpczQucmVxdWVzdHMucnVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc29ja2V0Lm9wZW4oKTtcblxuICAgICAgICBpZiAoZmlsZS5pc1BhdXNlZCkge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdwYXVzZScsIHt9KTtcbiAgICAgICAgfSAvLyBEb24ndCBkbyBhbnl0aGluZyBoZXJlLCB0aGUgY2FsbGVyIHdpbGwgdGFrZSBjYXJlIG9mIGNhbmNlbGxpbmcgdGhlIHVwbG9hZCBpdHNlbGZcbiAgICAgICAgLy8gdXNpbmcgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKS4gVGhpcyBpcyBiZWNhdXNlIHJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKCkgaGFzIHRvIGJlXG4gICAgICAgIC8vIGNhbGxlZCB3aGVuIHRoaXMgcmVxdWVzdCBpcyBzdGlsbCBpbiB0aGUgcXVldWUsIGFuZCBoYXMgbm90IGJlZW4gc3RhcnRlZCB5ZXQsIHRvby4gQXRcbiAgICAgICAgLy8gdGhhdCBwb2ludCB0aGlzIGNhbmNlbGxhdGlvbiBmdW5jdGlvbiBpcyBub3QgZ29pbmcgdG8gYmUgY2FsbGVkLlxuICAgICAgICAvLyBBbHNvLCB3ZSBuZWVkIHRvIHJlbW92ZSB0aGUgcmVxdWVzdCBmcm9tIHRoZSBxdWV1ZSBfd2l0aG91dF8gZGVzdHJveWluZyBldmVyeXRoaW5nXG4gICAgICAgIC8vIHJlbGF0ZWQgdG8gdGhpcyB1cGxvYWQgdG8gaGFuZGxlIHBhdXNlcy5cblxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7fTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgdXBsb2FkVXJsIG9uIHRoZSBmaWxlIG9wdGlvbnMsIHNvIHRoYXQgd2hlbiBHb2xkZW4gUmV0cmlldmVyXG4gICAqIHJlc3RvcmVzIHN0YXRlLCB3ZSB3aWxsIGNvbnRpbnVlIHVwbG9hZGluZyB0byB0aGUgY29ycmVjdCBVUkwuXG4gICAqXG4gICAqIEBwYXJhbSB7VXBweUZpbGV9IGZpbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZFVSTFxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5vblJlY2VpdmVVcGxvYWRVcmwgPSBmdW5jdGlvbiBvblJlY2VpdmVVcGxvYWRVcmwoZmlsZSwgdXBsb2FkVVJMKSB7XG4gICAgdmFyIGN1cnJlbnRGaWxlID0gdGhpcy51cHB5LmdldEZpbGUoZmlsZS5pZCk7XG4gICAgaWYgKCFjdXJyZW50RmlsZSkgcmV0dXJuOyAvLyBPbmx5IGRvIHRoZSB1cGRhdGUgaWYgd2UgZGlkbid0IGhhdmUgYW4gdXBsb2FkIFVSTCB5ZXQuXG5cbiAgICBpZiAoIWN1cnJlbnRGaWxlLnR1cyB8fCBjdXJyZW50RmlsZS50dXMudXBsb2FkVXJsICE9PSB1cGxvYWRVUkwpIHtcbiAgICAgIHRoaXMudXBweS5sb2coJ1tUdXNdIFN0b3JpbmcgdXBsb2FkIHVybCcpO1xuICAgICAgdGhpcy51cHB5LnNldEZpbGVTdGF0ZShjdXJyZW50RmlsZS5pZCwge1xuICAgICAgICB0dXM6IF9leHRlbmRzKHt9LCBjdXJyZW50RmlsZS50dXMsIHtcbiAgICAgICAgICB1cGxvYWRVcmw6IHVwbG9hZFVSTFxuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oc3RyaW5nKTogdm9pZH0gY2JcbiAgICovXG4gIDtcblxuICBfcHJvdG8ub25GaWxlUmVtb3ZlID0gZnVuY3Rpb24gb25GaWxlUmVtb3ZlKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ2ZpbGUtcmVtb3ZlZCcsIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICBpZiAoZmlsZUlEID09PSBmaWxlLmlkKSBjYihmaWxlLmlkKTtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGJvb2xlYW4pOiB2b2lkfSBjYlxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5vblBhdXNlID0gZnVuY3Rpb24gb25QYXVzZShmaWxlSUQsIGNiKSB7XG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCd1cGxvYWQtcGF1c2UnLCBmdW5jdGlvbiAodGFyZ2V0RmlsZUlELCBpc1BhdXNlZCkge1xuICAgICAgaWYgKGZpbGVJRCA9PT0gdGFyZ2V0RmlsZUlEKSB7XG4gICAgICAgIC8vIGNvbnN0IGlzUGF1c2VkID0gdGhpcy51cHB5LnBhdXNlUmVzdW1lKGZpbGVJRClcbiAgICAgICAgY2IoaXNQYXVzZWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gY2JcbiAgICovXG4gIDtcblxuICBfcHJvdG8ub25SZXRyeSA9IGZ1bmN0aW9uIG9uUmV0cnkoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbigndXBsb2FkLXJldHJ5JywgZnVuY3Rpb24gKHRhcmdldEZpbGVJRCkge1xuICAgICAgaWYgKGZpbGVJRCA9PT0gdGFyZ2V0RmlsZUlEKSB7XG4gICAgICAgIGNiKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5vblJldHJ5QWxsID0gZnVuY3Rpb24gb25SZXRyeUFsbChmaWxlSUQsIGNiKSB7XG4gICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3JldHJ5LWFsbCcsIGZ1bmN0aW9uIChmaWxlc1RvUmV0cnkpIHtcbiAgICAgIGlmICghX3RoaXM1LnVwcHkuZ2V0RmlsZShmaWxlSUQpKSByZXR1cm47XG4gICAgICBjYigpO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gY2JcbiAgICovXG4gIDtcblxuICBfcHJvdG8ub25QYXVzZUFsbCA9IGZ1bmN0aW9uIG9uUGF1c2VBbGwoZmlsZUlELCBjYikge1xuICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCdwYXVzZS1hbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIV90aGlzNi51cHB5LmdldEZpbGUoZmlsZUlEKSkgcmV0dXJuO1xuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IGNiXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLm9uQ2FuY2VsQWxsID0gZnVuY3Rpb24gb25DYW5jZWxBbGwoZmlsZUlELCBjYikge1xuICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCdjYW5jZWwtYWxsJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFfdGhpczcudXBweS5nZXRGaWxlKGZpbGVJRCkpIHJldHVybjtcbiAgICAgIGNiKCk7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5vblJlc3VtZUFsbCA9IGZ1bmN0aW9uIG9uUmVzdW1lQWxsKGZpbGVJRCwgY2IpIHtcbiAgICB2YXIgX3RoaXM4ID0gdGhpcztcblxuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbigncmVzdW1lLWFsbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghX3RoaXM4LnVwcHkuZ2V0RmlsZShmaWxlSUQpKSByZXR1cm47XG4gICAgICBjYigpO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0geyhVcHB5RmlsZSB8IEZhaWxlZFVwcHlGaWxlKVtdfSBmaWxlc1xuICAgKi9cbiAgO1xuXG4gIF9wcm90by51cGxvYWRGaWxlcyA9IGZ1bmN0aW9uIHVwbG9hZEZpbGVzKGZpbGVzKSB7XG4gICAgdmFyIF90aGlzOSA9IHRoaXM7XG5cbiAgICB2YXIgcHJvbWlzZXMgPSBmaWxlcy5tYXAoZnVuY3Rpb24gKGZpbGUsIGkpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gaSArIDE7XG4gICAgICB2YXIgdG90YWwgPSBmaWxlcy5sZW5ndGg7XG5cbiAgICAgIGlmICgnZXJyb3InIGluIGZpbGUgJiYgZmlsZS5lcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGZpbGUuZXJyb3IpKTtcbiAgICAgIH0gZWxzZSBpZiAoZmlsZS5pc1JlbW90ZSkge1xuICAgICAgICByZXR1cm4gX3RoaXM5LnVwbG9hZFJlbW90ZShmaWxlLCBjdXJyZW50LCB0b3RhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gX3RoaXM5LnVwbG9hZChmaWxlLCBjdXJyZW50LCB0b3RhbCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHNldHRsZShwcm9taXNlcyk7XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGZpbGVJRHNcbiAgICovXG4gIDtcblxuICBfcHJvdG8uaGFuZGxlVXBsb2FkID0gZnVuY3Rpb24gaGFuZGxlVXBsb2FkKGZpbGVJRHMpIHtcbiAgICB2YXIgX3RoaXMxMCA9IHRoaXM7XG5cbiAgICBpZiAoZmlsZUlEcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMudXBweS5sb2coJ1tUdXNdIE5vIGZpbGVzIHRvIHVwbG9hZCcpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdHMubGltaXQgPT09IDApIHtcbiAgICAgIHRoaXMudXBweS5sb2coJ1tUdXNdIFdoZW4gdXBsb2FkaW5nIG11bHRpcGxlIGZpbGVzIGF0IG9uY2UsIGNvbnNpZGVyIHNldHRpbmcgdGhlIGBsaW1pdGAgb3B0aW9uICh0byBgMTBgIGZvciBleGFtcGxlKSwgdG8gbGltaXQgdGhlIG51bWJlciBvZiBjb25jdXJyZW50IHVwbG9hZHMsIHdoaWNoIGhlbHBzIHByZXZlbnQgbWVtb3J5IGFuZCBuZXR3b3JrIGlzc3VlczogaHR0cHM6Ly91cHB5LmlvL2RvY3MvdHVzLyNsaW1pdC0wJywgJ3dhcm5pbmcnKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwcHkubG9nKCdbVHVzXSBVcGxvYWRpbmcuLi4nKTtcbiAgICB2YXIgZmlsZXNUb1VwbG9hZCA9IGZpbGVJRHMubWFwKGZ1bmN0aW9uIChmaWxlSUQpIHtcbiAgICAgIHJldHVybiBfdGhpczEwLnVwcHkuZ2V0RmlsZShmaWxlSUQpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnVwbG9hZEZpbGVzKGZpbGVzVG9VcGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLmluc3RhbGwgPSBmdW5jdGlvbiBpbnN0YWxsKCkge1xuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBjYXBhYmlsaXRpZXM6IF9leHRlbmRzKHt9LCB0aGlzLnVwcHkuZ2V0U3RhdGUoKS5jYXBhYmlsaXRpZXMsIHtcbiAgICAgICAgcmVzdW1hYmxlVXBsb2FkczogdHJ1ZVxuICAgICAgfSlcbiAgICB9KTtcbiAgICB0aGlzLnVwcHkuYWRkVXBsb2FkZXIodGhpcy5oYW5kbGVVcGxvYWQpO1xuICAgIHRoaXMudXBweS5vbigncmVzZXQtcHJvZ3Jlc3MnLCB0aGlzLmhhbmRsZVJlc2V0UHJvZ3Jlc3MpO1xuXG4gICAgaWYgKHRoaXMub3B0cy5hdXRvUmV0cnkpIHtcbiAgICAgIHRoaXMudXBweS5vbignYmFjay1vbmxpbmUnLCB0aGlzLnVwcHkucmV0cnlBbGwpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8udW5pbnN0YWxsID0gZnVuY3Rpb24gdW5pbnN0YWxsKCkge1xuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBjYXBhYmlsaXRpZXM6IF9leHRlbmRzKHt9LCB0aGlzLnVwcHkuZ2V0U3RhdGUoKS5jYXBhYmlsaXRpZXMsIHtcbiAgICAgICAgcmVzdW1hYmxlVXBsb2FkczogZmFsc2VcbiAgICAgIH0pXG4gICAgfSk7XG4gICAgdGhpcy51cHB5LnJlbW92ZVVwbG9hZGVyKHRoaXMuaGFuZGxlVXBsb2FkKTtcblxuICAgIGlmICh0aGlzLm9wdHMuYXV0b1JldHJ5KSB7XG4gICAgICB0aGlzLnVwcHkub2ZmKCdiYWNrLW9ubGluZScsIHRoaXMudXBweS5yZXRyeUFsbCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBUdXM7XG59KFBsdWdpbiksIF9jbGFzcy5WRVJTSU9OID0gXCIxLjguMlwiLCBfdGVtcCk7IiwiLyoqXG4gKiBDcmVhdGUgYSB3cmFwcGVyIGFyb3VuZCBhbiBldmVudCBlbWl0dGVyIHdpdGggYSBgcmVtb3ZlYCBtZXRob2QgdG8gcmVtb3ZlXG4gKiBhbGwgZXZlbnRzIHRoYXQgd2VyZSBhZGRlZCB1c2luZyB0aGUgd3JhcHBlZCBlbWl0dGVyLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEV2ZW50VHJhY2tlcihlbWl0dGVyKSB7XG4gICAgdGhpcy5fZXZlbnRzID0gW107XG4gICAgdGhpcy5fZW1pdHRlciA9IGVtaXR0ZXI7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gRXZlbnRUcmFja2VyLnByb3RvdHlwZTtcblxuICBfcHJvdG8ub24gPSBmdW5jdGlvbiBvbihldmVudCwgZm4pIHtcbiAgICB0aGlzLl9ldmVudHMucHVzaChbZXZlbnQsIGZuXSk7XG5cbiAgICByZXR1cm4gdGhpcy5fZW1pdHRlci5vbihldmVudCwgZm4pO1xuICB9O1xuXG4gIF9wcm90by5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuX2V2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICB2YXIgZXZlbnQgPSBfcmVmWzBdLFxuICAgICAgICAgIGZuID0gX3JlZlsxXTtcblxuICAgICAgX3RoaXMuX2VtaXR0ZXIub2ZmKGV2ZW50LCBmbik7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIEV2ZW50VHJhY2tlcjtcbn0oKTsiLCJmdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTsgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxuZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykgeyB2YXIgX2NhY2hlID0gdHlwZW9mIE1hcCA9PT0gXCJmdW5jdGlvblwiID8gbmV3IE1hcCgpIDogdW5kZWZpbmVkOyBfd3JhcE5hdGl2ZVN1cGVyID0gZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykgeyBpZiAoQ2xhc3MgPT09IG51bGwgfHwgIV9pc05hdGl2ZUZ1bmN0aW9uKENsYXNzKSkgcmV0dXJuIENsYXNzOyBpZiAodHlwZW9mIENsYXNzICE9PSBcImZ1bmN0aW9uXCIpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IGlmICh0eXBlb2YgX2NhY2hlICE9PSBcInVuZGVmaW5lZFwiKSB7IGlmIChfY2FjaGUuaGFzKENsYXNzKSkgcmV0dXJuIF9jYWNoZS5nZXQoQ2xhc3MpOyBfY2FjaGUuc2V0KENsYXNzLCBXcmFwcGVyKTsgfSBmdW5jdGlvbiBXcmFwcGVyKCkgeyByZXR1cm4gX2NvbnN0cnVjdChDbGFzcywgYXJndW1lbnRzLCBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3IpOyB9IFdyYXBwZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IFdyYXBwZXIsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IHJldHVybiBfc2V0UHJvdG90eXBlT2YoV3JhcHBlciwgQ2xhc3MpOyB9OyByZXR1cm4gX3dyYXBOYXRpdmVTdXBlcihDbGFzcyk7IH1cblxuZnVuY3Rpb24gX2NvbnN0cnVjdChQYXJlbnQsIGFyZ3MsIENsYXNzKSB7IGlmIChfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkpIHsgX2NvbnN0cnVjdCA9IFJlZmxlY3QuY29uc3RydWN0OyB9IGVsc2UgeyBfY29uc3RydWN0ID0gZnVuY3Rpb24gX2NvbnN0cnVjdChQYXJlbnQsIGFyZ3MsIENsYXNzKSB7IHZhciBhID0gW251bGxdOyBhLnB1c2guYXBwbHkoYSwgYXJncyk7IHZhciBDb25zdHJ1Y3RvciA9IEZ1bmN0aW9uLmJpbmQuYXBwbHkoUGFyZW50LCBhKTsgdmFyIGluc3RhbmNlID0gbmV3IENvbnN0cnVjdG9yKCk7IGlmIChDbGFzcykgX3NldFByb3RvdHlwZU9mKGluc3RhbmNlLCBDbGFzcy5wcm90b3R5cGUpOyByZXR1cm4gaW5zdGFuY2U7IH07IH0gcmV0dXJuIF9jb25zdHJ1Y3QuYXBwbHkobnVsbCwgYXJndW1lbnRzKTsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZUZ1bmN0aW9uKGZuKSB7IHJldHVybiBGdW5jdGlvbi50b1N0cmluZy5jYWxsKGZuKS5pbmRleE9mKFwiW25hdGl2ZSBjb2RlXVwiKSAhPT0gLTE7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG52YXIgTmV0d29ya0Vycm9yID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfRXJyb3IpIHtcbiAgX2luaGVyaXRzTG9vc2UoTmV0d29ya0Vycm9yLCBfRXJyb3IpO1xuXG4gIGZ1bmN0aW9uIE5ldHdvcmtFcnJvcihlcnJvciwgeGhyKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgaWYgKHhociA9PT0gdm9pZCAwKSB7XG4gICAgICB4aHIgPSBudWxsO1xuICAgIH1cblxuICAgIF90aGlzID0gX0Vycm9yLmNhbGwodGhpcywgXCJUaGlzIGxvb2tzIGxpa2UgYSBuZXR3b3JrIGVycm9yLCB0aGUgZW5kcG9pbnQgbWlnaHQgYmUgYmxvY2tlZCBieSBhbiBpbnRlcm5ldCBwcm92aWRlciBvciBhIGZpcmV3YWxsLlxcblxcblNvdXJjZSBlcnJvcjogW1wiICsgZXJyb3IgKyBcIl1cIikgfHwgdGhpcztcbiAgICBfdGhpcy5pc05ldHdvcmtFcnJvciA9IHRydWU7XG4gICAgX3RoaXMucmVxdWVzdCA9IHhocjtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICByZXR1cm4gTmV0d29ya0Vycm9yO1xufSggLyojX19QVVJFX18qL193cmFwTmF0aXZlU3VwZXIoRXJyb3IpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZXR3b3JrRXJyb3I7IiwiLyoqXG4gKiBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4IHBvbnlmaWxsIGZvciBvbGQgYnJvd3NlcnMuXG4gKi9cbmZ1bmN0aW9uIGZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2ldKSkgcmV0dXJuIGk7XG4gIH1cblxuICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNhbmNlbEVycm9yKCkge1xuICByZXR1cm4gbmV3IEVycm9yKCdDYW5jZWxsZWQnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBSYXRlTGltaXRlZFF1ZXVlKGxpbWl0KSB7XG4gICAgaWYgKHR5cGVvZiBsaW1pdCAhPT0gJ251bWJlcicgfHwgbGltaXQgPT09IDApIHtcbiAgICAgIHRoaXMubGltaXQgPSBJbmZpbml0eTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saW1pdCA9IGxpbWl0O1xuICAgIH1cblxuICAgIHRoaXMuYWN0aXZlUmVxdWVzdHMgPSAwO1xuICAgIHRoaXMucXVldWVkSGFuZGxlcnMgPSBbXTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBSYXRlTGltaXRlZFF1ZXVlLnByb3RvdHlwZTtcblxuICBfcHJvdG8uX2NhbGwgPSBmdW5jdGlvbiBfY2FsbChmbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLmFjdGl2ZVJlcXVlc3RzICs9IDE7XG4gICAgdmFyIF9kb25lID0gZmFsc2U7XG4gICAgdmFyIGNhbmNlbEFjdGl2ZTtcblxuICAgIHRyeSB7XG4gICAgICBjYW5jZWxBY3RpdmUgPSBmbigpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5hY3RpdmVSZXF1ZXN0cyAtPSAxO1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBhYm9ydDogZnVuY3Rpb24gYWJvcnQoKSB7XG4gICAgICAgIGlmIChfZG9uZSkgcmV0dXJuO1xuICAgICAgICBfZG9uZSA9IHRydWU7XG4gICAgICAgIF90aGlzLmFjdGl2ZVJlcXVlc3RzIC09IDE7XG4gICAgICAgIGNhbmNlbEFjdGl2ZSgpO1xuXG4gICAgICAgIF90aGlzLl9xdWV1ZU5leHQoKTtcbiAgICAgIH0sXG4gICAgICBkb25lOiBmdW5jdGlvbiBkb25lKCkge1xuICAgICAgICBpZiAoX2RvbmUpIHJldHVybjtcbiAgICAgICAgX2RvbmUgPSB0cnVlO1xuICAgICAgICBfdGhpcy5hY3RpdmVSZXF1ZXN0cyAtPSAxO1xuXG4gICAgICAgIF90aGlzLl9xdWV1ZU5leHQoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIF9wcm90by5fcXVldWVOZXh0ID0gZnVuY3Rpb24gX3F1ZXVlTmV4dCgpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIC8vIERvIGl0IHNvb24gYnV0IG5vdCBpbW1lZGlhdGVseSwgdGhpcyBhbGxvd3MgY2xlYXJpbmcgb3V0IHRoZSBlbnRpcmUgcXVldWUgc3luY2hyb25vdXNseVxuICAgIC8vIG9uZSBieSBvbmUgd2l0aG91dCBjb250aW51b3VzbHkgX2FkdmFuY2luZ18gaXQgKGFuZCBzdGFydGluZyBuZXcgdGFza3MgYmVmb3JlIGltbWVkaWF0ZWx5XG4gICAgLy8gYWJvcnRpbmcgdGhlbSlcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzMi5fbmV4dCgpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5fbmV4dCA9IGZ1bmN0aW9uIF9uZXh0KCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZVJlcXVlc3RzID49IHRoaXMubGltaXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5xdWV1ZWRIYW5kbGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIERpc3BhdGNoIHRoZSBuZXh0IHJlcXVlc3QsIGFuZCB1cGRhdGUgdGhlIGFib3J0L2RvbmUgaGFuZGxlcnNcbiAgICAvLyBzbyB0aGF0IGNhbmNlbGxpbmcgaXQgZG9lcyB0aGUgUmlnaHQgVGhpbmcgKGFuZCBkb2Vzbid0IGp1c3QgdHJ5XG4gICAgLy8gdG8gZGVxdWV1ZSBhbiBhbHJlYWR5LXJ1bm5pbmcgcmVxdWVzdCkuXG5cblxuICAgIHZhciBuZXh0ID0gdGhpcy5xdWV1ZWRIYW5kbGVycy5zaGlmdCgpO1xuXG4gICAgdmFyIGhhbmRsZXIgPSB0aGlzLl9jYWxsKG5leHQuZm4pO1xuXG4gICAgbmV4dC5hYm9ydCA9IGhhbmRsZXIuYWJvcnQ7XG4gICAgbmV4dC5kb25lID0gaGFuZGxlci5kb25lO1xuICB9O1xuXG4gIF9wcm90by5fcXVldWUgPSBmdW5jdGlvbiBfcXVldWUoZm4sIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgaGFuZGxlciA9IHtcbiAgICAgIGZuOiBmbixcbiAgICAgIHByaW9yaXR5OiBvcHRpb25zLnByaW9yaXR5IHx8IDAsXG4gICAgICBhYm9ydDogZnVuY3Rpb24gYWJvcnQoKSB7XG4gICAgICAgIF90aGlzMy5fZGVxdWV1ZShoYW5kbGVyKTtcbiAgICAgIH0sXG4gICAgICBkb25lOiBmdW5jdGlvbiBkb25lKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBtYXJrIGEgcXVldWVkIHJlcXVlc3QgYXMgZG9uZTogdGhpcyBpbmRpY2F0ZXMgYSBidWcnKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBpbmRleCA9IGZpbmRJbmRleCh0aGlzLnF1ZXVlZEhhbmRsZXJzLCBmdW5jdGlvbiAob3RoZXIpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLnByaW9yaXR5ID4gb3RoZXIucHJpb3JpdHk7XG4gICAgfSk7XG5cbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aGlzLnF1ZXVlZEhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucXVldWVkSGFuZGxlcnMuc3BsaWNlKGluZGV4LCAwLCBoYW5kbGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlcjtcbiAgfTtcblxuICBfcHJvdG8uX2RlcXVldWUgPSBmdW5jdGlvbiBfZGVxdWV1ZShoYW5kbGVyKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5xdWV1ZWRIYW5kbGVycy5pbmRleE9mKGhhbmRsZXIpO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5xdWV1ZWRIYW5kbGVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8ucnVuID0gZnVuY3Rpb24gcnVuKGZuLCBxdWV1ZU9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVSZXF1ZXN0cyA8IHRoaXMubGltaXQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jYWxsKGZuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcXVldWUoZm4sIHF1ZXVlT3B0aW9ucyk7XG4gIH07XG5cbiAgX3Byb3RvLndyYXBQcm9taXNlRnVuY3Rpb24gPSBmdW5jdGlvbiB3cmFwUHJvbWlzZUZ1bmN0aW9uKGZuLCBxdWV1ZU9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgdmFyIHF1ZXVlZFJlcXVlc3Q7XG4gICAgICB2YXIgb3V0ZXJQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0ID0gX3RoaXM0LnJ1bihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGNhbmNlbEVycm9yO1xuICAgICAgICAgIHZhciBpbm5lclByb21pc2U7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaW5uZXJQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGZuLmFwcGx5KHZvaWQgMCwgYXJncykpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaW5uZXJQcm9taXNlID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbm5lclByb21pc2UudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoY2FuY2VsRXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGNhbmNlbEVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpO1xuICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGNhbmNlbEVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChjYW5jZWxFcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKTtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbmNlbEVycm9yID0gY3JlYXRlQ2FuY2VsRXJyb3IoKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9LCBxdWV1ZU9wdGlvbnMpO1xuICAgICAgfSk7XG5cbiAgICAgIG91dGVyUHJvbWlzZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIG91dGVyUHJvbWlzZTtcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBSYXRlTGltaXRlZFF1ZXVlO1xufSgpOyIsImZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbnZhciBoYXMgPSByZXF1aXJlKCcuL2hhc1Byb3BlcnR5Jyk7XG4vKipcbiAqIFRyYW5zbGF0ZXMgc3RyaW5ncyB3aXRoIGludGVycG9sYXRpb24gJiBwbHVyYWxpemF0aW9uIHN1cHBvcnQuXG4gKiBFeHRlbnNpYmxlIHdpdGggY3VzdG9tIGRpY3Rpb25hcmllcyBhbmQgcGx1cmFsaXphdGlvbiBmdW5jdGlvbnMuXG4gKlxuICogQm9ycm93cyBoZWF2aWx5IGZyb20gYW5kIGluc3BpcmVkIGJ5IFBvbHlnbG90IGh0dHBzOi8vZ2l0aHViLmNvbS9haXJibmIvcG9seWdsb3QuanMsXG4gKiBiYXNpY2FsbHkgYSBzdHJpcHBlZC1kb3duIHZlcnNpb24gb2YgaXQuIERpZmZlcmVuY2VzOiBwbHVyYWxpemF0aW9uIGZ1bmN0aW9ucyBhcmUgbm90IGhhcmRjb2RlZFxuICogYW5kIGNhbiBiZSBlYXNpbHkgYWRkZWQgYW1vbmcgd2l0aCBkaWN0aW9uYXJpZXMsIG5lc3RlZCBvYmplY3RzIGFyZSB1c2VkIGZvciBwbHVyYWxpemF0aW9uXG4gKiBhcyBvcHBvc2VkIHRvIGB8fHx8YCBkZWxpbWV0ZXJcbiAqXG4gKiBVc2FnZSBleGFtcGxlOiBgdHJhbnNsYXRvci50cmFuc2xhdGUoJ2ZpbGVzX2Nob3NlbicsIHtzbWFydF9jb3VudDogM30pYFxuICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R8QXJyYXk8b2JqZWN0Pn0gbG9jYWxlcyAtIGxvY2FsZSBvciBsaXN0IG9mIGxvY2FsZXMuXG4gICAqL1xuICBmdW5jdGlvbiBUcmFuc2xhdG9yKGxvY2FsZXMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5sb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7fSxcbiAgICAgIHBsdXJhbGl6ZTogZnVuY3Rpb24gcGx1cmFsaXplKG4pIHtcbiAgICAgICAgaWYgKG4gPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShsb2NhbGVzKSkge1xuICAgICAgbG9jYWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLl9hcHBseShsb2NhbGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FwcGx5KGxvY2FsZXMpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBUcmFuc2xhdG9yLnByb3RvdHlwZTtcblxuICBfcHJvdG8uX2FwcGx5ID0gZnVuY3Rpb24gX2FwcGx5KGxvY2FsZSkge1xuICAgIGlmICghbG9jYWxlIHx8ICFsb2NhbGUuc3RyaW5ncykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwcmV2TG9jYWxlID0gdGhpcy5sb2NhbGU7XG4gICAgdGhpcy5sb2NhbGUgPSBfZXh0ZW5kcyh7fSwgcHJldkxvY2FsZSwge1xuICAgICAgc3RyaW5nczogX2V4dGVuZHMoe30sIHByZXZMb2NhbGUuc3RyaW5ncywgbG9jYWxlLnN0cmluZ3MpXG4gICAgfSk7XG4gICAgdGhpcy5sb2NhbGUucGx1cmFsaXplID0gbG9jYWxlLnBsdXJhbGl6ZSB8fCBwcmV2TG9jYWxlLnBsdXJhbGl6ZTtcbiAgfVxuICAvKipcbiAgICogVGFrZXMgYSBzdHJpbmcgd2l0aCBwbGFjZWhvbGRlciB2YXJpYWJsZXMgbGlrZSBgJXtzbWFydF9jb3VudH0gZmlsZSBzZWxlY3RlZGBcbiAgICogYW5kIHJlcGxhY2VzIGl0IHdpdGggdmFsdWVzIGZyb20gb3B0aW9ucyBge3NtYXJ0X2NvdW50OiA1fWBcbiAgICpcbiAgICogQGxpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gICAqIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcy9ibG9iL21hc3Rlci9saWIvcG9seWdsb3QuanMjTDI5OVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGhyYXNlIHRoYXQgbmVlZHMgaW50ZXJwb2xhdGlvbiwgd2l0aCBwbGFjZWhvbGRlcnNcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgd2l0aCB2YWx1ZXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnNcbiAgICogQHJldHVybnMge3N0cmluZ30gaW50ZXJwb2xhdGVkXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLmludGVycG9sYXRlID0gZnVuY3Rpb24gaW50ZXJwb2xhdGUocGhyYXNlLCBvcHRpb25zKSB7XG4gICAgdmFyIF9TdHJpbmckcHJvdG90eXBlID0gU3RyaW5nLnByb3RvdHlwZSxcbiAgICAgICAgc3BsaXQgPSBfU3RyaW5nJHByb3RvdHlwZS5zcGxpdCxcbiAgICAgICAgcmVwbGFjZSA9IF9TdHJpbmckcHJvdG90eXBlLnJlcGxhY2U7XG4gICAgdmFyIGRvbGxhclJlZ2V4ID0gL1xcJC9nO1xuICAgIHZhciBkb2xsYXJCaWxsc1lhbGwgPSAnJCQkJCc7XG4gICAgdmFyIGludGVycG9sYXRlZCA9IFtwaHJhc2VdO1xuXG4gICAgZm9yICh2YXIgYXJnIGluIG9wdGlvbnMpIHtcbiAgICAgIGlmIChhcmcgIT09ICdfJyAmJiBoYXMob3B0aW9ucywgYXJnKSkge1xuICAgICAgICAvLyBFbnN1cmUgcmVwbGFjZW1lbnQgdmFsdWUgaXMgZXNjYXBlZCB0byBwcmV2ZW50IHNwZWNpYWwgJC1wcmVmaXhlZFxuICAgICAgICAvLyByZWdleCByZXBsYWNlIHRva2Vucy4gdGhlIFwiJCQkJFwiIGlzIG5lZWRlZCBiZWNhdXNlIGVhY2ggXCIkXCIgbmVlZHMgdG9cbiAgICAgICAgLy8gYmUgZXNjYXBlZCB3aXRoIFwiJFwiIGl0c2VsZiwgYW5kIHdlIG5lZWQgdHdvIGluIHRoZSByZXN1bHRpbmcgb3V0cHV0LlxuICAgICAgICB2YXIgcmVwbGFjZW1lbnQgPSBvcHRpb25zW2FyZ107XG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXBsYWNlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICByZXBsYWNlbWVudCA9IHJlcGxhY2UuY2FsbChvcHRpb25zW2FyZ10sIGRvbGxhclJlZ2V4LCBkb2xsYXJCaWxsc1lhbGwpO1xuICAgICAgICB9IC8vIFdlIGNyZWF0ZSBhIG5ldyBgUmVnRXhwYCBlYWNoIHRpbWUgaW5zdGVhZCBvZiB1c2luZyBhIG1vcmUtZWZmaWNpZW50XG4gICAgICAgIC8vIHN0cmluZyByZXBsYWNlIHNvIHRoYXQgdGhlIHNhbWUgYXJndW1lbnQgY2FuIGJlIHJlcGxhY2VkIG11bHRpcGxlIHRpbWVzXG4gICAgICAgIC8vIGluIHRoZSBzYW1lIHBocmFzZS5cblxuXG4gICAgICAgIGludGVycG9sYXRlZCA9IGluc2VydFJlcGxhY2VtZW50KGludGVycG9sYXRlZCwgbmV3IFJlZ0V4cCgnJVxcXFx7JyArIGFyZyArICdcXFxcfScsICdnJyksIHJlcGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW50ZXJwb2xhdGVkO1xuXG4gICAgZnVuY3Rpb24gaW5zZXJ0UmVwbGFjZW1lbnQoc291cmNlLCByeCwgcmVwbGFjZW1lbnQpIHtcbiAgICAgIHZhciBuZXdQYXJ0cyA9IFtdO1xuICAgICAgc291cmNlLmZvckVhY2goZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgICAgIC8vIFdoZW4gdGhlIHNvdXJjZSBjb250YWlucyBtdWx0aXBsZSBwbGFjZWhvbGRlcnMgZm9yIGludGVycG9sYXRpb24sXG4gICAgICAgIC8vIHdlIHNob3VsZCBpZ25vcmUgY2h1bmtzIHRoYXQgYXJlIG5vdCBzdHJpbmdzLCBiZWNhdXNlIHRob3NlXG4gICAgICAgIC8vIGNhbiBiZSBKU1ggb2JqZWN0cyBhbmQgd2lsbCBiZSBvdGhlcndpc2UgaW5jb3JyZWN0bHkgdHVybmVkIGludG8gc3RyaW5ncy5cbiAgICAgICAgLy8gV2l0aG91dCB0aGlzIGNvbmRpdGlvbiB3ZeKAmWQgZ2V0IHRoaXM6IFtvYmplY3QgT2JqZWN0XSBoZWxsbyBbb2JqZWN0IE9iamVjdF0gbXkgPGJ1dHRvbj5cbiAgICAgICAgaWYgKHR5cGVvZiBjaHVuayAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICByZXR1cm4gbmV3UGFydHMucHVzaChjaHVuayk7XG4gICAgICAgIH1cblxuICAgICAgICBzcGxpdC5jYWxsKGNodW5rLCByeCkuZm9yRWFjaChmdW5jdGlvbiAocmF3LCBpLCBsaXN0KSB7XG4gICAgICAgICAgaWYgKHJhdyAhPT0gJycpIHtcbiAgICAgICAgICAgIG5ld1BhcnRzLnB1c2gocmF3KTtcbiAgICAgICAgICB9IC8vIEludGVybGFjZSB3aXRoIHRoZSBgcmVwbGFjZW1lbnRgIHZhbHVlXG5cblxuICAgICAgICAgIGlmIChpIDwgbGlzdC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBuZXdQYXJ0cy5wdXNoKHJlcGxhY2VtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3UGFydHM7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBQdWJsaWMgdHJhbnNsYXRlIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHdpdGggdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIGxhdGVyIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzIGluIHN0cmluZ1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0cmFuc2xhdGVkIChhbmQgaW50ZXJwb2xhdGVkKVxuICAgKi9cbiAgO1xuXG4gIF9wcm90by50cmFuc2xhdGUgPSBmdW5jdGlvbiB0cmFuc2xhdGUoa2V5LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlQXJyYXkoa2V5LCBvcHRpb25zKS5qb2luKCcnKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGEgdHJhbnNsYXRpb24gYW5kIHJldHVybiB0aGUgdHJhbnNsYXRlZCBhbmQgaW50ZXJwb2xhdGVkIHBhcnRzIGFzIGFuIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHdpdGggdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzXG4gICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHRyYW5zbGF0ZWQgYW5kIGludGVycG9sYXRlZCBwYXJ0cywgaW4gb3JkZXIuXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLnRyYW5zbGF0ZUFycmF5ID0gZnVuY3Rpb24gdHJhbnNsYXRlQXJyYXkoa2V5LCBvcHRpb25zKSB7XG4gICAgaWYgKCFoYXModGhpcy5sb2NhbGUuc3RyaW5ncywga2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwibWlzc2luZyBzdHJpbmc6IFwiICsga2V5KTtcbiAgICB9XG5cbiAgICB2YXIgc3RyaW5nID0gdGhpcy5sb2NhbGUuc3RyaW5nc1trZXldO1xuICAgIHZhciBoYXNQbHVyYWxGb3JtcyA9IHR5cGVvZiBzdHJpbmcgPT09ICdvYmplY3QnO1xuXG4gICAgaWYgKGhhc1BsdXJhbEZvcm1zKSB7XG4gICAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5zbWFydF9jb3VudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIHBsdXJhbCA9IHRoaXMubG9jYWxlLnBsdXJhbGl6ZShvcHRpb25zLnNtYXJ0X2NvdW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJwb2xhdGUoc3RyaW5nW3BsdXJhbF0sIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0ZWQgdG8gdXNlIGEgc3RyaW5nIHdpdGggcGx1cmFsIGZvcm1zLCBidXQgbm8gdmFsdWUgd2FzIGdpdmVuIGZvciAle3NtYXJ0X2NvdW50fScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmludGVycG9sYXRlKHN0cmluZywgb3B0aW9ucyk7XG4gIH07XG5cbiAgcmV0dXJuIFRyYW5zbGF0b3I7XG59KCk7IiwidmFyIHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJyk7XG5cbmZ1bmN0aW9uIF9lbWl0U29ja2V0UHJvZ3Jlc3ModXBsb2FkZXIsIHByb2dyZXNzRGF0YSwgZmlsZSkge1xuICB2YXIgcHJvZ3Jlc3MgPSBwcm9ncmVzc0RhdGEucHJvZ3Jlc3MsXG4gICAgICBieXRlc1VwbG9hZGVkID0gcHJvZ3Jlc3NEYXRhLmJ5dGVzVXBsb2FkZWQsXG4gICAgICBieXRlc1RvdGFsID0gcHJvZ3Jlc3NEYXRhLmJ5dGVzVG90YWw7XG5cbiAgaWYgKHByb2dyZXNzKSB7XG4gICAgdXBsb2FkZXIudXBweS5sb2coXCJVcGxvYWQgcHJvZ3Jlc3M6IFwiICsgcHJvZ3Jlc3MpO1xuICAgIHVwbG9hZGVyLnVwcHkuZW1pdCgndXBsb2FkLXByb2dyZXNzJywgZmlsZSwge1xuICAgICAgdXBsb2FkZXI6IHVwbG9hZGVyLFxuICAgICAgYnl0ZXNVcGxvYWRlZDogYnl0ZXNVcGxvYWRlZCxcbiAgICAgIGJ5dGVzVG90YWw6IGJ5dGVzVG90YWxcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlKF9lbWl0U29ja2V0UHJvZ3Jlc3MsIDMwMCwge1xuICBsZWFkaW5nOiB0cnVlLFxuICB0cmFpbGluZzogdHJ1ZVxufSk7IiwidmFyIE5ldHdvcmtFcnJvciA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9OZXR3b3JrRXJyb3InKTtcbi8qKlxuICogV3JhcHBlciBhcm91bmQgd2luZG93LmZldGNoIHRoYXQgdGhyb3dzIGEgTmV0d29ya0Vycm9yIHdoZW4gYXBwcm9wcmlhdGVcbiAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmV0Y2hXaXRoTmV0d29ya0Vycm9yKCkge1xuICByZXR1cm4gZmV0Y2guYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyLm5hbWUgPT09ICdBYm9ydEVycm9yJykge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgTmV0d29ya0Vycm9yKGVycik7XG4gICAgfVxuICB9KTtcbn07IiwidmFyIGlzRE9NRWxlbWVudCA9IHJlcXVpcmUoJy4vaXNET01FbGVtZW50Jyk7XG4vKipcbiAqIEZpbmQgYSBET00gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge05vZGV8c3RyaW5nfSBlbGVtZW50XG4gKiBAcmV0dXJucyB7Tm9kZXxudWxsfVxuICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaW5kRE9NRWxlbWVudChlbGVtZW50LCBjb250ZXh0KSB7XG4gIGlmIChjb250ZXh0ID09PSB2b2lkIDApIHtcbiAgICBjb250ZXh0ID0gZG9jdW1lbnQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50KTtcbiAgfVxuXG4gIGlmIChpc0RPTUVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufTsiLCIvKipcbiAqIFRha2VzIGEgZmlsZSBvYmplY3QgYW5kIHR1cm5zIGl0IGludG8gZmlsZUlELCBieSBjb252ZXJ0aW5nIGZpbGUubmFtZSB0byBsb3dlcmNhc2UsXG4gKiByZW1vdmluZyBleHRyYSBjaGFyYWN0ZXJzIGFuZCBhZGRpbmcgdHlwZSwgc2l6ZSBhbmQgbGFzdE1vZGlmaWVkXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGZpbGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBmaWxlSURcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZUZpbGVJRChmaWxlKSB7XG4gIC8vIEl0J3MgdGVtcHRpbmcgdG8gZG8gYFtpdGVtc10uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJy0nKWAgaGVyZSwgYnV0IHRoYXRcbiAgLy8gaXMgc2xvd2VyISBzaW1wbGUgc3RyaW5nIGNvbmNhdGVuYXRpb24gaXMgZmFzdFxuICB2YXIgaWQgPSAndXBweSc7XG5cbiAgaWYgKHR5cGVvZiBmaWxlLm5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWQgKz0gJy0nICsgZW5jb2RlRmlsZW5hbWUoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkpO1xuICB9XG5cbiAgaWYgKGZpbGUudHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWQgKz0gJy0nICsgZmlsZS50eXBlO1xuICB9XG5cbiAgaWYgKGZpbGUubWV0YSAmJiB0eXBlb2YgZmlsZS5tZXRhLnJlbGF0aXZlUGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZCArPSAnLScgKyBlbmNvZGVGaWxlbmFtZShmaWxlLm1ldGEucmVsYXRpdmVQYXRoLnRvTG93ZXJDYXNlKCkpO1xuICB9XG5cbiAgaWYgKGZpbGUuZGF0YS5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSAnLScgKyBmaWxlLmRhdGEuc2l6ZTtcbiAgfVxuXG4gIGlmIChmaWxlLmRhdGEubGFzdE1vZGlmaWVkICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSAnLScgKyBmaWxlLmRhdGEubGFzdE1vZGlmaWVkO1xuICB9XG5cbiAgcmV0dXJuIGlkO1xufTtcblxuZnVuY3Rpb24gZW5jb2RlRmlsZW5hbWUobmFtZSkge1xuICB2YXIgc3VmZml4ID0gJyc7XG4gIHJldHVybiBuYW1lLnJlcGxhY2UoL1teQS1aMC05XS9pZywgZnVuY3Rpb24gKGNoYXJhY3Rlcikge1xuICAgIHN1ZmZpeCArPSAnLScgKyBlbmNvZGVDaGFyYWN0ZXIoY2hhcmFjdGVyKTtcbiAgICByZXR1cm4gJy8nO1xuICB9KSArIHN1ZmZpeDtcbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2hhcmFjdGVyKGNoYXJhY3Rlcikge1xuICByZXR1cm4gY2hhcmFjdGVyLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMzIpO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0Qnl0ZXNSZW1haW5pbmcoZmlsZVByb2dyZXNzKSB7XG4gIHJldHVybiBmaWxlUHJvZ3Jlc3MuYnl0ZXNUb3RhbCAtIGZpbGVQcm9ncmVzcy5ieXRlc1VwbG9hZGVkO1xufTsiLCIvKipcbiAqIFRha2VzIGEgZnVsbCBmaWxlbmFtZSBzdHJpbmcgYW5kIHJldHVybnMgYW4gb2JqZWN0IHtuYW1lLCBleHRlbnNpb259XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZ1bGxGaWxlTmFtZVxuICogQHJldHVybnMge29iamVjdH0ge25hbWUsIGV4dGVuc2lvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbihmdWxsRmlsZU5hbWUpIHtcbiAgdmFyIGxhc3REb3QgPSBmdWxsRmlsZU5hbWUubGFzdEluZGV4T2YoJy4nKTsgLy8gdGhlc2UgY291bnQgYXMgbm8gZXh0ZW5zaW9uOiBcIm5vLWRvdFwiLCBcInRyYWlsaW5nLWRvdC5cIlxuXG4gIGlmIChsYXN0RG90ID09PSAtMSB8fCBsYXN0RG90ID09PSBmdWxsRmlsZU5hbWUubGVuZ3RoIC0gMSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBmdWxsRmlsZU5hbWUsXG4gICAgICBleHRlbnNpb246IHVuZGVmaW5lZFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGZ1bGxGaWxlTmFtZS5zbGljZSgwLCBsYXN0RG90KSxcbiAgICAgIGV4dGVuc2lvbjogZnVsbEZpbGVOYW1lLnNsaWNlKGxhc3REb3QgKyAxKVxuICAgIH07XG4gIH1cbn07IiwidmFyIGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uID0gcmVxdWlyZSgnLi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbicpO1xuXG52YXIgbWltZVR5cGVzID0gcmVxdWlyZSgnLi9taW1lVHlwZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRGaWxlVHlwZShmaWxlKSB7XG4gIHZhciBmaWxlRXh0ZW5zaW9uID0gZmlsZS5uYW1lID8gZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24oZmlsZS5uYW1lKS5leHRlbnNpb24gOiBudWxsO1xuICBmaWxlRXh0ZW5zaW9uID0gZmlsZUV4dGVuc2lvbiA/IGZpbGVFeHRlbnNpb24udG9Mb3dlckNhc2UoKSA6IG51bGw7XG5cbiAgaWYgKGZpbGUudHlwZSkge1xuICAgIC8vIGlmIG1pbWUgdHlwZSBpcyBzZXQgaW4gdGhlIGZpbGUgb2JqZWN0IGFscmVhZHksIHVzZSB0aGF0XG4gICAgcmV0dXJuIGZpbGUudHlwZTtcbiAgfSBlbHNlIGlmIChmaWxlRXh0ZW5zaW9uICYmIG1pbWVUeXBlc1tmaWxlRXh0ZW5zaW9uXSkge1xuICAgIC8vIGVsc2UsIHNlZSBpZiB3ZSBjYW4gbWFwIGV4dGVuc2lvbiB0byBhIG1pbWUgdHlwZVxuICAgIHJldHVybiBtaW1lVHlwZXNbZmlsZUV4dGVuc2lvbl07XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgYWxsIGZhaWxzLCBmYWxsIGJhY2sgdG8gYSBnZW5lcmljIGJ5dGUgc3RyZWFtIHR5cGVcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTb2NrZXRIb3N0KHVybCkge1xuICAvLyBnZXQgdGhlIGhvc3QgZG9tYWluXG4gIHZhciByZWdleCA9IC9eKD86aHR0cHM/OlxcL1xcL3xcXC9cXC8pPyg/OlteQFxcbl0rQCk/KD86d3d3XFwuKT8oW15cXG5dKykvaTtcbiAgdmFyIGhvc3QgPSByZWdleC5leGVjKHVybClbMV07XG4gIHZhciBzb2NrZXRQcm90b2NvbCA9IC9eaHR0cDpcXC9cXC8vaS50ZXN0KHVybCkgPyAnd3MnIDogJ3dzcyc7XG4gIHJldHVybiBzb2NrZXRQcm90b2NvbCArIFwiOi8vXCIgKyBob3N0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFNwZWVkKGZpbGVQcm9ncmVzcykge1xuICBpZiAoIWZpbGVQcm9ncmVzcy5ieXRlc1VwbG9hZGVkKSByZXR1cm4gMDtcbiAgdmFyIHRpbWVFbGFwc2VkID0gbmV3IERhdGUoKSAtIGZpbGVQcm9ncmVzcy51cGxvYWRTdGFydGVkO1xuICB2YXIgdXBsb2FkU3BlZWQgPSBmaWxlUHJvZ3Jlc3MuYnl0ZXNVcGxvYWRlZCAvICh0aW1lRWxhcHNlZCAvIDEwMDApO1xuICByZXR1cm4gdXBsb2FkU3BlZWQ7XG59OyIsIi8qKlxuICogUmV0dXJucyBhIHRpbWVzdGFtcCBpbiB0aGUgZm9ybWF0IG9mIGBob3VyczptaW51dGVzOnNlY29uZHNgXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VGltZVN0YW1wKCkge1xuICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gIHZhciBob3VycyA9IHBhZChkYXRlLmdldEhvdXJzKCkudG9TdHJpbmcoKSk7XG4gIHZhciBtaW51dGVzID0gcGFkKGRhdGUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkpO1xuICB2YXIgc2Vjb25kcyA9IHBhZChkYXRlLmdldFNlY29uZHMoKS50b1N0cmluZygpKTtcbiAgcmV0dXJuIGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZHM7XG59O1xuLyoqXG4gKiBBZGRzIHplcm8gdG8gc3RyaW5ncyBzaG9ydGVyIHRoYW4gdHdvIGNoYXJhY3RlcnNcbiAqL1xuXG5cbmZ1bmN0aW9uIHBhZChzdHIpIHtcbiAgcmV0dXJuIHN0ci5sZW5ndGggIT09IDIgPyAwICsgc3RyIDogc3RyO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpO1xufTsiLCIvKipcbiAqIENoZWNrIGlmIGFuIG9iamVjdCBpcyBhIERPTSBlbGVtZW50LiBEdWNrLXR5cGluZyBiYXNlZCBvbiBgbm9kZVR5cGVgLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNET01FbGVtZW50KG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREU7XG59OyIsImZ1bmN0aW9uIGlzTmV0d29ya0Vycm9yKHhocikge1xuICBpZiAoIXhocikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4aHIucmVhZHlTdGF0ZSAhPT0gMCAmJiB4aHIucmVhZHlTdGF0ZSAhPT0gNCB8fCB4aHIuc3RhdHVzID09PSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmV0d29ya0Vycm9yOyIsIi8vIF9fX1doeSBub3QgYWRkIHRoZSBtaW1lLXR5cGVzIHBhY2thZ2U/XG4vLyAgICBJdCdzIDE5LjdrQiBnemlwcGVkLCBhbmQgd2Ugb25seSBuZWVkIG1pbWUgdHlwZXMgZm9yIHdlbGwta25vd24gZXh0ZW5zaW9ucyAoZm9yIGZpbGUgcHJldmlld3MpLlxuLy8gX19fV2hlcmUgdG8gdGFrZSBuZXcgZXh0ZW5zaW9ucyBmcm9tP1xuLy8gICAgaHR0cHM6Ly9naXRodWIuY29tL2pzaHR0cC9taW1lLWRiL2Jsb2IvbWFzdGVyL2RiLmpzb25cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZDogJ3RleHQvbWFya2Rvd24nLFxuICBtYXJrZG93bjogJ3RleHQvbWFya2Rvd24nLFxuICBtcDQ6ICd2aWRlby9tcDQnLFxuICBtcDM6ICdhdWRpby9tcDMnLFxuICBzdmc6ICdpbWFnZS9zdmcreG1sJyxcbiAganBnOiAnaW1hZ2UvanBlZycsXG4gIHBuZzogJ2ltYWdlL3BuZycsXG4gIGdpZjogJ2ltYWdlL2dpZicsXG4gIGhlaWM6ICdpbWFnZS9oZWljJyxcbiAgaGVpZjogJ2ltYWdlL2hlaWYnLFxuICB5YW1sOiAndGV4dC95YW1sJyxcbiAgeW1sOiAndGV4dC95YW1sJyxcbiAgY3N2OiAndGV4dC9jc3YnLFxuICB0c3Y6ICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJyxcbiAgdGFiOiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcycsXG4gIGF2aTogJ3ZpZGVvL3gtbXN2aWRlbycsXG4gIG1rczogJ3ZpZGVvL3gtbWF0cm9za2EnLFxuICBta3Y6ICd2aWRlby94LW1hdHJvc2thJyxcbiAgbW92OiAndmlkZW8vcXVpY2t0aW1lJyxcbiAgZG9jOiAnYXBwbGljYXRpb24vbXN3b3JkJyxcbiAgZG9jbTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLmRvY3VtZW50Lm1hY3JvZW5hYmxlZC4xMicsXG4gIGRvY3g6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCcsXG4gIGRvdDogJ2FwcGxpY2F0aW9uL21zd29yZCcsXG4gIGRvdG06ICdhcHBsaWNhdGlvbi92bmQubXMtd29yZC50ZW1wbGF0ZS5tYWNyb2VuYWJsZWQuMTInLFxuICBkb3R4OiAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwudGVtcGxhdGUnLFxuICB4bGE6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bGFtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLmFkZGluLm1hY3JvZW5hYmxlZC4xMicsXG4gIHhsYzogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsZjogJ2FwcGxpY2F0aW9uL3gteGxpZmYreG1sJyxcbiAgeGxtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGxzOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGxzYjogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5iaW5hcnkubWFjcm9lbmFibGVkLjEyJyxcbiAgeGxzbTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5tYWNyb2VuYWJsZWQuMTInLFxuICB4bHN4OiAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnLFxuICB4bHQ6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bHRtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMicsXG4gIHhsdHg6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC50ZW1wbGF0ZScsXG4gIHhsdzogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHR4dDogJ3RleHQvcGxhaW4nLFxuICB0ZXh0OiAndGV4dC9wbGFpbicsXG4gIGNvbmY6ICd0ZXh0L3BsYWluJyxcbiAgbG9nOiAndGV4dC9wbGFpbicsXG4gIHBkZjogJ2FwcGxpY2F0aW9uL3BkZicsXG4gIHppcDogJ2FwcGxpY2F0aW9uL3ppcCcsXG4gICc3eic6ICdhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWQnLFxuICByYXI6ICdhcHBsaWNhdGlvbi94LXJhci1jb21wcmVzc2VkJyxcbiAgdGFyOiAnYXBwbGljYXRpb24veC10YXInLFxuICBnejogJ2FwcGxpY2F0aW9uL2d6aXAnLFxuICBkbWc6ICdhcHBsaWNhdGlvbi94LWFwcGxlLWRpc2tpbWFnZSdcbn07IiwidmFyIHNlY29uZHNUb1RpbWUgPSByZXF1aXJlKCcuL3NlY29uZHNUb1RpbWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwcmV0dHlFVEEoc2Vjb25kcykge1xuICB2YXIgdGltZSA9IHNlY29uZHNUb1RpbWUoc2Vjb25kcyk7IC8vIE9ubHkgZGlzcGxheSBob3VycyBhbmQgbWludXRlcyBpZiB0aGV5IGFyZSBncmVhdGVyIHRoYW4gMCBidXQgYWx3YXlzXG4gIC8vIGRpc3BsYXkgbWludXRlcyBpZiBob3VycyBpcyBiZWluZyBkaXNwbGF5ZWRcbiAgLy8gRGlzcGxheSBhIGxlYWRpbmcgemVybyBpZiB0aGUgdGhlcmUgaXMgYSBwcmVjZWRpbmcgdW5pdDogMW0gMDVzLCBidXQgNXNcblxuICB2YXIgaG91cnNTdHIgPSB0aW1lLmhvdXJzID8gdGltZS5ob3VycyArICdoICcgOiAnJztcbiAgdmFyIG1pbnV0ZXNWYWwgPSB0aW1lLmhvdXJzID8gKCcwJyArIHRpbWUubWludXRlcykuc3Vic3RyKC0yKSA6IHRpbWUubWludXRlcztcbiAgdmFyIG1pbnV0ZXNTdHIgPSBtaW51dGVzVmFsID8gbWludXRlc1ZhbCArICdtJyA6ICcnO1xuICB2YXIgc2Vjb25kc1ZhbCA9IG1pbnV0ZXNWYWwgPyAoJzAnICsgdGltZS5zZWNvbmRzKS5zdWJzdHIoLTIpIDogdGltZS5zZWNvbmRzO1xuICB2YXIgc2Vjb25kc1N0ciA9IHRpbWUuaG91cnMgPyAnJyA6IG1pbnV0ZXNWYWwgPyAnICcgKyBzZWNvbmRzVmFsICsgJ3MnIDogc2Vjb25kc1ZhbCArICdzJztcbiAgcmV0dXJuIFwiXCIgKyBob3Vyc1N0ciArIG1pbnV0ZXNTdHIgKyBzZWNvbmRzU3RyO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlY29uZHNUb1RpbWUocmF3U2Vjb25kcykge1xuICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKHJhd1NlY29uZHMgLyAzNjAwKSAlIDI0O1xuICB2YXIgbWludXRlcyA9IE1hdGguZmxvb3IocmF3U2Vjb25kcyAvIDYwKSAlIDYwO1xuICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IocmF3U2Vjb25kcyAlIDYwKTtcbiAgcmV0dXJuIHtcbiAgICBob3VyczogaG91cnMsXG4gICAgbWludXRlczogbWludXRlcyxcbiAgICBzZWNvbmRzOiBzZWNvbmRzXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHByb21pc2VzKSB7XG4gIHZhciByZXNvbHV0aW9ucyA9IFtdO1xuICB2YXIgcmVqZWN0aW9ucyA9IFtdO1xuXG4gIGZ1bmN0aW9uIHJlc29sdmVkKHZhbHVlKSB7XG4gICAgcmVzb2x1dGlvbnMucHVzaCh2YWx1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWplY3RlZChlcnJvcikge1xuICAgIHJlamVjdGlvbnMucHVzaChlcnJvcik7XG4gIH1cblxuICB2YXIgd2FpdCA9IFByb21pc2UuYWxsKHByb21pc2VzLm1hcChmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgIHJldHVybiBwcm9taXNlLnRoZW4ocmVzb2x2ZWQsIHJlamVjdGVkKTtcbiAgfSkpO1xuICByZXR1cm4gd2FpdC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2Vzc2Z1bDogcmVzb2x1dGlvbnMsXG4gICAgICBmYWlsZWQ6IHJlamVjdGlvbnNcbiAgICB9O1xuICB9KTtcbn07IiwiLyoqXG4gKiBDb252ZXJ0cyBsaXN0IGludG8gYXJyYXlcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0FycmF5KGxpc3QpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGxpc3QgfHwgW10sIDApO1xufTsiXSwic291cmNlUm9vdCI6IiJ9