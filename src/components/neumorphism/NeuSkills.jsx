import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaGithub, FaFigma, FaDatabase, FaLayerGroup, FaTools
} from 'react-icons/fa';
import { 
  SiTailwindcss, SiNextdotjs, SiVercel, SiMongodb, SiExpress, SiPostgresql, SiPython, SiFlask
} from 'react-icons/si';
import NeuCard from '../ui/neumorphism/NeuCard';

export const NeuSkills = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Tech' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'database', label: 'Database' },
    { id: 'tools', label: 'Tools & Workflow' },
  ];

  const skillGroups = {
    frontend: [
      { name: 'React', level: 90, icon: <FaReact className="text-[#087ea4]" />, experience: 'Advanced' },
      { name: 'Next.js', level: 85, icon: <SiNextdotjs className="text-slate-800" />, experience: 'Advanced' },
      { name: 'JavaScript', level: 90, icon: <FaJsSquare className="text-[#f7df1e]" />, experience: 'Advanced' },
      { name: 'Tailwind CSS', level: 92, icon: <SiTailwindcss className="text-[#38bdf8]" />, experience: 'Expert' },
      { name: 'HTML5', level: 95, icon: <FaHtml5 className="text-[#e34f26]" />, experience: 'Expert' },
      { name: 'CSS3', level: 92, icon: <FaCss3Alt className="text-[#1572b6]" />, experience: 'Expert' },
    ],
    backend: [
      { name: 'Node.js', level: 82, icon: <FaNodeJs className="text-[#339933]" />, experience: 'Proficient' },
      { name: 'Express', level: 80, icon: <SiExpress className="text-slate-700" />, experience: 'Proficient' },
      { name: 'Python', level: 78, icon: <SiPython className="text-[#3776ab]" />, experience: 'Intermediate' },
      { name: 'Flask', level: 75, icon: <SiFlask className="text-slate-800" />, experience: 'Intermediate' },
    ],
    database: [
      { name: 'MongoDB', level: 80, icon: <SiMongodb className="text-[#47a248]" />, experience: 'Proficient' },
      { name: 'PostgreSQL', level: 82, icon: <SiPostgresql className="text-[#336791]" />, experience: 'Proficient' },
    ],
    tools: [
      { name: 'Git & GitHub', level: 88, icon: <FaGithub className="text-slate-900" />, experience: 'Advanced' },
      { name: 'Vercel', level: 85, icon: <SiVercel className="text-slate-900" />, experience: 'Advanced' },
      { name: 'Figma', level: 84, icon: <FaFigma className="text-[#f24e1e]" />, experience: 'Advanced' },
    ],
  };

  const getVisibleSkills = () => {
    if (activeCategory === 'all') {
      return [
        ...skillGroups.frontend,
        ...skillGroups.backend,
        ...skillGroups.database,
        ...skillGroups.tools,
      ];
    }
    return skillGroups[activeCategory] || [];
  };

  return (
    <section id="skills" className="py-20 relative font-poppins">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8ECF1] shadow-neu-inset text-xs font-semibold text-neu-accent uppercase tracking-wider">
            <span>Tech Stack & Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neu-primary tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-neu-secondary text-sm sm:text-base max-w-xl mx-auto">
            Tools, libraries, and frameworks I leverage to engineer robust digital experiences.
          </p>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-[#E8ECF1] text-neu-accent shadow-neu-inset scale-98'
                    : 'bg-[#ECF0F3] text-neu-secondary shadow-neu-flat hover:text-neu-primary hover:shadow-neu-hover'
                  }
                `}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {getVisibleSkills().map((skill, index) => (
            <motion.div
              layout
              key={skill.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <NeuCard
                variant="raised"
                hoverLift={true}
                rounded="rounded-2xl"
                className="p-5 border border-white/70"
              >
                <div className="flex items-center gap-4">
                  {/* Neumorphic Circular Icon Container */}
                  <div className="w-13 h-13 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-2xl flex-shrink-0">
                    {skill.icon}
                  </div>

                  {/* Skill Details & Inset Progress Bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-neu-primary truncate">
                        {skill.name}
                      </span>
                      <span className="text-xs font-semibold text-neu-accent">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Neumorphic Inset Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#E8ECF1] shadow-neu-inset overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-[#7C6EF2] to-[#F2739E]"
                      />
                    </div>

                    <div className="mt-1.5 flex justify-end">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-neu-secondary">
                        {skill.experience}
                      </span>
                    </div>
                  </div>
                </div>
              </NeuCard>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default NeuSkills;
