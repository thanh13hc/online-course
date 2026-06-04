import { MapContainer, TileLayer } from "react-leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-side-by-side";
import type { MapRef } from "react-leaflet/MapContainer";

type Mode = "side-by-side" | "sync";

const GOOGLE_TILES = "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
const GOOGLE_SUBDOMAINS = ["mt0", "mt1", "mt2", "mt3"];
const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_SUBDOMAINS = ["a", "b", "c"];

const MAP_DEFAULTS = {
  center: [20, 80] as [number, number],
  zoom: 10,
  zoomControl: false,
  style: { width: "100%", height: "100%" },
};

const TOOLBAR_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  zIndex: 1000,
};

export default function MapComparison() {
  const [mode, setMode] = useState<Mode>("side-by-side");

  const toggle = () =>
    setMode((m) => (m === "side-by-side" ? "sync" : "side-by-side"));

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div style={TOOLBAR_STYLE}>
        <button onClick={toggle}>
          {mode === "side-by-side" ? "Sync mode" : "Side by Side mode"}
        </button>
      </div>
      {mode === "side-by-side" ? <SideBySideMap /> : <SyncMap />}
    </div>
  );
}

function SideBySideMap() {
  const attach = useCallback((map: MapRef) => {
    if (!map) return;

    const left = L.tileLayer(GOOGLE_TILES, {
      subdomains: GOOGLE_SUBDOMAINS,
    }).addTo(map);
    const right = L.tileLayer(OSM_TILES, {
      subdomains: OSM_SUBDOMAINS,
    }).addTo(map);

    (
      L.control as unknown as {
        sideBySide: (l: L.Layer, r: L.Layer) => L.Control;
      }
    )
      .sideBySide(left, right)
      .addTo(map);
  }, []);

  return <MapContainer ref={attach} {...MAP_DEFAULTS} />;
}

function SyncMap() {
  const [readyCount, setIsReadyCount] = useState(0);
  const ggMapRef = useRef(null);
  const osmMapRef = useRef(null);

  useEffect(() => {
    if (readyCount === 2) {
      ggMapRef.current.sync(osmMapRef.current);
      osmMapRef.current.sync(ggMapRef.current);
    }
  }, [readyCount]);

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <div style={{ width: "50%" }} key="gg-map">
        <MapContainer
          ref={ggMapRef}
          {...MAP_DEFAULTS}
          whenReady={() => {
            setIsReadyCount((pre) => (pre += 1));
          }}
        >
          <TileLayer url={GOOGLE_TILES} subdomains={GOOGLE_SUBDOMAINS} />
        </MapContainer>
      </div>
      <div style={{ width: "50%" }} key="osm-map">
        <MapContainer
          ref={osmMapRef}
          {...MAP_DEFAULTS}
          whenReady={() => {
            setIsReadyCount((pre) => (pre += 1));
          }}
        >
          <TileLayer url={OSM_TILES} subdomains={OSM_SUBDOMAINS} />
        </MapContainer>
      </div>
    </div>
  );
}
