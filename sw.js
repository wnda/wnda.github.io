'use strict';

self.importScripts('https://amdouglas.com/assets/js/serviceworker-cache-polyfill.js');

var CACHE_VERSION = 3;
var CURRENT_CACHES = {
  prefetch: 'pfc-v' + CACHE_VERSION
};

self.addEventListener('install', function(event) {
  var urlsToPrefetch = [
    '/',
    '/assets/css/main.css',
    '/assets/css/fonts.css',
    '/assets/js/app.js',
    '/assets/js/serviceworker-cache-polyfill.js',
    '/assets/fonts/Rubik-Regular.woff2', // if a browser doesn't support woff2, it certainly won't support SW
    '/assets/fonts/Rubik-Bold.woff2',
    '/favicon.ico',
    '/offline.html',
    '/manifest.json'
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
  if(event.request.mode==='navigate'||(event.request.method==='GET'&&event.request.headers.get('accept').includes('text/html'))){
    event.respondWith(
      fetch(event.request.url)
        .catch(function(){
          return caches.match('/offline.html');
        })
    );
  }
  else{
    event.respondWith(
      caches.match(event.request)
        .then(function(response){
          return response||fetch(event.request);
        })
    );
  }
});
