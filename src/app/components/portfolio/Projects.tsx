import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ProjectModal } from "./ProjectModal";
import { usePortfolioData } from "../../context/PortfolioContext";

interface ProjectsProps {
  language: string;
}

const headings = {
  DE: "Ausgewählte Projekte",
  EN: "Selected Projects",
  SR: "Odabrani Projekti"
}

export const Projects = ({ language, onSelectProject }: ProjectsProps & { onSelectProject: (project: any) => void }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { data } = usePortfolioData();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "start 40%"]
  });

  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const projects = data.projectsData[language as keyof typeof data.projectsData] || [];
  const heading = headings[language as keyof typeof headings];

  return (
    <section ref={sectionRef} id="projects" className="py-24 bg-zinc-950 text-white relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{heading}</h2>
          <motion.div style={{ width }} className="h-1 bg-indigo-500 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectProject(project)}
              className={`group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer ${project.size === "large" ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"
                }`}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-indigo-400 text-sm font-medium tracking-wider uppercase mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">{project.title}</h3>
                    <p className="text-zinc-400 max-w-xl text-sm md:text-base line-clamp-2 md:line-clamp-none">
                      {project.description}
                    </p>
                  </div>

                  <div className="hidden md:block">
                    <button className="h-12 w-12 rounded-full bg-white text-zinc-950 flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <ArrowUpRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
