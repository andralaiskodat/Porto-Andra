import React, { createContext, useContext, useEffect, useState } from 'react';
import photo from '../assets/images/ANDRA.jpg';
import { supabase } from '../lib/supabase';

export const defaults = {
  name: 'Fransisko Andrade Laiskodat', subtitle: 'Web Developer & Informatics', photo,
  heroDescription: 'Full Stack & Frontend Developer specializing in clean, responsive, and high-performance web applications using React, Next.js, and modern tools.',
  aboutTagline: 'Passionate about building functional web applications and data solutions',
  aboutDescription: 'Informatics graduate from Amikom University Yogyakarta with a dedicated focus on Web Development and Data Analysis. Experienced in building responsive web applications with React, Next.js, and Node.js, and developing practical, data-informed digital solutions. Passionate about clean frontend architecture, responsive design, and solid problem-solving. Ready to contribute effectively as a Frontend Developer, Full Stack Web Developer, or Data Analyst.',
  quote: 'Whoever strives shall succeed.', skills: 'React, Next.js, Javascript, Node.js, Tailwind',
  github: 'https://github.com/andralaiskodat', instagram: 'https://www.instagram.com/anndraa8._', linkedin: 'https://www.linkedin.com/in/fransisko', cvUrl: '/certificates/CV Andra.pdf',
};
const ProfileContext = createContext(null);
export const useProfile = () => useContext(ProfileContext);
export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem('portfolioProfile') || '{}') }; } catch { return defaults; }
  });
  useEffect(() => {
    if (!supabase) return;
    supabase.from('portfolio_profile').select('content').eq('id', 1).maybeSingle().then(({ data, error }) => {
      if (!error && data?.content) setProfile({ ...defaults, ...data.content });
    });
  }, []);
  const saveProfile = async (content) => {
    if (supabase) {
      const { error } = await supabase.from('portfolio_profile').upsert({ id: 1, content });
      if (error) throw new Error('Gagal menyimpan ke Supabase: ' + error.message);
    } else {
      try { localStorage.setItem('portfolioProfile', JSON.stringify(content)); }
      catch { throw new Error('Penyimpanan browser penuh. Gunakan foto yang lebih kecil.'); }
    }
    setProfile(content);
  };
  return <ProfileContext.Provider value={{ profile, saveProfile, shared: Boolean(supabase) }}>{children}</ProfileContext.Provider>;
}
