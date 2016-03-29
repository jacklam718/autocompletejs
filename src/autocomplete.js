export default class Autocomplete {
  KEY_ARROW_UP   = 38;
  KEY_ARROW_DOWN = 40;
  KEY_ENTER      = 13;
  KEY_ESC        = 27;

  EVENT_ON_SELECT    = 'onselect';
  EVENT_ON_INPUT     = 'oninput';
  EVENT_ON_MOUSEOVER = 'onmouseover';

  constructor (inputElement, options) {
    this.inputElement = inputElement;
    this.options      = options;

    this.currentIndex       = 0;
    this.suggestions        = [];
    this.selectedSuggestion = null;
    this.queryText          = '';
    this.data               = [];
    this.callbacks          = {};

    this._initEventListener();
  }

  getSuggestions (kwd, options={ignoreCase: true}) {
    return this.data.filter((item) => {
      let itemName = item.name;
      if (options.ignoreCase) {
        kwd      = kwd.toLocaleLowerCase();
        itemName = itemName.toLocaleLowerCase();
      }
      return kwd === '' ? false : itemName.search(kwd) !== -1;
    });
    return this;
  }

  setData (data) {
    this.data = data;
    return this;
  }

  setSuggestions (suggestions) {
    this.suggestions = suggestions;
    return this;
  }

  addEventListener (event, cb) {
    this.callbacks[event] = this.callbacks[event] || [];
    this.callbacks[event].push(cb);
    return this;
  }

  _callEvent ({eventType=this, args=this, event=this}={}) {
    // let [event, args] = [arguments[0], Array.prototype.slice.call(arguments, 1, arguments.length)];
    if (this.callbacks[eventType]) {
      for (let i = 0; i < this.callbacks[eventType].length; i++) {
        this.callbacks[eventType][i].call(event, args);
      }
    }
  }

  _keyArrowUp () {
    let index = this.currentIndex - 1;
    this._setIndex(index < 0 ? this.suggestions.length : -1);
  }

  _keyArrowDown () {
    let index = this.currentIndex + 1
    this._setIndex(index > this.suggestions.length ? -1 : index);
  }

  _keyEnter () {
    this._onSelect();
  }

  _keyEsc () {
    setTimeout(() => {
      this._setIndex(-1);
      this._removeSuggestionElement();
    }, 150);
  }

  _onKeydown (event) {
    if (this.keyboardEvents.hasOwnProperty(event.keyCode)) {
      this.keyboardEvents[event.keyCode].forEach(fun => {
        console.log(this.currentIndex);
        fun.call(this)
      })
    }
  }

  _onMouseover (event) {
    this._callEvent({eventType: this.EVENT_ON_MOUSEOVER, args: this.currentIndex, event: event});
  }

  _onSelect (event) {
    if (this.suggestions.length > 0) {
      this.selectedSuggestion = this.suggestions[this.currentIndex];
      this.inputElement.value = this.selectedSuggestion.name;
      this._callEvent({eventType: this.EVENT_ON_SELECT, args: this.selectedSuggestion, event: event});
      this._removeSuggestionElement();
      this._setIndex(-1);
    }
  }

  _onInput (event) {
    this.queryText = event.target.value;
    this.suggestions = (this.data) ? this.getSuggestions(this.queryText) : this.suggestions;
    this._callEvent({eventType: this.EVENT_ON_INPUT, args: {queryText: this.queryText, suggestions: this.suggestions}, event: event});
    this._createSuggestionElement();
  }

  _onBlur (event) {
    setTimeout(() => {
      this._removeSuggestionElement();
      this._setIndex(-1);
    }, 150);
  }

  _setIndex (index) {
    this.currentIndex = index;
  }

  _removeSuggestionElement () {
    this.suggestionsElement && this.suggestionsElement.remove();
  }

  _createSuggestionElement () {
    if (this.suggestionsElement) {
      this._removeSuggestionElement();
    }

    let suggestions = [];

    this.suggestionsElement = document.createElement('ul');
    this.suggestionsElement.className = 'suggestions-container';

    for (let i = 0; i < this.suggestions.length; i++) {
      suggestions.push(`
        <li class="suggestion-item" data-index="${i}">
          ${this.suggestions[i].name}
        </li>
      `);
    }

    this.suggestionsElement.innerHTML = suggestions.join('');
    this.suggestionsElement.onmouseover = e => {
      this._setIndex(parseInt(e.target.dataset['index']));
      this._onMouseover(e);
    };

    this.suggestionsElement.onclick = e => {
      this._setIndex(parseInt(e.target.dataset['index']));
      this._onSelect(e);
    };

    this.inputElement.parentNode.insertBefore(this.suggestionsElement, this.inputElement.nextSibling);
    this._setSuggestionsElementPosAndSize();
  }

  _setSuggestionsElementPosAndSize () {
    if (this.suggestionsElement) {
      let top           = this.inputElement.offsetTop;
      let left          = this.inputElement.offsetLeft;
      let width         = this.inputElement.offsetWidth;
      let height        = this.inputElement.offsetHeight;
      let paddingTop    = parseInt(window.getComputedStyle(this.inputElement, null).getPropertyValue('padding-top')) || 0;
      let paddingBottom = parseInt(window.getComputedStyle(this.inputElement, null).getPropertyValue('padding-bottom')) || 0;

      this.suggestionsElement.style.cssText = `
        top: ${top + height + paddingTop + paddingBottom - 1}px; left: ${left}px; width: ${width}px; position: absolute;
      `;
    }
  }

  _initEventListener () {
    this.keyboardEvents = {};
    this.keyboardEvents[this.KEY_ARROW_UP]   = [this._keyArrowUp];
    this.keyboardEvents[this.KEY_ARROW_DOWN] = [this._keyArrowDown];
    this.keyboardEvents[this.KEY_ENTER]      = [this._keyEnter];
    this.keyboardEvents[this.KEY_ESC]        = [this._keyEsc];

    this.inputElement['oninput'] = this._onInput.bind(this);
    this.inputElement['onblur']  = this._onBlur.bind(this);
    document['onkeydown']        = this._onKeydown.bind(this);
    window['onresize']           = this._setSuggestionsElementPosAndSize.bind(this);
  }
}
