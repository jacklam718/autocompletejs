/*
Author: Jack (jacklam718@gmail.com)
Github: https://github.com/jacklam718/autocompletejs
*/

export default class Autocomplete {
  KEY_ARROW_UP       = 38;
  KEY_ARROW_DOWN     = 40;
  KEY_ENTER          = 13;
  KEY_ESC            = 27;

  ON_SELECT          = 'on_select';
  ON_INPUT           = 'on_input';
  ON_MOUSEOVER       = 'on_mouseover';
  ON_ELEMENT_CREATED = 'on_suggestions_element_created';
  ON_ELEMENT_REMOVED = 'on_suggestions_element_removed';

  constructor (inputElement) {
    if (typeof inputElement === 'string') {
      this.inputElement = document.querySelector(inputElement);
    } else if (inputElement instanceof HTMLElement) {
      this.inputElement = inputElement;
    } else {
      throw('inputElement invalid: the inputElement should be a DOM object or a query selector');
      return;
    }

    this.currentIndex       = 0;
    this.suggestions        = [];
    this.selectedSuggestion = null;
    this.data               = [];
    this.events             = {};

    this._initEventListener();
  }

  getSuggestions(kwd, options={ignoreCase: true}) {
    return this.data.filter((item) => {
      let itemName = item.name;
      if (options.ignoreCase) {
        kwd      = kwd.toLocaleLowerCase();
        itemName = itemName.toLocaleLowerCase();
      }
      return kwd === '' ? false : itemName.search(kwd) !== -1;
    });
  }

  setData (data) {
    this.data = data;
    return this;
  }

  setSuggestions(suggestions) {
    this.suggestions = suggestions;
    return this;
  }

  setSuggestionsAndCreateElement(suggestions) {
    this.setSuggestions(suggestions);
    this._createSuggestionsElement();
    return this;
  }

  setSuggestionItemElementTemplate(template) {
  }

  on (event, cb) {
    this._addEvent(event, cb);
    return this;
  }

  _addEvent (event, cb) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(cb);
  }

  _callEvent ({eventType=this, args=this, event=this}={}) {
    if (this.events[eventType]) {
      for (const i = 0; i < this.events[eventType].length; i++) {
        this.events[eventType][i].call(event, args);
      }
    }
  }

  _keyArrowUp() {
    const index = this.currentIndex - 1;
    this._setIndex(index < 0 ? this.suggestions.length : -1);
  }

  _keyArrowDown() {
    const index = this.currentIndex + 1
    this._setIndex(index > this.suggestions.length ? -1 : index);
  }

  _keyEnter() {
    this._onSelect();
  }

  _keyEsc() {
    setTimeout(() => {
      this._setIndex(-1);
      this._removeSuggestionElement();
    }, 150);
  }

  _onKeydown(event) {
    if (this.keyboardEvents.hasOwnProperty(event.keyCode)) {
      this.keyboardEvents[event.keyCode].forEach(fun => {
        fun.call(this);
      })
    }
  }

  _onMouseover(event) {
    this._callEvent({eventType: this.ON_MOUSEOVER, args: this.currentIndex, event});
  }

  _onSelect (event) {
    if (this.suggestions.length > 0) {
      this.selectedSuggestion = this.suggestions[this.currentIndex];
      this.inputElement.value = this.selectedSuggestion.name;
      this._callEvent({eventType: this.ON_SELECT, args: this.selectedSuggestion, event});
      this._removeSuggestionElement();
      this._setIndex(-1);
    }
  }

  _onInput(event) {
    let queryText = event.target.value;
    if (this.data) {this.setSuggestionsAndCreateElement(this.getSuggestions(queryText));}
    this._callEvent({eventType: this.ON_INPUT, args: {queryText, suggestions: this.suggestions}, event});
  }

  _onBlur(event) {
    setTimeout(() => {
      this._removeSuggestionElement();
      this._setIndex(-1);
    }, 150);
  }

  _onFocus(event) {
    setTimeout(() => {
      this._createSuggestionsElement();
    }, 150);
  }

  _setIndex(index) {
    this.currentIndex = index;
  }

  _removeSuggestionElement() {
    if (this.suggestionsElement) {
      this.suggestionsElement.remove();
      delete this.suggestionsElement;
      this._callEvent({eventType: this.ON_ELEMENT_REMOVED, args: null, event: null});
    }
  }

  _createSuggestionsElement() {
    const suggestions = [];

    if (!this.suggestionsElement) {
      this.suggestionsElement = document.createElement('ul');
      this.inputElement.parentNode.insertBefore(this.suggestionsElement, this.inputElement.nextSibling);
      this.suggestionsElement.className = 'suggestions-container';

      this.suggestionsElement.onmouseover = e => {
        this._setIndex(parseInt(e.target.dataset['index']));
        this._onMouseover(e);
      };

      this.suggestionsElement.onclick = e => {
        this._setIndex(parseInt(e.target.dataset['index']));
        this._onSelect(e);
      };

      this._callEvent({eventType: this.ON_ELEMENT_CREATED, args: {suggestionsElement: this.suggestionsElement}, event: null});
      this._setSuggestionsElementPosAndSize();
    }

    for (const i = 0; i < this.suggestions.length; i++) {
      suggestions.push(`
        <li class="suggestion-item" data-index="${i}">
          ${this.suggestions[i].name}
        </li>
      `);
    }

    this.suggestionsElement.innerHTML = suggestions.join('');
    return this;
  }

  _setSuggestionsElementPosAndSize() {
    if (this.suggestionsElement) {
      const top           = this.inputElement.offsetTop;
      const left          = this.inputElement.offsetLeft;
      const width         = this.inputElement.offsetWidth;
      const height        = this.inputElement.offsetHeight;
      const paddingTop    = parseInt(window.getComputedStyle(this.inputElement, null).getPropertyValue('padding-top')) || 0;
      const paddingBottom = parseInt(window.getComputedStyle(this.inputElement, null).getPropertyValue('padding-bottom')) || 0;

      this.suggestionsElement.style.cssText = `
        top: ${top + height + paddingTop + paddingBottom - 1}px; left: ${left}px; width: ${width}px; position: absolute;
      `;
    }
  }

  _initEventListener() {
    this.keyboardEvents = {};
    this.keyboardEvents[this.KEY_ARROW_UP]   = [this._keyArrowUp];
    this.keyboardEvents[this.KEY_ARROW_DOWN] = [this._keyArrowDown];
    this.keyboardEvents[this.KEY_ENTER]      = [this._keyEnter];
    this.keyboardEvents[this.KEY_ESC]        = [this._keyEsc];

    this.inputElement['oninput'] = this._onInput.bind(this);
    this.inputElement['onblur']  = this._onBlur.bind(this);
    this.inputElement['onfocus'] = this._onFocus.bind(this);
    document['onkeydown']        = this._onKeydown.bind(this);
    window['onresize']           = this._setSuggestionsElementPosAndSize.bind(this);
  }
}
