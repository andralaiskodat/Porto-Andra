import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaCertificate, FaGlobe, FaDownload, FaBriefcase, FaGraduationCap, FaQuoteLeft } from 'react-icons/fa';
import NeuCard from '../ui/neumorphism/NeuCard';
import NeuButton from '../ui/neumorphism/NeuButton';

export const NeuAbout = () => {
  const stats = [
    {
      icon: <FaCode className="text-xl text-neu-accent" />,
      value: '7+',
      title: 'Total Projects',
      description: 'Innovative web solutions crafted with modern stacks',
      color: 'from-[#7C6EF2]/10 to-[#7C6EF2]/5',
    },
    {
      icon: <FaCertificate className="text-xl text-[#F2739E]" />,
      value: '6',
      title: 'Certificates',
      description: 'Validated academic & industry competencies',
      color: 'from-[#F2739E]/10 to-[#F2739E]/5',
    },
    {
      icon: <FaGlobe className="text-xl text-emerald-500" />,
      value: '3+',
      title: 'Years Experience',
      description: 'Continuous web development & learning journey',
      color: 'from-emerald-500/10 to-emerald-500/5',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 relative font-poppins">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8ECF1] shadow-neu-inset text-xs font-semibold text-neu-accent uppercase tracking-wider">
            <span>About Me</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neu-primary tracking-tight">
            Passionate About Code & Design
          </h2>
          <p className="text-neu-secondary text-sm sm:text-base max-w-2xl mx-auto">
            Get to know my professional journey, technical expertise, and vision in modern software development.
          </p>
        </div>

        {/* Big About Card */}
        <NeuCard
          variant="raised"
          rounded="rounded-3xl"
          className="p-8 sm:p-12 mb-12 border border-white/80"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Education & Highlight Badge */}
            <div className="lg:col-span-4 flex flex-col items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E8ECF1] shadow-neu-inset flex items-center justify-center text-neu-accent">
                <FaGraduationCap className="text-2xl" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neu-accent">
                  Academic Background
                </span>
                <h3 className="text-xl font-bold text-neu-primary mt-1">
                  Bachelor of Informatics
                </h3>
                <p className="text-sm text-neu-secondary mt-0.5">
                  Universitas Amikom Yogyakarta
                </p>
              </div>
            </div>

            {/* Right Column: Full Detailed Bio */}
            <div className="lg:col-span-8 space-y-4 text-neu-secondary text-sm sm:text-base leading-relaxed text-justify">
              <p>
                Bachelor of Informatics graduate from <strong className="text-neu-primary font-semibold">Amikom University Yogyakarta</strong> with a dedicated focus on web development and data analysis. Experienced in building web applications and processing data to engineer technology-driven solutions.
              </p>
              <p>
                As a <strong className="text-neu-primary font-semibold">Full Stack Developer specializing in Front End Development</strong>, I develop modern, responsive, and tactile web interfaces using React, Next.js, and Tailwind CSS.
              </p>
              <p>
                Adept at working both collaboratively and independently with strong analytical, communication, and problem-solving skills. Highly committed to continuous self-development and ready to create meaningful impact.
              </p>

              <div className="flex flex-wrap gap-4 pt-4 justify-start">
                <NeuButton
                  as="a"
                  href="/certificates/CV Andra.pdf"
                  download="CV Andra.pdf"
                  variant="gradient"
                  size="md"
                  className="rounded-full font-semibold"
                >
                  <FaDownload className="text-xs" />
                  <span>Download Full CV</span>
                </NeuButton>
                <NeuButton
                  as="a"
                  href="#projects"
                  variant="raised"
                  size="md"
                  className="rounded-full font-semibold"
                >
                  <FaBriefcase className="text-xs text-neu-accent" />
                  <span>View All Projects</span>
                </NeuButton>
              </div>
            </div>

          </div>
        </NeuCard>

        {/* 3 Stat Cards in Soft Neumorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <NeuCard
                variant="raised"
                hoverLift={true}
                rounded="rounded-3xl"
                className="p-6 sm:p-7 border border-white/80"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <span className="text-4xl font-extrabold text-neu-primary">
                    {stat.value}
                  </span>
                </div>
                <div className="mt-6">
                  <h4 className="text-base font-bold text-neu-primary uppercase tracking-wide">
                    {stat.title}
                  </h4>
                  <p className="text-xs text-neu-secondary mt-1 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </NeuCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default NeuAbout;
