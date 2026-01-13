import axios from 'axios';

const BASE_URL = 'https://fadyvaccines-production.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.authorization = `${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.get(`${BASE_URL}/users/refreshToken`, {
            headers: { authorization: refreshToken }
        });

        localStorage.setItem('token', data.token); // Adjust based on actual response key
        // Note: The API docs say /users/signin returns token & refreshToken. 
        // Need to verify exact structure of /refreshToken response. Assumed { token: ... }
        
        api.defaults.headers.authorization = data.token;
        return api(originalRequest);
      } catch (refreshError) {
        // Logout if refresh fails
        localStorage.clear();
        window.location.href = '/auth/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
