define([
	'jquery'
, 'lodash'
, 'socketio'
, 'arrow'
], function($, _, io, A) {

	// helpers for now
  var subtract = _.curry(function(x,y) { return x - y; })
  var pluck = _.curry(function(x,obj) { return obj[x]; })
  var log2 = _.curry(function(tag, x) { console.log(tag, x); return x; })

	return function() {
	   var host = location.origin.replace(/^http/, 'ws')
          , ws = io.connect(host)
          , getField__ = function(a) { return IO(function(){ return $(a); }) }
          , setVal__ = _.curry(function(a, x){ return IO(function(){ return a.val(x) }) })
          , getVal__ = function(a){ return IO(function(){ return a.val()}) });
          , setSelectionRange__ = _.curry(function(x, c) {
          		return IO(function() {
          			return x.setSelectionRange(c.start, c.end);
          		})
          	})
          , focus__ = function(x) { return IO(function(){ return  x.focus(); }) })

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
        }

        //+ updateField :: [String, Cursor] -> IO(_)
        var updateField = function(result) {
        	return getField__('#area').map(function(a) {
        		return setVal__(a)(_.first(result)).ap(focus__(_.first(a))).ap(setSelectionRange__(_.first(a), _.last(result)))
        	});
        };

        var selStart__ = function(a) { return IO(function(){ return a.selectionStart; }) }
        var selEnd__ = function(a) { return IO(function(){ return a.selectionEnd; }) }

        //+ getNewCursor :: TextField -> Range -> IO(Range)
        var getNewCursor = _.curry(function(a, r) {
	        return selStart__(a).ap(selEnd__(a)).map(function(s, e) {
	        	var delta = charsCreatedBeforeCursor(r, s) - charsDestroyedBeforeCursor(r, s);
        		return {start: (s+delta), end: (e+delta), value: r.value}	
	        });
        })

        var sliceStart = _.curry(function(text, n) { return text.slice(0, n.start); });
        var sliceEnd = _.curry(function(text, n) { return text.slice(n.end); });

        //+ getNewText :: TextField -> Range -> IO(String)
        var getNewText = _.curry(function(a, r) {
        	return getVal__(a).map(function(t) {
        		return mconcat([sliceStart(t), pluck('value'), sliceEnd(t)])(r);
        	})
        })

        //+ httpInit :: IO(Promise(Range))
        var httpInit = fmap(setVal__($area), httpGet('/corpus'))

        ws.on('edit', compose(runIO, updateField, A.ampersand(getNewText($area), getNewCursor(area)), JSON.parse))

        $area.on('keypress', function(e){
          ws.emit('edit', JSON.stringify({
            value: String.fromCharCode(e.which),
            start: e.target.selectionStart,
            end:   e.target.selectionEnd
          }));
        });
   }
})