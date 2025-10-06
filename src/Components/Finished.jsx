import React from "react";
import { getTranslation } from '../utils/translations';

const Finished = (props) => {
    return (
        <div className="finished-container">
            <div className="finished-card">
                <div className="national-emblem">🇮🇳</div>
                <div className="gov-logo-container">
                    <div className="ashoka-chakra">☸️</div>
                </div>
                <h1 className="finished-header">{getTranslation(props.language, 'electionConcluded')}</h1>
                <p className="login-subtitle">
                    {getTranslation(props.language, 'finishedMessage')}
                </p>
            </div>
        </div>
    )
}

export default Finished;