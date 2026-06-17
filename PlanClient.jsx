"use client";
import { useState, useMemo } from "react";
import { EVENTS, fmtDate, dowHeb, weekLabel, isEventDay } from "../lib/data";
import styles from "./plan.module.css";

const CH_ICON = { story: "💬", post: "🖼", comm: "👥" };
const CH_LABEL = { story: "סטורי", post: "פוסט", comm: "קהילה" };
const CH_ORDER = { post: 0, story: 1, comm: 2 };

function parseDate(iso) { return new Date(iso); }

export default function PlanClient({ days, brands, blist }) {
  const [activeBrand, setActiveBrand] = useState("all");
  const [openDays, setOpenDays] = useState({});

  function toggleDay(key) {
    setOpenDays(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const totals = useMemo(() => {
    let story = 0, post = 0, comm = 0;
    days.forEach(day =>
      Object.values(day.tasks).forEach(ts =>
        ts.forEach(t => { if (t.ch === "story") story++; else if (t.ch === "post") post++; else comm++; })
      )
    );
    return { story, post, comm, total: story + post + comm };
  }, [days]);

  let curWeek = null;
  const sections = [];

  days.forEach((day, i) => {
    const d = parseDate(day.dateISO);
    const filtered = activeBrand === "all"
      ? day.tasks
      : Object.fromEntries(Object.entries(day.tasks).filter(([b]) => b === activeBrand));
    if (!Object.keys(filtered).length) return;

    const wl = weekLabel(d);
    if (wl !== curWeek) { sections.push({ type: "week", label: wl, key: wl }); curWeek = wl; }

    const dayKey = day.dateISO;
    const isOpen = !!openDays[dayKey];
    const anyEvent = Object.keys(filtered).some(b => isEventDay(b, d));

    const brandBlocks = blist
      .filter(b => filtered[b])
      .map(b => {
        const sorted = [...filtered[b]].sort((a, z) => CH_ORDER[a.ch] - CH_ORDER[z.ch]);
        return { bid: b, tasks: sorted };
      });

    sections.push({ type: "day", d, dayKey, isOpen, anyEvent, filtered, brandBlocks });
  });

  return (
    <div className={styles.root}>
      {/* ── header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.h1}>תוכנית סושיאל</h1>
            <p className={styles.sub}>יוני–יולי 2026 · 4 הפקות · תוכנית עבודה יומית</p>
          </div>
          <div className={styles.statRow}>
            {[
              { n: totals.total, l: "משימות" },
              { n: totals.story, l: "סטורים" },
              { n: totals.post,  l: "פוסטים" },
              { n: totals.comm,  l: "קהילה" },
            ].map(s => (
              <div key={s.l} className={styles.stat}>
                <span className={styles.statN}>{s.n}</span>
                <span className={styles.statL}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── filters ── */}
      <div className={styles.filterBar}>
        {[{ id: "all", name: "כל ההפקות", text: "#374151", border: "#9ca3af" },
          ...blist.map(id => ({ id, ...brands[id] }))
        ].map(f => (
          <button
            key={f.id}
            className={`${styles.fbtn} ${activeBrand === f.id ? styles.fbtnOn : ""}`}
            style={activeBrand === f.id ? { borderColor: f.border || f.text, color: f.text } : {}}
            onClick={() => setActiveBrand(f.id)}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* ── legend ── */}
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.dotUrgent} /> דחוף</span>
        <span className={styles.legendItem}><span className={styles.dotKey} /> מפתח</span>
        <span className={styles.legendItem}><span className={styles.dotEv} /> יום אירוע</span>
      </div>

      {/* ── calendar ── */}
      <div className={styles.cal}>
        {sections.map(sec => {
          if (sec.type === "week") {
            return <div key={sec.key} className={styles.weekSep}>{sec.label}</div>;
          }

          const { d, dayKey, isOpen, anyEvent, brandBlocks } = sec;
          return (
            <div key={dayKey} className={`${styles.dayCard} ${anyEvent ? styles.dayEvent : ""}`}>
              {/* head */}
              <button className={styles.dayHead} onClick={() => toggleDay(dayKey)}>
                <span className={styles.dayDate}>{fmtDate(d)} · {dowHeb(d)}</span>
                <div className={styles.chips}>
                  {blist.filter(b => sec.filtered[b]).map(b => (
                    <span
                      key={b}
                      className={styles.chip}
                      style={{ background: brands[b].bg, color: brands[b].text }}
                    >
                      {brands[b].name}
                    </span>
                  ))}
                </div>
                {anyEvent && (
                  <span className={styles.evPill}>
                    🎉 {blist.filter(b => sec.filtered[b] && isEventDay(b, d)).map(b => brands[b].name).join(", ")}
                  </span>
                )}
                <span className={`${styles.chev} ${isOpen ? styles.chevOpen : ""}`}>▾</span>
              </button>

              {/* body */}
              {isOpen && (
                <div className={styles.dayBody}>
                  {brandBlocks.map(({ bid, tasks }) => (
                    <div key={bid} className={styles.brandBlock}>
                      <span
                        className={styles.brandTag}
                        style={{ background: brands[bid].bg, color: brands[bid].text }}
                      >
                        {brands[bid].name}
                      </span>
                      {tasks.map((t, i) => (
                        <div
                          key={i}
                          className={`${styles.task} ${
                            t.flag === "urgent" ? styles.taskUrgent :
                            t.flag === "key"    ? styles.taskKey : ""
                          }`}
                        >
                          <span className={styles.taskIco}>{CH_ICON[t.ch]}</span>
                          <div className={styles.taskBody}>
                            <div className={styles.taskMeta}>
                              {CH_LABEL[t.ch]}
                              {t.flag === "urgent" && <span className={styles.flagU}> · דחוף</span>}
                              {t.flag === "key"    && <span className={styles.flagK}> · מפתח</span>}
                            </div>
                            <div className={styles.taskTitle}>{t.title}</div>
                            {t.sub && <div className={styles.taskSub}>{t.sub}</div>}
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

      <footer className={styles.footer}>תוכנית סושיאל · יוני–יולי 2026</footer>
    </div>
  );
}
