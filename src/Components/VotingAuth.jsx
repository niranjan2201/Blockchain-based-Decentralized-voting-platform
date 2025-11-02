import React from 'react';
import './VotingAuth.css';

const VotingAuth = ({ onAadhaarAuth, onWalletAuth }) => {
    return (
        <div className="voting-auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="tricolor-bar">
                        <div className="saffron"></div>
                        <div className="white"></div>
                        <div className="green"></div>
                    </div>
                    <h1>Digital Voting Authentication</h1>
                    <p className="subtitle">Secure authentication required to proceed</p>
                    <div className="motto">सत्यमेव जयते</div>
                </div>

                <div className="auth-options">
                    <div className="auth-option aadhaar" onClick={onAadhaarAuth}>
                        <div className="auth-icon">
                            🆔
                        </div>
                        <div className="auth-content">
                            <h3>Continue with Aadhaar</h3>
                            <p>Government verified identity</p>
                        </div>
                    </div>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="auth-option wallet" onClick={onWalletAuth}>
                        <div className="auth-icon">
                            🦊
                        </div>
                        <div className="auth-content">
                            <h3>Continue with Wallet</h3>
                            <p>Quick access with MetaMask</p>
                        </div>
                    </div>
                </div>

                <div className="security-notice">
                    <div className="security-icon">🔒</div>
                    <p>Your data is encrypted and secure. We follow government security standards.</p>
                </div>
            </div>
        </div>
    );
};

export default VotingAuth;