/* global document */

require.config({ baseUrl: '/scripts'
               , paths : { 'jquery': 'vendor/jquery/dist/jquery.min'
                         , 'ramda': 'ramda'
                         , 'pointfree': 'vendor/pointfree/dist/pointfree.amd'
                         , 'future': 'data.future.umd'
                         , 'bacon': 'vendor/bacon/dist/Bacon.min'
                         , 'socketio': '/socket.io/socket.io'
                         }
               , shim: { jquery: { exports: '$' }
                       , socketio: { exports: 'io' }
                       , lodash: { exports: '_' }
                       , ramda: { exports: 'ramda' }
                       }
                });
require(
  [ 'jquery', 'app' ],
  function($, app){
    'use strict';

    $(app);
  }
);
