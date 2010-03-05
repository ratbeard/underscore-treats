(function () {

var flexargs = function (iterator, context) {
  return (typeof iterator === 'object') ? multicheck(iterator)  // {keys:props}
  :      (typeof iterator === 'string') ? singlecheck(iterator, context) // key, prop
  :                                       iterator;   // standard iterator fn
};

var invoke_re = /(.*)\(\)$/;
var singlecheck = function (key, value) {
  var m;
  return _.isRegExp(value)  ?   function (item) { return value.test(item[key]);} 
  : (m=invoke_re.exec(key)) ?   function (item) { return item[m[1]](); }
  : value === undefined     ?   function (item) { return item[key]; }
  :                             function (item) { return item[key] === value; };
};

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

var makeflexy = function (name) {
  var orig = _[name];
  return function (obj, iterator, context) {
    return orig(obj, flexargs(iterator, context), context);
  };
};

_.mixin(
  _.reduce(['filter','detect','any','all','map'], {}, function (memo, name) {
    memo[name] = makeflexy(name);
    return memo;
  })
);

})();