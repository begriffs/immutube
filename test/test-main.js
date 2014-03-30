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
  baseUrl: '/base/public/scripts'
  , paths : {
      'jquery': 'vendor/jquery/dist/jquery.min' 
    , 'lodash': 'vendor/lodash/dist/lodash'
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
