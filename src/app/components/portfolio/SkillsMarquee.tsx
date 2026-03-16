import React from "react";
import { motion } from "motion/react";

interface SkillsMarqueeProps {
  language: string;
}

const skills = [
  "Figma", "User Research", "Prototyping", "Wireframing", "Design Systems", 
  "UI Design", "Interaction Design", "Usability Testing", "Information Architecture", 
  "User Flows", "Workshop Facilitation", "Adobe CC", "Visual Design", "Strategy"
];

export const SkillsMarquee = ({ language }: SkillsMarqueeProps) => {
  const heading = {
    DE: "Expertise & Tools",
    EN: "Expertise & Tools",
    SR: "Ekspertiza & Alati"
  };

  return (
    <section className="py-20 bg-zinc-950 overflow-hidden relative border-b border-zinc-900/50">
      <div className="container mx-auto px-6 mb-12">
        <p className="text-zinc-500 text-sm uppercase tracking-widest text-center">
            {heading[language as keyof typeof heading]}
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Single Row - Moving Left */}
        <div className="flex overflow-hidden relative z-10 w-full py-4">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: [0, -1500] }} 
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
          >
            {[...skills, ...skills, ...skills, ...skills].map((skill, index) => (
              <div
                key={`skill-${index}`}
                className="text-5xl md:text-7xl font-bold text-zinc-800 hover:text-indigo-500 transition-colors duration-300 cursor-default flex items-center gap-12"
              >
                <span>{skill}</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500/30" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient Overlays for smooth fade effect */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
};
