define([], function() {
  'use strict';

  var runIO = function(io) {
    return io.val();
  };

  var IOType = function(fn) {
    this.val = fn;
    this.runIO = this.val;
  };
  
  var IO = function(fn) {
    return (new IOType(fn));
  };

  IOType.of = function(x) {
    return IO(function() {
      return x;
    });
  };
  IOType.prototype.of = IOType.of;

  IOType.prototype.chain = function(g) {
    var io = this;
    return IO(function() {
      return g(io.val()).val();
    });
  };

  // Derived
  IOType.prototype.map = function(f) {
    return this.chain(function(a) {
      return IOType.of(f(a));
    });
  };
  IOType.prototype.ap = function(a) {
    return this.chain(function(f) {
      return a.map(f);
    });
  };

  var extendFn = function() {
    Function.prototype.toIO = function() {
      var self = this;
      return function(x) { return IO(function() { return self(x) }); };
    };
  };

  return {IO: IO, runIO: runIO, extendFn: extendFn};
});

