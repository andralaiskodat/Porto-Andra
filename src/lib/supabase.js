import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') && 
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Maksimal ukuran foto: 5 MB (dalam bytes)
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_FILE_SIZE_MB = 5;

/**
 * Validasi ukuran file gambar (maksimal 5MB)
 * @param {File} file 
 * @returns {{ valid: boolean, message: string, sizeMB: string }}
 */
export const validateImageSize = (file) => {
  if (!file) return { valid: true, message: '', sizeMB: '0.00' };
  
  const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
  
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      message: `Ukuran file (${sizeInMB} MB) melebihi batas maksimal 5 MB!`,
      sizeMB: sizeInMB
    };
  }
  
  return {
    valid: true,
    message: `Ukuran file valid (${sizeInMB} MB / 5 MB)`,
    sizeMB: sizeInMB
  };
};

// Data proyek awal bawaan
export const initialProjects = [
  {
    id: "proj-1",
    title: "Landing Page Bakmi Pak Sandiyo",
    description: "Website landing page untuk Bakmi Pak Sandiyo, menampilkan menu, lokasi, dan kontak.",
    tech: ["Html", "CSS", "BootStrap", "Framer Motion"],
    link: "https://bakmipaksandiyo.vercel.app/",
    image: "/certificate-images/image_LP.png",
    category: "Web/Apps",
    created_at: new Date("2024-01-01").toISOString()
  },
  {
    id: "proj-2",
    title: "DESTINA - Website pencari Wisata Daerah",
    description: "Aplikasi web untuk mencari destinasi wisata lokal dengan fitur pencarian dan filter.",
    tech: ["React", "Vite", "TailwindCSS"],
    link: "https://destina-ten.vercel.app/",
    image: "/certificate-images/image_Destina.png",
    category: "Web/Apps",
    created_at: new Date("2024-02-01").toISOString()
  },
  {
    id: "proj-3",
    title: "Sistem Deteksi Penyakit Tanaman Tomat",
    description: "Membuat Aplikasi web untuk mendeteksi penyakit pada tanaman tomat melalui daun menggunakan model ML dilengkapi dangan fitur Chat AI.",
    tech: ["Python", "Flask", "React"],
    link: "https://drive.google.com/file/d/1XOajDgZBGIz4tQ039mac9WD_vSYYGwGU/view?usp=sharing",
    image: "/certificate-images/Picture_Tomadetect.png",
    category: "Web/Apps",
    created_at: new Date("2024-03-01").toISOString()
  },
  {
    id: "proj-4",
    title: "DiBisnis.in - Platform Kasir Digital untuk UMKM Kuliner",
    description: "Kelola penjualan, inventori, dan promosikan bisnis kuliner Anda secara online dengan mudah, cepat, dan gratis.",
    tech: ["Next.js", "TailwindCSS", "TypeScript", "PostgreSQL"],
    link: "https://dibisnis-in.vercel.app/",
    image: "/certificate-images/DiBisnisin.png",
    category: "Web/Apps",
    created_at: new Date("2024-04-01").toISOString()
  },
  {
    id: "proj-5",
    title: "RestoPOS - QR-Based Food Ordering System",
    description: "Sistem pemesanan makanan berbasis QR Code untuk restoran. Pelanggan scan QR di meja, pesan menu, dan bayar via QRIS atau tunai — tanpa antri, tanpa login.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Pusher", "Midtrans", "TailwindCSS", "Redis"],
    link: "https://bakmipaksandiyo-pos.vercel.app/",
    image: "/certificate-images/Pos.png",
    category: "Web/Apps",
    created_at: new Date("2024-05-01").toISOString()
  },
  {
    id: "proj-6",
    title: "Brosur Iklan Produk",
    description: "Brosur iklan produk dengan desain menarik dan informatif.",
    tech: ["Canva", "Photoshop"],
    link: "https://drive.google.com/file/d/1nBFIH6qTDLB624goSIrKY3CcsTO_Tf2g/view?usp=sharing",
    image: "/certificate-images/image_Iklan.png",
    category: "Graphic Design",
    created_at: new Date("2024-06-01").toISOString()
  },
  {
    id: "proj-7",
    title: "Majalah Interior Rumah",
    description: "Majalah yang menampilkan desain interior rumah modern.",
    tech: ["Photoshop", "InDesign", "Illustrator"],
    link: "https://drive.google.com/file/d/1nBFIH6qTDLB624goSIrKY3CcsTO_Tf2g/view?usp=sharing",
    image: "/certificate-images/image_Majalah.png",
    category: "Graphic Design",
    created_at: new Date("2024-07-01").toISOString()
  },
  {
    id: "proj-8",
    title: "Logo",
    description: "Desain logo kreatif untuk berbagai merek UMKM dan perusahaan.",
    tech: ["Photoshop", "Illustrator"],
    link: "https://drive.google.com/file/d/1nBFIH6qTDLB624goSIrKY3CcsTO_Tf2g/view?usp=sharing",
    image: "/certificate-images/image_Logo.png",
    category: "Graphic Design",
    created_at: new Date("2024-08-01").toISOString()
  }
];

// Helper Local Storage
const getLocalProjects = () => {
  try {
    const data = localStorage.getItem('portfolioProjects');
    if (data) {
      return JSON.parse(data);
    }
    localStorage.setItem('portfolioProjects', JSON.stringify(initialProjects));
    return initialProjects;
  } catch (err) {
    console.error('Error reading localStorage projects:', err);
    return initialProjects;
  }
};

