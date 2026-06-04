import {
  LayersControl,
  MapContainer,
  Marker,
  ScaleControl,
  TileLayer,
  useMapEvent,
  ZoomControl,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import type { MapRef } from "react-leaflet/MapContainer";
import MeasureControl from "react-leaflet-measure";
import { LocateControl } from "leaflet.locatecontrol";

function Basic() {
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let marker: L.Marker, circle: L.Circle;
    let firstTime = true;
    function getCurrentGeoLocation(geoLocation: GeolocationPosition) {
      const newPos: L.LatLngExpression = [
        geoLocation.coords.latitude,
        geoLocation.coords.longitude,
      ];
      if (marker) {
        marker.remove();
      }
      if (circle) {
        circle.remove();
      }
      marker = L.marker(newPos);
      circle = L.circle(newPos, {
        radius: geoLocation.coords.accuracy,
      });
      const featureGroup = L.featureGroup([marker, circle]);
      ref.current?.addLayer(featureGroup);
      ref.current?.fitBounds(featureGroup.getBounds());
    }
    if (navigator.geolocation) {
      if (firstTime) {
        navigator.geolocation.getCurrentPosition(getCurrentGeoLocation);
        firstTime = false;
      }
      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(getCurrentGeoLocation);
      }, 10000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<MapRef>(null);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: "0%",
          left: "50%",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          zIndex: 1000,
          translate: "-50% 0",
        }}
      >
        <button
          onClick={() => {
            document.querySelector(".leaflet-container").requestFullscreen();
          }}
        >
          Request fullscreen
        </button>
      </div>

      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={[0, 0]}
        zoom={10}
        zoomControl={false}
        ref={ref}
        maxZoom={25}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />
        <ScaleControl position="bottomright" />
        <ZoomControl position="topright" />

        <Marker
          position={[21.02385, 105.793]}
          draggable
          title="This is hover text for marker"
          opacity={1}
        >
          <Popup>
            <h1>Marker</h1>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Voluptatum cumque at sapiente, nisi repudiandae laborum alias
              rerum labore voluptates modi autem fugit quis? Vitae iste quam non
              in sunt aperiam!
            </p>
            <img
              style={{ width: "100%", aspectRatio: 1 }}
              src="https://cdn2.fptshop.com.vn/unsafe/800x0/background_bien_3_4709ba4baa.jpg"
            />
          </Popup>
        </Marker>

        <LayersControl collapsed={false}>
          <LayersControl.BaseLayer name="goole map">
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="openstreet map">
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapCoordElement />

        {/* PLUGINS */}
        <PrintMapPlugin />
        <MeasureControl />
        <SearchPlugin />
        <FindCurrentUserLocationPlugin />
      </MapContainer>
    </div>
  );
}

function MapCoordElement() {
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });

  const map = useMapEvent("mousemove", (e) => {
    console.log(e);
    setTimeout(() => {
      setCoords(e.latlng);
    }, 300);
  });

  useEffect(() => {
    setCoords({ lat: map.getCenter().lat, lng: map.getCenter().lng });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "1rem",
        left: "1rem",
        zIndex: 1000,
        background: "white",
        padding: "0.5rem 1rem",
        borderRadius: "1rem",
        boxShadow: "0 1rem 2rem rgba(0,0,0,0.5)",
      }}
    >
      <div>Lat: {coords.lat}</div>
      <div>Lang: {coords.lng}</div>
    </div>
  );
}

function PrintMapPlugin() {
  const map = useMap();

  useEffect(() => {
    const control = (L.control as any)
      .browserPrint({
        title: "Print Map",
        printModesNames: {
          Portrait: "Portrait",
          Landscape: "Landscape",
          Auto: "Auto",
          Custom: "Sélect Area",
        },
      })
      .addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
}

function SearchPlugin() {
  const map = useMap();
  useEffect(() => {
    (L.Control as any).geocoder().addTo(map);
  }, []);

  return null;
}

function FindCurrentUserLocationPlugin() {
  const map = useMap();
  useEffect(() => {
    new LocateControl().addTo(map);
  }, []);

  return null;
}

export default Basic;
