// src/components/MessageBox.jsx
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react';

const MessageBox = ({ show, type, title, message, onClose }) => {
  if (!show) return null;

  const typeClasses = {
    success: 'message-box-success',
    error: 'message-box-error',
    warning: 'message-box-warning',
    info: 'message-box-info',
  };

  const iconComponents = {
    success: <CheckCircle className="message-box-icon" />,
    error: <XCircle className="message-box-icon" />,
    warning: <AlertCircle className="message-box-icon" />,
    info: <Mail className="message-box-icon" />,
  };

  return (
    <div className="message-box-overlay">
      <div className={`message-box-content ${typeClasses[type]}`}>
        {iconComponents[type]}
        <h2 className="message-box-title">{title}</h2>
        <p className="message-box-message">{message}</p>
        <button
          onClick={onClose} 
          className="message-box-button"
        >
          Got It!
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
