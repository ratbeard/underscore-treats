// Return all the elements that pass a truth test. 
 // Delegates to JavaScript 1.6's native filter if available.
 //
 // TODO: 
 //  abstract out iterator building code
var origFilter = _.filter;

 _.filter = function(obj, iterator, context) {
   if (!_.isFunction(iterator)) {
     if (typeof iterator === 'object') {  
       // given props to check, e.g. {age: 5, name: 'h' }
       // TODO: speed up if only one prop
       var expected = iterator, iterator = function (item) { 
         return _.every(expected, function (value, key) {
           return _.isRegExp(value) ? value.test(item[key]) : value === item[key];
         });
       };
     }
     else {  
       // given a key, value pair to check
       // can totally ignore context arg as it makes no sense if we are building iterator fn.
       var key = iterator, value = context;
       iterator = _.isRegExp(value) ? 
         function(item) { return value.test(item[key]);} :
         function(item) { return item[key] === value; };
     }
   }
   
   return origFilter(obj, iterator, context)
   
 };



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
