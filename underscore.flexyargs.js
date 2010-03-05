// 
// TODO: 
//  - docs
//  - mixin to aliases ? 

(function () {

// look at the arguments given in the iterator and context slot and determine
// if we need to build a custom iterator for a single prop, multiple props, or
// just pass the iterator function through as is:
var flexargs = function (iterator, context) {
  return (typeof iterator === 'object') ? multicheck(iterator)
  :      (typeof iterator === 'string') ? singlecheck(iterator, context)
  :                                       iterator;
};

// check if string ends with ()'s.  captures everything before the ()'s:
var invoke_re = /(.*)\(\)$/; 

// Build a checking iterator given a key, and a value
// - if value is a regex, make a str testing iterator.  This is 100x more useful
//   than checking if a value === a given regex object.
// - if value ends with `()`, return the result of invoking that function
// - if value is undefined, just return the property at that key
// - otherwise, test that the property at that key === the given value
var singlecheck = function (key, value) {
  var m;
  return _.isRegExp(value)  ?   function (item) { return value.test(item[key]);} 
  : (m=invoke_re.exec(key)) ?   function (item) { return item[m[1]](); }
  : value === undefined     ?   function (item) { return item[key]; }
  :                             function (item) { return item[key] === value; };
};

// Perform multiple property checks, which it builds upfront before iteration.
var multicheck = function (props) {
  var checks = _.map(props, function (value, key) {
    return singlecheck(key, value);
  });
  return function (item) { 
     return _.every(checks, function (check) {
       return check(item);
     });
   };
};

// wrap original fn with our flexyargs version
var makeflexy = function (name) {
  var orig = _[name];
  return function (obj, iterator, context) {
    return orig(obj, flexargs(iterator, context), context);
  };
};

// build up object of flexy fn's and mix it in to underscore
_.mixin(
  _.reduce(['filter','detect','any','all','map'], {}, function (memo, name) {
    memo[name] = makeflexy(name);
    return memo;
  })
);

})();