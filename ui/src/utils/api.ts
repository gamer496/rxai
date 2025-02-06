import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userType');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  getCustomerMe: async () => {
    const response = await api.get('/customers/me');
    return response.data;
  },
  getDoctorMe: async () => {
    const response = await api.get('/doctor/me');
    return response.data;
  }
};

export const prescriptionApi = {
  getCustomerPrescriptions: async () => {
    const response = await api.get('/customer/prescriptions');
    return response.data;
  },
  getDoctorPrescriptions: async () => {
    const response = await api.get('/doctor/prescriptions');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/prescriptions', data);
    return response.data;
  },
  uploadFile: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      }
    });
    return response.data;
  },
  createFromUpload: async (prescriptionUrl: string) => {
    const response = await api.post('/customer/prescriptions', { prescriptionUrl });
    return response.data;
  },
  // Add other prescription-related endpoints
};

export default api; 