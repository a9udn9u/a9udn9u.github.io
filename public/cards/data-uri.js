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

var URL = 'https://coverli.com/datauri.php';

var DataURI = function () {
  function DataURI() {
    classCallCheck(this, DataURI);
  }

  createClass(DataURI, null, [{
    key: 'get',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(res) {
        var resp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return fetch(URL + '?url=' + res);

              case 2:
                resp = _context.sent;

                if (!(resp.status < 200 || resp.status > 299)) {
                  _context.next = 11;
                  break;
                }

                _context.t0 = 'Failed to convert ' + res + ' to data URI. ';
                _context.next = 7;
                return resp.text();

              case 7:
                _context.t1 = _context.sent;
                throw _context.t0 + _context.t1;

              case 11:
                _context.next = 13;
                return resp.text();

              case 13:
                return _context.abrupt('return', _context.sent);

              case 14:
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
