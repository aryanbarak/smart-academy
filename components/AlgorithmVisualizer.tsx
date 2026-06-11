import React, { useState, useEffect, useRef, useCallback } from 'react';

type AlgoType = 'bubble' | 'selection' | 'insertion';

interface BarState {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
}

interface Step {
  bars: BarState[];
  description: string;
  descriptionFa: string;
  comparisons: number;
  swaps: number;
}

const INITIAL_ARRAYS: Record<string, number[]> = {
  small: [5, 3, 8, 1, 9, 2, 7, 4, 6],
  medium: [12, 4, 17, 1, 15, 8, 3, 10, 6, 14],
};

function buildBubbleSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const sorted = new Set<number>();

  const snap = (bars: BarState[], desc: string, descFa: string): void => {
    steps.push({ bars: bars.map(b => ({ ...b })), description: desc, descriptionFa: descFa, comparisons, swaps });
  };

  const makeBase = (): BarState[] =>
    a.map((v, i) => ({ value: v, state: sorted.has(i) ? 'sorted' : 'default' } as BarState));

  snap(makeBase(), 'Start: unsortiertes Array', 'شروع: آرایه مرتب‌نشده');

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      const bars = makeBase();
      bars[j].state = 'comparing';
      bars[j + 1].state = 'comparing';
      snap(bars, `Vergleiche a[${j}]=${a[j]} mit a[${j+1}]=${a[j+1]}`, `مقایسه a[${j}]=${a[j]} با a[${j+1}]=${a[j+1]}`);

      if (a[j] > a[j + 1]) {
        swaps++;
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        const b2 = makeBase();
        b2[j].state = 'swapping';
        b2[j + 1].state = 'swapping';
        snap(b2, `Tausch: a[${j}] ↔ a[${j+1}]`, `جابجایی: a[${j}] ↔ a[${j+1}]`);
      }
    }
    sorted.add(a.length - 1 - i);
    const bSorted = makeBase();
    bSorted[a.length - 1 - i].state = 'sorted';
    snap(bSorted, `Durchgang ${i+1} abgeschlossen — letztes Element sortiert`, `دور ${i+1} تمام شد — آخرین عنصر مرتب شد`);
  }
  sorted.add(0);
  snap(makeBase(), 'Fertig! Array vollständig sortiert ✓', 'تمام! آرایه کامل مرتب شد ✓');
  return steps;
}

function buildSelectionSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const sorted = new Set<number>();

  const snap = (bars: BarState[], desc: string, descFa: string) =>
    steps.push({ bars: bars.map(b => ({ ...b })), description: desc, descriptionFa: descFa, comparisons, swaps });

  const makeBase = (): BarState[] =>
    a.map((v, i) => ({ value: v, state: sorted.has(i) ? 'sorted' : 'default' } as BarState));

  snap(makeBase(), 'Start: unsortiertes Array', 'شروع: آرایه مرتب‌نشده');

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      const bars = makeBase();
      bars[minIdx].state = 'pivot';
      bars[j].state = 'comparing';
      snap(bars, `Suche Minimum: a[${j}]=${a[j]} vs. aktuelles Min a[${minIdx}]=${a[minIdx]}`,
        `جستجوی مینیمم: a[${j}]=${a[j]} با مینیمم فعلی a[${minIdx}]=${a[minIdx]}`);
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      swaps++;
      const b = makeBase();
      b[i].state = 'swapping';
      b[minIdx].state = 'swapping';
      snap(b, `Tausch: Minimum a[${minIdx}]=${a[minIdx]} an Position ${i}`, `جابجایی: مینیمم a[${minIdx}]=${a[minIdx]} به موقعیت ${i}`);
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
    sorted.add(i);
    snap(makeBase(), `Position ${i} fixiert: a[${i}]=${a[i]} ✓`, `موقعیت ${i} ثابت شد: a[${i}]=${a[i]} ✓`);
  }
  sorted.add(a.length - 1);
  snap(makeBase(), 'Fertig! Array vollständig sortiert ✓', 'تمام! آرایه کامل مرتب شد ✓');
  return steps;
}

function buildInsertionSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;

  const snap = (bars: BarState[], desc: string, descFa: string) =>
    steps.push({ bars: bars.map(b => ({ ...b })), description: desc, descriptionFa: descFa, comparisons, swaps });

  snap(a.map(v => ({ value: v, state: 'default' } as BarState)), 'Start: unsortiertes Array', 'شروع: آرایه مرتب‌نشده');

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    const pickBars: BarState[] = a.map((v, idx) => ({ value: v, state: idx < i ? 'sorted' : 'default' } as BarState));
    pickBars[i].state = 'comparing';
    snap(pickBars, `Schlüssel = a[${i}]=${key} — wird in den sortierten Teil eingefügt`, `کلید = a[${i}]=${key} — در بخش مرتب شده درج می‌شود`);

    while (j >= 0 && a[j] > key) {
      comparisons++;
      swaps++;
      a[j + 1] = a[j];
      const bars: BarState[] = a.map((v, idx) => ({ value: v, state: idx <= i ? 'sorted' : 'default' } as BarState));
      bars[j].state = 'swapping';
      bars[j + 1].state = 'swapping';
      snap(bars, `Verschiebe a[${j}]=${a[j]} nach rechts`, `a[${j}]=${a[j]} را به راست جابجا کن`);
      j--;
    }
    a[j + 1] = key;
    const after: BarState[] = a.map((v, idx) => ({ value: v, state: idx <= i ? 'sorted' : 'default' } as BarState));
    snap(after, `${key} an Position ${j+1} eingefügt ✓`, `${key} در موقعیت ${j+1} درج شد ✓`);
  }
  snap(a.map(v => ({ value: v, state: 'sorted' } as BarState)), 'Fertig! Array vollständig sortiert ✓', 'تمام! آرایه کامل مرتب شد ✓');
  return steps;
}

