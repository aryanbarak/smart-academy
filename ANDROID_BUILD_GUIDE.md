# راهنمای ساخت اپلیکیشن اندروید - Smart Academy

## وضعیت فعلی ✅

تمام مراحل اولیه با موفقیت انجام شده:
- ✅ Capacitor نصب شد
- ✅ پلتفرم Android اضافه شد
- ✅ پروژه build و sync شد
- ✅ نام اپ تنظیم شد: **Smart Academy**
- ✅ Package name: **com.smartacademy.app**

## مراحل باقیمانده برای ساخت APK

### گزینه ۱: استفاده از Android Studio (پیشنهادی) 🎯

#### مرحله 1: نصب Android Studio
1. دانلود از: https://developer.android.com/studio
2. نصب با تنظیمات پیش‌فرض
3. در اولین اجرا، Android SDK را نصب کنید

#### مرحله 2: باز کردن پروژه
```bash
npx cap open android
```

#### مرحله 3: ساخت APK
در Android Studio:
- **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- منتظر بمانید تا build تمام شود
- فایل APK در: `android/app/build/outputs/apk/debug/app-debug.apk`

---

### گزینه ۲: استفاده از Command Line (بدون Android Studio)

#### مرحله 1: نصب Java JDK
1. دانلود JDK 17: https://adoptium.net/
2. نصب و تنظیم `JAVA_HOME`

#### مرحله 2: نصب Android SDK Command Line Tools
1. دانلود از: https://developer.android.com/studio#command-line-tools-only
2. Extract به پوشه مثلاً: `C:\Android\cmdline-tools`
3. تنظیم متغیر محیطی:
```powershell
# در PowerShell به عنوان Administrator
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Android', 'User')
[System.Environment]::SetEnvironmentVariable('PATH', $env:PATH + ';C:\Android\cmdline-tools\bin', 'User')
```

#### مرحله 3: نصب پکیج‌های مورد نیاز
```bash
cd C:\Android\cmdline-tools\bin
.\sdkmanager --sdk_root=C:\Android "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

#### مرحله 4: ساخت APK
```bash
cd C:\Users\aryan\OneDrive\Desktop\smart-academy\android
.\gradlew assembleDebug
```

---

### گزینه ۳: استفاده از سرویس آنلاین (سریع‌ترین)

می‌توانید پروژه را در GitHub قرار دهید و از GitHub Actions یا سرویس‌هایی مثل:
- **Appetize.io**
- **PWA Builder** (https://www.pwabuilder.com/)
- **Capacitor Cloud Build**

---

## بعد از ساخت APK

### تست در Emulator:
```bash
npx cap run android
```

### تست در گوشی واقعی:
1. فعال کردن Developer Options
2. فعال کردن USB Debugging
3. اتصال گوشی با USB
4. نصب APK:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## نکات مهم

### حجم فایل
اپ شما حدود **150-200 MB** خواهد بود چون:
- PDF.js worker: ~2 MB
- فایل‌های PDF آموزشی: ~150 MB

### بهینه‌سازی برای Production
برای نسخه نهایی:
```bash
cd android
.\gradlew assembleRelease
```

**نیاز به Signing Key:**
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

---

## فایل‌های ایجاد شده

```
android/
├── app/
│   ├── src/main/
│   │   ├── assets/public/     # فایل‌های وب شما
│   │   ├── res/
│   │   │   ├── mipmap/         # آیکون‌ها
│   │   │   └── values/
│   │   │       └── strings.xml # نام اپ
│   │   └── AndroidManifest.xml
│   └── build/
│       └── outputs/apk/        # فایل APK اینجا ساخته می‌شود
└── build.gradle
```

---

## دستورات مفید

```bash
# Build کردن پروژه وب و sync با Android
npm run build && npx cap sync android

# اجرای اپ در Emulator
npx cap run android

# مشاهده لاگ‌ها
npx cap run android -l

# پاک کردن build قبلی
cd android
.\gradlew clean
```

---

## رفع مشکلات رایج

### خطای "SDK location not found"
✅ **راه حل:** نصب Android Studio یا تنظیم `ANDROID_HOME`

### خطای "Java version"
✅ **راه حل:** نصب JDK 17

### خطای "Gradle build failed"
✅ **راه حل:**
```bash
cd android
.\gradlew clean
.\gradlew assembleDebug --stacktrace
```

---

## پیشنهاد نهایی

برای سریع‌ترین راه:
1. نصب Android Studio (یک بار)
2. باز کردن پروژه: `npx cap open android`
3. Build → Build APK

**زمان تخمینی:** 10-15 دقیقه (با اینترنت خوب)

---

## تماس و پشتیبانی

اگر مشکلی پیش آمد:
- لاگ‌های کامل را از terminal کپی کنید
- نسخه Java را چک کنید: `java -version`
- نسخه Gradle را چک کنید: `cd android && .\gradlew -v`
