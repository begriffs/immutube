/* global define, liftA2, sequenceA, mjoin, mconcat, fmap, location, compose */
define([
	'jquery'
, 'lodash'
, 'io'
, 'http'
], function($, _, io, http) {
  'use strict';
  var IO = io.IO;
  var runIO = io.runIO;

  // helpers for now
  var subtract = _.curry(function(x,y) { return x - y; });
  var pluck = _.curry(function(x,obj) { return obj[x]; });
  var join = _.curry(function(x,s){ return s.join(x); })
  // var map = _.curry(function(f,xs){ return _.map(xs, f); })
  var log2 = _.curry(function(tag, x) { console.log(tag, x); return x; });

  return function() {
    var setVal = _.curry(function(a, x){ return IO(function(){ return $(a).val(x); }); })
      , getJSON = function(url) { return IO(function(){ return http.getJSON(url); })}
      ;

    var search = function(q) {
    	var url = "http://gdata.youtube.com/feeds/api/videos?q="+q+"&alt=json";	
    	return getJSON(url)	
    }

    var getTitle = compose(pluck('$t'), pluck('title'))

    var showEntries = compose(setVal('#area'), join('\n'), fmap(getTitle), log2('e'), pluck('entry'), pluck('feed'), log2('s'))
    
    var init = compose(mjoin, fmap(showEntries), search)

    runIO(init("cheese"));
  }
});