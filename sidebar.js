(function(){
  var dark=localStorage.getItem('sw_dark')==='1';
  var jp=localStorage.getItem('sw_jp')==='1';
  var BASE=window.SW_BASE||'';

  var NAV=[
    {icon:'ti-home',        href:BASE+'index.html',    en:'home',    ja:'ホーム',       page:'index'},
    {icon:'ti-layout-grid', href:BASE+'projects.html', en:'works',   ja:'制作実績',     page:'works'},
    {icon:'ti-brush',       href:BASE+'art.html',      en:'art',     ja:'イラスト',     page:'art'},
    {icon:'ti-user',        href:BASE+'about.html',    en:'about',   ja:'自己紹介',     page:'about'},
    {icon:'ti-mail',        href:BASE+'contact.html',  en:'contact', ja:'お問い合わせ', page:'contact'}
  ];

  var PAGE=document.body.getAttribute('data-page')||'';

  function navItems(lblCls){
    return NAV.map(function(item){
      var active=item.page===PAGE;
      var cls='sb-item'+(active?' active':'');
      var onclick=active?'':' onclick="location.href=\''+item.href+'\'"';
      return '<div class="'+cls+'"'+onclick+'>'
        +'<i class="ti '+item.icon+'"></i>'
        +'<span class="'+lblCls+'">'+item.en+'</span>'
        +'</div>';
    }).join('');
  }

  function buildMobDrawer(){
    return '<div class="sb-top">'
      +'<div class="sb-item" onclick="closeMobDrawer()" style="margin-bottom:2px">'
      +'<i class="ti ti-menu-2"></i>'
      +'<span class="sb-label" style="font-size:11px;color:#9E9B95">close</span>'
      +'</div>'
      +'<div class="sb-divider"></div>'
      +navItems('sb-label mob-nav-lbl')
      +'</div>'
      +'<div class="sb-bottom">'
      +'<div class="sb-divider"></div>'
      +'<div class="sb-item" onclick="toggleDark()">'
      +'<i class="ti ti-moon" id="dark-icon-mob"></i>'
      +'<span class="sb-label" id="dark-label-mob">dark mode</span>'
      +'</div>'
      +'<div class="sb-item" onclick="toggleLang()">'
      +'<i class="ti ti-language"></i>'
      +'<span class="sb-label" id="lang-label-mob">日本語</span>'
      +'</div>'
      +'</div>';
  }

  function buildDesktopSidebar(){
    return '<div class="sb-top">'
      +'<div class="sb-item" onclick="toggleSidebar()" style="margin-bottom:2px">'
      +'<i class="ti ti-menu-2"></i>'
      +'<span class="sb-label" style="font-size:11px;color:#9E9B95">close</span>'
      +'</div>'
      +'<div class="sb-divider"></div>'
      +navItems('sb-label desk-nav-lbl')
      +'</div>'
      +'<div class="sb-bottom">'
      +'<div class="sb-divider"></div>'
      +'<div class="sb-item" onclick="toggleDark()">'
      +'<i class="ti ti-moon" id="dark-icon"></i>'
      +'<span class="sb-label" id="dark-label">dark mode</span>'
      +'</div>'
      +'<div class="sb-item" onclick="toggleLang()">'
      +'<i class="ti ti-language"></i>'
      +'<span class="sb-label" id="lang-label">日本語</span>'
      +'</div>'
      +'</div>';
  }

  function applyDarkUI(){
    var icon=dark?'ti ti-sun':'ti ti-moon';
    var lbl=dark
      ?(jp?'ライトモード':'light mode')
      :(jp?'ダークモード':'dark mode');
    document.getElementById('dark-icon').className=icon;
    document.getElementById('dark-label').textContent=lbl;
    document.getElementById('dark-icon-mob').className=icon;
    document.getElementById('dark-label-mob').textContent=lbl;
  }

  function applyLangUI(){
    var labels=NAV.map(function(n){return jp?n.ja:n.en;});
    document.querySelectorAll('.desk-nav-lbl').forEach(function(n,i){n.textContent=labels[i];});
    document.querySelectorAll('.mob-nav-lbl').forEach(function(n,i){n.textContent=labels[i];});
    document.getElementById('lang-label').textContent=jp?'english':'日本語';
    document.getElementById('lang-label-mob').textContent=jp?'english':'日本語';
    applyDarkUI();
  }

  function inject(){
    var mock=document.querySelector('.mock');

    var btn=document.createElement('div');
    btn.className='mob-menu-btn';
    btn.innerHTML='<i class="ti ti-menu-2"></i>';
    btn.onclick=openMobDrawer;
    document.body.insertBefore(btn,mock);

    var ov=document.createElement('div');
    ov.className='mob-overlay';
    ov.id='mob-overlay';
    ov.onclick=closeMobDrawer;
    document.body.insertBefore(ov,mock);

    var dr=document.createElement('div');
    dr.className='mob-drawer';
    dr.id='mob-drawer';
    dr.innerHTML=buildMobDrawer();
    document.body.insertBefore(dr,mock);

    var sb=document.createElement('div');
    sb.className='sidebar';
    sb.id='sidebar';
    sb.innerHTML=buildDesktopSidebar();
    mock.insertBefore(sb,mock.querySelector('.main'));

    applyDarkUI();
    applyLangUI();
    // onToggleLangContent is defined in the page's inline script which runs after
    // this file, so defer one tick to let it register before calling it.
    // Also remove jp-loading here to reveal content once translations are applied.
    setTimeout(function(){
      if(jp&&typeof window.onToggleLangContent==='function') window.onToggleLangContent(true);
      document.body.classList.remove('jp-loading');
    },0);
  }

  function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');}

  function openMobDrawer(){
    document.getElementById('mob-drawer').classList.add('open');
    document.getElementById('mob-overlay').classList.add('visible');
    document.querySelector('.mob-menu-btn').style.zIndex='140';
  }

  function closeMobDrawer(){
    document.getElementById('mob-drawer').classList.remove('open');
    document.getElementById('mob-overlay').classList.remove('visible');
    document.querySelector('.mob-menu-btn').style.zIndex='200';
  }

  function toggleDark(){
    dark=!dark;
    localStorage.setItem('sw_dark',dark?'1':'0');
    document.body.classList.toggle('dark',dark);
    applyDarkUI();
  }

  function toggleLang(){
    jp=!jp;
    localStorage.setItem('sw_jp',jp?'1':'0');
    document.body.dataset.jp=jp?'1':'';
    applyLangUI();
    if(typeof window.onToggleLangContent==='function') window.onToggleLangContent(jp);
  }

  window.toggleSidebar=toggleSidebar;
  window.openMobDrawer=openMobDrawer;
  window.closeMobDrawer=closeMobDrawer;
  window.toggleDark=toggleDark;
  window.toggleLang=toggleLang;

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',inject);
  } else {
    inject();
  }
})();
