define([
  'bacon'
, 'jquery'
], function(bacon, $) {
  'use strict';

  var stream = $('#search').asEventStream('keydown').debounce(300);
  return stream;
});
