import React from "react";

const Finished = (props) => {
    return (
        <div className="finished-container">
            <h1 className="finished-header">✅ Voting Complete</h1>
            <p className="login-subtitle">
                The voting period has ended. Thank you for participating in this democratic process!
                Results are now final and recorded on the blockchain.
            </p>
        </div>
    )
}

export default Finished;