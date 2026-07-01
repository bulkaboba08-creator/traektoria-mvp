/* ==========================================================================
   «Траектория» — скрипт главной страницы (index.html)
   Порядок подключения: js/data.js -> js/shared.js -> js/index.js (все defer)
   ========================================================================== */

(function () {
  'use strict';

  UI.renderHeader('home');
  UI.renderBottomNav('home');
  UI.renderFooter();

  /* Полоса цифр — из демонстрационной региональной статистики */
  var s = window.DB.regionStats;

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  setText('stat-profiles', UI.formatNumber(s.totalProfiles));
  setText('stat-vacancies', UI.formatNumber(s.closedVacancies));
  setText('stat-days', s.avgHiringDaysNow + ' дней');
  setText('stat-days-label', 'срок подбора вместо ' + s.avgHiringDaysBefore + ' дней');
})();
