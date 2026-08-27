import api from './api';

export const saveJourney = (data) => api.post('/journey/save', data);
export const loadJourney = (id) => api.get(`/journey/load/${id}`);
export const listJourneys = () => api.get('/journey/list');
export const deleteJourney = (id) => api.delete(`/journey/${id}`);