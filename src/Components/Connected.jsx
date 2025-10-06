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
                <div className="candidate-form">
                    <div className="form-row">
                        <input 
                            type="text" 
                            placeholder={getTranslation(props.language, 'candidateName')} 
                            value={props.candidateName} 
                            onChange={props.handleCandidateNameChange}
                            className="form-input"
                        />
                        <input 
                            type="text" 
                            placeholder={getTranslation(props.language, 'partyName')} 
                            value={props.candidateParty || ''} 
                            onChange={props.handleCandidatePartyChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-row">
                        <input 
                            type="number" 
                            placeholder={getTranslation(props.language, 'candidateAge')} 
                            value={props.candidateAge || ''} 
                            onChange={props.handleCandidateAgeChange}
                            className="form-input"
                            min="25"
                            max="80"
                        />
                        <select 
                            value={props.candidateEducation || ''} 
                            onChange={props.handleCandidateEducationChange}
                            className="form-input"
                        >
                            <option value="">{getTranslation(props.language, 'selectEducation')}</option>
                            <option value="दसवीं">{getTranslation(props.language, 'class10')}</option>
                            <option value="बारहवीं">{getTranslation(props.language, 'class12')}</option>
                            <option value="स्नातक">{getTranslation(props.language, 'graduate')}</option>
                            <option value="स्नातकोत्तर">{getTranslation(props.language, 'postGraduate')}</option>
                            <option value="डॉक्टरेट">{getTranslation(props.language, 'doctorate')}</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <input 
                            type="number" 
                            placeholder={getTranslation(props.language, 'experienceYears')} 
                            value={props.candidateExperience || ''} 
                            onChange={props.handleCandidateExperienceChange}
                            className="form-input"
                            min="0"
                            max="50"
                        />
                        <input 
                            type="text" 
                            placeholder={getTranslation(props.language, 'partySymbol')} 
                            value={props.candidateSymbol || ''} 
                            onChange={props.handleCandidateSymbolChange}
                            className="form-input"
                            maxLength="2"
                        />
                    </div>
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