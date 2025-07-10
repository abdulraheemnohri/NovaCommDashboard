import React from 'react';

const OverviewStats = ({ nodes, packets }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Total Nodes</h2>
        <p className="text-3xl font-bold">{nodes.length}</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Total Packets</h2>
        <p className="text-3xl font-bold">{packets.length}</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Online Nodes</h2>
        <p className="text-3xl font-bold">{nodes.filter(n => n.status === 'online').length}</p>
      </div>
    </div>
  );
};

export default OverviewStats;
