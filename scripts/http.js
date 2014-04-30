define(['jquery', 'future'], function($, Future) {
  'use strict';

  // var httpGet = _.curry(function(url, cb) { $.getJSON(url, cb) })

	return {
		getJSON: function(url) {
			return new Future(function(rej, res) {
				$.getJSON(url, res);	
			});
		}
	};
});
