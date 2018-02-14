'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var URL = 'https://www.googleapis.com/customsearch/v1';
  var PARAMS = {
    cx: encodeURIComponent('003167219205452866620:qvdmbjivnhy'),
    key: 'AIzaSyD-a9IF8KKYgoC3cpgS-Al7hLQDbugrDcw',
    searchType: 'image',
    imgSize: 'xxlarge',
    num: 10, // Don't change
    start: 1, // One based
    q: ''
  };

  var PROXY_URL = 'https://coverli.com/proxy.php';
  var PROXY_PARAMS = {
    url: '',
    headers: encodeURIComponent(JSON.stringify({
      'accept': '*/*',
      'authority': 'content.googleapis.com',
      'referer': 'https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en.kthftFlWUcg.O%2Fm%3D__features__%2Fam%3DIA%2Frt%3Dj%2Fd%3D1%2Frs%3DAGLTcCMzBE2ZaPcT0cbwbgEw9XJStD2EYA',
      'x-goog-encode-response-if-executable': 'base64',
      'x-origin': 'https://developers.google.com',
      'x-referer': 'https://developers.google.com',
      'x-requested-with': 'XMLHttpRequest',
      'x-javascript-user-agent': 'google-api-javascript-client/1.1.0',
      'x-clientdetails': 'appVersion=5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_12_6)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F63.0.3239.132%20Safari%2F537.36&platform=MacIntel&userAgent=Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_12_6)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F63.0.3239.132%20Safari%2F537.36'
    }))
  };

  var serializeParams = function serializeParams(params) {
    return Object.keys(params).map(function (k) {
      return k + '=' + params[k];
    }).join('&');
  };

  var ImageSearch = function () {
    function ImageSearch() {
      _classCallCheck(this, ImageSearch);
    }

    _createClass(ImageSearch, null, [{
      key: 'search',
      value: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(terms, start, size) {
          var params, url, proxyParams, proxyUrl, resp;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  params = Object.assign({}, PARAMS, {
                    q: encodeURIComponent(terms),
                    start: parseInt(start) + 1,
                    num: parseInt(size)
                  });
                  url = URL + '?' + serializeParams(params);
                  proxyParams = Object.assign({}, PROXY_PARAMS, {
                    url: encodeURIComponent(url)
                  });
                  proxyUrl = PROXY_URL + '?' + serializeParams(proxyParams);
                  _context.next = 6;
                  return fetch(proxyUrl);

                case 6:
                  _context.next = 8;
                  return _context.sent.json();

                case 8:
                  resp = _context.sent;

                  if (!resp.error) {
                    _context.next = 13;
                    break;
                  }

                  return _context.abrupt('return', resp);

                case 13:
                  return _context.abrupt('return', JSON.parse(resp.text));

                case 14:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function search(_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        }

        return search;
      }()
    }]);

    return ImageSearch;
  }();

  window.ImageSearch = ImageSearch;
})();