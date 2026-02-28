import React from 'react';

const Loader = ({ text = 'Loading...' }) => (
    <div className="loader-container">
        <div className="loader-spinner"></div>
        <p className="loader-text">{text}</p>
    </div>
);

export default Loader;
