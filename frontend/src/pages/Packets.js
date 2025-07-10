import React, { useState, useEffect } from 'react';
import { getPackets } from '../api/apiClient';
import useWebSocket from '../lib/useWebSocket';

const Packets = () => {
  const [packets, setPackets] = useState([]);

  const wsMessage = useWebSocket('ws://127.0.0.1:8000/ws');

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPackets();
      setPackets(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (wsMessage && wsMessage.type === 'new_packet') {
      setPackets((prevPackets) => [...prevPackets, wsMessage.data]);
    }
  }, [wsMessage]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Packets</h1>
      <div className="mt-6 overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Timestamp</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Node UUID</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Payload</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">SNR</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">RSSI</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packets.map(packet => (
              <tr key={packet.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(packet.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{packet.node_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{packet.payload}</td>
                <td className="px-6 py-4 whitespace-nowrap">{packet.snr}</td>
                <td className="px-6 py-4 whitespace-nowrap">{packet.rssi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Packets;
