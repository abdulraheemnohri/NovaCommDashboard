import React from 'react';

function PowerGraph({ nodes }) {
  const maxBattery = 100;

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc' }}>
      <h3>Power Consumption Graph</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '150px' }}>
        {Object.keys(nodes).map(nodeId => {
          const battery = nodes[nodeId].data.battery || 0;
          const heightPercent = (battery / maxBattery) * 100;
          return (
            <div key={nodeId} style={{ textAlign: 'center' }}>
              <div style={{
                width: '30px',
                height: `${heightPercent}%`,
                backgroundColor: battery > 20 ? 'green' : 'red',
                marginBottom: '5px',
                transition: 'height 0.3s ease'
              }} title={`Battery: ${battery}%`} />
              <div>{nodeId}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PowerGraph;
