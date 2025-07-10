import React from 'react';
import PacketChart from './PacketChart';

const PacketStats = ({ packets }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">Packet Statistics</h2>
      <div className="mt-2 p-6 bg-white rounded-lg shadow-md">
        <PacketChart packets={packets} />
      </div>
    </div>
  );
};

export default PacketStats;