const ALGO_INFO: Record<AlgoType, { name: string; nameFa: string; best: string; avg: string; worst: string; space: string; color: string }> = {
  bubble:    { name: 'BubbleSort',    nameFa: 'مرتب‌سازی حبابی',    best: 'O(n)',  avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', color: 'blue' },
  selection: { name: 'SelectionSort', nameFa: 'مرتب‌سازی انتخابی',  best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', color: 'purple' },
  insertion: { name: 'InsertionSort', nameFa: 'مرتب‌سازی درجی',     best: 'O(n)',  avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', color: 'emerald' },
};

const BAR_COLORS: Record<BarState['state'], string> = {
  default:   'bg-blue-400 dark:bg-blue-500',
  comparing: 'bg-amber-400',
  swapping:  'bg-red-500',
  sorted:    'bg-emerald-500',
  pivot:     'bg-purple-500',
};

interface Props { defaultAlgo?: AlgoType }

const AlgorithmVisualizer: React.FC<Props> = ({ defaultAlgo = 'bubble' }) => {
  const [algo, setAlgo] = useState<AlgoType>(defaultAlgo);
  const [arraySize, setArraySize] = useState<'small' | 'medium'>('small');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600); // ms per step
  const [customArr, setCustomArr] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildSteps = useCallback((a: AlgoType, arr: number[]) => {
    if (a === 'bubble') return buildBubbleSteps(arr);
    if (a === 'selection') return buildSelectionSteps(arr);
    return buildInsertionSteps(arr);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const arr = useCustom
      ? customArr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 100)
      : INITIAL_ARRAYS[arraySize];
    const s = buildSteps(algo, arr.length > 0 ? arr : INITIAL_ARRAYS[arraySize]);
    setSteps(s);
    setCurrentStep(0);
  }, [algo, arraySize, buildSteps, useCustom, customArr]);

  useEffect(() => { reset(); }, [algo, arraySize]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, steps.length, speed]);

  const step = steps[currentStep];
  if (!step) return null;

  const maxVal = Math.max(...step.bars.map(b => b.value));
  const info = ALGO_INFO[algo];
  const accentColor = info.color === 'blue' ? 'text-blue-600' : info.color === 'purple' ? 'text-purple-600' : 'text-emerald-600';
  const accentBg = info.color === 'blue' ? 'bg-blue-600' : info.color === 'purple' ? 'bg-purple-600' : 'bg-emerald-600';

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Algorithm Visualizer
          </h3>
          <p className="text-xs text-slate-500 font-farsi">نمایش گام‌به‌گام الگوریتم‌های مرتب‌سازی</p>
        </div>
        {/* Algo selector */}
        <div className="flex gap-1 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
          {(['bubble', 'selection', 'insertion'] as AlgoType[]).map(a => (
            <button key={a} onClick={() => setAlgo(a)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${algo === a ? `${accentBg} text-white shadow` : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}>
              {ALGO_INFO[a].name}
            </button>
          ))}
        </div>
      </div>

      {/* Complexity badge row */}
      <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">{info.name}</span>
        <span className="font-farsi text-slate-500">{info.nameFa}</span>
        <div className="flex gap-2 ml-auto">
          {[['Best', info.best], ['Avg', info.avg], ['Worst', info.worst], ['Space', info.space]].map(([label, val]) => (
            <span key={label} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <span className="opacity-60">{label}: </span><span className="font-mono font-semibold">{val}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Visualization area */}
      <div className="px-5 py-6 bg-slate-50 dark:bg-slate-950">
        <div className="flex items-end justify-center gap-1.5 h-40">
          {step.bars.map((bar, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">{bar.value}</span>
              <div
                className={`w-full rounded-t-sm transition-all duration-200 algo-bar ${BAR_COLORS[bar.state]}`}
                style={{ height: `${Math.max(8, (bar.value / maxVal) * 120)}px` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-3 border-t border-b border-slate-100 dark:border-slate-800 min-h-[56px] flex flex-col gap-1">
        <p className="text-sm text-slate-800 dark:text-slate-200">{step.description}</p>
        <p className="text-xs text-slate-500 font-farsi text-right" dir="rtl">{step.descriptionFa}</p>
      </div>

      {/* Legend */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 flex gap-4 flex-wrap text-xs text-slate-500">
        {[['bg-blue-400', 'Standard'], ['bg-amber-400', 'Vergleich'], ['bg-red-500', 'Tausch'], ['bg-emerald-500', 'Sortiert'], ['bg-purple-500', 'Pivot/Min']].map(([cls, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${cls}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 flex gap-6 text-xs text-slate-600 dark:text-slate-400">
        <span>Schritt: <span className="font-semibold text-slate-900 dark:text-slate-100">{currentStep + 1}/{steps.length}</span></span>
        <span>Vergleiche: <span className="font-semibold text-amber-600">{step.comparisons}</span></span>
        <span>Tausche: <span className="font-semibold text-red-500">{step.swaps}</span></span>
      </div>

      {/* Controls */}
      <div className="px-5 py-4 flex flex-wrap items-center gap-3">
        {/* Step back */}
        <button onClick={() => setCurrentStep(p => Math.max(0, p - 1))} disabled={currentStep === 0}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button onClick={() => {
            if (currentStep >= steps.length - 1) { setCurrentStep(0); }
            setIsPlaying(p => !p);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors ${accentBg}`}>
          {isPlaying ? (
            <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>Pause</>
          ) : (
            <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Play</>
          )}
        </button>

        {/* Step forward */}
        <button onClick={() => setCurrentStep(p => Math.min(steps.length - 1, p + 1))} disabled={currentStep >= steps.length - 1}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Reset */}
        <button onClick={reset} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Reset">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Speed */}
        <div className="flex items-center gap-2 ml-auto text-xs text-slate-500">
          <span>Schnell</span>
          <input type="range" min={100} max={1200} step={100} value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-20 accent-blue-500" />
          <span>Langsam</span>
        </div>

        {/* Array size */}
        <select value={arraySize} onChange={e => setArraySize(e.target.value as 'small' | 'medium')}
          className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <option value="small">9 Elemente</option>
          <option value="medium">10 Elemente</option>
        </select>
      </div>

      {/* Custom array */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <input type="text" placeholder="Eigene Zahlen: 5,3,8,1,9 (max 15)"
          value={customArr} onChange={e => setCustomArr(e.target.value)}
          className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
        />
        <button onClick={() => { setUseCustom(true); setTimeout(reset, 0); }}
          className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
          Anwenden
        </button>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
