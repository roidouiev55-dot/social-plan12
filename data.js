export const BRANDS = {
  WN: { id: "WN", name: "WINE NOT", bg: "#F4CCCC", text: "#7B0000", border: "#c94040" },
  MX: { id: "MX", name: "MIXIT",    bg: "#D0E8E4", text: "#0B5E57", border: "#1d9e75" },
  BG: { id: "BG", name: "BAGLIL",   bg: "#D9EAD3", text: "#2D6117", border: "#639922" },
  WB: { id: "WB", name: "WINE NOT BAR", bg: "#E4D5F0", text: "#5B2D9E", border: "#7F77DD" },
};

export const BLIST = ["WN", "MX", "BG", "WB"];

export const EVENTS = {
  WN: [new Date(2026, 6, 10)],
  MX: [new Date(2026, 6, 3)],
  BG: [new Date(2026, 5, 26), new Date(2026, 6, 10), new Date(2026, 6, 17)],
  WB: [new Date(2026, 6, 2), new Date(2026, 6, 9), new Date(2026, 6, 16)],
};

export const START = new Date(2026, 5, 17);
export const END   = new Date(2026, 6, 17);

export const HEB_DAYS = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];

export function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
export function sameDay(a, b) { return a.toDateString() === b.toDateString(); }
export function diffDays(a, b) { return Math.round((b - a) / 864e5); }
export function fmtDate(d) {
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;
}
export function dowHeb(d) { return HEB_DAYS[d.getDay()]; }

export function nextEvent(bid, d) {
  return EVENTS[bid].find(e => e >= d) || null;
}
export function daysToEvent(bid, d) {
  const e = nextEvent(bid, d);
  return e ? diffDays(d, e) : 99;
}
export function isEventDay(bid, d) {
  return EVENTS[bid].some(e => sameDay(e, d));
}

// ── task builders ─────────────────────────────────────────────────────────────

function wnTasks(d) {
  const tasks = [];
  const wd = d.getDay(), dte = daysToEvent("WN", d);
  const ne = nextEvent("WN", d);

  if (isEventDay("WN", d)) {
    tasks.push({ ch:"story", flag:"urgent",
      title: "סיקור לייב מהפסטיבל — 5–7 סטורי לאורך הערב",
      sub:   "הגעה → קהל → הבמה → שיא → תמונות סוף. שמרו להיילייט 'WINE NOT 2026'" });
    tasks.push({ ch:"comm", flag:"urgent",
      title: "הודעה חיה לקהילה: 'אנחנו חיים! המסיבה פוצצת — בואו'",
      sub:   "שלחו ב-20:00 בדיוק, עם קישור לסטורי" });
    return tasks;
  }

  if (EVENTS["WN"].some(e => sameDay(addDays(e, 2), d))) {
    tasks.push({ ch:"post", flag:"key",
      title: "ריקאפ מהפסטיבל — 5–8 תמונות הכי חזקות מהערב",
      sub:   "'ככה זה נראה כשכולם רוצים עוד' + תג צלמים. הפוסט הזה מוכר את האירוע הבא" });
    tasks.push({ ch:"story",
      title: "שתפו את פוסט הריקאפ לסטורי + 2–3 תמונות נוספות מאחורי הקלעים",
      sub:   "אנשים שלא הגיעו ירגישו FOMO — זה מוכר כרטיסים לאירוע הבא" });
    return tasks;
  }

  if (wd === 0) {
    tasks.push(dte <= 7 && dte > 0
      ? { ch:"post", flag:"key",
          title: `חשיפת ה-lineup לפסטיבל ב-${ne ? fmtDate(ne) : ""} + פתיחת מכירת כרטיסים`,
          sub:   "תמונות מהארכיון + שם הפסטיבל + לינק. הקצו לו 30 דקות — זה הפוסט הכי חשוב השבוע" }
      : { ch:"post",
          title: "פוסט אווירה מהארכיון — תמונה אחת חזקה עם כיתוב קצר",
          sub:   "'זה הוויב שחוזר ב-[תאריך הבא]'. מזכיר לאנשים למה הם אוהבים את הפסטיבל" });
    tasks.push({ ch:"story",
      title: "סטורי: 'מה מחכה לכם?' — טיזר מהארכיון + שאלה 'מי מגיע?'",
      sub:   "סקר ב-סטורי: 'כבר הזמנת כרטיס? כן / עוד לא' — תשובות = רשימת מתעניינים" });
  }
  if (wd === 2) {
    tasks.push(dte <= 5
      ? { ch:"story",
          title: `ספירה לאחור: עוד ${dte} ימים! — פוסטר האירוע + 'הכרטיסים אוזלים'` }
      : { ch:"story",
          title: "סטורי אמצע שבוע — קליפ 15 שנ' מאירוע קודם, בלי כיתוב, רק אנרגיה" });
    tasks.push({ ch:"comm",
      title: "הודעת קהילה: קישור לכרטיסים + פרט אחד שעוד לא חשפתם",
      sub:   "לא 'בואו לקנות' — תנו להם סיבה: 'לפני כולם: גם השנה יהיה X'" });
  }
  if (wd === 3) {
    tasks.push(dte <= 2
      ? { ch:"story", title: `ספירה לאחור: ${dte} ימים — 'כבר לקחתם כרטיסים?' + מפה ושעה` }
      : { ch:"story", title: "סטורי: 'ידעתם ש...' — פקט קטן ומעניין על יין" });
  }
  if (wd === 4) {
    tasks.push(dte === 1
      ? { ch:"story", flag:"urgent",
          title: "🚨 מחר הפסטיבל! — קאונטדאון + 'כרטיסים בביו, עוד מעט אוזלים'" }
      : { ch:"story",
          title: "סטורי UGC — שתפו תמונה של גולש שמסמן אתכם ב-caption" });
    tasks.push({ ch:"comm", flag: dte <= 2 ? "urgent" : undefined,
      title: dte <= 2
        ? "🚨 קריאה אחרונה — פרטי האירוע המלאים + לינק אחרון לכרטיסים"
        : "תזכורת שבועית: 'האירוע הבא בX/X — קישור לכרטיסים'",
      sub: dte <= 2 ? "שלחו בין 19–21, תפוסה מקסימלית" : "קצר ולעניין" });
  }
  return tasks;
}

