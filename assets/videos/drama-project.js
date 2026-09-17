(() => {
  const data = window.PROJECT_DATA;
  if (!data) return;

  const typeLabel = data.typeLabel || 'AIGC DRAMA';
  const typeTitle = data.typeTitle || 'AIGC 漫剧';
  const assetCopy = data.assetCopy || '人物、场景与道具按制作资产分类展示；点击任意画面可进入完整比例查看。';
  const nextTitle = data.nextTitle || '继续浏览\n其他影像项目。';
  const compactNarrative = data.compactNarrative !== false;
  document.body.classList.toggle('compact-narrative', compactNarrative);

  document.body.insertAdjacentHTML('afterbegin', `
    <header class="topbar shell"><a class="brand" href="/">Yibo Gao</a><a class="back" href="/videos/">← 返回视频</a></header>
    <main>
      <section class="hero shell" aria-labelledby="projectTitle">
        <div><p class="eyebrow" id="projectIndex"></p><h1 id="projectTitle"></h1></div>
        <div><p class="hero-copy" id="projectIntro"></p><div class="hero-meta" id="heroMeta"></div></div>
      </section>
      <section class="film-section shell" aria-label="项目成片"><div class="film-grid" id="filmGrid"></div></section>
      <div class="content">
        ${compactNarrative ? `<nav class="narrative-nav shell" aria-label="剧本与分镜" role="tablist"><button type="button" data-narrative-target="script" role="tab" aria-selected="false"><small>01 / SCRIPT</small><strong>查看剧本</strong><span>→</span></button><button type="button" data-narrative-target="storyboard" role="tab" aria-selected="false"><small>02 / STORYBOARD</small><strong>查看分镜</strong><span>→</span></button></nav>` : ''}
        <section class="section shell narrative-panel" data-narrative-panel="script" aria-labelledby="storyTitle"${compactNarrative ? ' aria-hidden="true"' : ''}>
          <div class="section-head"><div><p class="section-index">01 / SCRIPT</p><h2 id="storyTitle">剧本内容</h2></div><p class="section-copy">从核心创意到段落推进，保留脚本中的叙事结构、视觉逻辑与制作重点。</p></div>
          <div class="story-grid"><article class="story-card reveal"><small>Story / 创意主线</small><p id="storyLogline"></p></article><article class="story-card story-card--accent reveal"><small>Direction / 视觉命题</small><p id="storyTheme"></p></article></div>
          <div class="episode-grid" id="episodeGrid"></div>
        </section>
        <section class="section narrative-panel" data-narrative-panel="storyboard" aria-labelledby="boardTitle"${compactNarrative ? ' aria-hidden="true"' : ''}>
          <div class="section-head shell"><div><p class="section-index">02 / STORYBOARD</p><h2 id="boardTitle">分镜拆解</h2></div><p class="section-copy">将原分镜表中的时间、画面、动作与机位转译为可横向浏览的镜头卡片。</p></div>
          <div class="storyboard-strip" id="storyboardStrip"></div>
        </section>
        <section class="section shell" aria-labelledby="assetsTitle">
          <div class="section-head"><div><p class="section-index">03 / VISUAL ASSETS</p><h2 id="assetsTitle">视觉资产</h2></div><p class="section-copy">${assetCopy}</p></div>
          <div class="asset-tabs" id="assetTabs" role="tablist" aria-label="视觉资产分类"></div>
          <div id="assetsRoot"></div>
        </section>
      </div>
      <section class="project-next"><div class="next-inner shell"><div><p class="section-index" style="color:rgba(255,255,255,.7)">${typeLabel} INDEX</p><h2>${nextTitle.replace(/\n/g, '<br>')}</h2></div><a href="/videos/">返回项目索引 ↗</a></div></section>
    </main>
    <footer class="footer shell"><span>AIGC CONTENT CREATOR</span><span>© 2026 YIBO GAO</span></footer>
    <dialog id="viewer" aria-label="全屏资产查看器"><div class="viewer"><button class="viewer-close" type="button">× CLOSE</button><button class="viewer-arrow viewer-prev" type="button" aria-label="上一张">←</button><div class="viewer-media"><img id="viewerImage" src="" alt=""></div><button class="viewer-arrow viewer-next" type="button" aria-label="下一张">→</button><div class="viewer-meta"><span class="viewer-title" id="viewerTitle"></span><span id="viewerCount"></span></div></div></dialog>
  `);

  document.documentElement.style.setProperty('--accent', data.accent || '#0a8fd1');
  document.title = `《${data.title}》${typeTitle} — 高一博`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = `${typeTitle}《${data.title}》成片、剧本、分镜与视觉资产展示。`;

  const $ = (selector, root = document) => root.querySelector(selector);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const pad = value => String(value).padStart(2, '0');

  $('#projectIndex').textContent = `${pad(data.index)} / ${typeLabel}`;
  $('#projectTitle').textContent = data.title;
  $('#projectIntro').textContent = data.intro;
  const heroMeta = $('#heroMeta');
  [data.genre, data.format, data.assetLine].filter(Boolean).forEach(item => heroMeta.append(el('span', '', item)));

  const filmGrid = $('#filmGrid');
  if (data.videos.length === 1) filmGrid.classList.add('is-single');
  data.videos.forEach(video => {
    const figure = el('figure', 'film-card reveal');
    const frame = el('div', 'film-frame');
    const button = el('button', 'film-cover');
    button.type = 'button';
    button.setAttribute('aria-label', `播放《${data.title}》${video.label}`);
    const image = el('img');
    image.src = video.cover || data.cover;
    image.alt = `${data.title}${video.label}视频封面`;
    image.loading = 'eager';
    button.append(image, el('span', 'play', '▶'));
    frame.append(button);
    const caption = el('figcaption', 'film-caption');
    caption.append(el('strong', '', video.label), el('span', '', video.note || 'BILIBILI / FULL FILM'));
    figure.append(frame, caption);
    filmGrid.append(figure);
    button.addEventListener('click', () => {
      const iframe = el('iframe');
      iframe.src = `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(video.bvid)}&autoplay=1&high_quality=1&danmaku=0`;
      iframe.title = `《${data.title}》${video.label}`;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      frame.replaceChildren(iframe);
    });
  });

  $('#storyLogline').textContent = data.logline;
  $('#storyTheme').textContent = data.theme;
  const episodeGrid = $('#episodeGrid');
  (data.episodes || []).forEach(episode => {
    const card = el('article', 'episode-card reveal');
    card.append(el('span', '', episode.no), el('h3', '', episode.title));
    if (episode.summary) card.append(el('p', '', episode.summary));
    episodeGrid.append(card);
  });

  const storyboard = $('#storyboardStrip');
  (data.storyboard || []).forEach(shot => {
    const card = el('article', 'shot-card reveal');
    const top = el('div', 'shot-top');
    top.append(el('strong', '', shot.shot), el('span', '', shot.time || ''));
    card.append(top, el('h3', '', shot.visual));
    if (shot.action) card.append(el('p', '', shot.action));
    const details = el('div', 'shot-meta');
    if (shot.camera) {
      const row = el('div'); row.append(el('span', '', '镜头 / '), document.createTextNode(shot.camera)); details.append(row);
    }
    if (shot.purpose) {
      const row = el('div'); row.append(el('span', '', '作用 / '), document.createTextNode(shot.purpose)); details.append(row);
    }
    card.append(details);
    storyboard.append(card);
  });

  if (compactNarrative) {
    const narrativeNav = $('.narrative-nav');
    const narrativePanels = [...document.querySelectorAll('[data-narrative-panel]')];
    narrativeNav.addEventListener('click', event => {
      const button = event.target.closest('[data-narrative-target]');
      if (!button) return;
      const target = button.dataset.narrativeTarget;
      [...narrativeNav.children].forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      narrativePanels.forEach(panel => {
        const active = panel.dataset.narrativePanel === target;
        panel.classList.toggle('is-active', active);
        panel.setAttribute('aria-hidden', String(!active));
      });
      requestAnimationFrame(() => document.querySelector(`[data-narrative-panel="${target}"]`)?.scrollIntoView({behavior:'smooth', block:'start'}));
    });
  }

  const defaults = {characters: ['人物资产', 'character'], scenes: ['场景资产', 'scene'], props: ['道具资产', 'prop']};
  const groups = data.assetGroups || Object.entries(data.assets || {}).map(([key, labels]) => ({key, title: defaults[key]?.[0] || key, kind: defaults[key]?.[1] || 'prop', labels}));
  groups.forEach(group => {
    if (!group.labels) group.labels = Array.from({length: group.count || 0}, (_, index) => `${group.labelPrefix || group.title.replace('资产', '')} ${pad(index + 1)}`);
    group.dir = group.dir || group.key;
  });

  const viewerItems = [];
  groups.forEach(group => group.labels.forEach((label, index) => {
    const src = group.paths?.[index] || `/assets/videos/${data.slug}/${group.dir}/${pad(index + 1)}.jpg`;
    group.viewerIndexes ||= [];
    group.viewerIndexes.push(viewerItems.push({src, title: label, group: group.title}) - 1);
  }));

  const viewer = $('#viewer');
  const viewerImage = $('#viewerImage');
  const viewerTitle = $('#viewerTitle');
  const viewerCount = $('#viewerCount');
  let current = 0;
  function renderViewer(index) {
    current = (index + viewerItems.length) % viewerItems.length;
    const item = viewerItems[current];
    viewerImage.src = item.src;
    viewerImage.alt = item.title;
    viewerTitle.textContent = `${item.group} · ${item.title}`;
    viewerCount.textContent = `${pad(current + 1)} / ${pad(viewerItems.length)}`;
  }
  function openViewer(index) {
    renderViewer(index);
    viewer.showModal();
    document.body.classList.add('modal-open');
  }
  function closeViewer() {
    viewer.close();
    document.body.classList.remove('modal-open');
  }

  const tabs = $('#assetTabs');
  const assetsRoot = $('#assetsRoot');
  tabs.style.setProperty('--asset-tab-count', Math.min(groups.length, 5));
  groups.forEach((group, groupIndex) => {
    const tab = el('button', groupIndex === 0 ? 'is-active' : '');
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(groupIndex === 0));
    tab.dataset.assetPanel = `asset-panel-${groupIndex}`;
    tab.append(el('small', '', `${pad(groupIndex + 1)} / ${pad(group.labels.length)}`), document.createTextNode(group.title));
    tabs.append(tab);

    const panel = el('section', `asset-panel${groupIndex === 0 ? ' is-active' : ''}`);
    panel.id = `asset-panel-${groupIndex}`;
    panel.setAttribute('role', 'tabpanel');

    if (group.kind === 'character') {
      const browser = el('div', 'character-browser');
      const stage = el('button', 'character-stage reveal');
      stage.type = 'button';
      const stageImage = el('img');
      const stageMeta = el('span', 'stage-meta');
      const stageTitle = el('strong');
      const stageCount = el('span');
      stageMeta.append(stageTitle, stageCount);
      stage.append(stageImage, stageMeta);
      const list = el('div', 'character-list');
      let selected = 0;
      const select = index => {
        selected = index;
        stageImage.src = viewerItems[group.viewerIndexes[index]].src;
        stageImage.alt = group.labels[index];
        stageTitle.textContent = group.labels[index];
        stageCount.textContent = `${pad(index + 1)} / ${pad(group.labels.length)}`;
        [...list.children].forEach((button, buttonIndex) => button.classList.toggle('is-active', buttonIndex === index));
      };
      group.labels.forEach((label, index) => {
        const button = el('button', index === 0 ? 'is-active' : '');
        button.type = 'button';
        const thumb = el('img');
        thumb.src = viewerItems[group.viewerIndexes[index]].src;
        thumb.alt = '';
        thumb.loading = 'lazy';
        button.append(thumb, el('span', '', label), el('span', '', '→'));
        button.addEventListener('click', () => select(index));
        list.append(button);
      });
      stage.addEventListener('click', () => openViewer(group.viewerIndexes[selected]));
      select(0);
      browser.append(stage, list);
      panel.append(browser);
    } else if (group.kind === 'scene') {
      const tools = el('div', 'scene-tools');
      const previous = el('button', '', '←');
      const next = el('button', '', '→');
      previous.type = next.type = 'button';
      previous.setAttribute('aria-label', `向前浏览${group.title}`);
      next.setAttribute('aria-label', `向后浏览${group.title}`);
      tools.append(previous, next);
      const strip = el('div', 'scene-strip');
      group.labels.forEach((label, index) => {
        const card = el('figure', 'scene-card reveal');
        const button = el('button', 'asset-open');
        button.type = 'button';
        button.setAttribute('aria-label', `全屏查看${label}`);
        const image = el('img');
        image.src = viewerItems[group.viewerIndexes[index]].src;
        image.alt = `${data.title}${group.title}：${label}`;
        image.loading = 'lazy';
        button.append(image);
        const caption = el('figcaption');
        caption.append(el('strong', '', label), el('span', '', `${pad(index + 1)} / ${pad(group.labels.length)}`));
        button.addEventListener('click', () => openViewer(group.viewerIndexes[index]));
        card.append(button, caption);
        strip.append(card);
      });
      previous.addEventListener('click', () => strip.scrollBy({left: -strip.clientWidth * .8, behavior: 'smooth'}));
      next.addEventListener('click', () => strip.scrollBy({left: strip.clientWidth * .8, behavior: 'smooth'}));
      panel.append(tools, strip);
    } else {
      const grid = el('div', 'asset-grid');
      group.labels.forEach((label, index) => {
        const card = el('figure', 'asset-card reveal');
        const button = el('button', 'asset-open');
        button.type = 'button';
        button.setAttribute('aria-label', `全屏查看${label}`);
        const image = el('img');
        image.src = viewerItems[group.viewerIndexes[index]].src;
        image.alt = `${data.title}${group.title}：${label}`;
        image.loading = 'lazy';
        button.append(image);
        const caption = el('figcaption');
        caption.append(el('strong', '', label), el('span', '', `${pad(index + 1)} / ${pad(group.labels.length)}`));
        button.addEventListener('click', () => openViewer(group.viewerIndexes[index]));
        card.append(button, caption);
        grid.append(card);
      });
      panel.append(grid);
    }
    assetsRoot.append(panel);
  });

  tabs.addEventListener('click', event => {
    const button = event.target.closest('[data-asset-panel]');
    if (!button) return;
    [...tabs.children].forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    [...assetsRoot.children].forEach(panel => panel.classList.toggle('is-active', panel.id === button.dataset.assetPanel));
  });

  $('.viewer-close', viewer).addEventListener('click', closeViewer);
  $('.viewer-prev', viewer).addEventListener('click', () => renderViewer(current - 1));
  $('.viewer-next', viewer).addEventListener('click', () => renderViewer(current + 1));
  viewer.addEventListener('cancel', event => { event.preventDefault(); closeViewer(); });
  viewer.addEventListener('click', event => { if (event.target === viewer) closeViewer(); });
  document.addEventListener('keydown', event => {
    if (!viewer.open) return;
    if (event.key === 'ArrowLeft') renderViewer(current - 1);
    if (event.key === 'ArrowRight') renderViewer(current + 1);
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold: .08, rootMargin: '0px 0px -5%'});
    reveals.forEach(item => observer.observe(item));
  } else {
    reveals.forEach(item => item.classList.add('is-visible'));
  }
})();
