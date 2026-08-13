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
    return (_jsxs("div", { className: "container profile-shell", children: [_jsx("button", { className: "btn btn-secondary back-button", onClick: onBack, children: "\u2190 Back to Candidates" }), _jsx("div", { className: "surface-panel profile-summary", children: _jsxs("div", { className: "profile-top", children: [_jsxs("div", { className: "profile-meta", children: [_jsxs("div", { className: "profile-name-row", children: [_jsx("h2", { children: candidate.name }), _jsx("span", { className: "profile-avatar", children: "\uD83D\uDC64" })] }), candidate.title && (_jsx("p", { className: "candidate-role highlight-role", children: candidate.title })), candidate.years_experience !== undefined && (_jsxs("p", { className: "candidate-meta", children: ["\uD83D\uDCC5 ", candidate.years_experience, " years of professional experience"] }))] }), _jsx("button", { className: "btn btn-primary primary-action", onClick: onShowRecommendations, children: "\uD83C\uDFAF Find Jobs \u2192" })] }) }), _jsxs("div", { className: "surface-panel skill-panel", children: [_jsx("h3", { className: "section-title small-title", children: "\uD83D\uDEE0\uFE0F Technical Skills" }), error && (_jsx("div", { className: "error-state", style: { marginBottom: '16px' }, children: _jsx("p", { children: error }) })), loading && (_jsxs("div", { className: "loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { style: { marginTop: '12px', color: 'var(--gray-600)' }, children: "Loading skills..." })] })), !loading && skills.length === 0 && !error && (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "No skills found for this candidate." }) })), !loading && skills.length > 0 && (_jsx("div", { className: "skill-list", children: skills.map((skill, idx) => (_jsxs("div", { className: "skill-row", children: [_jsxs("div", { className: "skill-left", children: [_jsx("strong", { children: skill.skill_name }), skill.level && (_jsx("span", { className: "badge badge-success skill-badge", children: skill.level }))] }), skill.years !== undefined && (_jsxs("span", { className: "skill-years", children: ["\u23F1\uFE0F ", skill.years, " ", skill.years === 1 ? 'year' : 'years'] }))] }, idx))) }))] })] }));
}
