# راهنمای Responsive PDF Viewer

## 1. CSS برای حذف حاشیه و فیکس Layout

### تنظیمات اصلی (در App.tsx یا index.css):

```css
/* حذف margin و padding پیش‌فرض */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
}

#root {
  height: 100vh;
  width: 100vw;
}
```

### Layout کامل صفحه:

```css
/* کانتینر اصلی */
.pdf-viewer-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

/* لیست فایل‌ها - سمت چپ */
.file-list {
  width: 320px;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  flex-shrink: 0;
}

/* نمایشگر PDF - بقیه فضا */
.pdf-display {
  flex: 1;
  overflow: auto;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Canvas به صورت responsive */
.pdf-canvas-wrapper {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
}

canvas {
  display: block;
  max-width: 100%;
  height: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

## 2. JavaScript برای مقیاس خودکار (Responsive Canvas)

### تابع loadPdf با مقیاس خودکار:

```javascript
async function loadPdf(url, containerRef, canvasRef) {
  try {
    // بارگذاری PDF
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    // محاسبه مقیاس براساس عرض container
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // viewport پیش‌فرض با scale = 1
    const defaultViewport = page.getViewport({ scale: 1 });
    
    // محاسبه scale برای fit کردن در container
    const scaleWidth = (containerWidth - 40) / defaultViewport.width;   // 40px برای padding
    const scaleHeight = (containerHeight - 40) / defaultViewport.height;
    const scale = Math.min(scaleWidth, scaleHeight, 2); // حداکثر 2x
    
    // viewport نهایی
    const viewport = page.getViewport({ scale });
    
    // تنظیم canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // رندر
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    console.log('✅ PDF loaded with scale:', scale);
    return { pdf, page, scale };
    
  } catch (error) {
    console.error('❌ Error loading PDF:', error);
    throw error;
  }
}
```

### رویداد resize برای بروزرسانی خودکار:

```javascript
useEffect(() => {
  let resizeTimeout;
  
  const handleResize = () => {
    // Debounce برای جلوگیری از فراخوانی‌های زیاد
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (pdfDoc && currentPage) {
        loadPdf(pdfUrl, containerRef, canvasRef);
      }
    }, 300);
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(resizeTimeout);
  };
}, [pdfDoc, currentPage, pdfUrl]);
```

## 3. کد کامل React Component

```typescript
import React, { useEffect, useRef, useState } from 'react';

interface PdfViewerProps {
  url: string;
}

const ResponsivePdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadAndRenderPdf = async () => {
    if (!containerRef.current || !canvasRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
      (pdfjs as any).GlobalWorkerOptions.workerSrc = 
        'https://unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.js';
      
      const loadingTask = (pdfjs as any).getDocument(url);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      // محاسبه scale
      const container = containerRef.current;
      const defaultViewport = page.getViewport({ scale: 1 });
      const scaleWidth = (container.clientWidth - 40) / defaultViewport.width;
      const scaleHeight = (container.clientHeight - 40) / defaultViewport.height;
      const scale = Math.min(scaleWidth, scaleHeight, 2);
      
      // رندر
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      setLoading(false);
      
    } catch (err: any) {
      console.error('Error loading PDF:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadAndRenderPdf();
  }, [url]);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(loadAndRenderPdf, 300);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [url]);
  
  return (
    <div 
      ref={containerRef}
      className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
      {loading && <div>در حال بارگذاری...</div>}
      {error && <iframe src={url} className="w-full h-full border-0" />}
      {!loading && !error && (
        <canvas 
          ref={canvasRef}
          className="max-w-full max-h-full shadow-lg"
        />
      )}
    </div>
  );
};

export default ResponsivePdfViewer;
```

## 4. نحوه تست

### تست دستی:

1. **باز کردن برنامه**:
   ```bash
   npm run dev
   ```

2. **تست اندازه‌های مختلف**:
   - صفحه مرورگر را کوچک/بزرگ کنید
   - از Developer Tools → Device Toolbar استفاده کنید
   - تست کنید: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)

3. **چک‌لیست تست**:
   - [ ] PDF در مرکز صفحه قرار دارد
   - [ ] بدون حاشیه اضافی
   - [ ] با تغییر سایز پنجره، PDF به صورت خودکار resize می‌شود
   - [ ] در تمام اندازه‌های صفحه نمایش خوانا است
   - [ ] scroll bar فقط در صورت نیاز نمایش داده می‌شود

### تست خودکار (اختیاری):

```typescript
// در فایل test
describe('ResponsivePdfViewer', () => {
  it('should resize canvas on window resize', async () => {
    const { container } = render(<ResponsivePdfViewer url="test.pdf" />);
    
    // تغییر سایز
    global.innerWidth = 1200;
    global.innerHeight = 800;
    window.dispatchEvent(new Event('resize'));
    
    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeTruthy();
      expect(canvas?.width).toBeLessThanOrEqual(1200);
    });
  });
});
```

## 5. نکات مهم

### بهینه‌سازی Performance:

```javascript
// Debounce برای resize event
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// استفاده
const debouncedResize = debounce(loadAndRenderPdf, 300);
window.addEventListener('resize', debouncedResize);
```

### مدیریت حافظه:

```javascript
// cleanup
useEffect(() => {
  return () => {
    // آزادسازی canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
}, []);
```

### مقیاس پیشنهادی:

```javascript
// برای خوانایی بهتر
const MIN_SCALE = 0.5;  // کوچک‌ترین مقیاس
const MAX_SCALE = 3;    // بزرگ‌ترین مقیاس
const PADDING = 40;     // فاصله از لبه‌ها

const scale = Math.max(
  MIN_SCALE,
  Math.min(scaleWidth, scaleHeight, MAX_SCALE)
);
```

## 6. خلاصه تغییرات لازم

✅ **CSS**: حذف margin/padding، استفاده از flexbox، 100vh/100vw

✅ **JavaScript**: محاسبه scale براساس containerWidth/containerHeight

✅ **React**: useEffect برای resize event با debounce

✅ **Canvas**: max-width: 100%, height: auto

✅ **Container**: display: flex, align-items: center, justify-content: center

---

**نتیجه**: PDF در تمام اندازه‌های صفحه بدون حاشیه و به صورت تمام صفحه نمایش داده می‌شود.
