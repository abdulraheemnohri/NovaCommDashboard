import React, { useEffect, useState } from 'react';

function Analytics() {
  const [batteryPrediction, setBatteryPrediction] = useState(null);
  const [snrGraphs, setSnrGraphs] = useState([]);
  const [txSuccessRatio, setTxSuccessRatio] = useState(null);
  const [frequencyUsage, setFrequencyUsage] = useState({});
  const [nodeHeatmap, setNodeHeatmap] = useState([]);

  useEffect(() => {
    fetch('/api/analytics/battery_life_prediction')
      .then(res => res.json())
      .then(data => setBatteryPrediction(data.prediction));

    fetch('/api/analytics/snr_graphs')
      .then(res => res.json())
      .then(data => setSnrGraphs(data));

    fetch('/api/analytics/tx_success_ratio')
      .then(res => res.json())
      .then(data => setTxSuccessRatio(data.success_ratio));

    fetch('/api/analytics/frequency_usage_stats')
      .then(res => res.json())
      .then(data => setFrequencyUsage(data.usage));

    fetch('/api/analytics/node_heatmap')
      .then(res => res.json())
      .then(data => setNodeHeatmap(data.heatmap));
  }, []);

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <div>
        <h2>Battery Life Prediction</h2>
        <p>{batteryPrediction ? batteryPrediction.toFixed(2) + '%' : 'Loading...'}</p>
      </div>
      <div>
        <h2>SNR Graphs (Last 60 minutes)</h2>
        <ul>
          {snrGraphs.map((point, index) => (
            <li key={index}>{new Date(point.timestamp).toLocaleTimeString()}: {point.snr.toFixed(2)}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>TX Success Ratio</h2>
        <p>{txSuccessRatio ? (txSuccessRatio * 100).toFixed(2) + '%' : 'Loading...'}</p>
      </div>
      <div>
        <h2>Frequency Usage Stats</h2>
        <ul>
          {Object.entries(frequencyUsage).map(([freq, usage]) => (
            <li key={freq}>{freq}: {usage}%</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Node Activity Heatmap</h2>
        <ul>
          {nodeHeatmap.map(node => (
            <li key={node.node_id}>{node.node_id}: {node.activity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Analytics;
