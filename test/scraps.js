$(document).ready(function() {
  var it = function (msg, actual, expected) { same(actual, expected, msg); };

  var dogs = [
    {name: 'bubbles', age: 5}, 
    {name: 'lily', age: 5}, 
    {name: 'ginger', age: 9}
  ];
  
  module("Scraps ");

  test("memo", function() {
    it('is reduce without a return',
      _.memo(dogs, [], function (memo, dog) {
        memo.push(dog);
      }),
      _.reduce(dogs, [], function (memo, dog) {
        memo.push(dog);
        return memo;
      })
    );
    it('makes the common use cases for reduce simpler',
      _.memo(dogs, {}, function (memo, dog) {
        memo[dog.name] = dog.age;
      }),
      _.reduce(dogs, {}, function (memo, dog) {
        memo[dog.name] = dog.age;
        return memo;
      })
    );
  });
  
  
  test('objects: get', function () {
    var obj = {name: 'sprout'}
    same('sprout',  _.get(obj, 'name'),               'can get a property')
    same(undefined, _.get(obj, 'is'),                 'returns undefined for unknown property')
    same('cat',     _.get(obj, 'is', 'cat'),          'can give a default value to return if unknown property')
    same('sprout',  _.get(obj, 'name', 'bubbles'),    'default value not used if property exists')
    same(undefined, _.get(undefined, 'name'),         'calling on undefined does not throw error')
    same(undefined, _.get(null, 'name'),              'calling on null does not throw error')
    same('ritz',    _.get(undefined, 'name', 'ritz'), 'useful for default value on undefined')
    same('ritz',    _.get(null, 'name', 'ritz'),      'useful for default value on null')
    same(null,      _.get({a: null}, 'a', 'def'),     'will return explicit null on a property')
  });

  test('objects: set', function () {
    var result, obj = {};
    it('can set a value',
      _.set(obj, 'age', 1),
      {age: 1}
    );
    it('chains nicely', 
      _.set(obj, 'str', 22).age,
      1
    );
    it('called on undefined creates a new object',
      _.set(undefined, 'age', 1),
      {age: 1}
    );
    
    function tedious(k, v) {
      var tmp = {};
      tmp[k] = v;
      return tmp;
    }
    it('is useful to make an object with dynamic keys',
      _.set({}, 'a', 1),
      tedious('a',1)
    );
  });

  test('objects: prop', function () {
    
  });

});