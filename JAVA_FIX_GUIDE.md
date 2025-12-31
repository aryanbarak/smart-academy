# راهنمای حل مشکل Java برای ساخت APK

## مشکل
پروژه به Java 21 نیاز دارد اما شما Java 17 و 25 دارید.
- Java 17: خیلی قدیمی است
- Java 25: خیلی جدید است و Gradle پشتیبانی نمی‌کند

## راه حل: نصب Java 21

### مرحله 1: دانلود Java 21
لینک دانلود: https://adoptium.net/temurin/releases/?version=21

**انتخاب کنید:**
- **Operating System:** Windows
- **Architecture:** x64
- **Package Type:** JDK
- **Version:** 21 (LTS)

### مرحله 2: نصب
1. فایل دانلود شده را اجرا کنید
2. در حین نصب، گزینه **"Set JAVA_HOME variable"** را فعال کنید
3. گزینه **"JavaSoft (Oracle) registry keys"** را هم فعال کنید
4. Finish

### مرحله 3: تنظیم مسیر در پروژه
بعد از نصب، مسیر احتمالی:
```
C:\Program Files\Eclipse Adoptium\jdk-21.x.x.xx-hotspot
```

بیایید مسیر دقیق را پیدا کنیم و فایل `gradle.properties` را بروزرسانی کنیم.

---

## دستورات بعد از نصب Java 21

### 1. تأیید نصب
```powershell
"C:\Program Files\Eclipse Adoptium\jdk-21.x.x.xx-hotspot\bin\java.exe" -version
```
باید بگوید: **openjdk version "21.x.x"**

### 2. بروزرسانی gradle.properties
فایل: `android/gradle.properties`

```properties
org.gradle.java.home=C:\\Program Files\\Eclipse Adoptium\\jdk-21.x.x.xx-hotspot
```

### 3. Build کردن APK
```powershell
cd android
.\gradlew assembleDebug
```

---

## گزینه جایگزین: استفاده از Android Studio

اگر نمی‌خواهید Java دستی نصب کنید:

1. **باز کردن پروژه در Android Studio**
   ```powershell
   npx cap open android
   ```

2. Android Studio خودش Java مناسب را دانلود و نصب می‌کند

3. از منوی Android Studio:
   **File** → **Settings** → **Build, Execution, Deployment** → **Build Tools** → **Gradle**
   
4. در قسمت **Gradle JDK** گزینه مناسب را انتخاب کنید (Android Studio JDK)

5. بعد از sync موفق:
   **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**

---

## فایل APK کجاست؟

بعد از build موفق:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

این فایل را می‌توانید:
- روی گوشی Android کپی کنید
- از طریق ADB نصب کنید: `adb install app-debug.apk`
- از طریق USB به گوشی منتقل و نصب کنید

---

## خلاصه مراحل

1. ✅ نصب Java 21 از Adoptium
2. ✅ بروزرسانی `android/gradle.properties`
3. ✅ اجرای `.\gradlew assembleDebug`
4. ✅ پیدا کردن APK در `android/app/build/outputs/apk/debug/`
5. ✅ نصب روی گوشی Android

---

## اگر مشکل دیگری پیش آمد

پاک کردن cache و build مجدد:
```powershell
cd android
.\gradlew clean
.\gradlew assembleDebug --refresh-dependencies
```
