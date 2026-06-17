import { buildAllDays, BRANDS, BLIST, fmtDate, dowHeb, weekLabel, isEventDay } from "../lib/data";
import PlanClient from "./PlanClient";

export default function Home() {
  const rawDays = buildAllDays();

  // Serialise dates to ISO strings for client boundary
  const days = rawDays.map(day => ({
    dateISO: day.date.toISOString(),
    tasks: day.tasks,
  }));

  return <PlanClient days={days} brands={BRANDS} blist={BLIST} />;
}