function mxTasks(d) {
  const tasks = [];
  const wd = d.getDay(), dte = daysToEvent("MX", d);
  const ne = nextEvent("MX", d);

  if (isEventDay("MX", d)) {
    tasks.push({ ch:"story", flag:"urgent",
      title: "סיקור לייב — 4–5 סטורי: הגעה, הברים, הקוקטיילים, הקהל, סיום",
      sub:   "הקהל שלכם בוגר יותר — פחות היסטריה, יותר אווירה. שמרו היילייט 'MIXIT 2026'" });
    return tasks;
  }
  if (EVENTS["MX"].some(e => sameDay(addDays(e, 2), d))) {
    tasks.push({ ch:"post", flag:"key",
      title: "ריקאפ מהפסטיבל: תמונות מהקוקטיילים, הברמנים והאנשים",
      sub:   "טון: 'ערב יוצא דופן עם אנשים יוצאי דופן' — מתוחכם, לא רועש" });
    return tasks;
  }
  if (wd === 0) {
    tasks.push(dte <= 7 && dte > 0
      ? { ch:"post", flag:"key",
          title: `Lineup הברמנים + קוקטיילים מיוחדים שיוגשו ב-${ne ? fmtDate(ne) : ""}`,
          sub:   "תמונות מהארכיון, טון מכובד. 'ערב מיקסולוגיה שלא תרצו לפספס'" }
      : { ch:"post",
          title: "פוסט אווירה: תמונה אחת חזקה מפסטיבל קודם",
          sub:   "כיתוב קצר ועדין — לא 'בואו לקנות', אלא 'ככה נראה ערב ב-MIXIT'" });
    tasks.push({ ch:"story",
      title: "סטורי: שאלה לקהל — 'קוקטייל קלאסי או יצירתי?'",
      sub:   "תשובות = insights על הקהל + engagement אורגני" });
  }
  if (wd === 2) {
    tasks.push(dte <= 5
      ? { ch:"story", title: `ספירה לאחור: עוד ${dte} ימים — 'הכרטיסים כמעט אזלו'` }
      : { ch:"story", title: "סטורי: פקט מעניין על מיקסולוגיה — משהו שהקהל לא ידע" });
    tasks.push({ ch:"comm",
      title: "הודעה לקהילה: קישור כרטיסים + מה שמבדל את האירוע הזה",
      sub:   "'השנה יש X' — תנו להם סיבה שלא הייתה אשתקד" });
  }
  if (wd === 3) {
    tasks.push(dte <= 2
      ? { ch:"story", title: `ספירה לאחור — ${dte} ימים לפסטיבל` }
      : { ch:"story", title: "סטורי: מאחורי הקלעים — הכנות לפסטיבל הקרוב" });
  }
  if (wd === 4) {
    tasks.push(dte === 1
      ? { ch:"story", flag:"urgent", title: "מחר! — 'אתם מוכנים?' + קאונטדאון" }
      : { ch:"story", title: "סטורי: תמונת ארכיון + 'זה מחכה לכם'" });
    tasks.push({ ch:"comm", flag: dte <= 2 ? "urgent" : undefined,
      title: dte <= 2 ? "🚨 מחר/היום — פרטי הפסטיבל ולינק אחרון" : "תזכורת: הפסטיבל בX/X — כרטיסים בלינק" });
  }
  return tasks;
}

