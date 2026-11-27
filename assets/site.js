/* CoStaff Workspace — shared site chrome (single source of truth).
   Fills <div id="cs-header"> with the notice banner + nav, and (when present)
   <div id="cs-footer"> with the footer. Language (en / zhtw) comes from the path,
   so every page, including the archived CoStaff pages, gets the same chrome and
   the same notice that CoStaff is being archived. */
(function () {
  'use strict';

  var path = location.pathname;
  var isZh = /^\/zhtw(\/|$)/.test(path);
  var HOME = isZh ? '/zhtw/' : '/';
  var MOBILE = '(max-width: 720px)';

  // language toggle: the same page in the other language
  var langHref = isZh ? path.replace(/^\/zhtw/, '') || '/' : '/zhtw' + (path === '/' ? '/' : path);
  var langLabel = isZh ? 'EN' : '繁中';

  var GH = 'https://github.com/costaff-ai';

  var T = isZh
    ? {
        bannerLabel: '公告',
        bannerSub: 'CoStaff Agent 平台將於 2026 年 11 月 30 日封存',
        bannerCta: '了解更多 →',
        plugin: 'Workspace',
        openx: '生產力工具',
        notice: '封存公告',
        cta: '免費安裝',
        brand: '品牌規範',
        menu: '開啟選單',
        footText: '© 2026 CoStaff · 讓人和 Agent 一起工作',
      }
    : {
        bannerLabel: 'Notice',
        bannerSub: 'The CoStaff Agent platform will be archived on November 30, 2026',
        bannerCta: 'Learn more →',
        plugin: 'Workspace',
        openx: 'Tools',
        notice: 'Archive notice',
        cta: 'Install free',
        brand: 'Brand guidelines',
        menu: 'Toggle menu',
        footText: '© 2026 CoStaff · People and agents, working on the same files',
      };

  var header = document.getElementById('cs-header');
  if (header) {
    header.innerHTML =
      '<div class="cs-banner" role="note">' +
      '<span class="cs-label">' + T.bannerLabel + '</span>' +
      '<span class="cs-sub">' + T.bannerSub + '</span>' +
      '<a href="' + HOME + 'notice/">' + T.bannerCta + '</a>' +
      '</div>' +
      '<nav class="csnav" aria-label="Primary">' +
      '<a class="csnav-logo" href="' + HOME + '">' +
      '<img class="csnav-mark" src="/images/logo/mark.svg" alt="" width="22" height="22" />' +
      'CoStaff <span>Workspace</span></a>' +
      '<div class="csnav-links" id="cs-primary-nav">' +
      '<a href="' + HOME + 'plugin/">' + T.plugin + '</a>' +
      '<a href="' + HOME + 'toolsets/">' + T.openx + '</a>' +
      '</div>' +
      '<div class="csnav-right">' +
      '<a class="csnav-lang" href="' + langHref + '">' + langLabel + '</a>' +
      '<a class="csnav-gh" href="' + GH + '" target="_blank" rel="noopener">GitHub</a>' +
      '<a class="csnav-cta" href="' + HOME + 'plugin/">' + T.cta + '</a>' +
      '<button class="csnav-toggle" aria-label="' + T.menu + '" aria-expanded="false" aria-controls="cs-primary-nav">' +
      '<span class="csnav-bar"></span><span class="csnav-bar"></span><span class="csnav-bar"></span>' +
      '</button>' +
      '</div>' +
      '</nav>';

    var toggle = header.querySelector('.csnav-toggle');
    var menu = header.querySelector('#cs-primary-nav');
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    // A link in the open mobile menu closes it.
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.matchMedia(MOBILE).matches) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var footer = document.getElementById('cs-footer');
  if (footer) {
    footer.innerHTML =
      '<footer class="csfoot">' +
      '<div class="csfoot-inner">' +
      '<div>' +
      '<div class="csfoot-logo"><img class="csfoot-mark" src="/images/logo/mark.svg" alt="" width="20" height="20" />CoStaff <span>Workspace</span></div>' +
      '<div class="csfoot-text">' + T.footText + '</div>' +
      '</div>' +
      '<div class="csfoot-links">' +
      '<a href="' + HOME + 'plugin/">' + T.plugin + '</a>' +
      '<a href="' + HOME + 'toolsets/">' + T.openx + '</a>' +
      '<a href="' + GH + '" target="_blank" rel="noopener">GitHub</a>' +
      '<a href="' + HOME + 'brand/">' + T.brand + '</a>' +
      '</div>' +
      '</div>' +
      '</footer>';
  }
})();
