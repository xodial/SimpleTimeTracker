import { createContext, useContext, useEffect, useState } from "react";

import { getLastCoordinates } from "./utils";

const STORAGE_KEY = "locations";

const LocationsContext = createContext();
const LocationsApiContext = createContext();

export function useLocations() {
  return useContext(LocationsContext);
}

export function useLocationsApi() {
  return useContext(LocationsApiContext);
}

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState(readFromStorage);
  const [locationsApi] = useState(createApi(setLocations));

  useEffect(() => {
    writeToStorage(locations);
    console.log(locations);
  }, [locations]);

  return (
    <LocationsContext.Provider value={locations}>
      <LocationsApiContext.Provider value={locationsApi}>
        {children}
      </LocationsApiContext.Provider>
    </LocationsContext.Provider>
  );
}

function readFromStorage() {
  const locationsJson = localStorage.getItem(STORAGE_KEY);
  return locationsJson ? sort(JSON.parse(locationsJson)) : [];
}

function writeToStorage(locations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
}

function createApi(setLocations) {
  return {
    addLocation: addLocation(setLocations)
  };
}

function sort(locations) {
  locations.sort((a, b) => a.name.localeCompare(b.name));
  return locations;
}

const addLocation = (setLocations) => (name) => {
  const coords = getLastCoordinates();
  setLocations((locations) =>
    sort([...locations.filter((loc) => loc.name !== name), { name, coords }])
  );
};
