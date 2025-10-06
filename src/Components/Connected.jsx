import React from "react";

const Connected = (props) => {
    return (
        <div className="connected-container">
            <div className="connected-header">
                <div className="gov-logo-container">
                    <div className="ashoka-chakra">☸️</div>
                </div>
                <h1 className="main-title">🇮🇳 Digital India Voting Portal</h1>
                <p className="main-subtitle">Government of India - Blockchain Based Secure Voting System</p>
            </div>
            
            <div className="account-info">
                <p className="connected-account">📱 Registered Voter ID: {props.account}</p>
                <p className="connected-account">⏰ Voting Time Remaining: {props.remainingTime} seconds</p>
                <p className="connected-account">📊 Election Status: Active</p>
            </div>

            <div className="voting-section">
                { props.showButton ? (
                    <div className="already-voted">
                        ✅ Your vote has been successfully recorded on the blockchain!<br/>
                        Thank you for participating in India's democratic process.
                    </div>
                ) : (
                    <div>
                        <h3 className="section-title">🗳️ Cast Your Vote</h3>
                        <p style={{textAlign: 'center', marginBottom: '1rem', color: '#666'}}>
                            Select candidate index from the table below and cast your vote
                        </p>
                        <div className="vote-input-container">
                            <input 
                                type="number" 
                                placeholder="Enter Candidate Index (0, 1, 2...)" 
                                value={props.number} 
                                onChange={props.handleNumberChange}
                            />
                            <button className="connected-button" onClick={props.voteFunction}>
                                🗳️ Submit Vote
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="add-candidate-section">
                <h3 className="section-title">📝 Register New Candidate</h3>
                <p style={{textAlign: 'center', marginBottom: '1rem', color: '#666'}}>
                    Election Commission Officials Only
                </p>
                <div className="candidate-input-container">
                    <input 
                        type="text" 
                        placeholder="Enter Candidate Full Name" 
                        value={props.candidateName} 
                        onChange={props.handleCandidateNameChange}
                    />
                    <button className="add-button" onClick={props.addCandidateFunction}>
                        ➕ Register Candidate
                    </button>
                </div>
            </div>
            
            <div className="voting-section">
                <h3 className="section-title">📋 Official Candidate List</h3>
                <table className="candidates-table">
                    <thead>
                        <tr>
                            <th>Candidate Index</th>
                            <th>Candidate Name</th>
                            <th>Total Votes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.candidates.map((candidate, index) => (
                            <tr key={index}>
                                <td><strong>{candidate.index}</strong></td>
                                <td>💼 {candidate.name}</td>
                                <td><span className="vote-count">{candidate.voteCount}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Connected;