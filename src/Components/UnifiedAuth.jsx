import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';
import './UnifiedAuth.css';

const UnifiedAuth = ({ language, theme, onAuthSuccess, connectWallet }) => {
    const [step, setStep] = useState('choice'); // 'choice', 'aadhaar', 'otp', 'wallet'
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [aadhaarVerified, setAadhaarVerified] = useState(false);

    const validateAadhaar = (number) => {
        const aadhaarRegex = /^\d{12}$/;
        return aadhaarRegex.test(number.replace(/\s/g, ''));
    };

    const formatAadhaar = (value) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    };

    const handleAadhaarSubmit = async () => {
        setError('');
        const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
        
        if (!validateAadhaar(cleanAadhaar)) {
            setError(getTranslation(language, 'invalidAadhaar'));
            return;
        }

        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setStep('otp');
        }, 1500);
    };

    const handleOtpSubmit = async () => {
        setError('');
        
        if (otp.length !== 6) {
            setError(getTranslation(language, 'invalidOtp'));
            return;
        }

        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            if (otp === '123456') {
                setAadhaarVerified(true);
                setStep('wallet');
            } else {
                setError(getTranslation(language, 'wrongOtp'));
            }
        }, 1000);
    };

    const handleWalletConnect = async () => {
        try {
            await connectWallet();
            const voterData = aadhaarVerified ? {
                aadhaarNumber: aadhaarNumber,
                name: 'राम कुमार शर्मा',
                verified: true,
                verificationTime: new Date().toISOString()
            } : null;
            onAuthSuccess(voterData, aadhaarVerified);
        } catch (error) {
            setError('Failed to connect wallet');
        }
    };

    return (
        <div className={`unified-auth-container ${theme}-theme`}>
            <div className="auth-card">
                <div className="auth-header">
                    <div className="gov-header">
                        <div className="tricolor-bar">
                            <div className="saffron"></div>
                            <div className="white"></div>
                            <div className="green"></div>
                        </div>
                        <div className="emblem">🇮🇳</div>
                        <div className="gov-title">
                            <h1>{getTranslation(language, 'governmentOfIndia')}</h1>
                            <p>{getTranslation(language, 'electionCommission')}</p>
                        </div>
                    </div>
                    <h2>{getTranslation(language, 'digitalVotingAuth')}</h2>
                    <p>{getTranslation(language, 'secureAuthRequired')}</p>
                    <div className="satyameva">सत्यमेव जयते</div>
                </div>

                {step === 'choice' && (
                    <div className="auth-step">
                        <div className="auth-methods">
                            <button 
                                className="auth-method-btn aadhaar"
                                onClick={() => setStep('aadhaar')}
                            >
                                <span className="method-icon">🆔</span>
                                <span className="method-text">
                                    <strong>{getTranslation(language, 'continueWithAadhaar')}</strong>
                                    <small>{getTranslation(language, 'governmentVerified')}</small>
                                </span>
                            </button>
                            
                            <div className="divider">
                                <span>{getTranslation(language, 'or')}</span>
                            </div>
                            
                            <button 
                                className="auth-method-btn wallet"
                                onClick={() => setStep('wallet')}
                            >
                                <span className="method-icon">🦊</span>
                                <span className="method-text">
                                    <strong>{getTranslation(language, 'continueWithWallet')}</strong>
                                    <small>{getTranslation(language, 'quickAccess')}</small>
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {step === 'aadhaar' && (
                    <div className="auth-step">
                        <div className="step-header">
                            <button className="back-btn" onClick={() => setStep('choice')}>←</button>
                            <h3>{getTranslation(language, 'aadhaarVerification')}</h3>
                        </div>
                        
                        <div className="input-group">
                            <input
                                type="text"
                                value={aadhaarNumber}
                                onChange={(e) => setAadhaarNumber(formatAadhaar(e.target.value))}
                                placeholder="XXXX XXXX XXXX"
                                className="auth-input"
                                maxLength="14"
                            />
                            <label>{getTranslation(language, 'enterAadhaar')}</label>
                        </div>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <button 
                            onClick={handleAadhaarSubmit}
                            disabled={isVerifying || aadhaarNumber.replace(/\s/g, '').length !== 12}
                            className="continue-btn"
                        >
                            {isVerifying ? getTranslation(language, 'verifying') : getTranslation(language, 'continue')}
                        </button>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="auth-step">
                        <div className="step-header">
                            <button className="back-btn" onClick={() => setStep('aadhaar')}>←</button>
                            <h3>{getTranslation(language, 'verifyOtp')}</h3>
                        </div>
                        
                        <p className="otp-info">{getTranslation(language, 'otpSentTo')} {aadhaarNumber}</p>
                        <small className="demo-note">{getTranslation(language, 'demoOtp')}: 123456</small>
                        
                        <div className="input-group">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="auth-input otp-input"
                                maxLength="6"
                            />
                            <label>{getTranslation(language, 'enterOtp')}</label>
                        </div>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <button 
                            onClick={handleOtpSubmit}
                            disabled={isVerifying || otp.length !== 6}
                            className="continue-btn"
                        >
                            {isVerifying ? getTranslation(language, 'verifying') : getTranslation(language, 'verify')}
                        </button>
                    </div>
                )}

                {step === 'wallet' && (
                    <div className="auth-step">
                        <div className="step-header">
                            <button className="back-btn" onClick={() => setStep(aadhaarVerified ? 'choice' : 'choice')}>←</button>
                            <h3>{getTranslation(language, 'connectWallet')}</h3>
                        </div>
                        
                        {aadhaarVerified && (
                            <div className="verification-status">
                                <span className="verified-badge">✅ {getTranslation(language, 'aadhaarVerified')}</span>
                            </div>
                        )}
                        
                        <div className="wallet-connect">
                            <div className="wallet-icon">🦊</div>
                            <p>{getTranslation(language, 'connectMetaMask')}</p>
                            
                            <button 
                                onClick={handleWalletConnect}
                                className="continue-btn wallet-btn"
                            >
                                {getTranslation(language, 'connectWallet')}
                            </button>
                        </div>
                        
                        {error && <div className="error-message">{error}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedAuth;