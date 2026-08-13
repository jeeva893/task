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
    return (_jsxs("div", { className: "container", children: [_jsxs("div", { className: "card", style: { marginBottom: '24px' }, children: [_jsx("h2", { style: { marginBottom: '16px' }, children: "\uD83D\uDC65 Browse Candidates" }), _jsx("p", { style: { color: 'var(--gray-600)', marginBottom: '16px' }, children: "Select a candidate to view their profile and get AI-powered job recommendations" }), _jsx("input", { type: "text", placeholder: "Search candidates by name or title...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: {
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid var(--gray-200)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            transition: 'all 0.3s'
                        }, onFocus: (e) => {
                            e.currentTarget.style.borderColor = 'var(--primary-accent)';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
                        }, onBlur: (e) => {
                            e.currentTarget.style.borderColor = 'var(--gray-200)';
                            e.currentTarget.style.boxShadow = 'none';
                        } })] }), error && (_jsxs("div", { className: "error-state", children: [_jsx("h3", { children: "Error loading candidates" }), _jsx("p", { children: error })] })), loading && (_jsxs("div", { className: "loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { style: { marginTop: '16px', color: 'var(--gray-600)' }, children: "Loading candidates..." })] })), !loading && filteredCandidates.length === 0 && !error && (_jsxs("div", { className: "empty-state", children: [_jsxs("h2", { children: ["\uD83D\uDCED ", searchTerm ? 'No matches found' : 'No candidates available'] }), _jsx("p", { children: searchTerm ? 'Try a different search term' : 'Make sure the database is seeded with data.' })] })), !loading && filteredCandidates.length > 0 && (_jsxs(_Fragment, { children: [_jsxs("p", { style: { color: 'var(--gray-600)', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }, children: ["Found ", filteredCandidates.length, " candidate", filteredCandidates.length !== 1 ? 's' : ''] }), _jsx("div", { className: "grid", children: filteredCandidates.map((candidate) => (_jsxs("div", { className: "card", style: {
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }, onClick: () => onSelectCandidate(candidate), children: [_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }, children: [_jsx("h3", { children: candidate.name }), _jsx("span", { style: { fontSize: '24px' }, children: "\uD83D\uDC64" })] }), candidate.title && (_jsx("p", { style: {
                                                color: 'var(--primary-accent)',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                marginBottom: '8px'
                                            }, children: candidate.title })), candidate.years_experience !== undefined && (_jsxs("p", { style: { color: 'var(--gray-600)', fontSize: '13px' }, children: ["\uD83D\uDCC5 ", candidate.years_experience, " years experience"] }))] }), _jsx("button", { className: "btn btn-primary", style: { marginTop: '16px', width: '100%' }, onClick: (e) => {
                                        e.stopPropagation();
                                        onSelectCandidate(candidate);
                                    }, children: "View Profile \u2192" })] }, candidate.id))) })] }))] }));
}
