import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Instagram } from 'lucide-react';
import DotGrid from './DotGrid';
import SplitText from './SplitText';

const Preloader = ({ onFinished }) => {
  const [nameComplete, setNameComplete] = useState(false);
  const [urlComplete, setUrlComplete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!nameComplete || !urlComplete) return undefined;
    const timer = setTimeout(() => setFadeOut(true), 1000);
    return () => clearTimeout(timer);
  }, [nameComplete, urlComplete]);

  // Never leave visitors on the intro if fonts or animations fail to initialize.
  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {!fadeOut && (
        <motion.div
          exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 1, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white bg-[#060010]"
        >
          <DotGrid />
          <div className="text-center relative z-10 p-4 w-full">
            <SplitText
              tag="h1"
              text="Fransisko Andrade Laiskodat"
              className="text-3xl sm:text-4xl md:text-6xl font-moderniz font-bold mb-4"
              effect="rise"
              splitType="chars"
              trigger="load"
              delay={25}
              duration={0.8}
              onLetterAnimationComplete={() => setNameComplete(true)}
            />
            <div className="font-cascadia text-lg md:text-xl text-gray-400 mb-8 break-all">
              <SplitText
                text="www.andralaiskodat.com"
                effect="fade"
                splitType="chars"
                trigger="load"
                delay={30}
                duration={0.7}
                onLetterAnimationComplete={() => setUrlComplete(true)}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } }}
              className="flex justify-center gap-6"
            >
              <a href="https://github.com/andralaiskodat" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-[#00ffdc] transition-all duration-300 hover:scale-110"><Github size={32} /></a>
              <a href="https://www.linkedin.com/in/fransisko" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#00ffdc] transition-all duration-300 hover:scale-110"><Linkedin size={32} /></a>
              <a href="https://www.instagram.com/anndraa8._" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#00ffdc] transition-all duration-300 hover:scale-110"><Instagram size={32} /></a>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
