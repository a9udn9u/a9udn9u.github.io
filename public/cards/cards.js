(function () {
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

var SEARCH_PAGE_SIZE = 10;

var DEBUG = window.location.hash === '#debug';

var Tabs = {
  BUILD: 0, REVIEW: 1
};

var Events = {
  IMAGE_SEARCH_RESULTS: 'ISR',
  IMAGE_SEARCH_KICKOFF: 'ISK',
  NAVIGATE_PAGE: 'NP',
  ADD_CARD: 'AC'
};

var SearchJob = function SearchJob(terms, startIndex) {
  var _this = this;

  classCallCheck(this, SearchJob);

  this.id = function () {
    return _this.terms + '~' + _this.startIndex;
  };

  this.terms = terms;
  this.startIndex = startIndex;
  this.response = null;
};

var Card = function Card(text, image) {
  classCallCheck(this, Card);

  this.text = text;
  this.image = image;
  this.index = 0;
  this.fontSize = 0;
};

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
      Utils$1.debug(type, 'registered');
    }
  }, {
    key: 'off',
    value: function off(type, handler) {
      var handlers = EventHub.events.get(type);
      if (handlers) {
        handlers.delete(handler);
      }
      Utils$1.debug(type, 'deregistered');
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

          Utils$1.debug(type, 'fired');
        }, 0);
      }
    }
  }]);
  return EventHub;
}();

