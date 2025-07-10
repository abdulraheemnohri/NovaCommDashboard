import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PacketChart = ({ packets }) => {
  const data = {
    labels: packets.map(p => new Date(p.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'SNR',
        data: packets.map(p => p.snr),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'RSSI',
        data: packets.map(p => p.rssi),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Packet SNR and RSSI Over Time',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default PacketChart;
