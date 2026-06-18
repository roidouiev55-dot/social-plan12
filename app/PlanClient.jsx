"use client";
import { useState, useMemo } from "react";
import { EVENTS, fmtDate, dowHeb, weekLabel, isEventDay } from "../lib/data";
import styles from "./plan.module.css";

const CH_ICON  = { story: "💬", post: "🖼", comm: "👥" };
const CH_LABEL = { story: "סטורי", post: "פוסט", comm: "קהילה" };
const CH_ORDER = { post: 0, story: 1, comm: 2 };

function parseDate(iso) { return new Date(iso); }

function EventsTab({ brands, blist }) {
  const allEvents = [];
  blist.forEach(bid => {
    EVENTS[bid].forEach(e => {
      allEvents.push({ bid, date: e });
    });
  });
  allEvents.sort((a, b) => a.date - b.date);

  const isBar = bid => bid === "WB";
  const typeLabel = bid => isBar(bid) ? "בר יין · יום חמישי" : "פסטיבל";

  const grouped = {};
  allEvents.forEach(ev => {
    const key = fmtDate(ev.date);
    if (!grouped[key]) grouped[key] = { date: ev.date, events: [] };
    grouped[key].events.push(ev);
  });

  return (
    <div className={styles.eventsTab}>
      <div className={styles.eventsGrid}>
        {Object.values(grouped).map(({ date, events }) => (
          <div key={fmtDate(date)} className={styles.evCard}>
            <div className={styles.evCardDate}>
              <span className={styles.evCardDay}>{date.getDate()}</span>
              <span className={styles.evCardMonth}>
                {date.toLocaleString("he-IL", { month: "long" })}
              </span>
              <span className={styles.evCardDow}>{dowHeb(date)}</span>
            </div>
            <div className={styles.evCardBrands}>
              {events.map(({ bid }) => (
                <div key={bid} className={styles.evCardBrand}
                  style={{ background: brands[bid].bg, borderRight: `3px solid ${brands[bid].text}` }}>
                  <span className={styles.evCardBrandName} style={{ color: brands[bid].text }}>
                    {brands[bid].name}
                  </span>
                  <span className={styles.evCardType}>{typeLabel(bid)}</span>
                  <div className={styles.evCardChecklist}>
                    {isBar(bid) ? (
                      <>
                        <span>🍷 סיקור לייב — 4-5 סטורי</span>
                        <span>👥 הודעת קהילה לפני ואחרי</span>
                        <span>🖼 פוסט יום לפני</span>
                      </>
                    ) : (
                      <>
                        <span>📣 פוסט חשיפה שבוע לפני</span>
                        <span>⏳ ספירות לאחור ב-3 ימים לפני</span>
                        <span>🎉 סיקור לייב ביום האירוע</span>
                        <span>📸 ריקאפ יומיים אחרי</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.evSummary}>
        <div className={styles.evSummaryTitle}>סיכום אירועים לפי הפקה</div>
        <div className={styles.evTable}>
          <div className={styles.evTableHead}>
            <span>הפקה</span>
            <span>מספר אירועים</span>
            <span>תאריכים</span>
          </div>
          {blist.map(bid => (
            <div key={bid} className={styles.evTableRow}
              style={{ borderRight: `3px solid ${brands[bid].text}` }}>
              <span className={styles.evTableBrand}
                style={{ color: brands[bid].text, background: brands[bid].bg }}>
                {brands[bid].name}
              </span>
              <span className={styles.evTableCount}>{EVENTS[bid].length}</span>
              <span className={styles.evTableDates}>
                {EVENTS[bid].map(e => `${fmtDate(e)} ${dowHeb(e)}`).join(" · ")}
              </span>
            </div>
          ))}
          <div className={styles.evTableTotal}>
            <span>סה"כ</span>
            <span>{blist.reduce((s, b) => s + EVENTS[b].length, 0)} אירועים</span>
            <span>18/6 – 17/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanTab({ days, brands, blist }) {
  const [activeBrand, setActiveBrand] = useState("all");
  const [openDays, setOpenDays] = useState({});

  function toggleDay(key) {
    setOpenDays(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const totals = useMemo(() => {
    let story = 0, post = 0, comm = 0;
    days.forEach(day =>
      Object.values(day.tasks).forEach(ts =>
        ts.forEach(t => { if (t.ch==="story") story++; else if (t.ch==="post") post++; else comm++; })
      )
    );
    return { story, post, comm, total: story+post+comm };
  }, [days]);

  let curWeek = null;
  const sections = [];
  days.forEach(day => {
    const d = parseDate(day.dateISO);
    const filtered = activeBrand === "all"
      ? day.tasks
      : Object.fromEntries(Object.entries(day.tasks).filter(([b]) => b === activeBrand));
    if (!Object.keys(filtered).length) return;
    const wl = weekLabel(d);
    if (wl !== curWeek) { sections.push({ type:"week", label:wl, key:wl }); curWeek=wl; }
    const dayKey = day.dateISO;
    const isOpen = !!openDays[dayKey];
    const anyEvent = Object.keys(filtered).some(b => isEventDay(b, d));
    const brandBlocks = blist.filter(b => filtered[b]).map(b => ({
      bid: b,
      tasks: [...filtered[b]].sort((a,z) => CH_ORDER[a.ch]-CH_ORDER[z.ch])
    }));
    sections.push({ type:"day", d, dayKey, isOpen, anyEvent, filtered, brandBlocks });
  });

  return (
    <>
      <div className={styles.statRow}>
        {[{n:totals.total,l:"משימות"},{n:totals.story,l:"סטורים"},{n:totals.post,l:"פוסטים"},{n:totals.comm,l:"קהילה"}].map(s=>(
          <div key={s.l} className={styles.stat}>
            <span className={styles.statN}>{s.n}</span>
            <span className={styles.statL}>{s.l}</span>
          </div>
        ))}
      </div>

      <div className={styles.filterBar}>
        {[{id:"all",name:"כל ההפקות",text:"#374151",border:"#9ca3af"},...blist.map(id=>({id,...brands[id]}))].map(f=>(
          <button key={f.id}
            className={`${styles.fbtn} ${activeBrand===f.id?styles.fbtnOn:""}`}
            style={activeBrand===f.id?{borderColor:f.border||f.text,color:f.text}:{}}
            onClick={()=>setActiveBrand(f.id)}>
            {f.name}
          </button>
        ))}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.dotUrgent}/> דחוף</span>
        <span className={styles.legendItem}><span className={styles.dotKey}/> מפתח</span>
        <span className={styles.legendItem}><span className={styles.dotEv}/> יום אירוע</span>
      </div>

      <div className={styles.cal}>
        {sections.map(sec => {
          if (sec.type==="week") return <div key={sec.key} className={styles.weekSep}>{sec.label}</div>;
          const { d, dayKey, isOpen, anyEvent, brandBlocks, filtered } = sec;
          return (
            <div key={dayKey} className={`${styles.dayCard} ${anyEvent?styles.dayEvent:""}`}>
              <button className={styles.dayHead} onClick={()=>toggleDay(dayKey)}>
                <span className={styles.dayDate}>{fmtDate(d)} · {dowHeb(d)}</span>
                <div className={styles.chips}>
                  {blist.filter(b=>filtered[b]).map(b=>(
                    <span key={b} className={styles.chip}
                      style={{background:brands[b].bg,color:brands[b].text}}>
                      {brands[b].name}
                    </span>
                  ))}
                </div>
                {anyEvent && (
                  <span className={styles.evPill}>
                    🎉 {blist.filter(b=>filtered[b]&&isEventDay(b,d)).map(b=>brands[b].name).join(", ")}
                  </span>
                )}
                <span className={`${styles.chev} ${isOpen?styles.chevOpen:""}`}>▾</span>
              </button>
              {isOpen && (
                <div className={styles.dayBody}>
                  {brandBlocks.map(({bid,tasks})=>(
                    <div key={bid} className={styles.brandBlock}>
                      <span className={styles.brandTag}
                        style={{background:brands[bid].bg,color:brands[bid].text}}>
                        {brands[bid].name}
                      </span>
                      {tasks.map((t,i)=>(
                        <div key={i} className={`${styles.task} ${t.flag==="urgent"?styles.taskUrgent:t.flag==="key"?styles.taskKey:""}`}>
                          <span className={styles.taskIco}>{CH_ICON[t.ch]}</span>
                          <div className={styles.taskBody}>
                            <div className={styles.taskMeta}>
                              {CH_LABEL[t.ch]}
                              {t.flag==="urgent"&&<span className={styles.flagU}> · דחוף</span>}
                              {t.flag==="key"&&<span className={styles.flagK}> · מפתח</span>}
                            </div>
                            <div className={styles.taskTitle}>{t.title}</div>
                            {t.sub&&<div className={styles.taskSub}>{t.sub}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function PlanClient({ days, brands, blist }) {
  const [tab, setTab] = useState("plan");

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.h1}>A&A HAFAKOT</h1>
            <p className={styles.sub}>תוכנית סושיאל · יוני–יולי 2026 · 4 הפקות</p>
          </div>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab==="plan"?styles.tabOn:""}`} onClick={()=>setTab("plan")}>
              📋 תוכנית יומית
            </button>
            <button className={`${styles.tab} ${tab==="events"?styles.tabOn:""}`} onClick={()=>setTab("events")}>
              🎉 אירועים
            </button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {tab==="plan"
          ? <PlanTab days={days} brands={brands} blist={blist}/>
          : <EventsTab brands={brands} blist={blist}/>
        }
      </div>

      <footer className={styles.footer}>A&A HAFAKOT · תוכנית סושיאל 2026</footer>
    </div>
  );
}
