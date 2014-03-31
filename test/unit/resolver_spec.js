define(['resolver', 'lodash'], function(r, _) {

  function sequentialResolution(s) {
    return _.reduce(s, function (corpus, c, i) {
      return r(corpus, i, i, c);
    }, '');
  }

  describe('resolver', function() {
    it('can add a letter', function() {
      assert.equal(r('', 0, 0, 'x'), 'x');
    });

    it('resolves two requests to add a letter at start', function() {
      assert.equal('yx',
        r(
          r('', 0, 0, 'x'),
                0, 0, 'y'
        )
      );
    });

    it('can add a sequence of letters', function() {
      assert.equal(sequentialResolution('abc'), 'abc');
    });
  });

});
