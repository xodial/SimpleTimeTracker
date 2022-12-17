import React from "react";
import { cn, dateKey, formatDay } from "./utils";
import { useTimesheetApi, useTimesheetData } from "./_timesheet-state";

export function Nav() {
  const { date } = useTimesheetData();
  const { changeDate } = useTimesheetApi();

  const isToday = dateKey(date) === dateKey();

  return (
    <section className={cn("nav", isToday && "nav--today")}>
      <button className="nav__action" onClick={() => changeDate(-1)}>
        &lsaquo;
      </button>
      <h3 className="nav__title">{formatDay(date)}</h3>
      <button
        className="nav__action"
        onClick={() => changeDate(1)}
        disabled={isToday}
      >
        &rsaquo;
      </button>
    </section>
  );
}
