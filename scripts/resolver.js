define([], function () {
  return function (corpus, sel_start, sel_end, edit) {
    return corpus.slice(0, sel_start) + edit + corpus.slice(sel_end);
  };
});
