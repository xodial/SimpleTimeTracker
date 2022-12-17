import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useLocations, useLocationsApi } from "./_locations-state";

export function LocationDialog({ onCancel, onComplete }) {
  const locations = useLocations();
  const { addLocation } = useLocationsApi();

  const [isNew, setIsNew] = useState(Object.keys(locations).length === 0);
  const [isComplete, setIsComplete] = useState(false);
  const [name, setName] = useState(locations[0]?.name ?? "");
  const isInvalid = !name;

  useEffect(() => {
    if (isComplete && locations.find((loc) => loc.name === name)) {
      onComplete(name);
    }
  }, [onComplete, locations, name, isComplete]);

  return createPortal(
    <dialog className="location form" open>
      {isNew ? (
        <>
          <label className="form__label">Location name:</label>
          <input
            className="form__field form__field--text"
            type="text"
            name="location-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            data-form-type="other"
          />
        </>
      ) : (
        <>
          <label className="form__label">Location:</label>
          <select
            className="form__field form__field--select"
            name="location-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            {Object.values(locations).map((location) => (
              <option className="form__field--option" value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
        </>
      )}
      <section className="form__actions">
        {!isNew && (
          <button className="form__button" onClick={() => setIsNew(true)}>
            Create new location
          </button>
        )}
        <button className="form__button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="form__button form__button--cta"
          onClick={() => {
            addLocation(name);
            setIsComplete(true);
          }}
          disabled={isInvalid}
        >
          Submit
        </button>
      </section>
    </dialog>,
    document.getElementById("modal-root")
  );
}
