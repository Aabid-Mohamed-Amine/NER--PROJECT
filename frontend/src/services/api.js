import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

// We create the instance WITHOUT default headers to avoid conflicts
const api = axios.create({
  baseURL: API_URL,
});

// Automatically add the Token to every request if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => {
    // OAuth2 expects form-data
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // <--- Force Form Data for Login
      },
    });
  },

  register: (userData) => {
    // Register expects JSON
    return api.post('/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json', // <--- Force JSON for Register
      },
    });
  },
};

export const nerService = {
  predict: (text) => {
    return api.post('/ner/predict', { text }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  getHistory: () => {
    return api.get('/ner/history');
  }
};

// --- NEW CHAT SERVICE ---
export const chatService = {
  explain: (query) => {
    return api.post('/chat/explain', { query }, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export default api;