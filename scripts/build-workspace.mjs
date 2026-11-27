// Builds the CoStaff Workspace pages (home, plugin, open-x, notice, brand) in English and
// Traditional Chinese from the copy below, so the two languages and the shared
// nav and footer never drift apart.
//
//   node scripts/build-workspace.mjs
//
// Writes index.html, plugin/, toolsets/, one page per tool, notice/, brand/ and the same under zhtw/.
// open-x/ is kept as a redirect to toolsets/.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = 'https://costaffs.app';
const GH = 'https://github.com/costaff-ai';
const MARKETPLACE = 'https://marketplace.visualstudio.com/items?itemName=costaff.costaff-workspace-vscode';
const AGY_PLUGIN = 'https://github.com/costaff-ai/costaff-workspace-antigravity';
const OPEN_VSX = 'https://open-vsx.org/extension/costaff/costaff-workspace-vscode';
const VERSION = 16; // bump to refresh cached CSS

// ---------- pictures ----------

const GLYPH = {
  'open-doc': '<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z"/><path d="M14 3.5V8h4"/><path d="M9.5 12.5h5M9.5 15.5h5"/>',
  'open-dashboard': '<path d="M4 20h16"/><path d="M7 16.5V11M12 16.5V6.5M17 16.5v-7"/>',
  'open-slide': '<rect x="3.5" y="5" width="17" height="11" rx="1.5"/><path d="M12 16v3.5M8.5 19.5h7"/>',
  'open-spreadsheet': '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M3.5 14.5h17M9.5 4.5v15"/>',
  'open-form': '<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4"/>',
  'open-map': '<path d="M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
  'open-recording': '<rect x="3.5" y="6.5" width="12" height="11" rx="2"/><path d="M15.5 10.5l5-3v9l-5-3z"/>',
  'open-sheet': '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M9.5 4.5v15"/><path d="M12.5 14.5h5M15.5 12.5l2 2-2 2"/>',
  'open-design-frame': '<rect x="5.5" y="5.5" width="13" height="13" rx="1"/><path d="M3 5.5h2.5M18.5 5.5H21M3 18.5h2.5M18.5 18.5H21M5.5 3v2.5M5.5 18.5V21M18.5 3v2.5M18.5 18.5V21"/>',
};
const ICON = {
  chart: GLYPH['open-dashboard'],
  table: GLYPH['open-spreadsheet'],
  map: GLYPH['open-map'],
  frame: GLYPH['open-design-frame'],
  form: GLYPH['open-form'],
  pdf: GLYPH['open-doc'],
  check: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.4 2.4 4.8-5"/>',
  mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>',
  shield: '<path d="M12 3.5l7 2.5v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6z"/>',
  code: '<path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5l-3 14"/>',
  layers: '<path d="M12 4l8.5 4.5L12 13 3.5 8.5z"/><path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5"/>',
  live: '<path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  tab: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M8 5v4"/>',
  click: '<path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18.4 5.6l-2.1 2.1"/><path d="M10 10l9 4-4 1.5L13.5 20z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  theme: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16a8 8 0 0 0 0-16z" fill="currentColor"/>',
  folder: '<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4.4l2 2.2h8.6A1.5 1.5 0 0 1 21 9.7v8.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>',
  agent: '<path d="M5 17.5l-1.5 3 3.5-1.5h11a2 2 0 0 0 2-2v-11a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2V17z"/><path d="M8 10h8M8 13.5h5"/>',
  open: '<path d="M8 6.5h-3a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 5 20.5h11a1.5 1.5 0 0 0 1.5-1.5v-3"/><path d="M13 3.5h7.5V11M20.5 3.5L11 13"/>',
};
const svg = (paths, cls = '') =>
  `<svg ${cls ? `class="${cls}" ` : ''}viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const kind = (id) => `<span class="kind" style="background:${FRAMEWORKS.find((f) => f.id === id).color}">${svg(GLYPH[id])}</span>`;

/** The command that starts a workspace of each kind (as CoStaff Workspace's setup guide gives it). */
const DEMO_INIT = {
  'open-doc': 'npx @open-document/cli init my-docs',
  'open-dashboard': 'npx @open-dashboard/cli init my-dashboards',
  'open-slide': 'npx @open-slide/cli init my-slides',
  'open-spreadsheet': 'npx open-spreadsheet init my-sheets',
  'open-design-frame': 'npx @open-design-frame/core init my-frames',
};

const FRAMEWORKS = [
  { id: 'open-doc', color: '#0f766e', repo: 'simonliu-ai-product/open-doc', plugin: true },
  { id: 'open-dashboard', color: '#2563eb', repo: 'simonliu-ai-product/open-dashboard', plugin: true },
  { id: 'open-slide', color: '#c2410c', repo: '1weiho/open-slide', plugin: true, by: '1weiho', site: 'https://open-slide.dev/' },
  { id: 'open-spreadsheet', color: '#217346', repo: 'simonliu-ai-product/open-spreadsheet', plugin: true },
  { id: 'open-form', color: '#7c3aed', repo: 'simonliu-ai-product/open-form' },
  { id: 'open-map', color: '#0e7490', repo: 'simonliu-ai-product/open-map' },
  { id: 'open-recording', color: '#be123c', repo: 'simonliu-ai-product/open-recording' },
  { id: 'open-design-frame', color: '#a16207', repo: 'simonliu-ai-product/open-design-frame', plugin: true },
  { id: 'open-sheet', color: '#334155', repo: 'lianghsun/open-sheet', by: 'lianghsun', site: 'https://open-sheet.dev/' },
];

// ---------- copy ----------

const COPY = {
  en: {
    lang: 'en',
    prefix: '',
    other: { label: '繁中', prefix: '/zhtw' },
    nav: { home: 'Home', plugin: 'Workspace', openx: 'Tools', notice: 'Notice', menu: 'Menu', cta: 'Install' },
    ribbon: ['The CoStaff Agent platform will be archived on November 30, 2026.', 'Read the notice'],
    soon: 'Coming soon',
    inPlugin: 'Opens in Workspace',
    tool: {
      github: 'View on GitHub',
      whatTitle: 'What it does.',
      startTitle: 'Get started.',
      steps: [['Create a workspace', 'One command makes a new folder for your work.'], ['Start it', 'The live preview opens in your browser.'], ['Ask your agent', 'Say what you need. The agent writes the files and you watch them change.']],
      wsTitle: 'Open it in CoStaff Workspace.',
      wsBody: 'See every edit beside the conversation, in the Antigravity App or VS Code.',
      wsCta: 'Meet CoStaff Workspace',
      moreTitle: 'More tools.',
      allTools: 'All tools',
    },
    by: (n) => `by ${n}`,
    copy: 'Copy',
    copied: 'Copied',
    foot: {
      tag: 'Work beside your agent, on the same files.',
      cols: [
        ['CoStaff Workspace', [['Workspace', 'plugin/'], ['Tools', 'toolsets/']]],
        ['Tools', [['open-doc', 'https://github.com/simonliu-ai-product/open-doc'], ['open-spreadsheet', 'https://github.com/simonliu-ai-product/open-spreadsheet'], ['All tools', 'toolsets/']]],
        ['Elsewhere', [['GitHub', GH], ['CoStaff Workspace CLI', `${GH}/costaff-workspace-oss`], ['Brand guidelines', 'brand/']]],
      ],
      base: 'Copyright © 2026 CoStaff.',
    },
    home: {
      title: 'CoStaff Workspace — Work beside your agent, on the same files',
      desc: 'Your agent writes the document, the dashboard, the deck or the sheet. CoStaff Workspace shows it beside the conversation as it changes, so you can read it, check it and edit it yourself.',
      kicker: 'CoStaff Workspace',
      display: 'Work beside your agent.',
      lede: 'Your agent writes the document, the dashboard, the deck or the sheet. You see it change beside the conversation, and you can edit it too.',
      cta: ['See how it works', 'Explore the tools'],
      windowTitle: 'quarterly-report — CoStaff Workspace',
      shotAlt: 'The Antigravity App: the agent added a gross margin column, and CoStaff Workspace shows it beside the conversation, under 30% in red',
      tiles: {
        plugin: ['CoStaff Workspace', 'Every workspace on your computer, one click away, in the editor you already use.', 'Learn more'],
        openx: ['Productivity tools', 'Documents, dashboards, slides and sheets, as files an agent can write.', 'See the tools'],
      },
    },
    plugin: {
      title: 'CoStaff Workspace — for VS Code and Antigravity',
      desc: 'Your workspaces in a panel beside your coding agent, for the Antigravity App, VS Code, Cursor and the Antigravity IDE.',
      local: ['Overview', 'Get started'],
      cta: 'Get started',
      kicker: 'CoStaff Workspace',
      display: 'Get the paperwork done, fast.',
      lede: 'Your AI coworker, at work right in front of you. The workspace sits beside the agent, and every tool call and edit shows up as it happens.',
      sections: [
        ['live', 'Live as the agent works.', 'Ask for a new column, a chart, another slide. The agent edits the files, and the page you are looking at changes with them. No refresh, no export, no “open the file to check”.', 'agent-live-panel.png', 'The sheet updates while the agent edits it: “Updated from file”'],
        ['list', 'Every workspace, one list.', 'Workspaces in your project, the ones you added, the ones you used in CoStaff Desktop. Sorted by what changed last, filtered by kind, found by name.', 'list.png', 'The workspace list'],
      ],
      factsTitle: 'At home in your editor.',
      facts: [
        ['tab', 'A tab per workspace', 'Open several side by side with your code. Close a tab and its server stops.'],
        ['theme', 'Your theme', 'Light or dark, the workspace follows the editor, not the system.'],
        ['click', 'Ready in a click', 'Missing packages, or a newer framework: one button installs or updates it.'],
        ['agent', 'Copy and paste', 'Copy a range, paste a row. It works inside the workspace, even in VS Code.'],
        ['open', 'Command palette', 'Open any workspace from ⌘⇧P without going to the list.'],
        ['folder', 'Your files, your folders', 'Reveal in Finder, open the folder, read the server log, from one menu.'],
      ],
      privacy: ['Everything stays on your computer.', 'No account. It runs only on your computer, and only you can reach it.'],
      hostsTitle: 'Two ways to use it.',
      hosts: [
        ['For the Antigravity App', 'A plugin with its own tab, beside the agent’s conversation.', 'agent-done.png', 'Shown in the Antigravity App, with a workbook beside the agent', [['Install guide', AGY_PLUGIN]]],
        ['For VS Code', 'An extension for VS Code, Cursor and the Antigravity IDE. Each workspace opens in an editor tab, between your files and the agent.', 'antigravity-ide.png', 'Shown in the Antigravity IDE, with an open-doc guide in an editor tab beside the agent', [['VS Code Marketplace', MARKETPLACE], ['Open VSX', OPEN_VSX]]],
      ],
      startTitle: 'Get started.',
      startLede: 'The extension is on the VS Code Marketplace, and on Open VSX for Cursor and the Antigravity IDE. For the Antigravity App, install the plugin with one agy command.',
      steps: [
        ['Create a workspace', 'One command makes a new folder for your work.', ['cmd', 'npx open-spreadsheet init my-sheets']],
        ['Install CoStaff Workspace', 'Search the Extensions view in VS Code, Cursor or the Antigravity IDE.', ['search', 'CoStaff Workspace']],
        ['Ask your agent', 'Open the workspace in the panel and tell the agent what you need.', ['say', 'Add a gross margin column to the Q1 sheet']],
      ],
      pick: 'What do you want to make?',
      // [framework, tab label, the line to give the agent]; the command comes from the framework.
      demos: [
        ['open-doc', 'Document', 'Write a two-page proposal for the Q1 launch'],
        ['open-dashboard', 'Dashboard', 'Build a sales dashboard from orders.csv, by month and region'],
        ['open-slide', 'Slides', 'Turn the Q1 proposal into a ten-slide deck'],
        ['open-spreadsheet', 'Spreadsheet', 'Add a gross margin column to the Q1 sheet'],
        ['open-design-frame', 'Design', 'Design a launch poster in our brand colours'],
      ],
    },
    openx: {
      title: 'Productivity tools built for agents — CoStaff',
      desc: 'Open-source productivity tools for documents, dashboards, slides, spreadsheets, forms, maps, recordings and design frames: files an agent can write and a person can read.',
      kicker: 'Open source',
      display: 'Productivity tools, built for agents.',
      lede: 'Documents, decks, sheets, dashboards: files an agent can write and a person can read. Each one is an open-source framework with skills and an MCP server.',
      principles: [
        ['folder', 'Files, not apps', 'Everything is text in a folder. Git sees every change, from you or the agent.'],
        ['live', 'Live preview', 'A dev server renders the work as it is written, at its real size.'],
        ['agent', 'Tools the agent knows', 'Skills and MCP servers tell the agent how to build, check and fix its work.'],
      ],
      galleryTitle: 'Our tools.',
      othersLabel: 'More tools',
      externalTitle: 'External and third-party tools.',
      desc2: {
        'open-doc': 'Reports written as React, rendered as real A4 pages with an outline, page numbers and a PDF.',
        'open-dashboard': 'Describe the dashboard you want. Your agent builds it, live, over your own database.',
        'open-slide': 'A slide framework built for agents: decks as React components.',
        'open-spreadsheet': 'An Excel-like spreadsheet with its own formula engine, grid editor, xlsx and an MCP server.',
        'open-form': 'Forms and surveys with conversational steps, a response store and analytics.',
        'open-map': 'Interactive maps and story tours, with projections, layers and export handled.',
        'open-recording': 'Record in the browser, transcribe locally, and let an agent drive both.',
        'open-design-frame': 'Design frames written as components, drawn at true size, with an MCP endpoint.',
        'open-sheet': 'Spreadsheet models written as React, exported as a live .xlsx that recalculates.',
      },
    },
    notice: {
      title: 'CoStaff will be archived on November 30, 2026',
      desc: 'The CoStaff Agent platform, its agents, channels and apps, will be archived on November 30, 2026. Here is what changes and what stays.',
      kicker: 'Notice',
      display: 'CoStaff will be archived on November 30, 2026.',
      meta: 'Published November 2026',
      body: [
        ['p', 'Given how CoStaff has been used and where we are heading, we are putting our effort into CoStaff Workspace and its open-source productivity tools. The CoStaff Agent platform, with its manager, specialist agents, chat channels and business apps, will be archived on November 30, 2026.'],
        ['h2', 'What changes'],
        ['ul', ['Its repositories on GitHub become read-only.', 'They will not receive updates or fixes.', 'Issues and pull requests will not be answered.']],
        ['h2', 'What stays'],
        ['ul', ['The code and its history stay public, to read, fork and use under each repository’s license.', 'The CoStaff pages on this site stay up for reference.', 'The CoStaff Workspace CLI and this site carry on.']],
        ['keep', 'Thank you to everyone who used CoStaff, gave feedback, or contributed. What we learned building AI staff is what CoStaff Workspace is made of.'],
      ],
      next: ['What comes next', 'CoStaff Workspace puts your workspaces beside your agent.', 'Meet CoStaff Workspace'],
    },
    brand: {
      title: 'Brand guidelines — CoStaff',
      desc: 'How to use the CoStaff logo: download every variant, and see the colour, spacing and sizing that keep the mark recognisable wherever it appears.',
      kicker: 'Brand',
      display: 'Using the CoStaff logo.',
      lede: 'The logo variants, colours and spacing we use, so CoStaff stays recognisable wherever it turns up. Everything here is free to download.',
      zip: ['Download all assets', 'ZIP · 1.4 MB'],
      logoTitle: 'Pick the variant that fits your background.',
      logoLede: 'Each lockup comes in two colourways. Dark text goes on light backgrounds, white text on dark ones, so you never need to recolour anything yourself.',
      dark: 'dark',
      assets: [
        ['costaff-icon', 'light', 'Icon', 'The mark on its own. The green container brings its own contrast, so it sits on light or dark. For avatars, app icons and favicons.', 'CoStaff icon'],
        ['costaff-horizontal', 'light', 'Horizontal, light backgrounds', 'The one to reach for first. It reads well at small heights: navigation bars, letterheads, email signatures.', 'CoStaff horizontal lockup'],
        ['costaff-horizontal-dark', 'dark', 'Horizontal, dark backgrounds', 'The same lockup with a white wordmark, for anything darker than a mid-tone.', 'CoStaff horizontal lockup, white text'],
        ['costaff-vertical', 'light', 'Vertical, light backgrounds', 'Stacked, for places taller than they are wide or centred: README banners, slide covers, print.', 'CoStaff vertical lockup'],
        ['costaff-vertical-dark', 'dark', 'Vertical, dark backgrounds', 'The stacked lockup with a white wordmark, for dark decks and dark-mode documents.', 'CoStaff vertical lockup, white text'],
        ['costaff-tagline', 'light', 'With tagline', 'Adds “Call Your AI Staff to work”. It says the most, so it suits a first meeting: covers, social cards, booth graphics.', 'CoStaff lockup with tagline', 'costaff-tagline-dark'],
      ],
      colourTitle: 'One green, two neutrals.',
      colourLede: 'The green is what people recognise first, so it stays one flat value with no gradients. The wordmark is pure black or pure white, so it holds its contrast on any surface.',
      colours: [
        ['#3A5032', 'CoStaff Green', 'The icon container, and the only brand colour.'],
        ['#000000', 'Black', 'The wordmark on light backgrounds.'],
        ['#FFFFFF', 'White', 'The letters inside the mark, and the wordmark on dark backgrounds.'],
      ],
      spaceTitle: 'Room to breathe, and a floor for legibility.',
      spaceLede: 'A headline or another logo too close pulls the eye away, and a mark too small stops reading. A margin and a minimum size fix both.',
      space: [
        ['clearspace', 'Clear space', 'Leave at least a quarter of the icon’s height clear on every side. Keep text, rules and other logos outside it.', 'Clear space: a margin of a quarter of the icon height on all sides'],
        ['minsize', 'Minimum size', 'Keep the icon at 16 px or more, and the horizontal lockup at 120 px wide or more. From 16 to 32 px, use favicon.svg: its strokes are slightly thicker.', 'Minimum size: the icon at 16 px, the horizontal lockup at 120 px wide'],
      ],
      rulesTitle: 'Most of what you’d want to do is fine.',
      rulesLede: 'You don’t need to ask to write about CoStaff or show the logo. The things on the right aren’t forbidden; they just wear away what makes the mark recognisable.',
      ok: ['Works well', [
        ['Writing about CoStaff', 'In articles, tutorials, talks and slides, no permission needed.'],
        ['Linking back', 'The logo as a link to this site.'],
        ['Saying what you built', '“Built with CoStaff” or “works with CoStaff Workspace”.'],
        ['Community material', 'Meetup slides, posters, community posts.'],
        ['Scaling to fit', 'Any size, as long as the proportions stay locked.'],
      ]],
      no: ['Weakens recognition', [
        ['Changing the colour', 'The single green is the first thing people recognise.'],
        ['Stretching or squashing', 'The proportions are part of what makes it readable.'],
        ['Rotating or cropping', 'The lockup is drawn to sit level and whole.'],
        ['Shadows or outlines', 'Effects muddy the shape, especially small.'],
        ['Busy or same-toned backgrounds', 'The mark stops standing out from what is behind it.'],
        ['Rebuilding it yourself', 'Retyped, the wordmark won’t match the spacing. Use the files.'],
      ]],
      avoidTitle: 'The same six, as pictures.',
      avoid: [
        ['misuse-stretch', 'Stretched', 'Scale both dimensions together.'],
        ['misuse-recolor', 'Recoloured', 'The green is fixed. Pick the light or dark file instead.'],
        ['misuse-rotate', 'Rotated', 'The lockup sits level.'],
        ['misuse-shadow', 'Shadows and effects', 'They blur the shape at small sizes.'],
        ['misuse-lowcontrast', 'Too little contrast', 'A green background swallows the mark.'],
        ['misuse-busy', 'Busy backgrounds', 'Give it a plain area to sit on.'],
      ],
      note: ['The name and the code.', 'Each of our tools comes with its own licence. The CoStaff name and logo are not part of any of them, because they are how people tell an official release from a fork. If you ship something built on them, give it its own name and mark, and say it is built with CoStaff.'],
      ask: ['Something not covered here?', 'Write to us and we’ll help you get it right.'],
    },
  },
  zh: {
    lang: 'zh-TW',
    prefix: '/zhtw',
    other: { label: 'EN', prefix: '' },
    nav: { home: '首頁', plugin: 'Workspace', openx: '生產力工具', notice: '公告', menu: '選單', cta: '安裝' },
    ribbon: ['CoStaff Agent 平台將於 2026 年 11 月 30 日封存。', '閱讀公告'],
    soon: '即將推出',
    inPlugin: '可在 Workspace 開啟',
    tool: {
      github: '在 GitHub 查看',
      whatTitle: '能做什麼',
      startTitle: '開始使用',
      steps: [['建立工作區', '一個指令建立新的資料夾。'], ['啟動', '在瀏覽器打開即時預覽。'], ['交給 Agent', '說出你要什麼，Agent 寫檔案，你看著畫面跟著變。']],
      wsTitle: '在 CoStaff Workspace 裡打開',
      wsBody: 'Agent 的每一次修改，都即時出現在對話旁邊。支援 Antigravity App 與 VS Code。',
      wsCta: '認識 CoStaff Workspace',
      moreTitle: '其他工具',
      allTools: '全部工具',
    },
    by: (n) => `作者 ${n}`,
    copy: '複製',
    copied: '已複製',
    foot: {
      tag: '和 Agent 並肩，在同一份檔案上工作。',
      cols: [
        ['CoStaff Workspace', [['Workspace', 'plugin/'], ['生產力工具', 'toolsets/']]],
        ['生產力工具', [['open-doc', 'https://github.com/simonliu-ai-product/open-doc'], ['open-spreadsheet', 'https://github.com/simonliu-ai-product/open-spreadsheet'], ['全部工具', 'toolsets/']]],
        ['其他', [['GitHub', GH], ['CoStaff Workspace CLI', `${GH}/costaff-workspace-oss`], ['品牌規範', 'brand/']]],
      ],
      base: 'Copyright © 2026 CoStaff.',
    },
    home: {
      title: 'CoStaff Workspace — 和 Agent 並肩，在同一份檔案上工作',
      desc: 'Agent 寫文件、做儀表板、排簡報、算試算表，CoStaff Workspace 把成果即時放在對話旁邊，讓你看得到、檢查得到，也能自己動手改。',
      kicker: 'CoStaff Workspace',
      display: '和 Agent 並肩工作',
      lede: 'Agent 寫文件、做儀表板、排簡報、算試算表。成果就在對話旁邊即時變化，你也能直接動手改。',
      cta: ['看看怎麼用', '探索生產力工具'],
      windowTitle: 'quarterly-report — CoStaff Workspace',
      shotAlt: 'Antigravity App：Agent 加上毛利率欄，CoStaff Workspace 在對話旁邊即時顯示，低於 30% 標紅',
      tiles: {
        plugin: ['CoStaff Workspace', '電腦上的每個工作區，點一下就打開，就在你正在用的編輯器裡。', '了解更多'],
        openx: ['生產力工具', '文件、儀表板、簡報、試算表，變成 Agent 寫得出來的檔案。', '看看有哪些工具'],
      },
    },
    plugin: {
      title: 'CoStaff Workspace — 支援 VS Code 與 Antigravity',
      desc: '把你的工作區放在 coding Agent 旁邊的面板，支援 Antigravity App、VS Code、Cursor 與 Antigravity IDE。',
      local: ['概覽', '開始使用'],
      cta: '開始使用',
      kicker: 'CoStaff Workspace',
      display: '讓文書工作快速完成',
      lede: '你的 AI 同事就在眼前現場辦公。工作區與 Agent 並排同步，每一次工具操作與修改都即時呈現。',
      sections: [
        ['live', 'Agent 一改，畫面就變', '請 Agent 加一欄、畫一張圖、多做一頁投影片。Agent 改檔案，你正在看的畫面跟著變。不用重新整理、不用匯出，也不用「打開檔案看看」。', 'agent-live-panel.png', 'Agent 修改時，試算表跟著更新：「已從檔案更新」'],
        ['list', '所有工作區，一份清單', '專案裡的、你加過的、在 CoStaff Desktop 用過的，全部合成一份。最近修改的排前面，可以依類型篩選、用名稱搜尋。', 'list.png', '工作區清單'],
      ],
      factsTitle: '像編輯器原本就有的功能',
      facts: [
        ['tab', '每個工作區一個分頁', '可以和程式碼並排開好幾個。關掉分頁，伺服器就停止。'],
        ['theme', '跟著你的主題', '深色或淺色，工作區跟著編輯器，而不是跟著系統。'],
        ['click', '一鍵就緒', '還沒裝套件、框架有新版，按一下就安裝或更新。'],
        ['agent', '能複製貼上', '複製一個範圍、貼上一整列，在工作區裡也行，連 VS Code 裡都可以。'],
        ['open', '指令面板', '在 ⌘⇧P 直接打開任何工作區，不用先回清單。'],
        ['folder', '你的檔案，你的資料夾', '在 Finder 顯示、開啟資料夾、查看伺服器紀錄，都在同一個選單。'],
      ],
      privacy: ['一切都留在你的電腦', '不需要帳號，只在本機執行、只有你連得到。'],
      hostsTitle: '兩種使用方式',
      hosts: [
        ['Antigravity App 版', '以 plugin 形式，在 Agent 對話旁邊開一個自己的分頁。', 'agent-done.png', '畫面：Antigravity App，試算表就在 Agent 旁邊', [['安裝說明', AGY_PLUGIN]]],
        ['VS Code 版', '以擴充套件形式，支援 VS Code、Cursor 與 Antigravity IDE。每個工作區開在編輯區分頁，放在檔案與 Agent 之間。', 'antigravity-ide.png', '畫面：Antigravity IDE，open-doc 文件開在編輯區分頁，旁邊是 Agent', [['VS Code Marketplace', MARKETPLACE], ['Open VSX', OPEN_VSX]]],
      ],
      startTitle: '開始使用',
      startLede: '擴充套件已經上架 VS Code Marketplace，Cursor 與 Antigravity IDE 可以從 Open VSX 安裝。Antigravity App 版用一行 agy 指令安裝。',
      steps: [
        ['建立工作區', '一個指令建立新的資料夾。', ['cmd', 'npx open-spreadsheet init my-sheets']],
        ['安裝 CoStaff Workspace', '在 VS Code、Cursor 或 Antigravity IDE 的擴充功能搜尋。', ['search', 'CoStaff Workspace']],
        ['交給 Agent', '在面板打開工作區，告訴 Agent 你要什麼。', ['say', '幫 Q1 業績表加一欄毛利率']],
      ],
      pick: '你想做什麼？',
      demos: [
        ['open-doc', '文件', '幫我寫一份兩頁的 Q1 上市企劃書'],
        ['open-dashboard', '儀表板', '用 orders.csv 做一個每月、各區的業績儀表板'],
        ['open-slide', '簡報', '把 Q1 企劃書做成十頁簡報'],
        ['open-spreadsheet', '試算表', '幫 Q1 業績表加一欄毛利率'],
        ['open-design-frame', '設計稿', '用我們的品牌色設計一張上市海報'],
      ],
    },
    openx: {
      title: '為 Agent 打造的開源生產力工具 — CoStaff',
      desc: '開源的生產力工具：文件、儀表板、簡報、試算表、表單、地圖、錄影與設計稿，Agent 寫得出來、人看得懂。',
      kicker: '開源',
      display: '為 Agent 打造的生產力工具',
      lede: '文件、簡報、試算表、儀表板，Agent 寫得出來、人看得懂，全部是資料夾裡的檔案。每一個都是開源框架，附 skills 與 MCP server。',
      principles: [
        ['folder', '是檔案，不是 App', '所有內容都是資料夾裡的文字。不論是你還是 Agent 改的，git 都看得到。'],
        ['live', '即時預覽', '開發伺服器一邊寫一邊呈現，用實際的尺寸。'],
        ['agent', 'Agent 懂的工具', 'skills 與 MCP server 告訴 Agent 怎麼做、怎麼檢查、怎麼修正。'],
      ],
      galleryTitle: '自製工具',
      othersLabel: '其他工具',
      externalTitle: '外部／第三方工具',
      desc2: {
        'open-doc': '用 React 寫報告，輸出真正的 A4 頁面，含大綱、頁碼與 PDF。',
        'open-dashboard': '描述你要的儀表板，Agent 直接連你的資料庫做出即時看板。',
        'open-slide': '為 Agent 打造的簡報框架：用 React 元件做簡報。',
        'open-spreadsheet': '類 Excel 的試算表：自製公式引擎、格子編輯器、xlsx 與 MCP server。',
        'open-form': '表單、問卷、報名：對話式填答、回覆儲存與分析。',
        'open-map': '互動地圖與 story map，投影、圖層與匯出都處理好。',
        'open-recording': '在瀏覽器錄影、在本機轉逐字稿，兩者都交給 Agent 操作。',
        'open-design-frame': '用元件寫設計稿，依實際尺寸繪製，並提供 MCP 介面。',
        'open-sheet': '用 React 寫試算表模型，匯出會自動重算的 .xlsx。',
      },
    },
    notice: {
      title: 'CoStaff 將於 2026 年 11 月 30 日封存',
      desc: 'CoStaff Agent 平台，包括其 Agent、對話管道與應用，將於 2026 年 11 月 30 日封存。哪些會改變、哪些會保留，看這裡。',
      kicker: '公告',
      display: 'CoStaff 將於 2026 年 11 月 30 日封存',
      meta: '2026 年 11 月發布',
      body: [
        ['p', '考量 CoStaff 目前的使用狀況與後續規劃，我們將集中資源發展 CoStaff Workspace 與開源生產力工具。CoStaff Agent 平台，包括 Manager、專家 Agent、對話管道與企業應用，將於 2026 年 11 月 30 日封存。'],
        ['h2', '會改變的'],
        ['ul', ['GitHub 上的相關 repo 將改為唯讀。', '之後不會再更新或修正問題。', '不再回覆 issue 與 pull request。']],
        ['h2', '會保留的'],
        ['ul', ['程式碼與歷史紀錄維持公開，可以閱讀、fork，並依各 repo 的授權使用。', '本站原有的 CoStaff 頁面保留供參考。', 'CoStaff Workspace CLI 與本站會繼續維護。']],
        ['keep', '謝謝每一位使用過、回饋過、貢獻過 CoStaff 的朋友。打造 AI 員工時學到的一切，正是 CoStaff Workspace 的基礎。'],
      ],
      next: ['接下來', 'CoStaff Workspace 把你的工作區放在 Agent 旁邊。', '認識 CoStaff Workspace'],
    },
    brand: {
      title: '品牌規範 — CoStaff',
      desc: '如何使用 CoStaff 標誌：下載每個版本，並了解讓標誌在任何地方都認得出來的色彩、留白與尺寸。',
      kicker: '品牌',
      display: '如何使用 CoStaff 標誌',
      lede: '我們使用的標誌版本、色彩與留白都在這裡，讓 CoStaff 出現在哪裡都認得出來。所有檔案都可以免費下載。',
      zip: ['下載全部檔案', 'ZIP · 1.4 MB'],
      logoTitle: '依背景挑選版本',
      logoLede: '每種組合都有兩種配色：深色字放淺色背景，白色字放深色背景。選對檔案，就不用自己改顏色。',
      dark: '深色版',
      assets: [
        ['costaff-icon', 'light', '圖示', '單獨使用的標誌。綠色底本身就有對比，深淺背景都適用。適合頭像、App 圖示與 favicon。', 'CoStaff 圖示'],
        ['costaff-horizontal', 'light', '橫式，淺色背景', '優先選用的版本。高度很小時也清楚，適合導覽列、信頭與電子郵件簽名。', 'CoStaff 橫式組合'],
        ['costaff-horizontal-dark', 'dark', '橫式，深色背景', '同樣的組合，字改成白色，用在比中間調更深的背景。', 'CoStaff 橫式組合，白字'],
        ['costaff-vertical', 'light', '直式，淺色背景', '上下堆疊，適合比較高或需要置中的版位：README 橫幅、簡報封面、印刷品。', 'CoStaff 直式組合'],
        ['costaff-vertical-dark', 'dark', '直式，深色背景', '白字的直式組合，用在深色簡報與深色模式文件。', 'CoStaff 直式組合，白字'],
        ['costaff-tagline', 'light', '含標語', '加上「Call Your AI Staff to work」。資訊最多，適合第一次接觸的場合：封面、社群分享圖、展場。', 'CoStaff 含標語組合', 'costaff-tagline-dark'],
      ],
      colourTitle: '一個綠色，兩個中性色',
      colourLede: '綠色是大家最先認出的地方，所以維持單一平塗色，不用漸層。字只用純黑或純白，放在任何底色上都有對比。',
      colours: [
        ['#3A5032', 'CoStaff 綠', '圖示底色，也是唯一的品牌色。'],
        ['#000000', '黑', '淺色背景上的字。'],
        ['#FFFFFF', '白', '標誌裡的字母，以及深色背景上的字。'],
      ],
      spaceTitle: '留點空間，也別太小',
      spaceLede: '標題或其他標誌靠太近會分散視線，太小則會看不清楚。固定的留白和最小尺寸可以同時解決這兩件事。',
      space: [
        ['clearspace', '留白', '四周至少留出圖示高度的四分之一，文字、線條與其他標誌都放在這個範圍外。', '留白示意：四周留出圖示高度四分之一的空間'],
        ['minsize', '最小尺寸', '圖示至少 16 px，橫式組合至少 120 px 寬。16 到 32 px 之間請用 favicon.svg，它的筆畫稍微加粗。', '最小尺寸示意：圖示 16 px，橫式組合 120 px 寬'],
      ],
      rulesTitle: '你想做的，大多都沒問題',
      rulesLede: '寫 CoStaff 相關內容或放上標誌，都不需要先問我們。右邊列的不是禁令，只是這樣做會讓標誌比較難認出來。',
      ok: ['這樣用很好', [
        ['寫 CoStaff 相關內容', '文章、教學、演講、簡報都可以，不需要許可。'],
        ['連結回來', '用標誌連到本網站。'],
        ['說明你做的東西', '「Built with CoStaff」或「支援 CoStaff Workspace」。'],
        ['社群素材', '聚會簡報、海報、社群貼文。'],
        ['依版面縮放', '多大都可以，只要維持比例。'],
      ]],
      no: ['這樣會比較難認', [
        ['改顏色', '那個綠色是大家最先認出的地方。'],
        ['拉長或壓扁', '比例本身就是好讀的原因之一。'],
        ['旋轉或裁切', '這個組合是設計成水平、完整呈現的。'],
        ['加陰影或外框', '特效會讓輪廓變模糊，小尺寸特別明顯。'],
        ['複雜或同色調的背景', '標誌會和背景混在一起。'],
        ['自己重做', '重新打字對不上原本的字距，請直接用檔案。'],
      ]],
      avoidTitle: '同樣六點，用圖說明',
      avoid: [
        ['misuse-stretch', '拉長變形', '請等比例縮放。'],
        ['misuse-recolor', '改了顏色', '綠色是固定的，請改用淺色或深色版檔案。'],
        ['misuse-rotate', '旋轉', '組合要保持水平。'],
        ['misuse-shadow', '陰影與特效', '小尺寸時會讓形狀變模糊。'],
        ['misuse-lowcontrast', '對比不足', '綠色背景會把標誌吃掉。'],
        ['misuse-busy', '背景太複雜', '給它一塊乾淨的區域。'],
      ],
      note: ['名稱與程式碼', '我們的每個工具都有各自的授權。CoStaff 的名稱與標誌不在任何一份授權範圍內，因為大家靠它們分辨官方版本和 fork。如果你要發布以這些工具做成的東西，請給它自己的名稱與標誌，並註明 built with CoStaff。'],
      ask: ['有這裡沒提到的情況？', '寫信給我們，我們很樂意幫你把它用對。'],
    },
  },
};

// ---------- shared parts ----------

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const href = (c, rel) => (/^https?:/.test(rel) ? rel : `${c.prefix}/${rel}`);
const ext = (url) => (/^https?:/.test(url) ? ' target="_blank" rel="noopener"' : '');

function head(c, page, title, desc, slug) {
  const url = `${SITE}${c.prefix}/${slug}`;
  const otherUrl = `${SITE}${c.other.prefix}/${slug}`;
  return `<!DOCTYPE html>
<html lang="${c.lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${url}" />
<link rel="alternate" hreflang="${c.lang}" href="${url}" />
<link rel="alternate" hreflang="${c.lang === 'en' ? 'zh-TW' : 'en'}" href="${otherUrl}" />
<link rel="icon" href="/images/logo/favicon.ico" sizes="any" />
<link rel="icon" href="/images/logo/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/images/logo/apple-touch-icon.png" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="CoStaff Workspace" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}/images/logo/og.png" />
<meta name="twitter:card" content="summary_large_image" />
${page === 'home' ? '<link rel="alternate" type="text/markdown" href="/index.md" />\n<link rel="describedby" href="/llms.txt" type="text/markdown" />\n' : ''}<link rel="stylesheet" href="/assets/ws.css?v=${VERSION}" />
</head>
<body>
`;
}

/** EN | 繁中 as one switch; the thumb slides to the language picked, then the page changes. */
function langSwitch(c, slug) {
  const en = c.lang === 'en';
  const link = (isEn) => `<a href="${isEn ? '' : '/zhtw'}/${slug}" lang="${isEn ? 'en' : 'zh-TW'}" hreflang="${isEn ? 'en' : 'zh-TW'}"${isEn === en ? ' aria-current="true"' : ''}>${isEn ? 'EN' : '繁中'}</a>`;
  return `<div class="lang-switch" data-active="${en ? 'en' : 'zh'}" role="group" aria-label="${en ? 'Language' : '語言'}"><span class="lang-thumb" aria-hidden="true"></span>${link(true)}${link(false)}</div>`;
}

function nav(c, page, slug) {
  const item = (key, rel) => `<a href="${href(c, rel)}"${page === key ? ' aria-current="page"' : ''}>${c.nav[key]}</a>`;
  return `<header class="gnav">
