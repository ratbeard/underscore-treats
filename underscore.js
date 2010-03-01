// Underscore.js
// (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the terms of the MIT license.
// Portions of Underscore are inspired by or borrowed from Prototype.js,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore

(function() {

  // ------------------------- Baseline setup ---------------------------------

  // Establish the root object, "window" in the browser, or "global" on the server.
  var root = this;

  // Save the previous value of the "_" variable.
  var previousUnderscore = root._;
  
  // Establish the object that gets thrown to break out of a loop iteration.
  var breaker = typeof StopIteration !== 'undefined' ? StopIteration : '__break__';

  // Create a safe reference to the Underscore object for reference below.
  // The object is created lazily when first accessed, so if you only use the
  // function call style it will never need to be created.  see `initWrapper` below
  var _ = root._ = initWrapper;

  // Export the Underscore object for CommonJS.
  if (typeof exports !== 'undefined') exports._ = _;

  // Create quick reference variables for speed access to core prototypes.
  var slice                 = Array.prototype.slice,
      unshift               = Array.prototype.unshift,
      toString              = Object.prototype.toString,
      hasOwnProperty        = Object.prototype.hasOwnProperty,
      propertyIsEnumerable  = Object.prototype.propertyIsEnumerable;

  // Current version.
  _.VERSION = '0.5.7';

  var arrayLike = 
  _.arrayLike = function (obj) {
    return obj && 'length' in obj && !propertyIsEnumerable.call(obj, 'length');
  };
  // try and delegate to native version of a method.
  var tryNative = function (meth, obj, iterator, context) {
    if (obj && _.isFunction(obj.meth))  return obj[meth](iterator, context);
  };
  // ------------------------ Collection Functions: ---------------------------

  // The cornerstone, an each implementation.
  // Handles objects implementing forEach, arrays, and raw objects.
  var each =
  _.forEach = function(obj, iterator, context) {
    try {
      if (tryNative('forEach', obj, iterator, context)) 
      {} 
      else if (_.isArray(obj) || _.isArguments(obj)) {
        for (var i=0, l=obj.length; i<l; i++) iterator.call(context, obj[i], i, obj);
      } else {
        var keys = _.keys(obj), l = keys.length;
        for (var i=0; i<l; i++) iterator.call(context, obj[keys[i]], keys[i], obj);
      }
    } catch(e) {
      if (e != breaker) throw e;
    }
    return obj;
  };

  // Return the results of applying the iterator to each element. 
  // Delegates to JavaScript 1.6's version of map if available.
  _.map = function(obj, iterator, context) {
    return tryNative('map', obj, iterator, context) ||
      _.reduceList(obj, function(memo, value, index, list) {
        memo.push(iterator.call(context, value, index, list));
      });
  };

  // Reduce builds up a single result from a list of values. Also known as inject, or foldl. 
  // Delegates to JavaScript 1.8's version of reduce if available.
  var reduce = 
  _.reduce = function(obj, memo, iterator, context) {
    if (obj && _.isFunction(obj.reduce)) return obj.reduce(_.bind(iterator, context), memo);
    each(obj, function(value, index, list) {
      memo = iterator.call(context, memo, value, index, list);
    });
    return memo;
  };

  // Developer optimization for the most common use case of reduce: building a hash.
  // This way you don't need to pass in an initial {}, but more importantly, you
  // don't need to return memo.  Instead, the memo is assumed to be the hash.
  // This turns an akward 2 liner:
  //      
  //  _.reduce(something, {}, function (memo, value) {
  //    memo[value] = true;
  //    return memo;
  //  });
  //
  //  Or a tricky 1 liner:
  //  _.reduce(something, {}, function (memo, value) {
  //    return _.extend(memo, _.makeObj(value, true));
  //  });
  //
  //  In to a simple 1 liner:
  //  _.reduceHash(something, function (memo, value) {
  //    memo[value] = true;
  //  });
  _.reduceHash = function (obj, iterator, context) {
    return reduce(obj, {}, function(memo, value, key, list) {
      iterator.call(context, memo, value, key, list);
      return memo;
    }, context);
  };
  _.reduceList = function (obj, iterator, context) {
    return reduce(obj, [], function(memo, value, key, list) {
      iterator.call(context, memo, value, key, list);
      return memo;
    }, context);
  };
    
  // The right-associative version of reduce, also known as foldr.
  // Delegates to JavaScript 1.8's version of reduceRight if available.
  _.reduceRight = function(obj, memo, iterator, context) {
    if (obj && _.isFunction(obj.reduceRight)) return obj.reduceRight(_.bind(iterator, context), memo);
    var reversed = _.clone(_.toArray(obj)).reverse();
    return reduce(reversed, memo, iterator, context);
  };

  // Return the first value which passes a truth test.
  _.detect = function(obj, iterator, context) {
    var result;
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        _.breakLoop();
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test. 
  // Delegates to JavaScript 1.6's filter() if available 
  _.filter = function(obj, iterator, context) {
    return tryNative('filter', obj, iterator, context) ||
      _.reduceList(obj, function(memo, value, index, list) {
        iterator.call(context, value, index, list) && memo.push(value);
      });
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.reduceList(obj, function(memo, value, index, list) {
      !iterator.call(context, value, index, list) && memo.push(value);
    });
  };

  // Determine whether all of the elements match a truth test. 
  // Delegates to JavaScript 1.6's every() if available.
  _.every = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    if (obj && _.isFunction(obj.every)) return obj.every(iterator, context);
    var result = true;
    each(obj, function(value, index, list) {
      if (!(result = iterator.call(context, value, index, list))) _.breakLoop();
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to JavaScript 1.6's some() if available.
  _.some = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    if (obj && _.isFunction(obj.some)) return obj.some(iterator, context);
    var result = false;
    each(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) _.breakLoop();
    });
    return result;
  };

  // Determine if a given value is included in the array or object based on '==='.
  _.include = function(obj, target) {
    if (_.isArray(obj)) return _.indexOf(obj, target) != -1;
    return !! _.detect(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method with arguments on every item in a collection.
  _.invoke = function(obj, method) {
    var args = _.rest(arguments, 2);
    return _.map(obj, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  };

  // Convenience version of a common use case of map: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Function that builds both min and max functions since they use the same logic,
  // the only thing difference being:
  //  - which Math function we use (min or max)
  //  - what the starting value is (Infinity or -Infinity)
  //  - what the comparison is (< or >) for the transform case.  
  //    We can't curry this away without evaling or calling a function, so just pass in
  //    true if we want to use a greater than comparison, false to use less than.
  //
  // For the cases where no transform function is given we fast path out this trick:
  // http://ejohn.org/blog/fast-javascript-maxmin/
  // In this case with an object we just convert it to an array of its values,
  // since this is probably a rare case and not worth the complexity to handle with a reduce.
  // 
  // For the transform case, we need to remember both the min/max computed value, and the value
  // that produced it.  The value that produced it is what is returned.
  var minMaxBuilder = function(mathFn, startValue, greater) {
    return function(obj, transform, context) {
      if (!transform) return mathFn.apply(Math, _.toArray(obj));
      return reduce(obj, {computed: startValue}, function (memo, value, index, list) {
        var computed = transform.call(context, value, index, list);
        if (greater ?  computed > memo.computed :  computed < memo.computed)
          memo.value = value, memo.computed = computed;
        return memo;
      }).value;
    }
  };
  
  // Returns the maximum item, using Math.max by default.
  // You can pass a transform function which is called for each value, in which case
  // the first encountered value that produced the largest transformed value is returned
  _.max = minMaxBuilder(Math.max, -Infinity, true);
  
  // Returns the minimum item, using Math.min by default.
  // You can pass a transform function which is called for each value, in which case
  // the first encountered value that produced the smallest transformed value is returned  
  _.min = minMaxBuilder(Math.min, Infinity, false);

  // Sort the object's values by a criteria produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator = iterator || _.identity;
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Convert anything into a real, live array.
  _.toArray = function(obj) {
    //  @DECIDE 
    // do we want to _.toArray(1,2,3) # => [1,2,3]
    // seems kinda worthless, but _.toArray(1,2,3) # => [1] is suprising?
    // if (arguments.length > 1) return slice.call(arguments);
    if (obj===false)         return [false];
    if (!obj)                return [];
    if (obj.toArray)         return obj.toArray();
    if (_.isArray(obj))      return obj;
    if (_.isArguments(obj))  return slice.call(obj);
    // @TODO make _.isObject() ?
    // if we do, probably keep this as is, as here we've already
    // checked its not null, an array, etc., that would have to be
    // duplicated in _.isObject
    if (typeof obj == 'object') return _.values(obj);
    return [obj];
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };
  
  // run a function n times.  
  // looks good in wrapper form:
  //    _(3).times(alert)
  _.times = function (n, fn, context) {
    for (var i=0; i < n; i++)  fn.call(context, i);
  };

  // Make a lookup map from a collection.
  // By paying a little memory once you don't have to repeatedly search an array.
  // e.g:
  //
  //  lookup = _.makeMap([1,2,8])  // {1: true, 2: true, 8: true}
  //  now `lookup[key]` instead of `_.include(lookup, key)` 
  //
  // See example usage in #without
  // By default sets the value to true.
  _.makeMap = function (obj, useValue) {
    useValue = (useValue === undefined)?  true :  useValue;
    return _.reduceHash(obj, function (hash, value) {  hash[value] = useValue;  });
  };

  // Object getter/setter.  
  // When getting returns the value, When setting returns the object
  _.prop = function (obj, key, value) {
    if (value !== undefined) {
      obj[key] = value;
      return obj;
    }
    return obj[key];
  };
  
  
  // -------------------------- Array Functions: ------------------------------

  // Get the first element of an array. Passing "n" will return the first N
  // values in the array. Aliased as "head". The "guard" check allows it to work
  // with _.map.
  _.first = function(array, n, guard) {
    return n && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the first entry of the array. Aliased as "tail".
  // Especially useful on the arguments object. Passing an "index" will return
  // the rest of the values in the array from that index onward. The "guard"
  // check allows it to work with _.map.
  _.rest = function(array, index, guard) {
    return slice.call(array, _.isUndefined(index) || guard ? 1 : index);
  };

  // Get the last element of an array.
  _.last = function(array) {
    return array[array.length - 1];
  };

  // Trim out all falsy values from an array.
  // @DECIDE
  // ruby's compact removes nils, not falsey vals.  
  // [false, nil, 0].compact  # => false, 0
  // should we just filter out nulls and undefinedes, not 0's?  does it matter?
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return reduce(array, [], function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo.push(value);
      return memo;
    });
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    var lookup = _.makeMap(_.rest(arguments));
    return _.filter(array, function(value){ return !lookup[value]; });
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  _.uniq = function(array, isSorted) {
    return reduce(array, [], function(memo, el, i) {
      if (0 === i || (isSorted ? _.last(memo) != el : !_.include(memo, el))) memo.push(el);
      return memo;
    });
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersect = function(array) {
    var rest = _.rest(arguments);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = _.toArray(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i=0; i<length; i++) results[i] = _.pluck(args, String(i));
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, MSIE),
  // we need this function. Return the position of the first occurence of an
  // item in an array, or -1 if the item is not included in the array.
  _.indexOf = function(array, item) {
    if (array.indexOf) return array.indexOf(item);
    for (var i=0, l=array.length; i<l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Finds last index of an item in an array, or -1.
  // Delegates to JavaScript 1.6's lastIndexOf() if available.
  _.lastIndexOf = function(array, item) {
    if (array.lastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python range() function. See:
  // http://docs.python.org/library/functions.html#range
  _.range = function(start, stop, step) {
    var a     = _.toArray(arguments);
    var solo  = a.length <= 1;
    var start = solo ? 0 : a[0], stop = solo ? a[0] : a[1], step = a[2] || 1;
    var len   = Math.ceil((stop - start) / step);
    if (len <= 0) return [];
    var range = new Array(len);
    for (var i = start, idx = 0; true; i += step) {
      if ((step > 0 ? i - stop : stop - i) >= 0) return range;
      range[idx++] = i;
    }
  };

  // ----------------------- Function Functions: ------------------------------

  // Create a function bound to a given object (assigning 'this', and arguments,
  // optionally). Binding with arguments is also known as 'curry'.
  _.bind = function(func, obj) {
    var args = _.rest(arguments, 2);
    return function() {
      return func.apply(obj || root, args.concat(_.toArray(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = _.rest(arguments);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = _.rest(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(_.rest(arguments)));
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(_.toArray(arguments));
      return wrapper.apply(wrapper, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = _.toArray(arguments);
    return function() {
      var args = _.toArray(arguments);
      for (var i=funcs.length-1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // ------------------------- Object Functions: ------------------------------

  // Retrieve the names of an object's properties.
  // ECMA5 has Object.keys(obj), its in webkit nightlies, probably firefox too (not in 3.6)
  _.keys = Object.keys || function(obj) {
    if(_.isArray(obj)) return _.range(0, obj.length);
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available in obj
  // By default obj is underscore
  _.functions = function(obj) {
    obj = obj || _; 
    // convert to keys so an object with filter() is not thought to be the native [].filter()
    return _.filter(_.keys(obj), function(key){ return _.isFunction(obj[key]); }).sort();
  };

  // Extend a given object with all the properties in given object(s)
  _.extend = function(obj) {
    var prop;
    each(_.rest(arguments), function (source) {
      for (prop in source) obj[prop] = source[prop];  
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (_.isArray(obj)) return obj.slice(0);
    return _.extend({}, obj);
  };
  
  //
  // NOTE - explicitly convert args to array because in firefox 3.6 (and maybe earlier)
  // if you mutate the array object, the length property (sometimes) becomes enumerable and
  // the constructor changes, so it no longer looks like an array to us! strange...
  //
  //  a = (function () { _.rest(arguments); return arguments; })(1,2)
  //  Object.prototype.toString.call(a);  //=> "[object Object]"
  //  a.propertyIsEnumerable('length')  //=> true
  //
  //  a = (function () { _.shift(arguments); return arguments; })(1,2)
  //  Object.prototype.toString.call(a);  //=> "[object Object]"
  //  a.propertyIsEnumerable('length')  //=> false
  //
  _.alias = function () {
    var args = _.toArray(arguments), 
        obj = (typeof args[0] === 'string')?  _ : args.shift(),
        fn = obj[args.shift()];
    each(args, function (alias) {  obj[alias] = fn;  });
    return obj;
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a);
    if (atype != typeof(b)) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    // Check dates' integer values.
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_.isNaN(a) && _.isNaN(b)) return true;
    // Compare regular expressions.
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different sizes before comparing contents.
    if (_.size(a) !== _.size(b)) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!_.isEqual(a[key], b[key])) return false;
    return true;
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    if (arrayLike(obj)) return !obj.length;
    for (var k in obj) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // @DECIDE why dont we use jquery's check?
  // return toString.call(obj) === '[object Array]';
  _.isArray = function(obj) {
    return !!(obj && obj.concat && obj.unshift);
  };
  
  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return obj && _.isNumber(obj.length) && !obj.concat && !obj.substr && !obj.apply && !propertyIsEnumerable.call(obj, 'length');
  };

  // Is a given value a function?
  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return (obj === +obj) || (toString.call(obj) === '[object Number]');
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  // Is the given value NaN -- this one is interesting. NaN != NaN, and
  // isNaN(undefined) == true, so we make sure it's a number first.
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return typeof obj == 'undefined';
  };

  // -------------------------- Utility Functions: ----------------------------

  // Run Underscore.js in noConflict mode, returning the '_' variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Break out of the middle of an iteration.
  _.breakLoop = function() {
    throw breaker;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    start       : '<%',
    end         : '%>',
    interpolate : /<%=(.+?)%>/g
  };

  // JavaScript templating a-la ERB, pilfered from John Resig's
  // "Secrets of the JavaScript Ninja", page 83.
  // Single-quote fix from Rick Strahl's version.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var fn = new Function('obj',
      'var p=[],print=function(){p.push.apply(p,arguments);};' +
      'with(obj){p.push(\'' +
      str.replace(/[\r\t\n]/g, " ")
         .replace(new RegExp("'(?=[^"+c.end[0]+"]*"+c.end+")","g"),"\t")
         .split("'").join("\\'")
         .split("\t").join("'")
         .replace(c.interpolate, "',$1,'")
         .split(c.start).join("');")
         .split(c.end).join("p.push('")
         + "');}return p.join('');");
    return data ? fn(data) : fn;
  };

  // ------------------------------- Aliases ----------------------------------

  _.alias('forEach', 'each').
    alias('reduce', 'foldl', 'inject').
    alias('reduceRight', 'foldr').
    alias('filter', 'select').
    alias('every', 'all').
    alias('some', 'any').
    alias('first', 'head').
    alias('rest', 'tail').
    alias('functions', 'methods');

  // ------------------------ Setup the OOP Wrapper: --------------------------

  // Create the wrapper object, building up its prototype.
  // This is called the first time `_(obj)` is called, then is replaced with a version that
  // just returns the wrapper object directly.
  //
  // This way we don't penalize people whom only use the functional style from building 
  // the wrapper at startup
  function initWrapper (obj) {
    
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.
    var wrapper = function(obj) { this._wrapped = obj; };
    
    wrapper.prototype = {
      // Start chaining a wrapped Underscore object.
      chain: function() {
        this._chain = true;
        return this;
      },
      // Extracts the result from a wrapped and chained object.
      value: function() {
        return this._wrapped;
      }
    };
    
    // Helper function to continue chaining intermediate results.
    var chained = function(obj, chain) {
      return chain ? _(obj).chain() : obj;
    };

    // Builds a wrapper over a function from some source.  
    // The wrapper function proceeds as follows:
    //  - adjusts arguments
    //  - applies the original method to an object with the adjusted arguments
    //  - builds a chain with around an object and returns it
    //
    //
    // By default:
    //  - the arguments are not adjusted.  
    //    overide by passing a function which is given the arguments and wrapper 
    //  - the method is applied to _wrapped. 
    //    override by passing an object to apply to (perhaps `_`)
    //  - the returned chain is built around the method result
    //    pass true to build around _wrapped instead
    //
    // The way options are passed is a little cryptic, but probably not worth passing
    // them as an options hash unless this becomes public api, and if it needs to be
    // more generic in which case the options should take in functions, like adjustArgs does,
    // (in order to access things like this._wrapped).
    var buildWrapperMethod = function (name, source, adjustArgs, applyTo, returnWrapped ) {
      adjustArgs = adjustArgs || _.identity;
      var args, result, toReturn, method = source[name];
      return function () {
        args = adjustArgs(arguments, this);
        result = method.apply(applyTo || this._wrapped, args);
        toReturn = returnWrapped ? this._wrapped : result;
        return chained(toReturn, this._chain);
      };
    }

    // build wrapper methods for each given function names, using the given builderOptions
    // see usage below
    var addToWrapperPrototype = function (names, options) {
      each(names, function (name) {
        wrapper.prototype[name] = buildWrapperMethod.apply(null, [name].concat(options))
      });
    }

    var prependWrapped = function (args, wrapper) { 
      return [wrapper._wrapped].concat(_.toArray(args)); 
    };

    
    addToWrapperPrototype( // Underscore functions
      _.functions(), 
      [_, prependWrapped]
    );

    addToWrapperPrototype( // Array mutator functions
      'pop push reverse shift sort splice unshift'.split(' '), 
      [Array.prototype, false, false, true]
    );

    addToWrapperPrototype( // Array accessor functions
      'concat join slice'.split(' '),
      [Array.prototype]
    );
    
    // rewrite initWrapper to just return wrapper object now
    initWrapper = function (obj) { return new wrapper(obj) };
    
    // call rewriten function:
    return initWrapper(obj);
  };
    
})();