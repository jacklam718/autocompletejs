(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Autocomplete = (function () {
  function Autocomplete(element, options) {
    _classCallCheck(this, Autocomplete);

    this.KEY_ARROW_UP = 38;
    this.KEY_ARROW_DOWN = 40;
    this.KEY_ENTER = 13;
    this.KEY_ESC = 27;
    this.EVENT_ON_SELECT = 'onselect';

    this.element = element;
    this.options = options;

    this.currentIndex = 0;
    this.suggestions = [];
    this.selectedSuggestion = null;
    this.queryText = '';
    this.data = [];
    this.events = {};

    this.keyboardEvents = {};
    this.keyboardEvents[this.KEY_ARROW_UP] = this.keyArrowUp;
    this.keyboardEvents[this.KEY_ARROW_DOWN] = this.keyArrowDown;
    this.keyboardEvents[this.KEY_ENTER] = this.keyEnter;
    this.keyboardEvents[this.KEY_ESC] = this.keyEsc;

    this._initEventListener();
  }

  _createClass(Autocomplete, [{
    key: 'keyArrowUp',
    value: function keyArrowUp() {
      var index = this.currentIndex - 1;
      this._setIndex(index < 0 ? this.suggestions.length : -1);
    }
  }, {
    key: 'keyArrowDown',
    value: function keyArrowDown() {
      var index = this.currentIndex + 1;
      this._setIndex(index > this.suggestions.length ? -1 : index);
    }
  }, {
    key: 'keyEnter',
    value: function keyEnter() {
      this.select();
    }
  }, {
    key: 'keyEsc',
    value: function keyEsc() {
      var _this = this;

      setTimeout(function () {
        _this._setIndex(-1);
        _this._removeSuggestionElement();
      }, 150);
    }
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(kwd) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? { ignoreCase: true } : arguments[1];

      return this.data.filter(function (item) {
        var itemName = item.name;
        if (options.ignoreCase) {
          kwd = kwd.toLocaleLowerCase();
          itemName = itemName.toLocaleLowerCase();
        }
        return kwd === '' ? false : itemName.search(kwd) !== -1;
      });
    }
  }, {
    key: 'setData',
    value: function setData(data) {
      this.data = data;
    }
  }, {
    key: 'select',
    value: function select() {
      console.log(this.suggestions[this.currentIndex]);
      this.selectedSuggestion = Object.create(this.suggestions[this.currentIndex]);
      this._removeSuggestionElement();
      this._setIndex(-1);
      this.callEvent(this.EVENT_ON_SELECT, this.selectedSuggestion);
    }
  }, {
    key: 'addEventListiner',
    value: function addEventListiner(event, cb) {
      this.events[event] = cb;
    }
  }, {
    key: 'callEvent',
    value: function callEvent() {
      var event = arguments[0];
      var args = Array.prototype.slice.call(arguments, 1, arguments.length);

      if (this.events[event]) {
        var _events;

        (_events = this.events)[event].apply(_events, _toConsumableArray(args));
      }
    }
  }, {
    key: '_onKeydown',
    value: function _onKeydown(e) {
      if (this.keyboardEvents.hasOwnProperty(e.keyCode)) {
        this.keyboardEvents[e.keyCode].call(this);
      }
    }
  }, {
    key: '_onInput',
    value: function _onInput(e) {
      this.queryText = e.target.value;
      this.suggestions = this.getSuggestions(this.queryText);
      this._createSuggestionElement();
    }
  }, {
    key: '_onBlur',
    value: function _onBlur(e) {
      var _this2 = this;

      setTimeout(function () {
        _this2._removeSuggestionElement();
        _this2._setIndex(-1);
      }, 150);
    }
  }, {
    key: '_setIndex',
    value: function _setIndex(index) {
      this.currentIndex = index;
    }
  }, {
    key: '_removeSuggestionElement',
    value: function _removeSuggestionElement() {
      this.$ul.remove();
    }
  }, {
    key: '_createSuggestionElement',
    value: function _createSuggestionElement() {
      var _this3 = this;

      if (this.$ul) {
        this._removeSuggestionElement();
      }

      this.$ul = $('<ul class="suggestions-container"></ul>');
      var $li = undefined;
      var suggestions = [];

      for (var i = 0; i < this.suggestions.length; i++) {
        var suggestion = '\n        <li class="suggestion-item" data-index="' + i + '">\n          ' + this.suggestions[i].name + '\n        </li>\n      ';
        suggestions.push(suggestion);
      }

      $li = $(suggestions.join(''));
      this.$ul.append($li);

      // add mouseover event
      $li.on('mouseover', function (e) {
        _this3._setIndex(parseInt(e.target.dataset['index']));
      });

      $li.on('click', function (e) {
        _this3._setIndex(parseInt(e.target.dataset['index']));
        _this3.select();
      });

      this.element.after(this.$ul);
      this._setSuggestionElementPos();
    }
  }, {
    key: '_setSuggestionElementPos',
    value: function _setSuggestionElementPos() {
      if (this.$ul) {
        var _top = this.element.position().top;
        var left = this.element.position().left;
        var width = this.element.width();
        this.$ul.attr('style', 'top: ' + (_top + 4) + 'px; left: ' + left + 'px; width: ' + (width + 5) + 'px; position: absolute;');
      }
    }
  }, {
    key: '_initEventListener',
    value: function _initEventListener() {
      this.element[0]['oninput'] = this._onInput.bind(this);
      this.element[0]['onblur'] = this._onBlur.bind(this);
      document['onkeydown'] = this._onKeydown.bind(this);
      window['onresize'] = this._setSuggestionElementPos.bind(this);
    }
  }]);

  return Autocomplete;
})();

exports.Autocomplete = Autocomplete;

},{}]},{},[1])

