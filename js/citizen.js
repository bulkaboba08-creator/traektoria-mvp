/* ==========================================================================
   «Траектория» — скрипт страницы «Кабинет гражданина» (citizen.html)
   Порядок подключения: js/data.js -> js/shared.js -> js/citizen.js (все defer)
   ========================================================================== */

(function () {
  'use strict';

  UI.renderHeader('citizen');
  UI.renderBottomNav('citizen');
  UI.renderFooter();

  var user = window.DB.currentUser;
  var esc = UI.escapeHtml;

  /* ======================================================================
     1. Шапка профиля
     ====================================================================== */
  function renderProfile() {
    var host = document.getElementById('profile-card');
    if (!host) return;

    var lastJob = user.trajectory.career.etk[user.trajectory.career.etk.length - 1];

    host.innerHTML =
      '<div class="profile-head">' +
        '<div class="profile-id">' +
          '<span class="avatar avatar-xl" aria-hidden="true">' + esc(user.avatarInitials) + '</span>' +
          '<div>' +
            '<h1 class="profile-name">' + esc(user.fio) + '</h1>' +
            '<div class="muted">' + UI.formatYears(user.age) + ' &middot; ' + esc(user.city) + '</div>' +
            '<div class="profile-role">' + esc(lastJob.role) + ' &middot; ' + esc(lastJob.org) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="profile-score">' +
          UI.scoreRing(user.scoreTotal, 116) +
          '<span class="small muted">Сводный индекс компетенций</span>' +
        '</div>' +
      '</div>' +
      '<div class="profile-badges">' +
        '<span class="badge badge-verified">&#10003; ' + user.verifiedDocs + ' документов подтверждено</span>' +
        '<span class="badge badge-verified">Профиль верифицирован &middot; ЕСИА</span>' +
      '</div>' +
      '<button class="btn btn-secondary" id="btn-download" type="button">Скачать выписку (демо)</button>';

    document.getElementById('btn-download').addEventListener('click', function () {
      UI.toast('Демо-версия: выписка недоступна');
    });
  }

  /* ======================================================================
     2. Моя траектория — вертикальный таймлайн из трёх этапов
     ====================================================================== */
  function tlCard(inner, extraClass) {
    return '<div class="tl-card' + (extraClass ? ' ' + extraClass : '') + '">' + inner + '</div>';
  }

  function renderTimeline() {
    var host = document.getElementById('trajectory-timeline');
    if (!host) return;

    var t = user.trajectory;
    var sc = t.school;
    var ed = t.education;
    var ca = t.career;

    /* --- Этап 1: Школа --- */
    var egeChips = sc.ege.map(function (e) {
      return '<span class="chip chip-sm chip-static chip-score">' + esc(e.subject) + ' &middot; ' + e.score + '</span>';
    }).join('');

    var schoolHtml =
      '<div class="tl-stage-title">Школа (2004–2014)</div>' +
      tlCard(
        '<div class="tl-card-head">' +
          '<div>' +
            '<div class="tl-title">Аттестат о среднем общем образовании</div>' +
            '<div class="tl-meta">' + esc(sc.attestat.school) + ' &middot; ' + sc.attestat.year +
              ' &middot; средний балл ' + sc.attestat.avg.toFixed(1) + '</div>' +
          '</div>' +
          '<span class="badge badge-verified">Подтверждено &middot; ' + esc(sc.attestat.verified) + '</span>' +
        '</div>'
      ) +
      tlCard(
        '<div class="tl-title">Результаты ЕГЭ</div>' +
        '<div class="chips-row" style="margin-top:8px">' + egeChips + '</div>'
      ) +
      tlCard(
        '<div class="tl-title">' + esc(sc.olympiads[0].name) + '</div>' +
        '<div class="tl-meta">' + esc(sc.olympiads[0].result) + ' &middot; региональный уровень &middot; ' +
          sc.olympiads[0].year + '</div>'
      ) +
      tlCard(
        '<div class="tl-title">' + esc(sc.clubs[0].name) + '</div>' +
        '<div class="tl-meta">Дополнительное образование &middot; ' + esc(sc.clubs[0].years) + '</div>'
      );

    /* --- Этап 2: Университет --- */
    var pr = ed.practices[0];
    var eduHtml =
      '<div class="tl-stage-title">Университет (' + esc(ed.years) + ')</div>' +
      tlCard(
        '<div class="tl-card-head">' +
          '<div>' +
            '<div class="tl-title">' + esc(ed.university) + '</div>' +
            '<div class="tl-meta">' + esc(ed.specialty) + ' &middot; ' + esc(ed.degree) +
              ' &middot; средний балл ' + ed.gpa.toFixed(1) + '</div>' +
          '</div>' +
          '<span class="badge badge-verified">Диплом подтверждён &middot; ' + esc(ed.diplomaVerified) + '</span>' +
        '</div>'
      ) +
      tlCard(
        '<div class="tl-title">Производственная практика</div>' +
        '<div class="tl-meta">' + esc(pr.org) + ' &middot; оценка наставника: ' + esc(pr.grade) + '</div>' +
        '<p class="quote small">&laquo;' + esc(pr.review) + '&raquo;</p>'
      ) +
      tlCard(
        '<div class="tl-title">' + esc(ed.projects[0]) + '</div>' +
        '<div class="tl-meta">Защищён на &laquo;отлично&raquo;</div>'
      );

    /* --- Этап 3: Карьера --- */
    var etkRows = ca.etk.map(function (rec) {
      return '<div class="etk-row">' +
        '<div>' +
          '<div class="tl-title">' + esc(rec.role) + '</div>' +
          '<div class="tl-meta">' + esc(rec.org) + ' &middot; ' + esc(rec.period) + '</div>' +
        '</div>' +
        '<span class="badge badge-verified">' + esc(rec.verified) + '</span>' +
      '</div>';
    }).join('');

    var north = ca.north;
    var northHtml = tlCard(
      '<div class="tl-card-head">' +
        '<div>' +
          '<div class="tl-title">Северный стаж</div>' +
          '<div class="tl-meta">' + esc(north.region) + ' &middot; ' + esc(north.period) + '</div>' +
        '</div>' +
        '<span class="badge badge-rks">РКС &middot; ' + north.years + ' г. ' + north.months + ' мес.</span>' +
      '</div>' +
      '<p class="small muted" style="margin:8px 0 0">Учитывается в скоринге как маркер профессиональной выносливости</p>',
      'north-card'
    );

    var dpoRows = ca.dpo.map(function (d) {
      return '<div class="etk-row">' +
        '<div>' +
          '<div class="tl-title">' + esc(d.name) + '</div>' +
          '<div class="tl-meta">' + esc(d.org) + ' &middot; ' + d.year + '</div>' +
        '</div>' +
        '<span class="badge badge-verified">' + esc(d.verified) + '</span>' +
      '</div>';
    }).join('');

    var kpiCards = ca.kpi.map(function (k) {
      return '<div class="kpi-card kpi-mini">' +
        '<span class="kpi-value">' + k.value + '</span>' +
        '<span class="kpi-label">' + esc(k.label) + '</span>' +
      '</div>';
    }).join('');

    var careerHtml =
      '<div class="tl-stage-title">Карьера (2019 — н. в.)</div>' +
      tlCard(
        '<div class="tl-title" style="margin-bottom:8px">Электронная трудовая книжка</div>' + etkRows
      ) +
      northHtml +
      tlCard(
        '<div class="tl-title" style="margin-bottom:8px">Дополнительное профессиональное образование</div>' + dpoRows
      ) +
      '<div class="grid-2" style="margin-top:10px">' + kpiCards + '</div>';

    host.innerHTML =
      '<li class="timeline-item done">' + schoolHtml + '</li>' +
      '<li class="timeline-item done">' + eduHtml + '</li>' +
      '<li class="timeline-item">' + careerHtml + '</li>';
  }

  /* ======================================================================
     3. Компетенции — SVG-радар на 6 осей + горизонтальные бары
     ====================================================================== */

  /* Делит длинную подпись оси на две строки по ближайшему к середине пробелу */
  function splitLabel(name) {
    if (name.length <= 16) return [name];
    var mid = Math.floor(name.length / 2);
    var best = -1;
    for (var i = 0; i < name.length; i++) {
      if (name.charAt(i) === ' ' && (best === -1 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
    }
    if (best === -1) return [name];
    return [name.slice(0, best), name.slice(best + 1)];
  }

  function renderRadar() {
    var host = document.getElementById('radar-host');
    if (!host) return;

    var comps = user.competencies;
    var n = comps.length;
    var W = 420, H = 340, cx = 210, cy = 170, R = 105;

    function pt(i, r) {
      var a = -Math.PI / 2 + (2 * Math.PI * i) / n;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    }
    function poly(r) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var p = pt(i, r);
        pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
      }
      return pts.join(' ');
    }

    /* Сетка: многоугольники уровней 25/50/75/100 */
    var grid = [0.25, 0.5, 0.75, 1].map(function (lv) {
      return '<polygon points="' + poly(R * lv) + '" fill="none" stroke="var(--border)" stroke-width="1"/>';
    }).join('');

    /* Оси */
    var axes = '';
    for (var i = 0; i < n; i++) {
      var p = pt(i, R);
      axes += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) +
        '" stroke="var(--border)" stroke-width="1"/>';
    }

    /* Полигон значений + точки вершин */
    var valPts = [];
    var dots = '';
    for (var j = 0; j < n; j++) {
      var vp = pt(j, R * comps[j].value / 100);
      valPts.push(vp[0].toFixed(1) + ',' + vp[1].toFixed(1));
      dots += '<circle cx="' + vp[0].toFixed(1) + '" cy="' + vp[1].toFixed(1) +
        '" r="3.5" fill="var(--primary)" stroke="#fff" stroke-width="1.5"/>';
    }
    var valuePoly =
      '<polygon points="' + valPts.join(' ') + '" fill="rgba(13,76,211,.18)" stroke="var(--primary)" stroke-width="2" stroke-linejoin="round"/>';

    /* Подписи осей */
    var labels = '';
    for (var k = 0; k < n; k++) {
      var a = -Math.PI / 2 + (2 * Math.PI * k) / n;
      var lx = cx + (R + 18) * Math.cos(a);
      var ly = cy + (R + 18) * Math.sin(a);
      var cosA = Math.cos(a), sinA = Math.sin(a);
      var anchor = Math.abs(cosA) < 0.3 ? 'middle' : (cosA > 0 ? 'start' : 'end');
      var lines = splitLabel(comps[k].name);
      if (sinA < -0.5) ly -= (lines.length - 1) * 13 + 2;   /* верхняя подпись — поднимаем */
      if (sinA > 0.5) ly += 10;                              /* нижняя — опускаем */
      var tspans = lines.map(function (line, idx) {
        return '<tspan x="' + lx.toFixed(1) + '" dy="' + (idx === 0 ? 0 : 13) + '">' + esc(line) + '</tspan>';
      }).join('');
      labels += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="' + anchor +
        '" font-size="11.5" font-weight="600" fill="var(--text-2)">' + tspans + '</text>';
    }

    host.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:420px;display:block;margin:0 auto" ' +
        'role="img" aria-label="Диаграмма компетенций (радар, 6 осей)" xmlns="http://www.w3.org/2000/svg">' +
        grid + axes + valuePoly + dots + labels +
      '</svg>';
  }

  function renderBars() {
    var host = document.getElementById('comp-bars');
    if (!host) return;
    host.innerHTML = user.competencies.map(function (c) {
      return '<div class="comp-row">' +
        '<div class="comp-head">' +
          '<span>' + esc(c.name) + '</span>' +
          '<strong>' + c.value + '</strong>' +
        '</div>' +
        '<div class="progress-bar"><span style="width:' + c.value + '%"></span></div>' +
      '</div>';
    }).join('');
  }

  /* ======================================================================
     4. Доступ к моему профилю (контур ФЗ-152)
     ====================================================================== */
  function renderGrants() {
    var host = document.getElementById('grants-list');
    if (!host) return;
    var grants = user.accessGrants;

    if (!grants.length) {
      host.innerHTML = '<p class="muted small" style="margin:0">Активных доступов нет. ' +
        'Сформируйте код доступа, чтобы предоставить работодателю просмотр профиля.</p>';
      return;
    }

    host.innerHTML = grants.map(function (g, i) {
      var chips = g.scope.map(function (s) {
        return '<span class="chip chip-sm chip-static">' + esc(s) + '</span>';
      }).join('');
      return '<div class="grant-row">' +
        '<div>' +
          '<div class="tl-title">' + esc(g.org) + '</div>' +
          '<div class="tl-meta">Доступ действует до ' + esc(g.until) + '</div>' +
          '<div class="chips-row" style="margin-top:8px">' + chips + '</div>' +
        '</div>' +
        '<button class="btn btn-secondary" type="button" data-revoke="' + i + '">Отозвать</button>' +
      '</div>';
    }).join('');
  }

  function renderAccessLog() {
    var host = document.getElementById('access-log-body');
    if (!host) return;
    host.innerHTML = user.accessLog.map(function (row) {
      return '<tr>' +
        '<td class="small muted" style="white-space:nowrap">' + esc(row.date) + '</td>' +
        '<td>' + esc(row.org) + '</td>' +
        '<td>' + esc(row.action) + '</td>' +
      '</tr>';
    }).join('');
  }

  /* --- Генерация кода доступа --- */
  function randomCode() {
    var chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    function part(len) {
      var s = '';
      for (var i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
      return s;
    }
    return 'TRK-' + part(4) + '-' + part(2);
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function formatUntil(hours) {
    var d = new Date(Date.now() + hours * 3600 * 1000);
    return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear() +
      ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }

  function copyToClipboard(text, onSuccess) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      if (ok) onSuccess();
      else UI.toast('Не удалось скопировать — выделите код вручную');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess, fallback);
    } else {
      fallback();
    }
  }

  var SCOPES = ['Образование', 'Стаж', 'ДПО', 'KPI'];
  var TERMS = [
    { hours: 24, label: '24 часа' },
    { hours: 72, label: '72 часа' },
    { hours: 168, label: '7 дней' }
  ];

  function openCodeModal() {
    var termOptions = TERMS.map(function (t) {
      return '<option value="' + t.hours + '">' + t.label + '</option>';
    }).join('');

    var scopeChecks = SCOPES.map(function (s, i) {
      return '<label class="checkbox-row">' +
        '<input type="checkbox" class="acc-scope" value="' + esc(s) + '"' + (i < 3 ? ' checked' : '') + '> ' +
        esc(s) +
      '</label>';
    }).join('');

    UI.openModal(
      '<h3>Код доступа к профилю</h3>' +
      '<p class="muted small">Передайте код работодателю: он увидит только выбранные разделы ' +
        'и только в течение выбранного срока (152-ФЗ).</p>' +
      '<div class="field">' +
        '<label for="acc-org">Организация</label>' +
        '<input type="text" id="acc-org" placeholder="Например: АО «ГеоТех»" autocomplete="off">' +
      '</div>' +
      '<div class="field">' +
        '<label for="acc-term">Срок действия</label>' +
        '<select id="acc-term">' + termOptions + '</select>' +
      '</div>' +
      '<div class="field">' +
        '<label>Области данных</label>' +
        '<div class="scope-list">' + scopeChecks + '</div>' +
      '</div>' +
      '<button class="btn btn-primary btn-block" id="acc-generate" type="button">Сгенерировать</button>' +
      '<div id="acc-result"></div>'
    );

    document.getElementById('acc-generate').addEventListener('click', function () {
      var org = document.getElementById('acc-org').value.trim();
      if (!org) {
        UI.toast('Укажите организацию, которой выдаётся доступ');
        document.getElementById('acc-org').focus();
        return;
      }

      var scopes = [];
      var boxes = document.querySelectorAll('.acc-scope');
      for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) scopes.push(boxes[i].value);
      }
      if (!scopes.length) {
        UI.toast('Выберите хотя бы одну область данных');
        return;
      }

      var hours = parseInt(document.getElementById('acc-term').value, 10);
      var code = randomCode();
      var until = formatUntil(hours);

      var result = document.getElementById('acc-result');
      result.innerHTML =
        '<div class="access-code">' + code + '</div>' +
        '<p class="small muted" style="text-align:center;margin:10px 0 14px">' +
          'Действует до ' + until + ' &middot; разделы: ' + esc(scopes.join(', ')) +
        '</p>' +
        '<button class="btn btn-secondary btn-block" id="acc-copy" type="button">Скопировать</button>';

      document.getElementById('acc-copy').addEventListener('click', function () {
        copyToClipboard(code, function () {
          UI.toast('Код ' + code + ' скопирован в буфер обмена');
        });
      });

      UI.toast('Код доступа для «' + org + '» сформирован');
    });
  }

  function initAccessSection() {
    renderGrants();
    renderAccessLog();

    var grantsHost = document.getElementById('grants-list');
    if (grantsHost) {
      grantsHost.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('[data-revoke]') : null;
        if (!btn) return;
        var idx = parseInt(btn.getAttribute('data-revoke'), 10);
        var removed = user.accessGrants.splice(idx, 1)[0];
        renderGrants();
        UI.toast('Доступ для ' + (removed ? removed.org : 'организации') + ' отозван');
      });
    }

    var genBtn = document.getElementById('btn-gen-code');
    if (genBtn) genBtn.addEventListener('click', openCodeModal);
  }

  /* ======================================================================
     Инициализация
     ====================================================================== */
  renderProfile();
  renderTimeline();
  renderRadar();
  renderBars();
  initAccessSection();
})();
