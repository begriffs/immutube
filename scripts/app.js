/* global define */
define([
  'jquery'
, 'ramda'
, 'pointfree'
, 'Maybe'
, 'player'
, 'io'
, 'bacon'
], function($, _, P, Maybe, Player, io, bacon) {
  'use strict';
  io.extendFn();

  // HELPERS ///////////////////////////////////////////////////////////////////////////
  var compose = P.compose;
  var map = P.map;
  var log = function(x) { console.log(x); return x; }
  var fork = _.curry(function(f, future) { return future.fork(log, f); })
  var setHtml = _.curry(function(sel, x) { return $(sel).html(x); });
  var listen = _.curry(function (event, target) {
    return bacon.fromEventTarget(target, event);
  });

  // PURE //////////////////////////////////////////////////////////////////////////////

  //+ DomEvent -> String
  var eventValue = compose(_.get('value'), _.get('target'));

  //+ DomEvent -> EventStream String
  var valueStream = compose(map(eventValue), listen('keyup'));

  //+ search :: Selector -> IO EventStream String
  var getInputStream = compose(map(valueStream), $.toIO());

  // IMPURE ////////////////////////////////////////////////////////////////////////////

  getInputStream('#search').runIO().onValue(log);

});
