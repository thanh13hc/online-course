import "./App.css";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "leaflet";
import "leaflet.browser.print/dist/leaflet.browser.print.min.js";
import "leaflet-routing-machine";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet.locatecontrol";
import "leaflet-side-by-side";
import "leaflet.sync";
import "leaflet.markercluster";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Basic from "./Basic";
import RoutingMachine from "./RoutingMachine";
import AdvanceSpatialAnalysis from "./AdvanceSpatialAnalysis";
import MapComparison from "./MapComparison";
import MarkerCluster from "./MarkerCluster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/basic" element={<Basic />} />
        <Route path="/routing-machine" element={<RoutingMachine />} />
        <Route
          path="/advance-spatial-analysis"
          element={<AdvanceSpatialAnalysis />}
        />
        <Route path="/map-comparison" element={<MapComparison />} />
        <Route path="/marker-cluster" element={<MarkerCluster />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
