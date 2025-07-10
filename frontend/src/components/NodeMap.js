import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const NodeMap = ({ nodes }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">Node Map</h2>
      <div className="mt-2 bg-white rounded-lg shadow-md" style={{ height: '500px' }}>
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {nodes.map(node => (
            node.lat && node.lng &&
            <Marker key={node.id} position={[node.lat, node.lng]}>
              <Popup>
                <strong>{node.name || node.uuid}</strong><br />
                Status: {node.status}<br />
                Mode: {node.mode}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default NodeMap;