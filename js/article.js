;(function(win,doc,head,body){

  if(!('addEventListener' in win)) return;
  
  win.addEventListener('load',handleLoad,false);
  
  function loadScripts(urls){
    for(var i = 0;i<urls.length;++i){
      var _js  = doc.createElement('script');
      _js.async  = !0;
      _js.src = urls[i];
      head.appendChild(_js);
    }
  }

  function handleLoad(){
    win.removeEventListener('load',handleLoad,false);
    loadScripts(['https://assets.amdouglas.com/js/prism.js']);
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
    }
    */
    win.GoogleAnalyticsObject = win.ga;
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
    xhr.open('GET', 'https://assets.amdouglas.com/manifest.json', true);
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
;(function (doc) {
  var post_id = doc.querySelector('article').id.substring(5).toString();
  var _xhr = new XMLHttpRequest();
  _xhr.open('GET', 'https://www.amdouglas.com/feeds/posts/default', true);
  _xhr.onload = function () {
    var _foot = doc.querySelector('footer');
    var _prev_a = _foot.querySelector('[data-prev]');
    var _next_a = _foot.querySelector('[data-next]');
    var _prev_d, _next_d;
    var _doc = new DOMParser().parseFromString(this.responseText, 'application/xml');
    var _post = [].slice.call(_doc.getElementsByTagName('id')).filter(function(el){
        return !!(el.textContent.toString().indexOf(post_id) > 0);
    }).map(function(nxt){return nxt.parentNode});
    var _prev = _post[0].nextElementSibling.tagName === 'entry' ? _post[0].nextElementSibling : null;
    var _next = _post[0].previousElementSibling.tagName === 'entry' ? _post[0].previousElementSibling : null;
    if (!!_prev) {
     _prev_d = new Date(_prev.querySelector('published').textContent);
     _prev_a.setAttribute('href', _prev.querySelector('link[rel="alternate"]').getAttribute('href'));
      _prev_a.insertAdjacentHTML('afterbegin','<header>Previously</header><section><h4>'+sanitize(_prev.querySelector('title').textContent)+'</h4><p>'+sanitize(_prev.querySelector('summary').textContent)+'</p><hr><p><time datetime="'+_prev_d+'">'+(_prev_d.toDateString().substring(4))+'</time></p></section>');
    } else {
      _prev_a.parentNode.removeChild(_prev_a);
    }
    if (!!_next) {
      _next_d = new Date(_next.querySelector('published').textContent);
      _next_a.setAttribute('href', _next.querySelector('link[rel="alternate"]').getAttribute('href'));
      _next_a.insertAdjacentHTML('afterbegin','<header>Up next</header><section><h4>'+sanitize(_next.querySelector('title').textContent)+'</h4><p>'+sanitize(_next.querySelector('summary').textContent)+'</p><hr><p><time datetime="'+_next_d+'">'+(_next_d.toDateString().substring(4))+'</time></p></section>');
    } else {
      _next_a.parentNode.removeChild(_next_a);
    }
  };
  _xhr.onerror = _xhr.onabort = _xhr.ontimeout = function () {
    _xhr.onload = Function.prototype;
    _xhr.onerror = Function.prototype;
  };
  _xhr.send(null);
  function sanitize(text) {
    return text.split('').map(function(char) {
      return char === '<' ? '&lt;' : char === '>' ? '&gt;' : char
    ;}).join('');
  }
})(document);
