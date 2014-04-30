/* global define */
define([
  'jquery'
, 'lodash'
, 'pointfree'
,	'Maybe'
,	'player'
,	'youtube'
], function($, _, P, Maybe, Player, youtube) {
  'use strict';

  // some "move out over here" helpers
  var compose = P.compose;
  var fmap = P.fmap;
  var log = function(x){ console.log(x); return x;}
  var fork = _.curry(function(f, future) { return future.fork(log, f) })
  var setHtml = _.curry(function(sel, x) { return $(sel).html(x); });


  // setup youtube search li stream
  var toParam = function (x) { return {q: x.target.value}; };
  var searches = Bacon.fromEventTarget($("#search"), "keydown").debounce(300).map(toParam);
  var youtubeLiStream = fmap(youtube, searches)

  // setup click to player stream
  var toYoutubeId = function(e){ return $(e.target).data('youtubeid'); }
  var docClicks = Bacon.fromEventTarget(document, "click").map(toYoutubeId);
  var makePlayer = compose(fmap(Player.create), Maybe)
  var playerStream = fmap(makePlayer, docClicks)
  
  // run app
  fmap(fork(setHtml('#results')), youtubeLiStream);
  fmap(fmap(setHtml('#player')), playerStream);
});
