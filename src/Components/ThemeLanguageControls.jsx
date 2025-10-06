import React from 'react';
import { getTranslation } from '../utils/translations';

const ThemeLanguageControls = ({ theme, setTheme, language, setLanguage }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="theme-language-controls">
            <div className="theme-switcher">
                <button 
                    onClick={toggleTheme} 
                    className="theme-toggle-btn"
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                    <span>{getTranslation(language, theme === 'light' ? 'darkTheme' : 'lightTheme')}</span>
                </button>
            </div>
            
            <div className="language-selector">
                <select 
                    value={language} 
                    onChange={handleLanguageChange}
                    className="language-select"
                >
                    <option value="en">🇺🇸 {getTranslation(language, 'english')}</option>
                    <option value="hi">🇮🇳 {getTranslation(language, 'hindi')}</option>
                    <option value="mr">🇮🇳 {getTranslation(language, 'marathi')}</option>
                </select>
            </div>
        </div>
    );
};

export default ThemeLanguageControls;