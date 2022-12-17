import { useCallback, useState } from "react";

import { LocationDialog } from "./_location-dialog";
import { dateKey, getCurrentCoordinates, getDistance } from "./utils";
import { useTimesheetApi, useTimesheetData } from "./_timesheet-state";
import { useLocations, useLocationsApi } from "./_locations-state";

const BUTTONS = {
  "clock-in": "Clock in",
  meal: "Meal",
  "clock-out": "Clock out"
};

export function Controls() {
  const { date } = useTimesheetData();
  const locations = useLocations();
  const { addEvent } = useTimesheetApi();
  const { addLocation } = useLocationsApi();
  const [pendingType, setPendingType] = useState();
  const [isBusy, setIsBusy] = useState(false);

  const isToday = dateKey(date) === dateKey();

  const onCreateEvent = useCallback(
    async (type, locations) => {
      setIsBusy(true);
      try {
        const location = await findLocation(locations);
        if (!location) {
          setPendingType(type);
          return;
        }

        addEvent(createEvent(type, location));
      } catch (e) {
        alert(`Couldn't create ${type} event: ${e}`);
      }
      setIsBusy(false);
    },
    [addEvent]
  );

  const onCancelLocation = useCallback(() => {
    setPendingType(undefined);
    setIsBusy(false);
  }, []);

  const onCompleteLocation = useCallback(
    (location) => {
      addLocation(location);
      addEvent(createEvent(pendingType, location));
      setPendingType(undefined);
      setIsBusy(false);
    },
    [pendingType, addEvent, addLocation]
  );

  return (
    <>
      <section className="controls">
        {Object.entries(BUTTONS).map(([type, label]) => (
          <button
            key={type}
            className={`controls__button controls__button--${type}`}
            onClick={() => onCreateEvent(type, locations)}
            disabled={isBusy || !isToday}
          >
            {label}
          </button>
        ))}
      </section>
      {!!pendingType && (
        <LocationDialog
          onCancel={onCancelLocation}
          onComplete={onCompleteLocation}
        />
      )}
    </>
  );
}

function createEvent(type, location) {
  return {
    type,
    location,
    timestamp: new Date()
  };
}

const RADIUS_M = 60;
async function findLocation(locations) {
  const coords = await getCurrentCoordinates();

  for (let location of Object.values(locations)) {
    if (getDistance(coords, location.coords) < RADIUS_M) {
      return location.name;
    }
  }

  return null;
}
