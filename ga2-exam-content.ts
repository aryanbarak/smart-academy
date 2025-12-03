// ===== 10 GA2 EXAM LESSONS (FROM ALGORITHM MATERIALS) =====
// Auto-generated from: IHK Algorithmen Handbuch 2025, IHK Lernheft Algorithmen, Master PDFs
// Date: December 2, 2025

export const ga2ExamLessons = [
  {
    id: 'ga2-exam-01',
    type: 'GA2',
    title: 'BinarySearch Prüfungsfragen 1-3',
    subtitle: 'Echte IHK Prüfungsfragen - BinarySearch',
    level: 'Prüfung',
    order: 401,
    sections: [
      {
        headingDe: 'Frage 1: BinarySearch Trace Table',
        headingFa: 'سوال 1: جدول اثر BinarySearch',
        contentDe: 'Gegeben: Array A = [2, 5, 8, 12, 15, 20, 25], gesucht x = 15. Führen Sie BinarySearch durch und füllen Sie die Trace Table mit links, rechts, mitte und A[mitte].',
        contentFa: 'آرایهٔ [2, 5, 8, 12, 15, 20, 25] و جستجوی 15 داده شده است. BinarySearch را پیاده کنید و جدول اثر را با چپ، راست، وسط و A[وسط] پر کنید.',
        language: 'text'
      },
      {
        headingDe: 'Frage 2: BinarySearch – Fehleranalyse',
        headingFa: 'سوال 2: تحلیل خطا در BinarySearch',
        contentDe: 'Was passiert, wenn man „links = mitte" statt „links = mitte + 1" schreibt, wenn das Element größer ist? Antwort: Endlosschleife, da links und mitte sich nicht mehr ändern.',
        contentFa: 'اگر در زمانی که عنصر بزرگتر است، «چپ = وسط» به جای «چپ = وسط + 1» بنویسیم چه می‌شود؟ پاسخ: حلقه بی‌پایان، زیرا چپ و وسط تغییر نمی‌کنند.',
        language: 'text'
      },
      {
        headingDe: 'Frage 3: Bedingung für BinarySearch',
        headingFa: 'سوال 3: شرط استفاده از BinarySearch',
        contentDe: 'Was ist die wichtigste Bedingung für BinarySearch? Antwort: Das Array MUSS sortiert sein. Laufzeit: O(log n). Ungeeignet für unsortierten Daten.',
        contentFa: 'مهم‌ترین شرط برای BinarySearch چیست؟ پاسخ: آرایه باید مرتب باشد. پیچیدگی: O(log n). برای داده‌های نامرتب استفاده نمی‌شود.',
        language: 'text'
      }
    ]
  },

  {
    id: 'ga2-exam-02',
    type: 'GA2',
    title: 'BubbleSort Prüfungsfragen 4-6',
    subtitle: 'Echte IHK Prüfungsfragen - BubbleSort',
    level: 'Prüfung',
    order: 402,
    sections: [
      {
        headingDe: 'Frage 4: BubbleSort Durchlauf',
        headingFa: 'سوال 4: یک دور BubbleSort',
        contentDe: 'Array A = [5, 2, 8, 1, 9]. Führen Sie einen Durchlauf von BubbleSort durch (erste äußere Schleife). Zeigen Sie den Zwischenzustand nach jedem Vergleich.',
        contentFa: 'آرایهٔ [5, 2, 8, 1, 9] برای یک دور BubbleSort: حالت میانی را بعد از هر مقایسه نشان دهید.',
        language: 'text'
      },
      {
        headingDe: 'Frage 5: BubbleSort Optimierung',
        headingFa: 'سوال 5: بهینه‌سازی BubbleSort',
        contentDe: 'Was ist eine Optimierungsmöglichkeit für BubbleSort? Antwort: Early Stop / swapped-Flag. Wenn kein Tausch passiert, endet die Schleife früher. Reduziert Durchläufe bei fast sortierten Arrays.',
        contentFa: 'یک بهینه‌سازی برای BubbleSort چیست؟ پاسخ: Early Stop / پرچم جابجایی. اگر جابجایی نشود، حلقه زودتر تمام می‌شود. در آرایه‌های تقریباً مرتب کارآمد است.',
        language: 'text'
      },
      {
        headingDe: 'Frage 6: BubbleSort Laufzeitanalyse',
        headingFa: 'سوال 6: تحلیل پیچیدگی BubbleSort',
        contentDe: 'Was ist die Laufzeit von BubbleSort? Worst Case: O(n²). Best Case: O(n) wenn bereits sortiert. Average Case: O(n²). Nicht für große Datenmengen geeignet.',
        contentFa: 'پیچیدگی زمانی BubbleSort چیست؟ بدترین حالت: O(n²). بهترین حالت: O(n) اگر مرتب باشد. حالت میانگین: O(n²). برای داده‌های بزرگ مناسب نیست.',
        language: 'text'
      }
    ]
  },

  {
    id: 'ga2-exam-03',
    type: 'GA2',
    title: 'InsertionSort Prüfungsfragen 7-9',
    subtitle: 'Echte IHK Prüfungsfragen - InsertionSort',
    level: 'Prüfung',
    order: 403,
    sections: [
      {
        headingDe: 'Frage 7: InsertionSort Simulation',
        headingFa: 'سوال 7: شبیه‌سازی InsertionSort',
        contentDe: 'Array A = [3, 7, 2, 5]. Sortieren Sie mit InsertionSort Schritt für Schritt. Zeigen Sie die Array nach jedem Durchlauf.',
        contentFa: 'آرایهٔ [3, 7, 2, 5] را با InsertionSort مرتب کنید. حالت آرایه بعد از هر مرحله را نشان دهید.',
        language: 'text'
      },
      {
        headingDe: 'Frage 8: Vergleich BubbleSort vs InsertionSort',
        headingFa: 'سوال 8: مقایسه BubbleSort و InsertionSort',
        contentDe: 'Unterschiede: BubbleSort vergleicht benachbarte Elemente, InsertionSort setzt Element in richtige Position. InsertionSort ist schneller für teilweise sortierte Arrays. Laufzeit beide O(n²), aber InsertionSort praktisch besser.',
        contentFa: 'تفاوت‌ها: BubbleSort عناصر کنار‌هم را مقایسه می‌کند، InsertionSort عنصر را در جای درست قرار می‌دهد. InsertionSort برای آرایه‌های تقریباً مرتب سریع‌تر است. هر دو O(n²) ولی InsertionSort عملی‌تر است.',
        language: 'text'
      },
      {
        headingDe: 'Frage 9: Worst/Best Case InsertionSort',
        headingFa: 'سوال 9: بدترین و بهترین حالت InsertionSort',
        contentDe: 'Best Case: O(n) wenn bereits sortiert (innere Schleife läuft nicht). Worst Case: O(n²) wenn rückwärts sortiert. Average Case: O(n²).',
        contentFa: 'بهترین حالت: O(n) اگر مرتب باشد (حلقه درونی اجرا نشود). بدترین حالت: O(n²) اگر معکوس مرتب باشد. حالت میانگین: O(n²).',
        language: 'text'
      }
    ]
  },

  {
    id: 'ga2-exam-04',
    type: 'GA2',
    title: 'Rekursion & Laufzeit Prüfungsfragen 10-12',
    subtitle: 'Echte IHK Prüfungsfragen - Rekursion',
    level: 'Prüfung',
    order: 404,
    sections: [
      {
        headingDe: 'Frage 10: Rekursion – Basis- und Rekursionsfall',
        headingFa: 'سوال 10: بازگشت – حالت پایه و بازگشت',
        contentDe: 'Schreiben Sie eine rekursive Funktion für Fakultät (n!). Basis: n = 0 -> return 1. Rekursion: return n * factorial(n-1). Diese Struktur ist essentiell für alle rekursiven Aufgaben.',
        contentFa: 'یک تابع بازگشتی برای فاکتوریل (n!) بنویسید. پایه: n = 0 -> return 1. بازگشت: return n * factorial(n-1). این ساختار برای همه وظایف بازگشتی ضروری است.',
        language: 'text'
      },
      {
        headingDe: 'Frage 11: Stack-Trace für Rekursion',
        headingFa: 'سوال 11: جدول استک برای بازگشت',
        contentDe: 'Gegeben: factorial(3). Erstellen Sie einen Stack-Trace (Call Stack). Zeigen Sie die Aufrufe und Rückgabewerte: f(3) -> f(2) -> f(1) -> f(0) return 1 -> return 1 -> return 2 -> return 6.',
        contentFa: 'factorial(3) برای یک جدول استک ایجاد کنید. فراخوانی‌ها و مقادیر بازگشتی را نشان دهید: f(3) -> f(2) -> f(1) -> f(0) return 1 -> ... -> return 6.',
        language: 'text'
      },
      {
        headingDe: 'Frage 12: Probleme mit Rekursion',
        headingFa: 'سوال 12: مشکلات بازگشت',
        contentDe: 'Ohne korrekten Basisfall -> StackOverflowError. Zu viele Aufrufe -> Performance-Problem (O(2^n) bei fib). Lösungen: Tail Recursion, Memoization, Iteration.',
        contentFa: 'بدون حالت پایه صحیح -> StackOverflowError. فراخوانی‌های زیادی -> مشکل عملکرد (O(2^n) در fib). راه‌حل‌ها: Tail Recursion، Memoization، Iteration.',
        language: 'text'
      }
    ]
  },

  {
    id: 'ga2-exam-05',
    type: 'GA2',
    title: 'Array & Liste Operationen 13-15',
    subtitle: 'Echte IHK Prüfungsfragen - Datenstrukturen',
    level: 'Prüfung',
    order: 405,
    sections: [
      {
        headingDe: 'Frage 13: Element in Array einfügen',
        headingFa: 'سوال 13: درج عنصر در آرایه',
        contentDe: 'Array A = [10, 20, 30, 40], fügen Sie 25 an Position 2 ein. Ergebnis: [10, 20, 25, 30, 40]. Algorithmus: Alle Elemente ab Position 2 um eins nach rechts verschieben, dann 25 einfügen.',
        contentFa: 'آرایهٔ [10, 20, 30, 40]، عدد 25 را در موقعیت 2 درج کنید. نتیجه: [10, 20, 25, 30, 40]. الگوریتم: تمام عناصر از موقعیت 2 را یک جایی به راست جابه‌جا کنید، سپس 25 را درج کنید.',
        language: 'text'
      },
      {
        headingDe: 'Frage 14: Element aus Array löschen',
        headingFa: 'سوال 14: حذف عنصر از آرایه',
        contentDe: 'Array A = [10, 20, 30, 40, 50], löschen Sie Element an Position 2 (Wert 30). Ergebnis: [10, 20, 40, 50]. Algorithmus: Position 2 nach links überschreiben (alles ab Position 3 um eins nach links).',
        contentFa: 'آرایهٔ [10, 20, 30, 40, 50]، عنصر در موقعیت 2 (مقدار 30) را حذف کنید. نتیجه: [10, 20, 40, 50]. الگوریتم: موقعیت 2 را با بقیه‌ی عناصر پوشش دهید.',
        language: 'text'
      },
      {
        headingDe: 'Frage 15: Array-Größe ändern',
        headingFa: 'سوال 15: تغییر اندازهٔ آرایه',
        contentDe: 'Wenn ein Array voll ist und Sie wollen ein Element einfügen, müssen Sie ein größeres Array erstellen und die Elemente kopieren. Länge meist verdoppeln (Performance-Strategie).',
        contentFa: 'اگر آرایه پر شود و بخواهید عنصر اضافه کنید، باید آرایهٔ بزرگتری ایجاد کنید و عناصر را کپی کنید. معمولاً اندازه را دو برابر کنید (استراتژی عملکرد).',
        language: 'text'
      }
    ]
  },

  {
    id: 'ga2-exam-06',
    type: 'GA2',
    title: 'Komplexität & O-Notation Prüfungsfragen 16-18',
    subtitle: 'Echte IHK Prüfungsfragen - Laufzeitanalyse',
    level: 'Prüfung',
    order: 406,
    sections: [
      {
        headingDe: 'Frage 16: O-Notation erkennen',
        headingFa: 'سوال 16: تشخیص O-Notation',
        contentDe: 'Gegeben Code mit zwei verschachtelten for-Schleifen von 0 bis n. Welche O-Notation? Antwort: O(n²). Bei drei Schleifen: O(n³). Bei einer while bis n: O(n).',
        contentFa: 'کدی با دو حلقهٔ for تو‌در‌تو از 0 تا n. کدام O-Notation؟ پاسخ: O(n²). سه حلقه: O(n³). یک while تا n: O(n).',
        language: 'text'
      },
      {
        headingDe: 'Frage 17: BinarySearch Komplexität',
        headingFa: 'سوال 17: پیچیدگی BinarySearch',
        contentDe: 'BinarySearch: O(log n). Warum? Weil wir Array halbieren mit jedem Durchlauf. Nach k Durchläufen bleibt n/2^k Elemente. Wenn n/2^k = 1, dann k = log₂(n).',
        contentFa: 'BinarySearch: O(log n). چرا؟ زیرا در هر دور آرایه را نصف می‌کنیم. بعد از k دور، n/2^k عنصر باقی می‌ماند. اگر n/2^k = 1، پس k = log₂(n).',
        language: 'text'
      },
      {
        headingDe: 'Frage 18: Best/Worst/Average Case',
        headingFa: 'سوال 18: بهترین/بدترین/میانگین حالت',
        contentDe: 'Best Case: Beste Szenario (z.B. Element am Anfang bei LinearSearch = O(1)). Worst Case: Schlechteste Szenario (z.B. Element nicht da = O(n)). Average Case: Durchschnitt aller Möglichkeiten (meist O(n)).',
        contentFa: 'بهترین حالت: بهترین سناریو (مثل عنصر در ابتدا = O(1)). بدترین حالت: بدترین سناریو (مثل عنصر نبودن = O(n)). حالت میانگین: میانگین همهٔ احتمالات (معمولاً O(n)).',
        language: 'text'
      }
    ]
  },

  {
    id: 'ga2-exam-07',
    type: 'GA2',
    title: 'SelectionSort & Minimum Prüfungsfragen 19-21',
    subtitle: 'Echte IHK Prüfungsfragen - SelectionSort',
    level: 'Prüfung',
    order: 407,
    sections: [
      {
        headingDe: 'Frage 19: SelectionSort Durchlauf',
        headingFa: 'سوال 19: یک دور SelectionSort',
        contentDe: 'Array A = [64, 25, 12, 22, 11]. Führen Sie einen Durchlauf SelectionSort durch: Finden Sie das Minimum (11), tauschen Sie es mit Element an Position 0. Ergebnis nach 1. Durchlauf: [11, 25, 12, 22, 64].',
        contentFa: 'آرایهٔ [64, 25, 12, 22, 11]. یک دور SelectionSort: حداقل (11) را پیدا کنید، با عنصر در موقعیت 0 جابه‌جا کنید. بعد از دور 1: [11, 25, 12, 22, 64].',
        language: 'text'
      },
      {
        headingDe: 'Frage 20: Minimum-Suche im Array',
        headingFa: 'سوال 20: جستجوی حداقل در آرایه',
        contentDe: 'Schreiben Sie eine Funktion findMin(a, start), die das Minimum ab Position start findet. Rückgabewert: Index des Minimums. Dies ist zentral für SelectionSort.',
        contentFa: 'تابع findMin(a, start) بنویسید که حداقل را از موقعیت start پیدا کند. بازگشت: اندیس حداقل. این برای SelectionSort بنیادی است.',
        language: 'text'
      },
      {
        headingDe: 'Frage 21: SelectionSort Komplexität',
        headingFa: 'سوال 21: پیچیدگی SelectionSort',
        contentDe: 'SelectionSort: O(n²) immer. Nicht adaptiv (Best/Worst/Average = O(n²)). Vorteil: Wenige Tausche (max. n-1). Nachteil: Nicht stabil (Reihenfolge gleicher Elemente nicht bewahrt).',
        contentFa: 'SelectionSort: O(n²) همیشه. غیرسازگار (همهٔ حالات O(n²)). مزیت: جابجایی‌های کم (حداکثر n-1). نقطه ضعف: غیرمستقر (ترتیب عناصر مساوی حفظ نمی‌شود).',
        language: 'text'
      }
    ]
  },

  {
    id: 'ga2-exam-08',
    type: 'GA2',
    title: 'Fehleranalyse & Debugging 22-24',
    subtitle: 'Echte IHK Prüfungsfragen - Fehler',
    level: 'Prüfung',
    order: 408,
    sections: [
      {
        headingDe: 'Frage 22: Off-by-One Fehler',
        headingFa: 'سوال 22: خطای یکی کم/زیاد',
        contentDe: 'Häufigster Fehler: Schleife läuft bis n statt n-1 oder bis n-2. Beispiel: for i = 0 bis a.length (FALSCH, richtig: bis a.length - 1). Dies führt zu IndexOutOfBoundsException.',
        contentFa: 'رایج‌ترین خطا: حلقه تا n به جای n-1 یا n-2. مثال: for i = 0 تا a.length (غلط، درست: تا a.length - 1). این IndexOutOfBoundsException ایجاد می‌کند.',
        language: 'text'
      },
      {
        headingDe: 'Frage 23: Uninitialisierte Variablen',
        headingFa: 'سوال 23: متغیرهای بدون مقداردهی',
        contentDe: 'Fehler: Variablen ohne Initialisierung verwenden (z.B. int sum; ohne =0). Dann sum += a[i] -> Kompilerfehler. Immer initialisieren: int sum = 0.',
        contentFa: 'خطا: استفاده از متغیرهای بدون مقداردهی (مثل int sum؛ بدون =0). سپس sum += a[i] -> خطای کمپایل. همیشه مقداردهی کنید: int sum = 0.',
        language: 'text'
      },
      {
        headingDe: 'Frage 24: Logische Fehler in Bedingungen',
        headingFa: 'سوال 24: خطاهای منطقی در شرایط',
        contentDe: 'Fehler: if (a[i] > a[i+1]) Tausch, aber Bedingung falsch für Descending Sort. Für aufsteigend: richtig. Für absteigend: muss < sein. Debugging: Trace Table oder Print Statements.',
        contentFa: 'خطا: if (a[i] > a[i+1]) برای مرتب‌سازی نزولی اشتباه است. برای صعودی: درست. برای نزولی: باید < باشد. رفع‌یابی: جدول اثر یا Print Statements.',
        language: 'text'
      }
    ]
  },

  {
    id: 'ga2-exam-09',
    type: 'GA2',
    title: 'Array Manipulation & Statistik 25-27',
    subtitle: 'Echte IHK Prüfungsfragen - Statistik',
    level: 'Prüfung',
    order: 409,
    sections: [
      {
        headingDe: 'Frage 25: Summe und Durchschnitt berechnen',
        headingFa: 'سوال 25: محاسبهٔ جمع و میانگین',
        contentDe: 'Array A = [10, 20, 30, 40]. Summe: 100. Durchschnitt: 100/4 = 25. Code: sum=0; for i bis n: sum += a[i]; avg = sum / n. Achtung: Dividieren durch 0 wenn n=0!',
        contentFa: 'آرایهٔ [10, 20, 30, 40]. جمع: 100. میانگین: 100/4 = 25. کد: sum=0; for i: sum += a[i]; avg = sum / n. دقت: تقسیم بر 0 اگر n=0!',
        language: 'text'
      },
      {
        headingDe: 'Frage 26: Minimum und Maximum finden',
        headingFa: 'سوال 26: پیدا کردن حداقل و حداکثر',
        contentDe: 'Array A = [3, 7, 2, 9, 1]. Min = 1, Max = 9. Algorithmus: min = a[0]; max = a[0]; dann loop und vergleichen. Nicht: min = Integer.MIN_VALUE (schlechte Praxis).',
        contentFa: 'آرایهٔ [3, 7, 2, 9, 1]. حداقل = 1، حداکثر = 9. الگوریتم: min = a[0]؛ max = a[0]؛ سپس مقایسه. نه Integer.MIN_VALUE (بد است).',
        language: 'text'
      },
      {
        headingDe: 'Frage 27: Häufigkeit zählen (Statistik)',
        headingFa: 'سوال 27: شمارش فراوانی (آمار)',
        contentDe: 'Array A = [1, 2, 1, 3, 1, 2]. Häufigkeit: 1 erscheint 3x, 2 erscheint 2x, 3 erscheint 1x. Code: For-Schleife über Werte, Counter bei jedem Match erhöhen. Oder Array/Map für Häufigkeiten.',
        contentFa: 'آرایهٔ [1, 2, 1, 3, 1, 2]. فراوانی: 1 سه‌بار، 2 دو‌بار، 3 یک‌بار. کد: حلقه بر روی مقادیر، شمارنده را افزایش دهید. یا آرایه/Map برای فراوانی.',
        language: 'text'
      }
    ]
  },

  {
    id: 'ga2-exam-10',
    type: 'GA2',
    title: 'Objektsortiierung & Generics 28-30',
    subtitle: 'Echte IHK Prüfungsfragen - Objekte',
    level: 'Prüfung',
    order: 410,
    sections: [
      {
        headingDe: 'Frage 28: Objekte nach Attribut sortieren',
        headingFa: 'سوال 28: مرتب‌سازی اشیاء بر اساس ویژگی',
        contentDe: 'Klasse Schüler mit name, alter, note. Sortiere nach Alter. Code: if (s[i].getAlter() > s[i+1].getAlter()) dann Tausch. Mit Getter-Methoden arbeiten.',
        contentFa: 'کلاس Student با name، age، grade. مرتب کنید بر اساس سن. کد: if (s[i].getAge() > s[i+1].getAge()) سپس جابجایی. با Getter کار کنید.',
        language: 'text'
      },
      {
        headingDe: 'Frage 29: Generischer Sort mit Comparator',
        headingFa: 'سوال 29: مرتب‌سازی جنریک با Comparator',
        contentDe: 'Generische Funktion: sort(List<T>, Comparator<T>). Der Comparator bestimmt die Sortierreihenfolge. Beispiel: (a, b) -> a.getAlter() - b.getAlter() für aufsteigend.',
        contentFa: 'تابع جنریک: sort(List<T>, Comparator<T>). Comparator ترتیب مرتب‌سازی را تعیین می‌کند. مثال: (a, b) -> a.getAge() - b.getAge() برای صعودی.',
        language: 'text'
      },
      {
        headingDe: 'Frage 30: Collections.sort() vs Array.sort()',
        headingFa: 'سوال 30: Collections.sort() در برابر Array.sort()',
        contentDe: 'Collections.sort() für Listen. Array.sort() für Arrays. Beide verwenden TimSort (hybrid aus MergeSort und InsertionSort). Beide O(n log n) im Average Case.',
        contentFa: 'Collections.sort() برای لیست‌ها. Array.sort() برای آرایه‌ها. هر دو از TimSort (ترکیب MergeSort و InsertionSort) استفاده می‌کنند. هر دو O(n log n) در حالت میانگین.',
        language: 'text'
      }
    ]
  }
];
