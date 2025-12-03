import { Lesson } from './types';

export const LESSONS: Lesson[] = [
  // --- GA2 SECTION ---
  {
    id: 'ga2-001',
    type: 'GA2',
    title: 'Bubble Sort Master',
    subtitle: 'Algorithmus & Optimierungen',
    level: 'Masterfile',
    order: 1,
    sections: [
      {
        headingDe: '1. Standard BubbleSort (Integer)',
        headingFa: '۱. بابل‌سورت استاندارد (عدد صحیح)',
        contentDe: 'BubbleSort ist ein einfacher Vergleichs- und Vertauschsortieralgorithmus. Er läuft mit zwei Schleifen: Die äußere (i) bestimmt den Durchlauf, die innere (j) vergleicht benachbarte Elemente und vertauscht sie.\n\nDie häufigste IHK-Form ist: j bis n - i - 2, weil jedes Mal das größte Element ans Ende „hochgebubbelt“ wird.',
        contentFa: 'بابل‌سورت یک الگوریتم سادهٔ مرتب‌سازی است که همیشه دو حلقه دارد. در هر دور، عناصر کنار هم را مقایسه می‌کند و اگر ترتیب‌شان غلط باشد، آن‌ها را جابه‌جا می‌کند.\nنکتهٔ مهم IHK: حلقهٔ j باید تا n - i - 2 برود، چون عناصر بزرگ در هر دور به آخر آرایه منتقل می‌شوند.',
        codeSnippet: `funktion bubbleSort(a: Array von Integer)
    n = a.length

    für i = 0 bis n - 2
        für j = 0 bis n - i - 2
            wenn a[j] > a[j+1] dann
                temp = a[j]
                a[j] = a[j+1]
                a[j+1] = temp
            ende wenn
        ende für
    ende für
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '2. BubbleSort für Objekte (z. B. Räume)',
        headingFa: '۲. بابل‌سورت برای اشیاء (مانند اتاق‌ها)',
        contentDe: 'Hier wird nicht nach Zahlen sortiert, sondern nach einer Eigenschaft eines Objekts (z. B. Fläche eines Raums). Der Zugriff erfolgt meist über Getter-Methoden.',
        contentFa: 'در اینجا مرتب‌سازی بر اساس اعداد نیست، بلکه بر اساس ویژگی یک شیء (مانند مساحت اتاق) انجام می‌شود. دسترسی معمولاً از طریق متدهای Getter صورت می‌گیرد.',
        codeSnippet: `funktion sortiereRaeume(raeume: Array von Raum)
    n = raeume.length

    für i = 0 bis n - 2
        für j = 0 bis n - i - 2
            wenn raeume[j].getFlaeche() > raeume[j+1].getFlaeche() dann
                temp = raeume[j]
                raeume[j] = raeume[j+1]
                raeume[j+1] = temp
            ende wenn
        ende für
    ende für
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Generischer BubbleSort mit Function<T>',
        headingFa: '۳. بابل‌سورت جنریک با Function<T>',
        contentDe: 'In der generischen Version bestimmt die Funktion f, ob zwei Elemente getauscht werden müssen. Wenn f > 0 zurückgibt, ist das erste Element größer. Das entspricht der IHK-Logik für Objekte und Attribute.',
        contentFa: 'در نسخهٔ جنریک، تابع f تعیین می‌کند که آیا دو عنصر باید جابه‌جا شوند یا نه. اگر f مقدار مثبت برگرداند یعنی عنصر اول بزرگ‌تر است و باید جابه‌جا شود.\nاین دقیقاً همان نسخهٔ IHK برای کار با آبجکت‌ها و Attributeهای مختلف است.',
        codeSnippet: `funktion sort(liste: List<T>, f: Function<T>)
    n = liste.size()

    für i = 0 bis n - 2
        für j = 0 bis n - i - 2
            wenn f(liste.get(j), liste.get(j+1)) > 0 dann
                temp = liste.get(j)
                liste.set(j, liste.get(j+1))
                liste.set(j+1, temp)
            ende wenn
        ende für
    ende für
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '4. BubbleSort – Early Stop (IHK-Version)',
        headingFa: '۴. توقف زود هنگام (نسخه IHK)',
        contentDe: 'Diese optimierte Variante beendet die äußere Schleife, wenn kein Tausch mehr passiert ist. Das reduziert die Laufzeit in fast sortierten Arrays.',
        contentFa: 'این نسخه بهینه، حلقه بیرونی را زمانی که دیگر جابجایی رخ ندهد، متوقف می‌کند. این کار زمان اجرا را در آرایه‌های تقریباً مرتب کاهش می‌دهد.',
        codeSnippet: `funktion bubbleSortOptimiert(a: Array von Integer)
    n = a.length

    für i = 0 bis n - 2
        swapped = false

        für j = 0 bis n - i - 2
            wenn a[j] > a[j+1] dann
                temp = a[j]
                a[j] = a[j+1]
                a[j+1] = temp
                swapped = true
            ende wenn
        ende für

        wenn swapped = false dann
            abbrechen   // keine Änderungen mehr
        ende wenn
    ende für
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '5. Fehleranalyse',
        headingFa: '۵. تحلیل خطا',
        contentDe: 'Häufige Fehlerquellen:\n- Schleife i bis n-1 (falsch, muss n-2)\n- Schleife j statisch (ineffizient)\n- Vergessen des Tauschvorgangs',
        contentFa: 'خطاهای رایج:\n- حلقه i تا n-1 (غلط، باید n-2 باشد)\n- حلقه j ثابت (ناکارآمد)\n- فراموش کردن عملیات جابجایی',
        codeSnippet: `// FEHLERHAFTE VERSION
für i = 0 bis a.length
    für j = 0 bis a.length - 1
        // ... Fehler ...`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-004',
    type: 'GA2',
    title: 'Selection Sort Master',
    subtitle: 'Minimum-Suche & Austausch',
    level: 'Masterfile',
    order: 2,
    sections: [
      {
        headingDe: '1. Standard SelectionSort (Integer)',
        headingFa: '۱. سلکشن سورت استاندارد (عدد صحیح)',
        contentDe: 'SelectionSort sucht in jedem Durchlauf das kleinste Element im Restarray und tauscht es mit dem aktuellen Index i.',
        contentFa: 'در SelectionSort ما در هر دور، «کوچک‌ترین مقدار باقی‌مانده» را پیدا می‌کنیم و آن را در جای درستش قرار می‌دهیم.',
        codeSnippet: `funktion selectionSort(a: Array von Integer)
    n = a.length
    für i = 0 bis n - 2
        minIndex = i
        für j = i + 1 bis n - 1
            wenn a[j] < a[minIndex] dann
                minIndex = j
            ende wenn
        ende für
        wenn minIndex != i dann
            temp = a[i]
            a[i] = a[minIndex]
            a[minIndex] = temp
        ende wenn
    ende für
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '2. SelectionSort für Objekte (z. B. Räume)',
        headingFa: '۲. سلکشن سورت برای اشیاء (مانند اتاق‌ها)',
        contentDe: 'In der Objekt-Version vergleichen wir Eigenschaften (z. B. getBelegung()). Der Algorithmus-Kern bleibt identisch, nur der Vergleich in der if-Bedingung ändert sich.',
        contentFa: 'در نسخهٔ آبجکت، به‌جای خود مقدار، بر اساس یک ویژگی (مثلاً getBelegung یا getPreis) مقایسه می‌کنیم.\nساختار الگوریتم تغییر نمی‌کند؛ فقط در شرط مقایسه از raeume[...].getBelegung() استفاده می‌کنیم.',
        codeSnippet: `funktion sortiereRaeumeNachBelegung(raeume: Array von Raum)
    n = raeume.length

    für i = 0 bis n - 2
        minIndex = i

        für j = i + 1 bis n - 1
            wenn raeume[j].getBelegung() < raeume[minIndex].getBelegung() dann
                minIndex = j
            ende wenn
        ende für

        wenn minIndex != i dann
            temp = raeume[i]
            raeume[i] = raeume[minIndex]
            raeume[minIndex] = temp
        ende wenn
    ende für
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Generischer SelectionSort mit Function<T>',
        headingFa: '۳. سلکشن سورت جنریک با Function<T>',
        contentDe: 'Hier entscheidet die Funktion f, welches Element kleiner ist.\nSie gibt:\n• < 0 zurück, wenn erstes < zweites\n• > 0 zurück, wenn erstes > zweites\n• 0, wenn gleich\nDamit kann derselbe Algorithmus für verschiedene Typen verwendet werden.',
        contentFa: 'در نسخهٔ جنریک، تابع f نقش مقایسه‌کننده را دارد.\nاگر f(a,b) < 0 باشد یعنی a کوچکتر از b است. در SelectionSort برای پیدا کردن کوچک‌ترین عنصر، هر بار اگر f نتیجهٔ منفی داد، minIndex را به آن عنصر جدید تغییر می‌دهیم. این دقیقاً همان الگویی است که در سوال‌های IHK برای List<T> و Function<T> استفاده می‌شود.',
        codeSnippet: `funktion sort(liste: List<T>, f: Function<T>)
    n = liste.size()

    für i = 0 bis n - 2
        minIndex = i

        für j = i + 1 bis n - 1
            wenn f(liste.get(j), liste.get(minIndex)) < 0 dann
                minIndex = j
            ende wenn
        ende für

        wenn minIndex != i dann
            temp = liste.get(i)
            liste.set(i, liste.get(minIndex))
            liste.set(minIndex, temp)
        ende wenn
    ende für
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Minimum + Aktion – Rabatt auf billigsten Artikel',
        headingFa: '۴. کمینه + عمل – تخفیف روی ارزان‌ترین کالا',
        contentDe: 'Dieser Algorithmus ist im Prinzip die „erste Hälfte“ von SelectionSort:\n• Einmal Minimum suchen (minIndex)\n• Danach eine Aktion auf dieses Minimum ausführen (Rabatt setzen)\nIn GA2-Prüfungen taucht dieses Muster sehr häufig auf.',
        contentFa: 'این نمونه در اصل همان SelectionSort بدون حلقهٔ بیرونی است:\nفقط یک‌بار کم‌ترین عنصر را پیدا می‌کنیم (minIndex) و بعد روی آن یک عمل انجام می‌دهیم (کم کردن قیمت، علامت‌گذاری، حذف و …).\nاین الگو در امتحان GA2 بسیار تکراری است و باید آن را کاملاً حفظ باشی.',
        codeSnippet: `prozedur rabattAufBilligsten(artikel: Array von Artikel,
                             rabattProzent: Integer)
    minIndex = 0

    für i = 1 bis artikel.length - 1
        wenn artikel[i].getPreis() < artikel[minIndex].getPreis() dann
            minIndex = i
        ende wenn
    ende für

    alterPreis = artikel[minIndex].getPreis()
    neuerPreis = alterPreis - (alterPreis * rabattProzent / 100)
    artikel[minIndex].setPreis(neuerPreis)
endprozedur`,
        language: 'pseudo'
      },
      {
        headingDe: '5.1 Fehleranalyse – Fehlerhafte Version',
        headingFa: '۵.۱ تحلیل خطا – نسخه اشتباه',
        contentDe: 'Typische Fehlerquellen bei der Implementierung von SelectionSort.',
        contentFa: 'خطاهای رایج در پیاده‌سازی SelectionSort.',
        codeSnippet: `funktion selectionSortFehler(a: Array von Integer)
    n = a.length

    für i = 0 bis n - 1          // FEHLER 1: bis n - 1
        minIndex = 0             // FEHLER 2: sollte i sein

        für j = 0 bis n - 1      // FEHLER 3: falscher Start und Bereich
            wenn a[j] < a[minIndex] dann
                minIndex = j
            ende wenn
        ende für

        temp = a[i]
        a[i] = a[minIndex]
        a[minIndex] = temp
    ende für
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '5.2 Fehleranalyse – Korrekte Version & Fallen',
        headingFa: '۵.۲ تحلیل خطا – نسخه صحیح و نکات',
        contentDe: 'Korrekturen:\n1. i bis n-2 (nicht n-1)\n2. minIndex = i (nicht 0)\n3. j ab i+1 (nicht 0)',
        contentFa: 'خطاهای رایج در سوال‌های IHK:\n• قرار دادن minIndex = 0 به‌جای minIndex = i؛ در این صورت همیشه از اول آرایه جست‌وجو می‌شود.\n• شروع حلقهٔ j از 0 به‌جای i+1 → دوباره عناصر قبلی هم بررسی می‌شوند.\n• حلقهٔ i تا n-1 به‌جای n-2 → در آخرین خانه دیگر عنصری برای مقایسه وجود ندارد.',
        codeSnippet: `funktion selectionSortKorrekt(a: Array von Integer)
    n = a.length

    für i = 0 bis n - 2
        minIndex = i

        für j = i + 1 bis n - 1
            wenn a[j] < a[minIndex] dann
                minIndex = j
            ende wenn
        ende für

        wenn minIndex != i dann
            temp = a[i]
            a[i] = a[minIndex]
            a[minIndex] = temp
        ende wenn
    ende für
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '6. GA2 Übungsaufgaben (SelectionSort)',
        headingFa: '۶. تمرین‌های GA2 (SelectionSort)',
        contentDe: 'Typische Prüfungsaufgaben.',
        contentFa: 'تمرین‌های نمونه امتحان.',
        codeSnippet: `Übung 1 – Standard (Integer)
gegeben: A = [7, 3, 5, 2]
Führen Sie SelectionSort aus und geben Sie das Array
nach jedem äußeren Schleifendurchlauf an.

Übung 2 – Objekte (Räume)
Sie haben ein Array von Raum-Objekten mit der Methode getBelegung().
Sortieren Sie die Räume aufsteigend nach Belegung mit SelectionSort.
Geben Sie den Pseudocode im IHK-Stil an.

Übung 3 – Generisch mit Function<T>
Gegeben ist List<Mitarbeiter> und Function<Mitarbeiter> f,
die nach Gehalt vergleicht.
Implementieren Sie eine sort(liste, f), die die Liste mit SelectionSort
nach Gehalt aufsteigend sortiert.

Übung 4 – Minimum + Aktion
In einem Array von Artikel-Objekten soll der billigste Artikel
ermittelt und sein Preis um 15% gesenkt werden.
Schreiben Sie eine Prozedur im Pseudocode.`,
        language: 'text'
      }
    ]
  },
  {
    id: 'ga2-005',
    type: 'GA2',
    title: 'Insertion Sort Master',
    subtitle: 'Einsortieren & Verschieben',
    level: 'Masterfile',
    order: 3,
    sections: [
      {
        headingDe: '1. Standard InsertionSort',
        headingFa: '۱. اینسرشن سورت استاندارد',
        contentDe: 'Wir nehmen das erste Element des unsortierten Bereichs und schieben es im sortierten Bereich nach links.',
        contentFa: 'ما اولین عنصر بخش نامرتب را برمی‌داریم و در بخش مرتب به عقب می‌بریم تا جای درستش پیدا شود.',
        codeSnippet: `funktion insertionSort(a: Array von Integer)
    n = a.length
    für i = 1 bis n - 1
        wert = a[i]
        j = i
        solange j > 0 und a[j-1] > wert
            a[j] = a[j-1]
            j = j - 1
        ende solange
        a[j] = wert
    ende für
end funktion`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-006',
    type: 'GA2',
    title: 'Sorting mit Function<T>',
    subtitle: 'Generische Sortieralgorithmen',
    level: 'Masterfile',
    order: 4,
    sections: [
      {
        headingDe: '1. Generischer BubbleSort',
        headingFa: '۱. بابل‌سورت جنریک',
        contentDe: 'Vergleich mit f(a, b) > 0 für aufsteigende Sortierung.',
        contentFa: 'مقایسه با f(a, b) > 0 برای مرتب‌سازی صعودی.',
        codeSnippet: `funktion sort(liste: List<T>, f: Function<T>)
    // ... siehe BubbleSort Master ...
    wenn f(liste.get(j), liste.get(j+1)) > 0 dann
        // swap
    ende wenn
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '2. Generischer SelectionSort mit Function<T>',
        headingFa: '۲. Generischer SelectionSort با Function<T>',
        contentDe: 'Hier wird das Minimum über die Funktion f bestimmt.',
        contentFa: 'در اینجا کمینه با استفاده از تابع f تعیین می‌شود.',
        codeSnippet: `funktion sortSelection(liste: List<T>, f: Function<T>)
    n = liste.size()

    für i = 0 bis n - 2
        minIndex = i

        für j = i + 1 bis n - 1
            wenn f(liste.get(j), liste.get(minIndex)) < 0 dann
                minIndex = j
            ende wenn
        ende für

        wenn minIndex != i dann
            temp = liste.get(i)
            liste.set(i, liste.get(minIndex))
            liste.set(minIndex, temp)
        ende wenn
    ende für
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Absteigend sortieren',
        headingFa: '۳. مرتب‌سازی نزولی',
        contentDe: 'Für absteigend wird die Vergleichsbedingung einfach umgedreht.',
        contentFa: 'برای نزولی، کافی است شرط مقایسه را برعکس کنیم.',
        codeSnippet: `funktion sortBubbleAbsteigend(liste: List<T>, f: Function<T>)
    // ...
            wenn f(liste.get(j), liste.get(j+1)) < 0 dann // < statt >
    // ...
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Fehleranalyse mit Function<T>',
        headingFa: '۴. تحلیل خطا با Function<T>',
        contentDe: 'Typische Fehler: Falsche Parameter-Reihenfolge in f(), falsche Richtung (> statt <).',
        contentFa: 'خطاهای رایج: ترتیب پارامترهای اشتباه در f()، جهت اشتباه (> به جای <).',
        codeSnippet: `// FEHLER: vertauschte Parameter
wenn f(liste.get(j+1), liste.get(j)) > 0 dann ...`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-002',
    type: 'GA2',
    title: 'Searching Master',
    subtitle: 'LinearSearch & BinarySearch Komplett',
    level: 'Masterfile',
    order: 5,
    sections: [
      {
        headingDe: '1. LinearSearch – Grundbasis',
        headingFa: '۱. جستجوی خطی – پایه',
        contentDe: 'Sucht von Anfang bis Ende nach einem genauen Wert. Gibt die Position oder -1 zurück, wenn nicht gefunden.\nLaufzeit: O(n).',
        contentFa: 'از ابتدا تا انتها به دنبال یک مقدار دقیق می‌گردد. اگر پیدا شد اندیس را برمی‌گرداند، در غیر این صورت -۱.\nپیچیدگی زمانی: O(n).',
        codeSnippet: `function linearSearch(a: Array von Integer, wert: Integer): Integer
    für i von 0 bis länge(a) - 1
        if a[i] = wert then
            return i
        end if
    ende für
    return -1
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '1.2 LinearSearch Varianten',
        headingFa: '۱.۲ انواع جستجوی خطی',
        contentDe: 'Variante 1: Suche nach erstem Zeichen im String.\nVariante 2: Nur prüfen, ob Wert vorhanden ist (True/False).',
        contentFa: 'نسخه ۱: جستجوی اولین کاراکتر در رشته.\nنسخه ۲: فقط بررسی اینکه آیا مقدار وجود دارد یا نه (True/False).',
        codeSnippet: `// Boolean Variante
function kommtVor(a: Array, wert: Integer): Boolean
    für i von 0 bis länge(a) - 1
        if a[i] = wert return true
    ende für
    return false
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '2. LinearSearch bei Objekten',
        headingFa: '۲. جستجوی خطی در اشیاء',
        contentDe: 'Vergleich erfolgt auf einer Eigenschaft (z. B. artikel.nummer oder raum.belegung).',
        contentFa: 'مقایسه روی یک ویژگی انجام می‌شود (مثلاً شماره مقاله یا ظرفیت اتاق).',
        codeSnippet: `function findeArtikel(artikel: Array von Artikel, nr: Integer): Integer
    für i von 0 bis länge(artikel) - 1
        if artikel[i].nummer = nr then
            return i
        end if
    ende für
    return -1
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '3. LinearSearch mit Function<T> (Generisch)',
        headingFa: '۳. جستجوی خطی جنریک',
        contentDe: 'Eine Funktion f(element) prüft die Bedingung. Wenn f(e) == true, wurde das Element gefunden.',
        contentFa: 'یک تابع f(element) شرط را بررسی می‌کند. اگر f(e) برابر true باشد، عنصر پیدا شده است.',
        codeSnippet: `function findeIndex(liste: Array von T, f: Function<T>): Integer
    für i von 0 bis länge(liste) - 1
        if f(liste[i]) = true then
            return i
        end if
    ende für
    return -1
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '4. BinarySearch (Klassisch)',
        headingFa: '۴. جستجوی دودویی (کلاسیک)',
        contentDe: 'Benötigt sortiertes Array! Halbiert den Suchraum in jedem Schritt (Mitte vergleichen, dann links oder rechts weiter).\nLaufzeit: O(log n).',
        contentFa: 'نیاز به آرایه مرتب دارد! در هر مرحله فضای جستجو را نصف می‌کند (وسط را مقایسه کن، سپس در چپ یا راست ادامه بده).\nپیچیدگی زمانی: O(log n).',
        codeSnippet: `function binarySearch(a: Array von Integer, wert: Integer): Integer
    links = 0
    rechts = länge(a) - 1
    while links <= rechts
        mitte = (links + rechts) div 2
        if a[mitte] = wert then
            return mitte
        end if
        if a[mitte] < wert then
            links = mitte + 1
        else
            rechts = mitte - 1
        end if
    end while
    return -1
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '5. BinarySearch Varianten (Boolean & Objekte)',
        headingFa: '۵. انواع جستجوی دودویی (بولین و اشیاء)',
        contentDe: 'Boolean: Gibt true zurück, sobald gefunden.\nObjekte: Vergleicht a[mitte].eigenschaft (z.B. nummer).',
        contentFa: 'بولین: به محض پیدا شدن true برمی‌گرداند.\nاشیاء: ویژگی شیء وسط را مقایسه می‌کند (مثلاً شماره).',
        codeSnippet: `// Objekte
if artikel[mitte].nummer = gesuchteNummer then ...
// Boolean
if a[mitte] = wert return true`,
        language: 'pseudo'
      },
      {
        headingDe: '6. Fehleranalyse Searching',
        headingFa: '۶. تحلیل خطا در جستجو',
        contentDe: 'Typische Fehler:\n1. Mitte falsch berechnet (Klammern fehlen).\n2. while links < rechts (statt <=).\n3. return -1 fehlt am Ende.\n4. LinearSearch: Laufvariable i wird manipuliert.',
        contentFa: 'خطاهای رایج:\n۱. محاسبه غلط وسط (پرانتز جا افتاده).\n۲. شرط while < به جای <=.\n۳. عدم بازگشت -۱ در انتها.\n۴. تغییر متغیر i داخل حلقه در جستجوی خطی.',
        codeSnippet: `// FEHLER 1
mitte = links + rechts / 2  // Falsch! Punkt vor Strich
// Richtig: (links + rechts) div 2

// FEHLER 2
while links < rechts  // Falsch! Letztes Element fehlt
// Richtig: links <= rechts`,
        language: 'pseudo'
      },
      {
        headingDe: '7. Übungsaufgaben',
        headingFa: '۷. تمرین‌های نمونه',
        contentDe: '1. LinearSearch für Objekte (Schüler ID).\n2. BinarySearch implementieren.\n3. Existenztest (Boolean).\n4. Fehler im Code finden.',
        contentFa: '۱. جستجوی خطی برای اشیاء (آی‌دی دانش‌آموز).\n۲. پیاده‌سازی جستجوی دودویی.\n۳. تست وجود (بولین).\n۴. پیدا کردن خطا در کد.',
        codeSnippet: `// Übung 1: function sucheSchueler(s: Array, id: Int): Int
// Übung 4: Finde 3 Fehler in der gegebenen BinarySearch Funktion.`,
        language: 'text'
      }
    ]
  },
  {
    id: 'ga2-009',
    type: 'GA2',
    title: 'BinarySearch Praxis',
    subtitle: 'Training: Trace Table & Fehler',
    level: 'Prüfungstraining',
    order: 6,
    sections: [
      {
        headingDe: '1. Trace Table Übung (Schrittfolge)',
        headingFa: '۱. تمرین جدول اثر (Trace Table)',
        contentDe: 'Gegeben: A = [10, 20, 30, 40, 50, 60, 70], Gesucht: 25. Füllen Sie die Tabelle.',
        contentFa: 'آرایه و عدد ۲۵ داده شده است. جدول زیر را پر کنید.',
        codeSnippet: `l | r | m | A[m] | Aktion
0 | 6 | 3 | 40   | 25 < 40 -> rechts = m - 1
0 | 2 | 1 | 20   | 25 > 20 -> links = m + 1
2 | 2 | 2 | 30   | 25 < 30 -> rechts = m - 1
2 | 1 | - | -    | Abbruch (l > r) -> return -1`,
        language: 'text'
      },
      {
        headingDe: '2. Fehleranalyse: Endlosschleife',
        headingFa: '۲. تحلیل خطا: حلقه بی‌پایان',
        contentDe: 'Was passiert, wenn man `links = mitte` statt `links = mitte + 1` schreibt? Wenn das gesuchte Element größer ist, bleibt `links` und `mitte` gleich -> Endlosschleife.',
        contentFa: 'اگر `links = mitte` بنویسیم چه می‌شود؟ اگر عنصر مورد نظر بزرگتر باشد، چپ و وسط تغییر نمی‌کنند و برنامه در حلقه گیر می‌کند.',
        codeSnippet: `// FEHLER
sonst wenn a[mitte] < x dann
    links = mitte   // FALSCH! Muss mitte + 1 sein
sonst ...`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-007',
    type: 'GA2',
    title: 'Komprimierung (RLE)',
    subtitle: 'Run-Length Encoding Masterfile',
    level: 'Masterfile',
    order: 7,
    sections: [
      {
        headingDe: '1. Prinzip der Lauflängenkodierung (RLE)',
        headingFa: '۱. اصل کدگذاری طول اجرا (RLE)',
        contentDe: 'Wiederholte Zeichen werden als Anzahl + Zeichen gespeichert. Beispiel: "AAABBBCC" -> "3A3B2C".',
        contentFa: 'کاراکترهای تکراری به صورت تعداد + کاراکتر ذخیره می‌شوند. مثال: "AAABBBCC" به "3A3B2C" تبدیل می‌شود.',
        codeSnippet: `Original:  A A A A B B C
Kodiert:   4 A 2 B 1 C`,
        language: 'text'
      },
      {
        headingDe: '2. Algorithmus (Komprimieren)',
        headingFa: '۲. الگوریتم فشرده‌سازی',
        contentDe: 'Man durchläuft den String und zählt, wie oft das aktuelle Zeichen mit dem nächsten übereinstimmt.',
        contentFa: 'رشته را طی می‌کنیم و می‌شماریم چند بار کاراکتر فعلی با بعدی یکی است.',
        codeSnippet: `funktion komprimiere(text: String): String
    n = länge(text)
    ergebnis = ""
    i = 0
    solange i < n
        count = 1
        solange (i + 1 < n) und (text[i] == text[i+1])
            count = count + 1
            i = i + 1
        ende solange
        ergebnis = ergebnis + count + text[i]
        i = i + 1
    ende solange
    return ergebnis
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Algorithmus (Dekomprimieren)',
        headingFa: '۳. الگوریتم باز کردن (Decompress)',
        contentDe: 'Man liest die Zahl (Anzahl) und das darauf folgende Zeichen und gibt das Zeichen so oft aus.',
        contentFa: 'عدد (تعداد) و کاراکتر بعد از آن را می‌خوانیم و کاراکتر را به همان تعداد چاپ می‌کنیم.',
        codeSnippet: `funktion dekomprimiere(text: String): String
    i = 0
    ergebnis = ""
    solange i < länge(text)
        anzahl = text[i].toInt()
        zeichen = text[i+1]
        für k = 1 bis anzahl
            ergebnis = ergebnis + zeichen
        ende für
        i = i + 2
    ende solange
    return ergebnis
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Fehleranalyse (RLE)',
        headingFa: '۴. تحلیل خطا (RLE)',
        contentDe: 'Typischer Fehler: Der letzte Block wird vergessen, weil die Schleife zu früh endet, oder "Index Out of Bounds" beim Zugriff auf i+1.',
        contentFa: 'خطای رایج: بلوک آخر فراموش می‌شود چون حلقه زود تمام می‌شود، یا خطای "Index Out of Bounds" هنگام دسترسی به i+1.',
        codeSnippet: `// FEHLER: Zugriff auf i+1 ohne Prüfung
solange text[i] == text[i+1]  // Crash am Ende!
   ...`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-008',
    type: 'GA2',
    title: 'GA2 Theorie Kompakt',
    subtitle: 'Laufzeiten, Stack/Heap, Datentypen',
    level: 'Theorie',
    order: 8,
    sections: [
      {
        headingDe: '1. O-Notation (Laufzeitkomplexität)',
        headingFa: '۱. پیچیدگی زمانی (O-Notation)',
        contentDe: 'Beschreibt, wie die Laufzeit wächst, wenn die Eingabemenge n wächst.',
        contentFa: 'توصیف می‌کند که با افزایش ورودی n، زمان اجرا چگونه رشد می‌کند.',
        codeSnippet: `O(1)      - Zugriff Array-Index (Konstant)
O(log n)  - BinarySearch (Logarithmisch)
O(n)      - LinearSearch (Linear)
O(n log n)- MergeSort, QuickSort (Linear-Logarithmisch)
O(n²)     - BubbleSort, InsertionSort (Quadratisch)`,
        language: 'text'
      },
      {
        headingDe: '2. Stack vs Heap',
        headingFa: '۲. پشته (Stack) در برابر هیپ (Heap)',
        contentDe: 'Stack: Lokale Variablen, Methodenaufrufe (LIFO), schnell, feste Größe.\nHeap: Objekte (new ...), dynamisch, langsamer Zugriff.',
        contentFa: 'استک: متغیرهای محلی، فراخوانی متدها (LIFO)، سریع، اندازه ثابت.\nهیپ: اشیاء (new)، پویا، دسترسی کندتر.',
        codeSnippet: `int x = 5;        // Landet im Stack
Kunde k = new Kunde(); // Referenz 'k' im Stack, Objekt im Heap`,
        language: 'java'
      },
      {
        headingDe: '3. Werttyp vs Referenztyp',
        headingFa: '۳. نوع مقدار (Value) vs ارجاع (Reference)',
        contentDe: 'Werttyp (int, boolean): Speichert den Wert direkt. Kopieren erstellt echten Zwilling.\nReferenztyp (Objekte, Arrays): Speichert Adresse. Kopieren kopiert nur den Zeiger (beide zeigen auf dasselbe Objekt).',
        contentFa: 'نوع مقدار: مقدار را مستقیم ذخیره می‌کند. کپی کردن یک دوقلوی واقعی می‌سازد.\nنوع ارجاع: آدرس را ذخیره می‌کند. کپی کردن فقط اشاره‌گر را کپی می‌کند (هر دو به یک شیء اشاره می‌کنند).',
        codeSnippet: `int a = 5; int b = a; b = 10; // a bleibt 5
Kunde k1 = new Kunde("Ali");
Kunde k2 = k1;
k2.setName("Reza"); // k1 heißt jetzt auch Reza!`,
        language: 'java'
      }
    ]
  },
  {
    id: 'ga2-003',
    type: 'GA2',
    title: 'Struktogramme',
    subtitle: 'Nassi-Shneiderman-Diagramme',
    level: 'Level 1',
    order: 9,
    sections: [
      {
        headingDe: 'Darstellung von Logik',
        headingFa: 'نمودارهای Nassi-Shneiderman',
        contentDe: 'Ein Nassi-Shneiderman-Diagramm ist eine grafische Darstellung für den Entwurf der strukturierten Programmierung.',
        contentFa: 'یک نمودار Nassi-Shneiderman نمایشی گرافیکی برای طراحی برنامه‌نویسی ساخت‌یافته است.'
      }
    ]
  },
  {
    id: 'ga2-010',
    type: 'GA2',
    title: 'Fehleranalyse Master',
    subtitle: 'Typische IHK-Fehlerquellen',
    level: 'Masterfile',
    order: 10,
    sections: [
      {
        headingDe: '1. Schleifen- & Indexfehler',
        headingFa: '۱. خطاهای حلقه و اندیس',
        contentDe: 'Off-by-One Fehler: Schleife läuft zu weit oder nicht weit genug (z.B. bis n-2 statt n-1). Falscher Startindex.',
        contentFa: 'خطای یکی کم/زیاد: حلقه خیلی جلو می‌رود یا به آخر نمی‌رسد (مثلاً تا n-2 به جای n-1). اندیس شروع غلط.',
        codeSnippet: `// FEHLER: letzte Position wird nicht geprüft
für i von 0 bis länge(a) - 2
   if a[i] = wert return i
// KORREKT: bis länge(a) - 1`,
        language: 'pseudo'
      },
      {
        headingDe: '2. Initialisierungsfehler (Min/Max)',
        headingFa: '۲. خطای مقداردهی اولیه (کمینه/بیشینه)',
        contentDe: 'Minimum mit 0 initialisieren ist falsch (wenn alle Werte > 0 sind). Korrekt: Erstes Element nehmen. Auch: minIndex falsch gesetzt.',
        contentFa: 'مقداردهی اولیه مینیمم با ۰ غلط است (اگر همه اعداد مثبت باشند). درست: اولین عنصر آرایه را بردارید.',
        codeSnippet: `// FEHLER
min = 0  
// KORREKT
min = a[0]`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Swap-Fehler (Tausch)',
        headingFa: '۳. خطای جابجایی (Swap)',
        contentDe: 'Ohne temporäre Variable wird der erste Wert überschrieben und geht verloren. Oder falsche Indizes beim Tausch.',
        contentFa: 'بدون متغیر موقت، مقدار اول بازنویسی شده و از دست می‌رود. یا استفاده از اندیس‌های غلط هنگام جابجایی.',
        codeSnippet: `// FEHLER (Datenverlust)
a[i] = a[j]
a[j] = a[i]

// KORREKT
temp = a[i]
a[i] = a[j]
a[j] = temp`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Fehler bei Summe & Durchschnitt',
        headingFa: '۴. خطا در جمع و میانگین',
        contentDe: 'Division durch (n-1) statt n. Startindex falsch (Elemente übersprungen).',
        contentFa: 'تقسیم بر (n-1) به جای n. اندیس شروع غلط (پرش از روی عناصر).',
        codeSnippet: `// FEHLER
return summe / (n - 1)
// KORREKT
return summe / n`,
        language: 'pseudo'
      },
      {
        headingDe: '5. Fehler bei Searching (Suche)',
        headingFa: '۵. خطا در جستجو',
        contentDe: 'LinearSearch: Kein return im Erfolgsfall. BinarySearch: while links < rechts (statt <=) oder Grenzen falsch gesetzt.',
        contentFa: 'جستجوی خطی: عدم بازگشت مقدار در صورت یافتن. دودویی: شرط while < به جای <= یا تنظیم غلط مرزها.',
        codeSnippet: `// BINARY SEARCH FEHLER
while links < rechts  // Muss <= sein
   links = mitte // Muss mitte + 1 sein`,
        language: 'pseudo'
      },
      {
        headingDe: '6. Fehler bei Sorting',
        headingFa: '۶. خطا در مرتب‌سازی',
        contentDe: 'Schleifengrenzen falsch (SelectionSort muss bis n-2 laufen). Innere Schleife startet falsch.',
        contentFa: 'مرزهای حلقه غلط (SelectionSort باید تا n-2 برود). شروع غلط حلقه داخلی.',
        codeSnippet: `// SelectionSort FEHLER
für i von 0 bis n - 1  // Muss n - 2 sein
   minIndex = 0        // Muss i sein`,
        language: 'pseudo'
      },
      {
        headingDe: '7. Fehler bei Array Shift (Insert/Delete)',
        headingFa: '۷. خطا در شیفت آرایه (درج/حذف)',
        contentDe: 'Beim Einfügen muss von HINTEN nach vorne geschoben werden (sonst Überschreiben). Beim Löschen von vorne nach hinten.',
        contentFa: 'هنگام درج باید از آخر به اول شیفت داد (وگرنه داده‌ها پاک می‌شوند). هنگام حذف از اول به آخر.',
        codeSnippet: `// INSERT FEHLER (Überschreibt Werte)
für i von pos bis n-1
   a[i+1] = a[i]

// KORREKT (Rückwärts laufen)
für i von n-1 bis pos schritt -1`,
        language: 'pseudo'
      },
      {
        headingDe: '8. Fehler bei Strings & RLE',
        headingFa: '۸. خطا در رشته‌ها و فشرده‌سازی',
        contentDe: 'RLE: Letzte Gruppe wird oft vergessen (nach der Schleife). Palindrom: Rechte Grenze muss length-1 sein.',
        contentFa: 'فشرده‌سازی: گروه آخر معمولاً فراموش می‌شود. پالیندروم: مرز راست باید length-1 باشد.',
        codeSnippet: `// RLE FEHLER
...schleife ende
return ergebnis // Letzter Buchstabe fehlt!`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-011',
    type: 'GA2',
    title: 'IHK Funktionssammlung',
    subtitle: 'Standard-Algorithmen Cheat Sheet',
    level: 'Cheat Sheet',
    order: 11,
    sections: [
      {
        headingDe: '1. Summe & Durchschnitt',
        headingFa: '۱. جمع و میانگین',
        contentDe: 'Standardmuster für Aggregationen.',
        contentFa: 'الگوی استاندارد برای محاسبات تجمعی.',
        codeSnippet: `function berechneSumme(a: Array): Integer
   summe = 0
   für i von 0 bis a.length - 1
      summe = summe + a[i]
   ende für
   return summe`,
        language: 'pseudo'
      },
      {
        headingDe: '2. Minimum / Maximum',
        headingFa: '۲. کمینه / بیشینه',
        contentDe: 'Immer mit dem ersten Element initialisieren.',
        contentFa: 'همیشه با اولین عنصر مقداردهی اولیه کنید.',
        codeSnippet: `function findeMax(a: Array): Integer
   max = a[0]
   für i von 1 bis a.length - 1
      if a[i] > max then max = a[i]
   ende für
   return max`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Zählen & Filtern',
        headingFa: '۳. شمارش و فیلتر کردن',
        contentDe: 'Beispiel: Alle Werte > 50 zählen oder filtern.',
        contentFa: 'مثال: شمارش یا فیلتر کردن تمام مقادیر بزرگتر از ۵۰.',
        codeSnippet: `function filtere(a: Array): Array
   erg = []
   k = 0
   für i von 0 bis a.length - 1
      if a[i] > 50 then
         erg[k] = a[i]
         k = k + 1
      end if
   ende für
   return erg`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Einfügen (Insert)',
        headingFa: '۴. درج کردن (Insert)',
        contentDe: 'Verschieben von hinten nach vorne, um Platz zu schaffen.',
        contentFa: 'جابجایی از عقب به جلو برای باز کردن جا.',
        codeSnippet: `prozedur einfuegen(a, wert, pos)
   für i von n-1 bis pos schritt -1
      a[i+1] = a[i]
   a[pos] = wert`,
        language: 'pseudo'
      },
      {
        headingDe: '5. Strings (Vokale & Palindrom)',
        headingFa: '۵. رشته‌ها (مصوت‌ها و پالیندروم)',
        contentDe: 'Typische String-Operationen.',
        contentFa: 'عملیات‌های رایج رشته‌ای.',
        codeSnippet: `function istPalindrom(text): Boolean
   links = 0
   rechts = text.length - 1
   while links < rechts
      if text[links] != text[rechts] return false
      links++, rechts--
   return true`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-012',
    type: 'GA2',
    title: 'Master – Summe & Durchschnitt',
    subtitle: 'Summe, Durchschnitt, Generisch, Fehleranalyse',
    level: 'Masterfile',
    order: 12,
    sections: [
      {
        headingDe: '1. Summe eines Integer-Arrays',
        headingFa: '۱. مجموع آرایه اعداد صحیح',
        contentDe: 'Einfaches Aufsummieren aller Elemente in einer Schleife.',
        contentFa: 'جمع کردن ساده تمام عناصر در یک حلقه.',
        codeSnippet: `function berechneSumme(a: Array von Integer): Integer
    summe = 0
    für i von 0 bis länge(a) - 1
        summe = summe + a[i]
    ende für
    return summe
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '2. Durchschnitt (Integer & Real)',
        headingFa: '۲. میانگین (عدد صحیح و اعشاری)',
        contentDe: 'Summe berechnen und durch n teilen. Achtung: Prüfung auf n=0 nicht vergessen!',
        contentFa: 'مجموع را حساب کرده و بر n تقسیم کنید. توجه: بررسی n=0 فراموش نشود!',
        codeSnippet: `function berechneDurchschnitt(a: Array von Integer): Real
    summe = 0
    n = länge(a)
    if n = 0 then return 0.0 end if
    für i von 0 bis n - 1
        summe = summe + a[i]
    ende für
    return summe / n
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Summe/Durchschnitt bei Objekten',
        headingFa: '۳. جمع و میانگین در اشیاء',
        contentDe: 'Zugriff auf Eigenschaften wie `artikel[i].preis` oder `schueler[i].punkte`.',
        contentFa: 'دسترسی به ویژگی‌هایی مانند `artikel[i].preis` یا `schueler[i].punkte`.',
        codeSnippet: `function berechneGesamtpreis(artikel: Array von Artikel): Integer
    summe = 0
    für i von 0 bis länge(artikel) - 1
        summe = summe + artikel[i].preis
    ende für
    return summe
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Generische Summe (Function<T>)',
        headingFa: '۴. جمع جنریک (Function<T>)',
        contentDe: 'Die `wertFunktion` extrahiert den Zahlenwert aus dem Objekt T.',
        contentFa: 'تابع `wertFunktion` مقدار عددی را از شیء T استخراج می‌کند.',
        codeSnippet: `function summeGenerisch(liste: Array von T, wertFunktion: Function<T>): Integer
    summe = 0
    für i von 0 bis länge(liste) - 1
        summe = summe + wertFunktion(liste[i])
    ende für
    return summe
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '5. Fehleranalyse: Summe & Durchschnitt',
        headingFa: '۵. تحلیل خطا: جمع و میانگین',
        contentDe: 'Typische Fehler: Division durch (n-1), Startindex falsch, Anzahl falsch initialisiert.',
        contentFa: 'خطاهای رایج: تقسیم بر (n-1)، اندیس شروع غلط، مقداردهی اولیه غلط برای تعداد.',
        codeSnippet: `// FEHLER 1: Division durch n-1
return summe / (n - 1) 

// FEHLER 2: Startindex ignoriert
function summeAb(start)
   für i von 0 bis n-1 // Falsch, muss 'von start' sein`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-013',
    type: 'GA2',
    title: 'Master – Array: Kopieren, Filtern, Zählen',
    subtitle: 'Kopieren, Zählen, Filtern, Generisch',
    level: 'Masterfile',
    order: 13,
    sections: [
      {
        headingDe: '1. Array Kopieren',
        headingFa: '۱. کپی کردن آرایه',
        contentDe: 'Erstellt ein neues Array gleicher Länge und kopiert alle Werte.',
        contentFa: 'یک آرایه جدید با همان طول می‌سازد و تمام مقادیر را کپی می‌کند.',
        codeSnippet: `function kopiereArray(a: Array von Integer): Array
    n = länge(a)
    b = neues Array(n)
    für i von 0 bis n - 1
        b[i] = a[i]
    ende für
    return b
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '2. Elemente Zählen (Count)',
        headingFa: '۲. شمارش عناصر',
        contentDe: 'Zählt Elemente, die eine Bedingung erfüllen (z.B. Note > 10).',
        contentFa: 'عناصری که شرط خاصی دارند را می‌شمارد (مثلاً نمره > ۱۰).',
        codeSnippet: `function zaehleNoteGroesser10(noten: Array): Integer
    anzahl = 0
    für i von 0 bis länge(noten) - 1
        if noten[i] > 10 then
            anzahl = anzahl + 1
        end if
    ende für
    return anzahl
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Array Filtern (Neues Array erstellen)',
        headingFa: '۳. فیلتر کردن آرایه (ساخت آرایه جدید)',
        contentDe: 'Erstellt ein neues Array nur mit Elementen, die die Bedingung erfüllen. Wichtig: Eigener Index für das Ziel-Array!',
        contentFa: 'آرایه جدیدی می‌سازد که فقط شامل عناصر واجد شرایط است. مهم: اندیس جداگانه برای آرایه مقصد!',
        codeSnippet: `function filtereBillige(artikel: Array): Array
    erg = []
    index = 0
    für i von 0 bis länge(artikel) - 1
        if artikel[i].preis < 10 then
            erg[index] = artikel[i]
            index = index + 1
        end if
    ende für
    return erg
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Generisch Filtern (Function<T>)',
        headingFa: '۴. فیلتر جنریک',
        contentDe: 'Die `bedingung` Funktion entscheidet, ob ein Element übernommen wird.',
        contentFa: 'تابع `bedingung` تصمیم می‌گیرد که آیا عنصر پذیرفته شود یا خیر.',
        codeSnippet: `function filtereWenn(liste: Array von T, bedingung: Function<T>): Array
    erg = []
    k = 0
    für i von 0 bis länge(liste) - 1
        if bedingung(liste[i]) then
            erg[k] = liste[i]
            k = k + 1
        end if
    ende für
    return erg
end function`,
        language: 'pseudo'
      },
      {
        headingDe: '5. Fehleranalyse: Array Operationen',
        headingFa: '۵. تحلیل خطا: عملیات آرایه',
        contentDe: 'Fehler: Index im Ziel-Array nicht erhöht, falsche Variable inkrementiert (i statt k), Startindex falsch.',
        contentFa: 'خطا: عدم افزایش اندیس آرایه مقصد، افزایش متغیر اشتباه (i به جای k)، اندیس شروع غلط.',
        codeSnippet: `// FEHLER: Index nicht erhöht
if bedingung(a[i]) then
    erg[k] = a[i]
    // k = k + 1 FEHLT!
end if`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-014',
    type: 'GA2',
    title: 'IHK Pseudocode – Grundregeln',
    subtitle: 'Syntax, Schleifen & Fallen',
    level: 'Grundlagen',
    order: 14,
    sections: [
      {
        headingDe: '1. Länge von Array/Liste',
        headingFa: '۱. طول آرایه/لیست',
        contentDe: 'Standard im IHK-Pseudocode ist `länge(liste)`. Java-Syntax wie `.length` oder `.size()` wird oft als falsch gewertet.',
        contentFa: 'استاندارد IHK استفاده از `länge(liste)` است. استفاده از `.length` یا `.size()` (سبک جاوا) معمولاً غلط محسوب می‌شود.',
        codeSnippet: `// RICHTIG (IHK)
n = länge(liste)

// FALSCH (Java/JS)
n = liste.size()
n = liste.length`,
        language: 'pseudo'
      },
      {
        headingDe: '2. Zugriff auf Elemente',
        headingFa: '۲. دسترسی به عناصر',
        contentDe: 'Immer eckige Klammern `[]` verwenden. `get(i)` ist Java-Stil und unerwünscht.',
        contentFa: 'همیشه از براکت `[]` استفاده کنید. `get(i)` سبک جاوا است و نباید استفاده شود.',
        codeSnippet: `// RICHTIG
wert = liste[i]

// FALSCH
wert = liste.get(i)`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Schleifen (for/while)',
        headingFa: '۳. حلقه‌ها',
        contentDe: 'Nutze `für ... von ... bis` und `solange`. Vermeide C-Style `for(i=0; i<n; i++)`.',
        contentFa: 'از `für ... von ... bis` و `solange` استفاده کنید. از فرمت C-Style مثل `for(i=0; i<n; i++)` بپرهیزید.',
        codeSnippet: `// RICHTIG (for)
für i von 0 bis länge(liste) - 1
   // ...
ende für

// RICHTIG (while)
solange i < länge(liste)
   // ...
ende solange`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Bedingungen (if/else)',
        headingFa: '۴. شرط‌ها',
        contentDe: 'Deutsche Schlüsselwörter: `wenn ... dann ... sonst ... ende wenn`.',
        contentFa: 'کلیدواژه‌های آلمانی: `wenn ... dann ... sonst ... ende wenn`.',
        codeSnippet: `wenn a < b dann
   // Anweisungen
sonst
   // Andere Anweisungen
ende wenn`,
        language: 'pseudo'
      },
      {
        headingDe: '5. Prozeduren und Funktionen',
        headingFa: '۵. رویه‌ها و توابع',
        contentDe: 'Prozedur: Kein Rückgabewert (`prozedur ... endprozedur`). Funktion: Mit Rückgabewert (`funktion ... -> Typ ... zurückgeben ... endfunktion`).',
        contentFa: 'رویه (Prozedur): بدون مقدار برگشتی. تابع (Funktion): با مقدار برگشتی (استفاده از `zurückgeben` یا فلش `->`).',
        codeSnippet: `prozedur sortiere(a)
   // ...
endprozedur

funktion summe(a) -> Integer
   // ...
   zurückgeben s
endfunktion`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-015',
    type: 'GA2',
    title: 'Master – LinearSearch Deep Dive',
    subtitle: 'Boolean, Index, Objekte, First Match',
    level: 'Vertiefung',
    order: 15,
    sections: [
      {
        headingDe: '1. Standard vs Boolean Version',
        headingFa: '۱. نسخه استاندارد در برابر بولین',
        contentDe: 'Standard: Gibt Index zurück (-1 wenn nicht gefunden). Boolean: Gibt `true` zurück, sobald gefunden.',
        contentFa: 'استاندارد: اندیس را برمی‌گرداند (-۱ اگر پیدا نشد). بولین: به محض پیدا شدن `true` برمی‌گرداند.',
        codeSnippet: `// Boolean Version
funktion enthaelt(a, x): Boolean
   für i = 0 bis a.length - 1
      wenn a[i] == x dann return true
   ende für
   return false
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '2. Erstes vs Letztes Vorkommen',
        headingFa: '۲. اولین در برابر آخرین رخداد',
        contentDe: 'Erstes Vorkommen: Sofort `return i`. Letztes Vorkommen: `index = i` speichern und Schleife weiterlaufen lassen.',
        contentFa: 'اولین رخداد: فوراً `return i`. آخرین رخداد: ذخیره در `index = i` و ادامه دادن حلقه تا پایان.',
        codeSnippet: `// Letztes Vorkommen
index = -1
für i = 0 bis n - 1
   wenn a[i] == x dann
      index = i // Nicht abbrechen!
   ende wenn
ende für
return index`,
        language: 'pseudo'
      },
      {
        headingDe: '3. LinearSearch für Objekte',
        headingFa: '۳. جستجوی خطی برای اشیاء',
        contentDe: 'Vergleich auf Attributen (z.B. `kunden[i].getNummer() == gesucht`).',
        contentFa: 'مقایسه روی ویژگی‌ها (مثلاً `kunden[i].getNummer() == gesucht`).',
        codeSnippet: `funktion sucheKunde(kunden, nummer)
   für i = 0 bis kunden.length - 1
      wenn kunden[i].getNummer() == nummer dann
         return i
      ende wenn
   ende für
   return -1
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Fehleranalyse LinearSearch',
        headingFa: '۴. تحلیل خطا در جستجوی خطی',
        contentDe: 'Häufiger Fehler: `return -1` innerhalb der Schleife (beendet zu früh) oder Startindex 1 statt 0.',
        contentFa: 'خطای رایج: نوشتن `return -1` داخل حلقه (خیلی زود قطع می‌شود) یا شروع از اندیس ۱ به جای ۰.',
        codeSnippet: `// FEHLER
für i = 0 bis n-1
   wenn a[i] == x dann return i
   sonst return -1 // FALSCH! Beendet sofort beim ersten Element
ende für`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-016',
    type: 'GA2',
    title: 'Master – IHK Prüfungsmuster & Aufgaben',
    subtitle: 'Arztpraxis, Warenkorb, Konvertierung',
    level: 'Expert',
    order: 16,
    sections: [
      {
        headingDe: '1. Suche in 2D-Array (Arztpraxis)',
        headingFa: '۱. جستجو در آرایه دو بعدی (مطب پزشک)',
        contentDe: 'Szenario: Terminplan (Monat, Tag, Slots). Prüfen, ob Termin frei ist. Komplexität: Zugriff auf `plan[i][j]`.',
        contentFa: 'سناریو: برنامه ملاقات (ماه، روز، اسلات‌ها). بررسی خالی بودن وقت. پیچیدگی: دسترسی به `plan[i][j]`.',
        codeSnippet: `funktion checkTermin(monat, tag)
   plan = getPlan()
   für i = 0 bis zeilen - 1
      wenn plan[i][0] == monat und plan[i][1] == tag dann
         // Gefunden, prüfe Slots...
         return true
      ende wenn
   ende für
   return false
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '2. Zählen mit Bedingung (Kundenumsatz)',
        headingFa: '۲. شمارش شرطی (فروش مشتری)',
        contentDe: 'Zähle Kunden, deren Umsatz >= Limit ist. Muster: Zähler initialisieren, Schleife, If-Bedingung, Zähler++.',
        contentFa: 'شمارش مشتریانی که فروششان >= حد مجاز است. الگو: مقداردهی شمارنده، حلقه، شرط If، افزایش شمارنده.',
        codeSnippet: `anzahl = 0
für i = 0 bis n - 1
   wenn kunden[i].umsatz >= limit dann
      anzahl = anzahl + 1
   ende wenn
ende für`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Liste aufbauen (Filter)',
        headingFa: '۳. ساخت لیست (فیلتر)',
        contentDe: 'Erstelle neue Liste aller Mitarbeiter mit Mindestlohn. Wichtig: `neueListe()` erzeugen und `hinzufuegen()` nutzen.',
        contentFa: 'ساخت لیست جدید از کارمندان با حداقل حقوق. مهم: استفاده از `neueListe()` و `hinzufuegen()`.',
        codeSnippet: `liste = neueListe()
für i = 0 bis n - 1
   lohn = mitarbeiter[i].stunden * satz
   wenn lohn >= mindestLohn dann
      liste.hinzufuegen(mitarbeiter[i])
   ende wenn
ende für`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Strategy Pattern (Versandkosten)',
        headingFa: '۴. الگوی استراتژی (هزینه ارسال)',
        contentDe: 'OOP in GA2: Eine Methode delegiert die Berechnung an ein Interface-Objekt (`versand.berechnen(this)`).',
        contentFa: 'شی‌ءگرایی در GA2: یک متد محاسبات را به یک شیء اینترفیس واگذار می‌کند (`versand.berechnen(this)`).',
        codeSnippet: `Klasse Warenkorb
   versand : VersandStrategy
   
   methode getVersandkosten() : Real
      return versand.berechnen(this)
   end methode
Ende Klasse`,
        language: 'pseudo'
      },
      {
        headingDe: '5. Zahlen-Konvertierung (Dezimal zu Binär)',
        headingFa: '۵. تبدیل اعداد (ده‌دهی به باینری)',
        contentDe: 'Algorithmus: `solange zahl > 0`: Rest berechnen (`mod 2`), vorne an String hängen, Zahl halbieren (`div 2`).',
        contentFa: 'الگوریتم: `solange zahl > 0`: محاسبه باقیمانده (`mod 2`)، چسباندن به اول رشته، نصف کردن عدد (`div 2`).',
        codeSnippet: `erg = ""
solange zahl > 0
   rest = zahl mod 2
   erg = rest + erg  // Wichtig: rest VORNE anhängen
   zahl = zahl / 2
ende solange`,
        language: 'pseudo'
      }
    ]
  },
  {
    id: 'ga2-017',
    type: 'GA2',
    title: 'Unit-Tests Eigenschaften',
    subtitle: 'FIRST Prinzip & Qualität',
    level: 'Qualitätssicherung',
    order: 17,
    sections: [
      {
        headingDe: '1. Schnell (Fast)',
        headingFa: '۱. سریع (Fast)',
        contentDe: 'Die Ausführung muss schnell sein, damit Tests oft ausgeführt werden können.',
        contentFa: 'اجرای تست‌ها باید سریع باشد تا بتوان آن‌ها را به دفعات زیاد اجرا کرد.'
      },
      {
        headingDe: '2. Unabhängig (Independent)',
        headingFa: '۲. مستقل (Independent)',
        contentDe: 'Tests dürfen nicht voneinander abhängen. Sie müssen in beliebiger Reihenfolge laufen.',
        contentFa: 'تست‌ها نباید به یکدیگر وابسته باشند. باید بتوانند با هر ترتیبی اجرا شوند.'
      },
      {
        headingDe: '3. Wiederholbar (Repeatable)',
        headingFa: '۳. قابل تکرار (Repeatable)',
        contentDe: 'Das Ergebnis muss immer gleich sein (keine Zufallswerte oder Zeitabhängigkeit).',
        contentFa: 'نتیجه همیشه باید یکسان باشد (بدون مقادیر تصادفی یا وابستگی زمانی).'
      },
      {
        headingDe: '4. Selbstvalidierend (Self-Validating)',
        headingFa: '۴. خود-اعتبارسنج (Self-Validating)',
        contentDe: 'Der Test muss selbst wissen, ob er erfolgreich war (Pass/Fail), ohne manuelle Prüfung.',
        contentFa: 'تست باید خودش بداند که موفق بوده یا نه (Pass/Fail)، بدون نیاز به بررسی دستی.'
      },
      {
        headingDe: '5. Rechtzeitig (Timely)',
        headingFa: '۵. به موقع (Timely)',
        contentDe: 'Tests sollten VOR dem Code geschrieben werden (TDD).',
        contentFa: 'تست‌ها باید قبل از نوشتن کد اصلی نوشته شوند (TDD).'
      }
    ]
  },
  {
    id: 'ga2-018',
    type: 'GA2',
    title: 'Master – Methoden-Analyse',
    subtitle: 'Echte IHK-Muster erkennen',
    level: 'Expert',
    order: 18,
    sections: [
      {
        headingDe: 'A1: setArray (Initialisierung)',
        headingFa: 'A1: مقداردهی اولیه آرایه',
        contentDe: 'Erstellt ein neues Array der gegebenen Länge und füllt es mit Werten (oft 0 oder null).',
        contentFa: 'یک آرایه جدید با طول داده شده می‌سازد و آن را با مقادیر (معمولاً ۰ یا null) پر می‌کند.',
        codeSnippet: `function setArray(len: Integer): Array
   arr = new Array[len]
   for i = 0 bis len - 1
      arr[i] = 0 // Initialwert
   return arr`,
        language: 'pseudo'
      },
      {
        headingDe: 'A3: erzeugeListe (Matrix zu Liste)',
        headingFa: 'A3: تبدیل ماتریس به لیست',
        contentDe: 'Filtert Daten aus einer 2D-Tabelle (Matrix) in eine einfache Liste.',
        contentFa: 'داده‌ها را از یک جدول دو بعدی (ماتریس) فیلتر کرده و به یک لیست ساده تبدیل می‌کند.',
        codeSnippet: `function erzeugeListe(matrix, jahr)
   liste = neueListe()
   for i = 0 bis zeilen - 1
      if matrix[i].jahr == jahr then
         liste.add(matrix[i])
   return liste`,
        language: 'pseudo'
      },
      {
        headingDe: 'A4: sucheTopseller (Maximum mit Bedingung)',
        headingFa: 'A4: پیدا کردن بهترین فروشنده (با شرط)',
        contentDe: 'Sucht das Maximum, aber nur unter Elementen, die einen Mindestwert erreichen.',
        contentFa: 'بیشترین مقدار را پیدا می‌کند، اما فقط بین عناصری که به یک حد نصاب رسیده‌اند.',
        codeSnippet: `bestId = ""
maxWert = -1
for i = 0 bis n-1
   val = liste[i].wert
   if val >= minLimit und val > maxWert then
      maxWert = val
      bestId = liste[i].id`,
        language: 'pseudo'
      },
      {
        headingDe: 'A7: maxPeriod (Längste Sequenz)',
        headingFa: 'A7: طولانی‌ترین توالی',
        contentDe: 'Findet die längste aufeinanderfolgende Reihe von Werten (z.B. Tage mit > 30 Grad).',
        contentFa: 'طولانی‌ترین رشته پشت سر هم از مقادیر خاص را پیدا می‌کند (مثلاً روزهای گرم متوالی).',
        codeSnippet: `maxLen = 0, currentLen = 0
for i = 0 bis n-1
   if a[i] > limit then
      currentLen++
   else
      if currentLen > maxLen then maxLen = currentLen
      currentLen = 0
if currentLen > maxLen then maxLen = currentLen // Am Ende prüfen!`,
        language: 'pseudo'
      },
      {
        headingDe: 'A16: countVisitors (2D-Matrix Zählen)',
        headingFa: 'A16: شمارش در ماتریس دو بعدی',
        contentDe: 'Zählt Ereignisse in einem Zeitraster (z.B. Besucher pro Stunde und Tag).',
        contentFa: 'رویدادها را در یک شبکه زمانی می‌شمارد (مثلاً بازدیدکنندگان در هر ساعت و روز).',
        codeSnippet: `matrix[tag][stunde] = matrix[tag][stunde] + 1`
      }
    ]
  },
  {
    id: 'ga2-019',
    type: 'GA2',
    title: 'Cheat Sheet – Algorithmen erkennen',
    subtitle: 'Schnelle Tricks für die Prüfung',
    level: 'Cheat Sheet',
    order: 19,
    sections: [
      {
        headingDe: '1. Rückgabetyp analysieren',
        headingFa: '۱. تحلیل نوع خروجی',
        contentDe: '• boolean → Suche (existiert?) oder Check.\n• int/double → Berechnung (Summe, Max, Schnitt) oder Zählen.\n• List/Array → Filtern oder Erstellen.',
        contentFa: '• بولین → جستجو (آیا هست؟) یا بررسی.\n• عدد → محاسبات (جمع، ماکس، میانگین) یا شمارش.\n• لیست/آرایه → فیلتر کردن یا ساختن.'
      },
      {
        headingDe: '2. Methodennamen-Trigger',
        headingFa: '۲. کلمات کلیدی در نام متد',
        contentDe: '• get/finde/suche → Suchalgorithmus (Linear/Binary).\n• zaehle/count → Zählschleife.\n• berechne/compute → Mathe (Summe, Schnitt).\n• filtere/erzeuge → Neue Liste bauen.',
        contentFa: '• get/finde/suche → الگوریتم جستجو.\n• zaehle/count → حلقه شمارش.\n• berechne/compute → ریاضی (جمع، میانگین).\n• filtere/erzeuge → ساخت لیست جدید.'
      },
      {
        headingDe: '3. Parameter-Check',
        headingFa: '۳. بررسی پارامترها',
        contentDe: '• Array + ID → Suche nach ID.\n• Liste + Grenzwert → Zählen oder Filtern nach Grenzwert.\n• 2 Objekte (m1, m2) → Vergleichsfunktion (Comparator).',
        contentFa: '• آرایه + ID → جستجو بر اساس شناسه.\n• لیست + حد نصاب → شمارش یا فیلتر بر اساس حد نصاب.\n• دو شیء (m1, m2) → تابع مقایسه (Comparator).'
      }
    ]
  },
  {
    id: 'ga2-020',
    type: 'GA2',
    title: 'Master – Komprimierung (Wasserfall)',
    subtitle: 'Komplett: RLE, Decoding, Fehleranalyse',
    level: 'Expert',
    order: 20,
    sections: [
      {
        headingDe: '1. Einfache Komprimierung',
        headingFa: '۱. فشرده‌سازی ساده',
        contentDe: 'Ziel: Einen String wie "AAAB" in "3A1B" umwandeln. Man iteriert durch den String und zählt, wie lange das aktuelle Zeichen identisch zum nächsten ist.',
        contentFa: 'هدف: تبدیل رشته‌ای مثل "AAAB" به "3A1B". ما روی رشته حرکت می‌کنیم و می‌شماریم که کاراکتر فعلی تا کجا با بعدی یکسان است.',
        codeSnippet: `funktion komprimiere(text: String): String
    n = länge(text)
    erg = ""
    i = 0
    solange i < n
        // Zähllogik hier...
        erg = erg + anzahl + zeichen
        i = i + 1
    ende solange
    return erg
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '2. Wiederholungen verfolgen (Tracking)',
        headingFa: '۲. ردیابی تکرارها',
        contentDe: 'Die innere Schleife ist das Herzstück. Sie läuft, solange das nächste Zeichen gleich dem aktuellen ist. Wichtig: Der Hauptindex i muss mitgezählt werden!',
        contentFa: 'حلقه داخلی قلب تپنده الگوریتم است. تا زمانی که کاراکتر بعدی با فعلی برابر باشد اجرا می‌شود. مهم: اندیس اصلی i هم باید جلو برود!',
        codeSnippet: `count = 1
solange (i + 1 < n) und (text[i+1] == text[i])
    count = count + 1
    i = i + 1  // Index mitschieben!
ende solange`,
        language: 'pseudo'
      },
      {
        headingDe: '3. Decoding (Entpacken)',
        headingFa: '۳. بازگشایی (Decoding)',
        contentDe: 'Beim Entpacken (z.B. "3A") liest man die Zahl und das Zeichen. Die Zahl bestimmt die Schleifendurchläufe für die Ausgabe.',
        contentFa: 'هنگام بازگشایی (مثلاً "3A")، عدد و کاراکتر خوانده می‌شوند. عدد تعیین می‌کند که حلقه چاپ چند بار اجرا شود.',
        codeSnippet: `funktion dekomprimiere(code: String): String
    erg = ""
    i = 0
    solange i < länge(code)
        anzahl = code[i]
        zeichen = code[i+1]
        für k = 1 bis anzahl
            erg = erg + zeichen
        ende für
        i = i + 2
    ende solange
    return erg
end funktion`,
        language: 'pseudo'
      },
      {
        headingDe: '4. Fehleranalyse',
        headingFa: '۴. تحلیل خطا',
        contentDe: 'Häufiger Fehler: Die letzte Gruppe wird nicht gespeichert, weil die Schleife endet, bevor der letzte "Append"-Befehl ausgeführt wird. Lösung: Speichern innerhalb der Schleife oder danach sicherstellen.',
        contentFa: 'خطای رایج: گروه آخر ذخیره نمی‌شود چون حلقه قبل از دستور "افزودن" پایان می‌یابد. راه حل: ذخیره در داخل حلقه یا اطمینان از اجرا در پایان.',
        codeSnippet: `// FEHLER
solange i < n - 1  // Letztes Zeichen ignoriert?
   // ...
// KORREKT
solange i < n`,
        language: 'pseudo'
      },
      {
        headingDe: '5. Wasserfall-Version (Vollständig)',
        headingFa: '۵. نسخه آبشاری (کد کامل)',
        contentDe: 'Der vollständige Algorithmus, der alle Schritte (Initialisierung, Zählen, Bauen, Inkrementieren) sauber hintereinander ausführt.',
        contentFa: 'الگوریتم کاملی که تمام مراحل (مقداردهی، شمارش، ساختن، افزایش) را به ترتیب و تمیز اجرا می‌کند.',
        codeSnippet: `funktion rleWasserfall(text: String): String
    wenn länge(text) == 0 return ""
    erg = ""
    n = länge(text)
    i = 0
    
    solange i < n
        aktuell = text[i]
        anzahl = 1
        
        // Wasserfall: Zähle solange gleich
        solange (i + 1 < n) und (text[i+1] == aktuell)
            anzahl = anzahl + 1
            i = i + 1
        ende solange
        
        erg = erg + anzahl + aktuell
        i = i + 1
    ende solange
    
    return erg
end funktion`,
        language: 'pseudo'
      }
    ]
  },

  // ===== 10 GA2 EXAM LESSONS (FROM ALGORITHM MATERIALS) =====
  // Auto-extracted from: IHK Algorithmen Handbuch 2025, IHK Lernheft Algorithmen
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
  },
  
  // --- WISO SECTION ---
  {
    id: 'wiso-001',
    type: 'WISO',
    title: 'Betriebsrat',
    subtitle: 'Rechte und Pflichten',
    level: 'Basiswissen',
    order: 1,
    sections: [
      {
        headingDe: 'Der Betriebsrat im Unternehmen',
        headingFa: 'شورا در شرکت (Betriebsrat)',
        contentDe: 'Der Betriebsrat vertritt die Interessen der Arbeitnehmer.',
        contentFa: 'شورا منافع کارکنان را نمایندگی می‌کند.'
      }
    ]
  },
  {
    id: 'wiso-002',
    type: 'WISO',
    title: 'DSGVO Grundlagen',
    subtitle: 'Datenschutz im Betrieb',
    level: 'Fortgeschritten',
    order: 2,
    sections: [
      {
        headingDe: 'Datenschutz-Grundverordnung',
        headingFa: 'مقررات عمومی حفاظت از داده‌ها',
        contentDe: 'Regelt die Verarbeitung personenbezogener Daten.',
        contentFa: 'پردازش داده‌های شخصی را تنظیم می‌کند.'
      }
    ]
  },
  {
    id: 'wiso-003',
    type: 'WISO',
    title: 'WISO Prüfungsfallen',
    subtitle: 'Achtung Falle! (IHK Traps)',
    level: 'Expert',
    order: 3,
    sections: [
      {
        headingDe: '1. Überstunden pauschal abgegolten?',
        headingFa: '۱. اضافه‌کاری کلاً حساب شده؟',
        contentDe: 'Falle: "Mit dem Gehalt sind alle Überstunden abgegolten." -> UNWIRKSAM (wenn keine Obergrenze genannt ist).',
        contentFa: 'دام: «با حقوق، تمام اضافه‌کاری‌ها تسویه شده است.» -> نامعتبر (اگر سقفی تعیین نشده باشد).',
        codeSnippet: `Klausel unwirksam, wenn nicht klar ist, wie viele Stunden gemeint sind (z.B. "bis zu 10%").`,
        language: 'text'
      },
      {
        headingDe: '2. Probezeit & Kündigung',
        headingFa: '۲. دوره آزمایشی و اخراج',
        contentDe: 'Falle: "In der Probezeit kann man sofort gehen." -> FALSCH. Die Frist ist meist 2 Wochen (nicht 0).',
        contentFa: 'دام: «در دوره آزمایشی می‌توان فوراً رفت.» -> غلط. مهلت معمولاً ۲ هفته است (نه صفر).',
        codeSnippet: `§ 622 BGB: 2 Wochen Frist in der Probezeit.`,
        language: 'text'
      },
      {
        headingDe: '3. Garantie vs Gewährleistung',
        headingFa: '۳. گارانتی در برابر ضمانت قانونی',
        contentDe: 'Gewährleistung (Sachmängelhaftung): Gesetzlich, 2 Jahre (Händler).\nGarantie: Freiwillig (Hersteller).',
        contentFa: 'ضمانت قانونی: قانونی، ۲ سال (فروشنده).\nگارانتی: داوطلبانه (تولیدکننده).',
        codeSnippet: `Beweislastumkehr nach 1 Jahr (früher 6 Monate)!`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-004',
    type: 'WISO',
    title: 'WISO Mini-Test',
    subtitle: '100 Fragen Training (Sample)',
    level: 'Quiz',
    order: 4,
    sections: [
      {
        headingDe: 'Frage 1: Wer darf ausbilden?',
        headingFa: 'سوال ۱: چه کسی اجازه آموزش دارد؟',
        contentDe: 'Nur wer "persönlich" und "fachlich" geeignet ist. (AEVO Schein).',
        contentFa: 'فقط کسی که «شخصاً» و «تخصصی» صلاحیت داشته باشد.',
        codeSnippet: `Fachlich: Berufsabschluss + AEVO
Persönlich: Keine Straftaten, keine Verstöße gegen JArbSchG`,
        language: 'text'
      },
      {
        headingDe: 'Frage 2: Maximale Arbeitszeit?',
        headingFa: 'سوال ۲: حداکثر ساعت کاری؟',
        contentDe: 'Laut ArbZG: 8 Stunden werktäglich. Kann auf 10 Stunden verlängert werden, wenn Ausgleich innerhalb von 6 Monaten.',
        contentFa: 'طبق قانون: ۸ ساعت در روز کاری. می‌تواند تا ۱۰ ساعت افزایش یابد اگر در ۶ ماه جبران شود.',
        codeSnippet: `Werktage sind Mo-Sa! Also 48h Woche regulär maximal.`,
        language: 'text'
      },
      {
        headingDe: 'Frage 3: Kündigungsfrist nach 20 Jahren?',
        headingFa: 'سوال ۳: مهلت اخراج بعد از ۲۰ سال؟',
        contentDe: 'Für Arbeitnehmer: Immer 4 Wochen (wenn Vertrag nichts anderes sagt).\nFür Arbeitgeber: 7 Monate zum Monatsende!',
        contentFa: 'برای کارمند: همیشه ۴ هفته.\nبرای کارفرما: ۷ ماه تا پایان ماه!',
        codeSnippet: `§ 622 BGB Staffelungen beachten!`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-005',
    type: 'WISO',
    title: 'Fallstudie: MarSi-IT GmbH (Komplett)',
    subtitle: 'Fragen 1–30: Rechtsformen, Verträge, Sozialversicherung',
    level: 'Fallstudie',
    order: 5,
    sections: [
      {
        headingDe: '1. Ausbilder-Eignung (BBiG)',
        headingFa: '۱. صلاحیت مربی آموزشی (BBiG)',
        contentDe: 'Voraussetzung: Persönliche Eignung (keine Straftaten) + Fachliche Eignung (Berufsabschluss + AEVO/AdA-Schein).',
        contentFa: 'شرط لازم: صلاحیت شخصی (عدم سوءپیشینه) + صلاحیت تخصصی (مدرک تحصیلی + مدرک مربیگری AEVO).',
        codeSnippet: `Nicht jeder Fachinformatiker darf automatisch ausbilden!`,
        language: 'text'
      },
      {
        headingDe: '2. Rechtsformen & Gründung',
        headingFa: '۲. اشکال حقوقی و تأسیس',
        contentDe: 'GmbH = Kapitalgesellschaft, Haftung auf Gesellschaftsvermögen beschränkt. Ist-Kaufmann muss ins Handelsregister. Existenzgründung braucht Marktanalyse (nicht Umsatzhistorie).',
        contentFa: 'GmbH یک شرکت سرمایه است، مسئولیت محدود به دارایی شرکت. تاجر واقعی باید در دفتر تجاری ثبت شود. تأسیس نیاز به تحلیل بازار دارد (نه سابقه فروش).',
        codeSnippet: `Mindeststammkapital GmbH: 25.000 €`,
        language: 'text'
      },
      {
        headingDe: '3. Kennzahlen & Verträge',
        headingFa: '۳. شاخص‌ها و قراردادها',
        contentDe: 'Eigenkapitalrentabilität = (Gewinn / Eigenkapital) * 100. Befristung von Arbeitsverträgen braucht zwingend SCHRIFTFORM (TzBfG).',
        contentFa: 'بازده سرمایه = (سود / سرمایه خودی) * ۱۰۰. قرارداد موقت الزاماً باید کتبی باشد.',
        codeSnippet: `Rentabilität = (Gewinn / EK) * 100`,
        language: 'text'
      },
      {
        headingDe: '4. Pflichten & Rechte',
        headingFa: '۴. حقوق و وظایف',
        contentDe: 'Arbeitnehmer: Verschwiegenheitspflicht. Arbeitgeber: Lohnfortzahlung, Fürsorgepflicht. Urlaub: Wartezeit 6 Monate für vollen Anspruch.',
        contentFa: 'کارمند: حفظ اسرار. کارفرما: پرداخت حقوق، وظیفه مراقبت. مرخصی: دوره انتظار ۶ ماه برای استحقاق کامل.',
      },
      {
        headingDe: '5. Kündigungsschutz & Gründe',
        headingFa: '۵. حمایت در برابر اخراج و دلایل',
        contentDe: 'Kündigungsschutzgesetz gilt ab 10 MA und 6 Monaten Betriebszugehörigkeit. Gründe: Personenbedingt (Krankheit), Verhaltensbedingt (Diebstahl), Betriebsbedingt (Auftragsmangel). Mutterschutz: Kündigungsverbot.',
        contentFa: 'قانون حمایت از اخراج: شرکت > ۱۰ نفر و سابقه > ۶ ماه. دلایل: شخصی (بیماری)، رفتاری (دزدی)، عملیاتی (کاهش سفارش). مادران: ممنوعیت اخراج.',
      },
      {
        headingDe: '6. Sozialversicherung',
        headingFa: '۶. بیمه اجتماعی',
        contentDe: 'Unfallversicherung (BG) zahlt nur AG. Arbeitslosen-, Renten-, Kranken-, Pflegeversicherung zahlen AG + AN je 50%. Pflege-Zuschlag für Kinderlose > 23 Jahre.',
        contentFa: 'بیمه حوادث (BG) فقط کارفرما. بیکاری، بازنشستگی، درمان، مراقبت: ۵۰/۵۰. جریمه مراقبت برای افراد بدون فرزند > ۲۳ سال.',
        codeSnippet: `Unfallanzeige an Berufsgenossenschaft!`,
        language: 'text'
      },
      {
        headingDe: '7. Arbeitnehmerüberlassung (Leiharbeit)',
        headingFa: '۷. کار موقت (Leiharbeit)',
        contentDe: 'Vertragsbeziehung: Arbeitnehmer <-> Verleiher (Zeitarbeitsfirma). Der Verleiher zahlt den Lohn, nicht der Entleiher.',
        contentFa: 'رابطه قراردادی: کارمند <-> شرکت پیمانکار. پیمانکار حقوق می‌دهد، نه شرکتی که در آن کار می‌کنید.',
      },
      {
        headingDe: '8. Betriebsrat & JAV',
        headingFa: '۸. شورای کارگری و نمایندگی جوانان',
        contentDe: 'Betriebsratswahl: Alle ab 16/18 wahlberechtigt. JAV vertritt Azubis und Jugendliche. Mitbestimmung z.B. bei Betriebsferien und Lohngestaltung.',
        contentFa: 'انتخابات شورا: همه بالای ۱۶/۱۸ حق رأی دارند. JAV نماینده کارآموزان است. حق مشارکت در تعطیلات شرکت و تعیین حقوق.',
      },
      {
        headingDe: '9. Sicherheit & Brandschutz',
        headingFa: '۹. ایمنی و آتش‌نشانی',
        contentDe: 'Brandschutz: Fenster/Türen schließen. Sicherheitszeichen: Grün = Rettung, Rot = Verbot/Brandschutz. Sammelpunkt: Alle treffen sich dort.',
        contentFa: 'آتش‌نشانی: بستن در و پنجره. علائم: سبز = نجات، قرمز = ممنوع/آتش. محل تجمع: همه آنجا جمع می‌شوند.',
      },
      {
        headingDe: '10. Agiles Arbeiten',
        headingFa: '۱۰. کار چابک (Agile)',
        contentDe: 'Merkmale: Selbstorganisation, iterative Prozesse, schnelle Reaktion auf Änderungen. Vorteile: Flexibilität, Kundennähe.',
        contentFa: 'ویژگی‌ها: خودسازماندهی، فرآیندهای تکرارپذیر، واکنش سریع. مزایا: انعطاف‌پذیری، نزدیکی به مشتری.',
      }
    ]
  },
  {
    id: 'wiso-006',
    type: 'WISO',
    title: 'Prüfung: AP2 Sommer 2023 (Komplett)',
    subtitle: 'Echte Fragen 1–30 & Analyse',
    level: 'Prüfungstraining',
    order: 6,
    sections: [
      {
        headingDe: '1. AGG & Einstellung',
        headingFa: '۱. قانون برابری (AGG) و مصاحبه',
        contentDe: 'Zulässig: Fragen zur Qualifikation. Unzulässig: Fragen nach Familienplanung, Religion, Partei (außer Tendenzbetrieb). Stellenausschreibung muss neutral sein (m/w/d).',
        contentFa: 'مجاز: سوالات تخصصی. غیرمجاز: تنظیم خانواده، مذهب، حزب. آگهی باید خنثی باشد (m/w/d).',
      },
      {
        headingDe: '2. Jugendarbeitsschutz & Ausbildung',
        headingFa: '۲. قانون کار نوجوانان و آموزش',
        contentDe: 'U18 braucht Erstuntersuchung vor Start. Probezeit Ausbildung: min 1, max 4 Monate (BBiG). Umschulung = komplett neuer Beruf.',
        contentFa: 'زیر ۱۸ سال نیاز به معاینه اولیه دارد. دوره آزمایشی کارآموزی: ۱ تا ۴ ماه. بازآموزی (Umschulung) = شغل کاملاً جدید.',
      },
      {
        headingDe: '3. Sozialversicherung Details',
        headingFa: '۳. جزئیات بیمه اجتماعی',
        contentDe: 'Beitragsteilung 50/50 bei RV, KV, PV, ALV. Versicherungspflichtgrenze: Wer drüber liegt, kann freiwillig in GKV bleiben oder in PKV wechseln.',
        contentFa: 'تقسیم حق بیمه ۵۰/۵۰. حد نصاب بیمه اجباری: اگر درآمد بالاتر باشد، می‌توان داوطلبانه در بیمه دولتی ماند یا به خصوصی رفت.',
      },
      {
        headingDe: '4. Wirtschaftssektoren',
        headingFa: '۴. بخش‌های اقتصادی',
        contentDe: 'Primär (Urproduktion: Landwirt), Sekundär (Produktion: Handwerk/Industrie), Tertiär (Dienstleistung: Bank, IT, Handel).',
        contentFa: 'اولیه (کشاورزی)، ثانویه (تولید/صنعت)، ثالثیه (خدمات: بانک، IT، تجارت).',
      },
      {
        headingDe: '5. IHK Aufgaben',
        headingFa: '۵. وظایف اتاق بازرگانی (IHK)',
        contentDe: 'Überwachung der Ausbildung, Organisation von Prüfungen, Streitschlichtung zwischen Azubi und Betrieb.',
        contentFa: 'نظارت بر آموزش، برگزاری امتحانات، حل اختلاف بین کارآموز و شرکت.',
      },
      {
        headingDe: '6. Umwelt & Nachhaltigkeit',
        headingFa: '۶. محیط زیست و پایداری',
        contentDe: 'Abfallhierarchie: Vermeidung > Wiederverwendung > Recycling > Beseitigung. Blauer Engel: Kennzeichen für umweltfreundliche Produkte (z.B. Recyclingpapier).',
        contentFa: 'سلسله مراتب زباله: اجتناب > استفاده مجدد > بازیافت > دفع. فرشته آبی: نشان محصولات دوستدار محیط زیست.',
      },
      {
        headingDe: '7. Konjunktur & Rezession',
        headingFa: '۷. چرخه اقتصادی و رکود',
        contentDe: 'Rezession: Nachfrage sinkt, Investitionen sinken, Arbeitslosigkeit steigt, Stimmung pessimistisch.',
        contentFa: 'رکود: کاهش تقاضا، کاهش سرمایه‌گذاری، افزایش بیکاری، جو بدبینانه.',
      }
    ]
  },
  {
    id: 'wiso-007',
    type: 'WISO',
    title: 'WISO Master-Tricks',
    subtitle: 'Hacks für Multiple Choice',
    level: 'Cheat Sheet',
    order: 7,
    sections: [
      {
        headingDe: '1. Die "2-aus-4" Regel',
        headingFa: '۱. قانون حذف ۲ گزینه',
        contentDe: 'Oft sind 2 Antworten offensichtlich falsch. Streiche diese zuerst weg. Rate dann zwischen den verbleibenden zwei.',
        contentFa: 'معمولاً ۲ گزینه تابلو غلط هستند. اول آن‌ها را حذف کن، سپس بین دو تای باقی‌مانده انتخاب کن.',
        codeSnippet: `Eliminierungsverfahren erhöht Chance von 25% auf 50%.`,
        language: 'text'
      },
      {
        headingDe: '2. Signalwörter beachten',
        headingFa: '۲. کلمات کلیدی (Signalwörter)',
        contentDe: 'Vorsicht bei "immer", "nie", "ausschließlich" (meist falsch). Besser: "in der Regel", "grundsätzlich" (oft richtig).',
        contentFa: 'مراقب کلمات "همیشه"، "هرگز"، "فقط" باشید (معمولاً غلط). کلمات "معمولاً"، "اصولاً" شانس درستی بیشتری دارند.',
        codeSnippet: `Gesetze haben fast immer Ausnahmen!`,
        language: 'text'
      },
      {
        headingDe: '3. Formel-Hacks',
        headingFa: '۳. ترفندهای فرمول',
        contentDe: 'Produktivität = Menge / Einsatz.\nWirtschaftlichkeit = Ertrag / Aufwand (muss > 1 sein für Gewinn).\nRentabilität = (Gewinn / Kapital) * 100.',
        contentFa: 'بهره‌وری = مقدار / ورودی.\nاقتصادی بودن = درآمد / هزینه (باید > ۱ باشد).\nبازدهی = (سود / سرمایه) * ۱۰۰.',
        codeSnippet: `Wirtschaftlichkeit > 1 => Gewinnzone`,
        language: 'text'
      },
      {
        headingDe: '4. Kündigungsschutz',
        headingFa: '۴. حمایت در برابر اخراج',
        contentDe: 'Gilt erst, wenn Betrieb > 10 Mitarbeiter UND man länger als 6 Monate dort arbeitet (Wartezeit).',
        contentFa: 'فقط زمانی معتبر است که شرکت > ۱۰ کارمند داشته باشد و شما بیش از ۶ ماه آنجا کار کرده باشید.',
        codeSnippet: `Kleinbetrieb (<10 MA) hat keinen Kündigungsschutz!`,
        language: 'text'
      },
      {
        headingDe: '5. Rechtsformen Matrix',
        headingFa: '۵. ماتریس شرکت‌ها',
        contentDe: 'OHG: Alle haften voll. KG: Komplementär voll, Kommanditist nur Einlage. GmbH: Haftung nur Firmenvermögen (Mindestkapital 25k). AG: Aktien, Börse.',
        contentFa: 'OHG: مسئولیت نامحدود همه. KG: یک نفر نامحدود، شریک دیگر محدود. GmbH: مسئولیت محدود به شرکت (۲۵ هزار). AG: سهام.',
      },
      {
        headingDe: '6. AGG Check',
        headingFa: '۶. چک لیست تبعیض',
        contentDe: 'Fragen nach Alter, Herkunft, Religion, Schwangerschaft sind verboten -> "Lüge erlaubt". Ausnahme: Tendenzbetrieb (z.B. Kirche darf nach Religion fragen).',
        contentFa: 'سوال درباره سن، ملیت، مذهب، بارداری ممنوع است -> دروغ مجاز است. استثنا: موسسات عقیدتی (مثلاً کلیسا).',
      }
    ]
  },
  // --- NEW WISO LESSON ---
  {
    id: 'wiso-008',
    type: 'WISO',
    title: 'WISO Prüfungsfallen: Achtung IHK Traps',
    subtitle: 'Häufige Stolpersteine & Fallen',
    level: 'Expert',
    order: 8,
    sections: [
      {
        headingDe: '1. Überstunden pauschal abgegolten?',
        headingFa: '۱. اضافه‌کاری کلاً حساب شده؟',
        contentDe: 'Falle: "Mit dem Gehalt sind alle Überstunden abgegolten." -> UNWIRKSAM (wenn keine Obergrenze genannt ist). Eine konkrete Zahl (z.B. "bis zu 10 Stunden") muss genannt werden.',
        contentFa: 'دام: «با حقوق، تمام اضافه‌کاری‌ها تسویه شده است.» -> نامعتبر (اگر سقفی تعیین نشده باشد). باید تعداد مشخصی ذکر شود.',
        codeSnippet: `Pauschalabgeltung ohne Limit ist oft unwirksam.`,
        language: 'text'
      },
      {
        headingDe: '2. Probezeit & Kündigung',
        headingFa: '۲. دوره آزمایشی و اخراج',
        contentDe: 'Falle: "In der Probezeit kann man sofort gehen." -> FALSCH. Die Frist ist meist 2 Wochen (nicht 0), außer bei fristloser Kündigung aus wichtigem Grund.',
        contentFa: 'دام: «در دوره آزمایشی می‌توان فوراً رفت.» -> غلط. مهلت معمولاً ۲ هفته است (نه صفر)، مگر در موارد اخراج فوری با دلیل موجه.',
        codeSnippet: `§ 622 BGB: 2 Wochen Frist in der Probezeit.`,
        language: 'text'
      },
      {
        headingDe: '3. Sachmängelhaftung vs. Garantie',
        headingFa: '۳. ضمانت قانونی در برابر گارانتی',
        contentDe: 'Sachmängelhaftung (Gewährleistung): Gesetzlich vorgeschrieben, 2 Jahre, gegenüber dem Händler. Beweislastumkehr nach 1 Jahr. Garantie: Freiwillig, vom Hersteller.',
        contentFa: 'ضمانت قانونی (Gewährleistung): قانونی، ۲ سال، در برابر فروشنده. بار اثبات بعد از ۱ سال برعکس می‌شود. گارانتی: داوطلبانه، از طرف تولیدکننده.',
        codeSnippet: `Gewährleistung = Gesetzlich (Händler)\nGarantie = Freiwillig (Hersteller)`,
        language: 'text'
      },
      {
        headingDe: '4. Kündigungsfristen (Arbeitnehmer vs. Arbeitgeber)',
        headingFa: '۴. مهلت‌های اخراج (کارمند vs کارفرما)',
        contentDe: 'Arbeitnehmer: Grundsätzlich 4 Wochen zum 15. oder Monatsende. Arbeitgeber: Frist verlängert sich mit Betriebszugehörigkeit (z.B. 1 Monat nach 2 Jahren, 7 Monate nach 20 Jahren).',
        contentFa: 'کارمند: اصولاً ۴ هفته تا ۱۵ام یا آخر ماه. کارفرما: مهلت با سابقه کار افزایش می‌یابد (مثلاً ۱ ماه بعد از ۲ سال، ۷ ماه بعد از ۲۰ سال).',
        codeSnippet: `§ 622 BGB Staffelung beachten!`,
        language: 'text'
      },
      {
        headingDe: '5. Arbeitslosengeld I vs. II (Bürgergeld)',
        headingFa: '۵. بیمه بیکاری ۱ در برابر ۲ (Bürgergeld)',
        contentDe: 'ALG I: Versicherungsleistung, 60/67% vom Netto, befristet. ALG II (Bürgergeld): Sozialleistung, steuerfinanziert, bedarfsorientiert (Existenzminimum).',
        contentFa: 'ALG I: خدمات بیمه‌ای، ۶۰/۶۷٪ خالص، محدود. ALG II (Bürgergeld): خدمات اجتماعی، از مالیات، بر اساس نیاز (حداقل معیشت).',
        codeSnippet: `ALG I = Versicherung\nALG II = Sozialleistung`,
        language: 'text'
      }
    ]
  },
  
  // --- EXPANDED WISO LESSONS ---
  {
    id: 'wiso-009',
    type: 'WISO',
    title: 'Arbeitsvertrag Grundlagen',
    subtitle: 'Inhalte, Arten, Besonderheiten',
    level: 'Masterfile',
    order: 9,
    sections: [
      {
        headingDe: '1. Wesentliche Inhalte des Arbeitsvertrags',
        headingFa: '۱. محتوای اساسی قرارداد کار',
        contentDe: 'Pflicht: Arbeitsort, Tätigkeit, Lohn/Gehalt, Arbeitszeit. Die Schriftform ist empfohlen (§ 2 NachwV).\nFormal: Angebot + Annahme = Vertrag zustande.',
        contentFa: 'ضروری: محل کار، نوع فعالیت، حقوق، ساعات کاری. فرم کتبی توصیه می‌شود.\nروند: پیشنهاد + قبول = تشکیل قرارداد.',
        codeSnippet: `Wesentliche Vertragsinhalte:
• Tätigkeit
• Arbeitsort
• Arbeitszeit
• Vergütung`,
        language: 'text'
      },
      {
        headingDe: '2. Arten von Arbeitsverträgen',
        headingFa: '۲. انواع قراردادهای کار',
        contentDe: 'Unbefristet: Dauert bis Beendigung durch Kündigung/Aufhebung. Befristet: Endet zu festem Zeitpunkt (§ 14 TzBfG). Während Ausbildung: Besonderheiten (Probezeit!).',
        contentFa: 'بدون مدت: تا اخراج ادامه می‌یابد. محدود مدت: در تاریخ معین پایان می‌یابد. طی دوره آموزش: مقررات خاص (دوره آزمایشی!).',
        codeSnippet: `Unbefristet: Ordentliche Kündigung
Befristet: Endet automatisch
Ausbildung: Probezeit 1-4 Monate`,
        language: 'text'
      },
      {
        headingDe: '3. Besonderheiten des Ausbildungsvertrags',
        headingFa: '۳. ویژگی‌های قرارداد آموزش',
        contentDe: 'Nach BBiG: Muss Ausbildungsziel, Dauer (meist 3 Jahre), Probezeit (1-4 Monate), Vergütung enthalten. Probezeitkündigung ist jederzeit möglich (ohne Frist).',
        contentFa: 'طبق BBiG: باید شامل هدف، مدت (معمولاً ۳ سال)، دوره آزمایشی (۱-۴ ماه)، پاداش باشد. اخراج در دوره آزمایشی بدون مهلت ممکن است.',
        codeSnippet: `Ausbildungsvertrag-Besonderheiten:
• Probezeit (Kündigung ohne Frist)
• Ausbildungsziel
• Dauer (§ 5 BBiG)`,
        language: 'text'
      },
      {
        headingDe: '4. Änderung & Beendigung des Vertrags',
        headingFa: '۴. تغییر و پایان قرارداد',
        contentDe: 'Ordentliche Kündigung: Gilt nach Probezeit. Fristlose Kündigung: Nur bei wichtigem Grund (z.B. Gewalt, Betrug). Aufhebungsvertrag: Einigung beider Seiten.',
        contentFa: 'اخراج معمولی: بعد از دوره آزمایشی. اخراج فوری: فقط با دلیل موجه (خشونت، فریب). توافق خاتمه: توافق طرفین.',
        codeSnippet: `Beendigung:
• Ordentliche Kündigung (mit Frist)
• Fristlose Kündigung (Grund notwendig)
• Aufhebungsvertrag (Einigung)`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-010',
    type: 'WISO',
    title: 'Sozialversicherung Komplett',
    subtitle: 'SV-Träger, Beiträge, Leistungen',
    level: 'Masterfile',
    order: 10,
    sections: [
      {
        headingDe: '1. Die 5 Säulen der Sozialversicherung',
        headingFa: '۱. پنج ستون بیمه اجتماعی',
        contentDe: 'Rentenversicherung (RV): Altersrente, Erwerbstätigenrente.\nKrankenversicherung (KV): Arzt, Krankenhaus, Zahnbehandlung.\nPflegeversicherung (PV): Pflege, Rehabilitation.\nArbeitslosenversicherung (AV): Arbeitslosengeld I.\nUnfallversicherung (UV): Arbeitsunfälle, Berufskrankheiten.',
        contentFa: 'بیمهٔ بازنشستگی: پنسیون سالمندی، معلولیت.\nبیمهٔ صحت: پزشک، بیمارستان، دندان‌پزشک.\nبیمهٔ مراقبت: مراقبت، توانبخشی.\nبیمهٔ بیکاری: درآمد بیکاری I.\nبیمهٔ حادثه کار: تصادفات کاری، بیماری‌های شغلی.',
        codeSnippet: `5 Säulen der SV:
1. Rentenversicherung
2. Krankenversicherung
3. Pflegeversicherung
4. Arbeitslosenversicherung
5. Unfallversicherung`,
        language: 'text'
      },
      {
        headingDe: '2. Beiträge & Finanzierung',
        headingFa: '۲. سهم‌ها و تأمین‌مالی',
        contentDe: 'Arbeitnehmer zahlt ca. 20-21% des Brutto. Arbeitgeber zahlt Hälfte. Finanziert durch Beiträge + Steuerzuschüsse (besonders bei RV, KV, AV).',
        contentFa: 'کارمند تقریباً ۲۰-۲۱٪ حقوق ناخالص می‌پردازد. کارفرما نیمی را می‌پردازد. از طریق سهم‌ها و کمک‌های مالیاتی تأمین می‌شود.',
        codeSnippet: `Beitragssätze (Beispiel 2024):
• RV: 18,6% (AN: 9,3%, AG: 9,3%)
• KV: ~15,5% (AN: 7,75%, AG: 7,75%)
• PV: 3,6% (AN: 1,8%, AG: 1,8%)
• AV: 2,6% (AN: 1,3%, AG: 1,3%)`,
        language: 'text'
      },
      {
        headingDe: '3. Wichtige Begriffe & Grenzen',
        headingFa: '۳. مفاهیم و حدود مهم',
        contentDe: 'Versicherungspflicht: Für Arbeitnehmer obligatorisch. Geringfügig beschäftigt: < 520 Euro/Monat (keine SV). Versicherungsfrei: z.B. Freiberufler, aber freiwillig möglich.',
        contentFa: 'تحت پوشش اجباری: برای کارمندان الزامی. کار جزئی: کمتر از ۵۲۰ یورو/ماه (بدون بیمه). معاف: مثلاً متخصصان آزاد، اما می‌توانند داوطلبانه بیمه شوند.',
        codeSnippet: `Versicherungspflicht-Grenzen:
• Regelaltersrente: 67 Jahre
• Geringfügig: < 520€/Monat
• Minijob: Versicherungsfrei (optional)`,
        language: 'text'
      },
      {
        headingDe: '4. Rentenversicherung – Alterssicherung',
        headingFa: '۴. بیمهٔ بازنشستگی – تأمین سالمندی',
        contentDe: 'Rente ab 67 Jahren (Regelaltersgrenze). Früherentensionen möglich (mit Zuschlag/Abschlag). Erwerbstätigenrente bei Invalidität. Hinterbliebenenrente für Familie.',
        contentFa: 'پنسیون از سن ۶۷ سال. بازنشستگی زودرس ممکن است (با مالیات/تخفیف). پنسیون ناتوانی. پنسیون بازماندگان برای خانواده.',
        codeSnippet: `Rentenarten:
• Altersrente (67 Jahre)
• Invaliditätsrente
• Hinterbliebenenrente`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-011',
    type: 'WISO',
    title: 'Tarifvertrag & Kollektives Arbeitsrecht',
    subtitle: 'TV-Struktur, Bindung, Auslegung',
    level: 'Fortgeschritten',
    order: 11,
    sections: [
      {
        headingDe: '1. Tarifvertrag – Definition & Parteien',
        headingFa: '۱. قرارداد دستمزدی – تعریف و طرف‌ین',
        contentDe: 'Tarifvertrag (TV): Vereinbarung zw. Arbeitgeberverbänden/Unternehmen und Gewerkschaften. Regelt Lohn, Arbeitszeit, Urlaub, Kündigungsfristen. Branchentarifvertrag (BTV): Für ganze Branche (z.B. Einzelhandel).',
        contentFa: 'قرارداد دستمزدی: توافق بین سازمان‌های کارفرمایان/شرکت‌ها و اتحادیه‌های کارگری. حقوق، ساعات کاری، تعطیل، مهلت‌های اخراج را تعیین می‌کند.',
        codeSnippet: `Tarifvertrag (TV):
• Lohnhöhe
• Arbeitszeit
• Urlaubstage
• Kündigungsfristen`,
        language: 'text'
      },
      {
        headingDe: '2. Tarifgebundenheit & Anwendung',
        headingFa: '۲. پیوند به قرارداد دستمزدی و اعمال',
        contentDe: 'Tarifgebunden: Arbeitgeber ist Mitglied im Arbeitgeberverband -> TV obligatorisch. Nicht-tarifgebunden: Unternehmen nutzt TV freiwillig (z.B. „Anerkennung").',
        contentFa: 'تحت پوشش تعاقد: کارفرما عضو سازمان کارفرمایان است -> قرارداد الزامی. خارج از قرارداد: شرکت آن را داوطلبانه اجرا می‌کند.',
        codeSnippet: `Tarifgebundenheit:
• Wenn Arbeitgeber im Verband Mitglied
• TV für alle Mitarbeiter bindend
• Allgemein-verbindlich erklärbar (AVE)`,
        language: 'text'
      },
      {
        headingDe: '3. Betriebsrat & Tarifvertrag',
        headingFa: '۳. شورای کارخانه و قرارداد دستمزدی',
        contentDe: 'Betriebsrat (BR) vertritt Arbeitnehmer im Betrieb. TV gilt automatisch. BR hat Mitspracherecht bei sozialen Fragen (Kündigungen, Versetzungen). Betriebsvereinbarung kann TV konkretisieren.',
        contentFa: 'شورا نمایندهٔ کارمندان در کارخانه است. قرارداد خودکار اعمال می‌شود. شورا در مسائل اجتماعی نظارت دارد. توافقات کارخانه‌ای می‌تواند قرارداد را تحت‌الشعاع قرار دهد.',
        codeSnippet: `Betriebsrat-Aufgaben:
• Mitsprache bei Einstellung/Kündigung
• Überwachung Arbeitssicherheit
• Förderung Betriebsrat`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-012',
    type: 'WISO',
    title: 'Kündigungsschutz & Fristen',
    subtitle: 'Gesetzliche Regeln & Ausnahmefälle',
    level: 'Masterfile',
    order: 12,
    sections: [
      {
        headingDe: '1. Gesetzliche Kündigungsfristen (§ 622 BGB)',
        headingFa: '۱. مهلت‌های اخراج قانونی',
        contentDe: 'Arbeitnehmer: Grundsätzlich 4 Wochen zum 15. oder Monatsende.\nArbeitgeber: 4 Wochen (während Probezeit oft 2 Wochen), dann staffelweise: 1 Monat nach Betriebszugehörigkeit, 7 Monate zum Ende eines Kalendermonats nach 20 Jahren.',
        contentFa: 'کارمند: اساساً ۴ هفته تا ۱۵ام یا آخر ماه.\nکارفرما: ۴ هفته (در دوره آزمایشی اغلب ۲ هفته)، بعد سلسله‌ای: ۱ ماه بعد از ۲ سال، ۷ ماه بعد از ۲۰ سال.',
        codeSnippet: `§ 622 BGB:
Arbeitnehmer: 4 Wochen zum 15./Monatsende
Arbeitgeber: 
  - Probezeit: 2 Wochen
  - Nach 2 Jahren: 1 Monat
  - Nach 20 Jahren: 7 Monate`,
        language: 'text'
      },
      {
        headingDe: '2. Kündigungsschutz nach KSchG',
        headingFa: '۲. حمایت از اخراج نامعقول',
        contentDe: 'Nach 6 Monaten (Betrieb) oder 2 Jahren (Kleinbetrieb): Ordentliche Kündigung nur mit \"wichtigem Grund\" zulässig (Verhalten, Leistung, Betriebsrat-Zustimmung bei Sozialplan). Schwerbehinderte brauchen Zustimmung Integrationsamtamt.',
        contentFa: 'بعد از ۶ ماه (کارخانهٔ بزرگ) یا ۲ سال (کارخانهٔ کوچک): اخراج معمولی فقط با «دلیل موجه» مجاز است. افراد دارای معلولیت شدید نیاز به تأیید دولت دارند.',
        codeSnippet: `KSchG Kündigungsschutz:
• Nach 6 Monaten im Betrieb
• Grund notwendig (Verhalten/Leistung)
• Schwerbehinderte: Zustimmung AMtA`,
        language: 'text'
      },
      {
        headingDe: '3. Besondere Kündigungsschutzfälle',
        headingFa: '۳. مسائل خاص حمایت از اخراج',
        contentDe: 'Schwangerschaft: Kündigung nicht zulässig. Elternzeit: Schutz während Elternzeitnahme. Schwerbehinderung: Zusätzlicher Schutz. BR-Mitglieder: Zusätzliche Protektionen.',
        contentFa: 'بارداری: اخراج مجاز نیست. مرخصی والدین: حمایت در طول مرخصی. معلولیت شدید: حمایت اضافی. اعضای شورا: حماتی بیشتر.',
        codeSnippet: `Besondere Kündigungsschutzfälle:
• Schwangerschaft
• Elternzeit
• Schwerbehinderung (%)
• BR-Mitgliedschaft`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-013',
    type: 'WISO',
    title: 'Unternehmensformen – Übersicht',
    subtitle: 'GmbH, AG, Einzelunternehmer, KG',
    level: 'Fortgeschritten',
    order: 13,
    sections: [
      {
        headingDe: '1. Einzelunternehmer',
        headingFa: '۱. متخصص آزاد (Einzelunternehmer)',
        contentDe: 'Keine Gründung nötig (automatisch mit Geschäftsbetrieb). Unbeschränkte Haftung mit Privatvermögen. Vollständige Gewinnbeteiligung. Einfache Buchhaltung & Besteuerung (Einkommenssteuer).',
        contentFa: 'بدون تاسیس رسمی (خودکار). مسئولیت نامحدود با دارایی شخصی. سود کاملاً خاص است. ثبت ساده و مالیات (درآمد فردی).',
        codeSnippet: `Einzelunternehmer:
• Keine Gründung
• Unbeschränkte Haftung (Privatvermögen)
• Einfache Besteuerung`,
        language: 'text'
      },
      {
        headingDe: '2. Gesellschaft mit beschränkter Haftung (GmbH)',
        headingFa: '۲. شرکت محدود (GmbH)',
        contentDe: 'Mindestkapital: 25.000 Euro. Haftung beschränkt auf Kapital (nicht Privatvermögen). Geschäftsführer führt Geschäfte. Gesellschafter zahlen Steuern (Körperschaftsteuer + Gewerbesteuer).',
        contentFa: 'حداقل سرمایه: ۲۵۰۰۰ یورو. مسئولیت تنها به سرمایه محدود است. مدیر اجرایی امور را هدایت می‌کند. مالیات: شرکتی + صنعتی.',
        codeSnippet: `GmbH:
• Mindestkapital: 25.000€
• Haftung begrenzt
• Geschäftsführer + Gesellschafter`,
        language: 'text'
      },
      {
        headingDe: '3. Aktiengesellschaft (AG)',
        headingFa: '۳. شرکت سهامی (AG)',
        contentDe: 'Mindestkapital: 50.000 Euro. Aktionäre (Anteilseigner). Vorstand führt Geschäfte, Aufsichtsrat kontrolliert. Strenge Publizität (Bilanzpublikation). Größere Haftungsbegrenzung.',
        contentFa: 'حداقل سرمایه: ۵۰۰۰۰ یورو. سهام‌داران (مالکان سهام). هیئت مدیرهٔ اجرایی و نظارتی. انتشار علنی (بیلان). مسئولیت محدود شدیدتر.',
        codeSnippet: `AG:
• Mindestkapital: 50.000€
• Vorstand + Aufsichtsrat
• Aktionäre
• Strenge Rechnungslegung`,
        language: 'text'
      },
      {
        headingDe: '4. Kommanditgesellschaft (KG) & OHG',
        headingFa: '۴. شرکت تضامنی (KG) و OHG',
        contentDe: 'OHG: Alle Partner haften unbeschränkt. KG: Komplementär (unbeschränkt), Kommanditist (begrenzt auf Kapital). Beide sind Personengesellschaften (flexibler als GmbH/AG).',
        contentFa: 'OHG: همه شرکاء با مسئولیت نامحدود. KG: شریک کامل (نامحدود)، شریک سرمایه‌گذار (محدود). هر دو شرکت‌های شخصی هستند.',
        codeSnippet: `OHG: Alle Partner unbeschränkt haftbar
KG: 
  • Komplementär (unbeschränkt)
  • Kommanditist (begrenzt)`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-014',
    type: 'WISO',
    title: 'Steuern & Finanzierung',
    subtitle: 'Einkommensteuer, Lohnsteuer, Gewerbe, VAT',
    level: 'Fortgeschritten',
    order: 14,
    sections: [
      {
        headingDe: '1. Lohnsteuer & Einkommensteuer',
        headingFa: '۱. مالیات حقوقی و درآمدی',
        contentDe: 'Lohnsteuer: Abzug direkt vom Arbeitgeber (Quellensteuer). Steuerkarte (Lohnsteuerkarte) regelt Abzüge. Am Jahresende: Steuererklärung & ggfs. Nachzahlung/Erstattung.',
        contentFa: 'مالیات حقوقی: کسر مستقیم از سوی کارفرما. کارت مالیات (Lohnsteuerkarte) میزان کسر را تعیین می‌کند. سال پایانی: اظهارنامه و احتمالاً بازپرداخت یا استرداد.',
        codeSnippet: `Lohnsteuer:
• Quellensteuer (direkt vom Arbeitgeber)
• Steuerkarte (Steuerklasse)
• Jahresausgleich (Erklärung)`,
        language: 'text'
      },
      {
        headingDe: '2. Gewerbesteuer',
        headingFa: '۲. مالیات صنعتی',
        contentDe: 'Wird von Gemeinde erhoben. Unterschiedlicher Satz je nach Gemeinde (meist 7-14%). Für Einzelunternehmer, GmbH, OHG obligatorisch. Freibetrag: 24.500 Euro.',
        contentFa: 'توسط شهرداری جمع‌آوری می‌شود. نرخ متفاوت (معمولاً ۷-۱۴٪). برای تمام انواع کسب‌وکار. معافیت: ۲۴۵۰۰ یورو.',
        codeSnippet: `Gewerbesteuer:
• Von Gemeinde erhoben
• Rate 7-14% (variabel)
• Freibetrag: 24.500€`,
        language: 'text'
      },
      {
        headingDe: '3. Körperschaftsteuer (KSt)',
        headingFa: '۳. مالیات شرکتی',
        contentDe: 'Für Körperschaften (GmbH, AG, Vereinigungen). Satz: 30% auf Gewinne. Zusätzlich: Solidaritätszuschlag (5,5%).',
        contentFa: 'برای اشخاص حقوقی (GmbH، AG). نرخ: ۳۰٪ بر سود. اضافه: عوارض ضمن‌سفری.',
        codeSnippet: `Körperschaftsteuer:
• 30% auf Gewinne
• Solidaritätszuschlag 5,5%
• Für Kapitalgesellschaften`,
        language: 'text'
      },
      {
        headingDe: '4. Mehrwertsteuer (MwSt / VAT)',
        headingFa: '۴. مالیات بر ارزش افزوده (VAT)',
        contentDe: 'Normale Rate: 19%. Ermäßigte Rate: 7% (Lebensmittel, Bücher). Kleinunternehmer (< 22.000€ Umsatz) können befreit sein.',
        contentFa: 'نرخ عادی: ۱۹٪. نرخ کاهش یافته: ۷٪ (غذا، کتاب). شرکت‌های کوچک (کمتر از ۲۲۰۰۰ یورو فروش) می‌توانند معاف شوند.',
        codeSnippet: `Mehrwertsteuer:
• Normal: 19%
• Ermäßigt: 7%
• Kleinunternehmer: Befreiung möglich`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-015',
    type: 'WISO',
    title: 'Verbraucherrecht & Produkthaftung',
    subtitle: 'Mängel, Rücktritt, Gewährleistung',
    level: 'Fortgeschritten',
    order: 15,
    sections: [
      {
        headingDe: '1. Gewährleistung (Sachmängelhaftung)',
        headingFa: '۱. ضمانت قانونی بر ایراد کالا',
        contentDe: 'Der Verkäufer ist 2 Jahre für Mängel haftbar. Kauf ab Werk: 2 Jahre, danach Beweislastumkehr. Wenn Mangel in 1. Jahr: Verkäufer beweist Fehler war nicht da. Nach 1 Jahr: Käufer beweist Mangel war da.',
        contentFa: 'فروشنده ۲ سال برای نقایص مسئول است. در سال اول: فروشنده ثابت می‌کند نقص نبوده است. بعد از سال اول: خریدار ثابت می‌کند نقص وجود داشته است.',
        codeSnippet: `Gewährleistung (BGB):
• 2 Jahre Haftung
• 1. Jahr: Verkäufer beweist Fehler war nicht da
• Ab 2. Jahr: Käufer beweist Mangel`,
        language: 'text'
      },
      {
        headingDe: '2. Garantie (Freiwillig)',
        headingFa: '۲. گارانتی (داوطلبانه)',
        contentDe: 'Nicht gesetzlich vorgeschrieben. Vom Hersteller freiwillig. Kann kürzer oder länger als 2 Jahre sein. Zusätzlich zur Gewährleistung.',
        contentFa: 'قانونی نیست. از طرف تولیدکننده داوطلبانه. می‌تواند کمتر یا بیشتر از ۲ سال باشد.',
        codeSnippet: `Garantie:
• Freiwillig (Hersteller)
• Nicht gesetzlich
• Zusätzlich zur Gewährleistung`,
        language: 'text'
      },
      {
        headingDe: '3. Rücktritt & Schadensersatz',
        headingFa: '۳. بازگشت و خسارت',
        contentDe: 'Rücktritt: Käufer kann vom Kaufvertrag zurücktreten (unbrauchbar oder schwere Mängel). Schadensersatz: Bei Gewalt oder fahrlässigem Verhalten des Verkäufers.',
        contentFa: 'بازگشت: خریدار می‌تواند از قرارداد برگردد (نقص شدید). خسارت: در صورت رفتار غیرمنطقی فروشنده.',
        codeSnippet: `Rücktrittsrecht:
• Bei Mängel (Sachmängelhaftung)
• Frist: 2 Jahre
• Schadensersatz bei Fahrlässigkeit`,
        language: 'text'
      },
      {
        headingDe: '4. Produkthaftungsgesetz (ProdHaftG)',
        headingFa: '۴. قانون مسئولیت محصول',
        contentDe: 'Hersteller haftet für Schäden durch fehlerhafte Produkte. Auch ohne Verschulden (Gefährdungshaftung). Ausnahme: Entwicklungsrisiken (nicht foresehbar).',
        contentFa: 'تولیدکننده برای صدمات ناشی از محصولات معیوب مسئول است. حتی بدون تقصیر (بدون شرط). استثنا: ریسک‌های نامعلوم.',
        codeSnippet: `ProdHaftG:
• Hersteller haftet
• Auch ohne Verschulden
• Ausnahme: Entwicklungsrisiken`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-016',
    type: 'WISO',
    title: 'Berufsbildungsgesetz (BBiG)',
    subtitle: 'Ausbildung, Pflichten, Prüfung',
    level: 'Masterfile',
    order: 16,
    sections: [
      {
        headingDe: '1. Grundlagen Berufsausbildung',
        headingFa: '۱. اساس آموزش حرفه‌ای',
        contentDe: 'BBiG regelt Ausbildung in Deutschland. Muss staatlich anerkannt sein. Dauer meist 2-3,5 Jahre. Duales System: Betrieb + Berufsschule.',
        contentFa: 'BBiG نظام آموزش را تنظیم می‌کند. باید به رسمیت شناخته شود. مدت معمولاً ۲-۳.۵ سال. سیستم دوگانه: کارخانه + مدرسه فنی.',
        codeSnippet: `BBiG:
• Duale Ausbildung
• Anerkannte Berufe
• Dauer: 2-3,5 Jahre`,
        language: 'text'
      },
      {
        headingDe: '2. Pflichten des Ausbildungsbetriebs',
        headingFa: '۲. وظایف کارفرمای آموزش‌دهنده',
        contentDe: 'Ausbilden nach anerkanntem Plan. Vergütung zahlen (angemessen). Ausbildungsmittel stellen. Angemessene Betreuung. Prüfungsgebühren zahlen. Nicht einseitig verlängern.',
        contentFa: 'آموزش طبق برنامهٔ تأیید شده. حقوق مناسب. ابزار و تجهیزات. سرپرستی مناسب. هزینهٔ امتحان. بدون تمدید جانب‌دارانه.',
        codeSnippet: `Arbeitgeberpflichten:
• Ausbildung nach Plan
• Angemessene Vergütung
• Lernmittel
• Prüfungsgebühren`,
        language: 'text'
      },
      {
        headingDe: '3. Pflichten des Auszubildenden',
        headingFa: '۳. وظایف فرد تحت آموزش',
        contentDe: 'Lernpflicht: Müssen fleißig lernen. Betriebliche Anordnungen beachten. Schweigepflicht (Betriebsgeheimnisse). Pünktlichkeit & Zuverlässigkeit.',
        contentFa: 'تعهد یادگیری: باید کوشا باشند. دستورات کارخانه‌ای را رعایت کنند. محرمانگی (اسرار). دقت‌وقتی و اعتماد.',
        codeSnippet: `Auszubildendenpflichten:
• Lernpflicht
• Gehorsamspflicht
• Schweigepflicht
• Sorgfaltspflicht`,
        language: 'text'
      },
      {
        headingDe: '4. Abschlussprüfung',
        headingFa: '۴. امتحان پایان‌نامه',
        contentDe: 'Nach Ausbildungszeit. Schriftlich & praktisch. IHK-Prüfung (Industrie) oder HWK (Handwerk). Bestehen = Gesellenbrief/Facharbeiterbrief.',
        contentFa: 'بعد از مدت آموزش. کتبی و عملی. توسط IHK (صنعت) یا HWK (صنعتگری). موفقیت = گواهینامهٔ صنعتگر.',
        codeSnippet: `Abschlussprüfung:
• Schriftlich + Praktisch
• IHK oder HWK
• Gesellenbrief`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-017',
    type: 'WISO',
    title: 'Arbeits- und Betriebssicherheit',
    subtitle: 'ArbSchG, DSGVO, Datenschutz',
    level: 'Fortgeschritten',
    order: 17,
    sections: [
      {
        headingDe: '1. Arbeitsschutzgesetz (ArbSchG)',
        headingFa: '۱. قانون حفاظت کارگری',
        contentDe: 'Arbeitgeber muss Arbeitsplatz sicher gestalten. Gefährdungsbeurteilung durchführen. Unfallverhütung, Ergonomie, Lärm, Chemikalien. Arbeitsmedizinische Vorsorge.',
        contentFa: 'کارفرما باید محل کار را ایمن کند. ارزیابی خطرات انجام دهد. پیشگیری از تصادفات، ارگونومی، سر و صدا، شیمیایی‌ها.',
        codeSnippet: `ArbSchG:
• Arbeitsplatz sicher gestalten
• Gefährdungsbeurteilung
• Unfallverhütung
• Ärztliche Vorsorge`,
        language: 'text'
      },
      {
        headingDe: '2. Jugendarbeitsschutzgesetz (JArbSchG)',
        headingFa: '۲. قانون حفاظت از کار نوجوانان',
        contentDe: 'Jugendliche (unter 18): Max. 8 Stunden täglich, 40 Stunden wöchentlich. Kein Nachtarbeit (zulässig 6-22 Uhr). 30 Tage Urlaub. Keine gefährlichen Arbeiten.',
        contentFa: 'نوجوانان (زیر ۱۸): حداکثر ۸ ساعت روزانه، ۴۰ ساعت هفتگی. بدون کار شب (فقط ۶-۲۲). ۳۰ روز تعطیل. بدون کار خطرناک.',
        codeSnippet: `JArbSchG:
• Max. 8h/Tag, 40h/Woche
• Keine Nachtarbeit
• 30 Tage Urlaub
• Keine gefährlichen Arbeiten`,
        language: 'text'
      },
      {
        headingDe: '3. DSGVO & Datenschutz',
        headingFa: '۳. DSGVO و حفاظت داده‌ها',
        contentDe: 'DSGVO regelt Verarbeitung personenbezogener Daten. Erlaubnisprinzip: Daten nur mit Einwilligung (oder Vertrag/Gesetz). Betroffenenrechte: Auskunft, Löschung, Widerspruch.',
        contentFa: 'DSGVO پردازش داده‌های شخصی را تنظیم می‌کند. اصل اجازه: فقط با رضایت (یا قرارداد/قانون). حقوق افراد: اطلاع، حذف، مخالفت.',
        codeSnippet: `DSGVO:
• Erlaubnisprinzip
• Betroffenenrechte (Auskunft, Löschung)
• Datensicherheit
• Meldesystem`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-018',
    type: 'WISO',
    title: 'Wirtschaftssysteme & Märkte',
    subtitle: 'Angebot, Nachfrage, Wettbewerb',
    level: 'Basiswissen',
    order: 18,
    sections: [
      {
        headingDe: '1. Marktwirtschaft – Grundprinzipien',
        headingFa: '۱. اقتصاد بازار – اصول بنیادی',
        contentDe: 'Angebot & Nachfrage bestimmen Preis. Konkurrenzdruck treibt Innovation. Gewinnorientierung lenkt Ressourcen. Beispiel: Wenn viele Schulen gebraucht werden, Angebot steigt.',
        contentFa: 'عرضه و تقاضا قیمت را تعیین می‌کند. رقابت نوآوری را تشویق می‌کند. سود سرمایه‌ها را هدایت می‌کند. مثال: اگر نیاز به معلمان زیادی باشد، حقوق بالا می‌رود.',
        codeSnippet: `Marktwirtschaft:
• Angebot & Nachfrage
• Preismechanismus
• Konkurrenz
• Gewinnorientierung`,
        language: 'text'
      },
      {
        headingDe: '2. Preisfeststellung',
        headingFa: '۲. تعیین قیمت',
        contentDe: 'Marktpreis: Gleichgewicht zwischen Angebot & Nachfrage (Gleichgewichtspreis). Zu hoch: Überschuss. Zu niedrig: Mangel. Preis passt sich bis Gleichgewicht an.',
        contentFa: 'قیمت بازار: تعادل بین عرضه و تقاضا. خیلی بالا: اضافه برداشت. خیلی کم: کمبود. قیمت تا تعادل تغییر می‌کند.',
        codeSnippet: `Preismechanismus:
• Gleichgewichtspreis
• Angebot = Nachfrage
• Überschuss (Preis ↑)
• Mangel (Preis ↓)`,
        language: 'text'
      },
      {
        headingDe: '3. Wettbewerb & Monopole',
        headingFa: '۳. رقابت و انحصارات',
        contentDe: 'Perfekter Wettbewerb: Viele Anbieter, niedrige Preise, Innovation. Monopol: Ein Anbieter -> höhere Preise, weniger Innovation. Oligopol: Wenige große Anbieter (z.B. Telekommunikation).',
        contentFa: 'رقابت کامل: انبوه فروشندگان، قیمت پایین، نوآوری. انحصار: یک فروشنده، قیمت بالا. الیگوپولی: چند فروشندهٔ بزرگ.',
        codeSnippet: `Marktformen:
• Vollständige Konkurrenz
• Monopol
• Oligopol
• Monopolistische Konkurrenz`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-019',
    type: 'WISO',
    title: 'Löhne & Gehalt – Nachweise',
    subtitle: 'Lohnabrechnung, Abzüge, Nettoberechnung',
    level: 'Praktik',
    order: 19,
    sections: [
      {
        headingDe: '1. Brutto- vs. Nettoentgelt',
        headingFa: '۱. حقوق ناخالص و خالص',
        contentDe: 'Brutto: Gesamtentgelt vor Abzügen. Netto: Nach Steuern & Versicherungen. Abzüge: Lohnsteuer, Kirchensteuer, Solidaritätszuschlag, Sozialversicherung.',
        contentFa: 'ناخالص: کل حقوق قبل کسورات. خالص: بعد از مالیات و بیمه. کسورات: مالیات حقوقی، مالیات کلیسا، بیمه اجتماعی.',
        codeSnippet: `Lohnberechnung:
Brutto
- Lohnsteuer
- Kirchensteuer
- Sozialversicherung
= Netto`,
        language: 'text'
      },
      {
        headingDe: '2. Sozialversicherungsbeiträge',
        headingFa: '۲. سهم‌های بیمهٔ اجتماعی',
        contentDe: 'Arbeitnehmer zahlt ca. 20-21% des Brutto (Renten-, Kranken-, Pflege-, Arbeitslosenversicherung). Arbeitgeber zahlt die andere Hälfte (Arbeitgeberanteil).',
        contentFa: 'کارمند تقریباً ۲۰-۲۱٪ ناخالص می‌پردازد. کارفرما نیمی را می‌پردازد.',
        codeSnippet: `SV-Beiträge:
• RV (Rente): 9,3%
• KV (Kranke): 7,75%
• PV (Pflege): 1,8%
• AV (Arbeitslosig): 1,3%
Total: ca. 20%`,
        language: 'text'
      },
      {
        headingDe: '3. Lohnsteuer & Einbehalt',
        headingFa: '۳. مالیات حقوقی و کسر',
        contentDe: 'Lohnsteuer hängt von Steuerklasse ab (Verheiratet/Single/Kinder). Arbeitgeber zieht ab & zahlt dem Finanzamt. Steuerkarte (oder elektronisch) zeigt Abzugssatz.',
        contentFa: 'مالیات حقوقی به وضعیت تأهل بستگی دارد. کارفرما کسر کرده و به دولت می‌پردازد.',
        codeSnippet: `Lohnsteuer:
• Abhängig von Steuerklasse
• I, II, III, IV, V, VI
• Quelle: Arbeitgeber zieht ein`,
        language: 'text'
      }
    ]
  },
  {
    id: 'wiso-020',
    type: 'WISO',
    title: 'Vertragsrecht – Kaufvertrag',
    subtitle: 'Angebot, Annahme, Mängel, Rücktritt',
    level: 'Masterfile',
    order: 20,
    sections: [
      {
        headingDe: '1. Kaufvertrag – Formation',
        headingFa: '۱. تشکیل قرارداد خریداری',
        contentDe: 'Kaufvertrag besteht aus: Angebot (verbindliches Anbot von Verkäufer) + Annahme (Käufer akzeptiert). Willenserklärung beider Parteien. Schriftform nicht obligatorisch (mündlich OK).',
        contentFa: 'قرارداد خریداری: پیشنهاد (از فروشنده) + قبول (از خریدار). بیان اراده هر دو طرف. فرم کتبی لازم نیست (شفاهی کافی است).',
        codeSnippet: `Kaufvertrag Formation:
Angebot (Verkäufer) 
+ Annahme (Käufer)
= Vertrag zustande gekommen`,
        language: 'text'
      },
      {
        headingDe: '2. Pflichten von Verkäufer & Käufer',
        headingFa: '۲. وظایف فروشنده و خریدار',
        contentDe: 'Verkäufer: Liefern der Ware, Übereignung (Besitztransfer). Käufer: Annahme der Ware, Bezahlung. Risiko geht auf Käufer beim Übergang des Besitzes über.',
        contentFa: 'فروشنده: تحویل کالا، انتقال مالکیت. خریدار: پذیرش، پرداخت. خطر به خریدار منتقل می‌شود.',
        codeSnippet: `Verkäuferpflichten:
• Lieferung der Ware
• Übergabe/Übereignung
• Sachmängelhaftung (2 Jahre)

Käuferpflichten:
• Annahme
• Zahlung`,
        language: 'text'
      },
      {
        headingDe: '3. Gewährleistung & Rücktritt',
        headingFa: '۳. ضمانت و حق بازگشت',
        contentDe: 'Mangel: Ware entspricht nicht Vertrag. Rücktritt: Käufer kann zurücktreten (Preis erstattet). Minderung: Preis wird gesenkt. Schadensersatz möglich.',
        contentFa: 'نقص: کالا با قرارداد مطابقت ندارد. بازگشت: خریدار می‌تواند برگردد. کاهش قیمت ممکن است.',
        codeSnippet: `Mangelhaftung:
• 2 Jahre Gewährleistung
• Rücktritt (Preis erstattet)
• Minderung (Preis gesenkt)
• Schadersatz`,
        language: 'text'
      }
    ]
  },

  // ===== 10 WISO EXAM LESSONS (FROM EXAM MATERIALS) =====
  // Auto-extracted from: WISO_30_Aufgaben_DE_FA_print.html
  {
    id: 'wiso-exam-01',
    type: 'WISO',
    title: 'WISO Prüfungsfragen 1-3',
    subtitle: 'Echte IHK Prüfungsfragen',
    level: 'Prüfung',
    order: 301,
    sections: [
      {
        headingDe: 'Sektoren der Wirtschaft',
        headingFa: 'بخش‌های اقتصادی',
        contentDe: 'IT-Dienstleistungsunternehmen gehören zum tertiären Sektor. Mit 95 Mitarbeitern wird das Unternehmen nicht als "Großunternehmen" (>250) klassifiziert. Ein Marktanteil von 34% stellt kein Monopol dar. Eine GmbH ist eine Kapitalgesellschaft (nicht Personengesellschaft).',
        contentFa: 'شرکت‌های خدمات فناوری اطلاعات متعلق به بخش سوم (خدمات) هستند. با ۹۵ کارمند، این شرکت بزرگ طبقه‌بندی نمی‌شود. سهم بازار ۳۴% انحصار به شمار نمی‌رود. GmbH شرکتی سهام‌داری است (شرکت خصوصی).',
        language: 'text'
      },
      {
        headingDe: 'Allgemeines Gleichbehandlungsgesetz (AGG)',
        headingFa: 'قانون برابری معاملات عمومی (AGG)',
        contentDe: 'Stellenanzeige: "junges Team... weit weg von Elternzeit/Midlife-Crisis" → Altersdiskriminierung ist verboten. Das AGG schützt vor Benachteiligung aufgrund von Rasse, Geschlecht, Alter, Behinderung, Religion, sexueller Identität.',
        contentFa: 'اعلان شغلی: "تیم جوان...دور از مرخصی والدین/بحران میانسالی" → تبعیض سنی ممنوع است. قانون AGG در برابر تبعیض بر اساس نژاد، جنسیت، سن، معلولیت، مذهب، و جهت‌گیری جنسی محافظت می‌کند.',
        language: 'text'
      },
      {
        headingDe: 'Arbeitgeber-Schutzpflichten (Arbeitsschutz)',
        headingFa: 'تعهدات حمایت کارفرما (ایمنی محل کار)',
        contentDe: 'Der Arbeitgeber MUSS Arbeitsschutzmaßnahmen treffen (§1 Arbeitsschutzgesetz). Das Ergebnis: Ein sicherer und gesunder Arbeitsplatz ist erforderlich. Dies ist keine freiwillige Leistung, sondern gesetzliche Pflicht.',
        contentFa: 'کارفرما باید اقدامات حفاظتی در محل کار انجام دهد (§1 قانون حفاظت کار). نتیجه: محل کار ایمن و سالم ضروری است. این تعهد اختیاری نیست بلکه الزام قانونی است.',
        language: 'text'
      }
    ]
  },

  {
    id: 'wiso-exam-02',
    type: 'WISO',
    title: 'WISO Prüfungsfragen 4-6',
    subtitle: 'Echte IHK Prüfungsfragen',
    level: 'Prüfung',
    order: 302,
    sections: [
      {
        headingDe: 'Unzulässige Fragen im Bewerbungsgespräch',
        headingFa: 'سوالات غیرمجاز در مصاحبه',
        contentDe: 'Im Bewerbungsgespräch kann der Bewerber über Schwangerschaft, Gewerkschaftszugehörigkeit, Alter, Religion lügen. Der Arbeitgeber darf diese Fragen nicht stellen. Ausnahme: Religiöse Organisationen dürfen fragen (bei wichtigem beruflichem Grund).',
        contentFa: 'در مصاحبه استخدام، متقاضی می‌تواند درباره بارداری، عضویت اتحادیه، سن و مذهب دروغ بگوید. کارفرما نمی‌تواند این سوالات را بپرسد. استثناء: سازمان‌های مذهبی می‌توانند بپرسند (بر اساس دلایل مهم حرفه‌ای).',
        language: 'text'
      },
      {
        headingDe: 'Probezeit und Kündigungsschutz',
        headingFa: 'دوره آزمایشی و حمایت در برابر اخراج',
        contentDe: 'Probezeit: maximal 6 Monate (§622 BGB). Während der Probezeit gilt: Beide Seiten können mit 2 Wochen Frist kündigen. Nach der Probezeit: 4 Wochen Frist (zum 15. oder Ende eines Kalendermonats).',
        contentFa: 'دوره آزمایشی: حداکثر ۶ ماه (§622 BGB). در دوران آزمایشی: هر دو طرف با اخطار ۲ هفته‌ای می‌توانند اخراج کنند. بعد از دوره آزمایشی: مهلت ۴ هفته‌ای (به ۱۵ یا پایان ماه تقویمی).',
        language: 'text'
      },
      {
        headingDe: 'Tarifgebundenheit und Tarifvertrag',
        headingFa: 'عضویت در تعرفه و قرارداد تعرفه‌ای',
        contentDe: 'Ist der Arbeitgeber Mitglied eines Arbeitgeberverbandes, gilt ein Tarifvertrag automatisch. Der Tarifvertrag regelt: Löhne, Arbeitszeiten, Urlaub, Zuschläge. Der Arbeitgeber kann sich nicht aussuchen, ob er die Tarife zahlt oder nicht.',
        contentFa: 'اگر کارفرما عضو اتحادیه کارفرمایان باشد، قرارداد تعرفه‌ای خودکار اعمال می‌شود. قرارداد تعرفه‌ای تنظیم می‌کند: دستمزد، ساعات کاری، تعطیلات، جایزه‌ها. کارفرما نمی‌تواند انتخاب کند که آیا حقوق تعرفه‌ای را بپردازد یا خیر.',
        language: 'text'
      }
    ]
  },

  {
    id: 'wiso-exam-03',
    type: 'WISO',
    title: 'WISO Prüfungsfragen 7-9',
    subtitle: 'Echte IHK Prüfungsfragen',
    level: 'Prüfung',
    order: 303,
    sections: [
      {
        headingDe: 'Betriebsratswahl – Wahlberechtigung',
        headingFa: 'انتخابات شورای کارخانه – شرایط رأی‌دهی',
        contentDe: 'Wahlberechtigt sind alle Arbeitnehmer, die ≥18 Jahre alt sind. Der Betriebsrat wird ab 5+ Mitarbeitern gebildet (§1 BetrVG). Kandidaten brauchen 6 Monate Betriebszugehörigkeit.',
        contentFa: 'حق رأی‌دهی برای تمام کارمندان بالای ۱۸ سال است. شورای کارخانه از ۵+ کارمند تشکیل می‌شود (§1 BetrVG). نامزدها نیاز به ۶ ماه سابقه در شرکت دارند.',
        language: 'text'
      },
      {
        headingDe: 'Mitbestimmungsrechte des Betriebsrats',
        headingFa: 'حقوق مشارکت شورای کارخانه',
        contentDe: 'Der Betriebsrat hat Mitbestimmungsrecht (§87 BetrVG) bei: Überwachungstechnik, Beginn/Ende Arbeitszeit, Arbeitszeitverteilung, Arbeitsregeln, Leistungsentgelt, Urlaubsplanung. Der Arbeitgeber kann nicht allein entscheiden.',
        contentFa: 'شورای کارخانه حق مشارکت (§87 BetrVG) در زمینه: فناوری نظارتی، شروع/پایان ساعات کار، توزیع زمان کاری، قوانین کاری، پاداش عملکرد، برنامه‌ریزی تعطیلات دارد. کارفرما نمی‌تواند تنهایی تصمیم بگیرد.',
        language: 'text'
      },
      {
        headingDe: 'Tarifautonomie',
        headingFa: 'خودمختاری تعرفه‌ای',
        contentDe: 'Tarifautonomie (Art. 9 Abs. 3 GG): Arbeitgeber und Arbeitnehmern (Gewerkschaften) verhandeln Arbeitsbedingungen frei, OHNE Staatliche Einmischung. Sie bestimmen Löhne, Arbeitszeiten, Urlaub selbst - Grundprinzip des deutschen Arbeitsrechts.',
        contentFa: 'خودمختاری تعرفه‌ای (ماده ۹، بند ۳ قانون اساسی): کارفرمایان و کارمندان (اتحادیه‌ها) شرایط کار را آزادانه مذاکره می‌کنند، بدون مداخله دولت. آن‌ها خود دستمزد، ساعات کاری، تعطیلات را تعیین می‌کنند - اصل بنیادی قانون کار آلمان.',
        language: 'text'
      }
    ]
  },

  {
    id: 'wiso-exam-04',
    type: 'WISO',
    title: 'WISO Prüfungsfragen 10-12',
    subtitle: 'Echte IHK Prüfungsfragen',
    level: 'Prüfung',
    order: 304,
    sections: [
      {
        headingDe: 'Weiterbildung und berufliche Entwicklung',
        headingFa: 'تحصیلات تکمیلی و توسعه حرفه‌ای',
        contentDe: 'Weiterbildung kann außerhalb des Unternehmens stattfinden (bei zertifizierten Bildungsträgern). Der Arbeitgeber muss nicht alle Schulungen im Betrieb durchführen. Das ist rechtlich zulässig und oft sinnvoll.',
        contentFa: 'آموزش تکمیلی می‌تواند خارج از شرکت انجام شود (توسط ارائه‌دهندگان آموزشی معتبر). کارفرما مجبور نیست تمام آموزش‌ها را در شرکت انجام دهد. این قانونی و اغلب مفید است.',
        language: 'text'
      },
      {
        headingDe: 'Wegeunfall – Haftung der Berufsgenossenschaft',
        headingFa: 'حادثه راهی – مسئولیت بیمه حادثه کار',
        contentDe: 'Wegeunfall = Unfall auf dem Weg zur/von der Arbeit. Das zählt als Arbeitsunfall. Der Arbeitgeber MUSS den Unfall der Berufsgenossenschaft (BG) melden (§193 SGB VII). Die BG ersetzt Kosten, nicht der Arbeitgeber.',
        contentFa: 'حادثه راهی = حادثه در راه رفتن به/از کار. این به عنوان حادثه کاری محسوب می‌شود. کارفرما باید حادثه را به بیمه حادثه کار (BG) گزارش دهد (§193 SGB VII). BG هزینه‌ها را پوشش می‌دهد، نه کارفرما.',
        language: 'text'
      },
      {
        headingDe: 'Beitragsbemessungsgrenze (BBG)',
        headingFa: 'سقف ارزیابی سهم‌ (BBG)',
        contentDe: 'Einkommen über der Beitragsbemessungsgrenze: Es fallen KEINE zusätzlichen Sozialversicherungsbeiträge an. Nur Einkommen bis zur BBG werden zur Berechnung herangezogen. Das begrenzt die Belastung für Hochverdiener.',
        contentFa: 'درآمد بالای سقف ارزیابی سهم: هیچ سهم بیمه اجتماعی اضافی واجب نیست. فقط درآمد تا سقف برای محاسبه استفاده می‌شود. این بار را برای درآمد‌های بالا محدود می‌کند.',
        language: 'text'
      }
    ]
  },

  {
    id: 'wiso-exam-05',
    type: 'WISO',
    title: 'WISO Prüfungsfragen 13-15',
    subtitle: 'Echte IHK Prüfungsfragen',
    level: 'Prüfung',
    order: 305,
    sections: [
      {
        headingDe: 'Solidaritätsprinzip der Sozialpolitik',
        headingFa: 'اصل همبستگی در سیاست اجتماعی',
        contentDe: 'Solidaritätsprinzip: Progressive Besteuerung (mehr Einkommen = höherer Steuersatz %), Kindergeld für alle gleich, Umverteilung von Reich zu Arm. Das ist die Grundlage des deutschen Sozialversicherungssystems.',
        contentFa: 'اصل همبستگی: مالیات پیشرفته (درآمد بیشتر = درصد مالیات بالاتر)، کمک‌هزینه کودکان برای همه یکسان، توزیع مجدد از ثروتمندان به فقرایان. این پایه‌ی سیستم بیمه اجتماعی آلمان است.',
        language: 'text'
      },
      {
        headingDe: 'Private vs. Gesetzliche Altersversorgung',
        headingFa: 'بازنشستگی خصوصی در برابر قانونی',
        contentDe: 'Private Altersvorsorge hängt ab von: Zinssätzen, wirtschaftliche Lage → höheres Risiko. Bei niedrigen Zinsen wächst private Sparvermögen langsam. Gesetzliche Rentenversicherung bietet mehr Sicherheit (Umlageverfahren).',
        contentFa: 'بازنشستگی خصوصی بستگی دارد به: نرخ بهره، وضعیت اقتصادی → خطر بالاتر. با نرخ‌های پایین، پس‌انداز خصوصی کند رشد می‌کند. بیمه بازنشستگی قانونی امنیت بیشتری فراهم می‌کند (سیستم توزیعی).',
        language: 'text'
      },
      {
        headingDe: 'Erwerbswirtschaftliches Prinzip',
        headingFa: 'اصل فعالیت اقتصادی',
        contentDe: 'Erwerbswirtschaftliche Unternehmen: Tragen wirtschaftliches Risiko, ziel auf Gewinn/Kapitalrendite, arbeiten konkurrenzorientiert. Merkmale einer kapitalistischen Marktwirtschaft (im Gegensatz zu Nichtwirtschaftlichen Betrieben).',
        contentFa: 'شرکت‌های فعالیت اقتصادی: خطر اقتصادی را متحمل می‌شوند، هدف سود/بازگشت سرمایه، کار رقابتی. ویژگی‌های اقتصاد بازار سرمایه‌داری (برخلاف شرکت‌های غیرتجاری).',
        language: 'text'
      }
    ]
  },

  {
    id: 'wiso-exam-06',
    type: 'WISO',
    title: 'WISO Exam Questions 16-18',
    subtitle: 'Real IHK Exam Questions',
    level: 'Prüfung',
    order: 306,
    sections: [
      {
        headingDe: 'Question 16: Equal Treatment & Non-Discrimination',
        headingFa: 'سوال 16: برابری معاملات و ممانعت از تبعیض',
        contentDe: 'AGG (Allgemeines Gleichbehandlungsgesetz) protects against discrimination based on: race, ethnicity, gender, age, disability, religion, sexual orientation. Employer violations can lead to compensation claims.',
        contentFa: 'AGG (قانون برابری عمومی) در برابر تبعیض بر اساس: نژاد، قومیت، جنسیت، سن، معلولیت، مذهب، جهت‌گیری جنسی محافظت می‌کند. تخلفات کارفرما می‌تواند منجر به ادعاهای خسارت شود.',
        language: 'text'
      },
      {
        headingDe: 'Question 17: Minimum Wage (Mindestlohn)',
        headingFa: 'سوال 17: حداقل حقوق (Mindestlohn)',
        contentDe: 'Germany has statutory minimum wage (€12/hour aprox. 2024). Applies to all sectors. Exceptions: internships, mini-jobs in some cases. Regular employees must earn at least minimum wage.',
        contentFa: 'آلمان حداقل حقوق قانونی دارد (تقریباً 12 یورو/ساعت 2024). برای همه بخش‌ها اعمال می‌شود. استثنا: کارآموزی، مشاغل فوق‌العاده در برخی موارد. کارمندان منظم باید حداقل حداقل حقوق را به دست بیاورند.',
        language: 'text'
      },
      {
        headingDe: 'Question 18: Holiday Pay & Benefits',
        headingFa: 'سوال 18: حقوق تعطیل و مزایا',
        contentDe: 'Minimum 20 vacation days (4 weeks) by law in Germany. Collective bargaining often increases this (e.g., 30 days). Must be taken in calendar year or carried to next (with restrictions).',
        contentFa: 'حداقل ۲۰ روز تعطیل (۴ هفته) قانوناً در آلمان. قرارداد جمعی اغلب این را افزایش می‌دهد (مثلاً ۳۰ روز). باید در سال تقویمی گرفته شود یا به سال بعد منتقل شود (با محدودیت‌ها).',
        language: 'text'
      }
    ]
  },

  {
    id: 'wiso-exam-07',
    type: 'WISO',
    title: 'WISO Exam Questions 19-21',
    subtitle: 'Real IHK Exam Questions',
    level: 'Prüfung',
    order: 307,
    sections: [
      {
        headingDe: 'Question 19: Severance & Termination Protection',
        headingFa: 'سوال 19: غرامت و حمایت در برابر اخراج',
        contentDe: 'Wrongful termination (without cause after 6 months or 2 years in small firms) can entitle employee to severance. Must file lawsuit within 3 weeks (Kündigungsschutzgesetz §4).',
        contentFa: 'اخراج غیرموجه (بدون دلیل بعد از ۶ ماه یا ۲ سال در شرکت‌های کوچک) می‌تواند کارمند را به غرامت منجر کند. باید در ظرف ۳ هفته شکایت کند (§4 قانون حمایت در برابر اخراج).',
        language: 'text'
      },
      {
        headingDe: 'Question 20: Health Insurance (Krankenversicherung)',
        headingFa: 'سوال 20: بیمه سلامت (Krankenversicherung)',
        contentDe: 'Health insurance is mandatory for all employees. About 15.5% contribution (split 50-50 with employer). Covers doctor visits, hospital, medications, dental work, rehabilitation.',
        contentFa: 'بیمه سلامت برای تمام کارمندان اجباری است. تقریباً سهم ۱۵.۵٪ (تقسیم ۵۰-۵۰ با کارفرما). پوشش معاینات پزشک، بیمارستان، دارو، دندان‌پزشکی، توانبخشی.',
        language: 'text'
      },
      {
        headingDe: 'Question 21: Workplace Safety Officer (Betriebsrat)',
        headingFa: 'سوال 21: افسر ایمنی محل کار (شورای کارخانه)',
        contentDe: 'Works council has right to co-determination on workplace safety measures, working conditions, working time. Employer cannot ignore these rights. Regular meetings required for decision-making.',
        contentFa: 'شورای کارخانه حق مشارکت در اقدامات ایمنی محل کار، شرایط کار، ساعات کاری دارد. کارفرما نمی‌تواند از این حقوق صرف‌نظر کند. جلسات منظم برای تصمیم‌گیری ضروری است.',
        language: 'text'
      }
    ]
  },

  {
    id: 'wiso-exam-08',
    type: 'WISO',
    title: 'WISO Exam Questions 22-24',
    subtitle: 'Real IHK Exam Questions',
    level: 'Prüfung',
    order: 308,
    sections: [
      {
        headingDe: 'Question 22: IT Security & Compliance',
        headingFa: 'سوال 22: امنیت فناوری اطلاعات و ریاستی‌پذیری',
        contentDe: 'Companies handling personal data must comply with DSGVO (German implementation of GDPR). Data protection officer required for certain roles. Breaches must be reported within 72 hours.',
        contentFa: 'شرکت‌هایی که داده‌های شخصی را کنترل می‌کنند باید با DSGVO (استقرار آلمانی GDPR) مطابقت داشته باشند. افسر حفاظت داده برای نقش‌های معینی ضروری است. نقض‌ها باید در ظرف ۷۲ ساعت گزارش شوند.',
        language: 'text'
      },
      {
        headingDe: 'Question 23: Employee Data Privacy (Arbeitnehmer)',
        headingFa: 'سوال 23: حریم خصوصی داده کارمند',
        contentDe: 'Employee email monitoring: Employer can monitor business emails for compliance, but cannot read private emails of employees. Clear policy needed. Over-surveillance violates privacy rights.',
        contentFa: 'نظارت بر ایمیل کارمند: کارفرما می‌تواند ایمیل‌های تجاری را برای ریاستی‌پذیری نظارت کند، اما نمی‌تواند ایمیل‌های خصوصی کارمندان را بخواند. سیاست واضح مورد نیاز است. نظارت بیش‌ازحد حقوق حریم‌خصوصی را نقض می‌کند.',
        language: 'text'
      },
      {
        headingDe: 'Question 24: Contract Law & Liability',
        headingFa: 'سوال 24: قانون قراردادها و مسئولیت',
        contentDe: 'Employment contract is bilateral agreement. Both parties must fulfill obligations. Breach by employer (e.g., non-payment) can result in wrongful termination or severance claim.',
        contentFa: 'قرارداد کار توافق دو‌طرفه است. هر دو طرف باید تعهدات خود را انجام دهند. تخلف کارفرما (مثلاً عدم پرداخت) می‌تواند منجر به اخراج غیرموجه یا ادعای غرامت شود.',
        language: 'text'
      }
    ]
  },

  {
    id: 'wiso-exam-09',
    type: 'WISO',
    title: 'WISO Exam Questions 25-27',
    subtitle: 'Real IHK Exam Questions',
    level: 'Prüfung',
    order: 309,
    sections: [
      {
        headingDe: 'Question 25: Corporate Social Responsibility (CSR)',
        headingFa: 'سوال 25: مسئولیت اجتماعی شرکت‌ها (CSR)',
        contentDe: 'CSR means companies take responsibility beyond legal requirements: environmental protection, fair wages, worker safety, community engagement. Ethical business practice.',
        contentFa: 'CSR به معنای شرکت‌ها مسئولیت فراتر از الزامات قانونی برعهده می‌گیرند: حفاظت محیط، حقوق منصفانه، ایمنی کارگری، تعامل جامعه. عملکرد تجاری اخلاقی.',
        language: 'text'
      },
      {
        headingDe: 'Question 26: Unemployment Insurance (Arbeitslosenversicherung)',
        headingFa: 'سوال 26: بیمه بیکاری (Arbeitslosenversicherung)',
        contentDe: 'Unemployment Insurance (ALV) is mandatory for employees. About 2.6% contribution (split). Provides Arbeitslosengeld I (wage replacement, 60% net). Max duration ~24 months depending on age.',
        contentFa: 'بیمه بیکاری (ALV) برای کارمندان اجباری است. تقریباً سهم ۲.۶٪ (تقسیم). فراهم می‌کند Arbeitslosengeld I (جایگزینی حقوق، ۶۰٪ خالص). حداکثر مدت ~۲۴ ماه بسته به سن.',
        language: 'text'
      },
      {
        headingDe: 'Question 27: SGB II (Bürgergeld) vs ALG I',
        headingFa: 'سوال 27: SGB II (Bürgergeld) در برابر ALG I',
        contentDe: 'ALG I (insurance-based, time-limited) vs Bürgergeld (tax-funded, ongoing for unemployed unable to work). Different systems - insurance vs. social welfare. Different eligibility rules.',
        contentFa: 'ALG I (بر پایهٔ بیمه، محدود مدت) در برابر Bürgergeld (تأمین‌مالی مالیاتی، جاری برای بیکار). سیستم‌های مختلف - بیمه در برابر رفاه اجتماعی. قوانین واجب‌التحصیل مختلف.',
        language: 'text'
      }
    ]
  },

  {
    id: 'wiso-exam-10',
    type: 'WISO',
    title: 'WISO Exam Questions 28-30',
    subtitle: 'Real IHK Exam Questions',
    level: 'Prüfung',
    order: 310,
    sections: [
      {
        headingDe: 'Question 28: Inheritance & Gifts Tax (Erbschaft- & Schenkungssteuer)',
        headingFa: 'سوال 28: مالیات وراثت و هدیه',
        contentDe: 'Inheritance and gift taxes apply when receiving money/assets. Tax-free allowances exist (children: €400k, spouses: €500k). Rates scale with relationship and amount inherited.',
        contentFa: 'مالیات وراثت و هدیه هنگام دریافت پول/داراییی اعمال می‌شود. معافیت‌های بدون مالیات وجود دارد (کودکان: 400k یورو، همسران: 500k یورو). نرخ‌ها بر اساس رابطه و میزان میراث تعیین می‌شود.',
        language: 'text'
      },
      {
        headingDe: 'Question 29: VAT / Mehrwertsteuer (MwSt)',
        headingFa: 'سوال 29: مالیات بر ارزش افزوده (MwSt)',
        contentDe: 'Standard VAT in Germany: 19%. Reduced rate: 7% (food, books, medicines). VAT registered businesses collect & remit tax. Small businesses (<€22k) often exempt.',
        contentFa: 'مالیات بر ارزش افزوده استاندارد در آلمان: ۱۹٪. نرخ کاهش یافته: ۷٪ (غذا، کتاب، دارو). کسب‌وکارهای ثبت‌شده VAT جمع‌آوری و پرداخت مالیات می‌کنند. کسب‌وکارهای کوچک (<22k یورو) اغلب معاف.',
        language: 'text'
      },
      {
        headingDe: 'Question 30: Social Market Economy (Soziale Marktwirtschaft)',
        headingFa: 'سوال 30: اقتصاد بازار اجتماعی',
        contentDe: 'Germany\'s model: Market economy with social safeguards. Competition drives innovation & efficiency, but state regulates to protect workers, environment, consumers. Balance between freedom and protection.',
        contentFa: 'مدل آلمان: اقتصاد بازار با حمایت‌های اجتماعی. رقابت نوآوری و کارایی را هدایت می‌کند، اما دولت برای حفاظت از کارگران، محیط، مصرف‌کنندگان تنظیم می‌کند. تعادل بین آزادی و حمایت.',
        language: 'text'
      }
    ]
  },

  // --- PRÜFUNGSSIMULATION SECTION ---
  {
    id: 'pruef-001',
    type: 'PRUEF',
    title: 'Lineare und Binäre Suche',
    subtitle: 'Such-Algorithmen verstehen',
    level: 'Masterfile',
    order: 1,
    sections: [
      {
        headingDe: 'Teil a – Lineare Suche',
        headingFa: 'بخش الف – جستجوی خطی',
        contentDe: 'Lineare Suche durchläuft ein Array Element für Element, bis der Wert gefunden wird oder das Ende erreicht ist. Sie funktioniert auf unsortierten Arrays.',
        contentFa: 'جستجوی خطی آرایه را عنصر به عنصر پیمایش می‌کند تا مقدار پیدا شود یا به انتهای آرایه برسد. در آرایه‌های نامرتب کار می‌کند.',
        codeSnippet: `funktion lineareSuche(A: Array von Integer, x: Integer): Integer
    für i = 0 bis A.length - 1
        wenn A[i] = x dann
            rückgabe i
        ende wenn
    ende für
    rückgabe -1
endfunktion`,
        language: 'pseudo'
      },
      {
        headingDe: 'Teil b – Binäre Suche',
        headingFa: 'بخش ب – جستجوی دودویی',
        contentDe: 'Binäre Suche halbiert bei jedem Schritt den Suchbereich, indem sie die Mitte überprüft. Dies funktioniert nur auf sortierten Arrays und ist sehr effizient: O(log n).',
        contentFa: 'جستجوی دودویی در هر مرحله فضای جستجو را نصف می‌کند. فقط روی آرایه‌های مرتب کار می‌کند و بسیار کارآمد است: O(log n).',
        codeSnippet: `funktion binaereSuche(A: Array von Integer, x: Integer): Integer
    links = 0
    rechts = A.length - 1
    während links <= rechts
        mitte = (links + rechts) div 2
        wenn A[mitte] = x dann
            rückgabe mitte
        sonst wenn A[mitte] < x dann
            links = mitte + 1
        sonst
            rechts = mitte - 1
        ende wenn
    ende während
    rückgabe -1
endfunktion`,
        language: 'pseudo'
      },
      {
        headingDe: 'Teil c – Vergleich',
        headingFa: 'بخش ج – مقایسه',
        contentDe: 'Lineare Suche: O(n), funktioniert überall. Binäre Suche: O(log n), nur auf sortierten Daten. Für große Datenmengen ist binäre Suche deutlich schneller.',
        contentFa: 'جستجوی خطی: O(n)، همه جا کار می‌کند. جستجوی دودویی: O(log n)، فقط روی داده‌های مرتب. برای حجم بزرگ داده‌ها جستجوی دودویی خیلی سریع‌تر است.',
        codeSnippet: `Zeitkomplexität:
- Lineare Suche: O(n) im Worst Case
- Binäre Suche: O(log n) im Worst Case`,
        language: 'text'
      }
    ]
  },

  {
    id: 'pruef-002',
    type: 'PRUEF',
    title: 'Sortieralgorithmen',
    subtitle: 'Bubble Sort & Insertion Sort',
    level: 'Masterfile',
    order: 2,
    sections: [
      {
        headingDe: 'Teil a – Bubble Sort',
        headingFa: 'بخش الف – بابل‌سورت',
        contentDe: 'Bubble Sort vergleicht benachbarte Elemente und vertauscht sie, wenn sie in falscher Reihenfolge sind. Nach jedem Durchgang „blubbern" die größten Elemente nach oben. Zeitkomplexität: O(n²).',
        contentFa: 'بابل‌سورت عناصر کنار هم را مقایسه و جابه‌جا می‌کند. بزرگ‌ترین عناصر در هر دور به سمت انتهای آرایه می‌روند. مرتبهٔ زمانی: O(n²).',
        codeSnippet: `funktion bubbleSort(A: Array von Integer): void
    n = A.length
    für i = 0 bis n - 2
        für j = 0 bis n - 2 - i
            wenn A[j] > A[j + 1] dann
                temp = A[j]
                A[j] = A[j + 1]
                A[j + 1] = temp
            ende wenn
        ende für
    ende für
endfunktion`,
        language: 'pseudo'
      },
      {
        headingDe: 'Teil b – Insertion Sort',
        headingFa: 'بخش ب – درج‌سورت',
        contentDe: 'Insertion Sort teilt das Array in einen sortierten (links) und unsortierten (rechts) Teil. Es nimmt ein Element aus dem unsortierten Teil und fügt es an der richtigen Stelle im sortierten Teil ein. Effizient für kleine oder teilweise sortierte Daten.',
        contentFa: 'درج‌سورت آرایه را به دو بخش مرتب و نامرتب تقسیم می‌کند. عنصری را از بخش نامرتب برمی‌دارد و در جای درست خودش درج می‌کند. برای داده‌های کوچک یا تقریباً مرتب بسیار کارآمد است.',
        codeSnippet: `funktion insertionSort(A: Array von Integer): void
    n = A.length
    für i = 1 bis n - 1
        key = A[i]
        j = i - 1
        während j >= 0 und A[j] > key
            A[j + 1] = A[j]
            j = j - 1
        ende während
        A[j + 1] = key
    ende für
endfunktion`,
        language: 'pseudo'
      },
      {
        headingDe: 'Teil c – Vergleich',
        headingFa: 'بخش ج – مقایسه',
        contentDe: 'Beide: O(n²) im Worst Case. Insertion Sort ist in der Praxis schneller und gut für teilweise sortierte Daten. Bubble Sort ist einfach, aber nicht optimal für real-world Anwendungen.',
        contentFa: 'هر دو: O(n²) در بدترین حالت. درج‌سورت در عمل سریع‌تر و برای داده‌های تقریباً مرتب خوب است. بابل‌سورت ساده است اما برای برنامه‌های واقعی بهینه نیست.',
        codeSnippet: `Komplexität vergleichen:
- Bubble Sort: Einfach, aber langsam O(n²)
- Insertion Sort: Schneller O(n²), besser für kleine Daten`,
        language: 'text'
      }
    ]
  },

  {
    id: 'pruef-003',
    type: 'PRUEF',
    title: 'Datenanalyse & Grundalgorithmen',
    subtitle: 'Mittelwert, Duplikate, Zinseszins',
    level: 'Masterfile',
    order: 3,
    sections: [
      {
        headingDe: 'Teil a – Mittelwert berechnen',
        headingFa: 'بخش الف – محاسبهٔ میانگین',
        contentDe: 'Der Mittelwert ist die Summe aller Werte geteilt durch die Anzahl der Werte. Wichtig: Division durch 0 abfangen!',
        contentFa: 'میانگین، مجموع تمام مقادیر تقسیم بر تعداد آن‌ها است. مهم: جلوگیری از تقسیم بر صفر!',
        codeSnippet: `funktion berechneMittelwert(werte: Array von Integer): Double
    summe = 0
    für i = 0 bis werte.length - 1
        summe = summe + werte[i]
    ende für
    wenn werte.length = 0 dann
        rückgabe 0.0
    sonst
        rückgabe summe / werte.length
    ende wenn
endfunktion`,
        language: 'pseudo'
      },
      {
        headingDe: 'Teil b – Duplikate entfernen',
        headingFa: 'بخش ب – حذف تکرار‌ها',
        contentDe: 'Iteriere durch das Original-Array und kopiere jedes Element nur dann in ein neues Array, wenn es dort noch nicht vorhanden ist.',
        contentFa: 'در آرایهٔ اصلی پیمایش کنید و هر عنصری را فقط اگر قبلاً در آرایهٔ جدید نبود، کپی کنید.',
        codeSnippet: `funktion entferneDuplikate(A: Array von Integer): Array von Integer
    neuesArray = leeres Array
    für i = 0 bis A.length - 1
        vorhanden = falsch
        für j = 0 bis neuesArray.length - 1
            wenn neuesArray[j] = A[i] dann
                vorhanden = wahr
            ende wenn
        ende für
        wenn vorhanden = falsch dann
            neuesArray = neuesArray + A[i]
        ende wenn
    ende für
    rückgabe neuesArray
endfunktion`,
        language: 'pseudo'
      },
      {
        headingDe: 'Teil c – Zinseszinsberechnung',
        headingFa: 'بخش ج – محاسبهٔ سود مرکب',
        contentDe: 'Formel: K_n = K_0 × (1 + p/100)^n. Implementiert als Schleife: in jedem Jahr wird das aktuelle Kapital mit dem Zinsfaktor multipliziert.',
        contentFa: 'فرمول: K_n = K_0 × (1 + p/100)^n. در هر سال سرمایهٔ فعلی در فاکتور ضرب می‌شود.',
        codeSnippet: `funktion berechneZinseszins(K0: Double, p: Double, n: Integer): Double
    faktor = 1 + (p / 100)
    ergebnis = K0
    für i = 1 bis n
        ergebnis = ergebnis * faktor
    ende für
    rückgabe ergebnis
endfunktion`,
        language: 'pseudo'
      }
    ]
  },

  {
    id: 'pruef-004',
    type: 'PRUEF',
    title: 'Rekursion & Dateibaum-Kopie',
    subtitle: 'Rekursive Verzeichnis-Navigation',
    level: 'Masterfile',
    order: 4,
    sections: [
      {
        headingDe: 'Teil a – Rekursive Dateibaum-Kopie',
        headingFa: 'بخش الف – کپی بازگشتی درخت فایل',
        contentDe: 'Für jede Datei: kopieren. Für jede Unterordner: rekursiv aufrufen. Dies funktioniert bis zur letzten Ebene der Ordnerstruktur.',
        contentFa: 'برای هر فایل: کپی کنید. برای هر زیرپوشه: دوباره همین تابع را صدا کنید. این تا آخرین سطح پوشه‌ها ادامه پیدا می‌کند.',
        codeSnippet: `prozedur kopiereVerzeichnis(quelle: String, ziel: String)
    liste = listeDerEintraege(quelle)
    für jeden eintrag in liste
        wenn istDatei(eintrag) dann
            kopiereDatei(eintrag, ziel + "/" + nameVon(eintrag))
        sonst
            neuesZiel = ziel + "/" + nameVon(eintrag)
            erzeugeVerzeichnis(neuesZiel)
            kopiereVerzeichnis(eintrag, neuesZiel)
        ende wenn
    ende für
endprozedur`,
        language: 'pseudo'
      },
      {
        headingDe: 'Teil b – Vor- und Nachteile der Rekursion',
        headingFa: 'بخش ب – مزایا و معایب بازگشت',
        contentDe: 'Vorteil: Kürzer, eleganter, natürlich für baumähnliche Strukturen. Nachteil: Speicher auf dem Stack, Stackoverflow bei sehr tiefen Rekursionen, oft langsamer als iterativ.',
        contentFa: 'مزیت: کوتاه‌تر، ظریف‌تر، برای ساختار‌های شبه‌درخت طبیعی است. معایب: استفادهٔ بیشتر حافظهٔ پشته، خطر سرریز پشته در عمق زیاد، اغلب کندتر از روش تکراری.',
        codeSnippet: `Vorteile:
- Elegant und kürzere Codes
- Natürlich für Bäume & Graphen

Nachteile:
- Stack-Overflow bei zu tierer Rekursion
- Mehr Speicherbedarf
- Oft langsamer als iterativ`,
        language: 'text'
      }
    ]
  },

  {
    id: 'pruef-005',
    type: 'PRUEF',
    title: 'Backup-Planung & Authentifizierung',
    subtitle: 'Systematische Datensicherung & Zugriffskontrolle',
    level: 'Masterfile',
    order: 5,
    sections: [
      {
        headingDe: 'Teil a – Backup-Planung',
        headingFa: 'بخش الف – برنامه‌ریزی پشتیبان',
        contentDe: 'Regelmäßige Backups mit festem Intervall (z.B. alle 3 Tage). Einfache Schleife: Start + Intervall × Anzahl der Iterationen.',
        contentFa: 'پشتیبان‌های منظم با بازهٔ ثابت (مثلاً هر ۳ روز). حلقهٔ ساده: شروع + فاصله × تعداد تکرار.',
        codeSnippet: `prozedur planeBackups(startTag: Integer, intervall: Integer)
    tag = startTag
    während tag <= startTag + 30
        ausgabe("Backup an Tag " + tag)
        tag = tag + intervall
    ende während
endprozedur`,
        language: 'pseudo'
      },
      {
        headingDe: 'Teil b – Benutzerauthentifizierung',
        headingFa: 'بخش ب – احراز هویت کاربر',
        contentDe: 'Einfaches System: Benutzername & Passwort vergleichen. Maximale Versuche für Sicherheit (z.B. 3 Versuche). Nach Fehlversuchen: Sperre.',
        contentFa: 'سیستم ساده: نام و رمز را مقایسه کنید. حداکثر تلاش برای امنیت (مثلاً ۳ بار). بعد از تلاش‌های ناموفق: مسدود شود.',
        codeSnippet: `prozedur authentifiziereBenutzer()
    gespeicherterName = "admin"
    gespeichertesPasswort = "geheim"
    versuche = 0
    maxVersuche = 3
    während versuche < maxVersuche
        eingabeBenutzer = liesEingabe("Benutzername: ")
        eingabePasswort = liesEingabe("Passwort: ")
        wenn eingabeBenutzer = gespeicherterName
           und eingabePasswort = gespeichertesPasswort dann
            ausgabe("Zugang gewährt")
            rückkehr
        sonst
            ausgabe("Zugang verweigert")
            versuche = versuche + 1
        ende wenn
    ende während
    ausgabe("Zu viele Versuche – Gesperrt!")
endprozedur`,
        language: 'pseudo'
      }
    ]
  },

  {
    id: 'pruef-006',
    type: 'PRUEF',
    title: 'Reguläre Ausdrücke – Email-Validierung',
    subtitle: 'Pattern Matching & Regex Basics',
    level: 'Masterfile',
    order: 6,
    sections: [
      {
        headingDe: 'Teil a – E-Mail Validierung mit RegEx',
        headingFa: 'بخش الف – تصدیق ایمیل با RegEx',
        contentDe: 'Ein regulärer Ausdruck überprüft das Format einer E-Mail-Adresse: Benutzername (Buchstaben, Ziffern, Sonderzeichen), @-Symbol, Domain und TLD. Das Regex-Pattern beschreibt alle Bedingungen.',
        contentFa: 'یک عبارتِ منظم قالب ایمیل را بررسی می‌کند: نام کاربری (حروف، اعداد، علائم خاص)، نماد @، دامنه و پسوند دامنه. الگو تمام شرایط را توصیف می‌کند.',
        codeSnippet: `RegEx Muster:
^([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+)\\.([A-Za-z]{2,})$

Erklärung:
^ = Anfang
[A-Za-z0-9._%+-]+ = Benutzername: Buchstaben, Ziffern, Punkt, %, +, -
@ = Literal @ Zeichen
[A-Za-z0-9.-]+ = Domainname
\\. = Literal Punkt (escaped)
[A-Za-z]{2,} = TLD: mind. 2 Buchstaben
$ = Ende`,
        language: 'regex'
      },
      {
        headingDe: 'Teil b – RegEx Grundkonzepte',
        headingFa: 'بخش ب – مفاهیم بنیادی RegEx',
        contentDe: 'Character Classes: [a-z] = beliebiger Kleinbuchstabe. Quantoren: + = ein oder mehr, * = null oder mehr, ? = optional, {n,m} = n bis m Vorkommen. Anchors: ^ = Anfang, $ = Ende.',
        contentFa: 'کلاس‌های کاراکتری: [a-z] = هر حرف کوچک. کمیاتها: + = یک یا بیشتر، * = صفر یا بیشتر، ? = اختیاری، {n,m} = n تا m بار. نقاط انتهایی: ^ = شروع، $ = پایان.',
        codeSnippet: `Character Classes: [a-z], [A-Z], [0-9], [a-zA-Z0-9]
Negation: [^...] = NOT
Quantoren: +, *, ?, {n}, {n,m}
Anchors: ^, $
Whitespace: \\s, \\S, \\d, \\w`,
        language: 'regex'
      }
    ]
  }
];
