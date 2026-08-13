import { useState, useEffect } from 'react';
import { api } from '../api';
import { Candidate, Skill } from '../types';

interface CandidateProfileProps {
  candidate: Candidate;
  onShowRecommendations: () => void;
  onBack: () => void;
}

export default function CandidateProfile({
  candidate,
  onShowRecommendations,
  onBack,
}: CandidateProfileProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true);
        const response = await api.getCandidateSkills(candidate.id);
        setSkills(response.data.skills || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load skills');
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [candidate.id]);

  return (
    <div className="container">
      <button 
        className="btn btn-secondary" 
        onClick={onBack} 
        style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        ← Back to Candidates
      </button>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ margin: 0 }}>{candidate.name}</h2>
              <span style={{ fontSize: '32px' }}>👤</span>
            </div>
            {candidate.title && (
              <p style={{ 
                color: 'var(--primary-accent)', 
                fontWeight: '600',
                fontSize: '16px',
                marginBottom: '8px'
              }}>
                {candidate.title}
              </p>
            )}
            {candidate.years_experience !== undefined && (
              <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
                📅 {candidate.years_experience} years of professional experience
              </p>
            )}
          </div>
          <button 
            className="btn btn-primary" 
            onClick={onShowRecommendations}
            style={{ whiteSpace: 'nowrap' }}
          >
            🎯 Find Jobs →
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>🛠️ Technical Skills</h3>

        {error && (
          <div className="error-state" style={{ marginBottom: '16px' }}>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p style={{ marginTop: '12px', color: 'var(--gray-600)' }}>Loading skills...</p>
          </div>
        )}

        {!loading && skills.length === 0 && !error && (
          <div className="empty-state">
            <p>No skills found for this candidate.</p>
          </div>
        )}

        {!loading && skills.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'grid', gap: '12px' }}>
              {skills.map((skill, idx) => (
                <div 
                  key={idx} 
                  style={{
                    padding: '12px',
                    background: 'var(--gray-50)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid var(--gray-200)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = 'var(--primary-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--gray-50)';
                    e.currentTarget.style.borderColor = 'var(--gray-200)';
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '15px', color: 'var(--gray-900)' }}>
                      {skill.skill_name}
                    </strong>
                    {skill.level && (
                      <span className="badge badge-success" style={{ marginLeft: '8px' }}>
                        {skill.level}
                      </span>
                    )}
                  </div>
                  {skill.years !== undefined && (
                    <span style={{ 
                      color: 'var(--gray-600)', 
                      fontSize: '13px',
                      background: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      ⏱️ {skill.years} {skill.years === 1 ? 'year' : 'years'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
