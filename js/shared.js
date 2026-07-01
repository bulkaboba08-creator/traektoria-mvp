/* ==========================================================================
   «Траектория» — общие компоненты интерфейса и скоринг (window.UI)
   Подключение: <script src="js/shared.js" defer></script> (после data.js)
   ========================================================================== */

(function () {
  'use strict';

  var UI = {};

  /* ---------- Навигация: единая конфигурация ---------- */
  var NAV_ITEMS = [
    { key: 'home',      label: 'Главная',            mobileLabel: 'Главная',    href: 'index.html',     icon: 'home' },
    { key: 'citizen',   label: 'Гражданину',         mobileLabel: 'Траектория', href: 'citizen.html',   icon: 'route' },
    { key: 'employer',  label: 'Работодателю',       mobileLabel: 'Подбор',     href: 'employer.html',  icon: 'case' },
    { key: 'analytics', label: 'Аналитика',          mobileLabel: 'Аналитика',  href: 'analytics.html', icon: 'chart' },
    { key: 'strategic', label: 'Планирование', mobileLabel: 'Прогноз', href: 'strategic.html', icon: 'target' }
  ];

  /* Inline-SVG иконки таб-бара (дом, маршрут, портфель, график, цель) */
  var ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M10 21v-6h4v6"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M9 19h7.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H15"/></svg>',
    'case': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5A2.5 2.5 0 0 1 11 3h2a2.5 2.5 0 0 1 2.5 2.5V7"/><path d="M3 12.5h18"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 20v-6"/><path d="M12 20V6"/><path d="M18.5 20v-10"/><path d="M3 20h18"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.6" fill="currentColor"/></svg>'
  };

  /* ---------- Экранирование HTML ---------- */
  UI.escapeHtml = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };

  /* ---------- Склонение лет: 1 год, 3 года, 5 лет ---------- */
  UI.formatYears = function (n) {
    var abs = Math.abs(Math.round(n));
    var m10 = abs % 10;
    var m100 = abs % 100;
    var word = 'лет';
    if (m10 === 1 && m100 !== 11) word = 'год';
    else if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) word = 'года';
    return abs + ' ' + word;
  };

  /* ---------- Разделитель тысяч: 12480 -> «12 480» ---------- */
  UI.formatNumber = function (n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  /* ---------- Шапка ---------- */
  UI.renderHeader = function (activeKey) {
    var host = document.getElementById('app-header');
    if (!host) return;
    var links = NAV_ITEMS.map(function (item) {
      var cls = item.key === activeKey ? ' class="active"' : '';
      return '<a href="' + item.href + '"' + cls + '>' + item.label + '</a>';
    }).join('');
    host.innerHTML =
      '<div class="header-inner">' +
        '<a class="brand" href="index.html">' +
          '<img class="brand-logo" src="assets/logo.svg" alt="Логотип «Траектория»">' +
          '<span class="brand-name">ТРАЕКТОРИЯ</span>' +
        '</a>' +
        '<nav class="top-nav" aria-label="Основная навигация">' + links + '</nav>' +
        '<span class="badge badge-demo header-badge">ДЕМО-ДАННЫЕ</span>' +
      '</div>';
  };

  /* ---------- Мобильный нижний таб-бар ---------- */
  UI.renderBottomNav = function (activeKey) {
    var host = document.getElementById('app-bottomnav');
    if (!host) return;
    var items = NAV_ITEMS.map(function (item) {
      var cls = 'bn-item' + (item.key === activeKey ? ' active' : '');
      return '<a href="' + item.href + '" class="' + cls + '">' +
        ICONS[item.icon] + '<span>' + item.mobileLabel + '</span></a>';
    }).join('');
    host.innerHTML = '<nav class="bottom-nav" aria-label="Нижняя навигация">' + items + '</nav>';
  };

  /* ---------- Футер ---------- */
  UI.renderFooter = function () {
    var host = document.getElementById('app-footer');
    if (!host) return;
    host.innerHTML =
      '<div class="footer-inner">' +
        'Демонстрационный прототип. Все данные вымышленные. ' +
        'Концепция платформы: Бакиров Айдар Ильдусович, свидетельство о депонировании №4405866 от 30.06.2026.' +
      '</div>';
  };

  /* ---------- Тост ---------- */
  UI.toast = function (message) {
    var old = document.querySelector('.toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = message;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 300);
    }, 3000);
  };

  /* ---------- Модалка ---------- */
  function onEscape(e) {
    if (e.key === 'Escape') UI.closeModal();
  }

  UI.openModal = function (html) {
    UI.closeModal();
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'ui-modal-overlay';
    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true">' +
        '<button class="modal-close" type="button" aria-label="Закрыть">&#10005;</button>' +
        '<div class="modal-body">' + html + '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) UI.closeModal();
    });
    overlay.querySelector('.modal-close').addEventListener('click', UI.closeModal);
    document.addEventListener('keydown', onEscape);
  };

  UI.closeModal = function () {
    var overlay = document.getElementById('ui-modal-overlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onEscape);
  };

  /* ---------- Кольцо скоринга (HTML-хелпер) ---------- */
  /* Возвращает разметку .score-ring; цвет: 80+ зелёный, 60–79 синий, ниже серый */
  UI.scoreRing = function (value, size) {
    size = size || 72;
    var stroke = 6;
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var offset = c * (1 - Math.max(0, Math.min(100, value)) / 100);
    var mod = value >= 80 ? ' score-ring--high' : (value >= 60 ? '' : ' score-ring--low');
    return '<span class="score-ring' + mod + '" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' +
        '<circle class="ring-bg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '"/>' +
        '<circle class="ring-val" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke +
          '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '"/>' +
      '</svg>' +
      '<span class="score-ring__num">' + Math.round(value) + '</span>' +
    '</span>';
  };

  /* ==========================================================================
     Скоринг кандидата.
     filters: { education, industries:[], minExperience,
                northMinYears, dpo, minGpa, minEgeProfile, kpi }
     Желательные поля могут быть null/false/0 — критерий пропускается.
     Возврат: { total: 0..100, passed: boolean, breakdown: [...] }
     ========================================================================== */
  UI.scoreCandidate = function (candidate, filters) {
    filters = filters || {};
    var breakdown = [];
    var passed = true;
    var total = 0;

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    /* Добавляет критерий в расшифровку и возвращает округлённые баллы */
    function crit(criterion, ok, points, max, comment) {
      var p = Math.round(points);
      breakdown.push({ criterion: criterion, ok: ok, points: p, max: max, comment: comment });
      return p;
    }

    var LEVEL_RANK = { 'СПО': 1, 'ВО': 2 };

    /* === Обязательные критерии: провал любого => passed = false === */
    if (filters.education) {
      var okEdu = (LEVEL_RANK[candidate.education.level] || 0) >= (LEVEL_RANK[filters.education] || 0);
      if (!okEdu) passed = false;
      crit('Уровень образования (обязательно)', okEdu, 0, 0,
        candidate.education.level + ' — требуется ' + filters.education);
    }
    if (filters.industries && filters.industries.length) {
      var okInd = filters.industries.indexOf(candidate.industry) !== -1;
      if (!okInd) passed = false;
      crit('Отрасль (обязательно)', okInd, 0, 0, 'Отрасль кандидата: ' + candidate.industry);
    }
    if (typeof filters.minExperience === 'number' && filters.minExperience > 0) {
      var okExp = candidate.experienceYears >= filters.minExperience;
      if (!okExp) passed = false;
      crit('Минимальный стаж (обязательно)', okExp, 0, 0,
        'Стаж ' + UI.formatYears(candidate.experienceYears) +
        ' — требуется минимум ' + UI.formatYears(filters.minExperience));
    }

    /* База 40 баллов начисляется прошедшим обязательный отбор */
    if (passed) {
      total += crit('Соответствие обязательным требованиям', true, 40, 40, 'Базовые баллы за прохождение фильтров');
    } else {
      crit('Соответствие обязательным требованиям', false, 0, 40, 'Обязательные критерии не пройдены');
    }

    /* === Желательные (взвешенные) критерии === */

    /* Превышение стажа: +2 за каждый год сверх минимума, максимум +10 */
    var minExp = (typeof filters.minExperience === 'number') ? filters.minExperience : 0;
    var surplus = Math.max(0, candidate.experienceYears - minExp);
    total += crit('Превышение стажа', surplus > 0, clamp(surplus * 2, 0, 10), 10,
      surplus > 0 ? '+' + UI.formatYears(surplus) + ' сверх минимума' : 'Стаж на уровне минимума');

    /* Средний балл диплома: линейно от порога до 5.0, максимум +12 */
    if (typeof filters.minGpa === 'number' && filters.minGpa > 0) {
      var gpa = candidate.education.gpa;
      var pGpa = clamp(12 * (gpa - filters.minGpa) / (5 - filters.minGpa), 0, 12);
      total += crit('Средний балл диплома', gpa >= filters.minGpa, pGpa, 12,
        'GPA ' + gpa.toFixed(1) + ' при пороге ' + filters.minGpa.toFixed(1));
    }

    /* Профильный ЕГЭ (математика): линейно от порога до 100, максимум +8 */
    if (typeof filters.minEgeProfile === 'number' && filters.minEgeProfile > 0) {
      var math = candidate.ege.math;
      var pEge = clamp(8 * (math - filters.minEgeProfile) / (100 - filters.minEgeProfile), 0, 8);
      total += crit('Профильный ЕГЭ (математика)', math >= filters.minEgeProfile, pEge, 8,
        'Результат ' + math + ' при пороге ' + filters.minEgeProfile);
    }

    /* Северный стаж (РКС): выполнение нормы +10, +2 за каждый полный год сверх, максимум +14 */
    if (typeof filters.northMinYears === 'number' && filters.northMinYears > 0) {
      var n = candidate.northExperience;
      var northYears = n ? n.years + n.months / 12 : 0;
      var pNorth = 0;
      if (northYears >= filters.northMinYears) {
        pNorth = clamp(10 + 2 * Math.floor(northYears - filters.northMinYears), 0, 14);
      } else if (northYears > 0) {
        pNorth = 6 * northYears / filters.northMinYears; // частичный зачёт
      }
      total += crit('Северный стаж (РКС)', northYears >= filters.northMinYears, pNorth, 14,
        n ? 'Северный стаж ' + n.years + ' г. ' + n.months + ' мес. (РКС)' : 'Северного стажа нет');
    }

    /* ДПО: +5 за программу, максимум +10 */
    if (filters.dpo) {
      var dpoCount = (candidate.dpo || []).length;
      total += crit('Программы ДПО', dpoCount > 0, clamp(dpoCount * 5, 0, 10), 10,
        dpoCount > 0 ? 'Пройдено программ ДПО: ' + dpoCount : 'Программы ДПО не пройдены');
    }

    /* Олимпиады: региональный уровень +2, всероссийский +4 (учитывается лучшая) */
    var olympiads = candidate.olympiads || [];
    var pOly = 0;
    for (var i = 0; i < olympiads.length; i++) {
      pOly = Math.max(pOly, olympiads[i].level === 'всероссийский' ? 4 : 2);
    }
    total += crit('Олимпиады', pOly > 0, pOly, 4,
      olympiads.length > 0 ? olympiads[0].name + ' — ' + olympiads[0].result : 'Участия в олимпиадах нет');

    /* Производственные KPI: рацпредложение +1, проект +0.5, максимум +8 */
    if (filters.kpi) {
      var k = candidate.kpi || { rationalizations: 0, projects: 0 };
      var pKpi = clamp(k.rationalizations + k.projects * 0.5, 0, 8);
      total += crit('Производственные KPI', pKpi > 0, pKpi, 8,
        'Рацпредложения: ' + k.rationalizations + ', завершённые проекты: ' + k.projects);
    }

    /* Средний уровень компетенций: до +4 */
    var comps = candidate.competencies || [];
    var avg = 0;
    for (var j = 0; j < comps.length; j++) avg += comps[j].value;
    avg = comps.length ? avg / comps.length : 0;
    total += crit('Средний уровень компетенций', avg >= 70, 4 * avg / 100, 4,
      'Средняя оценка компетенций: ' + Math.round(avg) + ' из 100');

    return {
      total: clamp(Math.round(total), 0, 100),
      passed: passed,
      breakdown: breakdown
    };
  };

  window.UI = UI;
})();
