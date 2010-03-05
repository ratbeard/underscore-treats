$(document).ready(function() {
  // msg as last arg is annoying
  var it = function (msg, actual, expected) { same(actual, expected, msg); };
  
  // Fixture data
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
      _.filter(dogs, function (dog) { return dog.age === 5; })
    );

    it('can filter by passing an object of multiple properties to match',
      _.filter(dogs, {age: 5, name: 'lily'}),
      _.filter(dogs, function (dog) { return dog.age === 5 && dog.name === 'lily'; })
    );
      
    it('can filter by passing a key and value to match',
      _.filter(dogs, 'age', 5),
      _.filter(dogs, function (dog) { return dog.age === 5; })
    );
      
    it('passing a regex as a value calls regex.test()',
      _.filter(dogs, 'name', /l/),
      _.filter(dogs, function (dog) { return /l/.test(dog.name) })
    );
      
    it('can pass a regex in an object',
      _.filter(dogs, {name: /e/, age: 5}),
      _.filter(dogs, function (dog) { return /e/.test(dog.name) && dog.age === 5})
    );
    
    it('can take a method to invoke',
      _.filter(planets, 'habitable()'),
      _.filter(planets, function (planet) { return planet.habitable(); })
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
    )
    
    it('will invoke a method of the key ends with parenthesis',
      _.map(planets, 'habitable()'),
      _.map(planets, function (p) { return p.habitable() })
    )
    
    it('works as a wrapper',
      _(planets).map('habitable()'),
      _(planets).map(function (p) { return p.habitable() })
    )
  });
  
  
  
  test('detect', function() {
    var result = _.detect([1, 2, 3], function(num){ return num * 2 == 4; });
    equals(result, 2, 'found the first "2" and broke the loop');
    
    
    it('accepts an object of properties to match',
      _.detect(dogs, {age: 5}),
      _.detect(dogs, function (dog) { return dog.age == 5; })
    );

    it('accepts an object with multiple properties to match',
      _.detect(dogs, {age: 5, name: 'lily'}),
      _.detect(dogs, function (dog) { return dog.age == 5 && dog.name == 'lily'; })
    );
      
    it('accepts a key and value to match',
      _.detect(dogs, 'age', 5),
      _.detect(dogs, function (dog) { return dog.age === 5; })
    );
      
    it('accepts a regex as a value and calls regex.test()',
      _.detect(dogs, 'name', /l/),
      _.detect(dogs, function (dog) { return /l/.test(dog.name) })
    )
      
    it('accepts a regex as a value in an object',
      _.detect(dogs, {name: /l/, age: 5}),
      _.detect(dogs, function (dog) { return /l/.test(dog.name) && dog.age === 5})
    )
  });
  
  
  
  test('collections: all', function() {
    ok(_.all([]), 'the empty set');
    ok(_.all([true, true, true]), 'all true values');
    ok(!_.all([true, false, true]), 'one false value');
    ok(_.all([0, 10, 28], function(num){ return num % 2 == 0; }), 'even numbers');
    ok(!_.all([0, 11, 28], function(num){ return num % 2 == 0; }), 'an odd number');
    ok(_.every([true, true, true]), 'aliased as "every"');
    
    it('accepts an object of properties to match',
      _.all(dogs, {age: 5}),
      _.all(dogs, function (dog) { return dog.age == 5; })
    );
    it('accepts an object with multiple properties to match',
      _.all(dogs, {age: 5, name: 'lily'}),
      _.all(dogs, function (dog) { return dog.age == 5 && dog.name == 'lily'; })
    );
    it('accepts a key and value to match',
      _.all(dogs, 'age', 5),
      _.all(dogs, function (dog) { return dog.age == 5; })
    );
    it('accepts a regex as a value and calls regex.test()',
      _.all(dogs, 'name', /(a|e|i)/),
      _.all(dogs, function (dog) { return /(a|e|i)/.test(dog.name) })
    );
    it('accepts a regex as a value in an object',
      _.all(dogs, {name: /e/, age: 5}),
      _.all(dogs, function (dog) { return /e/.test(dog.name) && dog.age === 5})
    )
    it('works 1', _.all([[1], [2], [3]], 'length', 1), true)
    it('works 2', _.all([[1], [4,4], [3]], 'length', 1), false)
  });

  test('collections: any', function() {
    ok(!_.any([]), 'the empty set');
    ok(!_.any([false, false, false]), 'all false values');
    ok(_.any([false, false, true]), 'one true value');
    ok(!_.any([1, 11, 29], function(num){ return num % 2 == 0; }), 'all odd numbers');
    ok(_.any([1, 10, 29], function(num){ return num % 2 == 0; }), 'an even number');
    ok(_.some([false, false, true]), 'aliased as "some"');
    
    it('accepts an object of properties to match',
      _.any(dogs, {age: 5}),
      _.any(dogs, function (dog) { return dog.age == 5; })
    );

    it('accepts an object with multiple properties to match',
      _.any(dogs, {age: 5, name: 'lily'}),
      _.any(dogs, function (dog) { return dog.age == 5 && dog.name == 'lily'; })
    );
      
    it('accepts a key and value to match',
      _.any(dogs, 'age', 5),
      _.any(dogs, function (dog) { return dog.age == 5; })
    );
      
    it('accepts a regex as a value and calls regex.test()',
      _.any(dogs, 'name', /l/),
      _.any(dogs, function (dog) { return /l/.test(dog.name) })
    );
      
    it('accepts a regex as a value in an object',
      _.any(dogs, {name: /e/, age: 5}),
      _.any(dogs, function (dog) { return /e/.test(dog.name) && dog.age === 5})
    );
    it('works 1', _.any([[1,4], [2,6], [3]], 'length', 1), true)
    it('works 2', _.any([[1,4], [4,4], [3,6]], 'length', 1), false)
  });
  
  
  
});