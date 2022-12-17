import { Event } from "./_event";
import { formatTime, startOfDay } from "./utils";
import { useTimesheetData } from "./_timesheet-state";

const SLOTS = createSlots();

export function Day() {
  const { events = [] } = useTimesheetData();

  return (
    <>
      <section className="day">
        {SLOTS.map((time, i) => (
          <div
            key={`slot-${i}`}
            className="day__timeslot"
            data-time={time}
          ></div>
        ))}
        {events.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </section>
    </>
  );
}

function createSlots() {
  const date = startOfDay();

  return Array(24)
    .fill()
    .map((_, i) => {
      const formattedTime = formatTime(date);

      date.setHours(date.getHours() + 1);

      return formattedTime;
    });
}
