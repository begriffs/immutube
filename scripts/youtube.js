/* global define */
define([
  'jquery'
, 'lodash'
, 'io'
, 'http'
, 'pointfree'
], function($, _, io, http, P) {
  'use strict';

  io.extendFn();

  var IO = io.IO
    , K = function(x){ return function() { return x; }; }
    , pluck = _.curry(function(x,obj) { return obj[x]; })
    , join = _.curry(function(x,s){ return s.join(x); })
    , split = _.curry(function(x,s) { return s.split(x); })
    , last = function(s) { return s[s.length - 1]; }
    , compose = P.compose
    , fmap = P.fmap;

  var log2 = _.curry(function(tag, x) {console.log(tag, x); return x; } )

  // type Term = {q: String}
  // type Selector = String

  //+ searchUrl :: Term -> URL
  var searchUrl = function(t) { return 'http://gdata.youtube.com/feeds/api/videos?' + $.param(t) + "&alt=json"; };

  //+ search :: Term -> IO Future JSON
  var search = compose(http.getJSON, searchUrl).toIO()

  //+ getTitle :: {title: {$t: String}} -> String
  var getTitle = compose(pluck('$t'), pluck('title'));
  var getId    = compose(last, split('/'), pluck('$t'), pluck('id'));
  
  var toLi = function(t){return $('<li/>', {text: getTitle(t), 'data-youtubeid': getId(t)})}
    
  //+ render :: JSON -> HTML
  var render = compose(fmap(toLi), pluck('entry'), pluck('feed'));

  //+ displayResults :: Selector -> Term -> IO Future HTML
  var displayResults = compose(fmap(fmap(render)), search)

  return displayResults;
});

