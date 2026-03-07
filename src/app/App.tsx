import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./components/portfolio/Navbar";
import { Hero } from "./components/portfolio/Hero";
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

export default function App() {
  const [language, setLanguage] = useState("DE");
  const [showIntro, setShowIntro] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  if (isAdmin) {
    return <AdminDashboard onLogout={() => setIsAdmin(false)} />;
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
          <SkillsMarquee language={language} />
          <Projects language={language} onSelectProject={setSelectedProject} />
          <UXGame language={language} />
          <About language={language} />
          <Contact language={language} />
          <Footer language={language} setIsAdmin={setIsAdmin} />
        </motion.div>
      </div>
    </main>
  );
}
