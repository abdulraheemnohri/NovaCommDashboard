import React, { useState, useEffect } from 'react';

function NodeConfiguration() {
  const [nodeId, setNodeId] = useState('');
  const [config, setConfig] = useState({
    meshRoutingEnabled: true,
    aiOptimizationEnabled: true,
    securityLevel: 'high',
    powerManagementMode: 'auto',
    otaHistory: [],
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLoadConfig = () => {
    if (!nodeId) {
      setMessage('Please enter a node ID to load configuration.');
      return;
    }
    // Fetch node config from backend (stub)
    setMessage(`Loaded configuration for node ${nodeId} (stub).`);
  };

  const handleSaveConfig = () => {
    if (!nodeId) {
      setMessage('Please enter a node ID to save configuration.');
      return;
    }
    // Save node config to backend (stub)
    setMessage(`Saved configuration for node ${nodeId} (stub).`);
  };

  return (
    <div>
      <h2>Node Configuration</h2>
      <div>
        <label>Node ID: </label>
        <input type="text" value={nodeId} onChange={e => setNodeId(e.target.value)} />
        <button onClick={handleLoadConfig}>Load Config</button>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="meshRoutingEnabled"
            checked={config.meshRoutingEnabled}
            onChange={handleInputChange}
          />
          Mesh Routing Enabled
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="aiOptimizationEnabled"
            checked={config.aiOptimizationEnabled}
            onChange={handleInputChange}
          />
          AI Optimization Enabled
        </label>
      </div>
      <div>
        <label>Security Level: </label>
        <select name="securityLevel" value={config.securityLevel} onChange={handleInputChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label>Power Management Mode: </label>
        <select name="powerManagementMode" value={config.powerManagementMode} onChange={handleInputChange}>
          <option value="auto">Auto</option>
          <option value="manual">Manual</option>
          <option value="sleep">Sleep</option>
        </select>
      </div>
      <div>
        <h3>OTA Update History</h3>
        <ul>
          {config.otaHistory.length === 0 ? (
            <li>No OTA updates yet.</li>
          ) : (
            config.otaHistory.map((entry, idx) => <li key={idx}>{entry}</li>)
          )}
        </ul>
      </div>
      <button onClick={handleSaveConfig}>Save Configuration</button>
      <p>{message}</p>
    </div>
  );
}

export default NodeConfiguration;
