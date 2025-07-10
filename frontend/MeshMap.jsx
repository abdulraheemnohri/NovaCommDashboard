import React from 'react';

function MeshMap({ nodes }) {
  // Dummy connections for visualization
  const connections = [
    ['node_1', 'node_2'],
    ['node_2', 'node_3'],
    ['node_3', 'node_4'],
  ];

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ width: '50%', height: '400px', backgroundColor: '#e0e0e0', position: 'relative' }}>
        <h2>Mesh Network Topology</h2>
        {Object.keys(nodes).map((nodeId, index) => (
          <div key={nodeId} style={{
            position: 'absolute',
            top: `${(index + 1) * 40}px`,
            left: `${(index + 1) * 40}px`,
            width: '25px',
            height: '25px',
            backgroundColor: 'green',
            borderRadius: '50%',
            color: 'white',
            textAlign: 'center',
            lineHeight: '25px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }} title={nodeId}>
            {index + 1}
          </div>
        ))}
        {/* Connections visualization placeholder */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {connections.map(([from, to], idx) => {
            const fromIndex = Object.keys(nodes).indexOf(from);
            const toIndex = Object.keys(nodes).indexOf(to);
            if (fromIndex === -1 || toIndex === -1) return null;
            const x1 = (fromIndex + 1) * 40 + 12;
            const y1 = (fromIndex + 1) * 40 + 12;
            const x2 = (toIndex + 1) * 40 + 12;
            const y2 = (toIndex + 1) * 40 + 12;
            return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />;
          })}
        </svg>
      </div>
      <div style={{ width: '50%', height: '400px', backgroundColor: '#f0f0f0' }}>
        <h2>GPS Map Placeholder</h2>
        <p style={{ textAlign: 'center', paddingTop: '180px' }}>Map will be here</p>
      </div>
    </div>
  );
}

export default MeshMap;
