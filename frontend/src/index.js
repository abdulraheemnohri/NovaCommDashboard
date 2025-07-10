import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import MeshMonitoring from './pages/MeshMonitoring';
import SecuritySettings from './pages/SecuritySettings';
import TaskScheduler from './pages/TaskScheduler';
import Analytics from './pages/Analytics';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import NodeConfiguration from './pages/NodeConfiguration';

function Main() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/mesh-monitoring">Mesh Monitoring</Link></li>
            <li><Link to="/security-settings">Security Settings</Link></li>
            <li><Link to="/task-scheduler">Task Scheduler</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
            <li><Link to="/user-management">User Management</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/node-configuration">Node Configuration</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/mesh-monitoring" element={<MeshMonitoring />} />
          <Route path="/security-settings" element={<SecuritySettings />} />
          <Route path="/task-scheduler" element={<TaskScheduler />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/node-configuration" element={<NodeConfiguration />} />
        </Routes>
      </div>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
