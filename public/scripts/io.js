define(['lodash'], function(_) {

var runIO = function(io) {
  var result = io.runIO();
  return result && result.runIO ? runIO(result) : result;
};

var IOType = function(fn) {
  this.val = fn;
}

IOType.prototype.map = function(f) {
  var computation = this.val;
  return function(x) {
    return f(computation(x));
  };
}

var IO = function(fn) {
  return (new IOType(fn));
};

return {IO: IO, runIO: runIO};
});