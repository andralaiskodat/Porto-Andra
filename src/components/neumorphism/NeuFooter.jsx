import React from 'react';
import { FaGithub, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';

export const NeuFooter = () => {
  return (
    <footer className="py-12 bg-[#E1E6EC] border-t border-white/60 font-poppins text-neu-primary transition-colors">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand & Copyright */}
        <div className="text-center sm:text-left space-y-1">
          <div className="font-bold text-base tracking-tight text-neu-primary">
            Fransisko Andrade Laiskodat
          </div>
          <p className="text-xs text-neu-secondary">
            © {new Date().getFullYear()} All rights reserved. Crafted with tactile Neumorphism.
          </p>
        </div>

        {/* Center: Built with */}
        <div className="text-xs text-neu-secondary flex items-center gap-1.5 order-last sm:order-none">
          <span>Built with</span>
          <FaHeart className="text-[#F2739E] text-xs" />
          <span>using React, Tailwind CSS & Framer Motion</span>
        </div>

        {/* Right: Social round buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/andralaiskodat"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-secondary hover:text-neu-accent hover:shadow-neu-hover active:shadow-neu-pressed transition-all"
          >
            <FaGithub className="text-sm" />
          </a>
          <a
            href="https://www.instagram.com/anndraa8._"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-secondary hover:text-[#F2739E] hover:shadow-neu-hover active:shadow-neu-pressed transition-all"
          >
            <FaInstagram className="text-sm" />
          </a>
          <a
            href="https://www.linkedin.com/in/fransisko"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-secondary hover:text-[#0077b5] hover:shadow-neu-hover active:shadow-neu-pressed transition-all"
          >
            <FaLinkedin className="text-sm" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default NeuFooter;
