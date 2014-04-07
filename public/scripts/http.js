define(['lodash', 'jquery'], function(_, $) {
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
		}
	};
});
