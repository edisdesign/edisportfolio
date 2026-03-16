import React, { useState } from "react";
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
import pb from "./lib/pocketbase";

export default function App() {
  const [language, setLanguage] = useState("DE");
  const [showIntro, setShowIntro] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // When admin logs in from Footer, both become true
  if (isAdmin && showAdminPanel) {
    return <AdminDashboard
      onLogout={() => { setIsAdmin(false); setShowAdminPanel(false); }}
      onClose={() => setShowAdminPanel(false)}
    />;
  }

  return (
    <main className="bg-zinc-950 min-h-screen text-white selection:bg-indigo-500/30 cursor-none relative">
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

        {!showIntro && <CustomCursor />}

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
          <Blog language={language} />
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
  );
}
