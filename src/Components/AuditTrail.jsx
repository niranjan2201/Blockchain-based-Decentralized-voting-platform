import React, { useState, useEffect } from 'react';

const AuditTrail = ({ account }) => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Simulate audit trail data - in real implementation, this would come from blockchain events
        const mockAuditData = [
            {
                id: 1,
                timestamp: new Date().toISOString(),
                action: 'VOTE_CAST',
                voter: '0x1234...5678',
                candidate: 'Candidate A',
                blockNumber: 12345,
                transactionHash: '0xabc123...def456'
            },
            {
                id: 2,
                timestamp: new Date(Date.now() - 300000).toISOString(),
                action: 'CANDIDATE_ADDED',
                admin: '0x9876...5432',
                candidate: 'Candidate B',
                blockNumber: 12344,
                transactionHash: '0xdef456...abc123'
            },
            {
                id: 3,
                timestamp: new Date(Date.now() - 600000).toISOString(),
                action: 'VOTING_STARTED',
                admin: '0x9876...5432',
                duration: '90 minutes',
                blockNumber: 12343,
                transactionHash: '0x123abc...456def'
            }
        ];
        setAuditLogs(mockAuditData);
    }, []);

    const filteredLogs = auditLogs.filter(log => {
        if (filter === 'all') return true;
        return log.action.toLowerCase().includes(filter.toLowerCase());
    });

    const getActionIcon = (action) => {
        switch (action) {
            case 'VOTE_CAST': return '🗳️';
            case 'CANDIDATE_ADDED': return '👤';
            case 'VOTING_STARTED': return '▶️';
            case 'VOTING_ENDED': return '⏹️';
            default: return '📝';
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'VOTE_CAST': return '#138808';
            case 'CANDIDATE_ADDED': return '#000080';
            case 'VOTING_STARTED': return '#FF9933';
            case 'VOTING_ENDED': return '#ff6b6b';
            default: return '#666';
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const exportAuditTrail = () => {
        const csvContent = [
            ['Timestamp', 'Action', 'Details', 'Block Number', 'Transaction Hash'],
            ...filteredLogs.map(log => [
                formatTimestamp(log.timestamp),
                log.action,
                log.candidate || log.duration || 'N/A',
                log.blockNumber,
                log.transactionHash
            ])
        ].map(row => row.join(',')).join('\\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="audit-trail-container">
            <div className="audit-header">
                <h2 className="audit-title">📋 Audit Trail</h2>
                <p className="audit-subtitle">Complete Voting History & Blockchain Records</p>
            </div>

            <div className="audit-controls">
                <div className="filter-section">
                    <label>Filter by Action:</label>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Actions</option>
                        <option value="vote">Votes Cast</option>
                        <option value="candidate">Candidate Actions</option>
                        <option value="voting">Voting Control</option>
                    </select>
                </div>
                
                <button onClick={exportAuditTrail} className="export-button">
                    📥 Export CSV
                </button>
            </div>

            <div className="audit-stats">
                <div className="audit-stat">
                    <span className="stat-number">{auditLogs.length}</span>
                    <span className="stat-label">Total Events</span>
                </div>
                <div className="audit-stat">
                    <span className="stat-number">{auditLogs.filter(log => log.action === 'VOTE_CAST').length}</span>
                    <span className="stat-label">Votes Recorded</span>
                </div>
                <div className="audit-stat">
                    <span className="stat-number">{auditLogs.filter(log => log.action === 'CANDIDATE_ADDED').length}</span>
                    <span className="stat-label">Candidates Added</span>
                </div>
            </div>

            <div className="audit-logs">
                {filteredLogs.map((log) => (
                    <div key={log.id} className="audit-log-item">
                        <div className="log-icon" style={{ color: getActionColor(log.action) }}>
                            {getActionIcon(log.action)}
                        </div>
                        <div className="log-content">
                            <div className="log-header">
                                <span className="log-action" style={{ color: getActionColor(log.action) }}>
                                    {log.action.replace('_', ' ')}
                                </span>
                                <span className="log-timestamp">
                                    {formatTimestamp(log.timestamp)}
                                </span>
                            </div>
                            <div className="log-details">
                                {log.voter && <span>Voter: {log.voter}</span>}
                                {log.admin && <span>Admin: {log.admin}</span>}
                                {log.candidate && <span>Candidate: {log.candidate}</span>}
                                {log.duration && <span>Duration: {log.duration}</span>}
                            </div>
                            <div className="log-blockchain">
                                <span>Block: #{log.blockNumber}</span>
                                <span className="tx-hash">TX: {log.transactionHash}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditTrail;