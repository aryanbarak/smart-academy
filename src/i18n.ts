export type Lang = 'de' | 'fa';

export const ui = {
  de: {
    // ── Navigation ──
    home: 'Home',
    algorithms: 'Algorithmen',
    wiso: 'WISO',
    pruefung: 'Prüfung',
    aiAgent: 'AI Agent',
    javaPdf: 'Java PDF',
    features: 'Features',
    backToStart: 'Startseite',
    toPlatform: 'Zur Lernplattform →',
    menuOpen: 'Menü öffnen',

    // ── Landing hero ──
    heroTitle: 'Programmieren lernen auf Farsi und Deutsch',
    heroBtn1: 'Algorithmen (GA2) →',
    heroBtn2: 'WISO →',
    heroBtn3: 'Prüfung →',

    // ── Feature cards ──
    feat1Title: 'Basis-Algorithmen',
    feat1Text: 'BubbleSort, SelectionSort, Search, Pseudocode nach IHK-Standard.',
    feat2Title: 'WISO',
    feat2Text: 'Häufige Themen und Multiple-Choice-Fragen im IHK-Stil.',
    feat3Title: 'Prüfungsfragen',
    feat3Text: 'Übung mit echten Fragen und Farsi-Erklärungen für tieferes Verständnis.',
    feat4Title: 'Lernmaterialien',
    feat4Text: 'PDF für Algorithmen, Pseudocode und wichtige Prüfungshinweise.',
    clickHere: 'Klicken →',
    startLesson: 'Lektion starten →',
    whatYouLearn: 'Was du lernst',
    mobileHeroTitle: 'IHK-Prüfung auf Deutsch & Farsi',
    mobileHeroSub: 'Algorithmen, WISO & KI-Lernassistent',
    mobileHeroCta: 'Jetzt lernen',
    dueNone: 'Nichts fällig 🎉',
    streakStart: 'Starte heute!',

    // ── Learning paths ──
    pathsTitle: 'Lernpfade in dieser Plattform',
    pathsDesc: 'Alle Lernpfade sind im Dashboard mit Masterfiles, Quiz und PDF verfügbar.',
    path1Label: 'Lernpfad Algorithmen (GA2)',
    path1Sub: 'BubbleSort · SelectionSort · Search',
    path2Label: 'Lernpfad WISO (Recht & Wirtschaft)',
    path2Sub: 'Arbeitsrecht · DSGVO · Vertragsarten',
    path3Label: 'Übung mit alten Prüfungen',
    path3Sub: 'Quiz · Prüfungssimulation · Flashcards',
    path4Label: 'Tipps & häufige Fehler',
    path4Sub: 'Fehlerbank · KI-Analyse · Wiederholung',
    pathNum: 'Pfad',

    // ── Features page ──
    featPageTitle: 'Hauptfunktionen der Smart Academy',
    featPageDesc: 'Diese Web-App ist für die Vorbereitung auf die FIAE-Prüfung konzipiert. Fokus auf GA2 (Algorithmen) und WISO — mit deutschen Texten für die Prüfung und Farsi-Erklärungen zum besseren Verständnis.',
    featCard1Title: '1. Masterfiles nach IHK-Standard',
    featCard1Body: 'Für BubbleSort, SelectionSort, Suche, Komprimierung — mit deutschem Text, IHK-Pseudocode und Farsi-Erklärungen.',
    featCard2Title: '2. WISO kompakt und zielgerichtet',
    featCard2Body: 'Nur Themen, die wirklich in der Prüfung kommen: Arbeitsrecht, Versicherungen, Verträge. Deutsch + Farsi + Prüfungsbeispiel.',
    featCard3Title: '3. Fokus auf IHK-Fragetypen',
    featCard3Body: 'Kein Uni-Stoff — nur was in der Prüfung vorkommt. Beispiele aus echten Prüfungen der letzten Jahre.',
    featCard4Title: '4. Zweisprachig: Deutsch für die Prüfung, Farsi zum Verstehen',
    featCard4Body: 'Haupttext auf Deutsch — Farsi-Hinweise helfen, Konzepte schneller zu erfassen und Stress zu reduzieren.',
    featExtra1Title: 'Schritt-für-Schritt-Übung',
    featExtra1Body: 'Jeder Algorithmus beginnt einfach und steigert sich bis zu echten Prüfungsbeispielen.',
    featExtra2Title: 'Häufige Fehler analysieren',
    featExtra2Body: 'Der Bereich "häufige Fehler" zeigt, wo Prüflinge meist scheitern — damit du sie vermeidest.',
    featExtra3Title: 'PDF und Druck',
    featExtra3Body: 'Inhalte sind druckfertig als PDF gestaltet — mit geeigneter Schrift und ohne horizontales Scrollen.',

    // ── Java PDF page ──
    javaPdfTitle: 'Java-Programmierung lernen (PDF)',
    javaPdfDesc: 'Das vollständige Java-Lernheft als PDF — zoomen, blättern oder herunterladen.',
    javaPdfDownload: 'Java-Lernheft herunterladen',

    // ── App header ──
    platformName: 'Smart Academy',
    platformSub: 'Algorithmen · WISO · Prüfung',
    toHome: 'Zurück zur Startseite',
    tabGA2: 'Algorithmen',
    tabWISO: 'WISO',
    tabPRUEF: 'Prüfung',
    search: 'Suchen',
    stats: 'Statistik',
    quiz: 'Quiz',
    flashcards: 'Karteikarten',
    examSim: 'Prüfungssimulation',
    errorBank: 'Fehlerbank',
    pdf: 'PDF',

    // ── Dashboard widgets ──
    continueLearning: 'Weitermachen',
    noLastLesson: 'Lektion starten',
    dueToday: 'fällig heute',
    cardsToday: 'Karten heute',
    streak: 'Streak',
    streakDays: 'Tage in Folge',
    examDateTitle: 'Prüfungsdatum festlegen',
    examDateSub: 'Nach Eingabe wird ein Tagesplan erstellt',
    save: 'Speichern',

    // ── Lesson list ──
    lessonsCount: (n: number) => `Lektionen (${n})`,
    progressBar: (done: number, total: number) => `Fortschritt: ${done} von ${total}`,

    // ── Footer ──
    footer: '© 2024–2025 Smart Academy (Algorithmen & WISO) — Fachinformatiker Anwendungsentwicklung',

    // ── AgentPage ──
    agentBack: 'Startseite',
    agentOffline: 'Der KI-Assistent benötigt eine Internetverbindung.',
    agentNetworkError: 'Netzwerkfehler. Bitte überprüfe deine Verbindung und versuche es erneut.',
    pressBackAgain: 'Nochmal drücken zum Beenden',
  },
  fa: {
    // ── Navigation ──
    home: 'خانه',
    algorithms: 'الگوریتم‌ها',
    wiso: 'WISO',
    pruefung: 'آزمون',
    aiAgent: 'هوش مصنوعی',
    javaPdf: 'جاوا PDF',
    features: 'ویژگی‌ها',
    backToStart: 'صفحه اصلی',
    toPlatform: 'ورود به پلتفرم ←',
    menuOpen: 'باز کردن منو',

    // ── Landing hero ──
    heroTitle: 'آموزش برنامه‌نویسی به زبان فارسی و المانی',
    heroBtn1: '← الگوریتم‌ها (GA2)',
    heroBtn2: '← WISO',
    heroBtn3: '← آزمون',

    // ── Feature cards ──
    feat1Title: 'الگوریتم‌های پایه',
    feat1Text: 'BubbleSort، SelectionSort، Search، Pseudocode به سبک IHK.',
    feat2Title: 'WISO',
    feat2Text: 'موضوعات پرتکرار و سوالات چهارگزینه‌ای به سبک IHK.',
    feat3Title: 'سوال‌های امتحانی',
    feat3Text: 'تمرین با سوالات اصلی و تحلیل فارسی برای فهم عمیق‌تر.',
    feat4Title: 'فایل‌های آموزشی',
    feat4Text: 'PDF برای الگوریتم، شبه‌کد و نکات مهم امتحانی.',
    clickHere: 'کلیک کن ←',
    startLesson: '← شروع درس',
    whatYouLearn: 'چی یاد می‌گیری',
    mobileHeroTitle: 'امتحان IHK به آلمانی و فارسی',
    mobileHeroSub: 'الگوریتم‌ها، WISO و دستیار هوش مصنوعی',
    mobileHeroCta: 'همین الان شروع کن',
    dueNone: 'هیچی نیست 🎉',
    streakStart: 'امروز شروع کن!',

    // ── Learning paths ──
    pathsTitle: 'مسیرهای اصلی یادگیری در این پلتفرم',
    pathsDesc: 'همه مسیرها در Dashboard داخلی با Masterfileها، Quiz و PDF قابل استفاده است.',
    path1Label: 'مسیر Algorithmen (GA2)',
    path1Sub: 'BubbleSort · SelectionSort · Search',
    path2Label: 'مسیر WISO (قانون و اقتصاد)',
    path2Sub: 'Arbeitsrecht · DSGVO · Vertragsarten',
    path3Label: 'تمرین امتحان‌های قدیمی',
    path3Sub: 'Quiz · Prüfungssimulation · Flashcards',
    path4Label: 'ترفندها و اشتباهات رایج',
    path4Sub: 'Fehlerbank · KI-Analyse · Wiederholung',
    pathNum: 'مسیر',

    // ── Features page ──
    featPageTitle: 'ویژگی‌های اصلی Smart Academy',
    featPageDesc: 'این وب‌اپ برای آماده‌سازی آزمون Fachinformatiker Anwendungsentwicklung طراحی شده. تمرکز روی GA2 (Algorithmen) و WISO — با متن آلمانی برای امتحان و توضیحات فارسی.',
    featCard1Title: '۱. Masterfileهای الگوریتم به سبک IHK',
    featCard1Body: 'برای BubbleSort، SelectionSort، Suche، Komprimierung — شامل توضیح آلمانی، شبه‌کد IHK و توضیحات فارسی.',
    featCard2Title: '۲. WISO فشرده و هدف‌دار',
    featCard2Body: 'فقط موضوعاتی که واقعاً در امتحان می‌آیند: حقوق کار، بیمه، قراردادها. خلاصه آلمانی + توضیح فارسی.',
    featCard3Title: '۳. تمرکز روی سبک سوالات IHK',
    featCard3Body: 'به‌جای تئوری دانشگاهی، روی چیزهایی که در امتحان می‌آید. مثال‌ها از امتحان‌های واقعی.',
    featCard4Title: '۴. دو زبانه: آلمانی برای امتحان، فارسی برای فهم',
    featCard4Body: 'متن اصلی آلمانی است تا به زبان امتحان عادت کنی. نکته‌های فارسی کمک می‌کند مفهوم را راحت‌تر بگیری.',
    featExtra1Title: 'تمرین گام‌به‌گام',
    featExtra1Body: 'هر الگوریتم با مثال ساده شروع می‌شود و کم‌کم به مثال‌های واقعی امتحان می‌رسد.',
    featExtra2Title: 'تحلیل اشتباهات رایج',
    featExtra2Body: 'در Masterfileها بخش اشتباهات رایج وجود دارد تا اشتباهات متداول را تکرار نکنی.',
    featExtra3Title: 'PDF و چاپ',
    featExtra3Body: 'محتوا به‌صورت PDF قابل چاپ طراحی شده — فونت مناسب، بدون اسکرول افقی.',

    // ── Java PDF page ──
    javaPdfTitle: 'آموزش زبان برنامه‌نویسی جاوا (PDF)',
    javaPdfDesc: 'جزوه کامل آموزش جاوا به صورت PDF — می‌توانی زوم کنی، ورق بزنی یا دانلود کنی.',
    javaPdfDownload: 'دانلود فایل آموزش جاوا',

    // ── App header ──
    platformName: 'پلتفرم یادگیری FIAE',
    platformSub: 'الگوریتم‌ها · WISO · آزمون',
    toHome: 'بازگشت به صفحه اصلی',
    tabGA2: 'الگوریتم‌ها',
    tabWISO: 'WISO',
    tabPRUEF: 'آزمون',
    search: 'جستجو',
    stats: 'آمار',
    quiz: 'آزمون',
    flashcards: 'فلش‌کارت',
    examSim: 'شبیه‌سازی آزمون',
    errorBank: 'بانک خطا',
    pdf: 'PDF',

    // ── Dashboard widgets ──
    continueLearning: 'ادامه بده',
    noLastLesson: 'شروع یادگیری',
    dueToday: 'امروز',
    cardsToday: 'کارت‌های امروز',
    streak: 'روزهای متوالی',
    streakDays: 'روز متوالی',
    examDateTitle: 'تاریخ امتحان را وارد کن',
    examDateSub: 'بعد از ثبت، یک برنامه روزانه ساخته می‌شود',
    save: 'ذخیره',

    // ── Lesson list ──
    lessonsCount: (n: number) => `درس‌ها (${n})`,
    progressBar: (done: number, total: number) => `پیشرفت: ${done} از ${total}`,

    // ── Footer ──
    footer: '© ۲۰۲۴–۲۰۲۵ پلتفرم یادگیری FIAE — Fachinformatiker Anwendungsentwicklung',

    // ── AgentPage ──
    agentBack: 'صفحه اصلی',
    agentOffline: 'دستیار هوش مصنوعی به اتصال به اینترنت نیاز دارد.',
    agentNetworkError: 'خطای شبکه. لطفاً اتصال خود را بررسی کن و دوباره امتحان کن.',
    pressBackAgain: 'دوباره فشار دهید برای خروج',
  },
} as const;

export type UI = typeof ui.de;
