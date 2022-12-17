import { useEffect, useState } from "react";

import { abbrev, formatTime } from "./utils";
import { useTimesheetApi } from "./_timesheet-state";

const MINS_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MINS_PER_DAY = HOURS_PER_DAY * MINS_PER_HOUR;

export function Event({ event, parentHeight = 1200 }) {
  const { deleteEvent } = useTimesheetApi();
  const [top, setTop] = useState("");

  useEffect(() => {
    const timestamp = new Date(event.timestamp);
    const minsFromMidnight =
      timestamp.getHours() * MINS_PER_HOUR + timestamp.getMinutes();

    setTop(
      `${((parentHeight * minsFromMidnight) / MINS_PER_DAY).toFixed(0)}px`
    );
  }, [event.timestamp, parentHeight]);

  if (!top) {
    return null;
  }

  return (
    <article className={`event event--${event.type}`} style={{ top }}>
      {abbrev(event.type)}: {event.location}@{formatTime(event.timestamp)}
      <button className="event__action" onClick={() => deleteEvent(event)}>
        &times;
      </button>
    </article>
  );
}
