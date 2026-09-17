import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt, FaDownload, FaTimes, FaCalendarAlt, FaAward } from 'react-icons/fa';
import NeuCard from '../ui/neumorphism/NeuCard';
import NeuButton from '../ui/neumorphism/NeuButton';

const userCertificates = [
  {
    title: "Asisten Praktikum Komunikasi Data",
    issuer: "Universitas Amikom Yogyakarta",
    date: "Feb 2025",
    link: "/certificates/KOMDAT_Asisten.pdf",
    image: "/certificate-images/KOMDAT_Asisten.jpg",
  },
  {
    title: "Asisten Praktikum Komputer Grafis",
    issuer: "Universitas Amikom Yogyakarta",
    date: "Feb 2025",
    link: "/certificates/KOMGRAF_Asisten.pdf",
    image: "/certificate-images/KOMGRAF_Asisten.jpg",
  },
  {
    title: "Asisten Praktikum Multi Media",
    issuer: "Universitas Amikom Yogyakarta",
    date: "Feb 2025",
    link: "/certificates/MULMED_Asisten.pdf",
    image: "/certificate-images/MULMED_Asisten.jpg",
  },
  {
    title: "Final Project Terbaik #2",
    issuer: "PIBITI UPN JAWA TIMUR",
    date: "Jun 2024",
    link: "/certificates/Piagam Juara 2 FP_Fransisko Andrade Laiskodat.pdf",
    image: "/certificate-images/Piagam Juara 2 FP_Fransisko Andrade Laiskodat.jpg",
  },
  {
    title: "Belajar react Zero to Hero",
    issuer: "PIBITI UPN JAWA TIMUR",
    date: "Jul 2025",
    link: "/certificates/Fransisko Andrade Laiskodat.pdf",
    image: "/certificate-images/Pelatihan React_Fransisko Andrade Laiskodat.jpg",
  },
  {
    title: "Partisipasi Lomba Data Mining #7",
    issuer: "IT TODAY IPB",
    date: "Agu 2025",
    link: "/certificates/Fransisko Andrade Laiskodat_IT TODAY.pdf",
    image: "/certificate-images/IT TODAY.jpg",
  },
];

export const NeuCertificates = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section id="certificates" className="py-20 relative font-poppins">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8ECF1] shadow-neu-inset text-xs font-semibold text-neu-accent uppercase tracking-wider">
            <span>Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neu-primary tracking-tight">
            Certifications & Honors
          </h2>
          <p className="text-neu-secondary text-sm sm:text-base max-w-xl mx-auto">
            Academic practicum assistantships, competitions, and specialized industry accreditations.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {userCertificates.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <NeuCard
                variant="raised"
                hoverLift={true}
                rounded="rounded-3xl"
                className="p-5 flex flex-col h-full border border-white/80 group"
              >
                {/* Certificate Preview Image */}
                <div
                  onClick={() => setSelectedCert(cert)}
                  className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#E8ECF1] shadow-neu-inset p-1.5 cursor-pointer"
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <span className="px-3 py-1.5 rounded-full bg-[#ECF0F3] shadow-neu-flat text-xs font-semibold text-neu-primary">
                      Preview Certificate
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col pt-4">
                  <div className="flex items-center gap-2 text-xs text-neu-accent font-semibold mb-1">
                    <FaAward />
                    <span>{cert.issuer}</span>
                  </div>
                  <h3 className="font-bold text-base text-neu-primary group-hover:text-neu-accent transition-colors line-clamp-2">
                    {cert.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-neu-secondary mt-2 mb-4">
                    <FaCalendarAlt className="text-neu-secondary/70" />
                    <span>{cert.date}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-3 border-t border-slate-300/40 flex items-center justify-between gap-2">
                    <NeuButton
                      onClick={() => setSelectedCert(cert)}
                      variant="raised"
                      size="sm"
                      className="flex-1 rounded-xl text-xs font-semibold"
                    >
                      View
                    </NeuButton>
                    <NeuButton
                      as="a"
                      href={cert.link}
                      download={cert.title}
                      variant="gradient"
                      size="sm"
                      className="flex-1 rounded-xl text-xs font-semibold"
                    >
                      <FaDownload className="text-xs" />
                      <span>PDF</span>
                    </NeuButton>
                  </div>
                </div>
              </NeuCard>
            </motion.div>
          ))}
        </div>

        {/* Certificate Modal */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-3xl w-full rounded-3xl bg-[#ECF0F3] shadow-neu-flat-lg border border-white/80 p-6 sm:p-8"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-300/50">
                  <div>
                    <h3 className="text-xl font-bold text-neu-primary">{selectedCert.title}</h3>
                    <p className="text-xs text-neu-secondary">{selectedCert.issuer} • {selectedCert.date}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="w-9 h-9 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-secondary hover:text-neu-primary"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="my-5 rounded-2xl overflow-hidden shadow-neu-inset p-2 bg-[#E8ECF1]">
                  <img
                    src={selectedCert.image}
                    alt={selectedCert.title}
                    className="w-full h-auto max-h-[60vh] object-contain rounded-xl mx-auto"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <NeuButton
                    onClick={() => setSelectedCert(null)}
                    variant="raised"
                    size="md"
                    className="rounded-full"
                  >
                    Close
                  </NeuButton>
                  <NeuButton
                    as="a"
                    href={selectedCert.link}
                    download={selectedCert.title}
                    variant="gradient"
                    size="md"
                    className="rounded-full font-semibold"
                  >
                    <FaDownload className="text-xs" />
                    <span>Download Official PDF</span>
                  </NeuButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default NeuCertificates;
