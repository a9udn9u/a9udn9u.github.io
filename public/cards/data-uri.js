var LastStepDummyName = (function (exports) {
'use strict';

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * Models, constants, utils
 */



var DEBUG = window.location.hash === '#debug';









var CardHolder = function (_Map) {
  inherits(CardHolder, _Map);

  function CardHolder() {
    classCallCheck(this, CardHolder);
    return possibleConstructorReturn(this, (CardHolder.__proto__ || Object.getPrototypeOf(CardHolder)).call(this));
  }

  return CardHolder;
}(Map);

// Quick & dirty event helpers
var EventHub = function () {
  function EventHub() {
    classCallCheck(this, EventHub);
  }

  createClass(EventHub, null, [{
    key: 'on',
    value: function on(type, handler) {
      var handlers = EventHub.events.get(type);
      if (!handlers) {
        handlers = new Set();
        EventHub.events.set(type, handlers);
      }
      handlers.add(handler);
      Utils.debug(type, 'registered');
    }
  }, {
    key: 'off',
    value: function off(type, handler) {
      var handlers = EventHub.events.get(type);
      if (handlers) {
        handlers.delete(handler);
      }
      Utils.debug(type, 'deregistered');
    }
  }, {
    key: 'fire',
    value: function fire(type, data) {
      var handlers = EventHub.events.get(type);
      if (handlers) {
        setTimeout(function () {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = handlers.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var handler = _step.value;

              handler(data);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          Utils.debug(type, 'fired');
        }, 0);
      }
    }
  }]);
  return EventHub;
}();

EventHub.events = new Map();
var Utils = function () {
  function Utils() {
    classCallCheck(this, Utils);
  }

  createClass(Utils, null, [{
    key: 'debug',
    value: function debug() {
      if (DEBUG) {
        console.debug.apply(console, arguments);
      }
    }
  }, {
    key: 'animScroll',
    value: function animScroll(element, scrollTop, options) {
      var firstChild = element.children[0];
      if (firstChild) {
        Velocity(firstChild, 'scroll', Object.assign({}, options || {}, {
          container: element,
          offset: scrollTop
        }));
      }
    }
  }, {
    key: 'loadFont',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path) {
        var ver = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1';
        var components, versionKey, valueKey, version, value, style, css;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                components = (path || '').match(/(?:^|.*\/)([^\/]+)\.([^\/\.]+)$/);

                if (components) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return');

              case 3:
                versionKey = path + '-version';
                valueKey = path + '-value';
                version = localStorage.getItem(versionKey);
                value = void 0;

                if (!(!version || version !== ver || !(value = localStorage.getItem(valueKey)))) {
                  _context.next = 13;
                  break;
                }

                _context.next = 10;
                return Utils.fetch(path);

              case 10:
                value = _context.sent;

                localStorage.setItem(versionKey, ver);
                localStorage.setItem(valueKey, value);

              case 13:
                style = document.createElement('style');
                css = '\n      @font-face {\n        font-family: \'' + components[1] + '\';\n        src: url(\'' + value.trim() + '\') format(\'' + components[2] + '\');\n        font-weight: 400;\n        font-style: normal;\n      }';

                style.setAttribute('type', 'text/css');
                style.appendChild(document.createTextNode(css));
                document.head.appendChild(style);

              case 18:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadFont(_x3) {
        return _ref.apply(this, arguments);
      }

      return loadFont;
    }()
  }, {
    key: 'fetch',
    value: function (_fetch) {
      function fetch(_x) {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
        var retry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
        var text, status, msg, resp;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                text = void 0, status = void 0, msg = void 0;

              case 1:
                if (!retry--) {
                  _context2.next = 18;
                  break;
                }

                _context2.next = 4;
                return fetch('' + url);

              case 4:
                resp = _context2.sent;

                if (!(resp.status >= 200 && resp.status <= 299)) {
                  _context2.next = 12;
                  break;
                }

                _context2.next = 8;
                return resp.text();

              case 8:
                text = _context2.sent;
                return _context2.abrupt('break', 18);

              case 12:
                status = resp.status;
                _context2.next = 15;
                return resp.text();

              case 15:
                msg = _context2.sent;

              case 16:
                _context2.next = 1;
                break;

              case 18:
                if (text) {
                  _context2.next = 20;
                  break;
                }

                throw 'Failed fetching ' + url + '. Status: ' + status + ', message: ' + msg;

              case 20:
                return _context2.abrupt('return', text);

              case 21:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x5) {
        return _ref2.apply(this, arguments);
      };
    }())
  }, {
    key: 'getDPI',
    value: function getDPI() {
      var div = document.createElement('div');
      div.style.height = '1in';
      div.style.width = '1in';
      div.style.top = '-100%';
      div.style.left = '-100%';
      div.style.position = 'absolute';
      document.body.appendChild(div);
      var result = div.offsetHeight;
      document.body.removeChild(div);
      return result;
    }
  }]);
  return Utils;
}();

var URL = 'https://coverli.com/datauri.php';

var DataURI = function () {
  function DataURI() {
    classCallCheck(this, DataURI);
  }

  createClass(DataURI, null, [{
    key: 'get',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(res) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Utils.fetch(URL + '?url=' + res);

              case 2:
                return _context.abrupt('return', _context.sent);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get$$1(_x) {
        return _ref.apply(this, arguments);
      }

      return get$$1;
    }()
  }]);
  return DataURI;
}();

exports.DataURI = DataURI;

return exports;

}({}));