<div class="wrap">
<a class="gnav-logo" href="${c.prefix}/"><img src="/images/logo/mark.svg" alt="" width="20" height="20" />CoStaff Workspace</a>
<nav class="gnav-links" id="gnav-links" aria-label="Primary">
${item('plugin', 'plugin/')}
${item('openx', 'toolsets/')}
</nav>
<div class="gnav-right">
${langSwitch(c, slug)}
<a class="gh" href="${GH}" target="_blank" rel="noopener">GitHub</a>
<a class="gnav-cta" href="${href(c, 'plugin/#start')}">${c.nav.cta}</a>
<button class="gnav-menu" type="button" aria-label="${c.nav.menu}" aria-expanded="false" aria-controls="gnav-links">${svg('<path d="M4 8h16M4 16h16"/>')}</button>
</div>
</div>
</header>
${page === 'notice' ? '' : `<div class="ribbon">${esc(c.ribbon[0])}<a class="more" href="${href(c, 'notice/')}">${esc(c.ribbon[1])}</a></div>\n`}`;
}

function foot(c) {
  const cols = c.foot.cols
    .map(([h, links]) => `<div><h4>${esc(h)}</h4><ul>${links.map(([t, u]) => `<li><a href="${href(c, u)}"${ext(u)}>${esc(t)}</a></li>`).join('')}</ul></div>`)
    .join('\n');
  return `<footer class="foot">
