import React, { useEffect, useRef, useState } from 'react';

// Lightweight PDF editor using pdfjs-dist for rendering and pdf-lib for export
// Features (v1): view pages, zoom, navigate, freehand drawing annotations per page, save annotated PDF

interface PdfEditorProps {
  url: string;
  onClose?: () => void;
}

const PdfEditor: React.FC<PdfEditorProps> = ({ url, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfModule, setPdfModule] = useState<any>(null);
  const [pdfLib, setPdfLib] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [loadErrorMsg, setLoadErrorMsg] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0); // index into pagesOrder
  const [scale, setScale] = useState(1.5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#ff0000');
  const [lineWidth, setLineWidth] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ pageNum: number; text: string }>>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [highlightMatches, setHighlightMatches] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [continuous, setContinuous] = useState(() => {
    try {
      const v = localStorage.getItem('fiae_pdf_continuous');
      return v ? v === 'true' : true; // default to continuous
    } catch {
      return true;
    }
  });
  const [thumbsOpen, setThumbsOpen] = useState(true);
  const [gotoInput, setGotoInput] = useState<string>('');

  // pagesOrder holds either number (original page 1-based) or 'blank'
  const [pagesOrder, setPagesOrder] = useState<Array<number | 'blank'>>([]);

  // overlays images per page index (1-based original or 'blank' index mapping)
  const overlays = useRef<Record<number, string | null>>({});
  // texts per page (store drawing text objects)
  const texts = useRef<Record<number, { x: number; y: number; text: string; size: number; color: string }[]>>({});
  // redactions per page (rectangles)
  const redactions = useRef<Record<number, { x: number; y: number; w: number; h: number }[]>>({});

  // active tool: 'pan' | 'draw' | 'text' | 'redact'
  const [tool, setTool] = useState<'pan' | 'draw' | 'text' | 'redact'>('pan');
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPos, setTextPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    // Reset state when URL changes
    setIsLoading(true);
    setLoadProgress(0);
    setPdfDoc(null);
    setLoadErrorMsg(null);
    setPagesOrder([]);
    setPageIndex(0);
    
    (async () => {
      try {
        console.debug('[PdfEditor] loading pdfjs and pdf-lib for url', url);
        setLoadProgress(10);
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
        // Import worker as module instead of external URL for offline support
        const pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.min.js?url');
        (pdfjs as any).GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
        console.debug('[PdfEditor] worker configured for offline use');
        setLoadProgress(30);
        const pl = await import('pdf-lib');
        if (!mounted) return;
        setPdfModule(pdfjs);
        setPdfLib(pl);
        setLoadProgress(50);

        const loadingTask = (pdfjs as any).getDocument(url);
        loadingTask.onProgress = (progress: any) => {
          const percent = progress.total > 0 ? Math.round((progress.loaded / progress.total) * 40) : 0;
          setLoadProgress(50 + percent);
        };
        const doc = await loadingTask.promise;
        if (!mounted) return;
        setLoadProgress(95);
        console.debug('[PdfEditor] loaded pdf document', { numPages: doc?.numPages });
        if (!doc || !doc.numPages || doc.numPages === 0) {
          setLoadErrorMsg('PDF konnte nicht geladen werden oder enthält keine Seiten.');
          setPdfDoc(null);
          setNumPages(0);
          setPagesOrder([]);
          setIsLoading(false);
          return;
        }
        // Clear any previous error
        setLoadErrorMsg(null);
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        // initialize pagesOrder
        setPagesOrder(Array.from({ length: doc.numPages }, (_, i) => i + 1));
        setLoadProgress(100);
        setIsLoading(false);
        console.debug('[PdfEditor] ✅ PDF ready! Pages:', doc.numPages);
      } catch (err: any) {
        console.error('[PdfEditor] error loading PDF or libs', err);
        setLoadErrorMsg(String(err?.message || err));
        setPdfDoc(null);
        setNumPages(0);
        setPagesOrder([]);
        setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [url]);

  useEffect(() => {
    // render current page
    try {
      renderCurrentPage();
    } catch (e) {
      console.error('[PdfEditor] renderCurrentPage failed', e);
      setLoadErrorMsg('Fehler beim Rendern der Seite.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, pageIndex, scale, pagesOrder]);

  // Auto fit to width on small screens for better readability
  useEffect(() => {
    const isSmall = window.innerWidth < 768;
    if (!isSmall) return;
    const doFit = async () => {
      const container = containerRef.current;
      if (!container || !pdfDoc || pagesOrder.length === 0) return;
      const mapping = pagesOrder[pageIndex];
      const pageNum = mapping === 'blank' ? 1 : (mapping as number);
      try {
        const page = await pdfDoc.getPage(pageNum);
        const baseViewport = page.getViewport({ scale: 1 });
        const containerWidth = container.clientWidth - 24; // padding
        if (baseViewport.width > 0 && containerWidth > 0) {
          const computedScale = containerWidth / baseViewport.width;
          setScale(Math.max(0.85, Math.min(3, +computedScale.toFixed(2))));
        }
      } catch (e) {
        // ignore
      }
    };
    // try after initial render
    const t = setTimeout(doFit, 300);
    window.addEventListener('resize', doFit);
    return () => { clearTimeout(t); window.removeEventListener('resize', doFit); };
  }, [pdfDoc, pageIndex]);

  // Basic pinch-zoom support for touch devices
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let initialDistance = 0;
    let initialScale = scale;

    const getDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx*dx + dy*dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
        initialScale = scale;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance > 0) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const factor = currentDistance / initialDistance;
        const newScale = Math.max(0.6, Math.min(3, +(initialScale * factor).toFixed(2)));
        setScale(newScale);
      }
    };
    const onTouchEnd = () => {
      initialDistance = 0;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart as any);
      el.removeEventListener('touchmove', onTouchMove as any);
      el.removeEventListener('touchend', onTouchEnd as any);
      el.removeEventListener('touchcancel', onTouchEnd as any);
    };
  }, [scale]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with text input
      if (showTextInput || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      // Page navigation
      if (e.key === ' ') {
        e.preventDefault();
        if (e.shiftKey) {
          // Shift+Space: Previous page
          setPageIndex(prev => Math.max(0, prev - 1));
        } else {
          // Space: Next page
          setPageIndex(prev => Math.min(pagesOrder.length - 1, prev + 1));
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setPageIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setPageIndex(prev => Math.min(pagesOrder.length - 1, prev + 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setPageIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setPageIndex(pagesOrder.length - 1);
      }
      // F key for fullscreen
      else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        const container = document.querySelector('.pdf-viewer-container') as HTMLElement;
        if (container) {
          if (!document.fullscreenElement) {
            container.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }
      }
      // Escape to close fullscreen (handled by browser by default, but we can also trigger onClose)
      else if (e.key === 'Escape' && !document.fullscreenElement && onClose) {
        onClose();
      }
      // Ctrl+F for search
      else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pagesOrder.length, showTextInput, onClose]);

  // Mouse wheel to navigate pages (smooth UX for scrolling)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // If content is scrollable vertically, allow default scrolling
      const canScroll = el.scrollHeight > el.clientHeight;
      if (canScroll) return;
      // Otherwise, map wheel to page navigation
      if (e.deltaY > 0) {
        setPageIndex(prev => Math.min(pagesOrder.length - 1, prev + 1));
      } else if (e.deltaY < 0) {
        setPageIndex(prev => Math.max(0, prev - 1));
      }
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel as any);
  }, [pagesOrder.length]);

  const renderCurrentPage = async () => {
    if (!pdfDoc || !canvasRef.current) return;
    if (!pagesOrder || pagesOrder.length === 0) {
      // nothing to render
      return;
    }
    const mapping = pagesOrder[pageIndex];
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const ctx = canvas.getContext('2d')!;
    if (mapping === 'blank') {
      // render white page
      const w = Math.floor(595 * scale); // A4 approx 595x842 at 72dpi
      const h = Math.floor(842 * scale);
      canvas.width = w; canvas.height = h;
      canvas.style.width = `${w / scale}px`;
      canvas.style.height = `${h / scale}px`;
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
      if (overlay) { overlay.width = w; overlay.height = h; overlay.style.width = canvas.style.width; overlay.style.height = canvas.style.height; }
      restoreOverlayForIndex(pageIndex);
      return;
    }

    const pageNum = mapping as number;
    const pdfPage = await pdfDoc.getPage(pageNum);
    const viewport = pdfPage.getViewport({ scale });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    if (overlay) {
      overlay.width = canvas.width; overlay.height = canvas.height;
      overlay.style.width = canvas.style.width; overlay.style.height = canvas.style.height;
    }
    await pdfPage.render({ canvasContext: ctx, viewport }).promise;
    console.log('✅ Page rendered successfully! Canvas size:', canvas.width, 'x', canvas.height);
    restoreOverlayForIndex(pageIndex);

    // Draw search highlights on the current page (single-page mode)
    try {
      if (highlightMatches && searchQuery.trim()) {
        const textContent: any = await pdfPage.getTextContent();
        const q = searchQuery.toLowerCase();
        const items = textContent.items || [];
        const transforms = textContent.styles || {};
        const ctx2 = overlayRef.current?.getContext('2d');
        if (ctx2 && overlayRef.current) {
          // Ensure overlay matches canvas size
          overlayRef.current.width = canvas.width;
          overlayRef.current.height = canvas.height;
          ctx2.save();
          ctx2.globalAlpha = 0.25;
          ctx2.fillStyle = '#fbbf24'; // amber
          items.forEach((item: any) => {
            const str = String(item.str || '');
            if (!str) return;
            const lower = str.toLowerCase();
            const pos = lower.indexOf(q);
            if (pos >= 0) {
              // Approximate bounding box based on transform
              const tx = item.transform || item.textMatrix || [1,0,0,1,0,0];
              const x = tx[4];
              const y = tx[5];
              const fontSize = Math.abs(tx[3] || 12);
              const width = fontSize * q.length * 0.6; // heuristic
              const height = fontSize;
              // pdf coords to canvas coords
              const ctm = viewport.transform;
              const cx = ctm[0]*x + ctm[2]*y + ctm[4];
              const cy = ctm[1]*x + ctm[3]*y + ctm[5];
              const top = canvas.height - cy - height;
              ctx2.fillRect(cx, top, width, height);
            }
          });
          ctx2.restore();
        }
      }
    } catch (e) {
      console.warn('Search highlight failed:', e);
    }
  };

  // drawing handlers for 'draw' and click handlers for text/redact
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d')!;
    let drawing = false;
    let startX = 0, startY = 0;

    const getPos = (ev: MouseEvent) => {
      const rect = overlay.getBoundingClientRect();
      const x = (ev.clientX - rect.left) * (overlay.width / rect.width);
      const y = (ev.clientY - rect.top) * (overlay.height / rect.height);
      return { x, y };
    };

    const mdown = (e: MouseEvent) => {
      if (tool === 'draw') {
        drawing = true; const p = getPos(e); ctx.strokeStyle = drawColor; ctx.lineWidth = lineWidth; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p.x, p.y);
      } else if (tool === 'text') {
        const p = getPos(e); const left = e.clientX; const top = e.clientY; setTextPos({ left, top }); setShowTextInput(true); setTextInput('');
      } else if (tool === 'redact') {
        drawing = true; const p = getPos(e); startX = p.x; startY = p.y; ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.setLineDash([4,2]);
      }
    };

    const mmove = (e: MouseEvent) => {
      if (!overlay) return;
      const p = getPos(e);
      if (tool === 'draw' && drawing) { ctx.lineTo(p.x, p.y); ctx.stroke(); }
      if (tool === 'redact' && drawing) { // rubber-band rectangle
        renderCurrentOverlayTemp(ctx, startX, startY, p.x - startX, p.y - startY);
      }
    };

    const mup = (e: MouseEvent) => {
      if (tool === 'draw' && drawing) {
        drawing = false; overlays.current[pageIndex] = overlay.toDataURL('image/png');
      }
      if (tool === 'redact' && drawing) {
        drawing = false; ctx.setLineDash([]);
        const p = getPos(e); const rx = Math.min(startX, p.x); const ry = Math.min(startY, p.y); const rw = Math.abs(p.x - startX); const rh = Math.abs(p.y - startY);
        // store in redactions (normalized to overlay coords)
        const arr = redactions.current[pageIndex] || []; arr.push({ x: rx, y: ry, w: rw, h: rh }); redactions.current[pageIndex] = arr;
        // draw permanent filled rect
        ctx.fillStyle = '#ffffff'; ctx.fillRect(rx, ry, rw, rh); overlays.current[pageIndex] = overlay.toDataURL('image/png');
      }
    };

    overlay.addEventListener('mousedown', mdown);
    window.addEventListener('mousemove', mmove);
    window.addEventListener('mouseup', mup);
    return () => { overlay.removeEventListener('mousedown', mdown); window.removeEventListener('mousemove', mmove); window.removeEventListener('mouseup', mup); };
  }, [tool, drawColor, lineWidth, pageIndex, pagesOrder]);

  const renderCurrentOverlayTemp = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    // redraw current permanent overlay first
    restoreOverlayForIndex(pageIndex);
    ctx.save(); ctx.strokeStyle = '#000'; ctx.setLineDash([4,2]); ctx.strokeRect(x, y, w, h); ctx.restore();
  };

  const restoreOverlayForIndex = (idx: number) => {
    const overlay = overlayRef.current; if (!overlay) return; const ctx = overlay.getContext('2d')!; ctx.clearRect(0,0,overlay.width, overlay.height);
    const data = overlays.current[idx]; if (data) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0,0, overlay.width, overlay.height); img.src = data; }
    const t = texts.current[idx]; if (t && t.length) { t.forEach(tt => { ctx.fillStyle = tt.color; ctx.font = `${tt.size}px Helvetica`; ctx.fillText(tt.text, tt.x, tt.y); }); }
    const r = redactions.current[idx]; if (r && r.length) { ctx.fillStyle = '#ffffff'; r.forEach(rr => ctx.fillRect(rr.x, rr.y, rr.w, rr.h)); }
  };

  const clearOverlayForPage = (idx: number) => { const overlay = overlayRef.current; if (!overlay) return; const ctx = overlay.getContext('2d')!; ctx.clearRect(0,0,overlay.width, overlay.height); overlays.current[idx] = null; texts.current[idx] = []; redactions.current[idx] = []; };

  const addBlankPageAfter = (idx: number) => { const arr = [...pagesOrder]; arr.splice(idx+1, 0, 'blank'); setPagesOrder(arr); };
  const deletePageAt = (idx: number) => { const arr = [...pagesOrder]; arr.splice(idx,1); setPagesOrder(arr); setPageIndex(Math.max(0, Math.min(arr.length-1, pageIndex))); };
  const movePage = (from: number, to: number) => { const arr = [...pagesOrder]; const item = arr.splice(from,1)[0]; arr.splice(to,0,item); setPagesOrder(arr); setPageIndex(Math.max(0, Math.min(arr.length-1, to))); };

  const onZoom = (delta: number) => { setScale(s => Math.max(0.5, Math.min(3, +(s + delta).toFixed(2)))); };

  // Double-tap zoom for touch devices: toggle between fit-to-width and 150%
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastTap = 0;
    const onDblTap = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
        // toggle zoom levels
        setScale(prev => (prev < 1.2 ? 1.5 : 1.0));
      }
      lastTap = now;
    };
    el.addEventListener('touchend', onDblTap, { passive: false });
    return () => el.removeEventListener('touchend', onDblTap as any);
  }, []);

  // Search functionality
  const performSearch = async () => {
    if (!pdfDoc || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results: Array<{ pageNum: number; text: string }> = [];
    const query = searchQuery.toLowerCase();
    
    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        
        if (pageText.toLowerCase().includes(query)) {
          // Extract context around the match
          const lowerPageText = pageText.toLowerCase();
          const matchIndex = lowerPageText.indexOf(query);
          const start = Math.max(0, matchIndex - 40);
          const end = Math.min(pageText.length, matchIndex + query.length + 40);
          const context = pageText.substring(start, end);
          
          results.push({
            pageNum: i,
            text: (start > 0 ? '...' : '') + context + (end < pageText.length ? '...' : '')
          });
        }
      } catch (err) {
        console.error('Error searching page', i, err);
      }
    }
    
    setSearchResults(results);
  };

  const goToSearchResult = (pageNum: number) => {
    const idx = pagesOrder.findIndex(p => p === pageNum);
    if (idx !== -1) {
      setPageIndex(idx);
    }
  };

  // when adding text via input
  const commitTextAtPos = () => {
    if (!textPos) { setShowTextInput(false); return; }
    const overlay = overlayRef.current; if (!overlay) return;
    // compute overlay-local coords from screen coords
    const rect = overlay.getBoundingClientRect();
    const x = (textPos.left - rect.left) * (overlay.width / rect.width);
    const y = (textPos.top - rect.top) * (overlay.height / rect.height);
    const arr = texts.current[pageIndex] || [];
    arr.push({ x, y, text: textInput, size: Math.max(12, Math.min(36, Math.floor(14 * scale))), color: '#000000' });
    texts.current[pageIndex] = arr;
    // draw on overlay
    restoreOverlayForIndex(pageIndex);
    setShowTextInput(false);
  };

  const saveEdited = async () => {
    if (!pdfLib) return;
    const res = await fetch(url); const arrayBuffer = await res.arrayBuffer();
    const srcPdf = await pdfLib.PDFDocument.load(arrayBuffer);
    const newPdf = await pdfLib.PDFDocument.create();
    // copy pages in order, handling blanks
    const srcPages = await newPdf.copyPages(srcPdf, srcPdf.getPageIndices());
    for (let i = 0; i < pagesOrder.length; i++) {
      const item = pagesOrder[i];
      if (item === 'blank') {
        newPdf.addPage([595,842]);
        // if overlay/texts on this blank, render them
        const pageObj = newPdf.getPage(newPdf.getPageCount()-1);
        const w = pageObj.getWidth(), h = pageObj.getHeight();
        if (overlays.current[i]) {
          const pngBytes = await (await fetch(overlays.current[i]!)).arrayBuffer();
          const img = await newPdf.embedPng(pngBytes);
          pageObj.drawImage(img, { x:0, y:0, width: w, height: h });
        }
        const ts = texts.current[i] || [];
        ts.forEach(t => { pageObj.drawText(t.text, { x: t.x * (pageObj.getWidth()/ (overlayRef.current?.width||595)), y: pageObj.getHeight() - t.y * (pageObj.getHeight()/(overlayRef.current?.height||842)) - 12, size: t.size, color: pdfLib.rgb(0,0,0) }); });
      } else {
        const srcIndex = (item as number) - 1;
        const [copied] = await newPdf.copyPages(srcPdf, [srcIndex]);
        newPdf.addPage(copied);
        const pageObj = newPdf.getPage(newPdf.getPageCount()-1);
        const w = pageObj.getWidth(), h = pageObj.getHeight();
        // overlay image
        const ov = overlays.current[i];
        if (ov) {
          const pngBytes = await (await fetch(ov)).arrayBuffer();
          const img = await newPdf.embedPng(pngBytes);
          pageObj.drawImage(img, { x:0, y:0, width: w, height: h });
        }
        // redactions
        const r = redactions.current[i] || [];
        r.forEach(rr => { pageObj.drawRectangle({ x: rr.x * (w/(overlayRef.current?.width||w)), y: h - (rr.y + rr.h) * (h/(overlayRef.current?.height||h)), width: rr.w * (w/(overlayRef.current?.width||w)), height: rr.h * (h/(overlayRef.current?.height||h)), color: pdfLib.rgb(1,1,1) }); });
        // texts
        const ts = texts.current[i] || [];
        ts.forEach(t => { pageObj.drawText(t.text, { x: t.x * (w/(overlayRef.current?.width||w)), y: h - t.y * (h/(overlayRef.current?.height||h)) - 12, size: t.size, color: pdfLib.rgb(0,0,0) }); });
      }
    }
    const newBytes = await newPdf.save();
    const blob = new Blob([newBytes], { type: 'application/pdf' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = (url.split('/').pop() || 'edited') + '-edited.pdf'; link.click(); URL.revokeObjectURL(link.href);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-800 pdf-viewer-container">
      {!loadErrorMsg && pdfDoc && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
                disabled={pageIndex === 0}
                className="px-2 py-2 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] min-w-[36px]"
                title="Vorherige Seite"
              >
                ◄
              </button>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200 min-w-[60px] text-center">
                {pageIndex + 1} / {pagesOrder.length}
              </span>
              <button
                onClick={() => setPageIndex(prev => Math.min(pagesOrder.length - 1, prev + 1))}
                disabled={pageIndex >= pagesOrder.length - 1}
                className="px-2 py-2 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] min-w-[36px]"
                title="Nächste Seite"
              >
                ►
              </button>
              <div className="ml-2 flex items-center gap-1">
                <label className="text-xs text-gray-600 dark:text-gray-300">Gehe zu:</label>
                <input
                  value={gotoInput}
                  onChange={(e) => setGotoInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { const n = parseInt(gotoInput, 10); if (!isNaN(n)) setPageIndex(Math.max(0, Math.min(pagesOrder.length - 1, n - 1))); } }}
                  className="w-14 px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                  placeholder="z.B. 3"
                  title="Gehe zur Seite"
                />
              </div>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
            <button
              onClick={() => setContinuous(c => { const nv = !c; try { localStorage.setItem('fiae_pdf_continuous', String(nv)); } catch {} return nv; })}
              className={`px-3 py-2 text-xs border rounded ${continuous ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'} min-h-[36px]`}
              title="Durchlaufender Modus"
            >
              {continuous ? 'Kontinuierlich' : 'Seite für Seite'}
            </button>
            <button
              onClick={() => setThumbsOpen(t => !t)}
              className="px-3 py-2 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 min-h-[36px]"
              title="Miniaturansichten ein/aus"
            >
              {thumbsOpen ? 'Thumbnails aus' : 'Thumbnails an'}
            </button>
            <button
              onClick={() => onZoom(-0.25)}
              className="px-3 py-2 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 min-h-[36px] min-w-[36px]"
              title="Zoom Out (−)"
            >
              −
            </button>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => onZoom(0.25)}
              className="px-3 py-2 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 min-h-[36px] min-w-[36px]"
              title="Zoom In (+)"
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const container = canvas.parentElement?.parentElement;
                if (!container) return;
                const containerWidth = container.clientWidth - 40;
                const newScale = containerWidth / canvas.width * scale;
                setScale(Math.max(0.5, Math.min(3, +newScale.toFixed(2))));
              }}
              className="px-3 py-2 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 min-h-[36px]"
              title="Fit to Width"
            >
              Breite
            </button>
            <button
              onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const container = canvas.parentElement?.parentElement;
                if (!container) return;
                const containerHeight = container.clientHeight - 40;
                const newScale = containerHeight / canvas.height * scale;
                setScale(Math.max(0.5, Math.min(3, +newScale.toFixed(2))));
              }}
              className="px-3 py-2 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 min-h-[36px]"
              title="Fit to Height"
            >
              Höhe
            </button>
            <button
              onClick={() => setScale(1.0)}
              className="px-3 py-2 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 min-h-[36px]"
              title="Reset to 100%"
            >
              100%
            </button>
          </div>
        </div>
      )}
      <div ref={containerRef} className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        {loadErrorMsg ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">PDF konnte nicht geladen werden</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{loadErrorMsg}</p>
            <div className="text-xs text-gray-400 mb-4">Versuche iframe fallback...</div>
            <iframe src={url} title="pdf-viewer" className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">PDF wird geladen...</p>
              <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${loadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{loadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="flex">
            {thumbsOpen && (
              <div className="w-28 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 overflow-auto">
                <Thumbnails pdfDoc={pdfDoc} pagesOrder={pagesOrder} currentIdx={pageIndex} onJump={(n) => setPageIndex(n)} />
              </div>
            )}
            <div className="flex-1 flex">
              {continuous ? (
                <div className="min-h-full p-2 space-y-4 flex-1">
                  {pagesOrder.map((mapping, idx) => (
                    <LazyPage key={idx} pdfDoc={pdfDoc} mapping={mapping} index={idx} scale={scale} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-full p-2 flex-1">
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <canvas ref={canvasRef} style={{ display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'opacity 0.3s ease' }} />
                    <canvas ref={overlayRef} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'auto', cursor: 'crosshair' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {showTextInput && textPos && (
          <div style={{ position: 'fixed', left: textPos.left, top: textPos.top, zIndex: 9999 }}>
            <input autoFocus value={textInput} onChange={(e) => setTextInput(e.target.value)} onBlur={commitTextAtPos} onKeyDown={(e) => { if (e.key === 'Enter') commitTextAtPos(); }} className="p-1 border rounded" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfEditor;

// Simple page component for continuous rendering (no overlay/annotation in this mode)
const PageItem: React.FC<{ pdfDoc: any; mapping: number | 'blank'; scale: number }> = ({ pdfDoc, mapping, scale }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      if (mapping === 'blank') {
        const w = Math.floor(595 * scale);
        const h = Math.floor(842 * scale);
        canvas.width = w; canvas.height = h;
        canvas.style.width = `${w / scale}px`;
        canvas.style.height = `${h / scale}px`;
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
        return;
      }
      const page = await pdfDoc.getPage(mapping as number);
      const viewport = page.getViewport({ scale });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      await page.render({ canvasContext: ctx, viewport }).promise;
    };
    render();
  }, [pdfDoc, mapping, scale]);
  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} style={{ display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
    </div>
  );
};

// Lazy page renderer with IntersectionObserver and bitmap cache
// Use scale bucket to avoid stale images after zoom changes
const pageBitmapCache: Map<string, string> = new Map();

const LazyPage: React.FC<{ pdfDoc: any; mapping: number | 'blank'; index: number; scale: number }> = ({ pdfDoc, mapping, index, scale }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setVisible(true);
        }
      }
    }, { root: null, rootMargin: '200px 0px', threshold: 0.01 });
    io.observe(el);
    return () => { io.disconnect(); };
  }, []);

  useEffect(() => {
    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      if (mapping === 'blank') {
        const w = Math.floor(595 * scale);
        const h = Math.floor(842 * scale);
        canvas.width = w; canvas.height = h;
        canvas.style.width = `${w / scale}px`;
        canvas.style.height = `${h / scale}px`;
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
        const key = `${index}@${Math.round(scale*100)}`;
        pageBitmapCache.set(key, canvas.toDataURL('image/png'));
        return;
      }

      // If cached bitmap exists for this index and approximate scale, draw it quickly
      const key = `${index}@${Math.round(scale*100)}`;
      const cached = pageBitmapCache.get(key);
      if (cached) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.style.width = `${img.width}px`;
          canvas.style.height = `${img.height}px`;
          ctx.drawImage(img, 0, 0);
        };
        img.src = cached;
        // continue to render fresh in background if scale changed significantly
      }

      const page = await pdfDoc.getPage(mapping as number);
      const viewport = page.getViewport({ scale });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      await page.render({ canvasContext: ctx, viewport }).promise;
      try {
        pageBitmapCache.set(key, canvas.toDataURL('image/png'));
      } catch {}
    };
    if (visible) { render(); }
  }, [pdfDoc, mapping, scale, visible, index]);

  return (
    <div ref={holderRef} className="flex items-center justify-center min-h-[200px]">
      {visible ? (
        <canvas ref={canvasRef} style={{ display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
      ) : (
        <div className="w-full max-w-[800px] h-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      )}
    </div>
  );
};

// Thumbnails list: renders small previews; clicking jumps to page
const Thumbnails: React.FC<{ pdfDoc: any; pagesOrder: Array<number|'blank'>; currentIdx: number; onJump: (idx: number) => void }> = ({ pdfDoc, pagesOrder, currentIdx, onJump }) => {
  return (
    <div className="space-y-2">
      {pagesOrder.map((mapping, idx) => (
        <ThumbItem key={idx} pdfDoc={pdfDoc} mapping={mapping} active={idx === currentIdx} onClick={() => onJump(idx)} />
      ))}
    </div>
  );
};

const ThumbItem: React.FC<{ pdfDoc: any; mapping: number|'blank'; active: boolean; onClick: () => void }> = ({ pdfDoc, mapping, active, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const render = async () => {
      const canvas = canvasRef.current; if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const scale = 0.25; // small preview
      if (mapping === 'blank') {
        const w = Math.floor(595 * scale), h = Math.floor(842 * scale);
        canvas.width = w; canvas.height = h; canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
        ctx.fillStyle = '#fff'; ctx.fillRect(0,0,w,h);
        return;
      }
      const page = await pdfDoc.getPage(mapping as number);
      const viewport = page.getViewport({ scale });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      await page.render({ canvasContext: ctx, viewport }).promise;
    };
    render();
  }, [pdfDoc, mapping]);
  return (
    <button onClick={onClick} className={`block rounded border ${active ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'} overflow-hidden w-full`} title={typeof mapping === 'number' ? `Seite ${mapping}` : 'Leer'}>
      <canvas ref={canvasRef} />
    </button>
  );
};
