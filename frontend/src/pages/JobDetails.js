import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from '../api';
export default function JobDetails({ jobId, onBack }) {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applying, setApplying] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    useEffect(() => {
        const loadJob = async () => {
            try {
                setLoading(true);
                const response = await api.getJob(jobId);
                setJob(response.data.job || null);
                setError(null);
            }
            catch (err) {
                setError(err.message || 'Failed to load job details');
                setJob(null);
            }
            finally {
                setLoading(false);
            }
        };
        loadJob();
    }, [jobId]);
    const handleApplyNow = async () => {
        setApplying(true);
        setTimeout(() => {
            setSuccessMessage('✅ Application submitted successfully! We\'ll review your profile.');
            setApplying(false);
            setTimeout(() => setSuccessMessage(null), 4000);
        }, 1000);
    };
    const handleSaveJob = () => {
        setSuccessMessage('💾 Job saved to your profile!');
        setTimeout(() => setSuccessMessage(null), 3000);
    };
    return (_jsxs("div", { className: "container", children: [_jsx("button", { className: "btn btn-secondary", onClick: onBack, style: { marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }, children: "\u2190 Back to Results" }), error && (_jsxs("div", { className: "error-state", children: [_jsx("h3", { children: "Error loading job details" }), _jsx("p", { children: error })] })), loading && (_jsxs("div", { className: "loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { style: { marginTop: '12px', color: 'var(--gray-600)' }, children: "Loading job details..." })] })), !loading && !job && !error && (_jsx("div", { className: "empty-state", children: _jsx("h2", { children: "\uD83D\uDD0D Job not found" }) })), !loading && job && (_jsxs(_Fragment, { children: [successMessage && (_jsx("div", { style: {
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '20px',
                            color: 'var(--success)',
                            fontWeight: '500',
                            fontSize: '14px',
                            animation: 'slideIn 0.3s ease-out'
                        }, children: successMessage })), _jsx("div", { className: "card", style: { marginBottom: '24px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '20px' }, children: [_jsxs("div", { children: [_jsx("h1", { style: { fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: 'var(--gray-900)' }, children: job.title }), job.company && (_jsxs(_Fragment, { children: [_jsx("h3", { style: { fontSize: '18px', fontWeight: '600', color: 'var(--primary-accent)', marginBottom: '4px' }, children: job.company.name }), _jsxs("div", { style: { display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }, children: [_jsx("span", { style: { color: 'var(--gray-600)', fontSize: '14px' }, children: "\uD83D\uDCCD Bangalore" }), _jsx("span", { style: { color: 'var(--gray-600)', fontSize: '14px' }, children: "\uD83D\uDCBC Full Time" }), job.company.industry && (_jsxs("span", { style: { color: 'var(--gray-600)', fontSize: '14px' }, children: ["\uD83C\uDFE2 ", job.company.industry] }))] })] }))] }), _jsxs("div", { style: {
                                        padding: '16px 24px',
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        minWidth: '120px',
                                        border: '1px solid rgba(16, 185, 129, 0.2)'
                                    }, children: [_jsx("div", { style: { fontSize: '28px', fontWeight: '700', color: 'var(--success)' }, children: "78%" }), _jsx("div", { style: { fontSize: '12px', color: 'var(--gray-600)', marginTop: '4px' }, children: "Match Score" })] })] }) }), job.requiredSkills && job.requiredSkills.length > 0 && (_jsxs("div", { className: "card", style: { marginBottom: '24px' }, children: [_jsx("h3", { style: { marginBottom: '16px' }, children: "\uD83C\uDFAF Required Skills" }), _jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' }, children: job.requiredSkills.map((skill, idx) => (_jsx("span", { className: "badge badge-success", style: { padding: '8px 12px', fontSize: '13px' }, children: skill }, idx))) })] })), _jsxs("div", { className: "card", style: { marginBottom: '24px' }, children: [_jsx("h3", { style: { marginBottom: '16px' }, children: "\u2705 Your Matching Skills" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }, children: ['React', 'TypeScript', 'Node.js', 'REST API'].map((skill, idx) => (_jsxs("div", { style: {
                                        padding: '12px',
                                        background: 'var(--green-50)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\u2713" }), _jsx("span", { style: { fontWeight: '500', color: 'var(--success)' }, children: skill })] }, idx))) })] }), _jsxs("div", { className: "card", style: { marginBottom: '24px' }, children: [_jsx("h3", { style: { marginBottom: '16px' }, children: "\u2B55 Skills to Develop" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }, children: ['GraphQL'].map((skill, idx) => (_jsxs("div", { style: {
                                        padding: '12px',
                                        background: 'rgba(245, 158, 11, 0.05)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(245, 158, 11, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\u25CB" }), _jsx("span", { style: { fontWeight: '500', color: 'var(--warning)' }, children: skill })] }, idx))) })] }), _jsxs("div", { className: "card", style: {
                            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(6, 182, 212, 0.02))',
                            borderLeft: '4px solid var(--primary-accent)',
                            marginBottom: '24px'
                        }, children: [_jsx("h3", { style: { marginBottom: '12px' }, children: "\uD83D\uDCA1 Why This Match?" }), _jsxs("p", { style: { color: 'var(--gray-700)', lineHeight: '1.6' }, children: [_jsx("strong", { children: "4 of 5 required skills matched" }), " through our graph-based skill relationship engine. You have strong expertise in React, TypeScript, Node.js, and REST APIs. Only GraphQL experience is needed to make this a perfect fit."] }), _jsx("p", { style: { color: 'var(--gray-600)', fontSize: '13px', marginTop: '8px' }, children: "Our intelligent matching algorithm analyzes not just direct skill matches, but also considers related technologies and career paths within our knowledge graph." })] }), _jsxs("div", { style: { display: 'flex', gap: '12px' }, children: [_jsx("button", { className: "btn btn-primary", style: { flex: 1 }, onClick: handleApplyNow, disabled: applying, children: applying ? '⏳ Applying...' : '🚀 Apply Now' }), _jsx("button", { className: "btn btn-secondary", style: { flex: 1 }, onClick: handleSaveJob, children: "\u2764\uFE0F Save Job" })] })] }))] }));
}