function bgTasks(d) {
  const tasks = [];
  const wd = d.getDay(), dte = daysToEvent("BG", d);
  const ne = nextEvent("BG", d);

  if (isEventDay("BG", d)) {
    tasks.push({ ch:"story", flag:"urgent",
      title: "סיקור לייב מהאירוע בגליל — 5–6 סטורי: נוף, אנשים, יין, ריקודים, שמש שוקעת",
      sub:   "הנוף הגלילי הוא ה-differentiator שלכם. צלמו הכל, שמרו הכל" });
    tasks.push({ ch:"comm", flag:"urgent",
      title: "הודעה לקהילה: 'אנחנו חיים בגליל!' + קישור לסטורי" });
    return tasks;
  }
  if (EVENTS["BG"].some(e => sameDay(addDays(e, 2), d))) {
    tasks.push({ ch:"post", flag:"key",
      title: "ריקאפ מהאירוע — תמונות הנוף + האנשים + היין",
      sub:   "'ככה נראית שישי בגליל'. הפוסט שגורם לאנשים לרצות לבוא לאירוע הבא" });
    tasks.push({ ch:"story",
      title: "שתפו את הריקאפ + 'האירוע הבא בX/X — כרטיסים בביו'" });
    return tasks;
  }
  if (wd === 0) {
    tasks.push(dte <= 7 && dte > 0
      ? { ch:"post", flag:"key",
          title: `אירוע קרוב: ${ne ? fmtDate(ne) : ""} בגליל — חשיפה + פתיחת מכירת כרטיסים`,
          sub:   "תמונות נוף מהארכיון + פרטי האירוע. 'הכרטיסים תמיד אוזלים מהר'" }
      : { ch:"post",
          title: "פוסט נוף גלילי + 'למה דווקא בגליל' — 2–3 שורות על הוויב המקומי",
          sub:   "אותנטיות > פרסום. הקהל שלכם אוהב את הסיפור המקומי" });
    tasks.push({ ch:"story",
      title: "סטורי: 'מי מגיע לאירוע הקרוב?' — סקר + קישור לכרטיסים" });
  }
  if (wd === 2) {
    tasks.push(dte <= 5
      ? { ch:"story", title: `ספירה לאחור: עוד ${dte} ימים!` }
      : { ch:"story", title: "קליפ אווירה 15 שנ' מאירוע קודם בגליל — טבע, מוזיקה, אנשים" });
    tasks.push({ ch:"comm",
      title: "הודעה לקהילה: קישור כרטיסים + 'מה חדש באירוע הזה'",
      sub:   "שורה שמגרה + שורה עם הלינק. אל תמתחו" });
  }
  if (wd === 3) {
    tasks.push(dte <= 2
      ? { ch:"story", title: `עוד ${dte} ימים! — 'הכרטיסים אוזלים'` }
      : { ch:"story", title: "סטורי: פקט על יין גלילי או על הלוקיישן" });
  }
  if (wd === 4) {
    tasks.push(dte === 1
      ? { ch:"story", flag:"urgent", title: "מחר האירוע! — 'כולם מגיעים?'" }
      : { ch:"story", title: "UGC — שתפו תמונה מגולש מהאירוע הקודם" });
    tasks.push({ ch:"comm", flag: dte <= 2 ? "urgent" : undefined,
      title: dte <= 2
        ? `🚨 ${dte === 1 ? "מחר" : "בקרוב"}: פרטי האירוע, מפה ולינק לכרטיסים`
        : "תזכורת שבועית — האירוע הבא בגליל: קישור" });
  }
  return tasks;
}

