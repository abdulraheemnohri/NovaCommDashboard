import React, { useEffect, useState } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    dashboard_theme: 'light',
    notifications_enabled: true,
    data_refresh_interval_sec: 5
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).then(() => alert('Settings updated'));
  };

  return (
    <div>
      <h1>General Settings</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Dashboard Theme:
          <select name="dashboard_theme" value={settings.dashboard_theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            name="notifications_enabled"
            checked={settings.notifications_enabled}
            onChange={handleChange}
          />
          Enable Notifications
        </label>
        <br />
        <label>
          Data Refresh Interval (seconds):
          <input
            type="number"
            name="data_refresh_interval_sec"
            value={settings.data_refresh_interval_sec}
            onChange={handleChange}
            min="1"
          />
        </label>
        <br />
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
}

export default Settings;
