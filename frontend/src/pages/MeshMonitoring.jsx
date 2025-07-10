import React, { useEffect, useState } from 'react';

function MeshMonitoring() {
  const [routingMetrics, setRoutingMetrics] = useState([]);
  const [aiAlerts, setAiAlerts] = useState([]);

  useEffect(() => {
    // Fetch routing metrics from backend API (placeholder endpoint)
    fetch('/api/mesh/routing_metrics')
      .then(res => res.json())
      .then(data => setRoutingMetrics(data.metrics || []));

    // Fetch AI-driven alerts from backend API (placeholder endpoint)
    fetch('/api/nodes/ai_alerts')
      .then(res => res.json())
      .then(data => setAiAlerts(data.alerts || []));
  }, []);

  return (
    <div>
      <h1>Mesh Monitoring</h1>

      <h2>Routing Metrics</h2>
      {routingMetrics.length === 0 ? (
        <p>No routing metrics available.</p>
      ) : (
        <ul>
          {routingMetrics.map((metric, idx) => (
            <li key={idx}>{metric}</li>
          ))}
        </ul>
      )}

      <h2>AI-driven Alerts</h2>
      {aiAlerts.length === 0 ? (
        <p>No alerts at this time.</p>
      ) : (
        <ul>
          {aiAlerts.map((alert, idx) => (
            <li key={idx}>{alert}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeshMonitoring;
