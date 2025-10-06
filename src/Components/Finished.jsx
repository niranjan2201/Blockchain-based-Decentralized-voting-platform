import React from "react";

const Finished = (props) => {
    return (
        <div className="finished-container">
            <div className="finished-card">
                <div className="national-emblem">🇮🇳</div>
                <div className="gov-logo-container">
                    <div className="ashoka-chakra">☸️</div>
                </div>
                <h1 className="finished-header">✅ Election Concluded</h1>
                <p className="login-subtitle">
                    <strong>Government of India - Digital Voting Portal</strong><br/><br/>
                    The voting period has officially ended. Thank you for participating in India's democratic process!<br/><br/>
                    All votes have been securely recorded on the blockchain and results are now final.<br/><br/>
                    🙏 धन्यवाद (Thank You)
                </p>
            </div>
        </div>
    )
}

export default Finished;