<div class="wrap">
<div class="foot-cols">
<div><div class="foot-brand"><img src="/images/logo/mark.svg" alt="" width="20" height="20" />CoStaff Workspace</div><p class="foot-tag">${esc(c.foot.tag)}</p></div>
${cols}
</div>
<div class="foot-base"><span>${esc(c.foot.base)}</span><a href="${c.other.prefix}/">${c.other.label}</a></div>
</div>
</footer>
<script>
(function () {
  var b = document.querySelector('.gnav-menu'), l = document.getElementById('gnav-links');
  if (b) b.addEventListener('click', function () { var o = l.classList.toggle('open'); b.setAttribute('aria-expanded', String(o)); });
  var ls = document.querySelector('.lang-switch');
  if (ls) ls.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || a.hasAttribute('aria-current') || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    ls.setAttribute('data-active', a.getAttribute('lang') === 'en' ? 'en' : 'zh');
    setTimeout(function () { location.href = a.href; }, 200);
  });
  var pick = document.querySelector('.demo-pick');
  if (pick) {
    var tabs = [].slice.call(pick.querySelectorAll('[role=tab]'));
    var show = function (t) {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute('aria-selected', String(on));
        o.tabIndex = on ? 0 : -1;
        document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = tabs[(i + d + tabs.length) % tabs.length]; show(n); n.focus();
      });
    });
  }
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      navigator.clipboard && navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
        var t = btn.textContent; btn.textContent = ${JSON.stringify(c.copied)}; setTimeout(function () { btn.textContent = t; }, 1400);
      });
    });
  });
})();
</script>
</body>
</html>
`;
}

const realShot = (file, alt) => `<div class="window real"><img src="/images/workspace/${file}" alt="${esc(alt)}" width="1984" height="1172" /></div>`;
const windowShot = (c, file, alt, title) => `<div class="window"><div class="window-bar"><i></i><i></i><i></i><span>${esc(title)}</span></div><img src="/images/workspace/${file}" alt="${esc(alt)}" width="2000" height="1280" /></div>`;

/** A command in a grey box with a copy button; it wraps only between words. */
const cmdBox = (c, text, cls = '') => `<div class="cmd${cls}"><code>${text.split(' ').map((w) => (w.length > 24 ? esc(w) : `<span class="nowrap">${esc(w)}</span>`)).join(' ')}</code><button type="button" data-copy="${esc(text)}">${esc(c.copy)}</button></div>`;

/** Numbered steps: [title, body, [kind, text]] with kind cmd, search or say. */
const stepsHtml = (c, steps) => steps
  .map(([h3, body, [kind, text]]) => `<div class="step"><h3>${esc(h3)}</h3><p>${esc(body)}</p>${
    kind === 'cmd' ? cmdBox(c, text)
    : kind === 'search' ? `<div class="cmd search">${svg('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>')}<strong>${esc(text)}</strong></div>`
    : `<div class="say">${esc(text)}</div>`}</div>`)
  .join('\n');

// ---------- pages ----------

function home(c) {
  const h = c.home;
  return `${head(c, 'home', h.title, h.desc, '')}${nav(c, 'home', '')}
