/* ==========================================================================
   «Траектория» — демонстрационные данные (window.DB)
   ВСЕ ПЕРСОНАЛЬНЫЕ ДАННЫЕ ВЫМЫШЛЕННЫЕ. Прототип для грантовой заявки.
   Подключение: <script src="js/data.js" defer></script> (до shared.js)
   ========================================================================== */

window.DB = {

  /* ---------- Эталонный профиль гражданина ---------- */
  currentUser: {
    id: 'c01',
    fio: 'Валеев Тимур Айратович',
    firstName: 'Тимур',
    age: 29,
    city: 'Уфа',
    avatarInitials: 'ТВ',
    scoreTotal: 87,
    verifiedDocs: 12,

    trajectory: {
      school: {
        attestat: { avg: 4.8, year: 2014, school: 'Лицей №60, г. Уфа', verified: 'Рособрнадзор' },
        ege: [
          { subject: 'Математика (профиль)', score: 92 },
          { subject: 'Русский язык', score: 88 },
          { subject: 'Физика', score: 90 }
        ],
        olympiads: [
          { name: 'Региональная олимпиада по физике', result: 'Призёр', year: 2013 }
        ],
        clubs: [
          { name: 'Кружок робототехники', years: '3 года' }
        ]
      },
      education: {
        university: 'УГНТУ, г. Уфа',
        degree: 'Специалитет',
        specialty: 'Технологические машины и оборудование',
        years: '2014–2019',
        gpa: 4.6,
        diplomaVerified: 'ФРДО',
        practices: [
          { org: 'ПАО «УМПО», г. Уфа', grade: 'Отлично', review: 'Проявил высокий уровень инженерной подготовки' }
        ],
        projects: ['Курсовой проект: автоматизация линии контроля качества']
      },
      career: {
        etk: [
          { role: 'Техник-технолог', org: 'ПАО «УМПО»', period: '2019–2021', verified: 'СФР' },
          { role: 'Инженер-технолог', org: 'ООО «ЯмалГазИнжиниринг»', period: '2021–2023', verified: 'СФР' },
          { role: 'Ведущий инженер-технолог', org: 'АО «БашПромМаш»', period: '2023 — н. в.', verified: 'СФР' }
        ],
        north: { region: 'ЯНАО, г. Новый Уренгой', period: '2021–2023', years: 2, months: 4, verified: 'СФР' },
        dpo: [
          { name: 'Промышленная безопасность', year: 2024, org: 'УЦ «ПромСтандарт»', verified: 'ФРДО' },
          { name: 'АСУ ТП: современные системы', year: 2025, org: 'ИДПО УГНТУ', verified: 'ФРДО' }
        ],
        kpi: [
          { label: 'Внедрённые рацпредложения', value: 4 },
          { label: 'Завершённые проекты', value: 11 }
        ]
      }
    },

    competencies: [
      { name: 'Инженерный анализ', value: 92 },
      { name: 'Промышленная автоматизация', value: 88 },
      { name: 'Работа в сложных условиях', value: 90 },
      { name: 'Проектная работа', value: 84 },
      { name: 'Цифровые инструменты', value: 81 },
      { name: 'Охрана труда и ПБ', value: 86 }
    ],

    accessGrants: [
      { org: 'АО «ГеоТех»', until: '15.07.2026', scope: ['Образование', 'Стаж', 'ДПО'] }
    ],

    accessLog: [
      { org: 'АО «ГеоТех»', date: '28.06.2026 14:12', action: 'Просмотр раздела «Образование»' },
      { org: 'Министерство промышленности РБ', date: '20.06.2026 10:03', action: 'Запрос доступа отклонён' },
      { org: 'АО «ГеоТех»', date: '18.06.2026 09:41', action: 'Доступ предоставлен (72 ч)' }
    ]
  },

  /* ---------- База кандидатов (24, вымышленные) ---------- */
  candidates: [
    {
      id: 'c01',
      fio: 'Валеев Тимур Айратович',
      gender: 'м',
      age: 29,
      city: 'Уфа',
      specialty: 'Технологические машины и оборудование',
      industry: 'машиностроение',
      education: { level: 'ВО', university: 'УГНТУ, г. Уфа', degree: 'Специалитет', gpa: 4.6, diplomaVerified: true },
      ege: { math: 92, rus: 88, subject: 'Физика', subjectScore: 90 },
      olympiads: [{ name: 'Региональная олимпиада по физике', level: 'региональный', result: 'Призёр' }],
      dpo: [
        { name: 'Промышленная безопасность', year: 2024 },
        { name: 'АСУ ТП: современные системы', year: 2025 }
      ],
      experienceYears: 6,
      positions: [
        { role: 'Техник-технолог', org: 'ПАО «УМПО»', period: '2019–2021' },
        { role: 'Инженер-технолог', org: 'ООО «ЯмалГазИнжиниринг»', period: '2021–2023' },
        { role: 'Ведущий инженер-технолог', org: 'АО «БашПромМаш»', period: '2023 — н. в.' }
      ],
      northExperience: { years: 2, months: 4, region: 'ЯНАО, г. Новый Уренгой' },
      kpi: { rationalizations: 4, projects: 11 },
      competencies: [
        { name: 'Инженерный анализ', value: 92 },
        { name: 'Промышленная автоматизация', value: 88 },
        { name: 'Работа в сложных условиях', value: 90 },
        { name: 'Проектная работа', value: 84 }
      ],
      available: true
    },
    {
      id: 'c02',
      fio: 'Гарипова Алия Маратовна',
      gender: 'ж',
      age: 27,
      city: 'Уфа',
      specialty: 'Автоматизация технологических процессов',
      industry: 'ИТ',
      education: { level: 'ВО', university: 'УУНиТ, г. Уфа', degree: 'Бакалавриат', gpa: 4.8, diplomaVerified: true },
      ege: { math: 94, rus: 91, subject: 'Информатика', subjectScore: 96 },
      olympiads: [{ name: 'Олимпиада «IT-Планета»', level: 'региональный', result: 'Призёр' }],
      dpo: [
        { name: 'Python для промышленной автоматизации', year: 2024 },
        { name: 'Промышленные сети и контроллеры', year: 2023 }
      ],
      experienceYears: 4,
      positions: [
        { role: 'Инженер-программист', org: 'ООО «УфаСофтПром»', period: '2022–2024' },
        { role: 'Инженер-программист АСУ ТП', org: 'ООО «БашЦифра»', period: '2024 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 2, projects: 9 },
      competencies: [
        { name: 'Программирование', value: 95 },
        { name: 'АСУ ТП', value: 88 },
        { name: 'Анализ данных', value: 86 },
        { name: 'Проектная работа', value: 82 }
      ],
      available: true
    },
    {
      id: 'c03',
      fio: 'Смирнов Дмитрий Олегович',
      gender: 'м',
      age: 33,
      city: 'Стерлитамак',
      specialty: 'Электроэнергетика и электротехника',
      industry: 'энергетика',
      education: { level: 'ВО', university: 'УГНТУ, г. Уфа', degree: 'Бакалавриат', gpa: 4.1, diplomaVerified: true },
      ege: { math: 78, rus: 72, subject: 'Физика', subjectScore: 81 },
      olympiads: [],
      dpo: [{ name: 'Релейная защита и автоматика', year: 2023 }],
      experienceYears: 9,
      positions: [
        { role: 'Электромонтёр', org: 'ООО «БашРЭС»', period: '2017–2019' },
        { role: 'Инженер-энергетик', org: 'ООО «СеверЭнергоМонтаж»', period: '2019–2023' },
        { role: 'Ведущий инженер-энергетик', org: 'ООО «СтерлитамакЭнерго»', period: '2023 — н. в.' }
      ],
      northExperience: { years: 4, months: 0, region: 'ХМАО, г. Сургут' },
      kpi: { rationalizations: 3, projects: 14 },
      competencies: [
        { name: 'Релейная защита', value: 86 },
        { name: 'Эксплуатация сетей', value: 84 },
        { name: 'Работа в сложных условиях', value: 82 },
        { name: 'Проектная работа', value: 80 }
      ],
      available: true
    },
    {
      id: 'c04',
      fio: 'Хабибуллина Гузель Ринатовна',
      gender: 'ж',
      age: 25,
      city: 'Нефтекамск',
      specialty: 'Химическая технология',
      industry: 'нефтегаз',
      education: { level: 'ВО', university: 'УГНТУ, г. Уфа', degree: 'Бакалавриат', gpa: 4.4, diplomaVerified: true },
      ege: { math: 84, rus: 87, subject: 'Физика', subjectScore: 79 },
      olympiads: [],
      dpo: [],
      experienceYears: 2,
      positions: [
        { role: 'Технолог', org: 'ООО «НефтеХимПром»', period: '2024 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 1, projects: 4 },
      competencies: [
        { name: 'Химическая технология', value: 84 },
        { name: 'Контроль качества', value: 80 },
        { name: 'Цифровые инструменты', value: 76 },
        { name: 'Командная работа', value: 82 }
      ],
      available: true
    },
    {
      id: 'c05',
      fio: 'Петров Артём Сергеевич',
      gender: 'м',
      age: 31,
      city: 'Октябрьский',
      specialty: 'Бурение нефтяных и газовых скважин',
      industry: 'нефтегаз',
      education: { level: 'ВО', university: 'УГНТУ, г. Уфа', degree: 'Специалитет', gpa: 3.9, diplomaVerified: true },
      ege: { math: 74, rus: 70, subject: 'Физика', subjectScore: 76 },
      olympiads: [],
      dpo: [{ name: 'Промышленная безопасность', year: 2022 }],
      experienceYears: 8,
      positions: [
        { role: 'Помощник бурильщика', org: 'ООО «БурСервис»', period: '2018–2020' },
        { role: 'Инженер по бурению', org: 'ООО «ЯмалБурГаз»', period: '2020–2024' },
        { role: 'Ведущий инженер по бурению', org: 'ООО «ВолгаНефтеСервис»', period: '2024 — н. в.' }
      ],
      northExperience: { years: 4, months: 2, region: 'ЯНАО, г. Надым' },
      kpi: { rationalizations: 2, projects: 10 },
      competencies: [
        { name: 'Буровые работы', value: 88 },
        { name: 'Промышленная безопасность', value: 84 },
        { name: 'Работа в сложных условиях', value: 90 },
        { name: 'Проектная работа', value: 74 }
      ],
      available: true
    },
    {
      id: 'c06',
      fio: 'Иванова Екатерина Владимировна',
      gender: 'ж',
      age: 24,
      city: 'Уфа',
      specialty: 'Программная инженерия',
      industry: 'ИТ',
      education: { level: 'ВО', university: 'УУНиТ, г. Уфа', degree: 'Бакалавриат', gpa: 4.7, diplomaVerified: true },
      ege: { math: 88, rus: 94, subject: 'Информатика', subjectScore: 91 },
      olympiads: [],
      dpo: [],
      experienceYears: 2,
      positions: [
        { role: 'Фронтенд-разработчик', org: 'ООО «Цифровая Уфа»', period: '2024 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 0, projects: 6 },
      competencies: [
        { name: 'Веб-разработка', value: 90 },
        { name: 'Интерфейсы (UI/UX)', value: 84 },
        { name: 'Цифровые инструменты', value: 88 },
        { name: 'Командная работа', value: 80 }
      ],
      available: true
    },
    {
      id: 'c07',
      fio: 'Ахметов Руслан Фанилевич',
      gender: 'м',
      age: 30,
      city: 'Салават',
      specialty: 'Конструкторско-технологическое обеспечение машиностроения',
      industry: 'машиностроение',
      education: { level: 'ВО', university: 'УГАТУ, г. Уфа', degree: 'Специалитет', gpa: 4.2, diplomaVerified: true },
      ege: { math: 80, rus: 75, subject: 'Физика', subjectScore: 83 },
      olympiads: [],
      dpo: [{ name: 'Бережливое производство', year: 2023 }],
      experienceYears: 7,
      positions: [
        { role: 'Инженер-механик', org: 'АО «Салаватский машзавод»', period: '2019–2024' },
        { role: 'Старший инженер-механик', org: 'АО «Салаватский машзавод»', period: '2024 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 5, projects: 8 },
      competencies: [
        { name: 'Механическая обработка', value: 86 },
        { name: 'Бережливое производство', value: 82 },
        { name: 'Наставничество', value: 78 },
        { name: 'Охрана труда', value: 84 }
      ],
      available: true
    },
    {
      id: 'c08',
      fio: 'Козлова Мария Андреевна',
      gender: 'ж',
      age: 28,
      city: 'Челябинск',
      specialty: 'Проектирование технологических машин',
      industry: 'машиностроение',
      education: { level: 'ВО', university: 'ЮУрГУ, г. Челябинск', degree: 'Магистратура', gpa: 4.5, diplomaVerified: true },
      ege: { math: 86, rus: 89, subject: 'Физика', subjectScore: 84 },
      olympiads: [{ name: 'Региональная олимпиада по математике', level: 'региональный', result: 'Победитель' }],
      dpo: [],
      experienceYears: 5,
      positions: [
        { role: 'Инженер-конструктор', org: 'АО «ЧелябТяжМаш»', period: '2021 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 3, projects: 7 },
      competencies: [
        { name: 'Конструирование (CAD)', value: 90 },
        { name: 'Инженерный анализ', value: 84 },
        { name: 'Проектная работа', value: 80 },
        { name: 'Цифровые инструменты', value: 78 }
      ],
      available: true
    },
    {
      id: 'c09',
      fio: 'Николаев Павел Игоревич',
      gender: 'м',
      age: 34,
      city: 'Магнитогорск',
      specialty: 'Электроснабжение промышленных предприятий',
      industry: 'энергетика',
      education: { level: 'ВО', university: 'МГТУ им. Г. И. Носова, г. Магнитогорск', degree: 'Бакалавриат', gpa: 3.8, diplomaVerified: true },
      ege: { math: 68, rus: 66, subject: 'Физика', subjectScore: 71 },
      olympiads: [],
      dpo: [{ name: 'Охрана труда и электробезопасность', year: 2021 }],
      experienceYears: 10,
      positions: [
        { role: 'Электромонтёр', org: 'ООО «МагЭнерго»', period: '2016–2019' },
        { role: 'Инженер подстанции', org: 'АО «СеверЭнерго»', period: '2019–2024' },
        { role: 'Старший энергетик', org: 'ООО «УралСетьСервис»', period: '2024 — н. в.' }
      ],
      northExperience: { years: 5, months: 0, region: 'ХМАО, г. Нижневартовск' },
      kpi: { rationalizations: 1, projects: 12 },
      competencies: [
        { name: 'Эксплуатация подстанций', value: 82 },
        { name: 'Охрана труда', value: 80 },
        { name: 'Работа в сложных условиях', value: 78 },
        { name: 'Цифровые инструменты', value: 72 }
      ],
      available: true
    },
    {
      id: 'c10',
      fio: 'Сафина Лилия Илдаровна',
      gender: 'ж',
      age: 26,
      city: 'Уфа',
      specialty: 'Промышленное и гражданское строительство',
      industry: 'строительство',
      education: { level: 'ВО', university: 'УГНТУ (АСИ), г. Уфа', degree: 'Бакалавриат', gpa: 4.3, diplomaVerified: true },
      ege: { math: 76, rus: 84, subject: 'Физика', subjectScore: 72 },
      olympiads: [],
      dpo: [],
      experienceYears: 3,
      positions: [
        { role: 'Инженер ПТО', org: 'ООО «БашСтройИнвест»', period: '2023 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 0, projects: 5 },
      competencies: [
        { name: 'Проектирование ПГС', value: 82 },
        { name: 'Сметное дело', value: 76 },
        { name: 'Цифровые инструменты', value: 74 },
        { name: 'Командная работа', value: 80 }
      ],
      available: true
    },
    {
      id: 'c11',
      fio: 'Логинов Кирилл Андреевич',
      gender: 'м',
      age: 23,
      city: 'Пермь',
      specialty: 'Прикладная информатика',
      industry: 'ИТ',
      education: { level: 'ВО', university: 'ПНИПУ, г. Пермь', degree: 'Бакалавриат', gpa: 4.9, diplomaVerified: true },
      ege: { math: 96, rus: 89, subject: 'Информатика', subjectScore: 98 },
      olympiads: [{ name: 'Всероссийская олимпиада школьников по информатике', level: 'всероссийский', result: 'Призёр' }],
      dpo: [],
      experienceYears: 1,
      positions: [
        { role: 'Младший разработчик', org: 'ООО «ПермДиджитал»', period: '2025 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 0, projects: 3 },
      competencies: [
        { name: 'Алгоритмы', value: 96 },
        { name: 'Веб-разработка', value: 88 },
        { name: 'Анализ данных', value: 84 },
        { name: 'Командная работа', value: 72 }
      ],
      available: true
    },
    {
      id: 'c12',
      fio: 'Морозов Степан Викторович',
      gender: 'м',
      age: 32,
      city: 'Екатеринбург',
      specialty: 'Строительство и эксплуатация зданий',
      industry: 'строительство',
      education: { level: 'СПО', university: 'Уральский колледж строительства, г. Екатеринбург', degree: 'СПО (техник)', gpa: 4.0, diplomaVerified: true },
      ege: { math: 56, rus: 63, subject: 'Физика', subjectScore: 54 },
      olympiads: [],
      dpo: [{ name: 'Организация строительного контроля', year: 2022 }],
      experienceYears: 10,
      positions: [
        { role: 'Монтажник', org: 'ООО «УралСтройМонтаж»', period: '2016–2020' },
        { role: 'Мастер СМР', org: 'ООО «СеверСтройГаз»', period: '2020–2023' },
        { role: 'Прораб', org: 'ООО «ЕкатСтрой»', period: '2023 — н. в.' }
      ],
      northExperience: { years: 2, months: 8, region: 'ЯНАО, г. Новый Уренгой' },
      kpi: { rationalizations: 2, projects: 15 },
      competencies: [
        { name: 'Организация СМР', value: 84 },
        { name: 'Работа в сложных условиях', value: 86 },
        { name: 'Охрана труда', value: 80 },
        { name: 'Наставничество', value: 78 }
      ],
      available: false
    },
    {
      id: 'c13',
      fio: 'Юсупова Динара Рамилевна',
      gender: 'ж',
      age: 29,
      city: 'Туймазы',
      specialty: 'Экология и природопользование',
      industry: 'нефтегаз',
      education: { level: 'ВО', university: 'УГНТУ, г. Уфа', degree: 'Магистратура', gpa: 4.5, diplomaVerified: true },
      ege: { math: 82, rus: 90, subject: 'Физика', subjectScore: 77 },
      olympiads: [],
      dpo: [{ name: 'Экологическая безопасность предприятий', year: 2023 }],
      experienceYears: 5,
      positions: [
        { role: 'Инженер-эколог', org: 'АО «БашНефтеПереработка»', period: '2021 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 2, projects: 6 },
      competencies: [
        { name: 'Экологический контроль', value: 86 },
        { name: 'Нормативная документация', value: 84 },
        { name: 'Аналитика', value: 78 },
        { name: 'Командная работа', value: 82 }
      ],
      available: true
    },
    {
      id: 'c14',
      fio: 'Крылов Никита Дмитриевич',
      gender: 'м',
      age: 27,
      city: 'Ижевск',
      specialty: 'Автоматизация технологических процессов',
      industry: 'энергетика',
      education: { level: 'ВО', university: 'ИжГТУ им. Калашникова, г. Ижевск', degree: 'Бакалавриат', gpa: 4.4, diplomaVerified: true },
      ege: { math: 85, rus: 79, subject: 'Информатика', subjectScore: 88 },
      olympiads: [],
      dpo: [{ name: 'SCADA-системы и промышленная автоматизация', year: 2024 }],
      experienceYears: 4,
      positions: [
        { role: 'Инженер АСУ ТП', org: 'АО «ИжЭнергоСистемы»', period: '2022 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 1, projects: 7 },
      competencies: [
        { name: 'АСУ ТП', value: 88 },
        { name: 'Программирование ПЛК', value: 84 },
        { name: 'Инженерный анализ', value: 80 },
        { name: 'Цифровые инструменты', value: 86 }
      ],
      available: true
    },
    {
      id: 'c15',
      fio: 'Осипова Анна Сергеевна',
      gender: 'ж',
      age: 30,
      city: 'Уфа',
      specialty: 'Бизнес-информатика',
      industry: 'ИТ',
      education: { level: 'ВО', university: 'УУНиТ, г. Уфа', degree: 'Магистратура', gpa: 4.2, diplomaVerified: true },
      ege: { math: 81, rus: 92, subject: 'Информатика', subjectScore: 84 },
      olympiads: [],
      dpo: [{ name: 'Управление проектами (IPMA)', year: 2022 }],
      experienceYears: 6,
      positions: [
        { role: 'Аналитик', org: 'ООО «УфаНет-Решения»', period: '2020–2023' },
        { role: 'Руководитель ИТ-проектов', org: 'ООО «БашДиджитал»', period: '2023 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 1, projects: 13 },
      competencies: [
        { name: 'Управление проектами', value: 88 },
        { name: 'Аналитика', value: 84 },
        { name: 'Коммуникации', value: 90 },
        { name: 'Цифровые инструменты', value: 82 }
      ],
      available: false
    },
    {
      id: 'c16',
      fio: 'Галиев Марат Рустэмович',
      gender: 'м',
      age: 28,
      city: 'Ишимбай',
      specialty: 'Технология машиностроения',
      industry: 'машиностроение',
      education: { level: 'СПО', university: 'Ишимбайский нефтяной колледж', degree: 'СПО (техник-технолог)', gpa: 4.6, diplomaVerified: true },
      ege: { math: 62, rus: 68, subject: 'Физика', subjectScore: 60 },
      olympiads: [],
      dpo: [{ name: 'Программирование стоек ЧПУ Fanuc', year: 2023 }],
      experienceYears: 7,
      positions: [
        { role: 'Оператор станков с ЧПУ', org: 'АО «ИшимбайМаш»', period: '2019–2023' },
        { role: 'Наладчик станков с ЧПУ', org: 'АО «ИшимбайМаш»', period: '2023 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 6, projects: 9 },
      competencies: [
        { name: 'Станки с ЧПУ', value: 92 },
        { name: 'Наладка оборудования', value: 88 },
        { name: 'Чтение чертежей', value: 84 },
        { name: 'Охрана труда', value: 78 }
      ],
      available: true
    },
    {
      id: 'c17',
      fio: 'Соколова Вера Павловна',
      gender: 'ж',
      age: 31,
      city: 'Оренбург',
      specialty: 'Электроэнергетика и электротехника',
      industry: 'энергетика',
      education: { level: 'ВО', university: 'ОГУ, г. Оренбург', degree: 'Бакалавриат', gpa: 4.0, diplomaVerified: true },
      ege: { math: 72, rus: 81, subject: 'Физика', subjectScore: 69 },
      olympiads: [],
      dpo: [],
      experienceYears: 7,
      positions: [
        { role: 'Инженер-энергетик', org: 'ООО «КомиЭнергоСервис»', period: '2019–2022' },
        { role: 'Инженер-энергетик', org: 'АО «ОренбургСеть»', period: '2022 — н. в.' }
      ],
      northExperience: { years: 3, months: 2, region: 'Республика Коми, г. Усинск' },
      kpi: { rationalizations: 2, projects: 9 },
      competencies: [
        { name: 'Эксплуатация сетей', value: 82 },
        { name: 'Релейная защита', value: 78 },
        { name: 'Работа в сложных условиях', value: 80 },
        { name: 'Охрана труда', value: 76 }
      ],
      available: true
    },
    {
      id: 'c18',
      fio: 'Фёдоров Глеб Максимович',
      gender: 'м',
      age: 22,
      city: 'Уфа',
      specialty: 'Техническая эксплуатация электрооборудования',
      industry: 'энергетика',
      education: { level: 'СПО', university: 'Уфимский топливно-энергетический колледж', degree: 'СПО (техник-электрик)', gpa: 4.3, diplomaVerified: true },
      ege: { math: 58, rus: 64, subject: 'Физика', subjectScore: 55 },
      olympiads: [],
      dpo: [],
      experienceYears: 1,
      positions: [
        { role: 'Техник-электрик', org: 'ООО «УфаГорСвет»', period: '2025 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 0, projects: 2 },
      competencies: [
        { name: 'Электромонтаж', value: 74 },
        { name: 'Эксплуатация сетей', value: 68 },
        { name: 'Цифровые инструменты', value: 66 },
        { name: 'Командная работа', value: 72 }
      ],
      available: true
    },
    {
      id: 'c19',
      fio: 'Мустафина Эльвира Азатовна',
      gender: 'ж',
      age: 26,
      city: 'Казань',
      specialty: 'Химическая технология органических веществ',
      industry: 'нефтегаз',
      education: { level: 'ВО', university: 'КНИТУ, г. Казань', degree: 'Магистратура', gpa: 4.7, diplomaVerified: true },
      ege: { math: 89, rus: 93, subject: 'Физика', subjectScore: 85 },
      olympiads: [{ name: 'Региональная олимпиада по химии', level: 'региональный', result: 'Победитель' }],
      dpo: [],
      experienceYears: 3,
      positions: [
        { role: 'Инженер-технолог', org: 'АО «КазаньНефтеХим»', period: '2023 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 1, projects: 5 },
      competencies: [
        { name: 'Химическая технология', value: 90 },
        { name: 'Контроль качества', value: 86 },
        { name: 'Инженерный анализ', value: 82 },
        { name: 'Цифровые инструменты', value: 78 }
      ],
      available: true
    },
    {
      id: 'c20',
      fio: 'Ермолаев Владислав Юрьевич',
      gender: 'м',
      age: 33,
      city: 'Уфа',
      specialty: 'Бурение нефтяных и газовых скважин',
      industry: 'нефтегаз',
      education: { level: 'ВО', university: 'УГНТУ, г. Уфа', degree: 'Специалитет', gpa: 3.6, diplomaVerified: true },
      ege: { math: 65, rus: 61, subject: 'Физика', subjectScore: 67 },
      olympiads: [],
      dpo: [{ name: 'Контроль скважины. Управление скважиной при ГНВП', year: 2021 }],
      experienceYears: 10,
      positions: [
        { role: 'Помощник бурового мастера', org: 'ООО «ЯмалБурГаз»', period: '2016–2019' },
        { role: 'Буровой мастер', org: 'ООО «ЯмалБурГаз»', period: '2019–2022' },
        { role: 'Буровой мастер', org: 'ООО «УфаНефтеСервис»', period: '2022 — н. в.' }
      ],
      northExperience: { years: 6, months: 3, region: 'ЯНАО, г. Новый Уренгой' },
      kpi: { rationalizations: 3, projects: 16 },
      competencies: [
        { name: 'Буровые работы', value: 88 },
        { name: 'Промышленная безопасность', value: 82 },
        { name: 'Работа в сложных условиях', value: 86 },
        { name: 'Цифровые инструменты', value: 58 }
      ],
      available: true
    },
    {
      id: 'c21',
      fio: 'Романова Ольга Дмитриевна',
      gender: 'ж',
      age: 24,
      city: 'Стерлитамак',
      specialty: 'Химическая технология',
      industry: 'нефтегаз',
      education: { level: 'ВО', university: 'УГНТУ (филиал), г. Стерлитамак', degree: 'Бакалавриат', gpa: 4.1, diplomaVerified: true },
      ege: { math: 71, rus: 83, subject: 'Физика', subjectScore: 66 },
      olympiads: [],
      dpo: [],
      experienceYears: 2,
      positions: [
        { role: 'Инженер-химик', org: 'АО «СтерлитамакХимПром»', period: '2024 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 0, projects: 3 },
      competencies: [
        { name: 'Химическая технология', value: 78 },
        { name: 'Лабораторный анализ', value: 80 },
        { name: 'Цифровые инструменты', value: 70 },
        { name: 'Командная работа', value: 76 }
      ],
      available: true
    },
    {
      id: 'c22',
      fio: 'Кузнецов Андрей Валерьевич',
      gender: 'м',
      age: 29,
      city: 'Самара',
      specialty: 'Информатика и вычислительная техника',
      industry: 'ИТ',
      education: { level: 'ВО', university: 'СамГТУ, г. Самара', degree: 'Бакалавриат', gpa: 4.3, diplomaVerified: true },
      ege: { math: 87, rus: 78, subject: 'Информатика', subjectScore: 90 },
      olympiads: [],
      dpo: [{ name: 'DevOps-практики и контейнеризация', year: 2024 }],
      experienceYears: 5,
      positions: [
        { role: 'Инженер-программист', org: 'ООО «СамараСофт»', period: '2021 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 1, projects: 8 },
      competencies: [
        { name: 'Программирование', value: 88 },
        { name: 'DevOps', value: 84 },
        { name: 'Анализ данных', value: 80 },
        { name: 'Командная работа', value: 82 }
      ],
      available: true
    },
    {
      id: 'c23',
      fio: 'Шарипова Регина Флюровна',
      gender: 'ж',
      age: 27,
      city: 'Белорецк',
      specialty: 'Техносферная безопасность',
      industry: 'строительство',
      education: { level: 'ВО', university: 'МГТУ им. Г. И. Носова, г. Магнитогорск', degree: 'Бакалавриат', gpa: 4.4, diplomaVerified: true },
      ege: { math: 73, rus: 88, subject: 'Физика', subjectScore: 70 },
      olympiads: [],
      dpo: [{ name: 'Охрана труда: новые правила', year: 2024 }],
      experienceYears: 4,
      positions: [
        { role: 'Специалист по охране труда', org: 'ООО «БелорецкСтрой»', period: '2022 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 1, projects: 6 },
      competencies: [
        { name: 'Охрана труда', value: 88 },
        { name: 'Нормативная документация', value: 84 },
        { name: 'Аудит безопасности', value: 80 },
        { name: 'Коммуникации', value: 82 }
      ],
      available: true
    },
    {
      id: 'c24',
      fio: 'Тихонов Егор Александрович',
      gender: 'м',
      age: 25,
      city: 'Уфа',
      specialty: 'Технологические машины и оборудование',
      industry: 'машиностроение',
      education: { level: 'ВО', university: 'УУНиТ, г. Уфа', degree: 'Бакалавриат', gpa: 4.5, diplomaVerified: true },
      ege: { math: 83, rus: 80, subject: 'Физика', subjectScore: 86 },
      olympiads: [],
      dpo: [],
      experienceYears: 3,
      positions: [
        { role: 'Инженер-механик', org: 'АО «УфаАгрегат»', period: '2023 — н. в.' }
      ],
      northExperience: null,
      kpi: { rationalizations: 2, projects: 4 },
      competencies: [
        { name: 'Механическая обработка', value: 82 },
        { name: 'Инженерный анализ', value: 80 },
        { name: 'Проектная работа', value: 76 },
        { name: 'Цифровые инструменты', value: 78 }
      ],
      available: true
    }
  ],

  /* ---------- Вакансии-пресеты ---------- */
  vacancies: [
    {
      id: 'v1',
      title: 'Инженер-технолог нефтегазового оборудования',
      org: 'АО «ГеоТех»',
      required: { education: 'ВО', industries: ['нефтегаз', 'машиностроение'], minExperience: 3 },
      desired: { northMinYears: 2, dpo: true, minGpa: 4.0, minEgeProfile: 70, kpi: true }
    },
    {
      id: 'v2',
      title: 'Инженер-программист АСУ ТП',
      org: 'ООО «БашПромАвтоматика»',
      required: { education: 'ВО', industries: ['ИТ', 'энергетика'], minExperience: 2 },
      desired: { northMinYears: 0, dpo: true, minGpa: 4.2, minEgeProfile: 75, kpi: false }
    },
    {
      id: 'v3',
      title: 'Ведущий инженер-энергетик',
      org: 'ПАО «УралЭнергоСеть»',
      required: { education: 'ВО', industries: ['энергетика'], minExperience: 5 },
      desired: { northMinYears: 3, dpo: true, minGpa: 3.8, minEgeProfile: 60, kpi: true }
    }
  ],

  /* ---------- Региональная аналитика (Республика Башкортостан, демо) ---------- */
  regionStats: {
    totalProfiles: 12480,
    itDeficit: 3200,
    closedVacancies: 486,
    avgHiringDaysBefore: 42,
    avgHiringDaysNow: 9,
    industryDeficit: [
      { industry: 'ИТ', value: 3200 },
      { industry: 'Машиностроение', value: 2140 },
      { industry: 'Нефтегаз', value: 1830 },
      { industry: 'Энергетика', value: 1260 },
      { industry: 'Строительство', value: 980 }
    ],
    profileGrowth: [
      { month: 'янв', count: 2100 },
      { month: 'фев', count: 2680 },
      { month: 'мар', count: 3350 },
      { month: 'апр', count: 4120 },
      { month: 'май', count: 5010 },
      { month: 'июн', count: 5940 },
      { month: 'июл', count: 6900 },
      { month: 'авг', count: 7920 },
      { month: 'сен', count: 9050 },
      { month: 'окт', count: 10180 },
      { month: 'ноя', count: 11340 },
      { month: 'дек', count: 12480 }
    ],
    topUniversities: [
      { name: 'УУНиТ', employmentRate: 87 },
      { name: 'УГНТУ', employmentRate: 84 },
      { name: 'БГМУ', employmentRate: 91 },
      { name: 'БГПУ им. Акмуллы', employmentRate: 76 },
      { name: 'УГАТУ (филиал)', employmentRate: 81 }
    ],
    northShare: 14,
    dpoShare: 38
  },

  /* ---------- Стратегическое планирование 2030–2055 (демо) ----------
     Планирование контрольных цифр приёма (КЦП) в вузы Республики Башкортостан
     на основе прогноза дефицита кадров и демографии. Все значения — модельные. */
  strategic: {
    horizon: { from: 2030, to: 2055 },

    /* KPI-карточки раздела (7-летний директивный горизонт, до 2033) */
    kpis: [
      { value: 'до 2033', label: 'Директивный горизонт КЦП', trend: 'нацпроект «Кадры», Минтруд' },
      { value: '14 200', label: 'Прогнозный дефицит к 2033 без мер, чел.' },
      { value: '+1 240', label: 'Рекомендовано доп. бюджетных мест в год' },
      { value: '−58%', label: 'Сокращение дефицита к 2033 при плане', trend: 'с внедрением платформы' }
    ],

    /* Демографический прогноз и потребность экономики, тыс. чел./год.
       demand — потребность экономики в молодых специалистах;
       supplyBase — выпуск вузов при текущей инерции (демографическая волна);
       supplyPlan — выпуск при планировании КЦП через платформу. */
    forecast: [
      { year: 2030, demand: 13.2, supplyBase: 10.8, supplyPlan: 11.2 },
      { year: 2035, demand: 14.0, supplyBase: 10.4, supplyPlan: 12.5 },
      { year: 2040, demand: 14.6, supplyBase: 10.0, supplyPlan: 13.7 },
      { year: 2045, demand: 15.0, supplyBase: 9.7,  supplyPlan: 14.5 },
      { year: 2050, demand: 15.1, supplyBase: 9.9,  supplyPlan: 14.9 },
      { year: 2055, demand: 14.8, supplyBase: 10.4, supplyPlan: 14.7 }
    ],

    /* Рекомендуемые контрольные цифры приёма по вузам и направлениям.
       current — текущие бюджетные места, recommended — рекомендация модели на 2030. */
    universities: [
      { uni: 'УУНиТ', direction: 'ИТ, математика, инженерия', current: 520, recommended: 840, priority: 'высокий' },
      { uni: 'УГНТУ', direction: 'Нефтегаз, химическая технология', current: 610, recommended: 760, priority: 'высокий' },
      { uni: 'УГАТУ (в составе УУНиТ)', direction: 'Авиастроение, АСУ ТП', current: 430, recommended: 600, priority: 'высокий' },
      { uni: 'БГМУ', direction: 'Медицина, биотехнологии', current: 700, recommended: 820, priority: 'средний' },
      { uni: 'БГПУ им. Акмуллы', direction: 'Педагогика, психология', current: 540, recommended: 610, priority: 'средний' },
      { uni: 'БГАУ', direction: 'АПК, агроинженерия', current: 380, recommended: 300, priority: 'низкий' }
    ],

    /* Итоговые рекомендации системы */
    recommendations: [
      'Увеличить приём на ИТ- и инженерно-технические направления УУНиТ и УГАТУ на 45–60% к 2030 году — зоны критического дефицита (Уфа, Стерлитамак, Салават).',
      'Нарастить целевой приём УГНТУ по нефтегазовым и химическим специальностям под запросы предприятий юга и запада республики.',
      'Плавно перераспределить часть бюджетных мест аграрного профиля в пользу дефицитных отраслей с учётом демографического спада 2035–2045 годов.',
      'Закрепить выпускников в регионе через целевые договоры с индустриальными партнёрами на территориях с высоким дефицитом.'
    ]
  }
};
