import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./components/portfolio/Navbar";
import { Hero } from "./components/portfolio/Hero";
import { Process } from "./components/portfolio/Process";
import { Experience } from "./components/portfolio/Experience";
import { SkillsMarquee } from "./components/portfolio/SkillsMarquee";
import { Projects } from "./components/portfolio/Projects";
import { UXGame } from "./components/portfolio/UXGame";
import { About } from "./components/portfolio/About";
import { Contact } from "./components/portfolio/Contact";
import { Footer } from "./components/portfolio/Footer";
import { CustomCursor } from "./components/portfolio/CustomCursor";
import { ChaosIntro } from "./components/portfolio/ChaosIntro";
import { ProjectModal } from "./components/portfolio/ProjectModal";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { Blog } from "./components/portfolio/Blog";
import { BlogPost, usePortfolioData } from "./context/PortfolioContext";
import { Calendar, User, X } from "lucide-react";
import pb from "./lib/pocketbase";

// Basic error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, errorInfo: any) { console.error("App Crash:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8 text-center text-white">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
            <p className="text-zinc-500 text-sm mb-6 font-mono bg-black/50 p-4 rounded border border-white/10 break-all">
              {this.state.error?.toString() || "Unknown error"}
            </p>
            <button onClick={() => {
              localStorage.removeItem("portfolioData");
              window.location.reload();
            }} className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors">
              Reset & Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [language, setLanguage] = useState("DE");
  const [showIntro, setShowIntro] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Safety timeout for intro - force it to end after 5 seconds no matter what
  React.useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // When admin logs in from Footer, both become true
  if (isAdmin && showAdminPanel) {
    return <AdminDashboard
      onLogout={() => { setIsAdmin(false); setShowAdminPanel(false); }}
      onClose={() => setShowAdminPanel(false)}
    />;
  }

  return (
    <ErrorBoundary>
      <main className={`bg-zinc-950 min-h-screen text-white selection:bg-indigo-500/30 relative ${!isMobile ? 'cursor-none' : ''}`} style={{ backgroundColor: '#09090b' }}>
        <div className="overflow-x-hidden w-full min-h-screen relative">
        <AnimatePresence mode="wait">
          {showIntro && (
            <ChaosIntro onComplete={() => setShowIntro(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              onClose={() => setSelectedProject(null)}
              project={selectedProject}
              language={language}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPost(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="sticky top-0 z-10 p-6 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Blog Post Detail</h4>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="overflow-y-auto overflow-x-hidden p-6 md:p-12">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-800 shadow-xl">
                      <img
                        src={selectedPost.image}
                        alt={selectedPost.title}
                        className="w-full h-auto object-cover max-h-[400px]"
                      />
                    </div>
                    <div className="flex items-center gap-6 text-[10px] text-zinc-500 uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-indigo-500" /> {new Date(selectedPost.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><User size={14} className="text-indigo-500" /> {selectedPost.author}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 uppercase tracking-tighter leading-none">
                      {selectedPost.title}
                    </h2>
                    <div className="prose prose-invert prose-indigo max-w-none">
                      <div className="text-zinc-300 leading-relaxed space-y-6 text-lg">
                        {selectedPost.content.split('\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {!showIntro && !isMobile && <CustomCursor />}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: !showIntro ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Navbar language={language} setLanguage={setLanguage} />
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{
            opacity: !showIntro ? 1 : 0,
            scale: !showIntro ? 1 : 0.9,
            filter: !showIntro ? "blur(0px)" : "blur(10px)"
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <Hero language={language} />
          <Process language={language} />
          <Experience language={language} />
          <SkillsMarquee language={language} />
          <Projects language={language} onSelectProject={setSelectedProject} />
          <UXGame language={language} />
          <Blog language={language} onSelectPost={setSelectedPost} />
          <About language={language} />
          <Contact language={language} />
          <Footer
            language={language}
            isAdmin={isAdmin}
            setIsAdmin={(status) => { setIsAdmin(status); setShowAdminPanel(status); }}
            onOpenAdmin={() => setShowAdminPanel(true)}
          />
        </motion.div>
      </div>
    </main>
    </ErrorBoundary>
  );
}
