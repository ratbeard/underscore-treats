$(document).ready(function() {
  // msg as last arg is annoying
  function it (msg, actual, expected) { 
    same(actual, expected, msg);
  }
  
  var dogs = [
    {name: 'bubbles', age: 5}, 
    {name: 'lily', age: 5}, 
    {name: 'ginger', age: 9}
  ];


  module("Flexargs");


  test('filter', function() {
    var evens = _.select([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
    equals(evens.join(', '), '2, 4, 6', 'selected each even number');

    evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
    equals(evens.join(', '), '2, 4, 6', 'aliased as "filter"');

    it('can filter by passing an object of properties to match',
      _.filter(dogs, {age: 5}),
      _.filter(dogs, function (dog) { return dog.age == 5; })
    );

    it('can filter by passing an object of multiple properties to match',
      _.filter(dogs, {age: 5, name: 'lily'}),
      _.filter(dogs, function (dog) { return dog.age == 5 && dog.name == 'lily'; })
    );
      
    it('can filter by passing a key and value to match',
      _.filter(dogs, 'age', 5),
      _.filter(dogs, function (dog) { return dog.age == 5; })
    );
      
    it('passing a regex as a value calls regex.test()',
      _.filter(dogs, 'name', /l/),
      _.filter(dogs, function (dog) { return /l/.test(dog.name) })
    );
      
    it('can pass a regex in an object',
      _.filter(dogs, {name: /e/, age: 5}),
      _.filter(dogs, function (dog) { return /e/.test(dog.name) && dog.age === 5})
    );
  });
  
  
});