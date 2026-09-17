import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaInstagram, FaLinkedin, FaDownload, FaArrowRight, FaCode, FaCheckCircle, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import ANDRA from '../../assets/images/ANDRA.jpg';
import NeuButton from '../ui/neumorphism/NeuButton';
import NeuCard from '../ui/neumorphism/NeuCard';

export const NeuHero = () => {
  return (
    <section id="home" className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden font-poppins">
      {/* Background Gradient Mesh Blobs (Soft Neumorphism Accent) */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#7C6EF2]/20 to-[#F2739E]/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-[#7C6EF2]/15 to-[#38B2AC]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-1/3 w-80 h-80 rounded-full bg-[#ECF0F3] shadow-neu-inset blur-2xl opacity-40" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: Text & Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8ECF1] shadow-neu-inset text-xs font-semibold text-neu-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse" />
              <span>Full Stack & Front End Specialist</span>
              <span className="text-neu-accent">✦</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-semibold text-neu-secondary uppercase tracking-widest">
                Hello, I am
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neu-primary tracking-tight leading-[1.15]">
                Fransisko Andrade{' '}
                <span className="bg-gradient-to-r from-[#7C6EF2] via-[#a855f7] to-[#F2739E] bg-clip-text text-transparent">
                  Laiskodat
                </span>
              </h1>
            </div>

            {/* Summary Bio */}
            <p className="text-neu-secondary text-base sm:text-lg leading-relaxed max-w-xl">
              Bachelor of Informatics graduate from <strong className="text-neu-primary font-semibold">Amikom University Yogyakarta</strong>. 
              I design and build tactile, high-performance web applications with React, Tailwind CSS, and clean modern architecture.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <NeuButton
                as="a"
                href="#projects"
                variant="gradient"
                size="lg"
                className="rounded-full shadow-neu-flat font-semibold"
              >
                <span>Explore Projects</span>
                <FaArrowRight className="text-xs" />
              </NeuButton>

              <NeuButton
                as="a"
                href="/certificates/CV Andra.pdf"
                download="CV Andra.pdf"
                variant="raised"
                size="lg"
                className="rounded-full font-semibold"
              >
                <FaDownload className="text-xs text-neu-accent" />
                <span>Download CV</span>
              </NeuButton>
            </div>

            {/* Social Icons Container */}
            <div className="pt-4 flex items-center gap-3">
              <span className="text-xs font-semibold text-neu-secondary uppercase tracking-wider mr-2">
                Connect:
              </span>
              <a
                href="https://github.com/andralaiskodat"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-11 h-11 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-primary hover:text-neu-accent hover:shadow-neu-hover active:shadow-neu-pressed transition-all duration-200"
              >
                <FaGithub className="text-lg" />
              </a>
              <a
                href="https://www.instagram.com/anndraa8._"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="w-11 h-11 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-primary hover:text-[#F2739E] hover:shadow-neu-hover active:shadow-neu-pressed transition-all duration-200"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a
                href="https://www.linkedin.com/in/fransisko"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-11 h-11 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-primary hover:text-[#0077b5] hover:shadow-neu-hover active:shadow-neu-pressed transition-all duration-200"
              >
                <FaLinkedin className="text-lg" />
              </a>
            </div>
          </motion.div>

          {/* RIGHT: Tactical Neumorphic Widget Card (App UI / Dashboard Style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Background ambient ring shadow */}
              <div className="absolute inset-0 rounded-3xl bg-[#ECF0F3] shadow-neu-flat-lg transform rotate-2 opacity-50 pointer-events-none" />

              {/* Main Card */}
              <NeuCard
                variant="raised"
                rounded="rounded-3xl"
                className="p-6 sm:p-7 relative z-10 border border-white/80"
              >
                {/* Header widget bar */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-300/50">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#F2739E] shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#7C6EF2] shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#38B2AC] shadow-sm" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#E8ECF1] shadow-neu-inset text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
                    <FaCheckCircle className="text-xs" />
                    <span>Ready for Hire</span>
                  </div>
                </div>

                {/* Profile Photo Frame matching Theme 1 proportions (4:5) */}
                <div className="py-4 flex flex-col items-center text-center">
                  <div className="relative p-2 rounded-2xl sm:rounded-3xl bg-[#ECF0F3] shadow-neu-flat border border-white/90 group">
                    <div className="w-64 sm:w-72 aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-neu-inset p-1 bg-[#E8ECF1]">
                      <img
                        src={ANDRA}
                        alt="Fransisko Andrade Laiskodat"
                        className="w-full h-full object-cover object-top rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Floating mini badge */}
                    <div className="absolute bottom-3 right-3 p-2.5 rounded-full bg-gradient-to-tr from-[#7C6EF2] to-[#F2739E] text-white shadow-neu-flat text-xs">
                      <FaCode />
                    </div>
                  </div>

                  <h3 className="mt-4 font-poppins font-bold text-lg text-neu-primary">
                    Fransisko Andrade Laiskodat
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neu-secondary mt-1">
                    <FaMapMarkerAlt className="text-neu-accent" />
                    <span>Yogyakarta, Indonesia</span>
                  </div>
                </div>

                {/* Fitness-app style metrics widget row */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-[#E8ECF1] shadow-neu-inset flex flex-col items-center text-center">
                    <span className="text-2xl font-extrabold text-neu-accent">7+</span>
                    <span className="text-[11px] font-medium text-neu-secondary mt-0.5">Projects Built</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#E8ECF1] shadow-neu-inset flex flex-col items-center text-center">
                    <span className="text-2xl font-extrabold text-[#F2739E]">3+</span>
                    <span className="text-[11px] font-medium text-neu-secondary mt-0.5">Years Journey</span>
                  </div>
                </div>
              </NeuCard>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default NeuHero;
