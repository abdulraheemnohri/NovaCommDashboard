import React, { useState, useEffect } from 'react';
import NodeControlPanel from './NodeControlPanel';
import MeshMap from './MeshMap';
import PowerGraph from './PowerGraph';
import OTAUploader from './OTAUploader';

function App() {
  const [nodes, setNodes] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/nodes')
        .then(response => response.json())
        .then(data => setNodes(data));
    }, 2000); // Fetch data every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNodeUpdate = (nodeId, command) => {
    fetch(`/api/nodes/${nodeId}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    }).then(() => {
      alert(`Command sent to node ${nodeId}`);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <h1>NovaComm Dashboard</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Mesh Nodes</h2>
          <ul>
            {Object.keys(nodes).map(nodeId => (
              <li key={nodeId} onClick={() => setSelectedNode(nodeId)} style={{ cursor: 'pointer' }}>
                <strong>{nodeId}</strong> - Status: {nodes[nodeId].status}
                <br />
                <small>Last Seen: {new Date(nodes[nodeId].last_seen * 1000).toLocaleString()}</small>
                <br />
                <small>Data: {JSON.stringify(nodes[nodeId].data)}</small>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 2 }}>
          <h2>Node Map</h2>
          <MeshMap nodes={nodes} />
          {selectedNode && (
            <NodeControlPanel
              nodeId={selectedNode}
              nodeData={nodes[selectedNode]}
              onUpdate={handleNodeUpdate}
            />
          )}
        </div>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        <PowerGraph nodes={nodes} />
        <OTAUploader />
      </div>
    </div>
  );
}

export default App;
