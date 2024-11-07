// Tooltip.js
import React from 'react';
import './Tooltip.css'; // 스타일링을 위해 CSS 파일 추가

const Tooltip = ({ text, children }) => {
    return (
        <div className="tooltip-container">
            {children}
            <span className="tooltip-text">{text}</span>
        </div>
    );
};

export default Tooltip;
