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

      <div className="relative flex flex-col gap-8">
        {/* First Row - Moving Left */}
        <div className="flex overflow-hidden relative z-10">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: [0, -1035] }} // Adjust based on content width roughly
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20,
            }}
          >
            {[...skills, ...skills, ...skills].map((skill, index) => (
              <div
                key={`row1-${index}`}
                className="text-4xl md:text-6xl font-bold text-zinc-800 hover:text-indigo-500 transition-colors duration-300 cursor-default"
              >
                {skill}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second Row - Moving Right */}
        <div className="flex overflow-hidden relative z-10">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: [-1035, 0] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
          >
             {[...skills, ...skills, ...skills].reverse().map((skill, index) => (
              <div
                key={`row2-${index}`}
                className="text-4xl md:text-6xl font-bold text-zinc-800/50 hover:text-indigo-400/80 transition-colors duration-300 cursor-default"
                style={{ WebkitTextStroke: "1px rgba(161, 161, 170, 0.2)" }}
              >
                {skill}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient Overlays for smooth fade effect */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
};
