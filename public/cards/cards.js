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

var Tabs = {
  BUILD: 0, REVIEW: 1
};

var Events = {
  IMAGE_SEARCH_RESULTS: 'ISR',
  IMAGE_SEARCH_KICKOFF: 'ISK',
  NAVIGATE_PAGE: 'NP',
  ADD_CARD: 'AC'
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

var Card = function Card(text, image) {
  _classCallCheck(this, Card);

  this.text = text;
  this.image = image;
  this.index = 0;
  this.fontSize = 0;
};

var CardHolder = function (_Map) {
  _inherits(CardHolder, _Map);

  function CardHolder() {
    _classCallCheck(this, CardHolder);

    return _possibleConstructorReturn(this, (CardHolder.__proto__ || Object.getPrototypeOf(CardHolder)).call(this));
  }

  return CardHolder;
}(Map);

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

    var _this3 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this3.renderToolbar = function () {
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

    _this3.render = function () {
      return React.createElement(
        Ons.Page,
        { renderToolbar: _this3.renderToolbar, className: 'shuang' },
        React.createElement(TabBar, null)
      );
    };

    return _this3;
  }

  return App;
}(React.Component);

// Application - bottom tab bar


var TabBar = function (_React$Component2) {
  _inherits(TabBar, _React$Component2);

  function TabBar(props) {
    _classCallCheck(this, TabBar);

    var _this4 = _possibleConstructorReturn(this, (TabBar.__proto__ || Object.getPrototypeOf(TabBar)).call(this, props));

    _this4.renderTabs = function () {
      return [{
        content: React.createElement(BuildPage, { key: 'build-page' }),
        tab: React.createElement(Ons.Tab, { key: 'build-tab', label: '\u5236\u4F5C', icon: 'ion-settings' })
      }, {
        content: React.createElement(ReviewPage, { key: 'review-page' }),
        tab: React.createElement(Ons.Tab, { key: 'review-tab', label: '\u67E5\u770B', icon: 'ion-eye' })
      }];
    };

    _this4.chooseTab = function (evt) {
      if (evt.index !== _this4.state.selected) {
        _this4.setState({ selected: evt.index });
      }
    };

    _this4.render = function () {
      return React.createElement(Ons.Tabbar, { position: 'bottom', index: _this4.state.selected,
        onPreChange: _this4.chooseTab,
        renderTabs: _this4.renderTabs });
    };

    _this4.state = { selected: Tabs.BUILD };
    EventHub.on(Events.NAVIGATE_PAGE, _this4.chooseTab);
    return _this4;
  }

  return TabBar;
}(React.Component);

// Application - build page


var BuildPage = function (_React$Component3) {
  _inherits(BuildPage, _React$Component3);

  function BuildPage(props) {
    _classCallCheck(this, BuildPage);

    var _this5 = _possibleConstructorReturn(this, (BuildPage.__proto__ || Object.getPrototypeOf(BuildPage)).call(this, props));

    _this5.renderToolbar = function () {
      return React.createElement(
        Ons.Toolbar,
        null,
        React.createElement(SearchBar, null)
      );
    };

    _this5.renderModal = function () {
      return React.createElement(
        Ons.Modal,
        { isOpen: _this5.state.loading },
        React.createElement(Ons.ProgressCircular, { indeterminate: true })
      );
    };

    _this5.render = function () {
      return React.createElement(
        Ons.Page,
        { className: 'build-page',
          renderToolbar: _this5.renderToolbar,
          renderModal: _this5.renderModal },
        React.createElement(ImageList, null)
      );
    };

    _this5.state = { loading: false };
    EventHub.on(Events.IMAGE_SEARCH_KICKOFF, function (job) {
      if (job.startIndex === 0) {
        _this5.setState({ loading: true });
      }
    });
    EventHub.on(Events.IMAGE_SEARCH_RESULTS, function (job) {
      if (job.startIndex === 0) {
        Utils.animScroll(document.querySelector('.build-page .page__content'), 0);
        _this5.setState({ loading: false });
      }
    });
    return _this5;
  }

  return BuildPage;
}(React.Component);

// Application - build page - search bar


