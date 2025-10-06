import React, { useState, useEffect } from 'react';
import { getTranslation } from '../utils/translations';

const Dashboard = ({ candidates, totalVoters, votingStart, votingEnd, language }) => {
    const [totalVotes, setTotalVotes] = useState(0);
    const [turnoutPercentage, setTurnoutPercentage] = useState(0);
    const [leadingCandidate, setLeadingCandidate] = useState(null);

    useEffect(() => {
        const total = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
        setTotalVotes(total);
        setTurnoutPercentage(totalVoters > 0 ? ((total / totalVoters) * 100).toFixed(2) : 0);
        
        if (candidates.length > 0) {
            const leading = candidates.reduce((prev, current) => 
                prev.voteCount > current.voteCount ? prev : current
            );
            setLeadingCandidate(leading);
        }
    }, [candidates, totalVoters]);

    const getVotePercentage = (voteCount) => {
        return totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;
    };

    const getBarWidth = (voteCount) => {
        return totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2 className="dashboard-title">{getTranslation(language, 'dashboardTitle')}</h2>
                <p className="dashboard-subtitle">{getTranslation(language, 'dashboardSubtitle')}</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🗳️</div>
                    <div className="stat-info">
                        <h3>{totalVotes}</h3>
                        <p>{getTranslation(language, 'totalVotesCast')}</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-info">
                        <h3>{turnoutPercentage}%</h3>
                        <p>{getTranslation(language, 'voterTurnout')}</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{candidates.length}</h3>
                        <p>{getTranslation(language, 'totalCandidates')}</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-info">
                        <h3>{leadingCandidate?.name || 'N/A'}</h3>
                        <p>{getTranslation(language, 'leadingCandidate')}</p>
                    </div>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h3 className="chart-title">{getTranslation(language, 'voteDistribution')}</h3>
                    <div className="bar-chart">
                        {candidates.map((candidate, index) => (
                            <div key={index} className="bar-item">
                                <div className="bar-label">
                                    <span className="candidate-name">{candidate.name}</span>
                                    <span className="vote-info">
                                        {candidate.voteCount} votes ({getVotePercentage(candidate.voteCount)}%)
                                    </span>
                                </div>
                                <div className="bar-container">
                                    <div 
                                        className="bar-fill" 
                                        style={{ width: `${getBarWidth(candidate.voteCount)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pie-chart-container">
                    <h3 className="chart-title">{getTranslation(language, 'voteShare')}</h3>
                    <div className="pie-chart">
                        {candidates.map((candidate, index) => {
                            const percentage = getVotePercentage(candidate.voteCount);
                            return (
                                <div key={index} className="pie-segment">
                                    <div className="pie-label">
                                        <div className={`pie-color pie-color-${index}`}></div>
                                        <span>{candidate.name}: {percentage}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;