<main>
<section class="hero">
<div class="wrap">
<p class="kicker">${esc(h.kicker)}</p>
<h1 class="display">${esc(h.display)}</h1>
<p class="lede">${esc(h.lede)}</p>
<div class="actions"><a class="btn" href="${href(c, 'plugin/')}">${esc(h.cta[0])}</a><a class="btn ghost" href="${href(c, 'toolsets/')}">${esc(h.cta[1])}</a></div>
${realShot('agent-done.png', h.shotAlt)}
</div>
</section>
<section class="band">
<div class="wrap">
<div class="tiles">
<div class="tile">
<h2 class="title">${esc(h.tiles.plugin[0])}</h2>
<p class="body">${esc(h.tiles.plugin[1])}</p>
<div class="links"><a class="more" href="${href(c, 'plugin/')}">${esc(h.tiles.plugin[2])}</a></div>
<div class="tile-art"><img src="/images/workspace/list.png" alt="" width="1120" height="1440" loading="lazy" /></div>
</div>
<div class="tile">
<h2 class="title">${esc(h.tiles.openx[0])}</h2>
<p class="body">${esc(h.tiles.openx[1])}</p>
<div class="links"><a class="more" href="${href(c, 'toolsets/')}">${esc(h.tiles.openx[2])}</a></div>
<div class="tile-art"><div class="kinds">${FRAMEWORKS.map((f) => kind(f.id)).join('')}</div></div>
</div>
</div>
</div>
</section>
</main>
${foot(c)}`;
}

function plugin(c) {
  const p = c.plugin;
  const sections = p.sections
    .map(([id, title, body, file, alt], i) => !file ? `<section class="band center">