function wbTasks(d) {
  const tasks = [];
  const wd = d.getDay();
  const isJune = d.getMonth() === 5, isJuly = d.getMonth() === 6;
  const thuOpens = EVENTS["WB"];

  if (isEventDay("WB", d)) {
    tasks.push({ ch:"story", flag:"urgent",
      title: "סיקור ערב הבר — 4–5 סטורי: הפתיחה, הבר, יין השבוע, הקהל, סיום",
      sub:   "שמרו היילייט 'חמישי בבר'. זו הדוקומנטציה של הפיילוט" });
    tasks.push({ ch:"comm", flag:"urgent",
      title: "הודעה לקהילה: 'הלילה פתוחים! בנימינה, שעה X — מגיעים?'",
      sub:   "קצר ולעניין. אם מלא — ציינו" });
    return tasks;
  }

  const prevThu = thuOpens.find(e => sameDay(addDays(e, 1), d));
  if (prevThu) {
    tasks.push({ ch:"story",
      title: "ריקאפ מאתמול — תמונות/וידאו קצר מהערב בבר",
      sub:   "אנשים שפספסו רוצים לראות מה הם פספסו" });
    tasks.push({ ch:"comm",
      title: "'ערב קסום! תמונות בסטורי. חמישי הבא בX/X — כבר שמרתם?'" });
    return tasks;
  }

  if (isJune) {
    if (wd === 0) tasks.push({ ch:"story",
      title: "סטורי טיזר: 'יולי מגיע — משהו חדש בבנימינה' + תמונת המקום" });
    if (wd === 2) {
      tasks.push({ ch:"post",
        title: "פוסט טיזר: 'בר יין חדש נפתח ביולי, ימי חמישי בלבד — בנימינה'",
        sub:   "תמונות המקום + 'מה אתם יודעים על בנימינה?' — שאלה שיוצרת שיחה" });
      tasks.push({ ch:"story", title: "שתפו את פוסט הטיזר לסטורי + סקר 'מגיעים ביולי?'" });
      tasks.push({ ch:"comm",
        title: "'ביולי אנחנו נפתחים! חמישי ראשון: 2/7. שמרו את התאריך'",
        sub:   "חשיפה רכה, לא מכירתית" });
    }
    if (wd === 4) tasks.push({ ch:"story",
      title: `ספירה לאחור לפתיחה: '${diffDays(d, new Date(2026,6,2))} ימים ל-WINE NOT BAR'` });
    return tasks;
  }

  if (isJuly) {
    const dayBefore = thuOpens.find(e => sameDay(addDays(e, -1), d));
    if (dayBefore) {
      tasks.push({ ch:"post", flag: sameDay(thuOpens[0], dayBefore) ? "key" : undefined,
        title: sameDay(thuOpens[0], dayBefore)
          ? "🎉 נפתחים! 'מחר החמישי הראשון של הבר בבנימינה' + שעות + מיקום"
          : "'מחר חמישי בבר — מה מחכה לכם הערב' + פרטים + שעות",
        sub: "20 דקות עריכה לפחות לפוסט הפתיחה" });
      tasks.push({ ch:"story", title: "שתפו את הפוסט + 'מגיעים? סמנו מישהו'" });
      return tasks;
    }
    if (wd === 0) tasks.push({ ch:"story",
      title: "סטורי: 'ריטואל החמישי' — מה מחכה השבוע בבר" });
    if (wd === 2) tasks.push({ ch:"story",
      title: "יין השבוע שבחרנו לבר — מה, מאיפה, ולמה",
      sub:   "תוכן חינוכי קל = engagement גבוה + מיצוב כמומחים" });
    if (wd === 3) tasks.push({ ch:"story",
      title: "מאחורי הקלעים: הכנות לחמישי — הבר, היינות, האווירה" });
  }
  return tasks;
}

const BUILDERS = { WN: wnTasks, MX: mxTasks, BG: bgTasks, WB: wbTasks };

export function buildAllDays() {
  const days = [];
  for (let d = new Date(START); d <= END; d = addDays(d, 1)) {
    const day = { date: new Date(d), tasks: {} };
    for (const bid of BLIST) {
      const t = BUILDERS[bid](new Date(d));
      if (t && t.length) day.tasks[bid] = t;
    }
    if (Object.keys(day.tasks).length) days.push(day);
  }
  return days;
}

export function weekLabel(d) {
  if (d <= new Date(2026, 5, 20)) return "שבוע פתיחה · 17–20 יוני";
  if (d <= new Date(2026, 5, 27)) return "שבוע 1 · 21–27 יוני";
  if (d <= new Date(2026, 6, 4))  return "שבוע 2 · 28 יוני–4 יולי";
  if (d <= new Date(2026, 6, 11)) return "שבוע 3 · 5–11 יולי";
  return "שבוע 4 · 12–17 יולי";
}
