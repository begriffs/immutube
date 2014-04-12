/* global define */
define([
  'jquery'
, 'lodash'
, 'io'
, 'http'
, 'pointfree'
], function($, _, io, http, P) {
  'use strict';

  var IO = io.IO
    , K = function(x){ return function() { return x; }; }
    , pluck = _.curry(function(x,obj) { return obj[x]; })
    , join = _.curry(function(x,s){ return s.join(x); })
    , compose = P.compose
    , fmap = P.fmap;

  var log2 = _.curry(function(tag, x) {console.log(tag, x); return x; } )

  // type Term = {q: String}
  // type Selector = String

  //+ searchUrl :: Term -> URL
  var searchUrl = _.curry(function(t) { return 'http://gdata.youtube.com/feeds/api/videos?' + $.param(t) + "&alt=json"; });

  //+ search :: Term -> IO Future JSON
  var search = function (term) {
    return IO(function() {
      return http.getJSON(searchUrl(term));
    });
  };

  //+ getTitle :: {title: {$t: String}} -> String
  var getTitle = compose(pluck('$t'), pluck('title'));

  //+ render :: JSON -> HTML
  var render = compose(join('<br/>'), fmap(getTitle), pluck('entry'), pluck('feed'));

  //+ setVal :: Selector -> HTML -> IO Dom
  var setVal = _.curry(function(a, x){ return IO(function(){ return $(a).html(x); }); });

  //+ displayResults :: Selector -> Term -> IO Future IO Dom
  var displayResults = _.curry(function(sel, param) {
    return compose(fmap(fmap(compose(setVal(sel), render))), search)(param);
  });

  //debugger;
  return displayResults;
});
