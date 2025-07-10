import React, { useState } from 'react';
import { sendNodeCommand } from '../api/apiClient';

const NodeCommands = ({ nodeId }) => {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');

  const handleSendCommand = async () => {
    setResponse('Sending command...');
    try {
      const res = await sendNodeCommand(nodeId, command);
      setResponse(`Command sent. Simulated response: ${res.message}`);
    } catch (error) {
      setResponse(`Error sending command: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Send Command to Node</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter command (e.g., REBOOT, GET_STATUS)"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSendCommand}
        >
          Send
        </button>
      </div>
      {response && <p className="mt-2 text-sm text-gray-600">{response}</p>}
    </div>
  );
};

export default NodeCommands;