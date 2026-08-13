import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from '../api';
export default function CandidateProfile({ candidate, onShowRecommendations, onBack, }) {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadSkills = async () => {
            try {
                setLoading(true);
                const response = await api.getCandidateSkills(candidate.id);
                setSkills(response.data.skills || []);
                setError(null);
            }
            catch (err) {
                setError(err.message || 'Failed to load skills');
                setSkills([]);
            }
            finally {
                setLoading(false);
            }
        };
        loadSkills();
    }, [candidate.id]);
    return (_jsxs("div", { className: "container", children: [_jsx("button", { className: "btn btn-secondary", onClick: onBack, style: { marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }, children: "\u2190 Back to Candidates" }), _jsx("div", { className: "card", style: { marginBottom: '24px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'start', justifyContent: 'space-between' }, children: [_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }, children: [_jsx("h2", { style: { margin: 0 }, children: candidate.name }), _jsx("span", { style: { fontSize: '32px' }, children: "\uD83D\uDC64" })] }), candidate.title && (_jsx("p", { style: {
                                        color: 'var(--primary-accent)',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        marginBottom: '8px'
                                    }, children: candidate.title })), candidate.years_experience !== undefined && (_jsxs("p", { style: { color: 'var(--gray-600)', fontSize: '14px' }, children: ["\uD83D\uDCC5 ", candidate.years_experience, " years of professional experience"] }))] }), _jsx("button", { className: "btn btn-primary", onClick: onShowRecommendations, style: { whiteSpace: 'nowrap' }, children: "\uD83C\uDFAF Find Jobs \u2192" })] }) }), _jsxs("div", { className: "card", children: [_jsx("h3", { style: { marginBottom: '16px' }, children: "\uD83D\uDEE0\uFE0F Technical Skills" }), error && (_jsx("div", { className: "error-state", style: { marginBottom: '16px' }, children: _jsx("p", { children: error }) })), loading && (_jsxs("div", { className: "loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { style: { marginTop: '12px', color: 'var(--gray-600)' }, children: "Loading skills..." })] })), !loading && skills.length === 0 && !error && (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "No skills found for this candidate." }) })), !loading && skills.length > 0 && (_jsx("div", { style: { marginTop: '16px' }, children: _jsx("div", { style: { display: 'grid', gap: '12px' }, children: skills.map((skill, idx) => (_jsxs("div", { style: {
                                    padding: '12px',
                                    background: 'var(--gray-50)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid var(--gray-200)',
                                    transition: 'all 0.2s'
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.borderColor = 'var(--primary-accent)';
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.background = 'var(--gray-50)';
                                    e.currentTarget.style.borderColor = 'var(--gray-200)';
                                }, children: [_jsxs("div", { children: [_jsx("strong", { style: { fontSize: '15px', color: 'var(--gray-900)' }, children: skill.skill_name }), skill.level && (_jsx("span", { className: "badge badge-success", style: { marginLeft: '8px' }, children: skill.level }))] }), skill.years !== undefined && (_jsxs("span", { style: {
                                            color: 'var(--gray-600)',
                                            fontSize: '13px',
                                            background: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px'
                                        }, children: ["\u23F1\uFE0F ", skill.years, " ", skill.years === 1 ? 'year' : 'years'] }))] }, idx))) }) }))] })] }));
}
