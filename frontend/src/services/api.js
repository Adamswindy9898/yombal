import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });

export const biensAPI = {
  getAll: () => API.get('/biens/'),
  getOne: (id) => API.get(`/biens/${id}`),
  create: (data) => API.post('/biens/', data),
  update: (id, data) => API.put(`/biens/${id}`, data),
  delete: (id) => API.delete(`/biens/${id}`),
};

export const locatairesAPI = {
  getAll: () => API.get('/locataires/'),
  getOne: (id) => API.get(`/locataires/${id}`),
  create: (data) => API.post('/locataires/', data),
  update: (id, data) => API.put(`/locataires/${id}`, data),
  delete: (id) => API.delete(`/locataires/${id}`),
  getAlertes: () => API.get('/locataires/alertes'),
};

export const terrainsAPI = {
  getAll: () => API.get('/terrains/'),
  getOne: (id) => API.get(`/terrains/${id}`),
  create: (data) => API.post('/terrains/', data),
  update: (id, data) => API.put(`/terrains/${id}`, data),
  delete: (id) => API.delete(`/terrains/${id}`),
};

export const assurancesAPI = {
  getAll: () => API.get('/assurances/'),
  getOne: (id) => API.get(`/assurances/${id}`),
  create: (data) => API.post('/assurances/', data),
  update: (id, data) => API.put(`/assurances/${id}`, data),
  delete: (id) => API.delete(`/assurances/${id}`),
  getAlertes: () => API.get('/assurances/alertes'),
};
