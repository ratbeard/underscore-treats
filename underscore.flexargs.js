(function () {

var flexargs = function (iterator, context) {
  return (typeof iterator === 'object') ? multicheck(iterator)  // {keys:props}
  :      (typeof iterator === 'string') ? singlecheck(iterator, context) // key, prop
  :                                       iterator;   // standard iterator fn
};

var singlecheck = function (key, value) {
  return _.isRegExp(value) ? 
    function(item) { return value.test(item[key]);} 
  : function(item) { return item[key] === value; };
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
  _.reduce(['filter','detect','any','all'], {}, function (memo, name) {
    memo[name] = makeflexy(name);
    return memo;
  })
);


var origmap = _.map;
_.mixin({
  map: function(obj, iterator, context) {
    if (typeof iterator === 'string') {
      var match, key = iterator;
      iterator = (match=/(.*)\(\)$/.exec(key)) ?
        function (item) { return item[match[1]](); }
      : function (item) { return item[key]; };
    }
    return origmap(obj, iterator, context);
  }
})

})();