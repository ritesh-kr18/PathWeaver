import api from './api';

export const generateScenario = (context) => api.post('/ai/generate-scenario', context);
export const generateConsequence = (data) => api.post('/ai/generate-consequence', data);
export const generateFeedback = (data) => api.post('/ai/generate-feedback', data);