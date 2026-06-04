import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";

function RoutingMachine() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={[21.02, 105.85]}
        zoom={15}
        maxZoom={20}
      >
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />

        <MapController />
      </MapContainer>
    </div>
  );
}

function MapController() {
  const map = useMap();

  useEffect(() => {
    const icon = L.icon({
      iconUrl:
        "https://www.freeiconspng.com/thumbs/car-png/red-sports-car-png-1.png",
      iconSize: [100, 100],
    });

    const marker = L.marker([21.02, 105.85], { icon }).addTo(map);
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(21.02, 105.85),
        L.latLng(21.024479794982973, 105.78968895310015),
      ],
    })
      .on("routesfound", (e: any) => {
        console.log({ route: e });

        e.routes[0].coordinates.forEach((coord, idx) => {
          setTimeout(() => {
            const coords: LatLngExpression = [coord.lat, coord.lng];
            map.flyTo(coords, 16);
            marker.setLatLng(coords);
          }, 100 * idx);
        });
      })
      .addTo(map);

    return () => {
      routingControl.remove();
    };
  }, [map]);

  return null;
}

export default RoutingMachine;
