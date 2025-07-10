import React, { useState } from 'react';

function OTAUploader() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    const formData = new FormData();
    formData.append('firmware', file);

    fetch('/api/ota/upload', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Upload failed.'));
  };

  return (
    <div>
      <h3>OTA Firmware Upload</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}

export default OTAUploader;
