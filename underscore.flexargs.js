
flexargs = function (iterator, context) {
  return (typeof iterator === 'object') ? multicheck(iterator)
  :      (typeof iterator === 'string') ? singlecheck(iterator, context)
  :                                       iterator;
}

singlecheck = function (key, value) {
  return _.isRegExp(value) ? 
    function(item) { return value.test(item[key]);} 
  : function(item) { return item[key] === value; };
};

multicheck = function (props) {
  return function (item) { 
     return _.every(props, function (value, key) {
       return singlecheck(key, value)(item);
     });
   }
}


var origFilter = _.filter;
 _.filter = function(obj, iterator, context) {
   return origFilter(obj, flexargs(iterator, context), context)
 };


 var origdetect = _.detect;
  _.detect = function(obj, iterator, context) {
    return origdetect(obj, flexargs(iterator, context), context)
  };


var origall = _.all
_.all = function (obj, iterator, context) {
  return origall(obj, flexargs(iterator, context), context)
}


var origany = _.any
_.any = function (obj, iterator, context) {
  return origany(obj, flexargs(iterator, context), context)
}



 var origmap = _.map;

_.map = function(obj, iterator, context) {
  if (_.isString(iterator)) {
    var key = iterator, match;
    iterator = (match=/(.*)\(\)$/.exec(key)) ?
      function (item) { return item[match[1]](); } :
      function (item) { return item[key]; };
  }
  return origmap(obj, iterator, context)
};


