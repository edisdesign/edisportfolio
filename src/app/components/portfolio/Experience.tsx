import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePortfolioData } from "../../context/PortfolioContext";

interface ExperienceProps {
  language: string;
}

export const Experience = ({ language }: ExperienceProps) => {
  const { data, isLoading } = usePortfolioData();
  const timelineData = data.experienceData?.[language as 'DE' | 'EN' | 'SR'] || [];
  
  const containerRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <div className="py-24 bg-zinc-950 min-h-[300px]" />;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const translations = {
    DE: { title: "Erfahrung & Werdegang" },
    EN: { title: "Experience & Journey" },
    SR: { title: "Iskustvo & Karijera" }
  };

  const t = translations[language as keyof typeof translations];

  if (timelineData.length === 0) return null;

  return (
    <section id="experience" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            {t.title}
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line Background */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2" />
          
          {/* Animated Vertical Line */}
          <motion.div 
            className="absolute left-[20px] md:left-1/2 top-0 w-[2px] bg-indigo-500 -translate-x-1/2 origin-top"
            style={{ height: lineHeight }}
          />

          <div className="space-y-12">
            {timelineData.map((item: any, index: number) => {
              const isEven = index % 2 === 0;

              return (
                <div key={item.id} className="relative flex md:justify-between items-center w-full">
                  
                  {/* Center Node */}
                  <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-zinc-950 border-2 border-indigo-500 -translate-x-1/2 z-20 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>

                  {/* Left Content (Empty on Mobile) */}
                  <div className={`hidden md:block w-5/12 ${isEven ? 'text-right pr-12' : 'col-start-2 pl-12 opacity-0'}`}>
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
                      >
                        <div className="text-indigo-400 font-bold mb-1">{item.year}</div>
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <div className="text-white/60 mb-3">{item.company}</div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Content */}
                  <div className={`w-full pl-16 md:w-5/12 md:pl-0 ${isEven ? 'md:col-start-2 md:pl-12 md:opacity-0 hidden md:block' : 'md:text-left md:pl-12'}`}>
                    {(!isEven || true) && (
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? 0 : 30, y: isEven ? 30 : 0 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm ${isEven ? 'md:hidden' : ''}`}
                      >
                        <div className="text-indigo-400 font-bold mb-1">{item.year}</div>
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <div className="text-white/60 mb-3">{item.company}</div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                      </motion.div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
};
