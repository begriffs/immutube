define(['bacon'], function(bacon) {

  bacon.Bus.prototype.map = function(f) {
    var b1 = new bacon.Bus();
    this.onValue(function(x) { b1.push(f(x)); });
    return b1;
  };

  bacon.EventStream.prototype.map = function(f) {
    var b1 = new bacon.Bus();
    this.onValue(function(x) { b1.push(f(x)); });
    return b1;
  };

})
