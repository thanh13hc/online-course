import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import { hqData } from "./data/nepal-districts-hq";
import { nepalGeoJsonData } from "./data/nepal-districts";
import * as turf from "@turf/turf";
import "./index.css";
import { useRef } from "react";
import { type MapRef } from "react-leaflet/MapContainer";
import L from "leaflet";

const lineString = turf.lineString(
  [
    [84.124, 28.3949],
    [81.124, 29.3949],
    [86.124, 27.3949],
    [90.124, 32.3949],
  ],
  { name: "line string 1" },
);

const poli1 = turf.polygon(
  [
    [
      [84.124, 28.3949],
      [88.124, 29.3949],
      [83.124, 31.3949],
      [86.124, 26.3949],
      [84.124, 28.3949],
    ],
  ],
  { name: "poli 1" },
);

const randomPoint = turf.randomPoint(25, { bbox: [80, 20, 90, 30] });

let promisesFn = [];

export default function AdvanceSpatialAnalysis() {
  const mapRef = useRef<MapRef>(null);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapContainer
        ref={(map) => {
          if (map) {
            mapRef.current = map;

            promisesFn.forEach((fn) => fn(map));

            promisesFn = [];
          }
        }}
        style={{ width: "100%", height: "100%" }}
        center={[28.3949, 84.124]}
        zoom={8}
      >
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />

        <LayersControl collapsed={false}>
          <LayersControl.BaseLayer name="OSM">
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Nepal district">
            <GeoJSON
              data={nepalGeoJsonData}
              onEachFeature={(feature, layer) => {
                const area = (turf.area(feature) / 1_000_000).toFixed(2);
                const centerLat = turf.center(feature).geometry.coordinates[1];
                const centerLng = turf.center(feature).geometry.coordinates[0];
                const bbox = turf.bbox(feature).toString();

                layer.bindPopup(`<b>Area: </b>${area} <br/>
                  <b>Center(x,y): </b>${centerLat},${centerLng} <br/>
                  <b>Bbox: </b> [${bbox}]
                  `);
              }}
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Nepal Headquater">
            <GeoJSON
              data={hqData}
              onEachFeature={(feature, layer) => {
                const buffer = turf.buffer(feature, 5, {
                  units: "kilometers",
                });

                if (!mapRef.current) {
                  promisesFn.push((map) =>
                    L.geoJSON(buffer, {
                      onEachFeature(feature, layer) {
                        layer.bindPopup(
                          `This area nearby HQ ${feature.properties.HQ_NAME}`,
                        );
                      },
                    }).addTo(map),
                  );
                  return;
                }

                L.geoJSON(buffer).addTo(mapRef.current);
              }}
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Turf data">
            <LayerGroup>
              <GeoJSON data={poli1} />
              <GeoJSON data={lineString} />
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="random point">
            <GeoJSON data={randomPoint} />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
