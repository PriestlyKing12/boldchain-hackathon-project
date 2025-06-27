// src/components/solution/SidebarLink.jsx
import React from 'react';

/**
 * Reusable link component for the email client sidebar.
 */
const SidebarLink = ({ icon: Icon, text, onClick, isCompose = false }) => {
    const linkClass = `sidebar-link ${isCompose ? 'sidebar-link-compose' : ''}`;
    return (
        <button className={linkClass} onClick={onClick}>
            {Icon && <Icon className="sidebar-link-icon" />}
            <span className="sidebar-link-text">{text}</span>
        </button>
    );
};

export default SidebarLink;
