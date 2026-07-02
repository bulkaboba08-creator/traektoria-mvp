/* ==========================================================================
   «Траектория» — скрипт страницы аналитики региона (analytics.html)
   Порядок подключения: js/data.js -> js/shared.js -> js/analytics.js (все defer)
   Все графики — рукописный inline-SVG, без внешних библиотек.
   ========================================================================== */

(function () {
  'use strict';

  UI.renderHeader('analytics');
  UI.renderBottomNav('analytics');
  UI.renderFooter();

  var rs = window.DB.regionStats;

  /* ---------- Склонение дней: 1 день, 2 дня, 5 дней ---------- */
  function formatDays(n) {
    var abs = Math.abs(Math.round(n));
    var m10 = abs % 10;
    var m100 = abs % 100;
    var word = 'дней';
    if (m10 === 1 && m100 !== 11) word = 'день';
    else if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) word = 'дня';
    return abs + ' ' + word;
  }

  /* ==========================================================================
     2. KPI-карточки
     ========================================================================== */
  function renderKpis() {
    var host = document.getElementById('kpi-row');
    if (!host) return;

    var speedup = Math.floor((rs.avgHiringDaysBefore - rs.avgHiringDaysNow) / rs.avgHiringDaysBefore * 100);

    var cards = [
      { value: UI.formatNumber(rs.totalProfiles), label: 'Профилей в реестре' },
      { value: UI.formatNumber(rs.itDeficit), label: 'Дефицит ИТ-специалистов' },
      { value: UI.formatNumber(rs.closedVacancies), label: 'Закрыто вакансий через платформу' },
      {
        value: formatDays(rs.avgHiringDaysNow),
        label: 'Средний срок подбора',
        trend: '−' + speedup + '% (было ' + formatDays(rs.avgHiringDaysBefore) + ')'
      }
    ];

    host.innerHTML = cards.map(function (c) {
      return '<div class="kpi-card">' +
        '<span class="kpi-value">' + c.value + '</span>' +
        '<span class="kpi-label">' + UI.escapeHtml(c.label) + '</span>' +
        (c.trend ? '<span class="kpi-trend">' + UI.escapeHtml(c.trend) + '</span>' : '') +
      '</div>';
    }).join('');
  }

  /* ==========================================================================
     3. Столбчатая SVG-диаграмма: дефицит специалистов по отраслям
     ========================================================================== */
  function renderDeficitChart() {
    var host = document.getElementById('deficit-chart');
    if (!host) return;

    var data = rs.industryDeficit;
    var W = 700, H = 320;
    var padTop = 34, padBottom = 44, padSide = 16;
    var baseY = H - padBottom;
    var plotH = baseY - padTop;
    var slot = (W - padSide * 2) / data.length;
    var barW = Math.min(78, slot * 0.56);
    var maxVal = 0;
    data.forEach(function (d) { maxVal = Math.max(maxVal, d.value); });

    var parts = [];

    /* Пунктирные направляющие на 25/50/75/100% максимума */
    [0.25, 0.5, 0.75, 1].forEach(function (k) {
      var y = (baseY - plotH * k).toFixed(1);
      parts.push('<line class="grid-line" x1="' + padSide + '" y1="' + y + '" x2="' + (W - padSide) + '" y2="' + y + '"/>');
    });

    data.forEach(function (d, i) {
      var h = plotH * d.value / maxVal;
      var x = padSide + slot * i + (slot - barW) / 2;
      var y = baseY - h;
      var cx = padSide + slot * i + slot / 2;
      parts.push(
        '<g class="bar-group">' +
          '<title>' + UI.escapeHtml(d.industry + ' — дефицит ' + UI.formatNumber(d.value) + ' чел.') + '</title>' +
          '<rect class="bar" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
            '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="6"/>' +
          '<text class="bar-val" x="' + cx.toFixed(1) + '" y="' + (y - 9).toFixed(1) + '" text-anchor="middle">' +
            UI.formatNumber(d.value) + '</text>' +
          '<text class="bar-label" x="' + cx.toFixed(1) + '" y="' + (baseY + 24) + '" text-anchor="middle">' +
            UI.escapeHtml(d.industry) + '</text>' +
        '</g>'
      );
    });

    parts.push('<line class="axis-line" x1="' + padSide + '" y1="' + baseY + '" x2="' + (W - padSide) + '" y2="' + baseY + '"/>');

    host.innerHTML =
      '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
        'role="img" aria-label="Столбчатая диаграмма дефицита специалистов по отраслям">' +
        parts.join('') +
      '</svg>';
  }

  /* ==========================================================================
     4. Линейный SVG-график с заливкой: рост верифицированных профилей
     ========================================================================== */
  function renderGrowthChart() {
    var host = document.getElementById('growth-chart');
    if (!host) return;

    var data = rs.profileGrowth;
    var W = 720, H = 300;
    var padTop = 34, padBottom = 36, padLeft = 52, padRight = 24;
    var baseY = H - padBottom;
    var plotH = baseY - padTop;
    var plotW = W - padLeft - padRight;
    var yMax = 13000;

    function px(i) { return padLeft + plotW * i / (data.length - 1); }
    function py(v) { return baseY - plotH * v / yMax; }

    var parts = [];

    /* Горизонтальные направляющие с подписями оси Y */
    [4000, 8000, 12000].forEach(function (v) {
      var y = py(v).toFixed(1);
      parts.push('<line class="grid-line" x1="' + padLeft + '" y1="' + y + '" x2="' + (W - padRight) + '" y2="' + y + '"/>');
      parts.push('<text class="lc-ylabel" x="' + (padLeft - 8) + '" y="' + (py(v) + 4).toFixed(1) + '" text-anchor="end">' +
        UI.formatNumber(v) + '</text>');
    });

    /* Область с лёгкой заливкой и сама линия */
    var linePts = data.map(function (d, i) {
      return px(i).toFixed(1) + ',' + py(d.count).toFixed(1);
    });
    var areaPath = 'M' + px(0).toFixed(1) + ',' + baseY +
      ' L' + linePts.join(' L') +
      ' L' + px(data.length - 1).toFixed(1) + ',' + baseY + ' Z';
    parts.push('<path class="lc-area" d="' + areaPath + '"/>');
    parts.push('<path class="lc-line" d="M' + linePts.join(' L') + '"/>');

    parts.push('<line class="axis-line" x1="' + padLeft + '" y1="' + baseY + '" x2="' + (W - padRight) + '" y2="' + baseY + '"/>');

    /* Точки, подписи месяцев; значения — на первой и последней точках */
    data.forEach(function (d, i) {
      var x = px(i), y = py(d.count);
      parts.push(
        '<g>' +
          '<title>' + UI.escapeHtml(d.month + ' 2026 — ' + UI.formatNumber(d.count) + ' профилей') + '</title>' +
          '<circle class="lc-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4"/>' +
        '</g>'
      );
      parts.push('<text class="lc-month" x="' + x.toFixed(1) + '" y="' + (baseY + 22) + '" text-anchor="middle">' +
        UI.escapeHtml(d.month) + '</text>');
      if (i === 0 || i === data.length - 1) {
        var anchor = i === 0 ? 'start' : 'end';
        var dx = i === 0 ? -4 : 4;
        parts.push('<text class="lc-val" x="' + (x + dx).toFixed(1) + '" y="' + (y - 12).toFixed(1) +
          '" text-anchor="' + anchor + '">' + UI.formatNumber(d.count) + '</text>');
      }
    });

    host.innerHTML =
      '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
        'role="img" aria-label="График роста числа верифицированных профилей за 2026 год">' +
        parts.join('') +
      '</svg>';
  }

  /* ==========================================================================
     5. Donut-диаграммы: северный стаж и покрытие ДПО
     ========================================================================== */
  function donutSvg(percent, modifier) {
    var size = 132, stroke = 16;
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var dash = c * Math.max(0, Math.min(100, percent)) / 100;
    var cls = 'donut-val' + (modifier ? ' donut-val--' + modifier : '');
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' +
      '<circle class="donut-ring" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '"/>' +
      '<circle class="' + cls + '" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke +
        '" stroke-dasharray="' + dash.toFixed(1) + ' ' + c.toFixed(1) +
        '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>' +
      '<text class="donut-num" x="' + size / 2 + '" y="' + (size / 2 + 10) + '" text-anchor="middle">' + percent + '%</text>' +
    '</svg>';
  }

  function renderDonuts() {
    var host = document.getElementById('donut-row');
    if (!host) return;

    var items = [
      {
        percent: rs.northShare,
        modifier: '',
        title: 'Доля профилей с северным стажем (РКС/МКС)',
        note: 'Подтверждённый стаж в районах Крайнего Севера и приравненных местностях — по данным СФР.'
      },
      {
        percent: rs.dpoShare,
        modifier: 'success',
        title: 'Покрытие программами ДПО',
        note: 'Специалисты, прошедшие хотя бы одну программу дополнительного профобразования за последние 3 года.'
      }
    ];

    host.innerHTML = items.map(function (it) {
      return '<div class="card donut-card">' +
        donutSvg(it.percent, it.modifier) +
        '<div>' +
          '<h2>' + UI.escapeHtml(it.title) + '</h2>' +
          '<p class="small muted">' + UI.escapeHtml(it.note) + '</p>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ==========================================================================
     6. Таблица: трудоустройство выпускников по вузам
     ========================================================================== */
  function renderUniversities() {
    var tbody = document.querySelector('#uni-table tbody');
    if (!tbody) return;

    tbody.innerHTML = rs.topUniversities.map(function (u) {
      var success = u.employmentRate >= 85 ? ' success' : '';
      return '<tr>' +
        '<td>' + UI.escapeHtml(u.name) + '</td>' +
        '<td class="uni-bar-cell">' +
          '<div class="progress-bar' + success + '" role="progressbar" aria-valuenow="' + u.employmentRate +
            '" aria-valuemin="0" aria-valuemax="100">' +
            '<span style="width:' + u.employmentRate + '%"></span>' +
          '</div>' +
        '</td>' +
        '<td class="uni-rate">' + u.employmentRate + '%</td>' +
      '</tr>';
    }).join('');
  }

  /* ==========================================================================
     7. Экспорт отчёта (демо-заглушка)
     ========================================================================== */
  function bindExport() {
    ['export-pdf', 'export-xlsx'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', function () {
          UI.toast('Демо-версия: экспорт недоступен');
        });
      }
    });
  }

  renderKpis();
  renderDeficitChart();
  renderGrowthChart();
  renderDonuts();
  renderUniversities();
  bindExport();
})();
