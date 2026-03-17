import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Layers, PenTool, Code2, Mail, Send, CheckCircle2 } from "lucide-react";
import pb from "../../lib/pocketbase";

interface ProjectDetailsProps {
    onClose: () => void;
    project: any;
    language: string;
}

export const ProjectModal = ({ onClose, project, language }: ProjectDetailsProps) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const labels = {
        DE: {
            role: "Meine Rolle",
            challenge: "Die Herausforderung",
            solution: "Die Lösung",
            visit: "Website besuchen",
            close: "Schließen",
            technologies: "Technologien & Tools",
            askTitle: "Fragen zu diesem Projekt?",
            askDesc: "Hinterlassen Sie Ihre E-Mail und Nachricht. Ich werde Ihnen antworten.",
            emailPlaceholder: "Ihre E-Mail",
            messagePlaceholder: "Ihre Nachricht...",
            send: "Nachricht senden",
            sent: "Nachricht gesendet!",
            error: "Fehler beim Senden"
        },
        EN: {
            role: "My Role",
            challenge: "The Challenge",
            solution: "The Solution",
            visit: "Visit Website",
            close: "Close",
            technologies: "Technologies & Tools",
            askTitle: "Questions about this project?",
            askDesc: "Leave your email and message. I will reply to you.",
            emailPlaceholder: "Your email address",
            messagePlaceholder: "Your message...",
            send: "Send Message",
            sent: "Message sent successfully!",
            error: "Failed to send message"
        },
        SR: {
            role: "Moja Uloga",
            challenge: "Izazov",
            solution: "Rešenje",
            visit: "Poseti Sajt",
            close: "Zatvori",
            technologies: "Tehnologije i Alati",
            askTitle: "Pitaj me o ovom projektu",
            askDesc: "Ostavi svoj email i poruku, a ja ću ti odgovoriti.",
            emailPlaceholder: "Tvoja email adresa",
            messagePlaceholder: "Tvoja poruka...",
            send: "Pošalji poruku",
            sent: "Poruka uspešno poslata!",
            error: "Greška pri slanju"
        }
    };

    const t = labels[language as keyof typeof labels];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !message) return;
        setStatus("submitting");

        try {
            await pb.collection('project_inquiries').create({
                project_id: project.id,
                sender_email: email,
                message: message
            });
            setStatus("success");
            setEmail("");
            setMessage("");

            // Reset success message after 3 seconds
            setTimeout(() => setStatus("idle"), 3000);
        } catch (err) {
            console.error("Failed to submit inquiry:", err);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    // Prevent scrolling when modal is open
    React.useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
                initial={{ y: 100, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 100, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-[70] bg-zinc-900 border border-zinc-800 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-zinc-950/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header Image */}
                <div className="relative h-64 md:h-96 w-full shrink-0">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                        <span className="text-indigo-400 font-medium tracking-wider uppercase mb-2 block text-sm md:text-base">
                            {project.category}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{project.title}</h2>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Main Content (Left 2 cols) */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <Layers size={20} className="text-indigo-500" />
                                {project.challenge_title || t.challenge}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-line">
                                {project.challenge}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <Code2 size={20} className="text-indigo-500" />
                                {project.solution_title || t.solution}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-line">
                                {project.solution}
                            </p>
                        </div>

                        {/* Inquiry Form */}
                        <div className="mt-12 p-6 md:p-8 bg-zinc-950/50 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3 relative z-10">
                                <Mail className="text-indigo-400" />
                                {t.askTitle}
                            </h3>
                            <p className="text-zinc-400 mb-6 relative z-10">{t.askDesc}</p>

                            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                <div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t.emailPlaceholder}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={t.messagePlaceholder}
                                        rows={3}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === "submitting" || status === "success"}
                                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all duration-300 ${status === "success"
                                            ? "bg-green-500 text-white"
                                            : status === "error"
                                                ? "bg-red-500 text-white"
                                                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                                        }`}
                                >
                                    {status === "submitting" && <span className="animate-pulse">...</span>}
                                    {status === "success" && <><CheckCircle2 size={20} /> {t.sent}</>}
                                    {status === "error" && <><X size={20} /> {t.error}</>}
                                    {status === "idle" && <><Send size={20} /> {t.send}</>}
                                </button>
                            </form>
                        </div>

                    </div>

                    {/* Sidebar (Right 1 col) */}
                    <div className="space-y-8">
                        {/* Role */}
                        <div className="bg-zinc-950/50 p-6 rounded-xl border border-zinc-800/50">
                            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <PenTool size={16} />
                                {t.role}
                            </h4>
                            <ul className="space-y-2">
                                {project.roles && project.roles.map((role: string, i: number) => (
                                    <li key={i} className="text-white font-medium flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                        {role}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Technologies */}
                        <div>
                            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">
                                {t.technologies}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {project.tools && project.tools.map((tool: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300 border border-zinc-700">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-white text-zinc-950 rounded-xl font-bold hover:bg-indigo-500 hover:text-white transition-all duration-300 group"
                            >
                                {t.visit}
                                <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        )}
                    </div>

                </div>
            </motion.div>
        </motion.div>
    );
};

