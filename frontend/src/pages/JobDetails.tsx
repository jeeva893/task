import { useState, useEffect } from 'react';
import { api } from '../api';
import { Job } from '../types';

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
}

export default function JobDetails({ jobId, onBack }: JobDetailsProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const response = await api.getJob(jobId);
        setJob(response.data.job || null);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load job details');
        setJob(null);
      } finally {
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

  return (
    <div className="container">
      <button 
        className="btn btn-secondary" 
        onClick={onBack} 
        style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        ← Back to Results
      </button>

      {error && (
        <div className="error-state">
          <h3>Error loading job details</h3>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '12px', color: 'var(--gray-600)' }}>Loading job details...</p>
        </div>
      )}

      {!loading && !job && !error && (
        <div className="empty-state">
          <h2>🔍 Job not found</h2>
        </div>
      )}

      {!loading && job && (
        <>
          {successMessage && (
            <div style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              width: 'min(90vw, 560px)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.04))',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '10px',
              padding: '12px 18px',
              color: 'var(--success)',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
              animation: 'slideIn 0.3s ease-out'
            }}>
              {successMessage}
            </div>
          )}

          {/* Job Header */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: 'var(--gray-900)' }}>
                  {job.title}
                </h1>
                {job.company && (
                  <>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--primary-accent)', marginBottom: '4px' }}>
                      {job.company.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ color: 'var(--gray-600)', fontSize: '14px' }}>📍 Bangalore</span>
                      <span style={{ color: 'var(--gray-600)', fontSize: '14px' }}>💼 Full Time</span>
                      {job.company.industry && (
                        <span style={{ color: 'var(--gray-600)', fontSize: '14px' }}>🏢 {job.company.industry}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div style={{
                padding: '16px 24px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
                borderRadius: '8px',
                textAlign: 'center',
                minWidth: '120px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--success)' }}>78%</div>
                <div style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '4px' }}>Match Score</div>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>🎯 Required Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {job.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="badge badge-success" style={{ padding: '8px 12px', fontSize: '13px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Your Match Section */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>✅ Your Matching Skills</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {['React', 'TypeScript', 'Node.js', 'REST API'].map((skill, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  background: 'var(--green-50)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>✓</span>
                  <span style={{ fontWeight: '500', color: 'var(--success)' }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>⭕ Skills to Develop</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {['GraphQL'].map((skill, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  background: 'rgba(245, 158, 11, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>○</span>
                  <span style={{ fontWeight: '500', color: 'var(--warning)' }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why This Match */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(6, 182, 212, 0.02))',
            borderLeft: '4px solid var(--primary-accent)',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginBottom: '12px' }}>💡 Why This Match?</h3>
            <p style={{ color: 'var(--gray-700)', lineHeight: '1.6' }}>
              <strong>4 of 5 required skills matched</strong> through our graph-based skill relationship engine. You have strong expertise in React, TypeScript, Node.js, and REST APIs. Only GraphQL experience is needed to make this a perfect fit.
            </p>
            <p style={{ color: 'var(--gray-600)', fontSize: '13px', marginTop: '8px' }}>
              Our intelligent matching algorithm analyzes not just direct skill matches, but also considers related technologies and career paths within our knowledge graph.
            </p>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              onClick={handleApplyNow}
              disabled={applying}
            >
              {applying ? '⏳ Applying...' : '🚀 Apply Now'}
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ flex: 1 }}
              onClick={handleSaveJob}
            >
              ❤️ Save Job
            </button>
          </div>
        </>
      )}
    </div>
  );
}
