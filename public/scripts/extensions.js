define(['bacon'], function(bacon) {

  bacon.EventStream.prototype.map = function(f) {
    var b1 = new bacon.Bus();
    b1.map = baconMap;
    this.onValue(function(x) { b1.push(f(x)); });
    return b1;
  };

})
