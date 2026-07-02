/* ==========================================================================
   «Траектория» — кабинет работодателя (employer.html)
   Умный подбор кадров: пресеты вакансий, фильтры, скоринг UI.scoreCandidate.
   Подключение: js/data.js -> js/shared.js -> js/employer.js (все defer)
   ========================================================================== */

(function () {
  'use strict';

  var DB = window.DB;
  var UI = window.UI;

  var ORG = 'АО «ГеоТех»';
  var TOTAL_PROFILES = 24; // фиксированная витрина «24 верифицированных профилей»

  /* Отрасли — берём из реальных данных кандидатов, в порядке появления */
  var INDUSTRIES = (function () {
    var order = [];
    DB.candidates.forEach(function (c) {
      if (order.indexOf(c.industry) === -1) order.push(c.industry);
    });
    return order;
  })();

  /* Активный набор выбранных отраслей (Set-подобное поведение через массив) */
  var selectedIndustries = [];

  /* Множество кандидатов, которым уже «запрошен» доступ в этой сессии */
  var requestedAccess = {};

  /* --------------------------------------------------------------------------
     Отрисовка каркаса навигации
     -------------------------------------------------------------------------- */
  UI.renderHeader('employer');
  UI.renderBottomNav('employer');
  UI.renderFooter();

  /* --------------------------------------------------------------------------
     Ссылки на элементы
     -------------------------------------------------------------------------- */
  var el = {
    vacancy: document.getElementById('f-vacancy'),
    vacancyOrg: document.getElementById('vacancy-org'),
    education: document.getElementById('f-education'),
    exp: document.getElementById('f-exp'),
    expVal: document.getElementById('exp-val'),
    industryChips: document.getElementById('industry-chips'),
    north: document.getElementById('f-north'),
    northYears: document.getElementById('f-north-years'),
    dpo: document.getElementById('f-dpo'),
    gpa: document.getElementById('f-gpa'),
    gpaVal: document.getElementById('gpa-val'),
    ege: document.getElementById('f-ege'),
    egeVal: document.getElementById('ege-val'),
    kpi: document.getElementById('f-kpi'),
    run: document.getElementById('btn-run'),
    progressSection: document.getElementById('progress-section'),
    progressTimeline: document.getElementById('progress-timeline'),
    resultsSection: document.getElementById('results-section'),
    resultsHost: document.getElementById('results-host')
  };

  /* --------------------------------------------------------------------------
     Проверка активного доступа гражданина для АО «ГеоТех»
     Кандидат c01 (Тимур Валеев) = DB.currentUser, у него есть accessGrant.
     -------------------------------------------------------------------------- */
  function hasActiveGrant(candidateId) {
    if (candidateId !== DB.currentUser.id) return false;
    var grants = DB.currentUser.accessGrants || [];
    for (var i = 0; i < grants.length; i++) {
      if (grants[i].org === ORG) return true;
    }
    return false;
  }

  /* --------------------------------------------------------------------------
     Чипы отраслей
     -------------------------------------------------------------------------- */
  function renderIndustryChips() {
    el.industryChips.innerHTML = INDUSTRIES.map(function (ind) {
      var active = selectedIndustries.indexOf(ind) !== -1;
      return '<button type="button" class="chip' + (active ? ' active' : '') +
        '" data-industry="' + UI.escapeHtml(ind) + '" aria-pressed="' + active + '">' +
        UI.escapeHtml(ind) + '</button>';
    }).join('');
  }

  el.industryChips.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    var ind = chip.getAttribute('data-industry');
    var idx = selectedIndustries.indexOf(ind);
    if (idx === -1) selectedIndustries.push(ind);
    else selectedIndustries.splice(idx, 1);
    renderIndustryChips();
  });

  /* --------------------------------------------------------------------------
     Отображение значений range-полей
     -------------------------------------------------------------------------- */
  function updateExpVal() { el.expVal.textContent = UI.formatYears(parseInt(el.exp.value, 10)); }
  function updateGpaVal() { el.gpaVal.textContent = parseFloat(el.gpa.value).toFixed(1); }
  function updateEgeVal() { el.egeVal.textContent = el.ege.value; }

  el.exp.addEventListener('input', updateExpVal);
  el.gpa.addEventListener('input', updateGpaVal);
  el.ege.addEventListener('input', updateEgeVal);

  /* --------------------------------------------------------------------------
     Вакансии-пресеты
     -------------------------------------------------------------------------- */
  function fillVacancySelect() {
    el.vacancy.innerHTML = DB.vacancies.map(function (v) {
      return '<option value="' + v.id + '">' + UI.escapeHtml(v.title) + '</option>';
    }).join('');
  }

  function applyPreset(vacancyId) {
    var v = null;
    for (var i = 0; i < DB.vacancies.length; i++) {
      if (DB.vacancies[i].id === vacancyId) { v = DB.vacancies[i]; break; }
    }
    if (!v) return;

    el.vacancyOrg.textContent = 'Работодатель: ' + v.org;

    var req = v.required || {};
    var des = v.desired || {};

    /* Обязательные */
    el.education.value = req.education || '';
    el.exp.value = req.minExperience != null ? req.minExperience : 0;
    updateExpVal();
    selectedIndustries = (req.industries || []).slice();
    renderIndustryChips();

    /* Желательные */
    var north = des.northMinYears || 0;
    el.north.checked = north > 0;
    if (north > 0) el.northYears.value = north;
    el.northYears.disabled = !el.north.checked;

    el.dpo.checked = !!des.dpo;

    el.gpa.value = des.minGpa != null ? des.minGpa : 3.0;
    updateGpaVal();

    el.ege.value = des.minEgeProfile != null ? des.minEgeProfile : 50;
    updateEgeVal();

    el.kpi.checked = !!des.kpi;
  }

  el.vacancy.addEventListener('change', function () {
    applyPreset(el.vacancy.value);
  });

  /* Число «северного стажа» активно только при включённом чекбоксе */
  el.north.addEventListener('change', function () {
    el.northYears.disabled = !el.north.checked;
  });

  /* --------------------------------------------------------------------------
     Сбор фильтров в формат UI.scoreCandidate
     -------------------------------------------------------------------------- */
  function collectFilters() {
    var northYears = parseInt(el.northYears.value, 10);
    if (isNaN(northYears)) northYears = 0;
    return {
      education: el.education.value || null,
      industries: selectedIndustries.slice(),
      minExperience: parseInt(el.exp.value, 10) || 0,
      northMinYears: el.north.checked ? northYears : 0,
      dpo: el.dpo.checked,
      minGpa: parseFloat(el.gpa.value) || 0,
      minEgeProfile: parseInt(el.ege.value, 10) || 0,
      kpi: el.kpi.checked
    };
  }

  /* --------------------------------------------------------------------------
     Прогресс подбора: последовательная смена статусов ~1.5 с
     -------------------------------------------------------------------------- */
  var PROGRESS_STAGES = [
    { title: 'Сканирование 24 верифицированных профилей…', meta: 'Реестр граждан' },
    { title: 'Запрос: Рособрнадзор · ФРДО (демо)', meta: 'Проверка образования и ДПО' },
    { title: 'Запрос: СФР · Электронная трудовая книжка (демо)', meta: 'Проверка стажа и северного стажа' },
    { title: 'Ранжирование по объективному скорингу…', meta: 'Расчёт баллов кандидатов' }
  ];

  function renderProgress(activeIndex) {
    el.progressTimeline.innerHTML = PROGRESS_STAGES.map(function (s, i) {
      var cls = 'timeline-item' + (i < activeIndex ? ' done' : '');
      return '<li class="' + cls + '">' +
        '<div class="tl-title">' + UI.escapeHtml(s.title) + '</div>' +
        '<div class="tl-meta">' + UI.escapeHtml(s.meta) + '</div>' +
      '</li>';
    }).join('');
  }

  var progressTimers = [];
  function clearProgressTimers() {
    progressTimers.forEach(function (t) { clearTimeout(t); });
    progressTimers = [];
  }

  function runSearch() {
    var filters = collectFilters();

    clearProgressTimers();
    el.run.disabled = true;
    el.resultsSection.hidden = true;
    el.progressSection.hidden = false;
    renderProgress(0);
    el.progressSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    var stepMs = 400; // 4 шага ~1.5 c
    for (var i = 1; i < PROGRESS_STAGES.length; i++) {
      (function (idx) {
        progressTimers.push(setTimeout(function () { renderProgress(idx); }, stepMs * idx));
      })(i);
    }

    progressTimers.push(setTimeout(function () {
      el.progressSection.hidden = true;
      el.run.disabled = false;
      renderResults(filters);
      el.resultsSection.hidden = false;
      el.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, stepMs * PROGRESS_STAGES.length));
  }

  el.run.addEventListener('click', runSearch);

  /* --------------------------------------------------------------------------
     Результаты
     -------------------------------------------------------------------------- */
  function scoreAll(filters) {
    return DB.candidates.map(function (c) {
      var r = UI.scoreCandidate(c, filters);
      return { candidate: c, score: r };
    });
  }

  function renderResults(filters) {
    var scored = scoreAll(filters);
    var passed = scored.filter(function (x) { return x.score.passed; });
    var rejected = scored.filter(function (x) { return !x.score.passed; });

    passed.sort(function (a, b) { return b.score.total - a.score.total; });

    var html = '';

    if (passed.length === 0) {
      /* Пустое состояние */
      html +=
        '<div class="card">' +
          '<h3 style="margin:0 0 8px">Никто не прошёл обязательные требования</h3>' +
          '<p class="muted" style="margin:0 0 4px">Ни один из ' + TOTAL_PROFILES +
            ' верифицированных профилей не соответствует заданным обязательным критериям.</p>' +
          '<p class="muted" style="margin:0">Совет: ослабьте фильтры — снизьте требование к минимальному стажу, ' +
            'добавьте отрасли или измените требуемый уровень образования.</p>' +
        '</div>';
    } else {
      html +=
        '<div class="results-head">' +
          '<h3 style="margin:0">Прошли обязательные требования: ' + passed.length + ' из ' + TOTAL_PROFILES + '</h3>' +
          '<span class="badge badge-verified">Ранжировано по объективному скорингу</span>' +
        '</div>';

      passed.forEach(function (item, i) {
        html += candidateCard(item.candidate, item.score, i + 1, filters);
      });
    }

    /* Свёрнутый список не прошедших */
    if (rejected.length > 0) {
      html += rejectedBlock(rejected);
    }

    el.resultsHost.innerHTML = html;
  }

  /* --------------------------------------------------------------------------
     Карточка кандидата
     -------------------------------------------------------------------------- */
  function candidateCard(c, score, rank, filters) {
    var granted = hasActiveGrant(c.id);
    var requested = !!requestedAccess[c.id];

    /* Чипы ключевых совпадений */
    var chips = [];
    if (c.education.level === 'ВО') chips.push('ВО &#10003;');
    else if (c.education.level) chips.push(UI.escapeHtml(c.education.level) + ' &#10003;');
    chips.push(UI.escapeHtml(UI.formatYears(c.experienceYears)) + ' стажа &#10003;');
    if (c.northExperience) {
      chips.push('<span class="badge badge-rks" style="font-size:12px">РКС ' +
        c.northExperience.years + ' г. &#10003;</span>');
    }
    if ((c.dpo || []).length > 0) chips.push('ДПО &#10003;');

    var chipsHtml = chips.map(function (t) {
      if (t.indexOf('badge-rks') !== -1) return t;
      return '<span class="chip chip-static">' + t + '</span>';
    }).join(' ');

    var rankGold = rank === 1 ? ' gold' : '';

    /* Блок действий: c01 с активным доступом vs остальные */
    var actionHtml;
    if (granted) {
      actionHtml =
        '<span class="badge badge-verified">Доступ предоставлен гражданином</span>' +
        '<button type="button" class="btn btn-primary btn-open-profile" data-id="' + c.id + '">Открыть полный профиль</button>';
    } else if (requested) {
      actionHtml =
        '<span class="badge badge-pending">Запрос отправлен · ожидает подтверждения гражданином</span>';
    } else {
      actionHtml =
        '<button type="button" class="btn btn-secondary btn-request" data-id="' + c.id + '">Запросить доступ к полному профилю</button>';
    }

    return '<div class="card cand-card" data-card="' + c.id + '">' +
      '<div class="cand-top">' +
        '<span class="rank-badge' + rankGold + '">' + rank + '</span>' +
        '<div class="cand-id">' +
          '<p class="cand-name">' + UI.escapeHtml(c.fio) + '</p>' +
          '<p class="cand-meta">' + UI.formatYears(c.age) + ' · ' + UI.escapeHtml(c.city) + '</p>' +
          '<p class="cand-spec">' + UI.escapeHtml(c.specialty) + '</p>' +
        '</div>' +
        '<span class="cand-ring">' + UI.scoreRing(score.total, 72) + '</span>' +
      '</div>' +
      '<div class="cand-chips chips-row">' + chipsHtml + '</div>' +
      '<div class="cand-actions">' +
        '<button type="button" class="btn btn-ghost btn-breakdown" data-id="' + c.id + '">Детали скоринга</button>' +
        actionHtml +
      '</div>' +
      '<div class="breakdown-wrap" data-breakdown="' + c.id + '" hidden>' +
        breakdownTable(score.breakdown) +
      '</div>' +
    '</div>';
  }

  /* Таблица расшифровки скоринга */
  function breakdownTable(breakdown) {
    var rows = breakdown.map(function (b) {
      var pts = (b.points > 0 ? '+' + b.points : b.points) + (b.max ? ' / ' + b.max : '');
      var cls = b.ok ? 'bd-ok' : 'bd-no';
      return '<tr>' +
        '<td>' + UI.escapeHtml(b.criterion) + '</td>' +
        '<td class="bd-points ' + cls + '">' + pts + '</td>' +
        '<td class="muted">' + UI.escapeHtml(b.comment) + '</td>' +
      '</tr>';
    }).join('');
    return '<div class="table-wrap"><table class="table">' +
      '<thead><tr><th>Критерий</th><th style="text-align:right">Баллы</th><th>Комментарий</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
    '</table></div>';
  }

  /* Свёрнутый блок «не прошли обязательные требования» */
  function rejectedBlock(rejected) {
    var rows = rejected.map(function (x) {
      var c = x.candidate;
      var reason = rejectReason(c, x.score);
      return '<div class="rejected-row">' +
        '<span class="rr-name">' + UI.escapeHtml(c.fio) + '</span>' +
        '<span class="rr-reason">' + UI.escapeHtml(reason) + '</span>' +
      '</div>';
    }).join('');

    return '<div class="card" style="margin-top:18px">' +
      '<button type="button" class="rejected-toggle" id="rejected-toggle" aria-expanded="false">' +
        '<span>Не прошли обязательные требования: ' + rejected.length + '</span>' +
        '<span aria-hidden="true" id="rejected-caret">Показать &#9662;</span>' +
      '</button>' +
      '<div class="rejected-list" id="rejected-list" hidden>' + rows + '</div>' +
    '</div>';
  }

  /* Причина отсева — первый непройденный обязательный критерий из breakdown */
  function rejectReason(c, score) {
    for (var i = 0; i < score.breakdown.length; i++) {
      var b = score.breakdown[i];
      if (b.criterion.indexOf('(обязательно)') !== -1 && !b.ok) {
        return b.comment;
      }
    }
    return 'Не соответствует обязательным требованиям';
  }

  /* --------------------------------------------------------------------------
     Делегирование кликов по результатам
     -------------------------------------------------------------------------- */
  el.resultsHost.addEventListener('click', function (e) {
    var t = e.target;

    /* Детали скоринга */
    var bdBtn = t.closest('.btn-breakdown');
    if (bdBtn) {
      var id = bdBtn.getAttribute('data-id');
      var box = el.resultsHost.querySelector('[data-breakdown="' + id + '"]');
      if (box) {
        var willShow = box.hidden;
        box.hidden = !willShow;
        bdBtn.textContent = willShow ? 'Скрыть детали скоринга' : 'Детали скоринга';
      }
      return;
    }

    /* Запрос доступа */
    var reqBtn = t.closest('.btn-request');
    if (reqBtn) {
      var rid = reqBtn.getAttribute('data-id');
      requestedAccess[rid] = true;
      reqBtn.outerHTML =
        '<span class="badge badge-pending">Запрос отправлен · ожидает подтверждения гражданином</span>';
      UI.toast('Запрос доступа отправлен гражданину. Профиль откроется после его подтверждения.');
      return;
    }

    /* Открыть полный профиль (c01) */
    var openBtn = t.closest('.btn-open-profile');
    if (openBtn) {
      openFullProfile();
      return;
    }

    /* Разворот списка не прошедших */
    var toggle = t.closest('#rejected-toggle');
    if (toggle) {
      var list = document.getElementById('rejected-list');
      var caret = document.getElementById('rejected-caret');
      if (list) {
        var show = list.hidden;
        list.hidden = !show;
        toggle.setAttribute('aria-expanded', show ? 'true' : 'false');
        if (caret) caret.innerHTML = show ? 'Скрыть &#9652;' : 'Показать &#9662;';
      }
      return;
    }
  });

  /* --------------------------------------------------------------------------
     Модалка полного профиля кандидата c01 (из DB.currentUser.trajectory)
     -------------------------------------------------------------------------- */
  function openFullProfile() {
    var u = DB.currentUser;
    var t = u.trajectory;
    var edu = t.education;
    var career = t.career;

    var html = '';
    html += '<h3>' + UI.escapeHtml(u.fio) + '</h3>';
    html += '<p class="muted" style="margin:-6px 0 4px">' + UI.formatYears(u.age) + ' · ' + UI.escapeHtml(u.city) + '</p>';
    html += '<p><span class="badge badge-verified">Доступ предоставлен гражданином</span> ' +
            '<span class="badge badge-demo">' + u.verifiedDocs + ' верифицированных документов</span></p>';

    /* Образование */
    html += '<div class="mp-section"><h4>Образование</h4>';
    html += '<div class="mp-row"><span class="mp-role">' + UI.escapeHtml(edu.university) + '</span>' +
            '<span class="muted">' + UI.escapeHtml(edu.years) + '</span></div>';
    html += '<div class="mp-row"><span>' + UI.escapeHtml(edu.degree) + ' · ' + UI.escapeHtml(edu.specialty) + '</span>' +
            '<span class="muted">GPA ' + edu.gpa.toFixed(1) + ' · ' + UI.escapeHtml(edu.diplomaVerified) + '</span></div>';
    html += '</div>';

    /* ЭТК-записи */
    html += '<div class="mp-section"><h4>Записи электронной трудовой книжки (СФР)</h4>';
    html += career.etk.map(function (r) {
      return '<div class="mp-row"><span class="mp-role">' + UI.escapeHtml(r.role) + '</span>' +
        '<span class="muted">' + UI.escapeHtml(r.org) + ' · ' + UI.escapeHtml(r.period) + '</span></div>';
    }).join('');
    html += '</div>';

    /* Северный стаж */
    if (career.north) {
      var n = career.north;
      html += '<div class="mp-section"><h4>Северный стаж (РКС)</h4>' +
        '<div class="mp-north">' +
          '<strong>' + n.years + ' г. ' + n.months + ' мес.</strong> · ' + UI.escapeHtml(n.region) +
          ' <span class="muted">(' + UI.escapeHtml(n.period) + ', подтверждено: ' + UI.escapeHtml(n.verified) + ')</span>' +
        '</div></div>';
    }

    /* ДПО */
    html += '<div class="mp-section"><h4>Дополнительное профессиональное образование (ДПО)</h4>';
    html += (career.dpo || []).map(function (d) {
      return '<div class="mp-row"><span>' + UI.escapeHtml(d.name) + '</span>' +
        '<span class="muted">' + d.year + ' · ' + UI.escapeHtml(d.org) + ' · ' + UI.escapeHtml(d.verified) + '</span></div>';
    }).join('');
    html += '</div>';

    /* Производственные KPI */
    html += '<div class="mp-section"><h4>Производственные KPI</h4>';
    html += (career.kpi || []).map(function (k) {
      return '<div class="mp-row"><span>' + UI.escapeHtml(k.label) + '</span>' +
        '<span class="mp-role">' + k.value + '</span></div>';
    }).join('');
    html += '</div>';

    UI.openModal(html);
  }

  /* --------------------------------------------------------------------------
     Инициализация: заполняем select, ставим пресет v1, ждём запуска
     -------------------------------------------------------------------------- */
  fillVacancySelect();
  el.vacancy.value = 'v1';
  applyPreset('v1');
  el.northYears.disabled = !el.north.checked;

})();
