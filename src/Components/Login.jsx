import React from "react";

const Login = (props) => {
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="gov-logo-container">
                    <div className="ashoka-chakra">☸️</div>
                </div>
                <h1 className="welcome-message">Digital India Voting Portal</h1>
                <p className="login-subtitle">
                    🇮🇳 Government of India - Blockchain Based Secure Voting System<br/>
                    Transparent, Secure, and Decentralized Democratic Process<br/>
                    सत्यमेव जयते (Truth Alone Triumphs)
                </p>
                <button className="login-button" onClick={props.connectWallet}>
                    🔒 Connect Digital Wallet
                </button>
            </div>
        </div>
    )
}

export default Login;