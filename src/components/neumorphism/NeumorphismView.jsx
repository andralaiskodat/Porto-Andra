import React from 'react';
import NeuHeader from './NeuHeader';
import NeuHero from './NeuHero';
import NeuAbout from './NeuAbout';
import NeuSkills from './NeuSkills';
import NeuProjects from './NeuProjects';
import NeuCertificates from './NeuCertificates';
import NeuContact from './NeuContact';
import NeuFooter from './NeuFooter';

export const NeumorphismView = () => {
  return (
    <div className="min-h-screen bg-[#E8ECF1] text-neu-primary transition-colors duration-400">
      {/* Floating Neumorphic Header */}
      <NeuHeader />

      {/* Main Sections */}
      <main className="relative">
        <NeuHero />
        <NeuAbout />
        <NeuSkills />
        <NeuProjects />
        <NeuCertificates />
        <NeuContact />
      </main>

      {/* Footer */}
      <NeuFooter />
    </div>
  );
};

export default NeumorphismView;
