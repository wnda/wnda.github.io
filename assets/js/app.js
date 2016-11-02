;(function(win,doc,head,body){

  if(!('addEventListener' in win)) return;

  var wdth = (win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth);
  var hght = (win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight);
  var head = (doc.head || doc.getElementsByTagName('head')[0]);
  var prev_st = (win.scrollY || win.pageYOffset);
  var animating = false;
  var bg_inners = doc.querySelectorAll('.bg-inner');
  var nav_links = doc.querySelectorAll('nav>a');
  var i = nav_links.length;
  var j = 0;
  
  if('devicePixelRatio' in win && win.devicePixelRatio > 1 && wdth < 992){
    for(var x = 0; x < bg_inners.length; ++x){
      bg_inners[x].style.height = hght + 'px';
    }
  }

  loadStylesheets(['https://amdouglas.com/assets/css/fonts.css']);

  for(;j<i;++j) nav_links[j].addEventListener('click',handleNav,false);
  win.addEventListener('load',handleLoad,false);
  win.addEventListener('scroll',rebouncedScrollHandler,false);
  win.addEventListener('keydown',keyNav,false);

  function loadStylesheets(urls){
    for(var i = 0;i<urls.length;++i){
      var css = doc.createElement('link');
      css.rel = 'stylesheet';
      css.href = urls[i];
      head.appendChild(css);
    }
  }

  function handleLoad(){
    win.removeEventListener('load',handleLoad,false);
    updateNavigation('#home');
    appendJSONLD();
    var a=doc.querySelectorAll('input,textarea');
    for(var j=0;j<a.length;++j){
      a[j].removeAttribute('disabled');
      a[j].addEventListener('blur',function(e){(e.target || this).className='_blur';});
    }
    doc.querySelector('.sms').href='\u0073\u006D\u0073\u003a\u002b\u0034\u0034\u0037\u0039\u0033\u0031\u0035\u0036\u0035\u0038\u0034\u0036';
    if('devicePixelRatio' in win && win.devicePixelRatio > 1 && wdth < 992){
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
    var uas = doc.createElement('script');
    uas.async=!0;
    uas.src='https://www.google-analytics.com/analytics.js';
    body.appendChild(uas);
    win.ga('create','UA-70873652-1','auto');
    win.ga('send','pageview');
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
  
  function appendJSONLD(){
    var s_data = doc.createElement('script');
    s_data.type = 'application/ld+json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://amdouglas.com/data.jsonld', true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status >= 200 && xhr.status < 300){
          s_data.textContent = xhr.responseText;
          body.appendChild(s_data);
        }
      }
    };
    xhr.send();
  }

  function rebounce(f){
    var scheduled, context, args, len, i;
    return function(){
      context = this; args = [];
      len = args.length = arguments.length; i = 0;
      for(;i < len; ++i) args[i] = arguments[i];
      win.cancelAnimationFrame(scheduled);
      scheduled = win.requestAnimationFrame(function(){
        f.apply(context,args); scheduled = null;
      });
    }
  }

  function scrollHandler(){
    var sections = doc.getElementsByTagName('section');
    var s = 5, t = 0;
    var cur_st = (win.scrollY || win.pageYOffset);
    var scroll_dir = cur_st < prev_st ? 'u' : 'd';
    prev_st = cur_st;
    for(; s > t; ++t){
      var this_section = sections[t];
      var this_hash = '#' + this_section.id;
      var this_rect = this_section.getBoundingClientRect();
      switch(scroll_dir){
        case 'u':
          if(this_rect.bottom<(hght/2)&&this_rect.bottom>=0) updateNavigation(this_hash,scroll_dir);
          break;
        case 'd':
          if(this_rect.top<(hght/3)&&this_rect.top>=0) updateNavigation(this_hash,scroll_dir);
          break;
      }
    }
  }

  function updateNavigation(this_hash,scroll_dir){
    if(!animating){
      if(win.location.hash!==this_hash&&'history'in win&&'replaceState'in win.history){
        win.history.replaceState(null,null,this_hash);
      }
      addActiveClass();
    }
  }

  function addActiveClass(){
    var a=doc.getElementsByTagName('a');
    for(var i=0;i<a.length;++i){
      var c=a[i].hash;
      win.location.hash===c?a[i].classList.add('active'):a[i].classList.remove('active');
    }
  }

  function rebouncedScrollHandler(){
    return rebounce(scrollHandler());
  }

  function getPos(_t,_st,_f,_sf){
    if(_sf>_t) return _f;
    var d=(_sf/_t);
    return _st + (_f - _st) * (d<.5?4*d*d*d:(d-1)*(2*d-2)*(2*d-2)+1);
  }

  function getTime(){
    return ('performance'in win)?win.performance.now():new Date().getTime();
  }

  function smoothScroll(el){
    var _t = 400,
        _st = win.scrollY||win.pageYOffset,
        _f = (el.tagName.toLowerCase()!=='html')?el.getBoundingClientRect().top+_st:-_st,
        _ct = getTime(),
        step = function(){
          var _sf = getTime()-_ct;
          win.scroll(0,getPos(_t,_st,_f,_sf));
          if(_sf>_t){
            if(win.location.hash!==('#'+el.id)){
              win.location.replace('#'+el.id);
            }
          win.requestAnimationFrame(function(){
            animating = false;
            addActiveClass();
          });
          }else{
            win.requestAnimationFrame(step);
          }
        }
    animating = true;
    step();
  }

  function keyNav(e){
    if(!!animating || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;
    var el = doc.getElementById(win.location.hash.substr(1));
    if(e.key){
      switch(e.key){
        case "ArrowDown":
          typeof e !== 'undefined' && e.preventDefault();
          if(el.nextElementSibling.tagName.toLowerCase()==='section')
            smoothScroll(el.nextElementSibling);
          break;
        case "ArrowUp":
          typeof e !== 'undefined' && e.preventDefault();
          if(el.previousElementSibling.tagName.toLowerCase()==='section')
            smoothScroll(el.previousElementSibling);
          break;
        default:
          return;
      }
    } else if(e.which){
      switch(e.which){
        case 40:
          typeof e !== 'undefined' && e.preventDefault();
          if(el.nextElementSibling.tagName.toLowerCase()==='section')
            smoothScroll(el.nextElementSibling);
          break;
        case 38:
          typeof e !== 'undefined' && e.preventDefault();
          if(el.previousElementSibling.tagName.toLowerCase()==='section')
            smoothScroll(el.previousElementSibling);
          break;
        default:
          return;
      }
    }
  }

  function handleNav(e){
    typeof e !== 'undefined' && e.preventDefault();
    var evt = (e.target || this),
        node = doc.getElementById(evt.hash.substring(1));
    if(!node) return;
    smoothScroll(node);
  }

})(window,window.document,window.document.head,window.document.body);
