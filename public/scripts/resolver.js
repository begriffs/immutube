define([], function () {
  return function (corpus, sel_start, sel_end, edit) {
    if(sel_start === sel_end) {
      return corpus.slice(0, sel_start) + edit + corpus.slice(sel_start);
    }
  };
});
