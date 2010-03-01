// version of reduce that doesn't require caller to return the memo
// each iteration.  Especially handy since the common things you do
// in reduce take two lines (adding an item to am object or array)
_.memo = function (obj, memo, iterator, context) {
  _.each(obj, function (value, index, list) {
    iterator(memo, value, index, list);
  }, context);
  return memo;
};

// a safe get, with optional default value thats more rigorious than: ||
_.get = function (obj, key, defaultValue) {
  return (obj && key in obj) ? obj[key] : defaultValue;
};

// a setting a property chainable. create an obj for you if null / undefined
_.set = function (obj, key, value) {
  if (obj == null) obj = {};
  obj[key] = value;
  return obj;
};

// make delete chainable
_.del = function (obj, key) {
  if (obj) delete obj[key];
  return obj;
}

// get/set in one function, like jQuery
_.prop = function (obj, key, value) {
  return _[arguments.length === 3 ? 'set' : 'get'](obj, key, value);
};

// make [].push chainable
_.push = function (array, value) {
  array.push(value);
  return array;
}
