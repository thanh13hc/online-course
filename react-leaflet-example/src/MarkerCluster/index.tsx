import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { data } from "./data";
import L from "leaflet";

const markers = (L as any).markerClusterGroup();

const geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

function MarkerCluster() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapContainer
        ref={(ref) => {
          if (ref) {
            // ref.addLayer(markers);
          }
        }}
        style={{ width: "100%", height: "100%" }}
        center={[28.2521, 83.9774]}
        zoom={15}
        maxZoom={22}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          maxNativeZoom={20}
          maxZoom={22}
        />
        <GeoJSON
          data={data}
          onEachFeature={(feature, layer) => {
            const popupContent =
              '<h4 class = "text-primary">Street Light</h4>' +
              '<div class="container"><table class="table table-striped">' +
              "<thead><tr><th>Properties</th><th>Value</th></tr></thead>" +
              "<tbody><tr><td> Name </td><td>" +
              feature.properties.Name +
              "</td></tr>" +
              "<tr><td>Elevation </td><td>" +
              feature.properties.ele +
              "</td></tr>" +
              "<tr><td> Power (watt) </td><td>" +
              feature.properties.Power_Watt +
              "</td></tr>" +
              "<tr><td> Pole Height </td><td>" +
              feature.properties.pole_hgt +
              "</td></tr>" +
              "<tr><td> Time </td><td>" +
              feature.properties.time +
              "</td></tr>";

            layer.bindPopup(popupContent);
          }}
          pointToLayer={(_, latlng) => {
            const marker = L.circleMarker(latlng, geojsonMarkerOptions);

            return markers.addLayer(marker);
          }}
        />
      </MapContainer>
    </div>
  );
}

export default MarkerCluster;
