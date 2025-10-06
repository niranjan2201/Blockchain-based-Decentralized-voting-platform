import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';

const MultipleElections = ({ language, account, voteFunction }) => {
    const [selectedElection, setSelectedElection] = useState('lokSabha');
    const [votes, setVotes] = useState({
        lokSabha: null,
        vidhanSabha: null,
        municipal: null
    });

    const elections = {
        lokSabha: {
            name: getTranslation(language, 'lokSabha'),
            candidates: [
                { id: 0, name: 'राहुल गांधी', party: 'कांग्रेस', symbol: '✋', photo: '👨‍💼' },
                { id: 1, name: 'नरेंद्र मोदी', party: 'भाजपा', symbol: '🪷', photo: '👨‍💼' },
                { id: 2, name: 'अरविंद केजरीवाल', party: 'आप', symbol: '🧹', photo: '👨‍💼' },
                { id: 'NOTA', name: getTranslation(language, 'nota'), party: '', symbol: '❌', photo: '🚫' }
            ]
        },
        vidhanSabha: {
            name: getTranslation(language, 'vidhanSabha'),
            candidates: [
                { id: 0, name: 'उद्धव ठाकरे', party: 'शिवसेना', symbol: '🏹', photo: '👨‍💼' },
                { id: 1, name: 'देवेंद्र फडणवीस', party: 'भाजपा', symbol: '🪷', photo: '👨‍💼' },
                { id: 2, name: 'शरद पवार', party: 'राष्ट्रवादी कांग्रेस', symbol: '⏰', photo: '👨‍💼' },
                { id: 'NOTA', name: getTranslation(language, 'nota'), party: '', symbol: '❌', photo: '🚫' }
            ]
        },
        municipal: {
            name: getTranslation(language, 'municipal'),
            candidates: [
                { id: 0, name: 'स्थानीय उम्मीदवार 1', party: 'स्वतंत्र', symbol: '🏠', photo: '👨‍💼' },
                { id: 1, name: 'स्थानीय उम्मीदवार 2', party: 'स्वतंत्र', symbol: '🌳', photo: '👨‍💼' },
                { id: 'NOTA', name: getTranslation(language, 'nota'), party: '', symbol: '❌', photo: '🚫' }
            ]
        }
    };

    const handleVote = (electionType, candidateId) => {
        setVotes(prev => ({
            ...prev,
            [electionType]: candidateId
        }));
    };

    const submitAllVotes = () => {
        const votesToSubmit = Object.entries(votes).filter(([_, vote]) => vote !== null);
        if (votesToSubmit.length === 0) {
            alert(getTranslation(language, 'selectAtLeastOne'));
            return;
        }
        
        // Submit votes for each election
        votesToSubmit.forEach(([electionType, candidateId]) => {
            voteFunction(candidateId, electionType);
        });
        
        alert(getTranslation(language, 'allVotesSubmitted'));
    };

    return (
        <div className="multiple-elections-container">
            <div className="election-header">
                <h2 className="election-title">🗳️ {getTranslation(language, 'multipleElections')}</h2>
                <p className="election-subtitle">{getTranslation(language, 'simultaneousElections')}</p>
            </div>

            <div className="election-tabs">
                {Object.keys(elections).map(electionKey => (
                    <button
                        key={electionKey}
                        className={`election-tab ${selectedElection === electionKey ? 'active' : ''}`}
                        onClick={() => setSelectedElection(electionKey)}
                    >
                        {elections[electionKey].name}
                        {votes[electionKey] !== null && <span className="voted-indicator">✅</span>}
                    </button>
                ))}
            </div>

            <div className="election-content">
                <h3 className="current-election">{elections[selectedElection].name}</h3>
                
                <div className="candidates-grid">
                    {elections[selectedElection].candidates.map(candidate => (
                        <div 
                            key={candidate.id}
                            className={`candidate-card ${votes[selectedElection] === candidate.id ? 'selected' : ''}`}
                            onClick={() => handleVote(selectedElection, candidate.id)}
                        >
                            <div className="candidate-photo">{candidate.photo}</div>
                            <div className="candidate-symbol">{candidate.symbol}</div>
                            <div className="candidate-info">
                                <h4 className="candidate-name">{candidate.name}</h4>
                                <p className="candidate-party">{candidate.party}</p>
                            </div>
                            {votes[selectedElection] === candidate.id && (
                                <div className="selection-indicator">✅</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="voting-summary">
                <h3>{getTranslation(language, 'votingSummary')}</h3>
                <div className="summary-grid">
                    {Object.entries(elections).map(([electionKey, election]) => (
                        <div key={electionKey} className="summary-item">
                            <span className="election-name">{election.name}:</span>
                            <span className="selected-candidate">
                                {votes[electionKey] !== null 
                                    ? election.candidates.find(c => c.id === votes[electionKey])?.name || 'NOTA'
                                    : getTranslation(language, 'notSelected')
                                }
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="submit-section">
                <button 
                    className="submit-all-votes-btn"
                    onClick={submitAllVotes}
                    disabled={Object.values(votes).every(vote => vote === null)}
                >
                    🗳️ {getTranslation(language, 'submitAllVotes')}
                </button>
            </div>
        </div>
    );
};

export default MultipleElections;