const saveLocalProjects = (projects) => {
  try {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

// Mengubah file gambar ke base64 jika menggunakan fallback lokal
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Upload gambar ke Supabase Storage (bucket: project-images)
 * @param {File} file 
 * @returns {Promise<string>} Public URL of uploaded image
 */
export const uploadProjectImage = async (file) => {
  if (!file) throw new Error('File foto tidak ditemukan');
  
  // Validasi 5MB
  const validation = validateImageSize(file);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  if (isSupabaseConfigured() && supabase) {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${Date.now()}_${cleanFileName}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    // Upload ke bucket 'project-images'
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.warn('Supabase storage upload error, fallback to data URL:', error.message);
      return await fileToBase64(file);
    }

    const { data: publicUrlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  // Fallback lokal jika Supabase belum terhubung
  return await fileToBase64(file);
};

/**
 * Mengambil semua project dari Supabase atau fallback LocalStorage
 * @returns {Promise<Array>}
 */
export const fetchProjects = async () => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, fallback to local storage:', error.message);
        return getLocalProjects();
      }

      if (data && data.length > 0) {
        saveLocalProjects(data);
        return data;
      } else {
        // Jika tabel Supabase masih kosong, lakukan seeding data awal
        try {
          const formattedInitial = initialProjects.map(({ id, ...rest }) => rest);
          const { data: seededData, error: seedErr } = await supabase
            .from('projects')
            .insert(formattedInitial)
            .select();

          if (!seedErr && seededData) {
            saveLocalProjects(seededData);
            return seededData;
          }
        } catch (seedCatch) {
          console.warn('Seeding supabase projects skipped:', seedCatch);
        }
        return getLocalProjects();
      }
    } catch (err) {
      console.warn('Network/Supabase error, using local fallback:', err);
      return getLocalProjects();
    }
  }

  return getLocalProjects();
};

/**
 * Menambahkan project baru
 * @param {Object} projectData 
 * @param {File|null} imageFile 
 * @returns {Promise<Object>}
 */
export const createProject = async (projectData, imageFile) => {
  let imageUrl = projectData.image || '';

  if (imageFile) {
    imageUrl = await uploadProjectImage(imageFile);
  }

  if (!imageUrl) {
    throw new Error('Foto proyek wajib disertakan (maks 5 MB)');
  }

  const newProject = {
    title: projectData.title.trim(),
    description: projectData.description.trim(),
    category: projectData.category || 'Web/Apps',
    tech: Array.isArray(projectData.tech) ? projectData.tech : projectData.tech.split(',').map(t => t.trim()).filter(Boolean),
    link: projectData.link ? projectData.link.trim() : '',
    image: imageUrl,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert error, saving locally:', error.message);
        const local = getLocalProjects();
        const fallbackProject = { ...newProject, id: `local-${Date.now()}` };
        saveLocalProjects([fallbackProject, ...local]);
        return fallbackProject;
      }

      // Update local cache
      const local = getLocalProjects();
      saveLocalProjects([data, ...local]);
      return data;
    } catch (err) {
      console.warn('Supabase insert exception:', err);
    }
  }

  // Local fallback
  const local = getLocalProjects();
  const fallbackProject = { ...newProject, id: `local-${Date.now()}` };
  saveLocalProjects([fallbackProject, ...local]);
  return fallbackProject;
};

/**
 * Mengupdate data project
 * @param {string|number} id 
 * @param {Object} projectData 
 * @param {File|null} newImageFile 
 * @returns {Promise<Object>}
 */
export const updateProject = async (id, projectData, newImageFile = null) => {
  let imageUrl = projectData.image;

  if (newImageFile) {
    imageUrl = await uploadProjectImage(newImageFile);
  }

  const updatedData = {
    title: projectData.title.trim(),
    description: projectData.description.trim(),
    category: projectData.category || 'Web/Apps',
    tech: Array.isArray(projectData.tech) ? projectData.tech : projectData.tech.split(',').map(t => t.trim()).filter(Boolean),
    link: projectData.link ? projectData.link.trim() : '',
    image: imageUrl
  };

  if (isSupabaseConfigured() && supabase && typeof id === 'string' && !id.startsWith('local-')) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Supabase update error, updating locally:', error.message);
      } else if (data) {
        const local = getLocalProjects().map(p => p.id === id ? data : p);
        saveLocalProjects(local);
        return data;
      }
    } catch (err) {
      console.warn('Supabase update exception:', err);
    }
  }

  // Local fallback
  const local = getLocalProjects();
  const updatedLocal = local.map(p => p.id === id ? { ...p, ...updatedData } : p);
  saveLocalProjects(updatedLocal);
  return { id, ...updatedData };
};

/**
 * Menghapus project
 * @param {string|number} id 
 * @param {string} [imageUrl]
 * @returns {Promise<boolean>}
 */
export const deleteProject = async (id, imageUrl = '') => {
  if (isSupabaseConfigured() && supabase && typeof id === 'string' && !id.startsWith('local-')) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase delete exception:', err);
    }
  }

  // Update local
  const local = getLocalProjects();
  const filtered = local.filter(p => p.id !== id);
  saveLocalProjects(filtered);
  return true;
};
