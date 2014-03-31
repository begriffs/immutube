define(['resolver', 'lodash'], function(r, _) {

  function sequentialResolution(corpus, s, start_pos) {
    start_pos = start_pos || 0;
    return _.reduce(s, function (corpus, c, i) {
      return r(corpus, start_pos+i, start_pos+i, c);
    }, corpus);
  }

  describe('resolver', function () {
    it('can add a letter', function () {
      assert.equal(r('', 0, 0, 'x'), 'x');
    });

    it('resolves two requests to add a letter at start', function () {
      assert.equal('yx',
        r(
          r('', 0, 0, 'x'),
                0, 0, 'y'
        )
      );
    });

    it('can add a sequence of letters', function () {
      assert.equal(sequentialResolution('', 'abc'), 'abc');
    });

    it('can add a shifted sequence of letters', function () {
      assert.equal('axyzbc',
        sequentialResolution(
          sequentialResolution('', 'abc'),
          'xyz', 1
        )
      );
    });

    it('shifts edits backward if corpus is smaller', function () {
      assert.equal('ab',
        r(
          r('', 7,  7,  'a'),
                12, 12, 'b'
        )
      );
    });

    it('replaces a range', function () {
      assert.equal('axc', r('abc', 1, 2, 'x'));
    });
  });

});
