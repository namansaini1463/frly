import axios from 'axios';

const axiosClient = axios.create({
  // baseURL: 'http://192.168.1.17:8080/api', // Update if backend port differs
  baseURL: 'http://172.20.10.3:8080/api', // Update if backend port differs
  // baseURL: 'http://localhost:8080/api', // Update if backend port differs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach Group ID if present in localStorage or Session
    const currentGroupId = localStorage.getItem('currentGroupId');
    if (currentGroupId) {
      config.headers['X-Group-ID'] = currentGroupId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for auth handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Only treat 401 as an auth/session problem. 403 is often used
    // for business-rule errors (e.g. access denied, invalid operation)
    // and should not force a logout.
    if (status === 401) {
      const url = error?.config?.url || '';
      const isAuthEndpoint = url.startsWith('/auth/');

      if (!isAuthEndpoint) {
        // Token expired or no longer valid – clear auth and gently push back to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentGroupId');
        try {
          sessionStorage.setItem('authExpired', '1');
        } catch {
          // ignore storage failures
        }
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
