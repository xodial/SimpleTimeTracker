const DAY_FORMAT = new Intl.DateTimeFormat("default", {
  dateStyle: "medium"
});

const TIME_FORMAT = new Intl.DateTimeFormat("default", {
  hour: "2-digit",
  minute: "2-digit"
});

const EARTH_RADIUS_KM = 6371;

export function dateKey(date) {
  return startOfDay(date).toISOString().split("T")[0];
}

export function startOfDay(date = new Date()) {
  const start = new Date(date);

  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);

  return start;
}

export function formatDay(date) {
  return DAY_FORMAT.format(new Date(date));
}

export function formatTime(date) {
  return TIME_FORMAT.format(new Date(date));
}

export function cn(...args) {
  return args.filter((arg) => !!arg).join(" ");
}

export function abbrev(input) {
  return input
    .split(/\s+|,|-/)
    .map((w) => w[0].toUpperCase())
    .join("");
}

let lastCoords;

export async function getCurrentCoordinates() {
  const {
    coords: { latitude, longitude }
  } = await new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, (error) => {
      rej(error);
    });
  });

  lastCoords = { latitude, longitude };
  return lastCoords;
}

export function getLastCoordinates() {
  if (!lastCoords) {
    throw new Error("No coordinates have been captured");
  }

  return lastCoords;
}

export function getDistance(
  { latitude: lat1, longitude: lon1 },
  { latitude: lat2, longitude: lon2 }
) {
  var deltaLat = deg2rad(lat2 - lat1);
  var deltaLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(deltaLon / 2) ** 2;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = EARTH_RADIUS_KM * c;
  return d * 1000;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
