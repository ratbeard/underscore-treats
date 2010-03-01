

checker = function (obj, key, value) {
  return _.isRegExp(value) ? 
    function(item) { return value.test(item[key]);} 
  : function(item) { return item[key] === value; };
};



var origFilter = _.filter;
 _.filter = function(obj, iterator, context) {
   if (!_.isFunction(iterator)) {
     if (typeof iterator === 'object') {  // given props to check, e.g. {age: 5, name: 'h' }// TODO: speed up if only one prop
       var expected = iterator, iterator = function (item) { 
         return _.every(expected, function (value, key) {
           return checker(obj, key, value)(item);
         });
       };
     }
     else
       iterator = checker(obj, iterator, context);
   }
   
   return origFilter(obj, iterator, context)
 };


 var origdetect = _.detect;

  _.detect = function(obj, iterator, context) {
    if (!_.isFunction(iterator)) {
      
      if (typeof iterator === 'object') {  
        var expected = iterator, iterator = function (item) { 
          return _.every(expected, function (value, key) {
            return _.isRegExp(value) ? value.test(item[key]) : value === item[key];
          });
        };
      }
      
      else {  
        var key = iterator, value = context;
        iterator = _.isRegExp(value) ? 
          function(item) { return value.test(item[key]);} :
          function(item) { return item[key] === value; };
      }
    }

    return origdetect(obj, iterator, context)

  };


var origall = _.all
_.all = function (obj, iterator, context) {
  iterator = iterator || _.identity;
  if (!_.isFunction(iterator)) {
    
    if (typeof iterator === 'object') {  
      var expected = iterator, iterator = function (item) { 
        return _.every(expected, function (value, key) {
          return _.isRegExp(value) ? value.test(item[key]) : value === item[key];
        });
      };
    }
    
    else {  
      var key = iterator, value = context;
      iterator = _.isRegExp(value) ? 
        function(item) { return value.test(item[key]);} :
        function(item) { return item[key] === value; };
    }
  }

  return origall(obj, iterator, context)
}


var origany = _.any
_.any = function (obj, iterator, context) {
  iterator = iterator || _.identity;
  if (!_.isFunction(iterator)) {
    
    if (typeof iterator === 'object') {  
      var expected = iterator, iterator = function (item) { 
        return _.every(expected, function (value, key) {
          return _.isRegExp(value) ? value.test(item[key]) : value === item[key];
        });
      };
    }
    
    else {  
      var key = iterator, value = context;
      iterator = _.isRegExp(value) ? 
        function(item) { return value.test(item[key]);} :
        function(item) { return item[key] === value; };
    }
  }

  return origany(obj, iterator, context)
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


