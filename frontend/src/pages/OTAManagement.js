import React, { useState, useEffect } from 'react';
import { uploadFirmware, getFirmwareVersions, deployFirmware, getNodes } from '../api/apiClient';

const OTAManagement = () => {
  const [firmwareVersions, setFirmwareVersions] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [newVersion, setNewVersion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedNodeForDeploy, setSelectedNodeForDeploy] = useState('');
  const [selectedFirmwareForDeploy, setSelectedFirmwareForDeploy] = useState('');
  const [message, setMessage] = useState('');

  const fetchFirmwareVersions = async () => {
    try {
      const response = await getFirmwareVersions();
      setFirmwareVersions(response.data);
    } catch (error) {
      setMessage(`Error fetching firmware versions: ${error.response?.data?.detail || error.message}`);
    }
  };

  const fetchNodes = async () => {
    try {
      const response = await getNodes();
      setNodes(response.data);
    } catch (error) {
      setMessage(`Error fetching nodes: ${error.response?.data?.detail || error.message}`);
    }
  };

  useEffect(() => {
    fetchFirmwareVersions();
    fetchNodes();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadFirmware = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newVersion || !selectedFile) {
      setMessage('Please provide a version and select a file.');
      return;
    }

    try {
      await uploadFirmware(newVersion, selectedFile);
      setMessage('Firmware uploaded successfully!');
      setNewVersion('');
      setSelectedFile(null);
      fetchFirmwareVersions(); // Refresh list
    } catch (error) {
      setMessage(`Error uploading firmware: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleDeployFirmware = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!selectedNodeForDeploy || !selectedFirmwareForDeploy) {
      setMessage('Please select a node and a firmware version to deploy.');
      return;
    }

    try {
      await deployFirmware(selectedNodeForDeploy, selectedFirmwareForDeploy);
      setMessage(`Firmware ${selectedFirmwareForDeploy} deployed to ${selectedNodeForDeploy} successfully!`);
      setSelectedNodeForDeploy('');
      setSelectedFirmwareForDeploy('');
    } catch (error) {
      setMessage(`Error deploying firmware: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">OTA Management</h1>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Upload New Firmware</h2>
        <form onSubmit={handleUploadFirmware}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="version">
              Version
            </label>
            <input
              type="text"
              id="version"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newVersion}
              onChange={(e) => setNewVersion(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firmwareFile">
              Firmware File
            </label>
            <input
              type="file"
              id="firmwareFile"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleFileChange}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Upload Firmware
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Deploy Firmware to Node</h2>
        <form onSubmit={handleDeployFirmware}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nodeSelect">
              Select Node
            </label>
            <select
              id="nodeSelect"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedNodeForDeploy}
              onChange={(e) => setSelectedNodeForDeploy(e.target.value)}
              required
            >
              <option value="">-- Select a Node --</option>
              {nodes.map(node => (
                <option key={node.id} value={node.node_id}>{node.node_id}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firmwareSelect">
              Select Firmware Version
            </label>
            <select
              id="firmwareSelect"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedFirmwareForDeploy}
              onChange={(e) => setSelectedFirmwareForDeploy(e.target.value)}
              required
            >
              <option value="">-- Select a Version --</option>
              {firmwareVersions.map(fw => (
                <option key={fw.id} value={fw.version}>{fw.version}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Deploy Firmware
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-x-auto bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Available Firmware Versions</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Version</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Filename</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Upload Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {firmwareVersions.map(fw => (
              <tr key={fw.id}>
                <td className="px-6 py-4 whitespace-nowrap">{fw.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{fw.version}</td>
                <td className="px-6 py-4 whitespace-nowrap">{fw.filename}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(fw.upload_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OTAManagement;
