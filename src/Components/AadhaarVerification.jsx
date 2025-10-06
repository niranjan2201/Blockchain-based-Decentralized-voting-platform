import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';

const AadhaarVerification = ({ language, onVerificationSuccess }) => {
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('aadhaar'); // 'aadhaar', 'otp', 'verified'
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');

    const validateAadhaar = (number) => {
        // Basic Aadhaar validation (12 digits)
        const aadhaarRegex = /^\d{12}$/;
        return aadhaarRegex.test(number.replace(/\s/g, ''));
    };

    const formatAadhaar = (value) => {
        // Format as XXXX XXXX XXXX
        const cleaned = value.replace(/\D/g, '');
        const formatted = cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
        return formatted;
    };

    const handleAadhaarSubmit = async () => {
        setError('');
        const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
        
        if (!validateAadhaar(cleanAadhaar)) {
            setError(getTranslation(language, 'invalidAadhaar'));
            return;
        }

        setIsVerifying(true);
        
        // Simulate API call to UIDAI for OTP generation
        setTimeout(() => {
            setIsVerifying(false);
            setStep('otp');
            alert(getTranslation(language, 'otpSent'));
        }, 2000);
    };

    const handleOtpSubmit = async () => {
        setError('');
        
        if (otp.length !== 6) {
            setError(getTranslation(language, 'invalidOtp'));
            return;
        }

        setIsVerifying(true);
        
        // Simulate OTP verification
        setTimeout(() => {
            setIsVerifying(false);
            if (otp === '123456') { // Demo OTP
                setStep('verified');
                const voterData = {
                    aadhaarNumber: aadhaarNumber,
                    name: 'राम कुमार शर्मा', // Demo name
                    age: 35,
                    gender: 'पुरुष',
                    address: 'नई दिल्ली, भारत',
                    verified: true,
                    verificationTime: new Date().toISOString()
                };
                onVerificationSuccess(voterData);
            } else {
                setError(getTranslation(language, 'wrongOtp'));
            }
        }, 1500);
    };

    const handleAadhaarChange = (e) => {
        const formatted = formatAadhaar(e.target.value);
        if (formatted.replace(/\s/g, '').length <= 12) {
            setAadhaarNumber(formatted);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 6) {
            setOtp(value);
        }
    };

    if (step === 'verified') {
        return (
            <div className="verification-success">
                <div className="success-icon">✅</div>
                <h3>{getTranslation(language, 'aadhaarVerified')}</h3>
                <p>{getTranslation(language, 'proceedToVote')}</p>
            </div>
        );
    }

    return (
        <div className="aadhaar-verification-container">
            <div className="verification-header">
                <div className="aadhaar-logo">🆔</div>
                <h2>{getTranslation(language, 'aadhaarVerification')}</h2>
                <p>{getTranslation(language, 'verifyIdentity')}</p>
            </div>

            {step === 'aadhaar' && (
                <div className="aadhaar-step">
                    <div className="input-group">
                        <label>{getTranslation(language, 'enterAadhaar')}</label>
                        <input
                            type="text"
                            value={aadhaarNumber}
                            onChange={handleAadhaarChange}
                            placeholder="XXXX XXXX XXXX"
                            className="aadhaar-input"
                            maxLength="14"
                        />
                        <small>{getTranslation(language, 'aadhaarNote')}</small>
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button 
                        onClick={handleAadhaarSubmit}
                        disabled={isVerifying || aadhaarNumber.replace(/\s/g, '').length !== 12}
                        className="verify-button"
                    >
                        {isVerifying ? getTranslation(language, 'verifying') : getTranslation(language, 'sendOtp')}
                    </button>
                </div>
            )}

            {step === 'otp' && (
                <div className="otp-step">
                    <div className="otp-info">
                        <p>{getTranslation(language, 'otpSentTo')} {aadhaarNumber}</p>
                        <small>{getTranslation(language, 'demoOtp')}: 123456</small>
                    </div>
                    
                    <div className="input-group">
                        <label>{getTranslation(language, 'enterOtp')}</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="123456"
                            className="otp-input"
                            maxLength="6"
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="otp-actions">
                        <button 
                            onClick={handleOtpSubmit}
                            disabled={isVerifying || otp.length !== 6}
                            className="verify-button"
                        >
                            {isVerifying ? getTranslation(language, 'verifying') : getTranslation(language, 'verifyOtp')}
                        </button>
                        
                        <button 
                            onClick={() => setStep('aadhaar')}
                            className="back-button"
                        >
                            {getTranslation(language, 'back')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AadhaarVerification;