# Smart Academy (یادگیری برای فاخ‌اینفورماتیکر)

یک پلتفرم یادگیری تعاملی برای دانشجویان Fachinformatiker (FIAE)(متخصص توسعه نرم‌افزار) با محتوای دوزبانه (آلمانی و فارسی).

## 🎯 ویژگی‌ها

- ✅ محتوای دوزبانه (آلمانی و فارسی)
- ✅ دو دوره اصلی: GA2 (الگوریتم‌ها) و WISO (اقتصاد و اجتماع)
- ✅ تمیز شب/روز (Dark/Light Mode)
- ✅ سؤال از دستیار هوش مصنوعی (Gemini)
- ✅ ساده‌سازی متن با AI
- ✅ تبدیل متن به گفتار (TTS)
- ✅ رابط کاربری واکنش‌پذیر
- ✅ پیام‌های خطا و موفقیت بهتر (Toast)

## 🛠️ تکنولوژی‌ها

- **React** – رابط کاربری
- **TypeScript** – ایمنی تایپ
- **Vite** – ساخت سریع
- **Tailwind CSS** – طراحی
- **Express.js** – سرور API (پروکسی برای Google GenAI)
- **Google GenAI** – AI و صوت
- **Vitest** – تست‌ها
- **GitHub Actions** – CI/CD

## 📋 نیازمندی‌ها

- Node.js 18+ و npm

## 🚀 شروع سریع

### 1. کلون و نصب

```bash
git clone <your-repo-url>
cd smart-academy
npm install
```

### 2. تنظیم API Key

فایل `.env` را از `.env.example` بسازید:

```bash
cp .env.example .env
```

سپس `API_KEY` واقعی‌تان را اضافه کنید (از Google GenAI):

```env
API_KEY=your-actual-google-genai-api-key
SERVER_PORT=4000
```

### 3. اجرای پروژه

دو ترمینال جداگانه باز کنید:

**ترمینال 1 – سرور API:**
```bash
npm run start:server
```

**ترمینال 2 – فرانت‌اند:**
```bash
npm run dev
```

سپس مرورگر را به `http://localhost:3000` باز کنید.

## 🧪 تست‌ها

تست‌های خودکار را اجرا کنید:

```bash
npm test           # اجرای تست‌های interative
npm test -- --run  # اجرای تست‌ها یک‌بار
npm run test:ui    # مشاهده UI تست‌ها
```

## 📦 ساخت برای Production

```bash
npm run build
npm run preview
```

## 📁 ساختار پروژه

```
smart-academy/
├── src/
│   ├── App.tsx                 # کامپوننت اصلی
│   ├── components/
│   │   ├── MasterFile.tsx      # محتوای درس (lazy-loaded)
│   │   ├── InfoPanels.tsx      # پانل‌های اطلاعات
│   │   └── Toast.tsx           # پیام‌های موفقیت/خطا
│   ├── utils/
│   │   └── gemini.ts           # تماس‌های API (کلاینت-امن)
│   ├── constants.ts            # محتوای درس‌ها
│   ├── types.ts                # تعریف‌های TypeScript
│   └── index.tsx               # نقطه ورود
├── server/
│   └── index.js                # سرور Express (پروکسی)
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions (CI/CD)
├── .env.example                # متغیرهای محیطی نمونه
└── package.json                # وابستگی‌ها و اسکریپت‌ها
```

## 🔐 امنیت

- کلید API فقط در سرور ذخیره می‌شود (نه در باندل فرانت‌اند)
- درخواست‌های AI از طریق پروکسی سرور هدایت می‌شوند
- پاسخ‌های mock برای توسعه محلی (بدون کلید) فراهم شده‌اند

## 🚢 استقرار (Deployment)

### بر روی Vercel (یا خدمات serverless دیگر)

1. `server/index.js` را به یک serverless function تبدیل کنید
2. متغیرهای محیطی را در داشبورد تنظیم کنید
3. فرانت‌اند را با توجه به URL سرور به‌روزرسانی کنید

### برای Docker

ابتدا یک فایل `Dockerfile` و `.dockerignore` ایجاد کنید (در صورت نیاز).

## 📖 مستندات بیشتر

- [Google GenAI Documentation](https://ai.google.dev)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 🤝 مشارکت

برای مشارکت:

1. Fork این پروژه
2. یک شاخه (branch) جدید بسازید (`git checkout -b feature/NewFeature`)
3. تغییرات را commit کنید (`git commit -m 'Add NewFeature'`)
4. آن را push کنید (`git push origin feature/NewFeature`)
5. یک Pull Request باز کنید

## 📝 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

## 📞 تماس و پشتیبانی

برای مسائل، سوالات یا پیشنهادات، یک issue باز کنید یا به ما ایمیل بفرستید.

---

**ساخت شده با ❤️ برای دانشجویان FIAE **
