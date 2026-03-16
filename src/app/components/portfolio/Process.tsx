import React from "react";
import { motion } from "motion/react";
import { Compass, Lightbulb, Rocket } from "lucide-react";

interface ProcessProps {
  language: string;
}

export const Process = ({ language }: ProcessProps) => {
  const translations = {
    DE: {
      title: "Der Design-Prozess",
      subtitle: "Von der Vision zum Produkt",
      steps: [
        {
          id: 1,
          icon: <Compass size={32} className="text-indigo-400" />,
          title: "Discover",
          desc: "Forschung, Strategie & Wireframing. Die Basis für den Erfolg."
        },
        {
          id: 2,
          icon: <Lightbulb size={32} className="text-purple-400" />,
          title: "Define",
          desc: "UX Architektur, Design Systeme & Prototyping."
        },
        {
          id: 3,
          icon: <Rocket size={32} className="text-emerald-400" />,
          title: "Deliver",
          desc: "High-Fidelity UI, Animationen & Development Handoff."
        }
      ]
    },
    EN: {
      title: "The Design Process",
      subtitle: "From Vision to Product",
      steps: [
        {
          id: 1,
          icon: <Compass size={32} className="text-indigo-400" />,
          title: "Discover",
          desc: "Research, Strategy & Wireframing. The foundation of success."
        },
        {
          id: 2,
          icon: <Lightbulb size={32} className="text-purple-400" />,
          title: "Define",
          desc: "UX Architecture, Design Systems & Prototyping."
        },
        {
          id: 3,
          icon: <Rocket size={32} className="text-emerald-400" />,
          title: "Deliver",
          desc: "High-Fidelity UI, Animations & Development Handoff."
        }
      ]
    },
    SR: {
      title: "Proces Dizajna",
      subtitle: "Od Vizije do Proizvoda",
      steps: [
        {
          id: 1,
          icon: <Compass size={32} className="text-indigo-400" />,
          title: "Discover (Istraživanje)",
          desc: "Istraživanje korisnika, strategija i wireframing."
        },
        {
          id: 2,
          icon: <Lightbulb size={32} className="text-purple-400" />,
          title: "Define (Definisanje)",
          desc: "UX arhitektura, kreiranje Design Systema i prototipova."
        },
        {
          id: 3,
          icon: <Rocket size={32} className="text-emerald-400" />,
          title: "Deliver (Isporuka)",
          desc: "High-Fidelity UI, animacije i predaja za development."
        }
      ]
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <section id="process" className="py-24 bg-zinc-950 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            {t.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg"
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {t.steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:bg-zinc-800/50 transition-colors group cursor-default"
            >
              <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <div className="text-zinc-600 font-serif text-5xl opacity-20 absolute top-6 right-6 font-bold">
                0{step.id}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
};
