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
  'maybe',
  'lodash',
  'extensions'
], function($, P, app, io, searches, Maybe, _){

$(function() {

  var setHtml = _.curry(function(sel, x){ return $(sel).html(x); })
  var render = setHtml("#results") 
  var playerHtml = function(yid) {
    return '<iframe width="320" height="240" src="//www.youtube.com/embed/'+yid+'" frameborder="0" allowfullscreen></iframe>'
  };

  var insertPlayer = P.compose(setHtml('#player'), playerHtml)

  var tableClicks = $(document).asEventStream('click')
  tableClicks.map(function(e){ return Maybe( $(e.target).data('youtubeid') ); }).map(function(m){
    m.map(insertPlayer);
  })

  var toParam = function (x) { return {q: x.target.value} }

  var prog = P.compose(P.fmap(render), io.runIO, app)
  P.fmap(P.compose(prog, toParam), searches)
})

});
