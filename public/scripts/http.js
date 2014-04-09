define(['lodash', 'jquery', 'bacon'], function(_, $, bacon) {
  'use strict';

  var baconMap = function(f) {
		var b1 = new bacon.Bus;
		b1.map = baconMap;
		this.onValue(function(x) { b1.push(f(x)); })
		return b1;
	};

	return {
		get: function(url) {
			var promise = $.get(url);
			promise.map = function(f) {
				return promise.then(function(x){
          promise.val = x;
          return f(x);
        });
			};
			return promise;
		},

		getJSON: function(url) {
			var b = new bacon.Bus;
			$.getJSON(url, function(resp) { b.push(resp) });
			b.map = baconMap;
			return b;
		}
	}
});
