import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe } from "lucide-react";

interface NavbarProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export const Navbar = ({ language, setLanguage }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Safety check: Ensure scrolling is enabled when the app mounts/refreshes
    // This fixes cases where a crash might have left the body with overflow: hidden
    document.body.style.overflow = "unset";

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const translations = {
    DE: {
      projects: "Projekte",
      about: "Über mich",
      contact: "Kontakt",
    },
    EN: {
      projects: "Projects",
      about: "About",
      contact: "Contact",
    },
    SR: {
      projects: "Projekti",
      about: "O meni",
      contact: "Kontakt",
    },
  };

  const t = translations[language as keyof typeof translations];

  const navLinks = [
    { name: t.projects, id: "projects" },
    { name: t.about, id: "about" },
    { name: t.contact, id: "contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div 
            className="text-2xl font-bold text-white cursor-pointer tracking-tighter"
            onClick={() => scrollToSection("hero")}
          >
            Edi Portfolio<span className="text-indigo-500">.</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <motion.button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  whileHover={{ scale: 1.1, color: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  className="text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-widest font-medium"
                >
                  {link.name}
                </motion.button>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 pl-8 border-l border-zinc-800">
                <Globe size={14} className="text-zinc-500" />
                <div className="flex bg-zinc-900/50 rounded-full p-1 border border-zinc-800">
                    {["DE", "EN", "SR"].map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        language === lang 
                            ? "bg-zinc-800 text-white shadow-sm" 
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        {lang}
                    </button>
                    ))}
                </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-zinc-950 pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className="text-2xl font-bold text-white text-left"
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-8 border-t border-zinc-900">
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Jezik / Sprache / Language</p>
                  <div className="flex gap-4">
                    {["DE", "EN", "SR"].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                            language === lang 
                                ? "bg-white text-zinc-950 border-white" 
                                : "text-zinc-400 border-zinc-800"
                            }`}
                        >
                            {lang}
                        </button>
                        ))}
                  </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