<div class="wrap">
<h2 class="headline">${esc(title)}</h2>
<p class="lede">${esc(body)}</p>
</div>
</section>` : `<section class="band${i % 2 ? ' grey' : ''}">
<div class="wrap">
<div class="split${i % 2 ? ' flip' : ''}">
<div class="split-text"><h2 class="title">${esc(title)}</h2><p class="body">${esc(body)}</p></div>
<div class="shot"><img src="/images/workspace/${file}" alt="${esc(alt)}" loading="lazy" /></div>
</div>
</div>
</section>`)
    .join('\n');
  const facts = p.facts.map(([icon, h3, body]) => `<div class="fact">${svg(ICON[icon])}<h3>${esc(h3)}</h3><p>${esc(body)}</p></div>`).join('\n');
  const hosts = p.hosts.map(([h3, body, file, alt, stores]) => `<div class="host"><figure class="host-shot"><img src="/images/workspace/${file}" alt="${esc(alt)}" loading="lazy" /><figcaption>${esc(alt.split(/[,，]/)[0])}</figcaption></figure><h3 class="title">${esc(h3)}</h3><p>${esc(body)}</p>${stores.length ? `<div class="stores">${stores.map(([t, u]) => `<a class="btn small" href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`).join('')}</div>` : `<span class="badge">${esc(c.soon)}</span>`}</div>`).join('\n');
  const pickDefault = 'open-spreadsheet';
  const demoTabs = p.demos
    .map(([id, label]) => `<button type="button" role="tab" id="demo-tab-${id}" aria-controls="demo-${id}" aria-selected="${id === pickDefault}" tabindex="${id === pickDefault ? 0 : -1}">${kind(id)}<span>${esc(label)}</span></button>`)
    .join('');
  const demoPanels = p.demos
    .map(([id, , say]) => {
      const [make, install, ask] = p.steps;
      const steps = stepsHtml(c, [[make[0], make[1], ['cmd', DEMO_INIT[id]]], install, [ask[0], ask[1], ['say', say]]]);
      return `<div class="steps" role="tabpanel" id="demo-${id}" aria-labelledby="demo-tab-${id}"${id === pickDefault ? '' : ' hidden'}>\n${steps}\n</div>`;
    })
    .join('\n');
  return `${head(c, 'plugin', p.title, p.desc, 'plugin/')}${nav(c, 'plugin', 'plugin/')}
<main>
<section class="hero" id="overview">
<div class="wrap">
<p class="kicker">${esc(p.kicker)}</p>
<h1 class="display">${esc(p.display).replace('快速完成', '<span class="nowrap">快速完成</span>')}</h1>
<p class="lede">${esc(p.lede).replace(/^(.*?[。.]) ?/, "$1<br />")}</p>
${realShot('agent-done.png', c.home.shotAlt)}
</div>
</section>
${sections}
<section class="band">
<div class="wrap">
<h2 class="headline center">${esc(p.factsTitle)}</h2>
<div class="facts">
${facts}
</div>
</div>
</section>
<section class="band night center">
<div class="wrap">
${svg(ICON.lock).replace('<svg ', '<svg style="width:44px;height:44px;margin:0 auto 22px;color:#f5f5f7" ')}
<h2 class="headline">${esc(p.privacy[0])}</h2>
<p class="lede">${esc(p.privacy[1])}</p>
</div>
</section>
<section class="band grey">
<div class="wrap">
<h2 class="headline center">${esc(p.hostsTitle)}</h2>
<div class="hosts">
${hosts}
</div>
</div>
</section>
<section class="band" id="start">
<div class="wrap">
<h2 class="headline center">${esc(p.startTitle)}</h2>
<p class="lede center">${esc(p.startLede)}</p>
<div class="demo-pick" role="tablist" aria-label="${esc(p.pick)}">${demoTabs}</div>
${demoPanels}
</div>
</section>
</main>
${foot(c)}`;
}

function openx(c) {
  const o = c.openx;
  const principles = o.principles.map(([icon, h3, body]) => `<div class="fact">${svg(ICON[icon])}<h3>${esc(h3)}</h3><p>${esc(body)}</p></div>`).join('\n');
  const card = (f) => `<a class="fw" href="${toolHref(c, f)}"${TOOLS[f.id] ? '' : ' target="_blank" rel="noopener"'}>
${kind(f.id)}
<h3>${f.id}${f.by ? ` <small>${esc(c.by(f.by))}</small>` : ''}</h3>
<p>${esc(o.desc2[f.id])}</p>
</a>`;
  // Ours in two labelled rows: the ones CoStaff Workspace opens, then the rest.
  const inWorkspace = FRAMEWORKS.filter((f) => !f.by && f.plugin).map(card).join('\n');
  const others = FRAMEWORKS.filter((f) => !f.by && !f.plugin).map(card).join('\n');
  // Third-party tools keep their own section; a badge says which ones CoStaff Workspace opens.
  const external = FRAMEWORKS.filter((f) => f.by).map((f) => card(f).replace('</a>', `<div class="fw-foot">${f.plugin ? `<span class="badge">${esc(c.inPlugin)}</span>` : ''}</div>\n</a>`)).join('\n');
  return `${head(c, 'openx', o.title, o.desc, 'toolsets/')}${nav(c, 'openx', 'toolsets/')}
<main>
<section class="hero">
<div class="wrap">
<p class="kicker">${esc(o.kicker)}</p>
<h1 class="display">${esc(o.display).replace('生產力工具', '<span class="nowrap">生產力工具</span>')}</h1>
<p class="lede">${esc(o.lede)}</p>
<div class="kinds" style="margin-top:56px;padding-bottom:84px">${FRAMEWORKS.map((f) => kind(f.id)).join('')}</div>
</div>
</section>
<section class="band grey">
<div class="wrap">
<div class="facts" style="margin-top:0">
${principles}
</div>
</div>
</section>
<section class="band">
<div class="wrap">
<h2 class="headline center">${esc(o.galleryTitle)}</h2>
<h3 class="gallery-label">${esc(c.inPlugin)}</h3>
<div class="gallery">
${inWorkspace}
</div>
<h3 class="gallery-label">${esc(o.othersLabel)}</h3>
<div class="gallery three">
${others}
</div>
</div>
</section>
<section class="band grey">
<div class="wrap">
<h2 class="headline center">${esc(o.externalTitle)}</h2>
<div class="gallery external">
${external}
</div>
</div>
</section>
</main>
${foot(c)}`;
}

function notice(c) {
  const n = c.notice;
  const body = n.body
    .map(([t, v]) => (t === 'p' ? `<p>${esc(v)}</p>` : t === 'h2' ? `<h2>${esc(v)}</h2>` : t === 'ul' ? `<ul>${v.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : `<div class="keep"><p>${esc(v)}</p></div>`))
    .join('\n');
  return `${head(c, 'notice', n.title, n.desc, 'notice/')}${nav(c, 'notice', 'notice/')}
<main>
<section class="band">
<div class="wrap">
<article class="article">
<p class="kicker">${esc(n.kicker)}</p>
<h1 class="display">${esc(n.display)}</h1>
<p class="meta">${esc(n.meta)}</p>
${body}
</article>
</div>
</section>
<section class="band grey center">
<div class="wrap">
<h2 class="headline">${esc(n.next[0])}</h2>
<p class="lede">${esc(n.next[1])}</p>
<div class="actions"><a class="btn" href="${href(c, 'plugin/')}">${esc(n.next[2])}</a></div>
</div>
</section>
</main>
${foot(c)}`;
}

