import { useState, useEffect } from 'react';
import { api } from './api';
import Dashboard from './pages/Dashboard';
import CandidateProfile from './pages/CandidateProfile';
import Recommendations from './pages/Recommendations';
import JobDetails from './pages/JobDetails';
import { Candidate } from './types';

type Page = 'dashboard' | 'profile' | 'recommendations' | 'job-details';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDBHealthy, setIsDBHealthy] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Check DB health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.health();
        setIsDBHealthy(response.data.status === 'ok');
        setDbError(null);
      } catch (error: any) {
        setIsDBHealthy(false);
        setDbError(error.message || 'Unable to reach backend API');
      }
    };

    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (page: Page, candidate?: Candidate, jobId?: string) => {
    setCurrentPage(page);
    if (candidate) setSelectedCandidate(candidate);
    if (jobId) setSelectedJobId(jobId);
  };

  const goBack = () => {
    if (currentPage === 'job-details') {
      setCurrentPage('recommendations');
    } else if (currentPage === 'recommendations' || currentPage === 'profile') {
      setCurrentPage('dashboard');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="flex-between">
            <div>
              <h1>✨ SkillGraph</h1>
              <p className="header-subtitle">
                Intelligent job recommendations powered by graph databases
              </p>
            </div>
            <div style={{ 
              fontSize: '12px', 
              textAlign: 'right',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                padding: '8px 16px',
                borderRadius: '6px',
                background: isDBHealthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isDBHealthy ? 'var(--success)' : 'var(--danger)',
                fontWeight: '600',
                border: isDBHealthy ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                {isDBHealthy ? '✓ Connected' : '✗ Disconnected'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="content">
        {dbError && (
          <div className="container">
            <div className="error-state">
              <h3>Connection Error</h3>
              <p>{dbError}</p>
              <p style={{ marginTop: '8px', fontSize: '12px' }}>
                Make sure the FastAPI backend is running on http://localhost:8000
              </p>
            </div>
          </div>
        )}

        {currentPage === 'dashboard' && (
          <Dashboard onSelectCandidate={(c) => navigateTo('profile', c)} />
        )}

        {currentPage === 'profile' && selectedCandidate && (
          <CandidateProfile
            candidate={selectedCandidate}
            onShowRecommendations={() => navigateTo('recommendations')}
            onBack={goBack}
          />
        )}

        {currentPage === 'recommendations' && selectedCandidate && (
          <Recommendations
            candidateId={selectedCandidate.id}
            candidateName={selectedCandidate.name}
            onSelectJob={(jobId) => navigateTo('job-details', undefined, jobId)}
            onBack={goBack}
          />
        )}

        {currentPage === 'job-details' && selectedJobId && (
          <JobDetails
            jobId={selectedJobId}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}

export default App;
