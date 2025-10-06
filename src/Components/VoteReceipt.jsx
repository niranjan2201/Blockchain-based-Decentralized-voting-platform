import React from 'react';
import { getTranslation } from '../utils/translations';

const VoteReceipt = ({ language, voteData, onClose }) => {
    const generateQRCode = (data) => {
        // Simple QR code representation using Unicode blocks
        // In a real implementation, you'd use a QR code library
        const qrPattern = [
            '█████████████████████████',
            '█       █   █ █ █       █',
            '█ █████ █ █ █   █ █████ █',
            '█ █████ █   █ █ █ █████ █',
            '█ █████ █ █   █ █ █████ █',
            '█       █ █ █ █ █       █',
            '█████████████████████████',
            '        █ █   █          ',
            '█ █ █ █ █   █ █ █ █ █ █ █',
            '  █   █   █ █   █   █   █',
            '█ █ █ █ █ █ █ █ █ █ █ █ █',
            '        █   █ █          ',
            '█████████████████████████',
            '█       █ █   █ █       █',
            '█ █████ █   █ █ █ █████ █',
            '█ █████ █ █ █   █ █████ █',
            '█ █████ █   █ █ █ █████ █',
            '█       █ █ █ █ █       █',
            '█████████████████████████'
        ];
        return qrPattern.join('\n');
    };

    const downloadReceipt = () => {
        const receiptContent = `
===========================================
        ${getTranslation(language, 'voteReceipt')}
===========================================

${getTranslation(language, 'voterDetails')}:
${getTranslation(language, 'name')}: ${voteData.voterName}
${getTranslation(language, 'aadhaarNumber')}: ${voteData.aadhaarNumber}
${getTranslation(language, 'walletAddress')}: ${voteData.walletAddress}

${getTranslation(language, 'voteDetails')}:
${getTranslation(language, 'candidateVoted')}: ${voteData.candidateName}
${getTranslation(language, 'voteTime')}: ${new Date(voteData.timestamp).toLocaleString('en-IN')}
${getTranslation(language, 'transactionHash')}: ${voteData.transactionHash}

${getTranslation(language, 'verification')}:
${getTranslation(language, 'receiptId')}: ${voteData.receiptId}
${getTranslation(language, 'blockNumber')}: ${voteData.blockNumber}

===========================================
${getTranslation(language, 'governmentFooter')}
===========================================
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vote_receipt_${voteData.receiptId}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const printReceipt = () => {
        window.print();
    };

    return (
        <div className="receipt-modal-overlay" onClick={onClose}>
            <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
                <div className="receipt-header">
                    <button className="close-receipt-btn" onClick={onClose}>❌</button>
                </div>

                <div className="receipt-content" id="receipt-content">
                    <div className="receipt-title">
                        <div className="govt-emblem">🇮🇳</div>
                        <h2>{getTranslation(language, 'voteReceipt')}</h2>
                        <p>{getTranslation(language, 'officialReceipt')}</p>
                    </div>

                    <div className="receipt-body">
                        <div className="receipt-section">
                            <h3>{getTranslation(language, 'voterDetails')}</h3>
                            <div className="detail-row">
                                <span className="label">{getTranslation(language, 'name')}:</span>
                                <span className="value">{voteData.voterName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">{getTranslation(language, 'aadhaarNumber')}:</span>
                                <span className="value">{voteData.aadhaarNumber}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">{getTranslation(language, 'walletAddress')}:</span>
                                <span className="value">{voteData.walletAddress.substring(0, 10)}...{voteData.walletAddress.substring(voteData.walletAddress.length - 8)}</span>
                            </div>
                        </div>

                        <div className="receipt-section">
                            <h3>{getTranslation(language, 'voteDetails')}</h3>
                            <div className="vote-confirmation">
                                <div className="voted-candidate">
                                    <span className="candidate-icon">🗳️</span>
                                    <div className="candidate-info">
                                        <h4>{voteData.candidateName}</h4>
                                        <p>{getTranslation(language, 'voteSuccessfullyRecorded')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="detail-row">
                                <span className="label">{getTranslation(language, 'voteTime')}:</span>
                                <span className="value">{new Date(voteData.timestamp).toLocaleString('en-IN', {
                                    timeZone: 'Asia/Kolkata',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</span>
                            </div>
                        </div>

                        <div className="receipt-section">
                            <h3>{getTranslation(language, 'blockchainVerification')}</h3>
                            <div className="detail-row">
                                <span className="label">{getTranslation(language, 'transactionHash')}:</span>
                                <span className="value hash">{voteData.transactionHash}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">{getTranslation(language, 'blockNumber')}:</span>
                                <span className="value">{voteData.blockNumber}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">{getTranslation(language, 'receiptId')}:</span>
                                <span className="value">{voteData.receiptId}</span>
                            </div>
                        </div>

                        <div className="qr-section">
                            <h3>{getTranslation(language, 'verificationQR')}</h3>
                            <div className="qr-code">
                                <pre>{generateQRCode(voteData)}</pre>
                            </div>
                            <p className="qr-note">{getTranslation(language, 'scanToVerify')}</p>
                        </div>

                        <div className="receipt-footer">
                            <div className="security-features">
                                <div className="security-item">
                                    <span className="security-icon">🔒</span>
                                    <span>{getTranslation(language, 'blockchainSecured')}</span>
                                </div>
                                <div className="security-item">
                                    <span className="security-icon">✅</span>
                                    <span>{getTranslation(language, 'digitallyVerified')}</span>
                                </div>
                                <div className="security-item">
                                    <span className="security-icon">🛡️</span>
                                    <span>{getTranslation(language, 'tamperProof')}</span>
                                </div>
                            </div>
                            
                            <div className="govt-footer">
                                <p>{getTranslation(language, 'governmentFooter')}</p>
                                <p>{getTranslation(language, 'satyamevaJayate')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="receipt-actions">
                    <button onClick={downloadReceipt} className="download-btn">
                        📥 {getTranslation(language, 'downloadReceipt')}
                    </button>
                    <button onClick={printReceipt} className="print-btn">
                        🖨️ {getTranslation(language, 'printReceipt')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteReceipt;