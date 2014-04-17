define([], function() {

  var MaybeType = function(x){ this.val = x; } 
    , Just = function(x){ this.val = x; } 
    , Nothing = function(x){ this.val = x; } 
    ;

  //+ notThere :: a -> Bool
  var notThere = function(val) {
    return (val === undefined || val === null);
  }

  var Maybe = function(x) {
    return notThere(x) ? (new Nothing()) : (new Just(x));
  };

  Maybe.Just = Just;
  Maybe.Nothing = Nothing;

  Nothing.prototype.concat = function(b) {
    return b;
  }
  Just.prototype.concat = function(b) {
    if(notThere(b.val)) return this;
    return Maybe(this.val.concat(b.val));
  };

  Nothing.prototype.empty = function() { return new Nothing(); }
  Just.prototype.empty = function() { return new Nothing(); }

  Nothing.prototype.map = function(f) {
    return new Nothing();
  }
  Just.prototype.map = function(f) {
    return new Just(f(this.val));
  }

  Nothing.prototype.of = function(x) { return new Nothing(x) };
  Just.prototype.of = function(x) { return new Just(x) };

  Nothing.prototype.ap = function(m) {
    return new Nothing();
  }
  Just.prototype.ap = function(m) {
    return new this.val.map(m);
  }

  Nothing.prototype.chain = function(f) {
    return this;
  }
  Just.prototype.chain = function(f) {
    return f(this.val);
  }

  var inspect = function(x) {
    if(x==null || x==undefined) return "null";
    return x.inspect ? x.inspect() : x;
  }

  Nothing.prototype.inspect = function() {
    return 'Maybe(null)';
  }
  Just.prototype.inspect = function() {
    return 'Maybe('+inspect(this.val)+')';
  }

  return Maybe;
});
