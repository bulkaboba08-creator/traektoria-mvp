/* ==========================================================================
   «Траектория» — вкладка «Кадровое планирование и прогноз КЦП» (strategic.html)
   Подключение: data.js -> bashmap.js -> govdata.js -> shared.js -> strategic.js
   Все визуализации — рукописный inline-SVG, без внешних библиотек (работает офлайн).
   ========================================================================== */

(function () {
  'use strict';

  UI.renderHeader('strategic');
  UI.renderBottomNav('strategic');
  UI.renderFooter();

  var MAP = window.BASHMAP;
  var GOV = window.GOV;
  var UNI = window.DB.strategic.universities;

  /* ---------- Состояние ---------- */
  var ROBO = GOV.roboLevels;            // [0,20,50,80]
  var HORIZONS = [
    { key: 'tactic',     label: 'Тактика · 7 лет (до 2033)', max: 2033 },
    { key: 'demography', label: 'Демография · 15 лет',       max: 2041 },
    { key: 'strategy',   label: 'Стратегия · 30 лет',        max: 2056 }
  ];
  var STATE = { industry: 'Все', district: null, horizon: 'tactic', robo: 0 };

  /* ---------- Цвет по индексу дефицита ---------- */
  var IDX_TIERS = [
    { min: 1.5,  color: '#C62828', label: 'Критический голод', note: 'индекс > 1.5' },
    { min: 0.8,  color: '#E7B23A', label: 'Баланс',            note: '0.8 – 1.5' },
    { min: 0,    color: '#2E9E5B', label: 'Профицит кадров',   note: 'индекс < 0.8' }
  ];
  function tierOf(idx) {
    for (var i = 0; i < IDX_TIERS.length; i++) if (idx >= IDX_TIERS[i].min) return IDX_TIERS[i];
    return IDX_TIERS[IDX_TIERS.length - 1];
  }
  function statOf(name, industry) {
    var d = GOV.districts[name];
    return d ? d.by[industry] : null;
  }

  /* ---------- Прогноз: индекс по годам ---------- */
  var FC = {};
  GOV.forecast.forEach(function (p) { FC[p.year] = p; });
  function roboFrac() { return ROBO[STATE.robo] / 100 * 0.45; }
  function ramp(y) { return Math.max(0, Math.min(1, (y - 2042) / (2056 - 2042))); }
  function demandAdj(y) { return FC[y].demand * (1 - roboFrac() * ramp(y)); }

  /* ---------- Региональные агрегаты по отрасли (для district = null) ---------- */
  var REGION = {};
  (function () {
    GOV.industries.forEach(function (ind) {
      var v = 0, g = 0, r = 0, n = 0;
      for (var name in GOV.districts) {
        var s = GOV.districts[name].by[ind];
        v += s.vac; g += s.grad; r += GOV.districts[name].retire; n++;
      }
      REGION[ind] = { vac: v, grad: g, idx: +(v / g).toFixed(2), retire: Math.round(r / n) };
    });
  })();

  /* ==========================================================================
     KPI
     ========================================================================== */
  function renderKpis() {
    var host = document.getElementById('kpi-row');
    host.innerHTML = window.DB.strategic.kpis.map(function (c) {
      return '<div class="kpi-card"><span class="kpi-value">' + UI.escapeHtml(c.value) + '</span>' +
        '<span class="kpi-label">' + UI.escapeHtml(c.label) + '</span>' +
        (c.trend ? '<span class="kpi-trend">' + UI.escapeHtml(c.trend) + '</span>' : '') + '</div>';
    }).join('');
  }

  /* ==========================================================================
     Шаг 1. Карта дисбаланса
     ========================================================================== */
  var mapPaths = [];
  function buildMap() {
    var host = document.getElementById('bash-map');
    var W = MAP.viewBox[0], H = MAP.viewBox[1];
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'role="img" aria-label="Карта кадрового дисбаланса по районам Республики Башкортостан">' +
      MAP.districts.map(function (d, i) {
        return '<path d="' + d.path + '" data-i="' + i + '"></path>';
      }).join('') + '</svg>';
    host.innerHTML = svg;
    mapPaths = [].slice.call(host.querySelectorAll('path'));

    var tip = document.getElementById('map-tooltip');
    var wrap = host.parentElement;
    function showTip(name, cx, cy) {
      var s = statOf(name, STATE.industry);
      if (!s) return;
      var t = tierOf(s.idx);
      tip.innerHTML = '<b>' + UI.escapeHtml(name) + '</b>' +
        'Незакрытых вакансий: ' + UI.formatNumber(s.vac) + '<br>' +
        '<span class="mt-idx" style="background:' + t.color + ';color:#fff">индекс ' + s.idx.toFixed(2) + ' · ' + t.label + '</span>' +
        '<ol><li>' + s.top.map(UI.escapeHtml).join('</li><li>') + '</li></ol>';
      var box = wrap.getBoundingClientRect();
      var x = cx - box.left + 14, y = cy - box.top + 14;
      if (x > box.width - 170) x = cx - box.left - 180;
      if (y > box.height - 120) y = box.height - 120;
      tip.style.left = Math.max(0, x) + 'px';
      tip.style.top = Math.max(4, y) + 'px';
      tip.classList.add('show');
    }
    function hideTip() { tip.classList.remove('show'); }

    host.addEventListener('mousemove', function (e) {
      var p = e.target.closest('path');
      if (!p) { hideTip(); return; }
      showTip(MAP.districts[+p.getAttribute('data-i')].name, e.clientX, e.clientY);
    });
    host.addEventListener('mouseleave', hideTip);
    host.addEventListener('click', function (e) {
      var p = e.target.closest('path');
      if (!p) return;
      selectDistrict(MAP.districts[+p.getAttribute('data-i')].name);
    });
  }

  function recolorMap() {
    mapPaths.forEach(function (p) {
      var name = MAP.districts[+p.getAttribute('data-i')].name;
      var s = statOf(name, STATE.industry);
      p.setAttribute('fill', s ? tierOf(s.idx).color : '#E3E7F0');
    });
    highlightSelected();
  }
  function highlightSelected() {
    mapPaths.forEach(function (p) {
      var name = MAP.districts[+p.getAttribute('data-i')].name;
      if (name === STATE.district) p.classList.add('sel'); else p.classList.remove('sel');
    });
  }

  function renderIndFilter() {
    var host = document.getElementById('ind-filter');
    host.innerHTML = GOV.industries.map(function (ind) {
      return '<button type="button" class="chip' + (ind === STATE.industry ? ' active' : '') + '" data-ind="' + ind + '">' +
        UI.escapeHtml(ind) + '</button>';
    }).join('');
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      STATE.industry = b.getAttribute('data-ind');
      [].forEach.call(host.children, function (c) { c.classList.toggle('active', c === b); });
      recolorMap();
      renderTopList();
      updateRecommendations();
    });
  }

  function renderLegend() {
    document.getElementById('map-legend').innerHTML = IDX_TIERS.map(function (t) {
      return '<div class="legend-row"><span class="legend-sw" style="background:' + t.color + '"></span>' +
        UI.escapeHtml(t.label) + ' <small>(' + UI.escapeHtml(t.note) + ')</small></div>';
    }).join('');
  }

  function renderTopList() {
    var host = document.getElementById('top-list');
    var rows = MAP.districts.map(function (d) {
      return { name: d.name, s: statOf(d.name, STATE.industry) };
    }).filter(function (r) { return r.s; })
      .sort(function (a, b) { return b.s.idx - a.s.idx; }).slice(0, 6);
    host.innerHTML = rows.map(function (r) {
      return '<li data-name="' + UI.escapeHtml(r.name) + '">' +
        '<span class="tl-dot" style="background:' + tierOf(r.s.idx).color + '"></span>' +
        '<span class="tl-name">' + UI.escapeHtml(r.name) + '</span>' +
        '<span class="tl-val">' + r.s.idx.toFixed(2) + '</span></li>';
    }).join('');
    host.onclick = function (e) {
      var li = e.target.closest('li');
      if (li) selectDistrict(li.getAttribute('data-name'));
    };
  }

  function selectDistrict(name) {
    STATE.district = (STATE.district === name) ? null : name;
    highlightSelected();
    updateRecommendations();
  }

  /* ==========================================================================
     Шаг 2. Прогноз кадровой потребности
     ========================================================================== */
  function setHorizon(key) {
    STATE.horizon = key;
    var host = document.getElementById('horizon-seg');
    [].forEach.call(host.children, function (c) {
      c.classList.toggle('active', c.getAttribute('data-h') === key);
    });
    renderForecast();
    renderReadout();
  }

  function renderHorizonSeg() {
    var host = document.getElementById('horizon-seg');
    host.innerHTML = HORIZONS.map(function (h) {
      return '<button type="button" data-h="' + h.key + '" class="' + (h.key === STATE.horizon ? 'active' : '') + '">' +
        UI.escapeHtml(h.label) + '</button>';
    }).join('');
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) setHorizon(b.getAttribute('data-h'));
    });
  }

  function horizonMax() {
    for (var i = 0; i < HORIZONS.length; i++) if (HORIZONS[i].key === STATE.horizon) return HORIZONS[i].max;
    return 2033;
  }

  function renderForecast() {
    var host = document.getElementById('forecast-chart');
    var xMin = 2026, xMax = horizonMax();
    var W = 760, H = 340, padTop = 30, padBottom = 42, padLeft = 44, padRight = 20;
    var baseY = H - padBottom, plotH = baseY - padTop, plotW = W - padLeft - padRight;
    var yMin = 6, yMax = 18;
    function px(y) { return padLeft + plotW * (y - xMin) / (xMax - xMin); }
    function py(v) { return baseY - plotH * (v - yMin) / (yMax - yMin); }
    var years = [];
    for (var y = xMin; y <= xMax; y++) years.push(y);

    var parts = [];

    /* Зоны (вертикальные полосы в пределах видимого диапазона) */
    var ZBANDS = [
      { a: 2026, b: 2033, fill: '#E7EEFF', label: 'Тактика' },
      { a: 2034, b: 2041, fill: '#F0EAFA', label: 'Демография' },
      { a: 2042, b: 2056, fill: '#FBE8E8', label: 'Стратегия' }
    ];
    ZBANDS.forEach(function (z) {
      var a = Math.max(z.a, xMin), b = Math.min(z.b, xMax);
      if (a >= b) return;
      var x1 = px(a), x2 = px(b);
      parts.push('<rect class="zone-band" x="' + x1.toFixed(1) + '" y="' + padTop + '" width="' + (x2 - x1).toFixed(1) +
        '" height="' + plotH.toFixed(1) + '" fill="' + z.fill + '"/>');
      parts.push('<text class="zone-label" x="' + ((x1 + x2) / 2).toFixed(1) + '" y="' + (padTop + 14) +
        '" text-anchor="middle" fill="var(--text-2)">' + z.label + '</text>');
    });

    /* Сетка + ось Y */
    [8, 12, 16].forEach(function (v) {
      var yy = py(v).toFixed(1);
      parts.push('<line class="lc-grid" x1="' + padLeft + '" y1="' + yy + '" x2="' + (W - padRight) + '" y2="' + yy + '"/>');
      parts.push('<text class="lc-ylabel" x="' + (padLeft - 8) + '" y="' + (py(v) + 4).toFixed(1) + '" text-anchor="end">' + v + '</text>');
    });

    function path(fn) {
      return 'M' + years.map(function (y, i) { return px(y).toFixed(1) + ',' + py(fn(y)).toFixed(1); }).join(' L');
    }
    /* Область под планом */
    parts.push('<path class="lc-planarea" d="M' + px(xMin).toFixed(1) + ',' + baseY + ' L' +
      years.map(function (y) { return px(y).toFixed(1) + ',' + py(FC[y].supplyPlan).toFixed(1); }).join(' L') +
      ' L' + px(xMax).toFixed(1) + ',' + baseY + ' Z"/>');

    parts.push('<path class="lc-ceil" d="' + path(function (y) { return FC[y].demoCeil; }) + '"/>');
    parts.push('<path class="lc-plan" d="' + path(function (y) { return FC[y].supplyPlan; }) + '"/>');
    parts.push('<path class="lc-demand" d="' + path(function (y) { return demandAdj(y); }) + '"/>');
    parts.push('<line class="lc-axis" x1="' + padLeft + '" y1="' + baseY + '" x2="' + (W - padRight) + '" y2="' + baseY + '"/>');

    /* Подписи X — границы зон в пределах диапазона */
    [2026, 2033, 2041, 2056].forEach(function (y) {
      if (y < xMin || y > xMax) return;
      parts.push('<text class="lc-xlabel" x="' + px(y).toFixed(1) + '" y="' + (baseY + 22) + '" text-anchor="middle">' + y + '</text>');
    });

    host.innerHTML = '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'role="img" aria-label="Прогноз кадровой потребности и КЦП">' + parts.join('') + '</svg>';
  }

  function renderReadout() {
    var host = document.getElementById('kcp-readout');
    var html = '';
    if (STATE.horizon === 'tactic') {
      var kcp = Math.round(FC[2033].demand * 1000);
      var growth = Math.round((FC[2033].demand - FC[2026].supplyPlan) / FC[2026].supplyPlan * 100);
      html = '<b>≈ ' + UI.formatNumber(kcp) + '</b>' +
        '<span>рекомендованных бюджетных мест в год к 2033 (инженерно-технический профиль РБ) · +' + growth + '% к текущему выпуску</span>';
    } else if (STATE.horizon === 'demography') {
      var minY = 2039, ceil = Math.round(FC[minY].demoCeil * 1000);
      html = '<b>' + UI.formatNumber(ceil) + '</b>' +
        '<span>демографический потолок абитуриентов в год к ' + minY + ' — прогнозируется провал когорт 2035–2043 годов</span>';
    } else {
      var d2056 = demandAdj(2056), base = FC[2056].demand;
      var drop = Math.round((base - d2056) / base * 100);
      html = '<b>−' + drop + '%</b>' +
        '<span>снижение потребности в рутинных инженерных кадрах к 2056 при роботизации ' + ROBO[STATE.robo] + '% (потребность ≈ ' +
        UI.formatNumber(Math.round(d2056 * 1000)) + ' чел./год)</span>';
    }
    host.innerHTML = html;
  }

  function bindRobo() {
    var range = document.getElementById('robo-range');
    var val = document.getElementById('robo-val');
    range.addEventListener('input', function () {
      STATE.robo = +range.value;
      val.textContent = ROBO[STATE.robo] + '%';
      // эффект роботизации виден на дальнем горизонте — сразу показываем его
      if (STATE.horizon !== 'strategy') {
        setHorizon('strategy');
      } else {
        renderForecast();
        renderReadout();
      }
      updateRecommendations();
    });
  }

  /* ---------- Директивные КЦП по вузам ---------- */
  function renderKcpTable() {
    var tbody = document.querySelector('#kcp-table tbody');
    var prioClass = { 'высокий': 'prio-high', 'средний': 'prio-mid', 'низкий': 'prio-low' };
    tbody.innerHTML = UNI.map(function (u) {
      var delta = u.recommended - u.current, up = delta >= 0;
      return '<tr>' +
        '<td><div>' + UI.escapeHtml(u.uni) + '</div><div class="kcp-dir">' + UI.escapeHtml(u.direction) + '</div></td>' +
        '<td class="muted">' + u.current + '</td>' +
        '<td style="font-weight:700;color:var(--primary)">' + u.recommended + '</td>' +
        '<td class="kcp-delta ' + (up ? 'up' : 'down') + '">' + (up ? '+' : '−') + Math.abs(delta) + '</td>' +
        '<td><span class="prio ' + (prioClass[u.priority] || 'prio-low') + '">' + UI.escapeHtml(u.priority) + '</span></td>' +
      '</tr>';
    }).join('');
  }

  /* ==========================================================================
     Шаг 3. Автоматические директивы системы
     ========================================================================== */
  function updateRecommendations() {
    var host = document.getElementById('system-recommendations');
    var scope = STATE.district || 'Республике Башкортостан';
    var s = STATE.district ? statOf(STATE.district, STATE.industry) : REGION[STATE.industry];
    var retire = STATE.district ? GOV.districts[STATE.district].retire : REGION[STATE.industry].retire;
    var top1 = STATE.district ? statOf(STATE.district, STATE.industry).top[0]
      : GOV.districts['Уфа'].by[STATE.industry].top[0];
    var kcpPct = Math.max(1, Math.min(42, Math.round((s.idx - 1.0) * 9 + 2)));
    var releasePct = Math.round(ROBO[STATE.robo] * 0.30 + 6);
    var indPhrase = STATE.industry === 'Все' ? 'инженерно-технических отраслей' : 'отрасли «' + STATE.industry + '»';
    var loc = STATE.district ? ('районе <b>' + UI.escapeHtml(STATE.district) + '</b>') : ('<b>' + scope + '</b>');

    host.innerHTML =
      'Рекомендация ИС «Траектория» для Министерства образования и науки РБ: анализ возрастной структуры (данные СФР) ' +
      'предприятий ' + indPhrase + ' в ' + loc + ' указывает на выбытие <b>' + retire + '%</b> ведущих специалистов к 2033 году. ' +
      'Рекомендуется увеличить КЦП (бюджетные места) по направлению «<b>' + UI.escapeHtml(top1) + '</b>» на <b>' + kcpPct + '%</b> ' +
      'начиная с приёма 2027 года. На горизонте до 2050 года при уровне автоматизации <b>' + ROBO[STATE.robo] + '%</b> ' +
      'прогнозируется высвобождение <b>' + releasePct + '%</b> кадров низшего технического звена за счёт роботизации производственных линий.';
  }

  function bindExport() {
    ['export-pdf', 'export-xlsx'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', function () { UI.toast('Демо-версия: экспорт недоступен'); });
    });
  }

  /* ---------- Инициализация ---------- */
  renderKpis();
  buildMap();
  renderIndFilter();
  renderLegend();
  recolorMap();
  renderTopList();
  renderHorizonSeg();
  renderForecast();
  renderReadout();
  bindRobo();
  renderKcpTable();
  updateRecommendations();
  bindExport();
})();
