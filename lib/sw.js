'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _dataProvider = require('./dataProvider');

var _dataProvider2 = _interopRequireDefault(_dataProvider);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _optimalRoutesCollection = require('public-transport-find-optimal-ways/lib/optimalRoutesCollection');

var _optimalRoutesCollection2 = _interopRequireDefault(_optimalRoutesCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('Hello from SW...');

var CACHE_NAME = 'mosm-app-v1';

var urlsToCache = ['/', '/index.html', '/favicon.ico', '/asset-manifest.json', '/static/js/bundle.js', '/static/css/style.css'];

self.addEventListener('install', function (event) {
  // Perform install steps
  /*event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  event.waitUntil(self.skipWaiting());*/
  /*event.waitUntil((async function(){
    let cache = await caches.open(CACHE_NAME);
    console.log('install: opened cache');
    await cache.addAll(urlsToCache);
    console.log('install: added all urls to cache');
    self.skipWaiting();
  })());*/

  event.waitUntil((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            caches.open(CACHE_NAME).then(function (cache) {
              console.log('Opened cache');
              return cache.addAll(urlsToCache);
            });
            self.skipWaiting();

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }))());
});

/*self.addEventListener('install', function(event) {
  console.log('ServiceWorker installed.');

  var cachePromise = caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  })
*/
/*// Perform install steps
var cachePromise = caches.open(CACHE_NAME)
  .then(function(cache) {
    console.log('install: opened cache');
    return cache.addAll(urlsToCache);
  })
  .then(() => {
    console.log('install: added all urls to cache');
  });*/

//event.waitUntil(cachePromise);
//event.waitUntil(self.skipWaiting()); // Activate worker immediately
//});

self.addEventListener('activate', function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(event) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('ServiceWorker activated.');

            //await DataProvider.loadDataAndInitialize();

            //event.waitUntil(self.clients.claim()); // Become available to all pages

            event.waitUntil(self.clients.claim().then((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
              return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return _dataProvider2.default.loadDataAndInitialize();

                    case 2:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, this);
            }))));

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}());

var clients = [];

self.addEventListener('message', function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(event) {
    var sender, params, rejected, resolved, res;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sender = event.source;
            //console.log(event.data);

            if (!(event.data === 'no-kill-sw')) {
              _context4.next = 11;
              break;
            }

            if (!clients.includes(sender.id)) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt('return');

          case 6:
            clients.push(sender.id);
            sender.postMessage('no-kill-sw-accepted');
            setInterval(function () {
              sender.postMessage("no-kill-sw-accepted");
            }, _config2.default.clientVsSwNoKillingMessageInterval);

          case 9:
            _context4.next = 17;
            break;

          case 11:
            if (!(event.data.requestType === 'optimalWay')) {
              _context4.next = 17;
              break;
            }

            console.log('SW: request for optimalWay.');

            _context4.next = 15;
            return _dataProvider2.default.loadDataAndInitialize();

          case 15:
            params = event.data.params;

            try {
              res = new _optimalRoutesCollection2.default(_dataProvider2.default.getAllStations(), params.startOptimalRoutePoint, params.finalOptimalRoutePoint, params.startTime, params.transportTypes, params.goingSpeed, params.dopTimeMinutes);
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

          case 17:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x2) {
    return _ref4.apply(this, arguments);
  };
}());

/////////////////////////////222222222222222222222222222222222222222222222222222222222222222222222222222//////////////////////////////////
/*self.addEventListener('fetch', function(event) {
  const { url } = event.request;
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        caches.open(CACHE_NAME).then(cache => cache.add(url));

        return fetch(event.request);
      }
    )
  );
});*/

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(event.request).then(function (response) {
      return response || fetch(event.request.clone()).then(function (response) {
        console.log(event.request); ////
        cache.put(event.request.clone(), response.clone());
        return response;
      });
    });
  }));
});

/*self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});*/