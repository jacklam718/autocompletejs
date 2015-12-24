class Autocomplete {
  KEY_ARROW_UP = 38;
  KEY_ARROW_DOWN = 40;
  KEY_ENTER = 13;
  KEY_ESC = 27;

  EVENT_ON_SELECT = 'onselect'

  constructor (element, options) {
    this.element = element;
    this.options = options;

    this.currentIndex       = 0;
    this.suggestions        = [];
    this.selectedSuggestion = null;
    this.queryText          = '';
    this.data               = [];
    this.events             = {};

    this.keyboardEvents = {};
    this.keyboardEvents[this.KEY_ARROW_UP]   = this.keyArrowUp;
    this.keyboardEvents[this.KEY_ARROW_DOWN] = this.keyArrowDown;
    this.keyboardEvents[this.KEY_ENTER]      = this.keyEnter;
    this.keyboardEvents[this.KEY_ESC]        = this.keyEsc;

    this._initEventListener();
  }

  keyArrowUp () {
    let index = this.currentIndex - 1;
    this._setIndex(index < 0 ? this.suggestions.length : -1);
  }

  keyArrowDown () {
    let index = this.currentIndex + 1
    this._setIndex(index > this.suggestions.length ? -1 : index);
  }

  keyEnter () {
    this.select();
  }

  keyEsc () {
    setTimeout(() => {
      this._setIndex(-1);
      this._removeSuggestionElement();
    }, 150);
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
  }

  setData (data) {
    this.data = data;
  }

  select () {
    console.log(this.suggestions[this.currentIndex]);
    this.selectedSuggestion = Object.create(this.suggestions[this.currentIndex]);
    this._removeSuggestionElement();
    this._setIndex(-1);
    this.callEvent(this.EVENT_ON_SELECT, this.selectedSuggestion);
  }

  addEventListiner (event, cb) {
    this.events[event] = cb;
  }

  callEvent () {
    let [event, args] = [arguments[0], Array.prototype.slice.call(arguments, 1, arguments.length)];
    if (this.events[event]) {
      this.events[event](...args);
    }
  }

  _onKeydown (e) {
    if (this.keyboardEvents.hasOwnProperty(e.keyCode)) {
      this.keyboardEvents[e.keyCode].call(this);
    }
  }

  _onInput (e) {
    this.queryText = e.target.value;
    this.suggestions = this.getSuggestions(this.queryText);
    this._createSuggestionElement();
  }

  _onBlur (e) {
    setTimeout(() => {
      this._removeSuggestionElement();
      this._setIndex(-1);
    }, 150);
  }

  _setIndex (index) {
    this.currentIndex = index;
  }

  _removeSuggestionElement () {
    this.$ul.remove();
  }

  _createSuggestionElement () {
    if (this.$ul) {
      this._removeSuggestionElement();
    }

    this.$ul = $(`<ul class="suggestions-container"></ul>`);
    let $li;
    let suggestions = [];

    for (let i = 0; i < this.suggestions.length; i++) {
      let suggestion = `
        <li class="suggestion-item" data-index="${i}">
          ${this.suggestions[i].name}
        </li>
      `;
      suggestions.push(suggestion);
    }

    $li = $(suggestions.join(''));
    this.$ul.append($li);

    // add mouseover event
    $li.on('mouseover', (e) => {
      this._setIndex(parseInt(e.target.dataset['index']));
    });

    $li.on('click', (e) => {
      this._setIndex(parseInt(e.target.dataset['index']));
      this.select();
    });

    this.element.after(this.$ul);
    this._setSuggestionElementPos();
  }

  _setSuggestionElementPos () {
    if (this.$ul) {
      let top   = this.element.position().top;
      let left  = this.element.position().left;
      let width = this.element.width();
      this.$ul.attr('style', `top: ${top + 4}px; left: ${left}px; width: ${width + 5}px; position: absolute;`);
    }
  }

  _initEventListener () {
    this.element[0]['oninput'] = this._onInput.bind(this);
    this.element[0]['onblur']  = this._onBlur.bind(this);
    document['onkeydown']      = this._onKeydown.bind(this);
    window['onresize']         = this._setSuggestionElementPos.bind(this);
  }
}

export {Autocomplete}
