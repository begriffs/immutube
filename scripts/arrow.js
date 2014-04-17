define(['lodash'], function(_) {
  var curry = _.curry;

  // Helpers
  var K = function(x) { return function(y) { return x} };
  var I = function(x) { return x };


  // Defines the function instance for arrow rather than the full typeclass
  var arr = I

    , compose = curry(function(f, g, x) {
        return g(f(x));
      })

    , asterisk = curry(function(f, g) {
        return function(tuple) {
          return [f(tuple[0]), g(tuple[1])]
        }
      })

    , ampersand = curry(function(f, g) {
        return function(x) {
          return asterisk(f, g)([x, x]);
        };
      })

    , first = function(f) {
        return asterisk(f, I);
      }

    , second = function(f) {
        return asterisk(I, f);
      }
    ;

  var Arrow =  { arr: arr
               , asterisk: asterisk
               , ampersand: ampersand
               , first: first
               , second: second
               , compose: compose
               }

  return Arrow;
});