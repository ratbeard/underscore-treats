$(document).ready(function() {

  module("Scraps ");

  test("arrays: first", function() {
    equals(_.first([1,2,3]), 1, 'can pull out the first element of an array');
    equals(_([1, 2, 3]).first(), 1, 'can perform OO-style "first()"');
    equals(_.first([1,2,3], 2).join(', '), '1, 2', 'can pass an index to first');
    var result = (function(){ return _.first(arguments); })(4, 3, 2, 1);
    equals(result, 4, 'works on an arguments object.');
    result = _.map([[1,2,3],[1,2,3]], _.first);
    equals(result.join(','), '1,1', 'works well with _.map');
  });

});