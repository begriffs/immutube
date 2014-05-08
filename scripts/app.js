/* global define */
define([
  'jquery'
, 'ramda'
, 'pointfree'
, 'Maybe'
, 'player'
, 'youtube'
, 'bacon'
], function($, _, P, Maybe, Player, youtube, bacon) {
  'use strict';

  // some "move out over here" helpers
  var compose = P.compose;
  var map = P.map;
  var log = function(x){ console.log(x); return x;}
  var fork = _.curry(function(f, future) { return future.fork(log, f) })
  var setHtml = _.curry(function(sel, x) { return $(sel).html(x); });


  // setup youtube search li stream
  var toParam = function (x) { return {q: x.target.value}; };
  var getResults = compose(youtube, toParam)
  var youTubeStream = Bacon.fromEventTarget($("#search"), "keydown").debounce(300).map(getResults);

  // setup click to player stream
  var toYoutubeId = function(e){ return $(e.target).data('youtubeid'); }
  var makePlayer = compose(map(Player.create), Maybe, toYoutubeId)
  var playerStream = Bacon.fromEventTarget(document, "click").map(makePlayer);

  // run app
  youTubeStream.onValue(fork(setHtml('#results')));
  playerStream.onValue(map(setHtml('#player')));
});
