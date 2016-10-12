;(function(win,doc,head,body){

  if(!('addEventListener' in win)) return;

  win.addEventListener('DOMContentLoaded',handleLoad,false);
  
  function loadStylesheets(urls){
    for(var i = 0;i<urls.length;++i){
      var css  = doc.createElement('link');
      css.rel  = 'stylesheet';
      css.href = urls[i];
      head.appendChild(css);
    }
  }
  
  function loadScripts(urls){
    for(var i = 0;i<urls.length;++i){
      var js = doc.createElement('script');
      js.async = !0;
      js.src = urls[i];
      head.appendChild(js);
    }
  }
  
  function handleLoad(){
    win.removeEventListener('DOMContentLoaded',handleLoad,false);
    
    loadScripts(['https://api.github.com/users/wnda/repos?callback=z','https://www.google-analytics.com/analytics.js']);
    
    if('devicePixelRatio' in win && win.devicePixelRatio > 1 && wdth < 992){
      appendOptionalMetaTags();
      appendTouchIcons();
    }
    
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('https://amdouglas.com/sw.js', {
        scope: '/'
      }).then(function(registration){
        console.info("SW registered [" + registration.scope + "]");
      }).catch(function(err){
        console.warn("SW failed to register [" + err + "]");
      });
    }
    
    win.GoogleAnalyticsObject = win.ga;
    win.ga = win.ga || function(){
      for(var p = 0; p < arguments.length; ++p){
        (win.ga.q = win.ga.q || []).push(arguments[p]);
      }
    };
    
    win.ga.l = 1 * new Date();
    win.ga('create','UA-70873652-1','auto');
    win.ga('send','pageview');
  }

  function z(a){
    var x=a.data.length,
        b=0,
        c=doc.getElementById("repos");
    c.removeAttribute("hidden");
    for(;x>b;b++){
      var e=doc.createElement("div"),
          f=a.data[b].homepage?a.data[b].homepage:a.data[b].html_url;
      e.className=(b%6===0?'cell cell-sm-12 cell-md-4 cell-lg-3 repo block':(b%5===0?'cell cell-sm-12 cell-md-6 cell-lg-7 block repo':'cell cell-sm-12 cell-md-6 cell-lg-5 block repo'));
      e.style.animationDelay=(Math.floor(Math.random()*500)+300)+"ms";
      e.innerHTML='<a href="'+f+'" title="'+a.data[b].name+'"><h4>'+a.data[b].name+'</h4>'+'<small class="desc">'+a.data[b].description+'</small>'+'<small class="tags">'+a.data[b].language+'</small>'+'</a>';
      c.appendChild(e);
    }
  }
  
  function appendTouchIcons(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://amdouglas.com/manifest.json', true);
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

  function appendOptionalMetaTags(){
    var metatags = ['format-detection','apple-mobile-web-app-status-bar-style','apple-touch-fullscreen','apple-mobile-web-app-capable','mobile-web-app-capable','application-name','MobileOptimized','HandheldFriendly'];
    var metacontents = ['telephone=no,email=no','black-translucent','yes','yes','yes','A. M. Douglas','width','true'];
    var mtl = 8;
    while(mtl--){
      var metatag = doc.createElement('meta');
      metatag.name = metatags[mtl];
      metatag.content = metacontents[mtl];
      head.appendChild(metatag);
    }
  }
  

})(window,window.document,window.document.head,window.document.body);
