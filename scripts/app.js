/* global define */
define([
  'jquery'
, 'ramda'
, 'pointfree'
, 'Maybe'
, 'player'
, 'io'
, 'bacon'
, 'http'
], function($, _, P, Maybe, Player, io, bacon, http) {
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

  //+ eventValue :: DomEvent -> String
  var eventValue = compose(_.get('value'), _.get('target'));

  //+ valueStream :: DomEvent -> EventStream String
  var valueStream = compose(map(eventValue), listen('keyup'));

  //+ termToUrl :: String -> URL
  var termToUrl = function(term) {
    return 'http://gdata.youtube.com/feeds/api/videos?' +
      $.param({q: term, alt: 'json'});
  };

  //+ urlStream :: DomEvent -> EventStream String
  var urlStream = compose(map(termToUrl), valueStream);

  //+ getInputStream :: Selector -> IO EventStream String
  var getInputStream = compose(map(urlStream), $.toIO());

  //+ videoUrls :: YoutubeResponse -> [Entry]
  var videoEntries = compose(_.get('entry'), _.get('feed'));

  //+ search :: URL -> Future [Entry]
  var search = compose(map(videoEntries), http.getJSON);



  // IMPURE ////////////////////////////////////////////////////////////////////////////

  getInputStream('#search').runIO().onValue(compose(fork(log), search));

});
