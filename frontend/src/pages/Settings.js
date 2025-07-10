import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [apiBaseUrl, setApiBaseUrl] = useState('http://127.0.0.1:8000/api');
  const [wsUrl, setWsUrl] = useState('ws://127.0.0.1:8000/ws');
  const [mqttBrokerHost, setMqttBrokerHost] = useState('localhost');
  const [mqttBrokerPort, setMqttBrokerPort] = useState('1883');
  const [dashboardRefreshInterval, setDashboardRefreshInterval] = useState(5);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load saved settings from localStorage (or a more persistent store)
    setApiBaseUrl(localStorage.getItem('apiBaseUrl') || 'http://127.0.0.1:8000/api');
    setWsUrl(localStorage.getItem('wsUrl') || 'ws://127.0.0.1:8000/ws');
    setMqttBrokerHost(localStorage.getItem('mqttBrokerHost') || 'localhost');
    setMqttBrokerPort(localStorage.getItem('mqttBrokerPort') || '1883');
    setDashboardRefreshInterval(localStorage.getItem('dashboardRefreshInterval') || '5');
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('apiBaseUrl', apiBaseUrl);
    localStorage.setItem('wsUrl', wsUrl);
    localStorage.setItem('mqttBrokerHost', mqttBrokerHost);
    localStorage.setItem('mqttBrokerPort', mqttBrokerPort);
    localStorage.setItem('dashboardRefreshInterval', dashboardRefreshInterval);
    setMessage('Settings saved successfully!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">API & WebSocket Configuration</h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apiBaseUrl">
              API Base URL
            </label>
            <input
              type="text"
              id="apiBaseUrl"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wsUrl">
              WebSocket URL
            </label>
            <input
              type="text"
              id="wsUrl"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
            />
          </div>

          <h2 className="text-lg font-semibold mb-4">MQTT Broker Configuration (Backend Bridge)</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mqttBrokerHost">
              MQTT Broker Host
            </label>
            <input
              type="text"
              id="mqttBrokerHost"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={mqttBrokerHost}
              onChange={(e) => setMqttBrokerHost(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mqttBrokerPort">
              MQTT Broker Port
            </label>
            <input
              type="number"
              id="mqttBrokerPort"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={mqttBrokerPort}
              onChange={(e) => setMqttBrokerPort(e.target.value)}
            />
          </div>

          <h2 className="text-lg font-semibold mb-4">Dashboard Display Settings</h2>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dashboardRefreshInterval">
              Dashboard Refresh Interval (seconds)
            </label>
            <input
              type="number"
              id="dashboardRefreshInterval"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={dashboardRefreshInterval}
              onChange={(e) => setDashboardRefreshInterval(e.target.value)}
              min="1"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Settings
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default Settings;
