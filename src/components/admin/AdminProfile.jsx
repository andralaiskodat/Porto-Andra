import React, { useEffect, useState } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { supabase } from '../../lib/supabase';

const fields = [
  ['name', 'Nama lengkap'], ['subtitle', 'Profesi di navigasi'], ['heroDescription', 'Deskripsi pembuka', true],
  ['aboutTagline', 'Ringkasan tentang saya'], ['aboutDescription', 'Deskripsi tentang saya', true],
  ['quote', 'Kutipan'], ['skills', 'Keahlian (pisahkan dengan koma)'],
  ['github', 'URL GitHub'], ['instagram', 'URL Instagram'], ['linkedin', 'URL LinkedIn'], ['cvUrl', 'URL atau lokasi file CV'],
];
export default function AdminProfile({ isOpen, onClose, onNavigate }) {
  const { profile, saveProfile, shared } = useProfile();
  const [form, setForm] = useState(profile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (isOpen) { setForm(profile); setMessage(''); } }, [isOpen, profile]);
  if (!isOpen) return null;
  const upload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) { setMessage('Pilih gambar berukuran maksimal 2 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => setForm(current => ({ ...current, photo: reader.result }));
    reader.onerror = () => setMessage('Foto tidak dapat dibaca.');
    reader.readAsDataURL(file);
  };
  const submit = async event => {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      for (const key of ['github', 'instagram', 'linkedin']) {
        if (form[key] && !/^https?:\/\//i.test(form[key])) throw new Error('URL media sosial harus diawali http:// atau https://.');
      }
      if (shared && email) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      await saveProfile(form);
      setPassword(''); setMessage(shared ? 'Profil berhasil disimpan untuk semua pengunjung.' : 'Profil tersimpan di browser ini.');
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  };
  const inputClass = 'w-full mt-1 rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-white focus:border-cyan-400';
  return <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="profile-title">
    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-700 bg-slate-950 p-5 md:p-8 text-white">
      <div className="flex justify-between gap-4 items-start"><div><h2 id="profile-title" className="text-2xl font-bold text-cyan-300">Pengaturan profil</h2><p className="text-slate-400 mt-1">Ubah isi portofolio cyberpunk Anda.</p></div><button type="button" onClick={onClose} aria-label="Tutup" className="text-2xl">×</button></div>
      <nav className="flex flex-wrap gap-2 my-5">{[['profile','Profil'],['projects','Projects'],['messages','Messages'],['comments','Comments']].map(([id,label]) => <button key={id} type="button" onClick={() => onNavigate(id)} className={`px-4 py-2 rounded-lg ${id === 'profile' ? 'bg-cyan-700' : 'bg-slate-800 hover:bg-slate-700'}`}>{label}</button>)}</nav>
      <p className="text-sm text-slate-300 mb-4">{shared ? 'Perubahan publik memerlukan akun Supabase Auth yang diizinkan dalam kebijakan database.' : 'Mode lokal: perubahan hanya terlihat di browser dan perangkat ini.'}</p>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex flex-wrap items-center gap-4"><img src={form.photo} alt="Pratinjau foto profil" className="w-24 h-24 rounded-xl object-cover" /><label className="text-sm">Foto profil (maks. 2 MB)<input type="file" accept="image/*" onChange={upload} className="block mt-2 text-sm" /></label></div>
        <label className="block text-sm">URL foto profil<input className={inputClass} value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} placeholder="https://..." /></label>
        <div className="grid md:grid-cols-2 gap-4">{fields.map(([key,label,multiline]) => <label key={key} className={`block text-sm ${multiline ? 'md:col-span-2' : ''}`}>{label}{multiline ? <textarea className={inputClass} rows={4} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /> : <input className={inputClass} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />}</label>)}</div>
        {shared && <div className="grid md:grid-cols-2 gap-4 border-t border-slate-700 pt-4"><label className="text-sm">Email admin Supabase<input type="email" autoComplete="username" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} /></label><label className="text-sm">Password admin Supabase<input type="password" autoComplete="current-password" className={inputClass} value={password} onChange={e => setPassword(e.target.value)} /></label></div>}
        {message && <p role="status" className="text-cyan-300 text-sm">{message}</p>}
        <button disabled={busy} className="rounded-lg bg-cyan-600 px-6 py-3 font-bold hover:bg-cyan-500 disabled:opacity-50">{busy ? 'Menyimpan...' : 'Simpan perubahan'}</button>
      </form>
    </div>
  </div>;
}
