import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
    const [selectedUserType, setSelectedUserType] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!selectedUserType) {
            alert('Please select a user type');
            return;
        }
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        console.log('Login:', { userType: selectedUserType, email, password });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                
                <div className="user-type-section">
                    <h3>Select User Type</h3>
                    <div className="user-type-options">
                        <div 
                            className={`user-type-card ${selectedUserType === 'admin' ? 'selected' : ''}`}
                            onClick={() => setSelectedUserType('admin')}
                        >
                            <div className="check-icon">
                                {selectedUserType === 'admin' && '✓'}
                            </div>
                            Election Commission
                        </div>
                        
                        <div 
                            className={`user-type-card ${selectedUserType === 'auditor' ? 'selected' : ''}`}
                            onClick={() => setSelectedUserType('auditor')}
                        >
                            <div className="check-icon">
                                {selectedUserType === 'auditor' && '✓'}
                            </div>
                            Auditor
                        </div>
                        
                        <div 
                            className={`user-type-card ${selectedUserType === 'voter' ? 'selected' : ''}`}
                            onClick={() => setSelectedUserType('voter')}
                        >
                            <div className="check-icon">
                                {selectedUserType === 'voter' && '✓'}
                            </div>
                            Voter
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button className="login-btn" onClick={handleLogin}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;