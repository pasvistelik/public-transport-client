import DataProvider from './dataProvider';
import ApiConfig from './config';
import OptimalRoutesCollection from 'public-transport-find-optimal-ways/lib/optimalRoutesCollection';

console.log('Hello from SW...');


const CACHE_NAME = 'my-cache';

const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/asset-manifest.json',
  '/static/js/bundle.js',
  '/static/css/style.css',
  '/images/',
  //'/sw.js'
];

// Install event - cache files (...or not)
// Be sure to call skipWaiting()!
self.addEventListener('install', async function(event) {
  console.log('ServiceWorker installed.');

  await caches.open(CACHE_NAME).then(function(cache) {
    // Important to `return` the promise here to have `skipWaiting()`
    // fire after the cache has been updated.
    return cache.addAll(urlsToCache);
  }).then(function() {
    // `skipWaiting()` forces the waiting ServiceWorker to become the
    // active ServiceWorker, triggering the `onactivate` event.
    // Together with `Clients.claim()` this allows a worker to take effect
    // immediately in the client(s).
    return self.skipWaiting();
  });
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
});

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', async function(event) {
  console.log('ServiceWorker activated.');
	// `claim()` sets this worker as the active worker for all clients that
	// match the workers scope and triggers an `oncontrollerchange` event for
  // the clients.
  //await DataProvider.loadDataAndInitialize();
	return self.clients.claim();
});

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

self.addEventListener('message', async function(event) {
  var sender = event.source;
  if (sender == null){
    console.log("sender is null!");
    //return;
  }
  console.log("SW: input message event:");
  console.log(event);
  if(event.data === 'no-kill-sw') {
    console.log('SW: client call no-kill-sw.')
    if(clients.includes(sender.id)){
      return;
    }
    else {
      clients.push(sender.id);
      sender.postMessage('no-kill-sw-accepted');
      setInterval(function(){
        sender.postMessage("no-kill-sw-accepted");
      }, ApiConfig.clientVsSwNoKillingMessageInterval);
    }
  }
  else if(event.data === 'can-use-sw-accepted'){
    await DataProvider.loadDataAndInitialize();
  }
  else if(event.data.requestType === 'optimalWay'){
    console.log('SW: request for optimalWay.');

    await DataProvider.loadDataAndInitialize();

    var params = event.data.params;
    var rejected, resolved;
    try {
      var res = new OptimalRoutesCollection(
        DataProvider.getAllStations(), 
        params.startOptimalRoutePoint, 
        params.finalOptimalRoutePoint, 
        params.startTime,
        params.transportTypes,
        params.goingSpeed,
        params.dopTimeMinutes
      );
      //console.log('res = ' + res);
      resolved = res.getOptimalWays();
      //console.log('resolved = ' + resolved);
    } catch(e) {
      console.log(e);
      rejected = e;
    } finally {
      sender.postMessage({
        requestType: 'optimalWayResult',
        result: resolved
      });
    }
  }
});


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



self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request.clone()).then(function(response) {
          //console.log(event.request);////
          if(event.request.url != ApiConfig.apiGetRoutesUrl && event.request.url != ApiConfig.apiGetStationsUrl && event.request.url != ApiConfig.apiGetTimetablesUrl){
            cache.put(event.request.clone(), response.clone());
          }
          return response;
        });
      });
    })
  );
});



/*self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
*/