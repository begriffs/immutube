define(['jquery', 'future'], function($, Future) {
  'use strict';

	return {
		getJSON: function(url) {
			return new Future(function(rej, res) {
				$.getJSON(url, res);
			});
		}
	};
});
