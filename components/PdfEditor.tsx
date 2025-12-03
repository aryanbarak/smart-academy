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
    setPdfDoc(null);
    setLoadErrorMsg(null);
    setPagesOrder([]);
    setPageIndex(0);
    
    (async () => {
      try {
        console.debug('[PdfEditor] loading pdfjs and pdf-lib for url', url);
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
        // Use unpkg CDN with matching version
        (pdfjs as any).GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.js';
        console.debug('[PdfEditor] worker configured to unpkg v5.4.449');
        const pl = await import('pdf-lib');
        if (!mounted) return;
        setPdfModule(pdfjs);
        setPdfLib(pl);

        const loadingTask = (pdfjs as any).getDocument(url);
        const doc = await loadingTask.promise;
        if (!mounted) return;
        console.debug('[PdfEditor] loaded pdf document', { numPages: doc?.numPages });
        if (!doc || !doc.numPages || doc.numPages === 0) {
          setLoadErrorMsg('PDF konnte nicht geladen werden oder enthält keine Seiten.');
          setPdfDoc(null);
          setNumPages(0);
          setPagesOrder([]);
          return;
        }
        // Clear any previous error
        setLoadErrorMsg(null);
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        // initialize pagesOrder
        setPagesOrder(Array.from({ length: doc.numPages }, (_, i) => i + 1));
        console.debug('[PdfEditor] ✅ PDF ready! Pages:', doc.numPages);
      } catch (err: any) {
        console.error('[PdfEditor] error loading PDF or libs', err);
        setLoadErrorMsg(String(err?.message || err));
        setPdfDoc(null);
        setNumPages(0);
        setPagesOrder([]);
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
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div style={{ position: 'relative', width: '100%', minHeight: '600px', overflow: 'auto', backgroundColor: '#f5f5f5' }}>
        {loadErrorMsg ? (
          <iframe src={url} title="pdf-viewer" style={{ width: '100%', height: '700px', border: '1px solid #ddd' }} />
        ) : !pdfDoc ? (
          <div className="p-6 text-center text-gray-500">در حال بارگذاری PDF...</div>
        ) : (
          <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto' }}>
            <canvas ref={canvasRef} style={{ display: 'block', border: '1px solid #ddd', backgroundColor: '#fff' }} />
            <canvas ref={overlayRef} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'auto', cursor: 'crosshair' }} />
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
