import DataProvider from './dataProvider';
import ApiConfig from './config';
import OptimalRoutesCollection from 'public-transport-find-optimal-ways/lib/optimalRoutesCollection';
//import AppClient from './client';
//let s = '123hello123';
console.log('Hello from SW...');


const CACHE_NAME = 'mosm-app-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/asset-manifest.json',
  '/static/js/bundle.js',
  '/static/css/style.css',
  '/sw.js'
];

/*self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  event.waitUntil(self.skipWaiting());
});*/


self.addEventListener('install', function(event) {
  console.log('ServiceWorker installed.');

  var cachePromise = caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  })

  /*// Perform install steps
  var cachePromise = caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('install: opened cache');
      return cache.addAll(urlsToCache);
    })
    .then(() => {
      console.log('install: added all urls to cache');
    });*/

  event.waitUntil(cachePromise);
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
  
  
});

self.addEventListener('activate', async function(event) {
  console.log('ServiceWorker activated.');

  event.waitUntil(self.clients.claim()); // Become available to all pages
  event.waitUntil(await DataProvider.loadDataAndInitialize());
});

var clients = [];

self.addEventListener('message', async function(event) {
  var sender = event.source;
  //console.log(event.data);
  if(event.data === 'no-kill-sw') {
    //console.log('SW: client call no-kill-sw.')
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
  else if(event.data.requestType === 'optimalWay'){
    //console.log('SW: request for optimalWay.');

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
          console.dir(response);
          cache.put(event.request.clone(), response.clone());
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
});*/