define([], function() {
	var create = function(yid) {
    return '<iframe width="320" height="240" src="//www.youtube.com/embed/'+yid+'" frameborder="0" allowfullscreen></iframe>';
  }

  return {create: create}
});