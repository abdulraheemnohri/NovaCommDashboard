import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNodes } from '../api/apiClient';
import useWebSocket from '../lib/useWebSocket';
import NodeRegistration from '../components/NodeRegistration';

const Nodes = () => {
  const [nodes, setNodes] = useState([]);

  const wsMessage = useWebSocket('ws://127.0.0.1:8000/ws');

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNodes();
      setNodes(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (wsMessage) {
      if (wsMessage.type === 'new_node') {
        setNodes((prevNodes) => [...prevNodes, wsMessage.data]);
      } else if (wsMessage.type === 'node_update') {
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.uuid === wsMessage.data.uuid ? wsMessage.data : node
          )
        );
      } else if (wsMessage.type === 'node_deleted') {
        setNodes((prevNodes) =>
          prevNodes.filter((node) => node.uuid !== wsMessage.data.uuid)
        );
      }
    }
  }, [wsMessage]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Nodes</h1>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Node UUID</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Mode</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Last Seen</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nodes.map(node => (
                <tr key={node.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/nodes/${node.uuid}`} className="text-blue-600 hover:text-blue-900">
                      {node.uuid}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{node.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${node.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {node.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{node.mode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(node.last_seen).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{node.lat && node.lng ? `${node.lat}, ${node.lng}` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <NodeRegistration />
      </div>
    </div>
  );
};

export default Nodes;