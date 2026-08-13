import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from '../api';
export default function Recommendations({ candidateId, candidateName, onSelectJob, onBack, }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadRecommendations = async () => {
            try {
                setLoading(true);
                const response = await api.getRecommendations(candidateId, 30);
                setRecommendations(response.data.recommendations || []);
                setError(null);
            }
            catch (err) {
                setError(err.message || 'Failed to load recommendations');
                setRecommendations([]);
            }
            finally {
                setLoading(false);
            }
        };
        loadRecommendations();
    }, [candidateId]);
    const getMatchPercentClass = (percent) => {
        if (percent >= 75)
            return 'match-high';
        if (percent >= 50)
            return 'match-medium';
        return 'match-low';
    };
    return (_jsxs("div", { className: "container", children: [_jsx("button", { className: "btn btn-secondary", onClick: onBack, style: { marginBottom: '16px' }, children: "\u2190 Back" }), _jsxs("div", { className: "card", children: [_jsxs("h2", { children: ["Recommended Jobs for ", candidateName] }), _jsx("p", { style: { color: 'var(--gray-600)' }, children: "Based on graph-powered skill matching and relationships" })] }), error && (_jsxs("div", { className: "error-state", children: [_jsx("h3", { children: "Error loading recommendations" }), _jsx("p", { children: error })] })), loading && (_jsxs("div", { className: "loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { style: { marginTop: '12px' }, children: "Computing recommendations..." })] })), !loading && recommendations.length === 0 && !error && (_jsxs("div", { className: "empty-state", children: [_jsx("h2", { children: "No jobs found" }), _jsx("p", { children: "There are no matching jobs in the database yet." })] })), !loading && recommendations.length > 0 && (_jsx("div", { children: recommendations.map((rec) => (_jsx("div", { className: "card", style: { marginBottom: '16px', cursor: 'pointer' }, children: _jsxs("div", { onClick: () => onSelectJob(rec.id), children: [_jsxs("div", { className: "flex-between", style: { marginBottom: '12px' }, children: [_jsx("h3", { children: rec.title }), _jsxs("span", { className: `match-percent ${getMatchPercentClass(rec.matchPercent)}`, children: [Math.round(rec.matchPercent), "% match"] })] }), _jsx("div", { style: { marginBottom: '12px' }, children: _jsxs("p", { style: { color: 'var(--gray-600)', fontSize: '13px' }, children: ["Required: ", rec.requiredCount, " skills | Matched: ", rec.matchCount, " skills"] }) }), rec.matching && rec.matching.length > 0 && (_jsxs("div", { style: { marginBottom: '8px' }, children: [_jsx("label", { style: { fontSize: '12px', fontWeight: '600' }, children: "Matching Skills:" }), _jsx("div", { style: { marginTop: '4px' }, children: rec.matching.map((skill, idx) => (_jsx("span", { className: "badge badge-success", children: skill }, idx))) })] })), rec.missing && rec.missing.length > 0 && (_jsxs("div", { children: [_jsx("label", { style: { fontSize: '12px', fontWeight: '600' }, children: "Missing Skills:" }), _jsx("div", { style: { marginTop: '4px' }, children: rec.missing.map((skill, idx) => (_jsx("span", { className: "badge badge-warning", children: skill }, idx))) })] })), _jsx("button", { className: "btn btn-primary", style: { marginTop: '12px', width: '100%' }, onClick: (e) => {
                                    e.preventDefault();
                                    onSelectJob(rec.id);
                                }, children: "View Details \u2192" })] }) }, rec.id))) }))] }));
}
