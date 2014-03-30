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
  paths : {
      'jquery': '/base/public/scripts/vendor/jquery/dist/jquery.min'
    , 'lodash': '/base/public/scripts/vendor/lodash/dist/lodash'
    , 'socketio': '/socket.io/socket.io'
  },
  shim: {
    jquery: {
      exports: '$'
    }
    , lodash: {
      exports: '_'
    }
    , socketio: {
      exports: 'io'
    }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});
