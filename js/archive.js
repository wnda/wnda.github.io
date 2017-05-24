;(function(win,doc,head,body){
  if(!('addEventListener' in win)) return;
  loadStylesheets(['https://static.amdouglas.com/css/fonts.css']);
  win.addEventListener('load',handleLoad,false);
  function loadStylesheets(urls){
    for(var i = 0;i<urls.length;++i){
      var css  = doc.createElement('link');
      css.rel  = 'stylesheet';
      css.href = urls[i];
      head.appendChild(css);
    }
  }
  function handleLoad(){
    win.removeEventListener('load',handleLoad,false);
    if('devicePixelRatio' in win && win.devicePixelRatio > 1 && wdth < 992){
      appendTouchIcons();
    }
    /*
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('https://amdouglas.com/sw.js', {
        scope: '/'
      }).then(function(registration){
        console.info("SW registered [" + registration.scope + "]");
      }).catch(function(err){
        console.warn("SW failed to register [" + err + "]");
      });
    }*/
    win.GoogleAnalyticsObject = 'ga';
    win.ga = win.ga || function(){
      for(var p = 0; p < arguments.length; ++p){
        (win.ga.q = win.ga.q || []).push(arguments[p]);
      }
    };
    win.ga.l = 1 * new Date();
    var uas = doc.createElement('script');
    uas.async=!0;
    uas.src='https://www.google-analytics.com/analytics.js';
    body.appendChild(uas);
    win.ga('create','UA-70873652-1','auto');
    win.ga('send','pageview');
  }
  function appendTouchIcons(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://static.amdouglas.com/manifest.json', true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status >= 200 && xhr.status < 300){
          var data = JSON.parse(xhr.responseText);
          for(var j=0;j<data.icons.length;++j){
            if(data.icons[j].src.indexOf('apple') > -1){
              var icon = doc.createElement('link');
              icon.rel = 'apple-touch-icon-precomposed';
              icon.href = data.icons[j].src;
              icon.setAttribute('sizes', data.icons[j].sizes);
              head.appendChild(icon);
            }
          }
        }
      }
    };
    xhr.send();
  }
})(window,window.document,window.document.head,window.document.body);
