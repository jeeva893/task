import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from './api';
import Dashboard from './pages/Dashboard';
import CandidateProfile from './pages/CandidateProfile';
import Recommendations from './pages/Recommendations';
import JobDetails from './pages/JobDetails';
function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [isDBHealthy, setIsDBHealthy] = useState(false);
    const [dbError, setDbError] = useState(null);
    // Check DB health on mount
    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await api.health();
                setIsDBHealthy(response.data.status === 'ok');
                setDbError(null);
            }
            catch (error) {
                setIsDBHealthy(false);
                setDbError(error.message || 'Unable to reach backend API');
            }
        };
        checkHealth();
        // Check health every 30 seconds
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);
    const navigateTo = (page, candidate, jobId) => {
        setCurrentPage(page);
        if (candidate)
            setSelectedCandidate(candidate);
        if (jobId)
            setSelectedJobId(jobId);
    };
    const goBack = () => {
        if (currentPage === 'job-details') {
            setCurrentPage('recommendations');
        }
        else if (currentPage === 'recommendations' || currentPage === 'profile') {
            setCurrentPage('dashboard');
        }
    };
    return (_jsxs("div", { className: "app", children: [_jsx("header", { className: "header", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "flex-between header-row", children: [_jsxs("div", { children: [_jsx("h1", { children: "\u2728 SkillGraph" }), _jsx("p", { className: "header-subtitle", children: "Intelligent job recommendations powered by graph databases" })] }), _jsx("div", { className: "header-actions", children: _jsxs("div", { className: `status-pill ${isDBHealthy ? 'status-ok' : 'status-bad'}`, children: [_jsx("span", { className: "status-dot" }), isDBHealthy ? 'Connected' : 'Disconnected'] }) })] }) }) }), _jsxs("div", { className: "content", children: [dbError && (_jsx("div", { className: "container", children: _jsxs("div", { className: "error-state", children: [_jsx("h3", { children: "Connection Error" }), _jsx("p", { children: dbError }), _jsx("p", { style: { marginTop: '8px', fontSize: '12px' }, children: "Make sure the FastAPI backend is running on http://localhost:8000" })] }) })), currentPage === 'dashboard' && (_jsx(Dashboard, { onSelectCandidate: (c) => navigateTo('profile', c) })), currentPage === 'profile' && selectedCandidate && (_jsx(CandidateProfile, { candidate: selectedCandidate, onShowRecommendations: () => navigateTo('recommendations'), onBack: goBack })), currentPage === 'recommendations' && selectedCandidate && (_jsx(Recommendations, { candidateId: selectedCandidate.id, candidateName: selectedCandidate.name, onSelectJob: (jobId) => navigateTo('job-details', undefined, jobId), onBack: goBack })), currentPage === 'job-details' && selectedJobId && (_jsx(JobDetails, { jobId: selectedJobId, onBack: goBack }))] })] }));
}
export default App;
