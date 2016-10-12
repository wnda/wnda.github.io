'use strict';

self.importScripts( 'https://amdouglas.com/assets/js/serviceworker-cache-polyfill.js' );

var CACHE_VERSION = 26;
var CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function(event) {
  var urlsToPrefetch = [
    'https://amdouglas.com/',
    'https://amdouglas.com/assets/css/main.css',
    'https://amdouglas.com/assets/css/fonts.css',
    'https://amdouglas.com/assets/js/app.js',
    'https://amdouglas.com/assets/js/serviceworker-cache-polyfill.js',
    'https://amdouglas.com/assets/img/favicon.ico',
    'https://amdouglas.com/assets/fonts/Rubik-Regular.woff2', // if a browser doesn't support woff2, it certainly won't support SW
    'https://amdouglas.com/assets/fonts/Rubik-Bold.woff2',
    'https://amdouglas.com/manifest.json'
  ];
  self.skipWaiting();
  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(function(cache){
      return cache.addAll(urlsToPrefetch);
    })
  );
});

self.addEventListener('activate', function(event){
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.map(function(cacheName){
          if (expectedCacheNames.indexOf(cacheName) === -1){
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      if(response){
        return response;
      }
      return fetch(event.request).then(function(response) {
        return response;
      }).catch(function(error) {
        console.error('Fetching failed:', error);
        throw error;
      });
    }));
});
