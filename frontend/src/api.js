import axios from 'axios';
const API_BASE_URL = 'https://skillgraph-backend-ias0.onrender.com/api';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});
export const api = {
    health: () => apiClient.get('health'),
    listCandidates: (limit = 100) => apiClient.get('candidates', { params: { limit } }),
    getCandidate: (candidateId) => apiClient.get(`candidates/${candidateId}`),
    getCandidateSkills: (candidateId) => apiClient.get(`candidates/${candidateId}/skills`),
    getRecommendations: (candidateId, limit = 20) => apiClient.get(`candidates/${candidateId}/recommendations`, { params: { limit } }),
    getJob: (jobId) => apiClient.get(`jobs/${jobId}`),
};
export default apiClient;
