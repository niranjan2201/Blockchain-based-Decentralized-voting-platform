import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';
import './AdminLogin.css';

const AdminLogin = ({ language, userType, onLoginSuccess, onBack }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dummy credentials
    const validCredentials = {
        admin: { username: 'admin@eci.gov.in', password: 'Admin@2024' },
        auditor: { username: 'auditor@eci.gov.in', password: 'Audit@2024' }
    };

    const handleLogin = () => {
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            const valid = validCredentials[userType];
            if (credentials.username === valid.username && credentials.password === valid.password) {
                onLoginSuccess(userType);
            } else {
                setError('Invalid credentials. Please try again.');
            }
            setIsLoading(false);
        }, 1000);
    };

    const roleInfo = {
        admin: {
            icon: '🎖️',
            title: 'Election Commission Admin',
            description: 'Administrative access to election management'
        },
        auditor: {
            icon: '🔍',
            title: 'Election Auditor',
            description: 'Audit and monitoring access'
        }
    };

    return (
        <div className={`admin-login-container ${language}-theme`}>
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
                    
                    <div className="role-info">
                        <div className="role-icon-large">{roleInfo[userType].icon}</div>
                        <h2>{roleInfo[userType].title}</h2>
                        <p>{roleInfo[userType].description}</p>
                    </div>
                </div>

                <div className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            value={credentials.username}
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            placeholder="Official Email ID"
                            className="login-input"
                        />
                        <label>Email Address</label>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            placeholder="Password"
                            className="login-input"
                        />
                        <label>Password</label>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="demo-credentials">
                        <h4>Demo Credentials:</h4>
                        <p><strong>Email:</strong> {validCredentials[userType].username}</p>
                        <p><strong>Password:</strong> {validCredentials[userType].password}</p>
                    </div>

                    <div className="login-actions">
                        <button 
                            onClick={handleLogin}
                            disabled={isLoading || !credentials.username || !credentials.password}
                            className="login-btn"
                        >
                            {isLoading ? 'Authenticating...' : 'Secure Login'}
                        </button>
                        
                        <button onClick={onBack} className="back-btn">
                            ← Back to Role Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;