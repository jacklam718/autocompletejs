# AutocompleteJs
A simple and extendable and no jQuery required JavaScript library

# Demo
<a href="http://jacklam718.github.io/autocompletejs" target="_blank">
  LIVE DEMO
</a>

<!-- # Install
### Bower
```bash
bower install --save autocompletejs
```
### NPM
```bash
npm install --save autocompletejs
```

### CDN
```html
<script src="cdn/xxx/autocomplete.js"></script>
``` -->

# Usage
### import the library in your HTML template of script tag
```html
<script src="./build/js/autocomplete.js"></script>
```
### OR
### if you using browserify you can use ```require```
```javascript
var Autocomplete = require('autocompletejs');
```

### OR
### ES6 import
```javascript
import Autocomplete from 'autocompletejs';
```

```javascript
// pass query selector to library
var elementId = '#autocomplete';
var autocomplete new Autocomplete(elementId);
```


```javascript
// or pass DOM element to library
var inputElement = document.querySelector('#autocomplete');
var autocomplete new Autocomplete(inputElement);
```

# Example
### in your HTML template
```html
<input type="text" id="autocomplete">
```

### in your JavaScript
```javascript
var elem = document.querySelector('#autocomplete');
var autocomplete = new Autocomplete(elem);

var data = [
  {name: 'The Wolverine'},
  {name: 'The Smurfs 2'},
  {name: 'The Mortal Instruments: City of Bones'},
  {name: 'Drinking Buddies'},
  {name: 'All the Boys Love Mandy Lane'}
];

autocomplete.setData(data);

autocomplete
  .on(autocomplete.ON_INPUT, function(data) {
    // will call when on input
  })
  .on(autocomplete.ON_SELECT, function(suggestion) {
    // will call when selected suggestion item
  })
  .on(autocomplete.ON_MOUSEOVER, function(index) {
    // will call when mouse over suggestion item
  })
  .on(autocomplete.ON_ELEMENT_CREATED, function(suggestionsElement) {
    // will call when the suggestions element container created
  })
  .on(autocomplete.ON_ELEMENT_REMOVED, function() {
    // will call when the suggestions element container removed
  });
```

##### if your data and the suggestions list is from server side, you can do this:
```javascript
// the following just a example, you can use any ways to fetch data from server side
// in this case you don't need to call `setData` method

var elem = document.querySelector('#autocomplete');
var autocomplete = new Autocomplete(elem);

$.ajax({
  dataType: "json",
  url: 'url/data',
  data: {queryText: 'the keyword'},
  success: function(suggestions) {
    // the suggestions fetch from server side, then just directly pass the suggestions to `setSuggestionsAndCreateElement` method
    autocomplete
      .setSuggestionsAndCreateElement(suggestions);
  }
});
```

# TODO
- [ ] Test case
- [ ] Fetch data from server (because the suggestions list may be stored in server)
