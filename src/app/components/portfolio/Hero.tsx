import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowDown,
  Mail,
  ArrowRight,
  Sparkles,
  Grid3X3,
  Layers,
  User,
  Palette,
} from "lucide-react";
import { usePortfolioData } from "../../context/PortfolioContext";

interface HeroProps {
  language: string;
}

export const Hero = ({ language }: HeroProps) => {
  const { data, isLoading } = usePortfolioData();
  const images = data.heroImages || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<
    number | null
  >(null);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-shuffle every 4 seconds
  useEffect(() => {
    if (isHovering || expandedIndex !== null || !images.length) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering, expandedIndex, images.length]);

  if (isLoading) return <div className="h-screen bg-black" />;

  const hasImages = images.length > 0 && images.some(img => img.src);

  const handleImageClick = (index: number) => {
    if (index === activeIndex) {
      setExpandedIndex(index);
    } else {
      setActiveIndex(index);
      setExpandedIndex(null);
    }
  };

  const getPosition = (index: number) => {
    if (index === activeIndex) return "center";
    if (index === (activeIndex + 1) % images.length)
      return "right";
    return "left";
  };

  const translations = {
    DE: {
      role: "Senior UX/UI Designer & Artist",
      title: "Digitale",
      titleHighlight: "Erlebnisse",
      subtitle: "die Emotionen wecken.",
      description:
        "Ich verbinde strategisches UX-Design mit künstlerischer Vision. Von komplexen Design-Systemen bis hin zu intuitiven Benutzeroberflächen – ich gestalte die Zukunft.",
      cta: "Meine Arbeiten",
      contact: "Schreib mir",
      status: "Verfügbar für neue Projekte",
      vibe: "Creative Mind",
    },
    EN: {
      role: "Senior UX/UI Designer & Artist",
      title: "Digital",
      titleHighlight: "Experiences",
      subtitle: "that spark emotion.",
      description:
        "Bridging strategic UX design with artistic vision. From complex design systems to intuitive user interfaces – crafting the future.",
      cta: "My Works",
      contact: "Write me",
      status: "Available for new projects",
      vibe: "Creative Mind",
    },
    SR: {
      role: "Senior UX/UI Dizajner & Umetnik",
      title: "Digitalna",
      titleHighlight: "Iskustva",
      subtitle: "koja bude emocije.",
      description:
        "Spajam strateški UX dizajn sa umetničkom vizijom. Od kompleksnih dizajn sistema do intuitivnih interfejsa – kreiram budućnost.",
      cta: "Moji Radovi",
      contact: "Piši mi",
      status: "Dostupan za nove projekte",
      vibe: "Kreativni Um",
    },
  };

  const t = translations[language as keyof typeof translations];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-zinc-950 pt-20 lg:pt-0"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px]" />

        {/* Global Grid Overlay for Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b9811a] border border-[#10b98133] text-[#34d399] text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              {data.statusData?.[language as 'DE' | 'EN' | 'SR'] || t.status}
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter mb-6 leading-[1.1]">
              {t.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                {t.titleHighlight}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 font-light mb-8 max-w-xl leading-relaxed">
              {t.subtitle}
              <br />
              <span className="text-lg text-zinc-500 mt-4 block">
                {t.description}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection("contact")}
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-zinc-950 transition-all duration-300 hover:bg-zinc-200 hover:scale-105"
              >
                <Mail className="mr-2 h-5 w-5" />
                <span>{t.contact}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => scrollToSection("projects")}
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full border border-zinc-800 bg-zinc-900/50 px-8 font-medium text-white transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-700 backdrop-blur-sm"
              >
                <span>{t.cta}</span>
                <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
              </button>
            </div>
          </motion.div>

          {/* Right Side: Visual Carousel */}
          <div
            className="relative flex items-center justify-center h-[400px] md:h-[500px] lg:h-[600px] perspective-[1000px] mt-12 lg:mt-0"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {images.map((img, index) => {
                const position = getPosition(index);
                const isCenter = position === "center";
                const isExpanded =
                  isCenter && expandedIndex === index;

                return (
                  <motion.div
                    key={index}
                    onClick={() => handleImageClick(index)}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 50) {
                        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
                      } else if (info.offset.x < -50) {
                        setActiveIndex((prev) => (prev + 1) % images.length);
                      }
                      setExpandedIndex(null);
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    className={`absolute h-[320px] md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-[#ffffff1a] bg-[#18181b] ${isCenter ? "z-30" : "z-10"
                      }`}
                    initial={false}
                    animate={{
                      width: isExpanded ? (window.innerWidth > 1024 ? 800 : 320) : (window.innerWidth > 1024 ? 400 : 260),
                      scale: isCenter ? 1 : 0.75,
                      x: isCenter
                        ? 0
                        : position === "right"
                          ? (window.innerWidth > 1024 ? 220 : 100)
                          : (window.innerWidth > 1024 ? -220 : -100),
                      opacity: isCenter ? 1 : 0.3,
                      rotateY: isCenter
                        ? 0
                        : position === "right"
                          ? -30
                          : 30,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <div className="relative w-full h-full touch-none">
                      {img.src ? (
                        <motion.img
                          src={img.src}
                          alt={img.label || "Carousel Item"}
                          className="w-full h-full object-cover pointer-events-none"
                          animate={{ scale: isExpanded ? 1 : 1.15 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 500%22><rect fill=%22%2318181b%22 width=%22400%22 height=%22500%22/></svg>'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                          <Layers className="w-12 h-12 text-zinc-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 pointer-events-none" />

                      {/* Label Badge */}
                      <div className="absolute bottom-6 left-6 pointer-events-none">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10">
                          {index % 2 === 0 ? (
                            <User className="w-3 h-3 text-indigo-400" />
                          ) : (
                            <Palette className="w-3 h-3 text-purple-400" />
                          )}
                          <span className="text-[10px] font-medium text-white">
                            {img.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-[60px] md:blur-[100px] -z-10 rounded-full pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-0 hidden md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#71717a] to-transparent" />
      </motion.div>
    </section>
  );
};