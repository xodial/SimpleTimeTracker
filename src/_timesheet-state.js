import { createContext, useContext, useEffect, useState } from "react";

import { dateKey, startOfDay } from "./utils";

const DAY_DATA_STORAGE_PREFIX = "timesheet-";

const TimesheetContext = createContext();
const TimesheetApiContext = createContext(null);

export function useTimesheetData({ allDays = false } = {}) {
  const timesheetData = useContext(TimesheetContext);

  if (allDays) {
    return timesheetData;
  }

  const { date } = timesheetData;
  return timesheetData[dateKey(date)] ?? defaultDayData(date);
}

export function useTimesheetApi() {
  return useContext(TimesheetApiContext);
}

export function TimesheetProvider({ children }) {
  const [timesheetData, setTimesheetData] = useState(readFromStorage);
  const [timesheetApi] = useState(createApi(setTimesheetData));

  useEffect(() => {
    writeToStorage(timesheetData);
    console.log(timesheetData);
  }, [timesheetData]);

  return (
    <TimesheetContext.Provider value={timesheetData}>
      <TimesheetApiContext.Provider value={timesheetApi}>
        {children}
      </TimesheetApiContext.Provider>
    </TimesheetContext.Provider>
  );
}

function readFromStorage() {
  const timesheetData = {
    date: startOfDay()
  };

  for (const storageKey of Object.keys(localStorage)) {
    if (!storageKey.startsWith(DAY_DATA_STORAGE_PREFIX)) {
      continue;
    }

    const key = storageKey.replace(DAY_DATA_STORAGE_PREFIX, "");
    timesheetData[key] = deserialize(localStorage.getItem(storageKey));
  }

  return timesheetData;
}

function writeToStorage(timesheetData) {
  for (const key of Object.keys(timesheetData)) {
    if (!/^\d{4}-/.test(key)) {
      continue;
    }

    const storageKey = `${DAY_DATA_STORAGE_PREFIX}${key}`;
    localStorage.setItem(storageKey, serialize(timesheetData[key]));
  }
}

function deserialize(dayData) {
  const parsedDayData = JSON.parse(dayData);

  parsedDayData.date = new Date(parsedDayData.date);
  parsedDayData.events.forEach((event) => {
    event.timestamp = new Date(event.timestamp);
  });

  return parsedDayData;
}

function serialize(dayData) {
  return JSON.stringify({
    ...dayData,
    date: dayData.date.toISOString(),
    events: dayData.events.map((event) => ({
      ...event,
      timestamp: event.timestamp.toISOString()
    }))
  });
}

function createApi(setTimesheetData) {
  return {
    addEvent: addEvent(setTimesheetData),
    deleteEvent: deleteEvent(setTimesheetData),
    updateEvent: updateEvent(setTimesheetData),
    changeDate: changeDate(setTimesheetData)
  };
}

const CHARS = "0123456789abcdef";
function randomId(len = 32) {
  const size = CHARS.length;
  let id = "";

  for (let i = 0; i < len; i++) {
    id += CHARS[(Math.random() * size) | 0];
  }

  return id;
}

function defaultDayData(date) {
  return {
    date: startOfDay(date),
    events: []
  };
}

const addEvent = (setTimesheetData) => (eventData) => {
  setTimesheetData((data) => {
    const key = dateKey(eventData.timestamp);
    const dayData = data[key] ?? defaultDayData(eventData.timestamp);

    return {
      ...data,
      [key]: {
        ...dayData,
        events: [...dayData.events, { id: randomId(), ...eventData }]
      }
    };
  });
};

const deleteEvent = (setTimesheetData) => (eventData) => {
  setTimesheetData((data) => {
    const key = dateKey(eventData.timestamp);
    const dayData = data[key];

    return {
      ...data,
      [key]: {
        ...dayData,
        events: dayData.events.filter((event) => event.id !== eventData.id)
      }
    };
  });
};

const updateEvent = (setTimesheetData) => (eventData) => {
  setTimesheetData((data) => {
    const key = dateKey(eventData.timestamp);
    const dayData = data[key];

    return {
      ...data,
      [key]: {
        ...dayData,
        events: dayData.events.map((event) =>
          event.id !== eventData.id ? event : eventData
        )
      }
    };
  });
};

const changeDate = (setTimesheetData) => (days) => {
  setTimesheetData((data) => {
    const date = new Date(data.date);

    date.setDate(date.getDate() + days);

    return {
      ...data,
      date
    };
  });
};
