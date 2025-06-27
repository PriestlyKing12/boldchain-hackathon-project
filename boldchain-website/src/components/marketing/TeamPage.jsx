    // src/components/marketing/TeamPage.jsx
    import React from 'react';
    // TeamMemberCard is now in shared components
    import TeamMemberCard from '../shared/TeamMemberCard';
    import { Users } from 'lucide-react';

    const teamMembers = [
      {
        name: "Dr. Alani Adeyemi",
        role: "CEO & Lead Blockchain Architect",
        description: "Visionary leader with a PhD in Cryptography. Specializes in decentralized systems and smart contract security.",
        initial: "AA"
      },
      {
        name: "Aisha Mohammed",
        role: "CTO & Software Engineering Lead",
        description: "Full-stack development guru with extensive experience in scalable web applications and enterprise software.",
        initial: "AM"
      },
      {
        name: "Chukwudi Okoro",
        role: "Head of Product & Strategy",
        description: "Expert in product lifecycle management and market analysis, focusing on user-centric security solutions.",
        initial: "CO"
      },
      {
        name: "Fatima Bello",
        role: "Cybersecurity Analyst",
        description: "Specializes in threat intelligence, vulnerability assessment, and ensuring compliance with global security standards.",
        initial: "FB"
      }
    ];

    const TeamPage = () => (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center justify-center">
          <Users className="mr-3" size={40} /> Meet Our Team
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          The minds behind BoldChain, dedicated to securing your digital communications.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard 
              key={index}
              name={member.name}
              role={member.role}
              description={member.description}
              initial={member.initial}
            />
          ))}
        </div>
      </div>
    );

    export default TeamPage;
    