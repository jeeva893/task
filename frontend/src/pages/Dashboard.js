import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from '../api';
export default function Dashboard({ onSelectCandidate }) {
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        const loadCandidates = async () => {
            try {
                setLoading(true);
                const response = await api.listCandidates(100);
                setCandidates(response.data.candidates || []);
                setFilteredCandidates(response.data.candidates || []);
                setError(null);
            }
            catch (err) {
                setError(err.message || 'Failed to load candidates');
                setCandidates([]);
                setFilteredCandidates([]);
            }
            finally {
                setLoading(false);
            }
        };
        loadCandidates();
    }, []);
    useEffect(() => {
        const filtered = candidates.filter(candidate => candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (candidate.title && candidate.title.toLowerCase().includes(searchTerm.toLowerCase())));
        setFilteredCandidates(filtered);
    }, [searchTerm, candidates]);
    return (_jsxs("div", { className: "container dashboard-shell", children: [_jsxs("div", { className: "surface-panel hero-panel", children: [_jsxs("div", { className: "panel-header-row", children: [_jsxs("div", { children: [_jsx("h2", { className: "section-title", children: "\uD83D\uDC65 Browse Candidates" }), _jsx("p", { className: "section-copy", children: "Select a candidate to view their profile and get AI-powered job recommendations" })] }), _jsxs("div", { className: "section-badge", children: [filteredCandidates.length, " results"] })] }), _jsx("input", { className: "search-input", type: "text", placeholder: "Search candidates by name or title...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), error && (_jsxs("div", { className: "error-state", children: [_jsx("h3", { children: "Error loading candidates" }), _jsx("p", { children: error })] })), loading && (_jsxs("div", { className: "loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { style: { marginTop: '16px', color: 'var(--gray-600)' }, children: "Loading candidates..." })] })), !loading && filteredCandidates.length === 0 && !error && (_jsxs("div", { className: "empty-state", children: [_jsxs("h2", { children: ["\uD83D\uDCED ", searchTerm ? 'No matches found' : 'No candidates available'] }), _jsx("p", { children: searchTerm ? 'Try a different search term' : 'Make sure the database is seeded with data.' })] })), !loading && filteredCandidates.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "results-header", children: _jsxs("span", { children: ["Found ", filteredCandidates.length, " candidate", filteredCandidates.length !== 1 ? 's' : ''] }) }), _jsx("div", { className: "candidate-grid", children: filteredCandidates.map((candidate) => (_jsxs("div", { className: "candidate-card", onClick: () => onSelectCandidate(candidate), children: [_jsxs("div", { className: "candidate-card-header", children: [_jsxs("div", { children: [_jsx("h3", { children: candidate.name }), candidate.title && (_jsx("p", { className: "candidate-role", children: candidate.title }))] }), _jsx("div", { className: "avatar-badge", children: "\uD83D\uDC64" })] }), candidate.years_experience !== undefined && (_jsxs("p", { className: "candidate-meta", children: ["\uD83D\uDCC5 ", candidate.years_experience, " years experience"] })), _jsx("button", { className: "btn btn-primary full-width", onClick: (e) => {
                                        e.stopPropagation();
                                        onSelectCandidate(candidate);
                                    }, children: "View Profile \u2192" })] }, candidate.id))) })] }))] }));
}
