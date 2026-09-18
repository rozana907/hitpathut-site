# העוצמה שבך — אתר התפתחות אישית

אתר סטטי (HTML/CSS/JS ללא build step) בעברית, RTL.

## מבנה הפרויקט

```
.
├── index.html                     # דף הבית — תגיות בלבד, בלי CSS/JS מוטמעים
├── assets/
│   ├── css/
│   │   ├── base/                  # שכבת הבסיס — נטענת ראשונה
│   │   │   ├── tokens.css         # משתני עיצוב (:root) — צבעים, רדיוסים, קצב אנכי
│   │   │   ├── reset.css          # איפוס מינימלי + הגדרות body/html
│   │   │   └── typography.css     # סקאלת טיפוגרפיה (h1, h2, .sub, ul, li)
│   │   ├── layout/                # שלד העמוד
│   │   │   ├── nav.css            # ניווט דביק + כפתור תפריט מובייל
│   │   │   ├── section.css        # רוחב תוכן וריווח אנכי של section
│   │   │   └── footer.css
│   │   ├── components/            # רכיבים לשימוש חוזר
│   │   │   ├── button.css         # .btn + .btn--primary / .btn--secondary
│   │   │   ├── badge.css          # .badge ו־.pill
│   │   │   └── card.css           # .card לכרטיסי הקורסים
│   │   ├── sections/              # עיצוב לפי מקטע בעמוד
│   │   │   ├── hero.css
│   │   │   ├── courses.css        # .grid — גריד כרטיסי הקורסים
│   │   │   ├── daily.css          # .daily / .quote / .exercise
│   │   │   ├── future.css         # .future / .future-box
│   │   │   └── cta.css            # .cta
│   │   └── responsive.css         # כל ה־breakpoints במקום אחד (נטען אחרון)
│   ├── js/
│   │   └── main.js                # JS וניל, ללא תלויות, נטען עם defer
│   └── img/                       # נכסי תמונה (WebP/SVG מומלץ)
└── README.md
```

## כללי העבודה

1. **סדר הטעינה של ה־CSS** ב־`index.html` הוא ה־cascade. כל קובץ חדש מתווסף לפי השכבה שלו,
   לפני `responsive.css`.
2. **כל ה־breakpoints** נמצאים רק ב־`assets/css/responsive.css` (כרגע 750px).
3. **ערכי עיצוב לא כותבים ישירות** — משתמשים ב־tokens מתוך `base/tokens.css`
   (למשל `var(--rose)`, `var(--radius-md)`, `var(--section-y)`).
4. **קונבנציית שמות:** שמות רכיבים ב־kebab-case; וריאציות עם `--` (למשל `.btn--primary`);
   מצב (state) עם `is-` (למשל `.links.is-open`).
5. **HTML נשאר קובץ אחד.** אין build step, ולכן פיצול ל־partials יחייב טעינה ב־JS
   שתפגע ב־SEO ובמהירות. אם בעתיד יתווספו עמודים — עדיף להוסיף build (למשל Eleventy/Vite)
   ולהשאיר את שכבת ה־CSS כפי שהיא.
6. **JS הוא שיפור מתקדם בלבד** (progressive enhancement): כל מודול בודק שהאלמנט קיים,
   והאתר עובד גם בלעדיו.
7. אין להשתמש ב־`style="..."` בתוך ה־HTML — סגנון נקודתי עובר לקובץ ה־CSS המתאים.
8. שיפור שתלוי ב־JS מסומן ב־`has-js`: `main.js` מוסיף את ה־class ל־`<html>`,
   וה־CSS כותב `.has-js .selector` (למשל כפתור "תפריט" במובייל).

## הרצה מקומית

פתיחה ישירה של `index.html` בדפדפן מספיקה (כל הנכסים בנתיבים יחסיים).
לסביבה קרובה לפרודקשן:

```powershell
# עם Python 3
python -m http.server 5173

# או עם Node
npx serve .
```

ואז לפתוח <http://localhost:5173>.

## מה השתנה בארכיטקטורה

- ה־CSS שיצא מתוך `<style>` ב־`index.html` פוצל ל־15 קבצים ב־4 שכבות + קובץ responsive.
- הוספו tokens לערכים שהיו קשיחים (רדיוסים, צל, ריווח, רוחב תוכן).
- הוסרו שני `style="text-align:right"` אינניין־ליין; הסגנון עבר ל־`sections/future.css`.
- תוקן באג: ה־class `.future` היה מוגדר ב־CSS אבל לא היה בשימוש ב־HTML, כך שהמקטע
  "האני העתידית" לא הוצג בשתי עמודות. כעת ה־class מוחל על העטיפה.
- שינוי שמות: `.primary` → `.btn--primary`, `.secondary` → `.btn--secondary`
  (שמות גנריים מדי שעלולים להתנגש בעתיד).
- נוסף `assets/js/main.js`: תפריט מובייל נגיש (כפתור "תפריט"), שנה דינמית בפוטר
  ו־scroll-spy שמסמן את הקישור הפעיל בניווט.
