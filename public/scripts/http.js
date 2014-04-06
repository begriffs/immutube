define(['lodash', 'jquery'], function(_, $) {
	return {
		get: _.curry(function(url, params) {
			promise = $.get(url);
			promise.map = function(f)	{
				return promise.then(f);
			}
			return promise;
		})
	}
});