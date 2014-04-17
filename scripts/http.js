define(['lodash', 'jquery', 'bacon'], function(_, $, bacon) {
  'use strict';

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
			var b = new bacon.Bus();
			$.getJSON(url, function(resp) { b.push(resp); });
			return b;
		}
	};
});
