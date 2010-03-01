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
  
  var planet = function (config) { _.extend(this, config); };
  planet.prototype = {
    habitable: function () { 
      return _.include(['medium', 'small'], this.size); 
    }
  };
  var planets = [
    new planet({name: 'earth', size: 'medium'}),
    new planet({name: 'neptune', size: 'large'}),
    new planet({name: 'mars', size: 'small'})
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
  
  
  test('map', function() {
    var doubled = _.map([1, 2, 3], function(num){ return num * 2; });
    equals(doubled.join(', '), '2, 4, 6', 'doubled numbers');

    var tripled = _.map([1, 2, 3], function(num){ return num * this.multiplier; }, {multiplier : 3});
    equals(tripled.join(', '), '3, 6, 9', 'tripled numbers with context');

    var doubled = _([1, 2, 3]).map(function(num){ return num * 2; });
    equals(doubled.join(', '), '2, 4, 6', 'OO-style doubled numbers');

    var ids = _.map(document.body.childNodes, function(n){ return n.id; });
    ok(_.include(ids, 'qunit-header'), 'can use collection methods on NodeLists');

    var ids = _.map(document.images, function(n){ return n.id; });
    ok(ids[0] == 'chart_image', 'can use collection methods on HTMLCollections');
    
    it('can take a single key to behave like pluck',
      _.map(dogs, 'name'),
      _.pluck(dogs, 'name')
    );
    
    it('will invoke a method of the key ends with parenthesis',
      _.map(planets, 'habitable()'),
      _.map(planets, function (p) { return p.habitable(); })
    )
  });
  
  
  
});