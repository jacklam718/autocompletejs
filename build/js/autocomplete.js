(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./autocomplete.scss');
window.Autocomplete = require('./autocomplete').default;

},{"./autocomplete":4,"./autocomplete.scss":5}],2:[function(require,module,exports){
module.exports = function (css, customDocument) {
  var doc = customDocument || document;
  if (doc.createStyleSheet) {
    var sheet = doc.createStyleSheet()
    sheet.cssText = css;
    return sheet.ownerNode;
  } else {
    var head = doc.getElementsByTagName('head')[0],
        style = doc.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(doc.createTextNode(css));
    }

    head.appendChild(style);
    return style;
  }
};

module.exports.byUrl = function(url) {
  if (document.createStyleSheet) {
    return document.createStyleSheet(url).ownerNode;
  } else {
    var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    head.appendChild(link);
    return link;
  }
};

},{}],3:[function(require,module,exports){
module.exports = require('cssify');
},{"cssify":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Author: Jack (jacklam718@gmail.com)
Github: https://github.com/jacklam718/autocompletejs
*/

var Autocomplete = function () {
  function Autocomplete(inputElement) {
    _classCallCheck(this, Autocomplete);

    this.KEY_ARROW_UP = 38;
    this.KEY_ARROW_DOWN = 40;
    this.KEY_ENTER = 13;
    this.KEY_ESC = 27;
    this.ON_SELECT = 'on_select';
    this.ON_INPUT = 'on_input';
    this.ON_MOUSEOVER = 'on_mouseover';
    this.ON_ELEMENT_CREATED = 'on_suggestions_element_created';
    this.ON_ELEMENT_REMOVED = 'on_suggestions_element_removed';

    if (typeof inputElement === 'string') {
      this.inputElement = document.querySelector(inputElement);
    } else if (inputElement instanceof HTMLElement) {
      this.inputElement = inputElement;
    } else {
      throw 'inputElement invalid: the inputElement should be a DOM object or a query selector';
      return;
    }

    this.currentIndex = 0;
    this.suggestions = [];
    this.selectedSuggestion = null;
    this.data = [];
    this.events = {};

    this._initEventListener();
  }

  _createClass(Autocomplete, [{
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
      return this;
    }
  }, {
    key: 'setSuggestions',
    value: function setSuggestions(suggestions) {
      this.suggestions = suggestions;
      return this;
    }
  }, {
    key: 'setSuggestionsAndCreateElement',
    value: function setSuggestionsAndCreateElement(suggestions) {
      this.setSuggestions(suggestions);
      this._createSuggestionsElement();
      return this;
    }
  }, {
    key: 'setSuggestionItemElementTemplate',
    value: function setSuggestionItemElementTemplate(template) {}
  }, {
    key: 'on',
    value: function on(event, cb) {
      this._addEvent(event, cb);
      return this;
    }
  }, {
    key: '_addEvent',
    value: function _addEvent(event, cb) {
      this.events[event] = this.events[event] || [];
      this.events[event].push(cb);
    }
  }, {
    key: '_callEvent',
    value: function _callEvent() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref$eventType = _ref.eventType;
      var eventType = _ref$eventType === undefined ? this : _ref$eventType;
      var _ref$args = _ref.args;
      var args = _ref$args === undefined ? this : _ref$args;
      var _ref$event = _ref.event;
      var event = _ref$event === undefined ? this : _ref$event;

      if (this.events[eventType]) {
        for (var i = 0; i < this.events[eventType].length; i++) {
          this.events[eventType][i].call(event, args);
        }
      }
    }
  }, {
    key: '_keyArrowUp',
    value: function _keyArrowUp() {
      var index = this.currentIndex - 1;
      this._setIndex(index < 0 ? this.suggestions.length : -1);
    }
  }, {
    key: '_keyArrowDown',
    value: function _keyArrowDown() {
      var index = this.currentIndex + 1;
      this._setIndex(index > this.suggestions.length ? -1 : index);
    }
  }, {
    key: '_keyEnter',
    value: function _keyEnter() {
      this._onSelect();
    }
  }, {
    key: '_keyEsc',
    value: function _keyEsc() {
      var _this = this;

      setTimeout(function () {
        _this._setIndex(-1);
        _this._removeSuggestionElement();
      }, 150);
    }
  }, {
    key: '_onKeydown',
    value: function _onKeydown(event) {
      var _this2 = this;

      if (this.keyboardEvents.hasOwnProperty(event.keyCode)) {
        this.keyboardEvents[event.keyCode].forEach(function (fun) {
          console.log(_this2.currentIndex);
          fun.call(_this2);
        });
      }
    }
  }, {
    key: '_onMouseover',
    value: function _onMouseover(event) {
      this._callEvent({ eventType: this.ON_MOUSEOVER, args: this.currentIndex, event: event });
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(event) {
      if (this.suggestions.length > 0) {
        this.selectedSuggestion = this.suggestions[this.currentIndex];
        this.inputElement.value = this.selectedSuggestion.name;
        this._callEvent({ eventType: this.ON_SELECT, args: this.selectedSuggestion, event: event });
        this._removeSuggestionElement();
        this._setIndex(-1);
      }
    }
  }, {
    key: '_onInput',
    value: function _onInput(event) {
      var queryText = event.target.value;
      if (this.data) {
        this.setSuggestionsAndCreateElement(this.getSuggestions(queryText));
      }
      this._callEvent({ eventType: this.ON_INPUT, args: { queryText: queryText, suggestions: this.suggestions }, event: event });
    }
  }, {
    key: '_onBlur',
    value: function _onBlur(event) {
      var _this3 = this;

      setTimeout(function () {
        _this3._removeSuggestionElement();
        _this3._setIndex(-1);
      }, 150);
    }
  }, {
    key: '_onFocus',
    value: function _onFocus(event) {
      var _this4 = this;

      setTimeout(function () {
        _this4._createSuggestionsElement();
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
      if (this.suggestionsElement) {
        this.suggestionsElement.remove();
        delete this.suggestionsElement;
        this._callEvent({ eventType: this.ON_ELEMENT_REMOVED, args: null, event: null });
      }
    }
  }, {
    key: '_createSuggestionsElement',
    value: function _createSuggestionsElement() {
      var _this5 = this;

      var suggestions = [];

      if (!this.suggestionsElement) {
        this.suggestionsElement = document.createElement('ul');
        this.inputElement.parentNode.insertBefore(this.suggestionsElement, this.inputElement.nextSibling);
        this.suggestionsElement.className = 'suggestions-container';

        this.suggestionsElement.onmouseover = function (e) {
          _this5._setIndex(parseInt(e.target.dataset['index']));
          _this5._onMouseover(e);
        };

        this.suggestionsElement.onclick = function (e) {
          _this5._setIndex(parseInt(e.target.dataset['index']));
          _this5._onSelect(e);
        };

        this._callEvent({ eventType: this.ON_ELEMENT_CREATED, args: { suggestionsElement: this.suggestionsElement }, event: null });
        this._setSuggestionsElementPosAndSize();
      }

      for (var i = 0; i < this.suggestions.length; i++) {
        suggestions.push('\n        <li class="suggestion-item" data-index="' + i + '">\n          ' + this.suggestions[i].name + '\n        </li>\n      ');
      }

      this.suggestionsElement.innerHTML = suggestions.join('');
      return this;
    }
  }, {
    key: '_setSuggestionsElementPosAndSize',
    value: function _setSuggestionsElementPosAndSize() {
      if (this.suggestionsElement) {
        var top = this.inputElement.offsetTop;
        var left = this.inputElement.offsetLeft;
        var width = this.inputElement.offsetWidth;
        var height = this.inputElement.offsetHeight;
        var paddingTop = parseInt(window.getComputedStyle(this.inputElement, null).getPropertyValue('padding-top')) || 0;
        var paddingBottom = parseInt(window.getComputedStyle(this.inputElement, null).getPropertyValue('padding-bottom')) || 0;

        this.suggestionsElement.style.cssText = '\n        top: ' + (top + height + paddingTop + paddingBottom - 1) + 'px; left: ' + left + 'px; width: ' + width + 'px; position: absolute;\n      ';
      }
    }
  }, {
    key: '_initEventListener',
    value: function _initEventListener() {
      this.keyboardEvents = {};
      this.keyboardEvents[this.KEY_ARROW_UP] = [this._keyArrowUp];
      this.keyboardEvents[this.KEY_ARROW_DOWN] = [this._keyArrowDown];
      this.keyboardEvents[this.KEY_ENTER] = [this._keyEnter];
      this.keyboardEvents[this.KEY_ESC] = [this._keyEsc];

      this.inputElement['oninput'] = this._onInput.bind(this);
      this.inputElement['onblur'] = this._onBlur.bind(this);
      this.inputElement['onfocus'] = this._onFocus.bind(this);
      document['onkeydown'] = this._onKeydown.bind(this);
      window['onresize'] = this._setSuggestionsElementPosAndSize.bind(this);
    }
  }]);

  return Autocomplete;
}();

exports.default = Autocomplete;

},{}],5:[function(require,module,exports){
module.exports = require('sassify')('.suggestions-container {   list-style-type: none;   padding: 0;   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);   text-align: left;   -webkit-margin-before: 4px;   -webkit-margin-after: 4px;   -moz-margin-before: 4px;   -moz-margin-after: 4px; }   .suggestions-container .suggestion-item {     color: #999;     padding: 0 4px;     text-overflow: ellipsis;     overflow: hidden;     cursor: pointer;     border-top: 1px solid #e6e6e6;     line-height: 30px;     white-space: nowrap; }     .suggestions-container .suggestion-item:hover {       background-color: #e6e6e6; }  /*# sourceMappingURL=data:application/json;base64,ewoJInZlcnNpb24iOiAzLAoJImZpbGUiOiAic3JjL2F1dG9jb21wbGV0ZS5zY3NzIiwKCSJzb3VyY2VzIjogWwoJCSJzcmMvYXV0b2NvbXBsZXRlLnNjc3MiCgldLAoJInNvdXJjZXNDb250ZW50IjogWwoJCSIuc3VnZ2VzdGlvbnMtY29udGFpbmVyIHtcbiAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xuICBwYWRkaW5nOiAwO1xuICBib3gtc2hhZG93OiAwIDJweCA2cHggcmdiYSgwLDAsMCwwLjMpO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuXG4gIC13ZWJraXQtbWFyZ2luLWJlZm9yZTogNHB4O1xuICAtd2Via2l0LW1hcmdpbi1hZnRlcjogNHB4O1xuXG4gIC1tb3otbWFyZ2luLWJlZm9yZTogNHB4O1xuICAtbW96LW1hcmdpbi1hZnRlcjogNHB4O1xuXG4gIC5zdWdnZXN0aW9uLWl0ZW0ge1xuICAgIGNvbG9yOiAjOTk5O1xuICAgIHBhZGRpbmc6IDAgNHB4O1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZTZlNmU2O1xuICAgIGxpbmUtaGVpZ2h0OiAzMHB4O1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlNmU2ZTY7XG4gICAgfVxuICB9XG59XG4iCgldLAoJIm1hcHBpbmdzIjogIkFBQUEsc0JBQXNCLENBQUM7RUFDckIsZUFBZSxFQUFFLElBQUs7RUFDdEIsT0FBTyxFQUFFLENBQUU7RUFDWCxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQUk7RUFDMUIsVUFBVSxFQUFFLElBQUs7RUFFakIscUJBQXFCLEVBQUUsR0FBSTtFQUMzQixvQkFBb0IsRUFBRSxHQUFJO0VBRTFCLGtCQUFrQixFQUFFLEdBQUk7RUFDeEIsaUJBQWlCLEVBQUUsR0FBSSxHQWdCeEI7RUExQkQsc0JBQXNCLENBWXBCLGdCQUFnQixDQUFDO0lBQ2YsS0FBSyxFQUFFLElBQUs7SUFDWixPQUFPLEVBQUUsS0FBTTtJQUNmLGFBQWEsRUFBRSxRQUFTO0lBQ3hCLFFBQVEsRUFBRSxNQUFPO0lBQ2pCLE1BQU0sRUFBRSxPQUFRO0lBQ2hCLFVBQVUsRUFBRSxpQkFBa0I7SUFDOUIsV0FBVyxFQUFFLElBQUs7SUFDbEIsV0FBVyxFQUFFLE1BQU8sR0FLckI7SUF6Qkgsc0JBQXNCLENBWXBCLGdCQUFnQixBQVViLE1BQU0sQ0FBQztNQUNOLGdCQUFnQixFQUFFLE9BQVEsR0FDM0IiLAoJIm5hbWVzIjogW10KfQ== */');;
},{"sassify":3}]},{},[1])

