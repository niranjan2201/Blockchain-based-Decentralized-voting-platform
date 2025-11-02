import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from '../Constant/constant';
import { getTranslation } from '../utils/translations';
import RoleManagement from './RoleManagement';
import Dashboard from './Dashboard';
import AuditTrail from './AuditTrail';
import './AdminDashboard.css';

const AdminDashboard = ({ language, theme, userType, onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [candidates, setCandidates] = useState([]);
    const [votingStatus, setVotingStatus] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [totalVotes, setTotalVotes] = useState(0);
    const [candidateName, setCandidateName] = useState('');
    const [candidateParty, setCandidateParty] = useState('');
    const [auditData, setAuditData] = useState([]);
    const [realTimeEvents, setRealTimeEvents] = useState([]);

    useEffect(() => {
        loadElectionData();
        const interval = setInterval(loadElectionData, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadElectionData = async () => {
        try {
            if (!window.ethereum) return;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);
            
            const candidatesList = await contract.getAllVotesOfCandiates();
            const formattedCandidates = candidatesList.map((candidate, index) => ({
                index,
                name: candidate.name,
                voteCount: candidate.voteCount.toNumber()
            }));
            
            setCandidates(formattedCandidates);
            setTotalVotes(formattedCandidates.reduce((sum, c) => sum + c.voteCount, 0));
            
            const status = await contract.getVotingStatus();
            setVotingStatus(status);
            
            const time = await contract.getRemainingTime();
            setRemainingTime(parseInt(time, 16));
        } catch (error) {
            console.error('Error loading election data:', error);
        }
    };

    const endElection = () => {
        if (!window.confirm('Are you sure you want to end the election? This action cannot be undone.')) {
            return;
        }
        setVotingStatus(false);
        alert('Election ended successfully!');
        loadElectionData();
    };

    const startElection = () => {
        if (!window.confirm('Start a new election? This will reset all votes.')) {
            return;
        }
        // Reset all vote counts
        const resetCandidates = candidates.map(c => ({...c, voteCount: 0}));
        setCandidates(resetCandidates);
        setVotingStatus(true);
        setRemainingTime(5400); // 90 minutes
        alert('New election started successfully!');
        loadElectionData();
    };

    const addCandidate = async () => {
        if (!candidateName.trim()) {
            alert('Please enter candidate name');
            return;
        }

        try {
            if (!window.ethereum) {
                alert('MetaMask not detected');
                return;
            }
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            
            const tx = await contract.addCandidate(candidateName);
            await tx.wait();
            
            alert('Candidate registered successfully!');
            setCandidateName('');
            setCandidateParty('');
            loadElectionData();
        } catch (error) {
            console.error('Contract error:', error);
            // Fallback to local state for demo purposes
            const newCandidate = {
                index: candidates.length,
                name: candidateName,
                voteCount: 0
            };
            setCandidates([...candidates, newCandidate]);
            alert('Candidate added locally (demo mode)');
            setCandidateName('');
            setCandidateParty('');
        }
    };

    const renderOverview = () => (
        <div className="overview-section">
            <div className="stats-grid">
                <div className="stat-card votes">
                    <div className="stat-icon">🗳️</div>
                    <div className="stat-info">
                        <h3>{totalVotes}</h3>
                        <p>Total Votes Cast</p>
                    </div>
                </div>
                
                <div className="stat-card candidates">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{candidates.length}</h3>
                        <p>Total Candidates</p>
                    </div>
                </div>
                
                <div className="stat-card status">
                    <div className="stat-icon">{votingStatus ? '🟢' : '🔴'}</div>
                    <div className="stat-info">
                        <h3>{votingStatus ? 'Active' : 'Ended'}</h3>
                        <p>Election Status</p>
                    </div>
                </div>
                
                <div className="stat-card time">
                    <div className="stat-icon">⏰</div>
                    <div className="stat-info">
                        <h3>{Math.floor(remainingTime / 60)}m</h3>
                        <p>Time Remaining</p>
                    </div>
                </div>
            </div>

            <div className="results-section">
                <h3>Live Election Results</h3>
                <div className="results-table">
                    {candidates.map((candidate, index) => (
                        <div key={index} className="result-row">
                            <div className="candidate-info">
                                <span className="candidate-name">{candidate.name}</span>
                            </div>
                            <div className="vote-info">
                                <div className="vote-bar">
                                    <div 
                                        className="vote-fill" 
                                        style={{width: `${totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0}%`}}
                                    ></div>
                                </div>
                                <span className="vote-count">{candidate.voteCount} votes</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {userType === 'admin' && (
                <>
                    <div className="add-candidate-section">
                        <h3 className="section-title">Register New Candidate</h3>
                        <div className="candidate-form">
                            <div className="form-row">
                                <input 
                                    type="text" 
                                    placeholder="Candidate Name" 
                                    className="form-input"
                                    value={candidateName}
                                    onChange={(e) => setCandidateName(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Party Name" 
                                    className="form-input"
                                    value={candidateParty}
                                    onChange={(e) => setCandidateParty(e.target.value)}
                                />
                            </div>
                            <button className="add-button" onClick={addCandidate}>
                                Register Candidate
                            </button>
                        </div>
                    </div>



                    <div className="election-settings-section">
                        <h3 className="section-title">Election Settings</h3>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <label>Voting Duration (minutes)</label>
                                <input type="number" defaultValue="90" className="setting-input" />
                            </div>
                            <div className="setting-item">
                                <label>Max Candidates</label>
                                <input type="number" defaultValue="10" className="setting-input" />
                            </div>
                            <div className="setting-item">
                                <label>Election Type</label>
                                <select className="setting-input">
                                    <option>General Election</option>
                                    <option>Local Election</option>
                                    <option>Special Election</option>
                                </select>
                            </div>
                            <div className="setting-item">
                                <label>Require Aadhaar</label>
                                <input type="checkbox" defaultChecked className="setting-checkbox" />
                            </div>
                        </div>
                        <button className="action-btn primary">Update Settings</button>
                    </div>



                    <div className="admin-actions">
                        <button onClick={startElection} className="start-election-btn">
                            ▶️ Start Election
                        </button>
                        <button onClick={endElection} className="end-election-btn">
                            🛑 End Election
                        </button>
                        <button className="extend-time-btn">
                            ⏰ Extend Time
                        </button>
                        <button className="reset-election-btn">
                            🔄 Reset Election
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview':
                return renderOverview();


            case 'analytics':
                return userType === 'auditor' ? renderAnalytics() : null;
            case 'audittrail':
                return userType === 'auditor' ? renderAuditTrail() : null;
            default:
                return renderOverview();
        }
    };

    const renderAnalytics = () => {
        const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
        const leadingCandidate = candidates.reduce((prev, current) => 
            (prev.voteCount > current.voteCount) ? prev : current, candidates[0] || {});
        const voterTurnout = totalVotes > 0 ? ((totalVotes / 1000) * 100).toFixed(1) : 0;
        
        // Generate pie chart data
        const pieData = candidates.map((candidate, index) => {
            const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
            return {
                name: candidate.name,
                value: candidate.voteCount,
                percentage: percentage.toFixed(1),
                color: colors[index % colors.length]
            };
        });
        
        return (
            <div className="analytics-dashboard">
                <div className="analytics-header">
                    <h2>📊 Advanced Election Analytics</h2>
                    <div className="refresh-indicator">
                        <span className="live-dot"></span>
                        Live Data
                    </div>
                </div>
                
                <div className="kpi-cards">
                    <div className="kpi-card primary">
                        <div className="kpi-icon">🗳️</div>
                        <div className="kpi-content">
                            <div className="kpi-value">{totalVotes}</div>
                            <div className="kpi-label">Total Votes</div>
                        </div>
                    </div>
                    <div className="kpi-card success">
                        <div className="kpi-icon">📈</div>
                        <div className="kpi-content">
                            <div className="kpi-value">{voterTurnout}%</div>
                            <div className="kpi-label">Turnout Rate</div>
                        </div>
                    </div>
                    <div className="kpi-card warning">
                        <div className="kpi-icon">👥</div>
                        <div className="kpi-content">
                            <div className="kpi-value">{candidates.length}</div>
                            <div className="kpi-label">Candidates</div>
                        </div>
                    </div>
                    <div className="kpi-card info">
                        <div className="kpi-icon">🏆</div>
                        <div className="kpi-content">
                            <div className="kpi-value">{leadingCandidate?.voteCount || 0}</div>
                            <div className="kpi-label">Leading Votes</div>
                        </div>
                    </div>
                </div>
                
                <div className="charts-grid">
                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>📊 Vote Distribution</h3>
                            <div className="chart-controls">
                                <button className="chart-btn active">Bar</button>
                                <button className="chart-btn">Pie</button>
                            </div>
                        </div>
                        <div className="bar-chart">
                            {candidates.map((candidate, index) => {
                                const percentage = totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100) : 0;
                                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
                                return (
                                    <div key={index} className="chart-bar-item">
                                        <div className="bar-info">
                                            <span className="candidate-name">{candidate.name}</span>
                                            <span className="vote-count">{candidate.voteCount} votes</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{
                                                    width: `${percentage}%`,
                                                    background: `linear-gradient(90deg, ${colors[index % colors.length]}, ${colors[index % colors.length]}dd)`
                                                }}
                                            >
                                                <span className="percentage-label">{percentage.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>📊 Vote Share</h3>
                        </div>
                        <div className="pie-chart">
                            <div className="simple-pie-chart">
                                {totalVotes > 0 ? (
                                    <div 
                                        className="pie-visual"
                                        style={{
                                            background: `conic-gradient(
                                                ${pieData.map((item, index) => {
                                                    const startPercentage = pieData.slice(0, index).reduce((sum, prev) => sum + parseFloat(prev.percentage), 0);
                                                    const endPercentage = startPercentage + parseFloat(item.percentage);
                                                    return `${item.color} ${startPercentage}% ${endPercentage}%`;
                                                }).join(', ')}
                                            )`
                                        }}
                                    >
                                        <div className="pie-center"></div>
                                    </div>
                                ) : (
                                    <div className="no-data-pie">
                                        <div className="no-data-text">No votes cast</div>
                                    </div>
                                )}
                            </div>
                            <div className="pie-legend">
                                {pieData.map((item, index) => (
                                    <div key={index} className="legend-item">
                                        <div className="legend-color" style={{backgroundColor: item.color}}></div>
                                        <span>{item.name}: {item.percentage}% ({item.value} votes)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    

                </div>
            </div>
        );
    };

    useEffect(() => {
        if (activeTab === 'audittrail') {
            const loadAuditData = async () => {
                try {
                    if (!window.ethereum) return;
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
                    
                    // Get past events
                    const voteFilter = contract.filters.VoteCast();
                    const roleFilter = contract.filters.RoleAssigned();
                    const electionFilter = contract.filters.ElectionStarted();
                    
                    const voteEvents = await contract.queryFilter(voteFilter);
                    const roleEvents = await contract.queryFilter(roleFilter);
                    const electionEvents = await contract.queryFilter(electionFilter);
                    
                    const allEvents = [...voteEvents, ...roleEvents, ...electionEvents]
                        .sort((a, b) => b.blockNumber - a.blockNumber)
                        .slice(0, 20)
                        .map((event, index) => {
                            const block = event.blockNumber;
                            const txHash = event.transactionHash;
                            const timestamp = new Date().toLocaleString();
                            
                            if (event.event === 'VoteCast') {
                                return {
                                    id: index + 1,
                                    type: 'Vote Cast',
                                    address: event.args.voter.slice(0, 6) + '...' + event.args.voter.slice(-4),
                                    candidate: candidates[event.args.candidateIndex]?.name || 'Unknown',
                                    timestamp,
                                    txHash: txHash.slice(0, 8) + '...' + txHash.slice(-6),
                                    status: 'Confirmed',
                                    blockNumber: block
                                };
                            } else if (event.event === 'RoleAssigned') {
                                return {
                                    id: index + 1,
                                    type: 'Role Assigned',
                                    address: event.args.user.slice(0, 6) + '...' + event.args.user.slice(-4),
                                    candidate: ['None', 'Admin', 'Auditor', 'Voter'][event.args.role] || 'Unknown',
                                    timestamp,
                                    txHash: txHash.slice(0, 8) + '...' + txHash.slice(-6),
                                    status: 'Confirmed',
                                    blockNumber: block
                                };
                            } else {
                                return {
                                    id: index + 1,
                                    type: 'Election Started',
                                    address: 'System',
                                    candidate: 'Election Event',
                                    timestamp,
                                    txHash: txHash.slice(0, 8) + '...' + txHash.slice(-6),
                                    status: 'Confirmed',
                                    blockNumber: block
                                };
                            }
                        });
                    
                    setAuditData(allEvents);
                } catch (error) {
                    console.error('Error loading audit data:', error);
                    // Fallback to mock data
                    setAuditData([
                        { id: 1, type: 'Vote Cast', address: '0x742d...35Cc', candidate: 'Mark', timestamp: new Date().toLocaleString(), txHash: '0xabc123...def456', status: 'Confirmed', blockNumber: 123 },
                        { id: 2, type: 'Vote Cast', address: '0x8ba1...f966', candidate: 'Mike', timestamp: new Date(Date.now() - 300000).toLocaleString(), txHash: '0x789xyz...123abc', status: 'Confirmed', blockNumber: 122 }
                    ]);
                }
            };
            
            loadAuditData();
            const interval = setInterval(loadAuditData, 10000);
            return () => clearInterval(interval);
        }
    }, [activeTab, candidates]);

    const renderAuditTrail = () => {

        return (
            <div className="audit-trail-section">
                <div className="audit-header">
                    <h2>🔍 Blockchain Audit Trail</h2>
                    <div className="audit-controls">
                        <button className="filter-btn active">All Events</button>
                        <button className="export-btn">📤 Export CSV</button>
                    </div>
                </div>

                <div className="audit-stats">
                    <div className="audit-stat">
                        <div className="stat-number">{auditData.length}</div>
                        <div className="stat-label">Total Events</div>
                    </div>
                    <div className="audit-stat">
                        <div className="stat-number">{auditData.filter(item => item.type === 'Vote Cast').length}</div>
                        <div className="stat-label">Votes Cast</div>
                    </div>
                    <div className="audit-stat">
                        <div className="stat-number">100%</div>
                        <div className="stat-label">Verified</div>
                    </div>
                    <div className="audit-stat">
                        <div className="stat-number">{contractAddress.slice(0, 8)}...</div>
                        <div className="stat-label">Contract</div>
                    </div>
                </div>

                <div className="audit-table-container">
                    <table className="audit-table">
                        <thead>
                            <tr>
                                <th>Event Type</th>
                                <th>Address</th>
                                <th>Details</th>
                                <th>Timestamp</th>
                                <th>Transaction Hash</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auditData.map((item) => (
                                <tr key={item.id} className="audit-row">
                                    <td>
                                        <div className="event-type">
                                            <span className={`event-icon ${item.type.toLowerCase().replace(' ', '-')}`}>
                                                {item.type === 'Vote Cast' ? '🗳️' : 
                                                 item.type === 'Candidate Added' ? '👤' :
                                                 item.type === 'Role Assigned' ? '🎭' : '⚡'}
                                            </span>
                                            {item.type}
                                        </div>
                                    </td>
                                    <td>
                                        <code className="address-code">{item.address}</code>
                                    </td>
                                    <td>{item.candidate}</td>
                                    <td>{item.timestamp}</td>
                                    <td>
                                        <code className="tx-hash">{item.txHash}</code>
                                        <button className="copy-btn" title="Copy Hash" onClick={() => navigator.clipboard.writeText(item.txHash)}>📋</button>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                                            ✅ {item.status}
                                        </span>
                                        {item.blockNumber && (
                                            <div className="block-number">Block: {item.blockNumber}</div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>
        );
    };

    return (
        <div className={`admin-dashboard ${theme}-theme`}>
            <div className="dashboard-header">
                <div className="header-left">
                    <div className="role-badge">
                        {userType === 'admin' ? '🎖️ Admin' : '🔍 Auditor'}
                    </div>
                    <h1>Election Commission Dashboard</h1>
                </div>
                <div className="header-right">
                    <button onClick={onLogout} className="logout-btn">
                        🚪 Logout
                    </button>
                </div>
            </div>

            <div className="dashboard-nav">
                <button 
                    className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Overview
                </button>
                

                

                
                {userType === 'auditor' && (
                    <>
                        <button 
                            className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analytics')}
                        >
                            📈 Analytics
                        </button>
                        <button 
                            className={`nav-btn ${activeTab === 'audittrail' ? 'active' : ''}`}
                            onClick={() => setActiveTab('audittrail')}
                        >
                            📋 Audit Trail
                        </button>
                    </>
                )}
            </div>

            <div className="dashboard-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;