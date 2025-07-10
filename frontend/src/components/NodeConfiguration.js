import React, { useState, useEffect } from 'react';
import { configureNode, getNodeConfiguration } from '../api/apiClient';

const NodeConfiguration = ({ nodeId }) => {
  const [config, setConfig] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getNodeConfiguration(nodeId);
        setConfig(response.data);
      } catch (error) {
        setMessage(`Error fetching configuration: ${error.response?.data?.detail || error.message}`);
      }
    };
    fetchConfig();
  }, [nodeId]);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const updateConfiguration = async () => {
    setMessage('Updating configuration...');
    try {
      const res = await configureNode(nodeId, config);
      setMessage(`Configuration updated: ${JSON.stringify(res.data.configuration)}`);
    } catch (error) {
      setMessage(`Error updating configuration: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Node Configuration</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reportingInterval">
          Reporting Interval (seconds)
        </label>
        <input
          type="number"
          id="reportingInterval"
          name="reporting_interval"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={config.reporting_interval || ''}
          onChange={handleConfigChange}
          min="1"
        />
      </div>
      {/* Add more configuration fields as needed */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={updateConfiguration}
      >
        Update Configuration
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default NodeConfiguration;
