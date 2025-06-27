// src/components/TeamMemberCard.jsx
import React from 'react';

const TeamMemberCard = ({ name, role, description, initial }) => (
  <div className="card flex-col items-center text-center">
    <div className="w-24 h-24 rounded-full bg-blue-100 flex-center text-blue-700 font-bold text-5xl mb-4">
      {initial}
    </div>
    <h3 className="text-2xl font-bold mb-2">{name}</h3> 
    <p className="text-blue-600 font-semibold mb-3">{role}</p>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default TeamMemberCard;
