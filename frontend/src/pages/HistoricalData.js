import React, { useState, useEffect } from 'react';
import { getPackets, getNodes } from '../api/apiClient';
import PacketChart from '../components/PacketChart';

const HistoricalData = () => {
  const [packets, setPackets] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchNodes = async () => {
      const response = await getNodes();
      setNodes(response.data);
    };
    fetchNodes();
  }, []);

  const fetchData = async () => {
    const params = {};
    if (selectedNode) params.node_uuid = selectedNode; // Use node_uuid
    if (startDate) params.start_time = new Date(startDate).toISOString();
    if (endDate) params.end_time = new Date(endDate).toISOString();

    const response = await getPackets(params);
    setPackets(response.data);
  };

  useEffect(() => {
    fetchData();
  }, [selectedNode, startDate, endDate]); // Refetch when filters change

  return (
    <div>
      <h1 className="text-3xl font-bold">Historical Data</h1>
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Filter Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nodeFilter">
              Node UUID
            </label>
            <select
              id="nodeFilter"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedNode}
              onChange={(e) => setSelectedNode(e.target.value)}
            >
              <option value="">All Nodes</option>
              {nodes.map(node => (
                <option key={node.id} value={node.uuid}>{node.name || node.uuid}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
              Start Date
            </label>
            <input
              type="datetime-local"
              id="startDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
              End Date
            </label>
            <input
              type="datetime-local"
              id="endDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Packet Data</h2>
        <div className="mt-2 p-6 bg-white rounded-lg shadow-md">
          {packets.length > 0 ? (
            <PacketChart packets={packets} />
          ) : (
            <p>No data available for the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;