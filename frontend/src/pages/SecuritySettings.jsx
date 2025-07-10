import React, { useEffect, useState } from 'react';

function SecuritySettings() {
  const [settings, setSettings] = useState({
    encryption_enabled: true,
    key_rotation_interval_days: 30,
    access_control_enabled: true,
    allowed_roles: ['admin', 'viewer']
  });

  useEffect(() => {
    fetch('/api/security/settings')
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

  const handleRolesChange = (e) => {
    const roles = e.target.value.split(',').map(r => r.trim());
    setSettings(prev => ({
      ...prev,
      allowed_roles: roles
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/security/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).then(() => alert('Settings updated'));
  };

  return (
    <div>
      <h1>Security Settings</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            name="encryption_enabled"
            checked={settings.encryption_enabled}
            onChange={handleChange}
          />
          Encryption Enabled
        </label>
        <br />
        <label>
          Key Rotation Interval (days):
          <input
            type="number"
            name="key_rotation_interval_days"
            value={settings.key_rotation_interval_days}
            onChange={handleChange}
            min="1"
          />
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            name="access_control_enabled"
            checked={settings.access_control_enabled}
            onChange={handleChange}
          />
          Access Control Enabled
        </label>
        <br />
        <label>
          Allowed Roles (comma separated):
          <input
            type="text"
            value={settings.allowed_roles.join(', ')}
            onChange={handleRolesChange}
          />
        </label>
        <br />
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
}

export default SecuritySettings;
