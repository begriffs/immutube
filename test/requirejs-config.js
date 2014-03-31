var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/_spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
  paths: {
    'lodash':   '/base/public/scripts/vendor/lodash/dist/lodash',
    'resolver': '/base/public/scripts/resolver'
  },
  shim: {
    lodash: {
      exports: '_'
    }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});