EventHub.events = new Map();
var Utils$1 = function () {
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
    classCallCheck(this, ImageSearch);
  }

  createClass(ImageSearch, null, [{
    key: 'search',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(terms, start, size) {
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
                _context.t0 = JSON;
                _context.next = 7;
                return Utils$1.fetch(proxyUrl);

              case 7:
                _context.t1 = _context.sent;
                resp = _context.t0.parse.call(_context.t0, _context.t1);

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

// Application - build page - search bar
var SearchBar = function (_React$Component) {
  inherits(SearchBar, _React$Component);

  function SearchBar(props) {
    var _this2 = this;

    classCallCheck(this, SearchBar);

    var _this = possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call(this, props));

    _this.doSearch = function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(job) {
        var cachedJob, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                job.terms = job.terms.replace(/(^\s+|\s+$)/g, '');

                if (!job.terms) {
                  _context.next = 20;
                  break;
                }

                cachedJob = _this.cache.get(job.id());

                if (!(cachedJob === undefined)) {
                  _context.next = 19;
                  break;
                }

                _this.cache.set(job.id(), job);
                response = void 0;
                _context.prev = 6;
                _context.next = 9;
                return ImageSearch.search(job.terms, job.startIndex, SEARCH_PAGE_SIZE);

              case 9:
                response = _context.sent;
                _context.next = 16;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](6);

                Utils$1.debug(job.id() + ' job failed with exception:', _context.t0);
                _this.cache.delete(job.id());

              case 16:
                if (response) {
                  if (response.error) {
                    Utils$1.debug(job.id() + ' job failed with error: ' + response.error);
                    _this.cache.delete(job.id()); // Delete job so it will be tried again.
                  } else {
                    Utils$1.debug(job.id() + ' job response received');
                    job.response = response;
                    EventHub.fire(Events.IMAGE_SEARCH_RESULTS, job);
                  }
                }
                _context.next = 20;
                break;

              case 19:
                if (!cachedJob.response) {
                  Utils$1.debug(job.id() + ' job in progress, ignoring');
                } else {
                  Utils$1.debug(job.id() + ' job cache hit');
                  EventHub.fire(Events.IMAGE_SEARCH_RESULTS, cachedJob);
                }

              case 20:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2, [[6, 12]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.render = function () {
      return React.createElement(
        'div',
        { className: 'center search-bar' },
        React.createElement(Ons.SearchInput, { placeholder: '\u641C\u7D22\u914D\u56FE', onChange: function onChange(e) {
            return _this.setState({ terms: e.target.value });
          } }),
        React.createElement(
          Ons.Button,
          { modifier: 'quiet', onClick: function onClick(e) {
              return EventHub.fire(Events.IMAGE_SEARCH_KICKOFF, new SearchJob(_this.state.terms, 0));
            } },
          '\u641C\u7D22'
        )
      );
    };

    _this.state = { terms: '' };
    _this.cache = new Map();
    EventHub.on(Events.IMAGE_SEARCH_KICKOFF, _this.doSearch);
    return _this;
  }

  return SearchBar;
}(React.Component);

// Application - build page - image list
var ImageList = function (_React$Component) {
  inherits(ImageList, _React$Component);

  function ImageList(props) {
    classCallCheck(this, ImageList);

    var _this = possibleConstructorReturn(this, (ImageList.__proto__ || Object.getPrototypeOf(ImageList)).call(this, props));

    _this.shouldComponentUpdate = function (nextProps, nextState) {
      return nextState.shouldShow !== _this.state.shouldShow || nextState.itemHeight !== _this.state.itemHeight || nextState.images !== _this.state.images;
    };

    _this.componentDidMount = function () {
      _this.calculateItemHeight();
      window.addEventListener('resize', _this.calculateItemHeight);
    };

    _this.componentWillUnmount = function () {
      window.removeEventListener('resize', _this.calculateItemHeight);
    };

    _this.calculateItemHeight = function () {
      var width = document.body.clientWidth,
          height = document.body.clientHeight;
      if (width < height) {
        // Portrait mode
        _this.setState({ itemHeight: width });
      } else {
        _this.setState({ itemHeight: Math.floor(height / 3) });
      }
    };

    _this.getItemHeight = function () {
      return _this.state.itemHeight;
    };

    _this.selectImage = function (image) {
      var card = new Card(_this.state.terms, image);
      EventHub.fire(Events.NAVIGATE_PAGE, { index: Tabs.REVIEW });
      EventHub.fire(Events.ADD_CARD, card);
    };

    _this.renderRow = function (index) {
      var size = _this.state.images.length;
      var src = _this.state.images[index];

      if (index % SEARCH_PAGE_SIZE === 0 && index + SEARCH_PAGE_SIZE >= size) {
        setTimeout(function () {
          EventHub.fire(Events.IMAGE_SEARCH_KICKOFF, new SearchJob(_this.state.terms, size));
        }, 0);
      }

      return !src ? null : React.createElement('img', { key: index, className: 'search-image', src: src,
        onClick: function onClick() {
          _this.selectImage(src);
        },
        style: {
          height: _this.state.itemHeight,
          width: _this.state.itemHeight
        } });
    };

    _this.render = function () {
      if (_this.state.shouldShow) {
        return React.createElement(Ons.LazyList, { className: 'search-list', length: 10000,
          renderRow: _this.renderRow, calculateItemHeight: _this.getItemHeight });
      } else {
        return null;
      }
    };

    _this.state = {
      terms: undefined,
      images: [],
      shouldShow: false,
      itemHeight: 100
    };

    EventHub.on(Events.IMAGE_SEARCH_RESULTS, function (job) {
      if (_this.state.terms !== job.terms && job.startIndex !== 0) {
        Utils.debug(job.id() + ' is likely a stale job, ignoring');
      } else {
        var data = job.response;
        var images = data.items.map(function (i) {
          return i.link;
        });
        var startIndex = job.startIndex;
        if (job.startIndex !== 0) {
          var tmp = images;
          images = _this.state.images; // Keep reference so no re-render is triggered
          images[startIndex + tmp.length - 1] = undefined; // Ensure array length
          images.splice.apply(images, [startIndex, tmp.length].concat(tmp));
        }
        _this.setState({
          images: images,
          terms: job.terms,
          shouldShow: true
        });
      }
    });
    return _this;
  }

  return ImageList;
}(React.Component);

// Application - build page
var BuildPage = function (_React$Component) {
  inherits(BuildPage, _React$Component);

  function BuildPage(props) {
    classCallCheck(this, BuildPage);

    var _this = possibleConstructorReturn(this, (BuildPage.__proto__ || Object.getPrototypeOf(BuildPage)).call(this, props));

    _this.renderToolbar = function () {
      return React.createElement(
        Ons.Toolbar,
        null,
        React.createElement(SearchBar, null)
      );
    };

    _this.renderModal = function () {
      return React.createElement(
        Ons.Modal,
        { isOpen: _this.state.loading },
        React.createElement(Ons.ProgressCircular, { indeterminate: true })
      );
    };

    _this.render = function () {
      return React.createElement(
        Ons.Page,
        { className: 'build-page',
          renderToolbar: _this.renderToolbar,
          renderModal: _this.renderModal },
        React.createElement(ImageList, null)
      );
    };

    _this.state = { loading: false };
    EventHub.on(Events.IMAGE_SEARCH_KICKOFF, function (job) {
      if (job.startIndex === 0) {
        _this.setState({ loading: true });
      }
    });
    EventHub.on(Events.IMAGE_SEARCH_RESULTS, function (job) {
      if (job.startIndex === 0) {
        Utils$1.animScroll(document.querySelector('.build-page .page__content'), 0);
        _this.setState({ loading: false });
      }
    });
    return _this;
  }

  return BuildPage;
}(React.Component);

// Application - review page - card list
var CardList = function (_React$Component) {
  inherits(CardList, _React$Component);

  function CardList(props) {
    classCallCheck(this, CardList);

    var _this = possibleConstructorReturn(this, (CardList.__proto__ || Object.getPrototypeOf(CardList)).call(this, props));

    _this.calculateCardStyle = function () {
      var width = document.body.clientWidth,
          height = document.body.clientHeight;
      if (width < height) {
        // Portrait mode
        _this.cardStyle.width = width;
        _this.rowHeightFactor = 2;
        _this.rowStyle.flexDir = 'column';
      } else {
        _this.cardStyle.width = width / 2;
        _this.rowHeightFactor = 1;
        _this.rowStyle.flexDir = 'row';
      }
      _this.cardStyle.width -= _this.cardMargin * 2;
      _this.cardStyle.height = _this.cardStyle.width * _this.aspectRatio;
      _this.rowStyle.height = _this.cardStyle.height * _this.rowHeightFactor;
    };

    _this.addCard = function (card) {
      if (!_this.cardHolder.has(card.text)) {
        var textWidth = Math.min(_this.cardStyle.width * 0.6, _this.cardStyle.height * 0.8);
        var length = card.text.length;
        card.fontSize = textWidth / length;
        card.index = _this.state.cards.length;
        _this.cardHolder.set(card.text, card);
        _this.state.cards[card.index] = card;
      } else {
        _this.cardHolder.get(card.text).image = card.image;
      }

      _this.setState({
        cards: _this.state.cards
      });

      setTimeout(function () {
        var highlightCard = _this.cardHolder.get(card.text);
        Utils$1.animScroll(document.querySelector('.review-page .page__content'), _this.rowHeightFactor * highlightCard.index * _this.cardStyle.height);
      }, 300);
    };

    _this.renderRow = function (card) {
      return React.createElement(
        'div',
        { key: card.index, className: 'card', style: {
            marginLeft: _this.cardMargin,
            marginRight: _this.cardMargin,
            height: _this.rowStyle.height,
            flexDirection: _this.rowStyle.flexDir
          } },
        React.createElement(
          'div',
          { className: 'card-text', style: Object.assign({ fontSize: card.fontSize }, _this.cardStyle) },
          card.text
        ),
        React.createElement('img', { className: 'card-image', style: _this.cardStyle, src: card.image })
      );
    };

    _this.render = function () {
      return React.createElement(Ons.List, { dataSource: _this.state.cards, renderRow: _this.renderRow });
    };

    _this.state = { cards: [] };
    _this.cardHolder = props.cardHolder;
    _this.cardStyle = {};
    _this.rowStyle = {};
    _this.rowHeightFactor = 1;
    _this.aspectRatio = 8.5 / 11; // US letter
    _this.cardMargin = 8;
    _this.calculateCardStyle();
    EventHub.on(Events.ADD_CARD, _this.addCard);
    return _this;
  }

  return CardList;
}(React.Component);

// Application - review page
var ReviewPage = function (_React$Component) {
  inherits(ReviewPage, _React$Component);

  function ReviewPage(props) {
    classCallCheck(this, ReviewPage);

    var _this = possibleConstructorReturn(this, (ReviewPage.__proto__ || Object.getPrototypeOf(ReviewPage)).call(this, props));

    _this.build = function () {
      var view = document.querySelector('#print');
      var fragment = document.createDocumentFragment();
      var dpi = Utils$1.getDPI();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this.cardHolder.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var card = _step.value;

          var pageWidth = Math.floor(dpi * 11),
              pageHeight = Math.floor((dpi - 1) * 8.5);
          var textWidth = Math.min(pageWidth * 0.6, pageHeight * 0.8);
          var fontSize = textWidth / card.text.length;
          var textEl = document.createElement('div');
          var imageEl = document.createElement('img');
          textEl.style.width = imageEl.style.width = pageWidth + 'px';
          textEl.style.height = imageEl.style.height = pageHeight + 'px';
          textEl.style.fontSize = fontSize + 'px';
          textEl.className = 'text';
          imageEl.className = 'image';
          textEl.textContent = card.text;
          imageEl.src = card.image;
          fragment.appendChild(textEl);
          fragment.appendChild(imageEl);
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

      view.innerHTML = '';
      view.appendChild(fragment);
      window.print();
    };

    _this.renderToolbar = function () {
      return React.createElement(
        Ons.Toolbar,
        null,
        React.createElement(
          'div',
          { className: 'center action-bar' },
          React.createElement(
            Ons.Button,
            { modifier: 'quiet', onClick: _this.build },
            '\u521B\u5EFA\u5B57\u5361'
          )
        )
      );
    };

    _this.render = function () {
      return React.createElement(
        Ons.Page,
        { className: 'review-page', renderToolbar: _this.renderToolbar },
        React.createElement(CardList, { cardHolder: _this.cardHolder })
      );
    };

    _this.cardHolder = new CardHolder();
    return _this;
  }

  return ReviewPage;
}(React.Component);

// Application - bottom tab bar
var TabBar = function (_React$Component) {
  inherits(TabBar, _React$Component);

  function TabBar(props) {
    classCallCheck(this, TabBar);

    var _this = possibleConstructorReturn(this, (TabBar.__proto__ || Object.getPrototypeOf(TabBar)).call(this, props));

    _this.renderTabs = function () {
      return [{
        content: React.createElement(BuildPage, { key: 'build-page' }),
        tab: React.createElement(Ons.Tab, { key: 'build-tab', label: '\u5236\u4F5C', icon: 'ion-settings' })
      }, {
        content: React.createElement(ReviewPage, { key: 'review-page' }),
        tab: React.createElement(Ons.Tab, { key: 'review-tab', label: '\u67E5\u770B', icon: 'ion-eye' })
      }];
    };

    _this.chooseTab = function (evt) {
      if (evt.index !== _this.state.selected) {
        _this.setState({ selected: evt.index });
      }
    };

    _this.render = function () {
      return React.createElement(Ons.Tabbar, { position: 'bottom', index: _this.state.selected,
        onPreChange: _this.chooseTab,
        renderTabs: _this.renderTabs });
    };

    _this.state = { selected: Tabs.BUILD };
    EventHub.on(Events.NAVIGATE_PAGE, _this.chooseTab);
    return _this;
  }

  return TabBar;
}(React.Component);

// Application

var App = function (_React$Component) {
  inherits(App, _React$Component);

  function App(props) {
    classCallCheck(this, App);

    var _this = possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.renderToolbar = function () {
      return React.createElement(
        Ons.Toolbar,
        { className: 'page-toolbar' },
        React.createElement(
          'div',
          { className: 'center' },
          '\u723D\u59D0\u5B57\u5361'
        )
      );
    };

    _this.render = function () {
      return React.createElement(
        Ons.Page,
        { renderToolbar: _this.renderToolbar, className: 'shuang' },
        React.createElement(TabBar, null)
      );
    };

    return _this;
  }

  return App;
}(React.Component);

Utils$1.loadFont('./res/pzh.woff2');
Utils$1.debug('%cIn DEBUG mode', 'font-weight: bold;');
ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

}());
