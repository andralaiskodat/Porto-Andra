import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaTimes, FaLayerGroup, FaImage } from 'react-icons/fa';
import { fetchProjects, initialProjects } from '../../lib/supabase';
import NeuCard from '../ui/neumorphism/NeuCard';
import NeuButton from '../ui/neumorphism/NeuButton';

export const NeuProjects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.warn('Could not load projects, using fallback:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  const categories = ['All', 'Web/Apps', 'Graphic Design'];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 md:py-28 relative font-poppins">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8ECF1] shadow-neu-inset text-xs font-semibold text-neu-accent uppercase tracking-wider">
            <span>Featured Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neu-primary tracking-tight">
            Recent Projects & Work
          </h2>
          <p className="text-neu-secondary text-sm sm:text-base max-w-xl mx-auto">
            A curated selection of web applications, platforms, and designs built with passion and precision.
          </p>
        </div>

        {/* Category Filter Pills (Inset when active, Raised when inactive) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-[#E8ECF1] text-neu-accent shadow-neu-inset scale-95'
                    : 'bg-[#ECF0F3] text-neu-secondary shadow-neu-flat hover:text-neu-primary hover:shadow-neu-hover'
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid (App Mockup Style) */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                key={project.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <NeuCard
                  variant="raised"
                  hoverLift={true}
                  rounded="rounded-3xl"
                  className="p-5 flex flex-col h-full border border-white/80 group"
                >
                  {/* Image App Mockup Frame */}
                  <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-[#E8ECF1] shadow-neu-inset p-1.5 border border-white/50">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                      }}
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#ECF0F3]/90 backdrop-blur-sm shadow-neu-flat text-[10px] font-bold text-neu-primary uppercase tracking-wider">
                      {project.category}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="flex-1 flex flex-col pt-5">
                    <h3 className="font-poppins font-bold text-lg text-neu-primary group-hover:text-neu-accent transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-neu-secondary mt-2 line-clamp-3 leading-relaxed flex-1">
                      {project.description}
                    </p>

                    {/* Tech Chips (Neumorphic Inset Pills) */}
                    <div className="flex flex-wrap gap-1.5 my-4">
                      {(Array.isArray(project.tech) ? project.tech : (project.tech || '').split(',')).slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-full bg-[#E8ECF1] shadow-neu-inset text-[10px] font-medium text-neu-secondary"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-slate-300/40 flex items-center justify-between gap-3">
                      <NeuButton
                        onClick={() => setSelectedProject(project)}
                        variant="raised"
                        size="sm"
                        className="flex-1 rounded-xl text-xs font-semibold"
                      >
                        Detail Info
                      </NeuButton>

                      {project.link && (
                        <NeuButton
                          as="a"
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="gradient"
                          size="sm"
                          className="flex-1 rounded-xl text-xs font-semibold"
                        >
                          <span>Live Demo</span>
                          <FaExternalLinkAlt className="text-[10px]" />
                        </NeuButton>
                      )}
                    </div>
                  </div>
                </NeuCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Detail Modal in Soft Neumorphic Style */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-2xl w-full rounded-3xl bg-[#ECF0F3] shadow-neu-flat-lg border border-white/80 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-300/50">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#E8ECF1] shadow-neu-inset text-xs font-semibold text-neu-accent">
                      {selectedProject.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-9 h-9 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-secondary hover:text-neu-primary hover:shadow-neu-hover"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-neu-inset p-2 bg-[#E8ECF1]">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-64 sm:h-72 object-cover rounded-xl"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-neu-primary">
                    {selectedProject.title}
                  </h3>

                  <p className="text-sm text-neu-secondary leading-relaxed">
                    {selectedProject.description}
                  </p>

                  <div>
                    <span className="text-xs font-semibold text-neu-secondary uppercase tracking-wider block mb-2">
                      Technologies & Tools:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(selectedProject.tech) ? selectedProject.tech : (selectedProject.tech || '').split(',')).map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-[#E8ECF1] shadow-neu-inset text-xs font-medium text-neu-primary"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <NeuButton
                      onClick={() => setSelectedProject(null)}
                      variant="raised"
                      size="md"
                      className="rounded-full"
                    >
                      Close
                    </NeuButton>
                    {selectedProject.link && (
                      <NeuButton
                        as="a"
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="gradient"
                        size="md"
                        className="rounded-full font-semibold"
                      >
                        <span>Open Project</span>
                        <FaExternalLinkAlt className="text-xs" />
                      </NeuButton>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default NeuProjects;
