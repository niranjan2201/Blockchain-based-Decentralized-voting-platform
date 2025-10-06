import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';

const CandidateProfiles = ({ language, candidates, voteFunction }) => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showManifesto, setShowManifesto] = useState(false);
    const [candidateProfiles, setCandidateProfiles] = useState([]);

    React.useEffect(() => {
        // Load candidate profiles from localStorage
        const profiles = JSON.parse(localStorage.getItem('candidateProfiles') || '[]');
        setCandidateProfiles(profiles);
    }, [candidates]);

    const candidatesWithProfiles = [
        ...candidates.map((candidate, index) => {
            // Find matching profile data from localStorage
            const profileData = candidateProfiles.find(p => p.name === candidate.name) || {};
            
            return {
                ...candidate,
                photo: '👨💼',
                party: profileData.party || candidate.party || 'स्वतंत्र',
                symbol: profileData.symbol || candidate.symbol || '🏛️',
                age: profileData.age || candidate.age || (35 + (index * 3) % 25),
                education: profileData.education || candidate.education || ['स्नातक', 'स्नातकोत्तर', 'डॉक्टरेट', 'डिप्लोमा'][index % 4],
                experience: profileData.experience || candidate.experience || (5 + (index * 2) % 15),
                manifesto: candidate.manifesto || `${candidate.name} का चुनावी घोषणापत्र:\n• शिक्षा में सुधार\n• रोजगार के अवसर\n• स्वास्थ्य सेवाओं का विकास\n• कृषि सुधार\n• महिला सशक्तिकरण`,
                achievements: candidate.achievements || [
                    'स्थानीय विकास परियोजनाओं का नेतृत्व',
                    'शिक्षा क्षेत्र में योगदान',
                    'सामाजिक कार्यों में सक्रियता'
                ],
                criminalRecord: candidate.criminalRecord || (index % 3 === 0 ? 'कोई आपराधिक मामला नहीं' : 'मामूली यातायात उल्लंघन'),
                assets: candidate.assets || `₹${(10 + (index * 5) % 40).toFixed(1)} लाख`
            };
        }),
        {
            id: 'NOTA',
            name: getTranslation(language, 'nota'),
            party: '',
            symbol: '❌',
            photo: '🚫',
            age: '-',
            education: '-',
            experience: '-',
            manifesto: getTranslation(language, 'notaDescription'),
            achievements: [getTranslation(language, 'notaOption')],
            criminalRecord: '-',
            assets: '-'
        }
    ];

    const handleVote = (candidateId) => {
        const candidate = candidatesWithProfiles.find(c => c.id === candidateId);
        if (window.confirm(`${getTranslation(language, 'confirmVote')} ${candidate.name}?`)) {
            voteFunction(candidateId);
        }
    };

    const openProfile = (candidate) => {
        setSelectedCandidate(candidate);
        setShowManifesto(false);
    };

    const closeProfile = () => {
        setSelectedCandidate(null);
        setShowManifesto(false);
    };

    return (
        <div className="candidate-profiles-container">
            <div className="profiles-header">
                <h2 className="profiles-title">👥 {getTranslation(language, 'candidateProfiles')}</h2>
                <p className="profiles-subtitle">{getTranslation(language, 'detailedCandidateInfo')}</p>
            </div>

            <div className="candidates-grid">
                {candidatesWithProfiles.map(candidate => (
                    <div key={candidate.id} className="profile-card">
                        <div className="profile-header">
                            <div className="profile-photo">{candidate.photo}</div>
                            <div className="profile-symbol">{candidate.symbol}</div>
                        </div>
                        
                        <div className="profile-info">
                            <h3 className="profile-name">{candidate.name}</h3>
                            <p className="profile-party">{candidate.party}</p>
                            
                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-label">{getTranslation(language, 'age')}:</span>
                                    <span className="stat-value">{candidate.age}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">{getTranslation(language, 'education')}:</span>
                                    <span className="stat-value">{candidate.education}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">{getTranslation(language, 'experience')}:</span>
                                    <span className="stat-value">{candidate.experience} {getTranslation(language, 'years')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button 
                                className="view-profile-btn"
                                onClick={() => openProfile(candidate)}
                            >
                                📋 {getTranslation(language, 'viewProfile')}
                            </button>
                            <button 
                                className="vote-btn"
                                onClick={() => handleVote(candidate.id)}
                            >
                                🗳️ {getTranslation(language, 'vote')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedCandidate && (
                <div className="profile-modal-overlay" onClick={closeProfile}>
                    <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedCandidate.name}</h2>
                            <button className="close-btn" onClick={closeProfile}>❌</button>
                        </div>

                        <div className="modal-content">
                            <div className="profile-section">
                                <div className="profile-main">
                                    <div className="large-photo">{selectedCandidate.photo}</div>
                                    <div className="large-symbol">{selectedCandidate.symbol}</div>
                                    <div className="basic-info">
                                        <h3>{selectedCandidate.name}</h3>
                                        <p className="party-name">{selectedCandidate.party}</p>
                                    </div>
                                </div>

                                <div className="detailed-stats">
                                    <div className="stat-row">
                                        <span className="label">{getTranslation(language, 'age')}:</span>
                                        <span className="value">{selectedCandidate.age}</span>
                                    </div>
                                    <div className="stat-row">
                                        <span className="label">{getTranslation(language, 'education')}:</span>
                                        <span className="value">{selectedCandidate.education}</span>
                                    </div>
                                    <div className="stat-row">
                                        <span className="label">{getTranslation(language, 'experience')}:</span>
                                        <span className="value">{selectedCandidate.experience} {getTranslation(language, 'years')}</span>
                                    </div>
                                    <div className="stat-row">
                                        <span className="label">{getTranslation(language, 'assets')}:</span>
                                        <span className="value">{selectedCandidate.assets}</span>
                                    </div>
                                    <div className="stat-row">
                                        <span className="label">{getTranslation(language, 'criminalRecord')}:</span>
                                        <span className="value">{selectedCandidate.criminalRecord}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="achievements-section">
                                <h4>{getTranslation(language, 'achievements')}</h4>
                                <ul>
                                    {selectedCandidate.achievements.map((achievement, index) => (
                                        <li key={index}>{achievement}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="manifesto-section">
                                <div className="manifesto-header">
                                    <h4>{getTranslation(language, 'manifesto')}</h4>
                                    <button 
                                        className="toggle-manifesto-btn"
                                        onClick={() => setShowManifesto(!showManifesto)}
                                    >
                                        {showManifesto ? '🔼' : '🔽'}
                                    </button>
                                </div>
                                {showManifesto && (
                                    <div className="manifesto-content">
                                        <pre>{selectedCandidate.manifesto}</pre>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button 
                                className="modal-vote-btn"
                                onClick={() => handleVote(selectedCandidate.id)}
                            >
                                🗳️ {getTranslation(language, 'voteForCandidate')} {selectedCandidate.name}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateProfiles;