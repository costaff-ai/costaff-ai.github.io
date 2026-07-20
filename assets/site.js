/* CoStaff — shared site chrome injector (single source of truth).
   Fills <div id="cs-header"> with the banner + mega-menu nav, and (when present)
   <div id="cs-footer"> with the footer. Language (en / zhtw) and the active nav
   section are auto-detected from location.pathname — pages need no config, just the
   two placeholder divs plus a link to /assets/site.css and this script. */
(function () {
  'use strict';

  var path = location.pathname;
  var isZh = /^\/zhtw(\/|$)/.test(path);
  var B = isZh ? '/zhtw' : '';                 // language path prefix
  var HOME = B || '/';
  var MOBILE = '(max-width: 720px)';

  // active top-level section
  var active = '';
  if (/\/blog(\/|$)/.test(path)) active = 'blog';
  else if (/\/pricing(\/|$)/.test(path)) active = 'pricing';
  else if (/\/partners(\/|$)/.test(path)) active = 'partners';
  else if (/\/docs(\/|$)/.test(path)) active = 'docs';
  else if (/\/(architecture|user-flow|brand)(\/|$)/.test(path)) active = 'resources';
  else if (/\/(manager|agents|channels|platforms|identity)(\/|$)/.test(path)) active = 'product';

  // language toggle → same page in the other language
  var langHref, langLabel;
  if (isZh) { langHref = path.replace(/^\/zhtw/, '') || '/'; langLabel = 'EN'; }
  else { langHref = '/zhtw' + (path === '/' ? '/' : path); langLabel = '繁中'; }

  var WAITLIST = 'https://forms.gle/9UVdi527sYUBuqcm6';
  var GH = 'https://github.com/costaff-ai/costaff';
  var MAIL = 'mailto:simonliuyuwei@gmail.com';
  var TWINKLE = 'https://twinkleai.tw/';
  var ADK = 'https://adk.dev';
  var A2A = 'https://a2a-protocol.org/latest/';

  var T = isZh ? {
    product: '產品', resources: '資源', docs: '文件', pricing: '方案', blog: '部落格',
    partners: '合作夥伴', home: '首頁', contact: '聯絡我們', cta: '搶先預約', soon: '敬請期待',
    bannerLabel: '🎉 已開源 · v0.1.0-beta-3',
    bannerSub: '— 加入候補名單，正式版上線第一時間通知',
    bannerCta: '加入候補 →',
    // group headers
    managerHead: 'CoStaff Manager 員工', expertHead: 'CoStaff Expert 員工', identityHead: 'CoStaff Identity',
    clientHead: 'CoStaff Client', platformHead: 'CoStaff App 應用平台',
    archHead: '運作原理', getStartedHead: '快速上手', thirdHead: '第三方資源', brandHead: '品牌',
    communityHead: '社群夥伴', enterpriseHead: '企業夥伴',
    // items [title, description]
    manager: ['CoStaff Manager', '統籌調度的核心，你直接對話的對象'],
    aiStaff: ['CoStaff AI 員工', 'AI Agent 員工列表'],
    identity: ['CoStaff Identity', '統一身分與單一登入 (SSO)'],
    channels: ['通訊軟體', '在既有的聊天工具中直接交辦'],
    webchatOss: ['CoStaff WebChat OSS', '開源版網頁聊天'],
    webchatEnt: ['CoStaff WebChat Enterprise', '企業版網頁聊天'],
    platform: ['CoStaff 企業應用平台', '企業業務系統'],
    quickstart: ['快速開始', '透過 CLI 指令快速建立 AI 員工團隊'],
    install: ['安裝部署', '在自己的機器上架設 CoStaff'],
    cli: ['CLI 指令', '用終端機管理一切'],
    arch: ['技術架構', '六層架構，各自獨立可替換'],
    flow: ['應用架構', '一次交辦的完整流程'],
    brand: ['品牌規範', 'Logo 下載與使用規則'],
    adk: ['ADK', '打造 Agent 的開源框架（Google）'],
    a2a: ['A2A Protocol', 'Agent 之間互通的開放協定'],
    twinkle: ['Twinkle AI', '開源 AI 社群夥伴'],
    entPartner: ['企業合作夥伴', '洽談企業合作'],
    communityItem: ['社群夥伴', '與我們共建開放生態的社群'],
    enterpriseItem: ['企業夥伴', '在 CoStaff 上開發、整合或部署']
  } : {
    product: 'Product', resources: 'Resources', docs: 'Docs', pricing: 'Plans', blog: 'Blog',
    partners: 'Partners', home: 'Home', contact: 'Contact', cta: 'Get early access', soon: 'Coming soon',
    bannerLabel: '🎉 Now open source · v0.1.0-beta-3',
    bannerSub: '— Join the waitlist for GA notifications',
    bannerCta: 'Join waitlist →',
    managerHead: 'CoStaff Manager', expertHead: 'CoStaff Experts', identityHead: 'CoStaff Identity',
    clientHead: 'CoStaff Client', platformHead: 'CoStaff Apps',
    archHead: 'Under the hood', getStartedHead: 'Get started', thirdHead: 'Third-party', brandHead: 'Brand',
    communityHead: 'Community', enterpriseHead: 'Enterprise',
    manager: ['CoStaff Manager', 'The orchestrating core — the one you chat with'],
    aiStaff: ['CoStaff AI Staff', 'Directory of AI agents'],
    identity: ['CoStaff Identity', 'Unified identity & single sign-on'],
    channels: ['Channels', 'Hand off from the chat apps your team already uses'],
    webchatOss: ['CoStaff WebChat OSS', 'Open-source web chat'],
    webchatEnt: ['CoStaff WebChat Enterprise', 'Enterprise web chat runtime'],
    platform: ['CoStaff Platforms', 'Ten business systems'],
    quickstart: ['Quickstart', 'Three commands to a working AI staff'],
    install: ['Install', 'Set up CoStaff on your own machine'],
    cli: ['CLI reference', 'Manage everything from the terminal'],
    arch: ['System architecture', 'Six layers, independently replaceable'],
    flow: ['User flow', 'One hand-off, end to end'],
    brand: ['Brand guidelines', 'Logo downloads and usage rules'],
    adk: ['ADK', "Google's open framework for building agents"],
    a2a: ['A2A Protocol', 'Open protocol for agent-to-agent interop'],
    twinkle: ['Twinkle AI', 'Open-source AI community partner'],
    entPartner: ['Enterprise partners', "Let's collaborate"],
    communityItem: ['Community partners', 'Open-source communities we build with'],
    enterpriseItem: ['Enterprise partners', 'Build on, integrate, or deploy']
  };

  var caret = '<svg class="csnav-caret" width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ghIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>';

  function link(href, pair, ext) {
    var attrs = ext ? ' target="_blank" rel="noopener"' : '';
    return '<a href="' + href + '"' + attrs + '><strong>' + pair[0] + '</strong><span>' + pair[1] + '</span></a>';
  }
  function soon(pair) {
    return '<span class="csnav-soon"><strong>' + pair[0] + '</strong><span>' + pair[1] + '</span></span>';
  }
  function group(head, items) { return '<div class="csnav-group"><div class="csnav-head">' + head + '</div>' + items + '</div>'; }
  function col(groups) { return '<div class="csnav-col">' + groups + '</div>'; }
  function activeItem(on) { return on ? ' is-active' : ''; }
  function activeLink(on) { return on ? ' class="is-active"' : ''; }

  // Dropdown menus
  var productDD =
    '<div class="csnav-dd csnav-dd--mega csnav-dd--3">' +
      col(
        group(T.managerHead, link(B + '/manager/', T.manager)) +
        group(T.expertHead, link(B + '/agents/', T.aiStaff))
      ) +
      col(
        group(T.clientHead,
          link(B + '/channels/', T.channels) +
          link(B + '/channels/webchat/', T.webchatOss) +
          link(B + '/channels/webchat-enterprise/', T.webchatEnt))
      ) +
      col(
        group(T.identityHead, link(B + '/identity/', T.identity)) +
        group(T.platformHead, link(B + '/platforms/', T.platform))
      ) +
    '</div>';

  var resourcesDD =
    '<div class="csnav-dd csnav-dd--mega csnav-dd--3">' +
      col(group(T.archHead, link(B + '/architecture/', T.arch) + link(B + '/user-flow/', T.flow))) +
      col(group(T.getStartedHead, link(B + '/docs/start/', T.quickstart) + link(B + '/docs/install/', T.install) + link(B + '/docs/cli/', T.cli))) +
      col(group(T.thirdHead, link(ADK, T.adk, true) + link(A2A, T.a2a, true)) +
          group(T.brandHead, link(B + '/brand/', T.brand))) +
    '</div>';

  var partnersDD =
    '<div class="csnav-dd csnav-dd--mega csnav-dd--2">' +
      col(link(B + '/partners/community/', T.communityItem)) +
      col(link(B + '/partners/enterprise/', T.enterpriseItem)) +
    '</div>';

  function ddItem(label, activeOn, dd) {
    return '<div class="csnav-item' + activeItem(activeOn) + '">' +
      '<button class="csnav-ddbtn" aria-expanded="false" aria-haspopup="true">' + label + caret + '</button>' +
      dd + '</div>';
  }

  var headerHTML =
    '<div class="cs-banner">' +
      '<span class="cs-label">' + T.bannerLabel + '</span>' +
      '<span class="cs-sub">' + T.bannerSub + '</span>' +
      '<a href="' + WAITLIST + '" target="_blank" rel="noopener">' + T.bannerCta + '</a>' +
    '</div>' +
    '<nav class="csnav">' +
      '<a class="csnav-logo" href="' + HOME + '">' +
        '<img class="csnav-mark" src="/images/logo/mark.svg" alt="" width="22" height="22" />' +
        'Co<span>Staff</span></a>' +
      '<div class="csnav-links" id="cs-primary-nav">' +
        '<a class="csnav-home" href="' + HOME + '">' + T.home + '</a>' +
        ddItem(T.product, active === 'product', productDD) +
        ddItem(T.resources, active === 'resources', resourcesDD) +
        '<a href="' + B + '/pricing/"' + activeLink(active === 'pricing') + '>' + T.pricing + '</a>' +
        '<a href="' + B + '/blog/"' + activeLink(active === 'blog') + '>' + T.blog + '</a>' +
        ddItem(T.partners, active === 'partners', partnersDD) +
        '<a href="' + B + '/docs/"' + activeLink(active === 'docs') + '>' + T.docs + '</a>' +
      '</div>' +
      '<div class="csnav-right">' +
        '<a class="csnav-lang" href="' + langHref + '">' + langLabel + '</a>' +
        '<a class="csnav-gh" href="' + GH + '" target="_blank" rel="noopener">' + ghIcon + 'GitHub</a>' +
        '<a class="csnav-cta" href="' + WAITLIST + '" target="_blank" rel="noopener">' + T.cta + '</a>' +
        '<button class="csnav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="cs-primary-nav">' +
          '<span class="csnav-bar"></span><span class="csnav-bar"></span><span class="csnav-bar"></span>' +
        '</button>' +
      '</div>' +
    '</nav>';

  var footerHTML =
    '<footer class="csfoot">' +
      '<div class="csfoot-inner">' +
        '<div class="csfoot-logo">' +
          '<img class="csfoot-mark" src="/images/logo/mark.svg" alt="" width="20" height="20" />' +
          'Co<span>Staff</span></div>' +
        '<div class="csfoot-text">© 2026 CoStaffAI</div>' +
        '<div class="csfoot-links">' +
          '<a href="' + GH + '" target="_blank" rel="noopener">GitHub</a>' +
          '<a href="' + WAITLIST + '" target="_blank" rel="noopener">' + T.cta + '</a>' +
          '<a href="' + B + '/brand/">' + T.brand[0] + '</a>' +
          '<a href="' + MAIL + '">' + T.contact + '</a>' +
        '</div>' +
      '</div>' +
    '</footer>';

  function wire() {
    var isMobile = function () { return window.matchMedia(MOBILE).matches; };

    // hamburger
    var toggle = document.querySelector('.csnav-toggle');
    var menu = document.getElementById('cs-primary-nav');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // dropdowns (hover on desktop, click/tap fallback; inert on mobile menu)
    var items = document.querySelectorAll('.csnav-item');
    if (!items.length) return;
    var closeAll = function () {
      items.forEach(function (it) {
        it.classList.remove('is-open');
        var b = it.querySelector('.csnav-ddbtn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    };
    var hideTimer;
    items.forEach(function (item) {
      var btn = item.querySelector('.csnav-ddbtn');
      var open = function () {
        clearTimeout(hideTimer);
        closeAll();
        item.classList.add('is-open');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      };
      if (window.matchMedia('(hover: hover)').matches) {
        item.addEventListener('mouseenter', function () { if (isMobile()) return; clearTimeout(hideTimer); open(); });
        item.addEventListener('mouseleave', function () { hideTimer = setTimeout(closeAll, 180); });
      }
      if (btn) btn.addEventListener('click', function (e) {
        if (isMobile()) return;
        e.preventDefault();
        item.classList.contains('is-open') ? closeAll() : open();
      });
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.csnav-item')) closeAll(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  }

  function mount() {
    var h = document.getElementById('cs-header');
    if (h) h.innerHTML = headerHTML;
    var f = document.getElementById('cs-footer');
    if (f) f.innerHTML = footerHTML;
    if (h) wire();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
