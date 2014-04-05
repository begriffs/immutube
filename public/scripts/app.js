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
          , $area = $('#area')
          , area = $area[0]
          , setVal__ = _.curry(function(a,x){ return a.val(x) })
          , getVal__ = function(a){ return a.val() };

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

        var updateField = function(result) {
        	var cursor = _.last(result);
          setVal__($area, _.first(result))
          area.focus();
          area.setSelectionRange(cursor.start, cursor.end);
        };

        var getNewCursor = function(r) {
        	var start = area.selectionStart;
        	var end = area.selectionEnd;
        	var delta = charsCreatedBeforeCursor(r, start) - charsDestroyedBeforeCursor(r, start);
        	return {start: (start+delta), end: (end+delta), value: r.value}
        }

        var sliceStart = _.curry(function(text, n) { return text.slice(0, n.start); });
        var sliceEnd = _.curry(function(text, n) { return text.slice(n.end); });

        var getNewText = function(e) {
        	var text = getVal__($area);
					var spliceField = mconcat([sliceStart(text), pluck('value'), sliceEnd(text))])
					return spliceField(e)
        }

        $.get('/corpus', setVal__($area));
        //fmap(setVal, httpGet('/corpus'))

        ws.on('edit', compose(updateField, A.ampersand(getNewText, getNewCursor), JSON.parse))

        $area.on('keypress', function(e){
          ws.emit('edit', JSON.stringify({
            value: String.fromCharCode(e.which),
            start: e.target.selectionStart,
            end:   e.target.selectionEnd
          }));
        });
   }
})