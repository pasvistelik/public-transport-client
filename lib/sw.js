'use strict';

var _dataProvider = require('./dataProvider');

var _dataProvider2 = _interopRequireDefault(_dataProvider);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _optimalRoutesCollection = require('public-transport-find-optimal-ways/lib/optimalRoutesCollection');

var _optimalRoutesCollection2 = _interopRequireDefault(_optimalRoutesCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import AppClient from './client';
//let s = '123hello123';
console.log('Hello from SW...');

var APP_CACHE_NAME = 'mosm-app-v1';
var TILE_CACHE_NAME = 'mosm-tiles-v1';

var urlsToCache = ['/', '/favicon.ico', '/static/js/bundle.js', '/static/css/style.css'];

self.addEventListener('install', function (event) {
  // Perform install steps
  var cachePromise = caches.open(APP_CACHE_NAME).then(function (cache) {
    //console.log('install: opened cache');
    return cache.addAll(urlsToCache);
  }).then(function () {
    //console.log('install: added all urls to cache');
  });

  event.waitUntil(cachePromise);
  event.waitUntil(self.skipWaiting()); // Activate worker immediately

  //console.log('!!!!!!!!!installed');
});

self.addEventListener('activate', async function (event) {

  event.waitUntil(self.clients.claim()); // Become available to all pages
  await _dataProvider2.default.loadDataAndInitialize();
  //console.log('!!!!!!!!!activated');
  //
  //console.log('!!!!!!!!!activated1');

  /**/
});
/*
var test = 0;
setInterval(function() {
  test++
}, 1000)
*/
//var ok = true;

var clients = [];

self.addEventListener('message', async function (event) {
  var sender = event.source;
  //console.log(event.data);
  if (event.data === 'no-kill-sw') {
    //console.log('SW: client call no-kill-sw.')
    if (clients.includes(sender.id)) {
      return;
    } else {
      clients.push(sender.id);
      sender.postMessage('no-kill-sw-accepted');
      setInterval(function () {
        sender.postMessage("no-kill-sw-accepted");
      }, _config2.default.clientVsSwNoKillingMessageInterval);
    }
  } else if (event.data.requestType === 'optimalWay') {
    //console.log('SW: request for optimalWay.');

    await _dataProvider2.default.loadDataAndInitialize();

    var params = event.data.params;
    var rejected, resolved;
    try {
      var res = new _optimalRoutesCollection2.default(_dataProvider2.default.getAllStations(), params.startOptimalRoutePoint, params.finalOptimalRoutePoint, params.startTime, params.transportTypes, params.goingSpeed, params.dopTimeMinutes);
      //console.log('res = ' + res);
      resolved = res.getOptimalWays();
      //console.log('resolved = ' + resolved);
    } catch (e) {
      console.log(e);
      rejected = e;
    } finally {
      sender.postMessage({
        requestType: 'optimalWayResult',
        result: resolved
      });
    }
  }
  /*if(ok) {
    //ok = false;
    setInterval(function() {
      sender.postMessage({
        message: test
      });
    }, 1000)
    //if (event.waitUntil) {
    //  event.waitUntil(promise);
    //}
  }*/
});

self.addEventListener('fetch', function (event) {
  var url = event.request.url;

  event.respondWith(caches.match(event.request).then(function (response) {
    // Cache hit - return response
    if (response) {
      return response;
    }
    caches.open(TILE_CACHE_NAME).then(function (cache) {
      return cache.add(url);
    });

    return fetch(event.request);
  }));
});

/*self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});*/