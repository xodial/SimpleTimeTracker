import { useLayoutEffect } from "react";

import { Controls } from "./_controls";
import { Day } from "./_day";
import { Nav } from "./_nav";
import { LocationsProvider } from "./_locations-state";
import { TimesheetProvider } from "./_timesheet-state";

import { LocationDialog } from "./_location-dialog";

export function App() {
  useLayoutEffect(() => {
    function onResize() {
      const height = window.innerHeight;
      document.documentElement.style.setProperty("--vh-100", `${height}px`);
    }

    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <LocationsProvider>
      <TimesheetProvider>
        <main className="app">
          <Nav />
          <Day />
          <Controls />
        </main>
      </TimesheetProvider>
    </LocationsProvider>
  );

  return (
    <LocationsProvider>
      <LocationDialog />
    </LocationsProvider>
  );
}
