import React from 'react';
import { getTranslation } from '../utils/translations';
import './AuthChoice.css';

const AuthChoice = ({ language, onAadhaarChoice, onMetaMaskChoice }) => {
    return (
        <div className="auth-choice-container">
            <div className="auth-header">
                <h2>{getTranslation(language, 'chooseAuthMethod')}</h2>
                <p>{getTranslation(language, 'selectVerificationMethod')}</p>
            </div>
            
            <div className="auth-options">
                <div className="auth-option" onClick={onAadhaarChoice}>
                    <div className="auth-icon">🆔</div>
                    <h3>{getTranslation(language, 'aadhaarVerification')}</h3>
                    <p>{getTranslation(language, 'secureAadhaarAuth')}</p>
                    <button className="auth-button primary">
                        {getTranslation(language, 'useAadhaar')}
                    </button>
                </div>
                
                <div className="auth-option" onClick={onMetaMaskChoice}>
                    <div className="auth-icon">🦊</div>
                    <h3>{getTranslation(language, 'walletOnly')}</h3>
                    <p>{getTranslation(language, 'quickWalletAuth')}</p>
                    <button className="auth-button secondary">
                        {getTranslation(language, 'useWallet')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthChoice;