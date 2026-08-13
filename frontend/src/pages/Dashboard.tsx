import { useState, useEffect } from 'react';
import { api } from '../api';
import { Candidate } from '../types';

interface DashboardProps {
  onSelectCandidate: (candidate: Candidate) => void;
}

export default function Dashboard({ onSelectCandidate }: DashboardProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const response = await api.listCandidates(100);
        setCandidates(response.data.candidates || []);
        setFilteredCandidates(response.data.candidates || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load candidates');
        setCandidates([]);
        setFilteredCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, []);

  useEffect(() => {
    const filtered = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.title && candidate.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCandidates(filtered);
  }, [searchTerm, candidates]);

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>👥 Browse Candidates</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '16px' }}>
          Select a candidate to view their profile and get AI-powered job recommendations
        </p>
        <input
          type="text"
          placeholder="Search candidates by name or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid var(--gray-200)',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.3s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-accent)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--gray-200)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {error && (
        <div className="error-state">
          <h3>Error loading candidates</h3>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: 'var(--gray-600)' }}>Loading candidates...</p>
        </div>
      )}

      {!loading && filteredCandidates.length === 0 && !error && (
        <div className="empty-state">
          <h2>📭 {searchTerm ? 'No matches found' : 'No candidates available'}</h2>
          <p>{searchTerm ? 'Try a different search term' : 'Make sure the database is seeded with data.'}</p>
        </div>
      )}

      {!loading && filteredCandidates.length > 0 && (
        <>
          <p style={{ color: 'var(--gray-600)', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
            Found {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''}
          </p>
          <div className="grid">
            {filteredCandidates.map((candidate) => (
              <div 
                key={candidate.id} 
                className="card" 
                style={{ 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onClick={() => onSelectCandidate(candidate)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3>{candidate.name}</h3>
                    <span style={{ fontSize: '24px' }}>👤</span>
                  </div>
                  {candidate.title && (
                    <p style={{ 
                      color: 'var(--primary-accent)', 
                      fontWeight: '600', 
                      fontSize: '14px',
                      marginBottom: '8px'
                    }}>
                      {candidate.title}
                    </p>
                  )}
                  {candidate.years_experience !== undefined && (
                    <p style={{ color: 'var(--gray-600)', fontSize: '13px' }}>
                      📅 {candidate.years_experience} years experience
                    </p>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '16px', width: '100%' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCandidate(candidate);
                  }}
                >
                  View Profile →
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