var SearchBar = function (_React$Component4) {
  _inherits(SearchBar, _React$Component4);

  function SearchBar(props) {
    var _this7 = this;

    _classCallCheck(this, SearchBar);

    var _this6 = _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call(this, props));

    _this6.doSearch = function () {
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
                cachedJob = _this6.cache.get(job.id());

                if (!(cachedJob === undefined)) {
                  _context.next = 20;
                  break;
                }

                _this6.cache.set(job.id(), job);
                response = void 0;
                _context.prev = 7;
                _context.next = 10;
                return ImageSearch.search(job.terms + ' 卡通', job.startIndex, SEARCH_PAGE_SIZE);

              case 10:
                response = _context.sent;
                _context.next = 17;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context['catch'](7);

                Utils.debug(job.id() + ' job failed with exception:', _context.t0);
                _this6.cache.delete(job.id());

              case 17:
                if (response) {
                  if (response.error) {
                    Utils.debug(job.id() + ' job failed with error: ' + response.error);
                    _this6.cache.delete(job.id()); // Delete job so it will be tried again.
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
        }, _callee, _this7, [[7, 13]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    _this6.render = function () {
      return React.createElement(
        'div',
        { className: 'center search-bar' },
        React.createElement(Ons.SearchInput, { placeholder: '\u641C\u7D22\u914D\u56FE', onChange: function onChange(e) {
            return _this6.setState({ terms: e.target.value });
          } }),
        React.createElement(
          Ons.Button,
          { modifier: 'quiet', onClick: function onClick(e) {
              return EventHub.fire(Events.IMAGE_SEARCH_KICKOFF, new SearchJob(_this6.state.terms, 0));
            } },
          '\u641C\u7D22'
        )
      );
    };

    _this6.state = { terms: '' };
    _this6.cache = new Map();
    EventHub.on(Events.IMAGE_SEARCH_KICKOFF, function (job) {
      return _this6.doSearch(job.terms, job.startIndex);
    });
    return _this6;
  }

  return SearchBar;
}(React.Component);

// Application - build page - image list


var ImageList = function (_React$Component5) {
  _inherits(ImageList, _React$Component5);

  function ImageList(props) {
    _classCallCheck(this, ImageList);

    var _this8 = _possibleConstructorReturn(this, (ImageList.__proto__ || Object.getPrototypeOf(ImageList)).call(this, props));

    _this8.shouldComponentUpdate = function (nextProps, nextState) {
      return nextState.shouldShow !== _this8.state.shouldShow || nextState.itemHeight !== _this8.state.itemHeight || nextState.images !== _this8.state.images;
    };

    _this8.componentDidMount = function () {
      _this8.calculateItemHeight();
      window.addEventListener('resize', _this8.calculateItemHeight);
    };

    _this8.componentWillUnmount = function () {
      window.removeEventListener('resize', _this8.calculateItemHeight);
    };

    _this8.calculateItemHeight = function () {
      var width = document.body.clientWidth,
          height = document.body.clientHeight;
      if (width < height) {
        // Portrait mode
        _this8.setState({ itemHeight: width });
      } else {
        _this8.setState({ itemHeight: Math.floor(height / 3) });
      }
    };

    _this8.getItemHeight = function () {
      return _this8.state.itemHeight;
    };

    _this8.selectImage = function (image) {
      var card = new Card(_this8.state.terms, image);
      EventHub.fire(Events.NAVIGATE_PAGE, { index: Tabs.REVIEW });
      EventHub.fire(Events.ADD_CARD, card);
    };

    _this8.renderRow = function (index) {
      var size = _this8.state.images.length;
      var src = _this8.state.images[index];

      if (index % SEARCH_PAGE_SIZE === 0 && index + SEARCH_PAGE_SIZE >= size) {
        setTimeout(function () {
          EventHub.fire(Events.IMAGE_SEARCH_KICKOFF, new SearchJob(_this8.state.terms, size));
        }, 0);
      }

      return !src ? null : React.createElement('img', { key: index, className: 'search-image', src: src, onClick: function onClick() {
          _this8.selectImage(src);
        }, style: {
          height: _this8.state.itemHeight,
          width: _this8.state.itemHeight
        } });
    };

    _this8.render = function () {
      if (_this8.state.shouldShow) {
        return React.createElement(Ons.LazyList, { className: 'search-list', length: 10000,
          renderRow: _this8.renderRow, calculateItemHeight: _this8.getItemHeight });
      } else {
        return null;
      }
    };

    _this8.state = {
      terms: undefined,
      images: [],
      shouldShow: false,
      itemHeight: 100
    };

    EventHub.on(Events.IMAGE_SEARCH_RESULTS, function (job) {
      if (_this8.state.terms !== job.terms && job.startIndex !== 0) {
        Utils.debug(job.id() + ' is likely a stale job, ignoring');
      } else {
        var data = job.response;
        var images = data.items.map(function (i) {
          return i.link;
        });
        var startIndex = job.startIndex;
        if (job.startIndex !== 0) {
          var tmp = images;
          images = _this8.state.images; // Keep reference so no re-render is triggered
          images[startIndex + tmp.length - 1] = undefined; // Ensure array length
          images.splice.apply(images, [startIndex, tmp.length].concat(tmp));
        }
        _this8.setState({
          images: images,
          terms: job.terms,
          shouldShow: true
        });
      }
    });
    return _this8;
  }

  return ImageList;
}(React.Component);

// Application - review page


var ReviewPage = function (_React$Component6) {
  _inherits(ReviewPage, _React$Component6);

  function ReviewPage(props) {
    _classCallCheck(this, ReviewPage);

    var _this9 = _possibleConstructorReturn(this, (ReviewPage.__proto__ || Object.getPrototypeOf(ReviewPage)).call(this, props));

    _this9.renderToolbar = function () {
      return React.createElement(
        Ons.Toolbar,
        null,
        React.createElement(
          'div',
          { className: 'center action-bar' },
          React.createElement(
            Ons.Button,
            { modifier: 'quiet', onClick: function onClick(e) {} },
            '\u521B\u5EFA\u5B57\u5361'
          )
        )
      );
    };

    _this9.render = function () {
      return React.createElement(
        Ons.Page,
        { className: 'review-page', renderToolbar: _this9.renderToolbar },
        React.createElement(CardList, null)
      );
    };

    return _this9;
  }

  return ReviewPage;
}(React.Component);

// Application - review page - card list


var CardList = function (_React$Component7) {
  _inherits(CardList, _React$Component7);

  function CardList(props) {
    _classCallCheck(this, CardList);

    var _this10 = _possibleConstructorReturn(this, (CardList.__proto__ || Object.getPrototypeOf(CardList)).call(this, props));

    _this10.calculateCardStyle = function () {
      var width = document.body.clientWidth,
          height = document.body.clientHeight;
      if (width < height) {
        // Portrait mode
        _this10.cardStyle.width = width;
        _this10.rowHeightFactor = 2;
        _this10.rowStyle.flexDir = 'column';
      } else {
        _this10.cardStyle.width = width / 2;
        _this10.rowHeightFactor = 1;
        _this10.rowStyle.flexDir = 'row';
      }
      _this10.cardStyle.width -= _this10.cardMargin * 2;
      _this10.cardStyle.height = _this10.cardStyle.width * _this10.aspectRatio;
      _this10.rowStyle.height = _this10.cardStyle.height * _this10.rowHeightFactor;
    };

    _this10.addCard = function (card) {
      if (!_this10.cardHolder.has(card.text)) {
        var textWidth = Math.min(_this10.cardStyle.width * 0.6, _this10.cardStyle.height * 0.8);
        var length = card.text.length;
        card.fontSize = textWidth / length;
        card.index = _this10.state.cards.length;
        _this10.cardHolder.set(card.text, card);
        _this10.state.cards[card.index] = card;
      } else {
        _this10.cardHolder.get(card.text).image = card.image;
      }

      _this10.setState({
        cards: _this10.state.cards
      });

      setTimeout(function () {
        var highlightCard = _this10.cardHolder.get(card.text);
        Utils.animScroll(document.querySelector('.review-page .page__content'), _this10.rowHeightFactor * highlightCard.index * _this10.cardStyle.height);
      }, 300);
    };

    _this10.renderRow = function (card) {
      return React.createElement(
        'div',
        { key: card.index, className: 'card', style: {
            marginLeft: _this10.cardMargin,
            marginRight: _this10.cardMargin,
            height: _this10.rowStyle.height,
            flexDirection: _this10.rowStyle.flexDir
          } },
        React.createElement(
          'div',
          { className: 'card-text', style: Object.assign({ fontSize: card.fontSize }, _this10.cardStyle) },
          card.text
        ),
        React.createElement('img', { className: 'card-image', style: _this10.cardStyle, src: card.image })
      );
    };

    _this10.render = function () {
      return React.createElement(Ons.List, { dataSource: _this10.state.cards, renderRow: _this10.renderRow });
    };

    _this10.state = { cards: [] };
    _this10.cardHolder = new CardHolder();
    _this10.cardStyle = {};
    _this10.rowStyle = {};
    _this10.rowHeightFactor = 1;
    _this10.aspectRatio = 8 / 11; // US letter
    _this10.cardMargin = 8;
    _this10.calculateCardStyle();
    EventHub.on(Events.ADD_CARD, _this10.addCard);
    return _this10;
  }

  return CardList;
}(React.Component);

Utils.debug('%cIn DEBUG mode', 'font-weight: bold;');
ReactDOM.render(React.createElement(App, null), document.getElementById('app'));