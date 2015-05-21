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

  // HELPERS ///////////////////////////////////////////
  var compose = P.compose;
  var map = P.map;
  var log = function(x) { console.log(x); return x; }
  var fork = _.curry(function(f, future) { return future.fork(log, f); })
  var setHtml = _.curry(function(sel, x) { return $(sel).html(x); });
  var listen = _.curry(function (event, target) {
    return bacon.fromEventTarget(target, event);
  });
  var getData = _.curry(function(name, elt) { return $(elt).data(name); });
  var last = function(ar) { return ar[ar.length - 1]; };

  // PURE //////////////////////////////////////////////////
  
  //  api_key :: String
  var api_key = 'AIzaSyAWoa7aqds2Cx_drrrb5FPsRObFa7Dxkfg';

  //+ eventValue :: DomEvent -> String
  var eventValue = compose(_.get('value'), _.get('target'));

  //+ valueStream :: DomEvent -> EventStream String
  var valueStream = compose(map(eventValue), listen('keyup'));

  //+ termToUrl :: String -> URL
  var termToUrl = function(term) {
    return 'https://www.googleapis.com/youtube/v3/search?' +
      $.param({part: 'snippet', q: term, key: api_key});
  };

  //+ urlStream :: DomEvent -> EventStream String
  var urlStream = compose(map(termToUrl), valueStream);

  //+ getInputStream :: Selector -> IO EventStream String
  var getInputStream = compose(map(urlStream), $.toIO());

  //+ render :: Entry -> Dom
  var render = function(e) {
    return $('<li/>', {text: e.snippet.title, 'data-youtubeid': e.id.videoId});
  };

  //+ videoEntries :: YoutubeResponse -> [Dom]
  var videoEntries = compose(map(render), _.get('items'));

  //+ search :: URL -> Future [Dom]
  var search = compose(map(videoEntries), http.getJSON);

  //+ DomElement -> EventStream DomElement
  var clickStream = compose(map(_.get('target')), listen('click'));

  //+ URL -> String
  var idInUrl = compose(last, _.split('/'));

  //+ youtubeLink :: DomElement -> Maybe ID
  var youtubeId = compose(map(idInUrl), Maybe, getData('youtubeid'));

  // IMPURE /////////////////////////////////////////////////////

  getInputStream('#search').runIO().onValue(
    compose(fork(setHtml('#results')), search)
  );

  clickStream(document).onValue(
    compose(map(compose(setHtml('#player'), Player.create)), youtubeId)
  );

});
