// src/components/solution/Sidebar.jsx
import React from 'react';
import SidebarLink from './SidebarLink'; // Import the new SidebarLink (will be created next)
import { Inbox as InboxIcon, Send, PlusCircle, UserCircle } from 'lucide-react';

/**
 * Sidebar component for the BoldChain Email Client.
 * Provides navigation links to Compose, Inbox, and Sent folders.
 * Displays the current user's name (which would come from authentication context in production).
 */
const Sidebar = ({ onCompose, onInbox, onSent, currentUserName = "User" }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="user-avatar">
                    {/* Simple initial avatar from user's name */}
                    <span>{currentUserName.substring(0,1).toUpperCase()}</span>
                </div>
                <span className="user-name">{currentUserName}</span>
            </div>
            <nav className="sidebar-nav">
                <SidebarLink icon={PlusCircle} text="Compose" onClick={onCompose} isCompose={true} />
                <SidebarLink icon={InboxIcon} text="Inbox" onClick={onInbox} />
                <SidebarLink icon={Send} text="Sent" onClick={onSent} />
            </nav>
        </aside>
    );
};

export default Sidebar;
