import React, { useState, useRef } from "react";
import { usePortfolioData } from "../../context/PortfolioContext";
import { Plus, Trash, Image as ImageIcon, Briefcase, User, Edit2, LogOut, UploadCloud, Database, Globe } from "lucide-react";
import { supabase } from "../../lib/supabase";

// Compress image utility - AGGRESSIVE compression for Base64 storage
const compressImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Auto-Translate utility using free Google Translate API
const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
  if (!text || text.trim() === '') return text;

  const langMap: Record<string, string> = {
    'DE': 'de',
    'EN': 'en',
    'SR': 'sr' // Google Translate code for Serbian
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

interface AdminDashboardProps {
  onLogout: () => void;
  onClose: () => void;
}

export const AdminDashboard = ({ onLogout, onClose }: AdminDashboardProps) => {
  const { data, updateData } = usePortfolioData();
  const [activeTab, setActiveTab] = useState<'bio' | 'hero' | 'projects' | 'gallery' | 'database'>('bio');

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-white/20 pb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Admin Panel</h1>
          <div className="flex items-center gap-6">
            <button
              onClick={onClose}
              className="flex items-center gap-2 group text-white/60 hover:text-white transition-colors border border-white/20 px-4 py-1.5 rounded-full"
            >
              <span className="uppercase tracking-widest text-xs">View Site</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 group text-white/60 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-widest text-sm">Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 border-r border-white/20 pr-8">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => setActiveTab('bio')}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors border ${activeTab === 'bio' ? 'bg-white text-black border-white' : 'hover:bg-white/10 border-transparent text-white/70'}`}
              >
                <User size={18} />
                <span className="uppercase tracking-wider text-sm">Biography</span>
              </button>
              <button
                onClick={() => setActiveTab('hero')}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors border ${activeTab === 'hero' ? 'bg-white text-black border-white' : 'hover:bg-white/10 border-transparent text-white/70'}`}
              >
                <ImageIcon size={18} />
                <span className="uppercase tracking-wider text-sm">Hero Images</span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors border ${activeTab === 'projects' ? 'bg-white text-black border-white' : 'hover:bg-white/10 border-transparent text-white/70'}`}
              >
                <Briefcase size={18} />
                <span className="uppercase tracking-wider text-sm">Projects</span>
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors border ${activeTab === 'gallery' ? 'bg-white text-black border-white' : 'hover:bg-white/10 border-transparent text-white/70'}`}
              >
                <ImageIcon size={18} />
                <span className="uppercase tracking-wider text-sm">Gallery</span>
              </button>
              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-3 p-3 mt-8 rounded-lg transition-colors border ${activeTab === 'database' ? 'bg-indigo-500 text-white border-indigo-500' : 'hover:bg-indigo-500/10 border-transparent text-indigo-400'}`}
              >
                <Database size={18} />
                <span className="uppercase tracking-wider text-sm font-bold">Database Sync</span>
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {activeTab === 'bio' && (
              <BioEditor data={data.bioData} updateData={(newBio) => updateData({ bioData: newBio })} />
            )}
            {activeTab === 'hero' && (
              <HeroImagesEditor data={data.heroImages} updateData={(newImages) => updateData({ heroImages: newImages })} />
            )}
            {activeTab === 'projects' && (
              <ProjectsEditor data={data.projectsData} updateData={(newProjects) => updateData({ projectsData: newProjects })} />
            )}
            {activeTab === 'gallery' && (
              <GalleryEditor data={data.galleryImages} updateData={(newGallery) => updateData({ galleryImages: newGallery })} />
            )}
            {activeTab === 'database' && (
              <DatabaseMigration data={data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for Editors ---

// Bio Editor
const BioEditor = ({ data, updateData }: { data: any, updateData: (data: any) => void }) => {
  const [localData, setLocalData] = useState(data);

  const handleChange = (lang: string, field: string, value: string) => {
    const newData = {
      ...localData,
      [lang]: {
        ...localData[lang],
        [field]: value
      }
    };
    setLocalData(newData);
  };

  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslateAll = async (sourceLang: string) => {
    setIsTranslating(true);
    const targetLangs = ['DE', 'EN', 'SR'].filter(l => l !== sourceLang);
    const sourceData = localData[sourceLang];

    const newData = { ...localData };

    try {
      for (const targetLang of targetLangs) {
        const translatedRole = await translateText(sourceData.role, sourceLang, targetLang);
        const translatedBio = await translateText(sourceData.bio, sourceLang, targetLang);

        newData[targetLang] = {
          ...newData[targetLang],
          role: translatedRole,
          bio: translatedBio
        };
      }
      setLocalData(newData);
      alert(`Successfully translated from ${sourceLang} to other languages!`);
    } catch (e) {
      alert("Translation failed. Check internet connection or try again later.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = () => {
    updateData(localData);
    alert('Biography updated successfully (saved locally)');
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
              <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Role</label>
              <input
                type="text"
                value={localData[lang].role}
                onChange={(e) => handleChange(lang, 'role', e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Bio Text</label>
              <textarea
                rows={4}
                value={localData[lang].bio}
                onChange={(e) => handleChange(lang, 'bio', e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-white transition-colors leading-relaxed"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Hero Images Editor
const HeroImagesEditor = ({ data, updateData }: { data: any[], updateData: (data: any[]) => void }) => {
  const [localData, setLocalData] = useState(data);

  const handleUpdateImage = (index: number, field: string, value: string) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
  };

  const handleSave = () => {
    updateData(localData);
    alert('Hero images updated successfully (saved locally)');
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        handleUpdateImage(index, 'src', compressedBase64);
      } catch (error) {
        console.error("Image compression failed", error);
        alert("Błąd podczas wgrywania zdjęcia. Spróbuj mniejsze.");
      }
    }
  };

  const handleDrop = async (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        handleUpdateImage(index, 'src', compressedBase64);
      } catch (error) {
        console.error("Image compression failed", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Edit Hero Images</h2>
        <button onClick={handleSave} className="bg-white text-black px-6 py-2 uppercase tracking-widest text-xs hover:bg-white/80 transition-colors">Save Changes</button>
      </div>

      <div className="space-y-6">
        {Array.isArray(localData) && localData.length > 0 ? localData.map((img, index) => (
          <div key={index} className="flex gap-6 bg-white/5 p-6 rounded-lg border border-white/10 items-start">
            <div
              className="w-1/3 aspect-[4/5] bg-black/50 border border-white/10 overflow-hidden relative group"
              onDrop={(e) => handleDrop(index, e)}
              onDragOver={handleDragOver}
            >
              <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                <label className="cursor-pointer flex flex-col items-center justify-center text-white/80 hover:text-white">
                  <UploadCloud size={32} className="mb-2" />
                  <span className="text-xs uppercase tracking-widest">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(index, e)} />
                </label>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Image Label</label>
                <input
                  type="text"
                  value={img.label}
                  onChange={(e) => handleUpdateImage(index, 'label', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2 uppercase tracking-wider">Image Source (URL)</label>
                <input
                  type="text"
                  value={img.src}
                  onChange={(e) => handleUpdateImage(index, 'src', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded p-3 text-white text-sm focus:outline-none focus:border-white transition-colors"
                />
                <p className="text-xs text-white/40 mt-2">Paste a direct image link or click the image to upload.</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-white/50 text-center py-12">No hero images found. Please add them using the Database Sync initial payload first.</div>
        )}
      </div>
    </div>
  );
};

// Projects Editor
const ProjectsEditor = ({ data, updateData }: { data: any, updateData: (data: any) => void }) => {
  const [localData, setLocalData] = useState(data);
  const [selectedLang, setSelectedLang] = useState('DE');
  const [isTranslating, setIsTranslating] = useState(false);

  // Minimal implementation: just raw JSON editor for now to save time, or a basic list.
  // We'll create a basic list editor.
  const handleUpdateProject = (index: number, field: string, value: string | string[]) => {
    const projects = [...localData[selectedLang]];
    projects[index] = { ...projects[index], [field]: value };
    setLocalData({ ...localData, [selectedLang]: projects });
  };

  const handleAddProject = () => {
    const projects = [...localData[selectedLang]];
    projects.push({
      id: Date.now(),
      title: 'New Project',
      category: 'Category',
      description: 'Description',
      challenge: 'Challenge',
      solution: 'Solution',
      roles: ['Role 1'],
      tools: ['Tool 1'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
      size: 'normal',
      link: '#'
    });
    setLocalData({ ...localData, [selectedLang]: projects });
  };

  const handleDeleteProject = (index: number) => {
    const projects = [...localData[selectedLang]];
    projects.splice(index, 1);
    setLocalData({ ...localData, [selectedLang]: projects });
  };

  const handleTranslateProject = async (projectIndex: number, sourceLang: string) => {
    setIsTranslating(true);
    const targetLangs = ['DE', 'EN', 'SR'].filter(l => l !== sourceLang);

    try {
      const sourceProj = localData[sourceLang][projectIndex];
      const newLocalData = { ...localData };

      for (const targetLang of targetLangs) {
        // Find corresponding project in target language by matching ID
        const targetIndex = newLocalData[targetLang].findIndex((p: any) => p.id === sourceProj.id);

        if (targetIndex !== -1) {
          const t = { ...newLocalData[targetLang][targetIndex] };

          t.title = await translateText(sourceProj.title, sourceLang, targetLang);
          t.category = await translateText(sourceProj.category, sourceLang, targetLang);
          t.description = await translateText(sourceProj.description, sourceLang, targetLang);

          if (sourceProj.challenge) t.challenge = await translateText(sourceProj.challenge, sourceLang, targetLang);
          if (sourceProj.solution) t.solution = await translateText(sourceProj.solution, sourceLang, targetLang);

          if (sourceProj.roles && sourceProj.roles.length > 0) {
            t.roles = [];
            for (const r of sourceProj.roles) t.roles.push(await translateText(r, sourceLang, targetLang));
          }
          if (sourceProj.tools && sourceProj.tools.length > 0) {
            // Usually tech stack names don't need translation, but user might have typed Serbian/German text
            t.tools = [];
            for (const tl of sourceProj.tools) t.tools.push(await translateText(tl, sourceLang, targetLang));
          }

          // Image and link stay identical
          t.image = sourceProj.image;
          t.link = sourceProj.link;

          newLocalData[targetLang][targetIndex] = t;
        }
      }
      setLocalData(newLocalData);
      alert(`Project successfully translated to other languages!`);
    } catch (e) {
      alert("Translation failed. Verify your network and try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = () => {
    updateData(localData);
    alert('Projects updated successfully (saved locally)');
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        handleUpdateProject(index, 'image', compressedBase64);
      } catch (error) {
        console.error("Image compression failed", error);
      }
    }
  };

  const handleDrop = async (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        handleUpdateProject(index, 'image', compressedBase64);
      } catch (error) {
        console.error("Image compression failed", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Edit Projects</h2>
        <div className="flex gap-4">
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-white"
          >
            <option value="DE">DE</option>
            <option value="EN">EN</option>
            <option value="SR">SR</option>
          </select>
          <button onClick={handleSave} className="bg-white text-black px-6 py-2 uppercase tracking-widest text-xs hover:bg-white/80 transition-colors">Save Changes</button>
        </div>
      </div>

      <div className="space-y-8">
        {localData[selectedLang].map((project: any, index: number) => (
          <div key={project.id} className="bg-white/5 p-6 rounded-lg border border-white/10 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
              <input
                type="text"
                value={project.title}
                onChange={(e) => handleUpdateProject(index, 'title', e.target.value)}
                className="bg-transparent text-2xl font-bold text-white focus:outline-none border-b border-transparent focus:border-white w-full max-w-xs md:max-w-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleTranslateProject(index, selectedLang)}
                  disabled={isTranslating}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isTranslating ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40'}`}
                  title="Translate this project to all other languages globally"
                >
                  <Globe size={16} />
                  <span className="text-xs uppercase hidden sm:block">Translate</span>
                </button>
                <button onClick={() => handleDeleteProject(index)} className="text-red-400 hover:text-red-300 transition-colors p-2 bg-red-500/10 rounded-lg">
                  <Trash size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Image Upload */}
              <div className="col-span-1">
                <label className="block text-xs text-white/60 mb-2 uppercase tracking-wider">Project Image</label>
                <div
                  className="aspect-[4/3] bg-black/50 rounded-lg border border-dashed border-white/20 hover:border-white/50 transition-colors relative group overflow-hidden"
                  onDrop={(e) => handleDrop(index, e)}
                  onDragOver={handleDragOver}
                >
                  <img src={project.image} alt="Project cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <label className="cursor-pointer flex flex-col items-center justify-center text-white/80 hover:text-white p-4 text-center">
                      <UploadCloud size={28} className="mb-2" />
                      <span className="text-xs uppercase tracking-widest font-semibold">Upload Image</span>
                      <span className="text-[10px] opacity-70 mt-1">Drag & drop or click</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(index, e)} />
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  value={project.image}
                  onChange={(e) => handleUpdateProject(index, 'image', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-xs mt-2 focus:outline-none focus:border-white"
                  placeholder="Or paste URL here..."
                />
              </div>

              {/* Right Column: Details */}
              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      value={project.category}
                      onChange={(e) => handleUpdateProject(index, 'category', e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Project Link</label>
                    <input
                      type="text"
                      value={project.link || ''}
                      onChange={(e) => handleUpdateProject(index, 'link', e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Description</label>
                  <textarea
                    rows={2}
                    value={project.description}
                    onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider flex items-center gap-2">
                      <User size={12} /> My Role (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={project.roles?.join(', ') || ''}
                      onChange={(e) => handleUpdateProject(index, 'roles', e.target.value.split(',').map(s => s.trim()))}
                      className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-white"
                      placeholder="e.g. Lead Designer, Frontend Dev"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase size={12} /> Technologies (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={project.tools?.join(', ') || ''}
                      onChange={(e) => handleUpdateProject(index, 'tools', e.target.value.split(',').map(s => s.trim()))}
                      className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-white"
                      placeholder="e.g. React, Tailwind, Figma"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddProject}
          className="w-full flex items-center justify-center gap-2 py-6 border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/60 hover:bg-white/5 transition-all rounded-lg uppercase tracking-widest text-sm font-bold"
        >
          <Plus size={20} /> Add New Project
        </button>
      </div>
    </div>
  );
};

// Gallery Editor
const GalleryEditor = ({ data, updateData }: { data: any[], updateData: (data: any[]) => void }) => {
  const [localData, setLocalData] = useState(data);

  const handleUpdateImage = (index: number, field: string, value: string) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
  };

  const handleAddImage = () => {
    setLocalData([...localData, { id: Date.now(), src: 'https://via.placeholder.com/800x1000', title: 'New Art', description: 'Technique / Year' }]);
  };

  const handleDeleteImage = (index: number) => {
    const newData = [...localData];
    newData.splice(index, 1);
    setLocalData(newData);
  };

  const handleSave = () => {
    updateData(localData);
    alert('Gallery updated successfully (saved locally)');
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        handleUpdateImage(index, 'src', compressedBase64);
      } catch (error) {
        console.error("Image compression failed", error);
      }
    }
  };

  const handleDrop = async (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        handleUpdateImage(index, 'src', compressedBase64);
      } catch (error) {
        console.error("Image compression failed", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Edit Gallery ("Meine Kunst")</h2>
        <button onClick={handleSave} className="bg-white text-black px-6 py-2 uppercase tracking-widest text-xs hover:bg-white/80 transition-colors">Save Changes</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {localData.map((img, index) => (
          <div key={img.id || index} className="group flex flex-col gap-2 bg-white/5 rounded-lg border border-white/10 overflow-hidden p-4">
            <div
              className="relative aspect-[3/4] bg-black/50 border border-white/10 rounded overflow-hidden"
              onDrop={(e) => handleDrop(index, e)}
              onDragOver={handleDragOver}
            >
              <img src={img.src} alt={img.title || "Gallery item"} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                <label className="cursor-pointer flex flex-col items-center justify-center text-white/80 hover:text-white mb-4">
                  <UploadCloud size={32} className="mb-2" />
                  <span className="text-xs uppercase tracking-widest">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(index, e)} />
                </label>
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="bg-red-500/20 text-red-400 p-2 rounded hover:bg-red-500/40 transition-colors mt-2"
                  title="Delete Image"
                >
                  <Trash size={16} /> Delete
                </button>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div>
                <label className="text-[10px] text-white/50 uppercase tracking-widest pl-1">Image URL</label>
                <input
                  type="text"
                  value={img.src}
                  onChange={(e) => handleUpdateImage(index, 'src', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-xs py-1.5 focus:outline-none focus:border-white"
                  placeholder="URL..."
                />
              </div>
              <div>
                <label className="text-[10px] text-white/50 uppercase tracking-widest pl-1">Title</label>
                <input
                  type="text"
                  value={img.title || ''}
                  onChange={(e) => handleUpdateImage(index, 'title', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-xs py-1.5 focus:outline-none focus:border-white"
                  placeholder="e.g. Abstract Portrait"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/50 uppercase tracking-widest pl-1">Description / Technique</label>
                <input
                  type="text"
                  value={img.description || ''}
                  onChange={(e) => handleUpdateImage(index, 'description', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-xs py-1.5 focus:outline-none focus:border-white"
                  placeholder="e.g. Oil on Canvas, 2024"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddImage}
          className="aspect-[3/4] flex flex-col items-center justify-center gap-2 border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/60 transition-colors rounded-lg"
        >
          <Plus size={24} />
          <span className="uppercase tracking-widest text-xs">Add Image</span>
        </button>
      </div>
    </div>
  );
};

// Database Migration Component
const DatabaseMigration = ({ data }: { data: any }) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleMigrate = async () => {
    if (!confirm('Are you sure you want to completely overwrite the cloud database with your current local settings? Make sure you ran the SQL setup script first!')) return;

    setIsMigrating(true);
    setStatus('Starting migration...');

    try {
      setStatus('Uploading general settings (Hero & Bio)...');

      const contentPayload = {
        id: '00000000-0000-0000-0000-000000000000',
        hero_images: data.heroImages,
        bio_de: data.bioData.DE,
        bio_en: data.bioData.EN,
        bio_sr: data.bioData.SR
      };

      const { error: contentError } = await supabase
        .from('portfolio_content')
        .upsert(contentPayload);

      if (contentError) throw new Error(`Content Error: ${contentError.message}`);

      setStatus('Uploading projects...');
      await supabase.from('projects').delete().neq('language', 'none');

      const allProjects: any[] = [];
      ['DE', 'EN', 'SR'].forEach(lang => {
        data.projectsData[lang as 'DE' | 'EN' | 'SR'].forEach((proj: any, index: number) => {
          allProjects.push({
            language: lang,
            title: proj.title,
            category: proj.category,
            description: proj.description,
            challenge: proj.challenge,
            solution: proj.solution,
            image: proj.image,
            size: proj.size,
            link: proj.link,
            roles: proj.roles || [],
            tools: proj.tools || [],
            sort_order: index
          });
        });
      });

      const { error: projError } = await supabase.from('projects').insert(allProjects);
      if (projError) throw new Error(`Projects Error: ${projError.message}`);

      setStatus('Uploading gallery images in smaller batches to avoid payload limits...');
      await supabase.from('gallery_images').delete().neq('src', 'none');

      const galleryPayload = data.galleryImages.map((img: any, index: number) => ({
        src: img.src,
        title: img.title || '',
        description: img.description || '',
        sort_order: index
      }));

      // Insert gallery images one by one or in small batches to avoid 413 Payload Too Large
      for (const galItem of galleryPayload) {
        const { error: galError } = await supabase.from('gallery_images').insert([galItem]);
        if (galError) throw new Error(`Gallery Error: ${galError.message}`);
      }

      setStatus('Migration complete! Refresh the page to see changes. If images are missing, they were too large even after compression.');
    } catch (error: any) {
      console.error(error);
      setStatus(`Error during migration: ${error.message}. Try reducing image sizes.`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-indigo-400">Database Synchronization</h2>
      </div>

      <div className="bg-indigo-950/30 border border-indigo-500/30 p-8 rounded-xl max-w-2xl space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Migrate Local to Cloud</h3>
          <p className="text-indigo-200/70 text-sm leading-relaxed">
            This action will take all the changes you've made in your browser so far (Projects, Biography, Gallery, Hero Images) and forcefully push them to your connected Supabase database.
          </p>
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-200 text-sm">
            <strong>Warning:</strong> Ensure you have executed the `supabase_setup.sql` script in your Supabase SQL Editor before running this, otherwise the tables won't exist. This will overwrite any existing data in the cloud tables.
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <button
            onClick={handleMigrate}
            disabled={isMigrating}
            className={`w-full py-4 rounded-lg flex items-center justify-center gap-3 uppercase tracking-widest font-bold transition-all ${isMigrating ? 'bg-indigo-500/50 cursor-not-allowed text-white/50' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
          >
            <Database size={20} />
            {isMigrating ? 'Syncing...' : 'Push Local Data to Supabase'}
          </button>

          {status && (
            <div className={`mt-4 p-3 rounded text-sm ${status.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
