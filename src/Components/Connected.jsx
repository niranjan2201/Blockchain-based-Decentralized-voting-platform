import React from "react";

const Connected = (props) => {
    return (
        <div className="connected-container">
            <h1 className="connected-header">🗳️ Decentralized Voting Platform</h1>
            
            <div className="account-info">
                <p className="connected-account">📱 Connected Account: {props.account}</p>
                <p className="connected-account">⏰ Remaining Time: {props.remainingTime} seconds</p>
            </div>

            <div className="voting-section">
                { props.showButton ? (
                    <div className="already-voted">
                        ✅ You have already voted! Thank you for participating.
                    </div>
                ) : (
                    <div>
                        <h3 className="section-title">Cast Your Vote</h3>
                        <div className="vote-input-container">
                            <input 
                                type="number" 
                                placeholder="Enter Candidate Index" 
                                value={props.number} 
                                onChange={props.handleNumberChange}
                            />
                            <button className="connected-button" onClick={props.voteFunction}>
                                🗳️ Vote
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="add-candidate-section">
                <h3 className="section-title">➕ Add New Candidate</h3>
                <div className="candidate-input-container">
                    <input 
                        type="text" 
                        placeholder="Enter Candidate Name" 
                        value={props.candidateName} 
                        onChange={props.handleCandidateNameChange}
                    />
                    <button className="add-button" onClick={props.addCandidateFunction}>
                        Add Candidate
                    </button>
                </div>
            </div>
            
            <table className="candidates-table">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Candidate Name</th>
                        <th>Vote Count</th>
                    </tr>
                </thead>
                <tbody>
                    {props.candidates.map((candidate, index) => (
                        <tr key={index}>
                            <td><strong>{candidate.index}</strong></td>
                            <td>{candidate.name}</td>
                            <td className="vote-count">{candidate.voteCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Connected;