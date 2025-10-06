import React from "react";
import { getTranslation } from '../utils/translations';

const Login = (props) => {
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="gov-logo-container">
                    <div className="ashoka-chakra">☸️</div>
                </div>
                <h1 className="welcome-message">{getTranslation(props.language, 'welcomeTitle')}</h1>
                <p className="login-subtitle">
                    {getTranslation(props.language, 'welcomeSubtitle')}
                </p>
                <button className="login-button" onClick={props.connectWallet}>
                    {getTranslation(props.language, 'connectWallet')}
                </button>
            </div>
        </div>
    )
}

export default Login;