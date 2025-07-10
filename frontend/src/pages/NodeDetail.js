import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNode, rebootNode, firmwareUpdateNode, deleteNode, setNodeMode } from '../api/apiClient';
import NodeCommands from '../components/NodeCommands';
import NodeConfiguration from '../components/NodeConfiguration';

const NodeDetail = () => {
  const { nodeId } = useParams(); // This is now node_uuid
  const navigate = useNavigate();
  const [node, setNode] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState('');

  useEffect(() => {
    const fetchNode = async () => {
      try {
        const response = await getNode(nodeId);
        setNode(response.data);
        setSelectedMode(response.data.mode || '');
      } catch (error) {
        console.error('Error fetching node details:', error);
        setMessage(`Error fetching node details: ${error.response?.data?.detail || error.message}`);
      }
    };
    fetchNode();
  }, [nodeId]);

  const handleReboot = async () => {
    setMessage('Sending reboot command...');
    try {
      const res = await rebootNode(nodeId);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(`Error sending reboot command: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleFirmwareUpdate = async () => {
    setMessage('Sending firmware update command...');
    try {
      const res = await firmwareUpdateNode(nodeId);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(`Error sending firmware update command: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete node ${nodeId}?`)) {
      setMessage('Deleting node...');
      try {
        const res = await deleteNode(nodeId);
        setMessage(res.data.message);
        navigate('/nodes'); // Redirect to nodes list after deletion
      } catch (error) {
        setMessage(`Error deleting node: ${error.response?.data?.detail || error.message}`);
      }
    }
  };

  const handleModeChange = async () => {
    if (!selectedMode) {
      setMessage('Please select a mode.');
      return;
    }
    setMessage(`Switching node ${nodeId} to ${selectedMode} mode...`);
    try {
      const res = await setNodeMode(nodeId, selectedMode);
      setMessage(res.data.message);
      // Update local node state to reflect new mode
      setNode(prevNode => ({ ...prevNode, mode: selectedMode }));
    } catch (error) {
      setMessage(`Error switching mode: ${error.response?.data?.detail || error.message}`);
    }
  };

  if (!node) {
    return <div>Loading node details...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Node: {node.name || node.uuid}</h1>
      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <p><strong>UUID:</strong> {node.uuid}</p>
        <p><strong>Status:</strong> {node.status}</p>
        <p><strong>Current Mode:</strong> {node.mode}</p>
        <p><strong>Last Seen:</strong> {new Date(node.last_seen).toLocaleString()}</p>
        <p><strong>Location:</strong> {node.lat && node.lng ? `${node.lat}, ${node.lng}` : 'N/A'}</p>
        <p><strong>TX Power:</strong> {node.tx_power || 'N/A'}</p>
        <p><strong>Frequency:</strong> {node.freq || 'N/A'}</p>
        <p><strong>Bandwidth:</strong> {node.bandwidth || 'N/A'}</p>
        <p><strong>AI Model:</strong> {node.ai_model || 'N/A'}</p>
        <p><strong>Firmware:</strong> {node.firmware || 'N/A'}</p>
      </div>
      
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Node Actions</h2>
        <div className="flex space-x-4 mb-4">
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleReboot}
          >
            Reboot Node
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleFirmwareUpdate}
          >
            Firmware Update
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleDelete}
          >
            Delete Node
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="nodeMode" className="text-gray-700">Switch Mode:</label>
          <select
            id="nodeMode"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
          >
            <option value="">-- Select Mode --</option>
            <option value="energy_saver">Energy Saver</option>
            <option value="emergency">Emergency</option>
            <option value="normal">Normal</option>
          </select>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleModeChange}
          >
            Apply Mode
          </button>
        </div>
      </div>

      <NodeCommands nodeId={node.uuid} />
      <NodeConfiguration nodeId={node.uuid} />
    </div>
  );
};

export default NodeDetail;