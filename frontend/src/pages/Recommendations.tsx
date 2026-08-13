import { useState, useEffect } from 'react';
import { api } from '../api';
import { Recommendation } from '../types';

interface RecommendationsProps {
  candidateId: string;
  candidateName: string;
  onSelectJob: (jobId: string) => void;
  onBack: () => void;
}

export default function Recommendations({
  candidateId,
  candidateName,
  onSelectJob,
  onBack,
}: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const response = await api.getRecommendations(candidateId, 30);
        setRecommendations(response.data.recommendations || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load recommendations');
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [candidateId]);

  const getMatchPercentClass = (percent: number) => {
    if (percent >= 75) return 'match-high';
    if (percent >= 50) return 'match-medium';
    return 'match-low';
  };

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '16px' }}>
        ← Back
      </button>

      <div className="card">
        <h2>Recommended Jobs for {candidateName}</h2>
        <p style={{ color: 'var(--gray-600)' }}>
          Based on graph-powered skill matching and relationships
        </p>
      </div>

      {error && (
        <div className="error-state">
          <h3>Error loading recommendations</h3>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '12px' }}>Computing recommendations...</p>
        </div>
      )}

      {!loading && recommendations.length === 0 && !error && (
        <div className="empty-state">
          <h2>No jobs found</h2>
          <p>There are no matching jobs in the database yet.</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div>
          {recommendations.map((rec) => (
            <div key={rec.id} className="card" style={{ marginBottom: '16px', cursor: 'pointer' }}>
              <div onClick={() => onSelectJob(rec.id)}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <h3>{rec.title}</h3>
                  <span className={`match-percent ${getMatchPercentClass(rec.matchPercent)}`}>
                    {Math.round(rec.matchPercent)}% match
                  </span>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: 'var(--gray-600)', fontSize: '13px' }}>
                    Required: {rec.requiredCount} skills | Matched: {rec.matchCount} skills
                  </p>
                </div>

                {rec.matching && rec.matching.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Matching Skills:</label>
                    <div style={{ marginTop: '4px' }}>
                      {rec.matching.map((skill, idx) => (
                        <span key={idx} className="badge badge-success">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {rec.missing && rec.missing.length > 0 && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Missing Skills:</label>
                    <div style={{ marginTop: '4px' }}>
                      {rec.missing.map((skill, idx) => (
                        <span key={idx} className="badge badge-warning">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  style={{ marginTop: '12px', width: '100%' }}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectJob(rec.id);
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
