import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Cpu, Mail, Settings, BarChart2, Users, LogOut, Upload, Calendar } from 'lucide-react';

const Layout = ({ children, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">NovaComm++</div>
        <nav className="flex-grow mt-10">
          <NavLink to="/" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white">
            <Home className="w-5 h-5" />
            <span className="mx-4">Dashboard</span>
          </NavLink>
          <NavLink to="/nodes" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white">
            <Cpu className="w-5 h-5" />
            <span className="mx-4">Nodes</span>
          </NavLink>
          <NavLink to="/packets" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white">
            <Mail className="w-5 h-5" />
            <span className="mx-4">Packets</span>
          </NavLink>
          <NavLink to="/historical-data" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white">
            <BarChart2 className="w-5 h-5" />
            <span className="mx-4">Historical Data</span>
          </NavLink>
          <NavLink to="/users" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white">
            <Users className="w-5 h-5" />
            <span className="mx-4">User Management</span>
          </NavLink>
          <NavLink to="/ota" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white">
            <Upload className="w-5 h-5" />
            <span className="mx-4">OTA Management</span>
          </NavLink>
          <NavLink to="/jobs" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white">
            <Calendar className="w-5 h-5" />
            <span className="mx-4">Job Scheduler</span>
          </NavLink>
          <NavLink to="/settings" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white">
            <Settings className="w-5 h-5" />
            <span className="mx-4">Settings</span>
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span className="mx-4">Logout</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">NovaComm++ Dashboard</h1>
          {/* Future: User profile, notifications, etc. */}
        </header>
        <main className="flex-1 p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;