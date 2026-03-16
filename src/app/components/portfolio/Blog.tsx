import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, User, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { usePortfolioData, BlogPost } from "../../context/PortfolioContext";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "../ui/dialog";

interface BlogProps {
    language: string;
    onSelectPost: (post: BlogPost) => void;
}

export const Blog = ({ language, onSelectPost }: BlogProps) => {
    const { data } = usePortfolioData();
    // selectedPost state lifted to App.tsx

    const posts = data.blogPosts.filter(post => post.language === language) || [];

    const translations = {
        DE: { title: "Blog", readMore: "Weiterlesen", close: "Schließen", empty: "Noch keine Beiträge vorhanden." },
        EN: { title: "Insights", readMore: "Read More", close: "Close", empty: "No posts available yet." },
        SR: { title: "Blog", readMore: "Pročitaj više", close: "Zatvori", empty: "Još uvek nema objava." }
    };

    const t = translations[language as keyof typeof translations];

    return (
        <section id="blog" className="py-24 bg-zinc-950 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-white uppercase tracking-wider">{t.title}</h2>
                    <div className="h-1 w-12 bg-indigo-500 mt-2 rounded-full" />
                </motion.div>

                {posts.length === 0 ? (
                    <p className="text-zinc-500 italic">{t.empty}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => onSelectPost(post)}
                                className="group bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden cursor-pointer hover:border-zinc-700 transition-all hover:bg-zinc-800/50"
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img 
                                        src={post.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop"} 
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors uppercase tracking-tight line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-zinc-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <button className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group/btn">
                                        {t.readMore} 
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

        </section>
    );
};
