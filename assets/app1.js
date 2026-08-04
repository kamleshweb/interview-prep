(function(){
  // ---------- Theme ----------
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('ip-theme'); } catch(e){}
  if(saved){ root.setAttribute('data-theme', saved); }
  window.toggleTheme = function(){
    var cur = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ip-theme', next); } catch(e){}
    var btn = document.getElementById('theme-label');
    if(btn) btn.textContent = next === 'dark' ? 'Light mode' : 'Dark mode';
  };
  document.addEventListener('DOMContentLoaded', function(){
    var btn = document.getElementById('theme-label');
    if(btn){
      var cur = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      btn.textContent = cur === 'dark' ? 'Light mode' : 'Dark mode';
    }
  });

  // ---------- Mobile sidebar ----------
  function closeSidebar(){
    var sb = document.querySelector('.sidebar');
    if(sb) sb.classList.remove('open');
    var ov = document.getElementById('sidebar-overlay');
    if(ov) ov.classList.remove('visible');
  }
  window.closeSidebar = closeSidebar;
  window.toggleSidebar = function(){
    var sb = document.querySelector('.sidebar');
    if(!sb) return;
    var isOpen = sb.classList.toggle('open');
    var ov = document.getElementById('sidebar-overlay');
    if(ov) ov.classList.toggle('visible', isOpen);
  };
  document.addEventListener('DOMContentLoaded', function(){
    // Backdrop: tap outside the open sidebar to close it
    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebar-overlay';
    overlay.addEventListener('click', closeSidebar);
    document.body.appendChild(overlay);

    // Explicit close (✕) button inside the sidebar itself, since the open
    // sidebar covers the hamburger button that opened it
    var brand = document.querySelector('.sidebar-brand');
    if(brand && !brand.querySelector('.sidebar-close')){
      var closeBtn = document.createElement('button');
      closeBtn.className = 'sidebar-close';
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.textContent = '✕';
      closeBtn.addEventListener('click', closeSidebar);
      brand.appendChild(closeBtn);
    }

    // Closing via Escape key
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeSidebar();
    });
  });

  // ---------- Sidebar search ----------
  document.addEventListener('DOMContentLoaded', function(){
    var box = document.getElementById('search-box');
    if(!box) return;
    box.addEventListener('input', function(){
      var q = box.value.trim().toLowerCase();
      document.querySelectorAll('.nav-link').forEach(function(link){
        var text = link.textContent.toLowerCase();
        var group = link.closest('.nav-group');
        var match = text.indexOf(q) !== -1;
        link.style.display = match ? '' : 'none';
      });
      document.querySelectorAll('.nav-group').forEach(function(group){
        var anyVisible = group.querySelectorAll('.nav-link:not([style*="display: none"])').length > 0;
        group.style.display = anyVisible ? '' : 'none';
      });
    });
  });

  // ---------- Back to top ----------
  document.addEventListener('DOMContentLoaded', function(){
    var b = document.getElementById('back-to-top');
    if(!b) return;
    window.addEventListener('scroll', function(){
      b.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });
    b.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  });

  // ---------- TOC scroll-spy ----------
  document.addEventListener('DOMContentLoaded', function(){
    var tocLinks = document.querySelectorAll('.toc a');
    if(!tocLinks.length) return;
    var headers = Array.prototype.map.call(tocLinks, function(a){
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);
    function onScroll(){
      var pos = window.scrollY + 120;
      var current = headers[0];
      headers.forEach(function(h){ if(h.offsetTop <= pos) current = h; });
      tocLinks.forEach(function(a){ a.classList.remove('active'); });
      if(current){
        var match = document.querySelector('.toc a[href="#' + current.id + '"]');
        if(match) match.classList.add('active');
      }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
  });
})();
