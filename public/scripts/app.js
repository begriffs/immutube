/* global define, liftA2, sequenceA, mjoin, mconcat, fmap, location, compose */
define([
	'jquery'
, 'lodash'
, 'socketio'
, 'arrow'
, 'io'
, 'http'
], function($, _, socket, A, io, http) {
  'use strict';
  var IO = io.IO;
  var runIO = io.runIO;
  var httpGet = http.get;

  // helpers for now
  var subtract = _.curry(function(x,y) { return x - y; });
  var pluck = _.curry(function(x,obj) { return obj[x]; });
  var log2 = _.curry(function(tag, x) { console.log(tag, x); return x; });

  return function() {
    var host = location.origin.replace(/^http/, 'ws')
          , ws = socket.connect(host)
          , getField = function(a) { return IO(function(){ return $(a); }); }
          , setVal = _.curry(function(a, x){ return IO(function(){ return a.val(x); }); })
          , getVal = function(a){ return IO(function(){ return a.val(); }); }
          , setSelectionRange = _.curry(function(x, c) {
              return IO(function() {
                return x.setSelectionRange(c.start, c.end);
              });
            })
          , focus = function(x) { return IO(function(){ return  x.focus(); }); };

    var upto = function (range, position) {
      // return { start: range.start, end:  Math.min(range.end, position) };
      return range;
    };

    var length = function (range) {
      return range.end - range.start;
    };

    var charsDestroyedBeforeCursor = compose(length, upto);

    var charsCreatedBeforeCursor = function(range, position) {
      return range.start < position ? 1 : 0;
    };

    //+ updateField :: [String, Range] -> IO([_])
    var updateField = _.curry(function(a, result) {
      return sequenceA([setVal(a, _.first(result))
        , focus(_.first(a))
        , setSelectionRange(_.first(a), _.last(result))
      ]);
    });

    var selStart = function(a) { return IO(function(){ return a.selectionStart; }); };
    var selEnd = function(a) { return IO(function(){ return a.selectionEnd; }); };

    //+ getNewCursor :: TextArea -> Range -> Range
    var getNewCursor = _.curry(function(a, s, e, r) {
      var delta = charsCreatedBeforeCursor(r, s) - charsDestroyedBeforeCursor(r, s);
      return {start: (s+delta), end: (e+delta), value: r.value};
    });

    var sliceStart = _.curry(function(text, n) { return text.slice(0, n.start); });
    var sliceEnd = _.curry(function(text, n) { return text.slice(n.end); });

    //+ getNewText :: TextArea -> Range -> String
    var getNewText = _.curry(function(a, t, r) {
      return mconcat([sliceStart(t), pluck('value'), sliceEnd(t)])(r);
    });

    //+ httpInit :: IO(Promise(IO(_)))
    var httpInit = getField('#area').map(function(a) {
      return httpGet('/corpus').map(setVal(a));
    });

    //+ doWork :: Range -> [IO(String), IO(Range)]
    var doWork = _.curry(function (a, start, end, v, r) {
      return A.ampersand(getNewText(a, v), getNewCursor(a[0], start, end))(r);
    });

    // instance Monad ((->) r) where  
    // return x = \_ -> x  
    // h >>= f = \w -> f (h w) w  

    ws.on('edit', function (e) {
      runIO(getField('#area').chain(function (a) {
        return getVal(a).chain(function (v) {
          return selStart(a).chain(function(start){
            return selEnd(a).chain(function(end){
              return compose(updateField(a), doWork(a, start, end, v), JSON.parse)(e);
            });
          });
        });
      }));
    });

    var addKeypress = getField('#area').map(function(a) {
      a.on('keypress', function(e){
        ws.emit('edit', JSON.stringify({
          value: String.fromCharCode(e.which),
          start: e.target.selectionStart,
          end:   e.target.selectionEnd
        }));
      });
    });

    runIO(httpInit).then(runIO);
    runIO(addKeypress);
  };
});
