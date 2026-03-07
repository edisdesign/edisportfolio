import React from "react";
import { motion } from "motion/react";
import { Mail, Linkedin, Instagram, Dribbble, ArrowRight } from "lucide-react";

interface ContactProps {
  language: string;
}

export const Contact = ({ language }: ContactProps) => {
  const translations = {
    DE: {
      title: "Kontakt",
      subtitle: "Haben Sie ein Projekt im Sinn?",
      desc: "Ich bin immer offen für neue Herausforderungen und spannende Projekte. Lassen Sie uns darüber sprechen, wie ich Ihnen helfen kann.",
      emailLabel: "Schreiben Sie mir",
      socialLabel: "Folgen Sie mir",
      cta: "Hallo sagen"
    },
    EN: {
      title: "Contact",
      subtitle: "Have a project in mind?",
      desc: "I am always open to new challenges and exciting projects. Let's talk about how I can help you.",
      emailLabel: "Email me",
      socialLabel: "Follow me",
      cta: "Say Hello"
    },
    SR: {
      title: "Kontakt",
      subtitle: "Imate projekat na umu?",
      desc: "Uvek sam otvoren za nove izazove i uzbudljive projekte. Hajde da razgovaramo o tome kako mogu da vam pomognem.",
      emailLabel: "Pišite mi",
      socialLabel: "Pratite me",
      cta: "Javite se"
    }
  };

  const t = translations[language as keyof typeof translations];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/edis-muminovic-geschaeftsfuehrer-nphochbau/", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/edi.muminovic/", label: "Instagram" }
  ];

  return (
    <section id="contact" className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    {t.subtitle}
                </h2>
                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                    {t.desc}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block"
            >
                <a 
                    href="mailto:hello@edis.design" 
                    className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-zinc-950 rounded-full text-lg font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                >
                    <span>{t.cta}</span>
                    <div className="w-8 h-8 bg-zinc-950 rounded-full flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-300">
                        <ArrowRight size={16} />
                    </div>
                </a>
            </motion.div>

            <div className="mt-20 flex flex-col items-center gap-6">
                <p className="text-zinc-500 text-sm uppercase tracking-widest">{t.socialLabel}</p>
                <div className="flex gap-6">
                    {socialLinks.map((social) => (
                        <a 
                            key={social.label}
                            href={social.href}
                            className="p-4 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800 hover:border-zinc-700"
                            aria-label={social.label}
                        >
                            <social.icon size={24} />
                        </a>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};
