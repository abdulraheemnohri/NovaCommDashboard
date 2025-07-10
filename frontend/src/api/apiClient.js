import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const login = (username, password) => apiClient.post('/auth/login', `username=${username}&password=${password}`);
export const registerUser = (user) => apiClient.post('/auth/register', user);
export const requestPasswordReset = (email) => apiClient.post('/users/request-password-reset', { email });
export const resetPassword = (token, new_password) => apiClient.post('/users/reset-password', { token, new_password });

// Nodes API
export const getNodes = (params) => apiClient.get('/nodes', { params });
export const createNode = (node) => apiClient.post('/nodes', node);
export const getNode = (nodeId) => apiClient.get(`/nodes/${nodeId}`);
export const sendNodeCommand = (nodeId, command) => apiClient.post(`/nodes/${nodeId}/command`, { command });
export const configureNode = (nodeId, config) => apiClient.post(`/nodes/${nodeId}/configure`, config);
export const getNodeConfiguration = (nodeId) => apiClient.get(`/nodes/${nodeId}/configuration`);
export const rebootNode = (nodeId) => apiClient.post(`/nodes/${nodeId}/reboot`);
export const firmwareUpdateNode = (nodeId) => apiClient.post(`/nodes/${nodeId}/firmware-update`);
export const deleteNode = (nodeId) => apiClient.delete(`/nodes/${nodeId}`);
export const setNodeMode = (nodeId, mode) => apiClient.post(`/nodes/${nodeId}/mode`, { mode });

// Packets API
export const getPackets = (params) => apiClient.get('/packets', { params });
export const createPacket = (packet) => apiClient.post('/packets', packet);

// Users API
export const getUsers = (params) => apiClient.get('/users', { params });
export const updateUserAdminStatus = (userId, isAdmin) => apiClient.put(`/users/${userId}/admin?is_admin=${isAdmin}`);

// OTA API
export const uploadFirmware = (version, file) => {
  const formData = new FormData();
  formData.append('version', version);
  formData.append('file', file);
  return apiClient.post('/ota/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deployFirmware = (nodeId, firmwareVersion) => apiClient.post('/ota/deploy', { node_id: nodeId, firmware_version: firmwareVersion });
export const getOtaStatus = (nodeId) => apiClient.get(`/ota/status/${nodeId}`);
export const getFirmwareVersions = () => apiClient.get('/ota');

// Mesh API
export const getMeshHealth = () => apiClient.get('/mesh/health');
export const getMeshTopology = () => apiClient.get('/mesh/topology');
export const optimizeNodeRoute = (nodeId, currentRoute) => apiClient.post(`/mesh/optimize-route/${nodeId}`, { current_route: currentRoute });

// Jobs API
export const getScheduledJobs = () => apiClient.get('/jobs');
export const createJob = (jobDetails) => apiClient.post('/jobs/create', jobDetails);
export const deleteJob = (jobId) => apiClient.delete(`/jobs/${jobId}`);
