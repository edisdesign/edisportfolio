import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../../context/PortfolioContext";
import { Plus, Trash, Image as ImageIcon, Briefcase, User, Edit2, LogOut, UploadCloud, Database, Globe, Clock, Loader2 } from "lucide-react";
import pb from "../../lib/pocketbase";

// Auto-Translate utility using free Google Translate API
const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
  if (!text || text.trim() === '') return text;

  const langMap: Record<string, string> = {
    'DE': 'de',
    'EN': 'en',
    'SR': 'sr'
  };

  const sl = langMap[sourceLang] || 'en';
  const tl = langMap[targetLang] || 'en';

  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    if (data && data[0]) {
      return data[0].map((item: any) => item[0]).join('');
    }
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

// Helper: get file URL from PocketBase record
const getFileUrl = (record: any, filename: any): string => {
  if (!filename) return "";
  const name = Array.isArray(filename) ? filename[0] : filename;
  if (!name || typeof name !== 'string') return "";
  if (name.startsWith('http')) return name;
  return pb.files.getURL(record, name);
};

interface AdminDashboardProps {
  onLogout: () => void;
  onClose: () => void;
}

export const AdminDashboard = ({ onLogout, onClose }: AdminDashboardProps) => {
  const { data, updateData, refreshData } = usePortfolioData();
  const [activeTab, setActiveTab] = useState<'profile' | 'blog' | 'bio' | 'hero' | 'projects' | 'gallery' | 'experience'>('profile');

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 md:mb-12 border-b border-white/20 pb-6">
          <h1 className="text-xl md:text-3xl font-bold uppercase tracking-wider">Admin Panel</h1>
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={onClose}
              className="flex items-center gap-2 group text-white/60 hover:text-white transition-colors border border-white/20 px-3 md:px-4 py-1.5 rounded-full"
            >
              <span className="uppercase tracking-widest text-[10px] md:text-xs">View Site</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 group text-white/60 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-widest text-xs hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 md:border-r border-white/20 md:pr-8">
            <nav className="flex md:flex-col gap-2 md:gap-4 overflow-x-auto pb-4 md:pb-0">
              {[
                { key: 'profile', icon: User, label: 'Profile' },
                { key: 'blog', icon: Edit2, label: 'Blog' },
                { key: 'bio', icon: User, label: 'Biography' },
                { key: 'hero', icon: ImageIcon, label: 'Hero Images' },
                { key: 'projects', icon: Briefcase, label: 'Projects' },
                { key: 'gallery', icon: ImageIcon, label: 'Gallery' },
                { key: 'experience', icon: Clock, label: 'Experience' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors border whitespace-nowrap ${activeTab === key ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:bg-white/10 border-transparent text-white/70'}`}
                >
                  <Icon size={18} />
                  <span className="uppercase tracking-wider text-[10px] md:text-sm font-bold">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <ProfileEditor
                avatarUrl={data.avatar_url}
                updateData={(newUrl) => updateData({ avatar_url: newUrl })}
              />
            )}
            {activeTab === 'blog' && (
              <BlogEditor onDataChanged={refreshData} />
            )}
            {activeTab === 'bio' && (
              <BioEditor
                bioData={data.bioData}
                statusData={data.statusData}
                updateData={(newBio, newStatus) => updateData({ bioData: newBio, statusData: newStatus })}
              />
            )}
            {activeTab === 'hero' && (
              <HeroImagesEditor onDataChanged={refreshData} />
            )}
            {activeTab === 'projects' && (
              <ProjectsEditor onDataChanged={refreshData} />
            )}
            {activeTab === 'gallery' && (
              <GalleryEditor onDataChanged={refreshData} />
            )}
            {activeTab === 'experience' && (
              <ExperienceEditor data={data.experienceData} updateData={(newExp) => updateData({ experienceData: newExp })} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for Editors ---

// Bio & Status Editor
const BioEditor = ({ bioData, statusData, updateData }: { bioData: any, statusData: any, updateData: (b: any, s: any) => void }) => {
  const [localBio, setLocalBio] = useState(bioData || { DE: { role: "", bio: "" }, EN: { role: "", bio: "" }, SR: { role: "", bio: "" } });
  const [localStatus, setLocalStatus] = useState(statusData || { DE: "", EN: "", SR: "" });

  const handleBioChange = (lang: string, field: string, value: string) => {
    setLocalBio({ ...localBio, [lang]: { ...localBio[lang], [field]: value } });
  };

  const handleStatusChange = (lang: string, value: string) => {
    setLocalStatus({ ...localStatus, [lang]: value });
  };

  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslateAll = async (sourceLang: string) => {
    setIsTranslating(true);
    const targetLangs = ['DE', 'EN', 'SR'].filter(l => l !== sourceLang);
    const sourceBio = localBio[sourceLang];
    const sourceStatus = localStatus[sourceLang];
    const newBio = { ...localBio };
    const newStatus = { ...localStatus };

    try {
      for (const targetLang of targetLangs) {
        newBio[targetLang] = {
          ...newBio[targetLang],
          role: await translateText(sourceBio.role, sourceLang, targetLang),
          bio: await translateText(sourceBio.bio, sourceLang, targetLang)
        };
        newStatus[targetLang] = await translateText(sourceStatus, sourceLang, targetLang);
      }
      setLocalBio(newBio);
      setLocalStatus(newStatus);
      alert(`Successfully translated from ${sourceLang} to other languages!`);
    } catch (e) {
      alert("Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = () => {
    updateData(localBio, localStatus);
    alert('Biography & Status saved!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Edit Biography</h2>
        <button onClick={handleSave} className="bg-white text-black px-6 py-2 uppercase tracking-widest text-xs hover:bg-white/80 transition-colors">Save Changes</button>
      </div>

      {['DE', 'EN', 'SR'].map((lang) => (
        <div key={lang} className="bg-white/5 p-6 rounded-lg border border-white/10 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{lang} Settings</h3>
            <button
              onClick={() => handleTranslateAll(lang)}
              disabled={isTranslating}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs uppercase tracking-widest transition-colors ${isTranslating ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40'}`}
            >
              <Globe size={14} />
              {isTranslating ? 'Translating...' : `Auto-Translate to others`}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-indigo-400 mb-2 uppercase tracking-wider">Status / Currently Working On</label>
              <input type="text" value={localStatus[lang]} onChange={(e) => handleStatusChange(lang, e.target.value)} placeholder="e.g. Currently crafting a new Design System..." className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Role</label>
              <input type="text" value={localBio[lang].role} onChange={(e) => handleBioChange(lang, 'role', e.target.value)} className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Bio Text</label>
              <textarea rows={4} value={localBio[lang].bio} onChange={(e) => handleBioChange(lang, 'bio', e.target.value)} className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-white transition-colors leading-relaxed" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// HERO IMAGES EDITOR — Uses PocketBase `hero_images` collection
// Each record has: image (file), label (text), sort_order (number)
// ============================================================
const HeroImagesEditor = ({ onDataChanged }: { onDataChanged: () => Promise<void> }) => {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('hero_images').getFullList({ sort: 'sort_order' });
      setImages(records.map(rec => ({
        id: rec.id,
        src: rec.image ? getFileUrl(rec, rec.image) : "",
        label: rec.label || "",
        type: rec.type || "image",
        _record: rec
      })));
    } catch (e) {
      console.error("Failed to fetch hero images:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('label', file.name.replace(/\.[^.]+$/, ''));
      formData.append('type', 'image');
      formData.append('sort_order', String(images.length));

      await pb.collection('hero_images').create(formData);
      await fetchImages();
      await onDataChanged();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check that the 'hero_images' collection exists with an 'image' file field.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hero image?")) return;
    try {
      await pb.collection('hero_images').delete(id);
      await fetchImages();
      await onDataChanged();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdateLabel = async (id: string, label: string) => {
    try {
      await pb.collection('hero_images').update(id, { label });
      setImages(prev => prev.map(img => img.id === id ? { ...img, label } : img));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleReplaceImage = async (id: string, file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await pb.collection('hero_images').update(id, formData);
      await fetchImages();
      await onDataChanged();
    } catch (error) {
      console.error("Replace failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Hero Images</h2>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Database size={14} />
          <span>Direct PocketBase sync</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-zinc-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading hero images...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {images.map((img, index) => (
            <div key={img.id} className="flex flex-col md:flex-row gap-6 bg-white/5 p-4 md:p-6 rounded-lg border border-white/10 items-start relative">
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 p-2 hover:bg-white/5 rounded-full transition-colors z-10"
              >
                <Trash size={18} />
              </button>

              <div className="w-full md:w-1/3 aspect-[4/5] bg-black/50 border border-white/10 overflow-hidden relative group rounded-lg">
                {img.src ? (
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                  <label className="cursor-pointer flex flex-col items-center justify-center text-white/80 hover:text-white">
                    <UploadCloud size={32} className="mb-2" />
                    <span className="text-xs uppercase tracking-widest">Replace Image</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplaceImage(img.id, file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Image Label</label>
                  <input
                    type="text"
                    value={img.label}
                    onChange={(e) => handleUpdateLabel(img.id, e.target.value)}
                    className="w-full bg-black border border-white/20 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="e.g. UX Case Study"
                  />
                </div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  ID: {img.id} • Position: {index + 1}
                </p>
              </div>
            </div>
          ))}

          {/* Add New Hero Image */}
          <label className={`w-full flex items-center justify-center gap-2 py-8 md:py-12 border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/60 hover:bg-white/5 transition-all rounded-lg uppercase tracking-widest text-sm font-bold cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? (
              <><Loader2 size={20} className="animate-spin" /> Uploading...</>
            ) : (
              <><Plus size={20} /> Upload Hero Image</>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleUploadNew} disabled={isUploading} />
          </label>
        </div>
      )}
    </div>
  );
};

// ============================================================
// GALLERY EDITOR — PocketBase `gallery_images` collection
// Records have: image (file), title (text), description (text), sort_order (number), likes_count (number)
// ============================================================
const GalleryEditor = ({ onDataChanged }: { onDataChanged: () => Promise<void> }) => {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('gallery_images').getFullList({ sort: 'sort_order' });
      setImages(records.map(rec => ({
        id: rec.id,
        src: rec.image ? getFileUrl(rec, rec.image) : (rec.src || ""),
        title: rec.title || "",
        description: rec.description || "",
        likes_count: rec.likes_count || 0,
        _record: rec
      })));
    } catch (e) {
      console.error("Failed to fetch gallery:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        formData.append('title', '');
        formData.append('description', '');
        formData.append('sort_order', String(images.length + i));
        formData.append('likes_count', '0');

        await pb.collection('gallery_images').create(formData);
      }
      await fetchImages();
      await onDataChanged();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check that 'gallery_images' collection has an 'image' file field.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery image?")) return;
    try {
      await pb.collection('gallery_images').delete(id);
      await fetchImages();
      await onDataChanged();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdateField = async (id: string, field: string, value: string) => {
    try {
      await pb.collection('gallery_images').update(id, { [field]: value });
      setImages(prev => prev.map(img => img.id === id ? { ...img, [field]: value } : img));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleReplaceImage = async (id: string, file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await pb.collection('gallery_images').update(id, formData);
      await fetchImages();
      await onDataChanged();
    } catch (error) {
      console.error("Replace failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Gallery ("Meine Kunst")</h2>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Database size={14} />
          <span>Direct sync</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-zinc-500">
          <Loader2 className="animate-spin" size={20} /><span>Loading gallery...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="group flex flex-col gap-2 bg-white/5 rounded-lg border border-white/10 overflow-hidden p-4">
              <div className="relative aspect-[3/4] bg-black/50 border border-white/10 rounded overflow-hidden">
                {img.src ? (
                  <img src={img.src} alt={img.title || "Gallery item"} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600"><ImageIcon size={40} /></div>
                )}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-3">
                  <label className="cursor-pointer flex flex-col items-center justify-center text-white/80 hover:text-white">
                    <UploadCloud size={28} className="mb-1" />
                    <span className="text-[10px] uppercase tracking-widest">Replace</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleReplaceImage(img.id, file);
                    }} />
                  </label>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded hover:bg-red-500/40 transition-colors text-xs flex items-center gap-1"
                  >
                    <Trash size={14} /> Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <input
                  type="text"
                  value={img.title}
                  onChange={(e) => handleUpdateField(img.id, 'title', e.target.value)}
                  onBlur={(e) => handleUpdateField(img.id, 'title', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-xs py-1.5 focus:outline-none focus:border-white"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={img.description}
                  onChange={(e) => handleUpdateField(img.id, 'description', e.target.value)}
                  onBlur={(e) => handleUpdateField(img.id, 'description', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-xs py-1.5 focus:outline-none focus:border-white"
                  placeholder="e.g. Oil on Canvas, 2024"
                />
              </div>
            </div>
          ))}

          {/* Add New Gallery Image(s) */}
          <label className={`aspect-[3/4] flex flex-col items-center justify-center gap-2 border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/60 transition-colors rounded-lg cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? (
              <><Loader2 size={24} className="animate-spin" /><span className="text-[10px] uppercase tracking-widest">Uploading...</span></>
            ) : (
              <><Plus size={24} /><span className="text-[10px] uppercase tracking-widest">Add Images</span></>
            )}
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleUploadNew} disabled={isUploading} />
          </label>
        </div>
      )}
    </div>
  );
};

// ============================================================
// PROJECTS EDITOR — PocketBase `projects` collection
// Records have: title, category, description, challenge, solution, roles (json), tools (json),
//   image (text URL), image_file (file), size, link, language, sort_order
// ============================================================
const ProjectsEditor = ({ onDataChanged }: { onDataChanged: () => Promise<void> }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('DE');
  const [isTranslating, setIsTranslating] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('projects').getFullList({ sort: 'sort_order' });
      setProjects(records.map(rec => ({
        ...rec,
        image: rec.image_file ? getFileUrl(rec, rec.image_file) : (rec.image || ""),
        roles: rec.roles || [],
        tools: rec.tools || [],
      })));
    } catch (e) {
      console.error("Failed to fetch projects:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const filteredProjects = projects.filter(p => p.language === selectedLang);

  const handleAddProject = async () => {
    try {
      const payload = {
        title: 'New Project',
        category: 'Category',
        description: 'Description',
        challenge: 'Challenge',
        solution: 'Solution',
        roles: ['Role 1'],
        tools: ['Tool 1'],
        image: '',
        size: 'normal',
        link: '#',
        language: selectedLang,
        sort_order: filteredProjects.length
      };
      await pb.collection('projects').create(payload);
      await fetchProjects();
      await onDataChanged();
    } catch (error) {
      console.error("Create failed:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await pb.collection('projects').delete(id);
      await fetchProjects();
      await onDataChanged();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdateField = async (id: string, field: string, value: any) => {
    try {
      await pb.collection('projects').update(id, { [field]: value });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image_file', file);
      await pb.collection('projects').update(id, formData);
      await fetchProjects();
      await onDataChanged();
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Upload failed. Check that 'projects' collection has an 'image_file' file field.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTranslateProject = async (projectId: string) => {
    setIsTranslating(true);
    const sourceProj = projects.find(p => p.id === projectId);
    if (!sourceProj) return;

    const targetLangs = ['DE', 'EN', 'SR'].filter(l => l !== selectedLang);

    try {
      for (const targetLang of targetLangs) {
        const payload = {
          title: await translateText(sourceProj.title, selectedLang, targetLang),
          category: await translateText(sourceProj.category, selectedLang, targetLang),
          description: await translateText(sourceProj.description, selectedLang, targetLang),
          challenge: await translateText(sourceProj.challenge || '', selectedLang, targetLang),
          solution: await translateText(sourceProj.solution || '', selectedLang, targetLang),
          roles: sourceProj.roles || [],
          tools: sourceProj.tools || [],
          image: sourceProj.image,
          size: sourceProj.size,
          link: sourceProj.link,
          language: targetLang,
          sort_order: sourceProj.sort_order
        };

        // Check if translation already exists (same sort_order + target lang)
        const existing = projects.find(p => p.sort_order === sourceProj.sort_order && p.language === targetLang);
        if (existing) {
          await pb.collection('projects').update(existing.id, payload);
        } else {
          await pb.collection('projects').create(payload);
        }
      }
      await fetchProjects();
      await onDataChanged();
      alert('Project translated to all languages!');
    } catch (e) {
      alert("Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Projects</h2>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 text-xs text-zinc-500 hidden md:flex">
            <Database size={14} /><span>Direct sync</span>
          </div>
          <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-white text-sm">
            <option value="DE">DE</option>
            <option value="EN">EN</option>
            <option value="SR">SR</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-zinc-500">
          <Loader2 className="animate-spin" size={20} /><span>Loading projects...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white/5 p-4 md:p-6 rounded-lg border border-white/10 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <input
                  type="text"
                  defaultValue={project.title}
                  onBlur={(e) => handleUpdateField(project.id, 'title', e.target.value)}
                  className="bg-transparent text-xl md:text-2xl font-bold text-white focus:outline-none border-b border-transparent focus:border-white w-full max-w-xs md:max-w-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTranslateProject(project.id)}
                    disabled={isTranslating}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isTranslating ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40'}`}
                  >
                    <Globe size={16} /><span className="text-xs uppercase hidden sm:block">Translate</span>
                  </button>
                  <button onClick={() => handleDeleteProject(project.id)} className="text-red-400 hover:text-red-300 transition-colors p-2 bg-red-500/10 rounded-lg">
                    <Trash size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Image Upload */}
                <div className="col-span-1">
                  <label className="block text-xs text-white/60 mb-2 uppercase tracking-wider">Project Image</label>
                  <div className="aspect-[4/3] bg-black/50 rounded-lg border border-dashed border-white/20 hover:border-white/50 transition-colors relative group overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt="Project cover" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600"><ImageIcon size={40} /></div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                      <label className="cursor-pointer flex flex-col items-center justify-center text-white/80 hover:text-white p-4 text-center">
                        <UploadCloud size={28} className="mb-2" />
                        <span className="text-xs uppercase tracking-widest font-semibold">Upload Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(project.id, file);
                        }} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Category</label>
                      <input type="text" defaultValue={project.category} onBlur={(e) => handleUpdateField(project.id, 'category', e.target.value)} className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Project Link</label>
                      <input type="text" defaultValue={project.link || ''} onBlur={(e) => handleUpdateField(project.id, 'link', e.target.value)} className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Description</label>
                    <textarea rows={2} defaultValue={project.description} onBlur={(e) => handleUpdateField(project.id, 'description', e.target.value)} className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Size</label>
                      <select defaultValue={project.size} onChange={(e) => handleUpdateField(project.id, 'size', e.target.value)} className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-white">
                        <option value="normal">Normal</option>
                        <option value="large">Large (Full Width)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider flex items-center gap-2"><Briefcase size={12} /> Technologies (comma-separated)</label>
                      <input type="text" defaultValue={project.tools?.join(', ') || ''} onBlur={(e) => handleUpdateField(project.id, 'tools', e.target.value.split(',').map((s: string) => s.trim()))} className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddProject}
            className="w-full flex items-center justify-center gap-2 py-8 border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/60 hover:bg-white/5 transition-all rounded-lg uppercase tracking-widest text-sm font-bold"
          >
            <Plus size={20} /> Add New Project
          </button>
        </div>
      )}
    </div>
  );
};

// Profile / Avatar Editor — uploads avatar as file to PocketBase
const ProfileEditor = ({ avatarUrl, updateData }: { avatarUrl: string, updateData: (url: string) => void }) => {
  const [localUrl, setLocalUrl] = useState(avatarUrl);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      // Upload avatar as a file to portfolio_content collection
      const formData = new FormData();
      formData.append('avatar', file);

      // Get existing record or create new one
      let record;
      try {
        record = await pb.collection('portfolio_content').getFirstListItem('id!="invalid"');
        record = await pb.collection('portfolio_content').update(record.id, formData);
      } catch {
        record = await pb.collection('portfolio_content').create(formData);
      }

      // Build the file URL from PocketBase
      if (record.avatar) {
        const fileUrl = pb.files.getURL(record, record.avatar);
        setLocalUrl(fileUrl);
        updateData(fileUrl);
      }
      alert('Avatar uploaded successfully!');
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Upload failed. Make sure the 'portfolio_content' collection has an 'avatar' file field.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Edit Profile Image</h2>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Database size={14} />
          <span>Direct PocketBase sync</span>
        </div>
      </div>

      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="relative group mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 bg-zinc-900 flex items-center justify-center">
          {localUrl ? (
            <img src={localUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <User size={64} className="text-zinc-600" />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
            <label className={`cursor-pointer flex flex-col items-center justify-center text-white/80 hover:text-white p-4 ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
              {isUploading ? (
                <><Loader2 size={32} className="animate-spin mb-2" /><span className="text-[10px] uppercase tracking-widest font-bold">Uploading...</span></>
              ) : (
                <><UploadCloud size={32} className="mb-2" /><span className="text-[10px] uppercase tracking-widest font-bold">Upload New</span></>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        <p className="text-xs text-zinc-500">Click the image to upload a new avatar. It will be saved to PocketBase immediately.</p>
      </div>
    </div>
  );
};

// Experience Editor
const ExperienceEditor = ({ data, updateData }: { data: any, updateData: (data: any) => void }) => {
  const [localData, setLocalData] = useState(data || { DE: [], EN: [], SR: [] });
  const [activeLang, setActiveLang] = useState('DE');

  const handleUpdateItem = (lang: string, index: number, field: string, value: string) => {
    const newData = { ...localData };
    newData[lang] = [...newData[lang]];
    newData[lang][index] = { ...newData[lang][index], [field]: value };
    setLocalData(newData);
  };

  const handleAddItem = (lang: string) => {
    const newData = { ...localData };
    newData[lang] = [...(newData[lang] || []), { id: Date.now().toString(), year: "2024", title: "New Role", company: "Company", description: "Role description" }];
    setLocalData(newData);
  };

  const handleDeleteItem = (lang: string, index: number) => {
    const newData = { ...localData };
    newData[lang] = [...newData[lang]];
    newData[lang].splice(index, 1);
    setLocalData(newData);
  };

  const handleSave = () => {
    updateData(localData);
    alert('Experience Timeline saved!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Edit Experience</h2>
        <button onClick={handleSave} className="bg-white text-black px-6 py-2 uppercase tracking-widest text-xs hover:bg-white/80 transition-colors">Save Changes</button>
      </div>

      <div className="flex gap-4 mb-6">
        {['DE', 'EN', 'SR'].map(lang => (
          <button key={lang} onClick={() => setActiveLang(lang)}
            className={`px-4 py-2 rounded font-bold transition-colors ${activeLang === lang ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
          >{lang}</button>
        ))}
      </div>

      <div className="space-y-6">
        {(localData && localData[activeLang] || []).map((item: any, index: number) => (
          <div key={item.id || index} className="flex gap-6 bg-white/5 p-6 rounded-lg border border-white/10 items-start relative mt-4">
            <button onClick={() => handleDeleteItem(activeLang, index)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 p-2 hover:bg-white/5 rounded-full transition-colors">
              <Trash size={18} />
            </button>
            <div className="grid grid-cols-2 gap-4 w-full pr-10">
              <div className="col-span-1">
                <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Year</label>
                <input type="text" value={item.year} onChange={(e) => handleUpdateItem(activeLang, index, 'year', e.target.value)} className="w-full bg-black border border-white/20 rounded p-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Company</label>
                <input type="text" value={item.company} onChange={(e) => handleUpdateItem(activeLang, index, 'company', e.target.value)} className="w-full bg-black border border-white/20 rounded p-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Title / Role</label>
                <input type="text" value={item.title} onChange={(e) => handleUpdateItem(activeLang, index, 'title', e.target.value)} className="w-full bg-black border border-white/20 rounded p-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Description</label>
                <textarea rows={3} value={item.description} onChange={(e) => handleUpdateItem(activeLang, index, 'description', e.target.value)} className="w-full bg-black border border-white/20 rounded p-3 text-white focus:outline-none focus:border-white transition-colors leading-relaxed" />
              </div>
            </div>
          </div>
        ))}

        <button onClick={() => handleAddItem(activeLang)}
          className="w-full py-4 border-2 border-dashed border-white/20 rounded-lg text-white/60 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
        ><Plus size={18} /> Add Timeline Event</button>
      </div>
    </div>
  );
};

// Blog Editor — Uses PocketBase `blog_posts` collection
// Each record has: title, slug, excerpt, content, image (file), date, author, language
const BlogEditor = ({ onDataChanged }: { onDataChanged: () => Promise<void> }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState('DE');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('blog_posts').getFullList({ sort: '-date' });
      setPosts(records);
    } catch (e) {
      console.error("Failed to fetch blog posts:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleAddField = (index: number, field: string, value: any) => {
    const newPosts = [...posts];
    newPosts[index] = { ...newPosts[index], [field]: value };
    setPosts(newPosts);
  };

  const handleSavePost = async (index: number) => {
    const post = posts[index];
    setIsSaving(post.id);
    try {
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('excerpt', post.excerpt);
      formData.append('content', post.content);
      formData.append('author', post.author);
      formData.append('language', post.language);
      formData.append('slug', post.slug || post.title.toLowerCase().replace(/ /g, '-'));
      formData.append('date', post.date || new Date().toISOString());

      if (post._newImageFile) {
        formData.append('image', post._newImageFile);
      } else if (post.image && typeof post.image === 'string' && post.image.startsWith('http')) {
        // If it's a URL, we might need an image_url text field if PocketBase supports it, 
        // but since it's a File field, we prefer uploads.
      }

      if (post.id && !post.id.startsWith('temp-')) {
        await pb.collection('blog_posts').update(post.id, formData);
      } else {
        await pb.collection('blog_posts').create(formData);
      }
      
      alert("Post saved successfully!");
      fetchPosts();
      onDataChanged();
    } catch (e) {
      console.error("Save failed:", e);
      alert("Save failed.");
    } finally {
      setIsSaving(null);
    }
  };

  const handleAddPost = () => {
    const newPost = {
      id: 'temp-' + Date.now(),
      title: 'New Bio Post',
      excerpt: 'Summary...',
      content: 'Content...',
      author: 'Edi',
      language: selectedLang,
      date: new Date().toISOString()
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = async (id: string, index: number) => {
    if (id.startsWith('temp-')) {
      const newPosts = [...posts];
      newPosts.splice(index, 1);
      setPosts(newPosts);
      return;
    }
    if (!confirm("Are you sure?")) return;
    try {
      await pb.collection('blog_posts').delete(id);
      fetchPosts();
      onDataChanged();
    } catch (e) {
      alert("Delete failed.");
    }
  };

  const handleTranslatePost = async (index: number) => {
    const post = posts[index];
    setIsTranslating(true);
    try {
      const targetLangs = ['DE', 'EN', 'SR'].filter(l => l !== post.language);
      for (const lang of targetLangs) {
        const translated = {
          ...post,
          id: 'temp-' + Date.now() + lang,
          language: lang,
          title: await translateText(post.title, post.language, lang),
          excerpt: await translateText(post.excerpt, post.language, lang),
          content: await translateText(post.content, post.language, lang),
        };
        // In a real scenario, we might want to save these automatically or let user review
        // For now, let's just create them in PB
        const formData = new FormData();
        formData.append('title', translated.title);
        formData.append('excerpt', translated.excerpt);
        formData.append('content', translated.content);
        formData.append('author', translated.author);
        formData.append('language', translated.language);
        formData.append('slug', translated.title.toLowerCase().replace(/ /g, '-'));
        formData.append('date', translated.date);
        // Copy image if possible (PB doesn't easily copy files between records via API without re-uploading)
        await pb.collection('blog_posts').create(formData);
      }
      alert("Translated and saved as new posts!");
      fetchPosts();
      onDataChanged();
    } catch (e) {
      alert("Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  if (isLoading) return <div className="text-center py-20 opacity-50">Loading Blog...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Edit Blog</h2>
        <div className="flex gap-4">
          <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} className="bg-black/50 border border-white/20 rounded px-3 py-1 text-xs uppercase font-bold outline-none focus:border-white">
            <option value="DE">DE</option>
            <option value="EN">EN</option>
            <option value="SR">SR</option>
          </select>
          <button onClick={handleAddPost} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition-colors flex items-center gap-2">
            <Plus size={16} /> New Post
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {posts.filter(p => p.language === selectedLang || p.id.startsWith('temp-')).map((post, idx) => {
          const globalIdx = posts.findIndex(p => p.id === post.id);
          const displayImg = post._newImageFile ? URL.createObjectURL(post._newImageFile) : (post.image ? getFileUrl(post, post.image) : "");
          
          return (
            <div key={post.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4 relative group">
              <div className="flex justify-between items-start">
                <div className="flex gap-6 flex-1">
                  <div className="w-40 aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/10 relative group/img shrink-0">
                    {displayImg ? (
                      <img src={displayImg} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={32} /></div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                      <UploadCloud size={24} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase">Upload</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAddField(globalIdx, '_newImageFile', file);
                      }} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-3">
                    <input type="text" value={post.title} onChange={(e) => handleAddField(globalIdx, 'title', e.target.value)} className="w-full bg-transparent text-xl font-bold border-b border-white/10 focus:border-white outline-none pb-1" placeholder="Title" />
                    <textarea value={post.excerpt} onChange={(e) => handleAddField(globalIdx, 'excerpt', e.target.value)} className="w-full bg-transparent text-sm text-zinc-400 outline-none h-16 resize-none" placeholder="Excerpt..." />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleDeletePost(post.id, globalIdx)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors"><Trash size={18} /></button>
                  <button onClick={() => handleTranslatePost(globalIdx)} disabled={isTranslating} className="p-2 text-indigo-400 hover:text-indigo-300"><Globe size={18} /></button>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-2 block tracking-widest">Post Content</label>
                <textarea value={post.content} onChange={(e) => handleAddField(globalIdx, 'content', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-white/30 h-40 font-serif leading-relaxed" placeholder="Write something..." />
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-4">
                  <input type="text" value={post.author} onChange={(e) => handleAddField(globalIdx, 'author', e.target.value)} className="bg-transparent border-b border-white/10 text-xs text-zinc-500 outline-none" placeholder="Author" />
                  <span className="text-[10px] text-zinc-600 uppercase font-mono">{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <button 
                  onClick={() => handleSavePost(globalIdx)}
                  disabled={isSaving === post.id}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isSaving === post.id ? 'bg-white/10 text-white/40' : 'bg-white text-black hover:bg-white/80'}`}
                >
                  {isSaving === post.id ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
