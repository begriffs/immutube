require.config({ baseUrl: '/scripts'
               , paths : { 'jquery': 'vendor/jquery/dist/jquery.min'
                         , 'lodash': 'vendor/lodash/dist/lodash'
                         , 'pointfree': 'vendor/pointfree/dist/pointfree.amd'
                         , 'bacon': 'vendor/bacon/dist/Bacon.min'
                         , 'socketio': '/socket.io/socket.io'
                         }
               , shim: { jquery: { exports: '$' }
                       , socketio: { exports: 'io' }
                       , lodash: { exports: '_' }
                       }
                });
require([
  'jquery',
  'pointfree',
  'youtube',
  'io',
  'search',
  'extensions'
], function($, P, app, io, searches){

$(function() {
  var render = function(x) {
    $('#results').html(x)
  }

  var toParam = function (x) { return {q: x.target.value} }

  var prog = P.compose(P.fmap(render), io.runIO, app)
  P.fmap(P.compose(prog, toParam), searches)
})

});