/** The logo guide: the files to download, the colours, spacing and the do's and don'ts. */
function brand(c) {
  const b = c.brand;
  const LOGO = '/images/logo';
  const dl = (file, label) => `<a href="${LOGO}/${file}.svg" download>SVG${label ? ` ${esc(label)}` : ''}</a><a href="${LOGO}/${file}.png" download>PNG${label ? ` ${esc(label)}` : ''}</a>`;
  const assets = b.assets
    .map(([file, bg, h3, body, alt, darkFile]) => `<div class="logo-card">
<div class="logo-preview ${bg}"><img src="${LOGO}/${file}.${file === 'costaff-icon' ? 'svg' : 'png'}" alt="${esc(alt)}" loading="lazy" /></div>
<div class="logo-meta"><h3>${esc(h3)}</h3><p>${esc(body)}</p><div class="logo-dl">${dl(file)}${darkFile ? dl(darkFile, b.dark) : ''}</div></div>
</div>`)
    .join('\n');
  const colours = b.colours
    .map(([hex, name, body]) => `<div class="swatch"><div class="swatch-chip" style="background:${hex}"></div><div class="swatch-meta"><h3>${esc(name)}</h3><code>${hex}</code><p>${esc(body)}</p></div></div>`)
    .join('\n');
  const space = b.space
    .map(([file, h3, body, alt]) => `<figure class="brand-fig"><img src="/images/brand/${file}.png" alt="${esc(alt)}" loading="lazy" /><figcaption><h3>${esc(h3)}</h3><p>${esc(body)}</p></figcaption></figure>`)
    .join('\n');
  const rule = (cls, [h3, items]) => `<div class="rule ${cls}"><h3>${esc(h3)}</h3><ul>${items.map(([t, d]) => `<li><strong>${esc(t)}</strong>${esc(d)}</li>`).join('')}</ul></div>`;
  const avoid = b.avoid
    .map(([file, t, d]) => `<figure><img src="/images/brand/${file}.png" alt="${esc(t)}" loading="lazy" /><figcaption><strong>${esc(t)}</strong>${esc(d)}</figcaption></figure>`)
    .join('\n');
  const section = (grey, title, lede, inner) => `<section class="band${grey ? ' grey' : ''}">
<div class="wrap">
<h2 class="headline center">${esc(title)}</h2>
${lede ? `<p class="lede center">${esc(lede)}</p>\n` : ''}${inner}
</div>
</section>`;
  return `${head(c, 'brand', b.title, b.desc, 'brand/')}${nav(c, 'brand', 'brand/')}
<main class="brand">
<section class="hero">
<div class="wrap">
<img class="brand-mark" src="${LOGO}/costaff-icon.svg" alt="" width="76" height="76" />
<p class="kicker">${esc(b.kicker)}</p>
<h1 class="display">${esc(b.display)}</h1>
<p class="lede">${esc(b.lede)}</p>
<div class="actions"><a class="btn" href="${LOGO}/costaff-brand-assets.zip" download>${esc(b.zip[0])}<span class="btn-note">${esc(b.zip[1])}</span></a></div>
</div>
</section>
${section(false, b.logoTitle, b.logoLede, `<div class="logos">\n${assets}\n</div>`)}
${section(true, b.colourTitle, b.colourLede, `<div class="swatches">\n${colours}\n</div>`)}
${section(false, b.spaceTitle, b.spaceLede, `<div class="brand-figs">\n${space}\n</div>`)}
${section(true, b.rulesTitle, b.rulesLede, `<div class="rules">${rule('ok', b.ok)}${rule('no', b.no)}</div>`)}
${section(false, b.avoidTitle, '', `<div class="avoid">\n${avoid}\n</div>`)}
<section class="band grey">
<div class="wrap">
<article class="article">
<h2>${esc(b.note[0])}</h2>
<p>${esc(b.note[1])}</p>
<div class="keep"><p><strong>${esc(b.ask[0])}</strong> ${esc(b.ask[1])} <a href="mailto:support@costaffs.app">support@costaffs.app</a></p></div>
</article>
</div>
</section>
</main>
${foot(c)}`;
}

/** Content per tool (headline, features, commands, screenshot), from each tool's own README. */
const TOOLS = JSON.parse(readFileSync(path.join(ROOT, 'scripts', 'tools.json'), 'utf8'));
/** Where a tool's page lives: ours on this site, open-slide on its own. */
const toolHref = (c, f) => (TOOLS[f.id] ? href(c, `${f.id}/`) : f.site ?? `https://github.com/${f.repo}`);

function toolPage(c, f) {
  const d = TOOLS[f.id];
  const t = d[c.lang === 'en' ? 'en' : 'zh'];
  const ui = c.tool;
  const facts = t.features.map(([icon, h3, body]) => `<div class="fact">${svg(ICON[icon] ?? ICON.check)}<h3>${esc(h3)}</h3><p>${esc(body)}</p></div>`).join('\n');
  const steps = stepsHtml(c, [
    [ui.steps[0][0], ui.steps[0][1], ['cmd', d.init]],
    [ui.steps[1][0], ui.steps[1][1], ['cmd', d.dev]],
    [ui.steps[2][0], ui.steps[2][1], ['say', t.prompt]],
  ]);
  const shot = d.image ? `<div class="window real tool-shot"><img src="/images/tools/${esc(d.image.file)}" alt="${esc(d.image.alt[c.lang === 'en' ? 'en' : 'zh'])}" width="${d.image.w}" height="${d.image.h}" /></div>` : '';
  const others = FRAMEWORKS.filter((o) => o.id !== f.id)
    .map((o) => `<a class="tool-chip" href="${toolHref(c, o)}"${TOOLS[o.id] ? '' : ' target="_blank" rel="noopener"'}>${kind(o.id)}<span>${o.id}</span></a>`).join('\n');
  const slug = `${f.id}/`;
  return `${head(c, 'openx', `${f.id} — ${t.display}`, t.lede, slug)}${nav(c, 'openx', slug)}
<main>
<section class="hero tool-hero" style="--tool:${f.color}">
<div class="wrap">
${kind(f.id).replace('class="kind"', 'class="kind tool-mark"')}
<p class="kicker">${f.id}</p>
<h1 class="display">${esc(t.display)}</h1>
<p class="lede">${esc(t.lede)}</p>
<div class="tool-actions">
${cmdBox(c, d.init, ' hero-cmd')}
<a class="btn ghost" href="https://github.com/${f.repo}" target="_blank" rel="noopener">${esc(ui.github)}</a>
</div>
${shot}
</div>
</section>
<section class="band grey">
<div class="wrap">
<h2 class="headline center">${esc(ui.whatTitle)}</h2>
<div class="facts">
${facts}
</div>
</div>
</section>
<section class="band" id="start">
<div class="wrap">
<h2 class="headline center">${esc(ui.startTitle)}</h2>
<div class="steps">
${steps}
</div>
</div>
</section>
${f.plugin ? `<section class="band night center">
<div class="wrap">
<h2 class="headline">${esc(ui.wsTitle)}</h2>
<p class="lede">${esc(ui.wsBody)}</p>
<div class="actions"><a class="btn light" href="${href(c, 'plugin/')}">${esc(ui.wsCta)}</a></div>
</div>
</section>
` : ''}<section class="band grey center">
<div class="wrap">
<h2 class="headline">${esc(ui.moreTitle)}</h2>
<div class="tool-chips">
${others}
</div>
<div class="actions"><a class="more" href="${href(c, 'toolsets/')}">${esc(ui.allTools)}</a></div>
</div>
</section>
</main>
${foot(c)}`;
}

// ---------- write ----------

const PAGES = { '': home, 'plugin/': plugin, 'toolsets/': openx, 'notice/': notice, 'brand/': brand };
let built = 0;
const write = (rel, html) => {
  const dir = path.join(ROOT, rel);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), html);
  built++;
};
/** The old address of the toolsets page: sends visitors (and search engines) on. */
const redirect = (to) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Moved</title>
<link rel="canonical" href="https://costaffs.app${to}" />
<meta http-equiv="refresh" content="0; url=${to}" />
<meta name="robots" content="noindex" />
</head>
<body><a href="${to}">${to}</a></body>
</html>
`;
for (const c of Object.values(COPY)) {
  for (const [slug, render] of Object.entries(PAGES)) write(path.join(c.prefix, slug), render(c));
  write(path.join(c.prefix, 'open-x/'), redirect(`${c.prefix}/toolsets/`));
  for (const f of FRAMEWORKS) if (TOOLS[f.id]) write(path.join(c.prefix, `${f.id}/`), toolPage(c, f));
}
console.log(`built ${built} pages`);
