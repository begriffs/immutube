/* global define */
define([
  'jquery'
, 'ramda'
, 'pointfree'
, 'Maybe'
, 'player'
, 'bacon'
], function($, _, P, Maybe, Player, bacon) {
  'use strict';

  // HELPERS ///////////////////////////////////////////////////////////////////////////
  var compose = P.compose;
  var map = P.map;
  var log = function(x) { console.log(x); return x; }
  var fork = _.curry(function(f, future) { return future.fork(log, f); })
  var setHtml = _.curry(function(sel, x) { return $(sel).html(x); });


  // PURE //////////////////////////////////////////////////////////////////////////////

  // IMPURE ////////////////////////////////////////////////////////////////////////////

});
