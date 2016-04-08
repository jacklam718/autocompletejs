(function () {
  var someMovies = [
    {name: 'The Wolverine'},
    {name: 'The Smurfs 2'},
    {name: 'The Mortal Instruments: City of Bones'},
    {name: 'Drinking Buddies'},
    {name: 'All the Boys Love Mandy Lane'},
    {name: 'The Act Of Killing'},
    {name: 'Red 2'},
    {name: 'Jobs'},
    {name: 'Getaway'},
    {name: 'Red Obsession'},
    {name: '2 Guns'},
    {name: "The World's End"},
    {name: 'Planes'},
    {name: 'Paranoia'},
    {name: 'The To Do List'},
    {name: 'Man of Steel'}
  ];

  var moreMovies = [
    {name: 'The Wolverine'},
    {name: 'The Smurfs 2'},
    {name: 'The Mortal Instruments: City of Bones'},
    {name: 'Drinking Buddies'},
    {name: 'All the Boys Love Mandy Lane'},
    {name: 'The Act Of Killing'},
    {name: 'Red 2'},
    {name: 'Jobs'},
    {name: 'Getaway'},
    {name: 'Red Obsession'},
    {name: '2 Guns'},
    {name: "The World's End"},
    {name: 'Planes'},
    {name: 'Paranoia'},
    {name: 'The To Do List'},
    {name: 'Man of Steel'},
    {name: 'The Way Way Back'},
    {name: 'Before Midnight'},
    {name: 'Only God Forgives'},
    {name: 'I Give It a Year'},
    {name: 'The Heat'},
    {name: 'Pacific Rim'},
    {name: 'Pacific Rim'},
    {name: 'Kevin Hart: Let Me Explain'},
    {name: 'A Hijacking'},
    {name: 'Maniac'},
    {name: 'After Earth'},
    {name: 'The Purge'},
    {name: 'Much Ado About Nothing'},
    {name: 'Europa Report'},
    {name: 'Stuck in Love'},
    {name: 'We Steal Secrets: The Story Of Wikileaks'},
    {name: 'The Croods'},
    {name: 'This Is the End'},
    {name: 'The Frozen Ground'},
    {name: 'Turbo'},
    {name: 'Blackfish'},
    {name: 'Frances Ha'},
    {name: 'Prince Avalanche'},
    {name: 'The Attack'},
    {name: 'Grown Ups 2'},
    {name: 'White House Down'},
    {name: 'Lovelace'},
    {name: 'Girl Most Likely'},
    {name: 'Parkland'},
    {name: 'Passion'},
    {name: 'Monsters University'},
    {name: 'R.I.P.D.'},
    {name: 'Byzantium'},
    {name: 'The Conjuring'},
    {name: 'The Internship'}
  ];

  var elem = document.querySelector('#autocomplete');
  var selected = document.querySelector('#selected');
  var autocomplete = new Autocomplete(elem);

  autocomplete
    .setData(moreMovies)
    .on(autocomplete.ON_SELECT, function(suggestion) {
      console.log('selected: ', suggestion);
      selected.textContent = JSON.stringify(suggestion);
    })
    .on(autocomplete.ON_MOUSEOVER, function(index) {
        console.log('currentIndex: ', index);
    })
    .on(autocomplete.ON_ELEMENT_CREATED, function(suggestionsElement) {
      console.log('suggestions container element created: ', suggestionsElement);
    })
    .on(autocomplete.ON_ELEMENT_REMOVED, function() {
      console.log('suggestions container element removed: ');
    })
}())

// window.Autocomplete = Autocomplete;
