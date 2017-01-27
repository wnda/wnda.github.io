;(function(win,doc,head,body){
  'use strict';
  var wdth = (win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth);
  var hght = (win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight);
  var head = (doc.head || doc.getElementsByTagName('head')[0]);
  var body = (doc.body || doc.getElementsByTagName('body')[0]);
  var prev_st = (win.scrollY || win.pageYOffset || win.Math.abs(doc.querySelector('section').getBoundingClientRect().top));
  var animating = false;
  var mbl = ('devicePixelRatio' in win && win.devicePixelRatio > 1 && wdth < 992);
  var nav_links = doc.querySelectorAll('nav>a');
  var i = nav_links.length;
  var j = 0;
  
  if(!('addEventListener' in win)) { return; }
  loadStylesheets(['https://amdouglas.com/assets/css/fonts.css','https://amdouglas.com/assets/css/svgbg.css']);

  for (; j < i; ++j) { nav_links[j].addEventListener('click', handleNav, false); }
  win.addEventListener('DOMContentLoaded', handleLoad, false);

  function loadStylesheets (urls) {
    var css;
    var i = 0;
    for(; i < urls.length; ++i) {
      css = doc.createElement('link');
      css.rel = 'stylesheet';
      css.href = urls[i];
      head.appendChild(css);
      css = null;
    }
  }

  function handleLoad () {
    var uas = doc.createElement('script');
    var a = doc.querySelectorAll('input,textarea');
    var j = 0;
    
    updateNavigation('#home');
    appendJSONLD();
    win.removeEventListener('DOMContentLoaded', handleLoad, false);
    
    for (;j < a.length; ++j){
      a[j].removeAttribute('disabled');
      a[j].addEventListener('blur', function (e) { (e.target || this).className='_blur'; });
    }
    
    doc.querySelector('.sms').href = '\u0073\u006D\u0073\u003a\u002b\u0034\u0034\u0037\u0039\u0033\u0031\u0035\u0036\u0035\u0038\u0034\u0036';
    
    if (!!mbl) {
      doc.documentElement.style.overflow = 'hidden';
      doc.body.style.overflow = 'auto';
      doc.body.style.webkitOverflowScrolling = 'touch';
      body.addEventListener('scroll', rebouncedScrollHandler, false);
      appendTouchIcons();
    } else {
      win.addEventListener('scroll', rebouncedScrollHandler, false);
      win.addEventListener('keydown', keyNav, false);
    }
    
    if ('serviceWorker' in win.navigator) {
      win.navigator.serviceWorker.register('https://amdouglas.com/sw.js', {
        scope: '/'
      }).then(function (registration) {
        win.console.info("SW registered [" + registration.scope + "]");
      }).catch(function (err) {
        win.console.warn("SW failed to register [" + err + "]");
      });
    }
    win.GoogleAnalyticsObject = win.ga;
    win.ga = win.ga || function () {
      for (var p = 0; p < arguments.length; ++p) {
        (win.ga.q = win.ga.q || []).push(arguments[p]);
      }
    };
    win.ga.l = 1 * new win.Date();
    uas.async = !0;
    uas.src = 'https://www.google-analytics.com/analytics.js';
    body.appendChild(uas);
    win.ga('create','UA-70873652-1','auto');
    win.ga('send','pageview');
  }

  function appendTouchIcons () {
    var xhr = new win.XMLHttpRequest();
    xhr.open('GET', 'https://amdouglas.com/manifest.json', true);
    xhr.onreadystatechange = function () {
      var icons = null;
      var icon = null;
      var j = 0;
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          icons = (win.JSON.parse(xhr.responseText)).icons;
          for(; j < icons.length; ++j) {
            if (icons[j].src.indexOf('apple') > -1) {
              icon = doc.createElement('link');
              icon.rel = 'apple-touch-icon-precomposed';
              icon.href = icons[j].src;
              icon.setAttribute('sizes', icons[j].sizes);
              head.appendChild(icon);
              icon = null;
            }
          }
        }
      }
    };
    xhr.send(null);
  }
  
  function appendJSONLD () {
    var xhr = new win.XMLHttpRequest();
    var s_data = doc.createElement('script');
    s_data.type = 'application/ld+json';
    xhr.open('GET', 'https://amdouglas.com/data.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          s_data.textContent = xhr.responseText;
          body.appendChild(s_data);
        }
      }
    };
    xhr.send(null);
  }

  function rebounce (f) {
    var scheduled, context, args, len, i;
    return function () {
      context = this; args = [];
      len = args.length = arguments.length; i = 0;
      for(;i < len; ++i) args[i] = arguments[i];
      if (!!scheduled) win.cancelAnimationFrame(scheduled);
      scheduled = win.requestAnimationFrame(function(){
        f.apply(context,args); scheduled = null;
      });
    }
  }

  function scrollHandler () { 
    var sections = doc.getElementsByTagName('section');
    var s = 5; 
    var t = 0;
    var cur_st = (win.scrollY || win.pageYOffset || win.Math.abs(doc.querySelector('section').getBoundingClientRect().top
));
    var scroll_dir = cur_st < prev_st ? 'u' : 'd';
    var this_section; 
    var this_hash;  
    var this_rect;    
    prev_st = cur_st;
    for (; s > t; ++t) {
      this_section = sections[t];
      this_hash = '#' + this_section.id;
      this_rect = this_section.getBoundingClientRect();
      switch (scroll_dir) {
        case 'u':
          if (this_rect.bottom < (hght/2) && this_rect.bottom >= 0) updateNavigation(this_hash, scroll_dir);
          break;
        case 'd':
          if (this_rect.top < (hght/3) && this_rect.top >= 0) updateNavigation(this_hash, scroll_dir);
          break;
      }
    }
  }

  function updateNavigation (this_hash, scroll_dir) {
    if (!animating) {
      if (win.location.hash !== this_hash && 'history' in win && 'replaceState' in win.history) {
        win.history.replaceState(null,null,this_hash);
      }
      addActiveClass();
    }
  }

  function addActiveClass () {
    var a = doc.getElementsByTagName('a');
    var i = 0;
    var c = '';
    for (; i < a.length; ++i) {
      win.location.hash === a[i].hash ? 
        a[i].classList.add('active') : 
          a[i].classList.remove('active');
    }
  }

  function rebouncedScrollHandler () {
    return rebounce(scrollHandler());
  }

  function getPos (_t,_st,_f,_sf) {
    var d;
    if (_sf>_t) 
      return _f;
    d = (_sf/_t);
    return _st + (_f - _st) * (d<.5?4*d*d*d:(d-1)*(2*d-2)*(2*d-2)+1);
  }

  function getTime () {
    return ('performance' in win) ? win.performance.now() : new win.Date().getTime();
  }

  function smoothScroll (el) {
    var _t = 400,
        _st = (win.scrollY || win.pageYOffset || win.Math.abs(doc.querySelector('section').getBoundingClientRect().top
)),
        _f = (el.tagName.toLowerCase()!=='html')?el.getBoundingClientRect().top+_st:-_st,
        _ct = getTime(),
        step = function () {
          var _sf = getTime()-_ct;
          if (!!mbl) {
            doc.body.scrollTop = getPos(_t,_st,_f,_sf);
          } else {
            win.scroll(0,getPos(_t,_st,_f,_sf));
          }
          if (_sf>_t) {
            if (win.location.hash !== ('#'+el.id)) {
              win.location.replace('#'+el.id);
            }
            win.requestAnimationFrame(function () {
              animating = false;
              addActiveClass();
            });
          }
          else{
            win.requestAnimationFrame(step);
          }
        }
    animating = true;
    step();
  }

  function keyNav (e) {
    if(!!animating || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;
    var el = doc.getElementById(win.location.hash.substr(1));
    if (e.key) {
      switch (e.key) {
        case "ArrowDown":
          typeof e !== 'undefined' && e.preventDefault();
          if (el.nextElementSibling.tagName.toLowerCase() === 'section')
            smoothScroll(el.nextElementSibling);
          break;
        case "ArrowUp":
          typeof e !== 'undefined' && e.preventDefault();
          if (el.previousElementSibling.tagName.toLowerCase() === 'section')
            smoothScroll(el.previousElementSibling);
          break;
        default:
          return;
      }
    } else if (e.which) {
      switch (e.which) {
        case 40:
          typeof e !== 'undefined' && e.preventDefault();
          if (el.nextElementSibling.tagName.toLowerCase() === 'section')
            smoothScroll(el.nextElementSibling);
          break;
        case 38:
          typeof e !== 'undefined' && e.preventDefault();
          if (el.previousElementSibling.tagName.toLowerCase() === 'section')
            smoothScroll(el.previousElementSibling);
          break;
        default:
          return;
      }
    }
  }

  function handleNav (e) {
    typeof e !== 'undefined' && e.preventDefault();
    var evt = (e.target || this);
    var node = doc.getElementById(evt.hash.substring(1));
    if (!node) 
      return;
    smoothScroll(node);
  }

})(window, window.document, window.document.head, window.document.body);
