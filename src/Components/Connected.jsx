import React from "react";
import { getTranslation } from '../utils/translations';

const Connected = (props) => {
    return (
        <div className="connected-container">
            <div className="connected-header">
                <div className="gov-logo-container">
                    <div className="ashoka-chakra">☸️</div>
                </div>
                <h1 className="main-title">{getTranslation(props.language, 'mainTitle')}</h1>
                <p className="main-subtitle">{getTranslation(props.language, 'mainSubtitle')}</p>
            </div>
            
            <div className="account-info">
                <p className="connected-account">{getTranslation(props.language, 'registeredVoter')} {props.account}</p>
                <p className="connected-account">{getTranslation(props.language, 'votingTimeRemaining')} {props.remainingTime} {getTranslation(props.language, 'seconds')}</p>
                <p className="connected-account">{getTranslation(props.language, 'electionStatus')}</p>
            </div>

            <div className="voting-section">
                { props.showButton ? (
                    <div className="already-voted">
                        {getTranslation(props.language, 'alreadyVoted')}
                    </div>
                ) : (
                    <div>
                        <h3 className="section-title">{getTranslation(props.language, 'castVote')}</h3>
                        <p style={{textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted, #666)'}}>
                            {getTranslation(props.language, 'voteInstruction')}
                        </p>
                        <div className="vote-input-container">
                            <input 
                                type="number" 
                                placeholder={getTranslation(props.language, 'candidateIndex')} 
                                value={props.number} 
                                onChange={props.handleNumberChange}
                            />
                            <button className="connected-button" onClick={props.voteFunction}>
                                {getTranslation(props.language, 'submitVote')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="add-candidate-section">
                <h3 className="section-title">{getTranslation(props.language, 'registerCandidate')}</h3>
                <p style={{textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted, #666)'}}>
                    {getTranslation(props.language, 'officialOnly')}
                </p>
                <div className="candidate-input-container">
                    <input 
                        type="text" 
                        placeholder={getTranslation(props.language, 'candidateName')} 
                        value={props.candidateName} 
                        onChange={props.handleCandidateNameChange}
                    />
                    <button className="add-button" onClick={props.addCandidateFunction}>
                        {getTranslation(props.language, 'registerBtn')}
                    </button>
                </div>
            </div>
            
            <div className="voting-section">
                <h3 className="section-title">{getTranslation(props.language, 'candidateList')}</h3>
                <table className="candidates-table">
                    <thead>
                        <tr>
                            <th>{getTranslation(props.language, 'candidateIndexCol')}</th>
                            <th>{getTranslation(props.language, 'candidateNameCol')}</th>
                            <th>{getTranslation(props.language, 'totalVotesCol')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.candidates.map((candidate, index) => (
                            <tr key={index}>
                                <td><strong>{candidate.index}</strong></td>
                                <td>💼 {candidate.name}</td>
                                <td><span className="vote-count">{candidate.voteCount} {getTranslation(props.language, 'votes')}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Connected;