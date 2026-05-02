import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ANDRA from '../../assets/images/ANDRA.jpg';

const FotoProfile = () => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxTilt = 15;
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
    const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;

    // Glow position (percentage)
    const glowX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowY = ((e.clientY - rect.top) / rect.height) * 100;

    setTransform({ rotateX, rotateY, glowX, glowY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
      className="relative flex items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      {/* Ambient shadow that follows tilt */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-300"
        style={{
          background: `radial-gradient(ellipse at ${transform.glowX}% ${transform.glowY}%, rgba(64,121,255,0.15) 0%, rgba(0,255,220,0.06) 50%, transparent 70%)`,
          filter: 'blur(24px)',
          transform: `rotateX(${transform.rotateX * 0.5}deg) rotateY(${transform.rotateY * 0.5}deg)`,
          transition: isHovered ? 'none' : 'all 0.6s ease',
        }}
      />

      {/* 3D Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-72 h-80 md:w-[370px] md:h-[450px] lg:w-[410px] lg:h-[500px] rounded-2xl overflow-hidden cursor-pointer"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered ? 'transform 0.1s ease' : 'transform 0.6s ease',
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? `${-transform.rotateY * 1.5}px ${transform.rotateX * 1.5}px 60px rgba(0,10,40,0.8), 0 0 50px rgba(64,121,255,0.25), 0 0 80px rgba(0,255,220,0.08)`
            : '0 30px 60px rgba(0,8,30,0.7), 0 0 40px rgba(64,121,255,0.12)',
        }}
      >
        {/* Photo */}
        <img
          src={ANDRA}
          alt="Fransisko Andrade Laiskodat"
          className="w-full h-full object-cover"
          style={{ transform: 'translateZ(0)' }}
        />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Specular highlight — moves with mouse */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${transform.glowX}% ${transform.glowY}%, rgba(255,255,255,0.10) 0%, transparent 55%)`,
            transition: isHovered ? 'none' : 'all 0.6s ease',
          }}
        />

        {/* Thin glass border */}
        <div className="absolute inset-0 rounded-2xl border border-white/15 pointer-events-none" />

        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/50 pointer-events-none" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/50 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-white/50 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/50 pointer-events-none" />

        {/* Name label — appears at bottom of photo */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 py-4"
          style={{ transform: 'translateZ(20px)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span className="text-xs font-medium text-white/85 tracking-widest uppercase font-cascadia">
              Fransisko Andrade Laiskodat
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FotoProfile;
