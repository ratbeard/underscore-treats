$(document).ready(function() {

  module("Flexargs");

  test('collections: filter', function() {
    var evens = _.select([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
    equals(evens.join(', '), '2, 4, 6', 'selected each even number');

    evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
    equals(evens.join(', '), '2, 4, 6', 'aliased as "filter"');

    var dogs = [{name: 'bubbles', age: 5}, {name: 'lily', age: 5}, {name: 'ginger', age: 9}]
    
    same(
      _.filter(dogs, {age: 5}),
      _.filter(dogs, function (dog) { return dog.age == 5; }),
      'can filter by passing an object of properties to match');

    same(
      _.filter(dogs, {age: 5, name: 'lily'}),
      _.filter(dogs, function (dog) { return dog.age == 5 && dog.name == 'lily'; }),
      'can filter by passing an object of multiple properties to match');
      
    same(
      _.filter(dogs, 'age', 5),
      _.filter(dogs, function (dog) { return dog.age == 5; }),
      'can filter by passing a key and value to match');
      
    same(
      _.filter(dogs, 'name', /l/),
      _.filter(dogs, function (dog) { return /l/.test(dog.name) }),
      'passing a regex as a value calls regex.test()');
      
    same(
      _.filter(dogs, {name: /e/, age: 5}),
      _.filter(dogs, function (dog) { return /e/.test(dog.name) && dog.age === 5}),
      'can pass a regex in an object');
  });
});