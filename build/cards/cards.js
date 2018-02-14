'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ons: Onsen UI core API: https://onsen.io/v2/api/js/
// Ons: Onsen UI React components: https://onsen.io/v2/api/react/
// ImageSearch: Defined in search.js

var SEARCH_PAGE_SIZE = 10;
var DEBUG = window.location.hash === '#debug';

var Events = {
  IMAGE_SEARCH_RESULTS: 'ISR',
  IMAGE_SEARCH_KICKOFF: 'ISK'
};

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'debug',
    value: function debug() {
      if (DEBUG) {
        console.debug.apply(console, arguments);
      }
    }
  }]);

  return Utils;
}();

var SearchJob = function SearchJob(terms, startIndex) {
  var _this = this;

  _classCallCheck(this, SearchJob);

  this.id = function () {
    return _this.terms + '~' + _this.startIndex;
  };

  this.terms = terms;
  this.startIndex = startIndex;
  this.response = null;
};

// Quick & dirty event helpers


var EventHub = function () {
  function EventHub() {
    _classCallCheck(this, EventHub);
  }

  _createClass(EventHub, null, [{
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

// Application


EventHub.events = new Map();

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this2.renderToolbar = function () {
      return React.createElement(
        Ons.Toolbar,
        null,
        React.createElement(
          'div',
          { className: 'center' },
          '\u723D\u59D0\u7684\u4E2D\u6587\u5B57\u5361\u5236\u4F5C\u5DE5\u5177'
        )
      );
    };

    _this2.render = function () {
      return React.createElement(
        Ons.Page,
        { renderToolbar: _this2.renderToolbar, className: 'shuang' },
        React.createElement(TabBar, null)
      );
    };

    return _this2;
  }

  return App;
}(React.Component);

// Application - bottom tab bar


var TabBar = function (_React$Component2) {
  _inherits(TabBar, _React$Component2);

  function TabBar(props) {
    _classCallCheck(this, TabBar);

    var _this3 = _possibleConstructorReturn(this, (TabBar.__proto__ || Object.getPrototypeOf(TabBar)).call(this, props));

    _this3.renderTabs = function () {
      return [{
        content: React.createElement(BuildPage, { key: 'build-page' }),
        tab: React.createElement(Ons.Tab, { key: 'build-tab', label: '\u5236\u4F5C', icon: 'ion-settings' })
      }, {
        content: React.createElement(ReviewPage, { key: 'review-page' }),
        tab: React.createElement(Ons.Tab, { key: 'review-tab', label: '\u67E5\u770B', icon: 'ion-eye' })
      }];
    };

    _this3.chooseTab = function (evt) {
      if (evt.index !== _this3.state.selected) {
        _this3.setState({ selected: evt.index });
      }
    };

    _this3.render = function () {
      return React.createElement(Ons.Tabbar, { position: 'bottom', index: _this3.state.selected,
        onPreChange: _this3.chooseTab,
        renderTabs: _this3.renderTabs });
    };

    _this3.state = { selected: 0 };
    return _this3;
  }

  return TabBar;
}(React.Component);

// Application - build page


var BuildPage = function (_React$Component3) {
  _inherits(BuildPage, _React$Component3);

  function BuildPage(props) {
    _classCallCheck(this, BuildPage);

    var _this4 = _possibleConstructorReturn(this, (BuildPage.__proto__ || Object.getPrototypeOf(BuildPage)).call(this, props));

    _this4.renderToolbar = function () {
      return React.createElement(
        Ons.Toolbar,
        null,
        React.createElement(SearchBar, null)
      );
    };

    _this4.render = function () {
      return React.createElement(
        Ons.Page,
        { renderToolbar: _this4.renderToolbar },
        React.createElement(ImageList, null)
      );
    };

    return _this4;
  }

  return BuildPage;
}(React.Component);

// Application - build page - search bar


var SearchBar = function (_React$Component4) {
  _inherits(SearchBar, _React$Component4);

  function SearchBar(props) {
    var _this6 = this;

    _classCallCheck(this, SearchBar);

    var _this5 = _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call(this, props));

    _this5.doSearch = function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(terms, startIndex) {
        var job, cachedJob, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                terms = terms.replace(/(^\s+|\s+$)/g, '');

                if (!terms) {
                  _context.next = 21;
                  break;
                }

                job = new SearchJob(terms, startIndex);
                cachedJob = _this5.cache.get(job.id());

                if (!(cachedJob === undefined)) {
                  _context.next = 20;
                  break;
                }

                _this5.cache.set(job.id(), job);
                response = void 0;
                _context.prev = 7;
                _context.next = 10;
                return ImageSearch.search(job.terms, job.startIndex, SEARCH_PAGE_SIZE);

              case 10:
                response = _context.sent;
                _context.next = 17;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context['catch'](7);

                Utils.debug(job.id() + ' job failed with exception:', _context.t0);
                _this5.cache.delete(job.id());

              case 17:
                if (response) {
                  if (response.error) {
                    Utils.debug(job.id() + ' job failed with error: ' + response.error);
                    _this5.cache.delete(job.id()); // Delete job so it will be tried again.
                  } else {
                    Utils.debug(job.id() + ' job response received');
                    job.response = response;
                    EventHub.fire(Events.IMAGE_SEARCH_RESULTS, job);
                  }
                }
                _context.next = 21;
                break;

              case 20:
                if (!cachedJob.response) {
                  Utils.debug(job.id() + ' job in progress, ignoring');
                } else {
                  Utils.debug(job.id() + ' job cache hit');
                  EventHub.fire(Events.IMAGE_SEARCH_RESULTS, cachedJob);
                }

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this6, [[7, 13]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    _this5.render = function () {
      return React.createElement(
        'div',
        { className: 'center search-bar' },
        React.createElement(Ons.SearchInput, { placeholder: '\u641C\u7D22\u914D\u56FE', onChange: function onChange(e) {
            return _this5.setState({ terms: e.target.value });
          } }),
        React.createElement(
          Ons.Button,
          { modifier: 'quiet', onClick: function onClick(e) {
              return _this5.doSearch(_this5.state.terms, 0);
            } },
          '\u641C\u7D22'
        )
      );
    };

    _this5.state = { terms: '' };
    _this5.cache = new Map();
    EventHub.on(Events.IMAGE_SEARCH_KICKOFF, function (job) {
      return _this5.doSearch(job.terms, job.startIndex);
    });
    return _this5;
  }

  return SearchBar;
}(React.Component);

// Application - build page - image list


var ImageList = function (_React$Component5) {
  _inherits(ImageList, _React$Component5);

  function ImageList(props) {
    _classCallCheck(this, ImageList);

    var _this7 = _possibleConstructorReturn(this, (ImageList.__proto__ || Object.getPrototypeOf(ImageList)).call(this, props));

    _this7.shouldComponentUpdate = function (nextProps, nextState) {
      if (nextState.shouldShow !== _this7.state.shouldShow) {
        return true;
      }
      return false;
    };

    _this7.getItemHeight = function () {
      return 42 + 2;
    };

    _this7.renderRow = function (index) {
      var size = _this7.state.images.length;
      var src = _this7.state.images[index];

      if (index % SEARCH_PAGE_SIZE === 0 && index + SEARCH_PAGE_SIZE >= size) {
        setTimeout(function () {
          EventHub.fire(Events.IMAGE_SEARCH_KICKOFF, new SearchJob(_this7.state.terms, size));
        }, 0);
      }

      return !src ? null : React.createElement('img', { key: index, style: { margin: '5px', width: 'calc(100% - 10px)' }, src: src });
    };

    _this7.render = function () {
      if (_this7.state.shouldShow) {
        return React.createElement(Ons.LazyList, { length: 10000, renderRow: _this7.renderRow, calculateItemHeight: _this7.getItemHeight });
      } else {
        return null;
      }
    };

    _this7.state = {
      terms: undefined,
      images: [],
      shouldShow: false
    };

    EventHub.on(Events.IMAGE_SEARCH_RESULTS, function (job) {
      if (_this7.state.terms !== job.terms && job.startIndex !== 0) {
        Utils.debug(job.id() + ' is likely a stale job, ignoring');
      } else {
        var data = job.response;
        var images = data.items.map(function (i) {
          return i.link;
        });
        var startIndex = job.startIndex;
        if (job.startIndex !== 0) {
          var tmp = images;
          images = _this7.state.images.slice();
          images[startIndex + tmp.length - 1] = undefined; // Ensure array length
          images.splice.apply(images, [startIndex, tmp.length].concat(tmp));
        }
        _this7.setState({
          images: images,
          terms: job.terms,
          shouldShow: true
        });
      }
    });
    return _this7;
  }

  return ImageList;
}(React.Component);

// Application - review page


var ReviewPage = function (_React$Component6) {
  _inherits(ReviewPage, _React$Component6);

  function ReviewPage(props) {
    _classCallCheck(this, ReviewPage);

    var _this8 = _possibleConstructorReturn(this, (ReviewPage.__proto__ || Object.getPrototypeOf(ReviewPage)).call(this, props));

    _this8.render = function () {
      return React.createElement(
        Ons.Page,
        null,
        React.createElement(
          'section',
          { className: 'center' },
          '\u68C0\u89C6'
        )
      );
    };

    return _this8;
  }

  return ReviewPage;
}(React.Component);

Utils.debug('%cIn DEBUG mode', 'font-weight: bold;');
ReactDOM.render(React.createElement(App, null), document.getElementById('app'));