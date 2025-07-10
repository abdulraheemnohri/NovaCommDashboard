import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
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

export const getNodes = () => apiClient.get('/nodes');
export const createNode = (node) => apiClient.post('/nodes', node);
export const getNode = (nodeId) => apiClient.get(`/nodes/${nodeId}`);

export const getPackets = (params) => apiClient.get('/packets', { params });
export const createPacket = (packet) => apiClient.post('/packets', packet);

export const getUsers = () => apiClient.get('/users');
export const createUser = (user) => apiClient.post('/users/', user);
