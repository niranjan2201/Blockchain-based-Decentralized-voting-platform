import React from "react";

const Login = (props) => {
    return (
        <div className="login-container">
            <h1 className="welcome-message">🗳️ Decentralized Voting</h1>
            <p className="login-subtitle">
                Secure, transparent, and decentralized voting powered by blockchain technology. 
                Connect your MetaMask wallet to participate in the democratic process.
            </p>
            <button className="login-button" onClick={props.connectWallet}>
                🤝 Connect MetaMask
            </button>
        </div>
    )
}

export default Login;