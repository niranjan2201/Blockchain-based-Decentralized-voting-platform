import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';
import './RoleSelection.css';

const RoleSelection = ({ language, onRoleSelect }) => {
    return (
        <div className="role-selection-container">
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
                    <h2>{getTranslation(language, 'selectUserType')}</h2>
                    <p>{getTranslation(language, 'chooseAccessLevel')}</p>
                </div>

                <div className="role-options">
                    <div className="role-option voter" onClick={() => onRoleSelect('voter')}>
                        <div className="role-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                        </div>
                        <h3>{getTranslation(language, 'voter')}</h3>
                        <p>{getTranslation(language, 'voterDescription')}</p>
                        <div className="auth-methods">
                            <span>Aadhaar + MetaMask</span>
                        </div>
                    </div>

                    <div className="role-option admin" onClick={() => onRoleSelect('admin')}>
                        <div className="role-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                            </svg>
                        </div>
                        <h3>{getTranslation(language, 'admin')}</h3>
                        <p>{getTranslation(language, 'adminDescription')}</p>
                        <div className="auth-methods">
                            <span>Secure Login</span>
                        </div>
                    </div>

                    <div className="role-option auditor" onClick={() => onRoleSelect('auditor')}>
                        <div className="role-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </div>
                        <h3>{getTranslation(language, 'auditor')}</h3>
                        <p>{getTranslation(language, 'auditorDescription')}</p>
                        <div className="auth-methods">
                            <span>Secure Login</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;