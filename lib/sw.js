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

var CACHE_NAME = 'my-cache';

var urlsToCache = ['/', '/index.html', '/favicon.ico', '/asset-manifest.json', '/static/js/bundle.js', '/static/css/style.css', '/static/images/'];

// Install event - cache files (...or not)
// Be sure to call skipWaiting()!
self.addEventListener('install', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(event) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('ServiceWorker installed.');

            _context.next = 3;
            return caches.open(CACHE_NAME).then(function (cache) {
              // Important to `return` the promise here to have `skipWaiting()`
              // fire after the cache has been updated.
              return cache.addAll(urlsToCache);
            }).then(function () {
              // `skipWaiting()` forces the waiting ServiceWorker to become the
              // active ServiceWorker, triggering the `onactivate` event.
              // Together with `Clients.claim()` this allows a worker to take effect
              // immediately in the client(s).
              return self.skipWaiting();
            });

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()
/*event.waitUntil(
caches.open(CACHE_NAME).then(function(cache) {
      // Important to `return` the promise here to have `skipWaiting()`
      // fire after the cache has been updated.
      return cache.addAll(urlsToCache);
  }).then(function() {
    // `skipWaiting()` forces the waiting ServiceWorker to become the
    // active ServiceWorker, triggering the `onactivate` event.
    // Together with `Clients.claim()` this allows a worker to take effect
    // immediately in the client(s).
    return self.skipWaiting();
  })
);*/
);

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(event) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('ServiceWorker activated.');
            // `claim()` sets this worker as the active worker for all clients that
            // match the workers scope and triggers an `oncontrollerchange` event for
            // the clients.
            //await DataProvider.loadDataAndInitialize();
            return _context2.abrupt('return', self.clients.claim());

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());

// self.addEventListener('install', function(event) {
//   console.log('ServiceWorker installed.');
//   // Perform install steps
//   /*event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(function(cache) {
//         console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//   );
//   event.waitUntil(self.skipWaiting());*/
//   /*event.waitUntil((async function(){
//     let cache = await caches.open(CACHE_NAME);
//     console.log('install: opened cache');
//     await cache.addAll(urlsToCache);
//     console.log('install: added all urls to cache');
//     self.skipWaiting();
//   })());*/

//   caches.open(CACHE_NAME)
//   .then(function(cache) {
//     console.log('Opened cache');
//     return cache.addAll(urlsToCache);
//   });
//   /*event.waitUntil(
//     caches.open(CACHE_NAME)
//     .then(function(cache) {
//       console.log('Opened cache');
//       self.skipWaiting();
//       return cache.addAll(urlsToCache);
//     })
//   );*/
//   event.waitUntil(self.skipWaiting());


//   /*event.waitUntil(self.skipWaiting().then(function(){
//     caches.open(CACHE_NAME)
//     .then(function(cache) {
//       console.log('Opened cache');
//       return cache.addAll(urlsToCache);
//     });
//   }))*/

// });


// /*self.addEventListener('install', function(event) {
//   console.log('ServiceWorker installed.');

//   var cachePromise = caches.open(CACHE_NAME).then(function(cache) {
//     return cache.addAll(urlsToCache);
//   })
// */
//   /*// Perform install steps
//   var cachePromise = caches.open(CACHE_NAME)
//     .then(function(cache) {
//       console.log('install: opened cache');
//       return cache.addAll(urlsToCache);
//     })
//     .then(() => {
//       console.log('install: added all urls to cache');
//     });*/

//   //event.waitUntil(cachePromise);
//   //event.waitUntil(self.skipWaiting()); // Activate worker immediately
// //});

// self.addEventListener('activate', function(event) {
//   console.log('ServiceWorker activated.');

//   //await DataProvider.loadDataAndInitialize();

//   //event.waitUntil(self.clients.claim()); // Become available to all pages

//   event.waitUntil(self.clients.claim().then(async function(){
//     await DataProvider.loadDataAndInitialize();
//   }));

// });

var clients = [];

self.addEventListener('message', function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(event) {
    var sender, params, rejected, resolved, res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            sender = event.source;

            if (sender == null) {
              console.log("sender is null!");
              //return;
            }
            console.log("SW: input message event:");
            console.log(event);

            if (!(event.data === 'no-kill-sw')) {
              _context3.next = 15;
              break;
            }

            console.log('SW: client call no-kill-sw.');

            if (!clients.includes(sender.id)) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt('return');

          case 10:
            clients.push(sender.id);
            sender.postMessage('no-kill-sw-accepted');
            setInterval(function () {
              sender.postMessage("no-kill-sw-accepted");
            }, _config2.default.clientVsSwNoKillingMessageInterval);

          case 13:
            _context3.next = 26;
            break;

          case 15:
            if (!(event.data === 'can-use-sw-accepted')) {
              _context3.next = 20;
              break;
            }

            _context3.next = 18;
            return _dataProvider2.default.loadDataAndInitialize();

          case 18:
            _context3.next = 26;
            break;

          case 20:
            if (!(event.data.requestType === 'optimalWay')) {
              _context3.next = 26;
              break;
            }

            console.log('SW: request for optimalWay.');

            _context3.next = 24;
            return _dataProvider2.default.loadDataAndInitialize();

          case 24:
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

          case 26:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
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
        //console.log(event.request);////
        if (event.request.url != _config2.default.apiGetRoutesUrl && event.request.url != _config2.default.apiGetStationsUrl && event.request.url != _config2.default.apiGetTimetablesUrl) {
          cache.put(event.request.clone(), response.clone());
        }
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
});
*/