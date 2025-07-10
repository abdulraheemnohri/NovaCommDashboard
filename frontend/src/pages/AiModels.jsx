import React, { useEffect, useState } from 'react';

function AiModels() {
  const [models, setModels] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [trainingStatus, setTrainingStatus] = useState('');
  const [trainingLogs, setTrainingLogs] = useState([]);

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    if (selectedModel) {
      fetchTrainingStatus(selectedModel);
      fetchMetrics(selectedModel);
      fetchTrainingLogs(selectedModel);
    }
  }, [selectedModel]);

  const fetchModels = () => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadModel = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    fetch('/api/models/upload', {
      method: 'POST',
      body: formData
    }).then(() => {
      fetchModels();
      setSelectedFile(null);
      alert('Model uploaded');
    });
  };

  const deployModel = (modelName) => {
    fetch(`/api/models/${modelName}/deploy`, { method: 'POST' })
      .then(() => alert(`Model ${modelName} deployment triggered`));
  };

  const trainModel = (modelName) => {
    setTrainingStatus(`Training started for ${modelName}...`);
    fetch(`/api/models/${modelName}/train`, { method: 'POST' })
      .then(() => setTrainingStatus(`Training started for ${modelName}`));
  };

  const fetchTrainingStatus = (modelName) => {
    fetch(`/api/models/${modelName}/training_status`)
      .then(res => res.json())
      .then(data => setTrainingStatus(data.status));
  };

  const fetchTrainingLogs = (modelName) => {
    fetch(`/api/models/${modelName}/training_logs`)
      .then(res => res.json())
      .then(data => setTrainingLogs(data.logs));
  };

  const fetchMetrics = (modelName) => {
    fetch(`/api/models/${modelName}/metrics`)
      .then(res => res.json())
      .then(data => setMetrics(data));
  };

  const rollbackModel = (modelName) => {
    fetch(`/api/models/${modelName}/rollback`, { method: 'POST' })
      .then(() => alert(`Model ${modelName} rolled back`));
  };

  const scheduleDeploy = (modelName) => {
    const deployTime = prompt('Enter deployment time (ISO format):');
    if (!deployTime) return;
    fetch(`/api/models/${modelName}/schedule_deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deploy_time: deployTime })
    }).then(() => alert(`Deployment of model ${modelName} scheduled at ${deployTime}`));
  };

  return (
    <div>
      <h1>AI Models</h1>
      <input type="file" accept=".tflite" onChange={handleFileChange} />
      <button onClick={uploadModel}>Upload Model</button>
      <p>Training Status: {trainingStatus}</p>
      <ul>
        {models.map(model => (
          <li key={model}>
            <strong onClick={() => setSelectedModel(model)} style={{ cursor: 'pointer' }}>{model}</strong>
            <button onClick={() => deployModel(model)}>Deploy</button>
            <button onClick={() => trainModel(model)}>Train</button>
            <button onClick={() => rollbackModel(model)}>Rollback</button>
            <button onClick={() => scheduleDeploy(model)}>Schedule Deploy</button>
            <button onClick={() => fetchMetrics(model)}>View Metrics</button>
          </li>
        ))}
      </ul>
      {selectedModel && (
        <div>
          <h2>Metrics for {selectedModel}</h2>
          <pre>{JSON.stringify(metrics, null, 2)}</pre>
          <h3>Training Logs</h3>
          <ul>
            {trainingLogs.map((log, idx) => (
              <li key={idx}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AiModels;
