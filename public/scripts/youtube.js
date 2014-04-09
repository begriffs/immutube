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

  var pluck = _.curry(function(x,obj) { return obj[x]; });
  var join = _.curry(function(x,s){ return s.join(x); })
  var log2 = _.curry(function(tag, x) { console.log(tag, x); return x; });
  var setVal = _.curry(function(a, x){ return IO(function(){ return $(a).html(x); }); });

  return function() {    

    //+ makeUrl :: String -> String
    var makeUrl = mconcat([K("http://gdata.youtube.com/feeds/api/videos?q="), id, K("&alt=json")]);

    //+ search :: String -> Stream(YoutubeResp)
    var search = compose(http.getJSON, makeUrl)

    //+ getTitle :: {title: {$t: String}} -> String
    var getTitle = compose(pluck('$t'), pluck('title'))

    //+ showEntries :: YoutubeResp -> IO(_)
    var showEntries = compose(setVal('body'), join('<br/>'), fmap(getTitle), pluck('entry'), pluck('feed'))
    
    //+ init :: String -> Stream(IO)
    var init = compose(fmap(showEntries), search)

    //+ prog :: String -> Stream(IO(_))
    var prog = compose(fmap(runIO), init);

    prog("cheese");
  }
});
