import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ArrowUpRight, Figma, PenTool, Layers, Globe, Star, Palette, Camera, Brush, X, Info, Heart, MessageSquare, Send } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from "../ui/dialog";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { usePortfolioData, GalleryImage } from "../../context/PortfolioContext";
import { supabase } from "../../lib/supabase";

interface AboutProps {
    language: string;
}

export const About = ({ language }: AboutProps) => {
    const { data } = usePortfolioData();
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [newCommentName, setNewCommentName] = useState("");
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        if (selectedImage?.id) {
            const fetchComments = async () => {
                const { data } = await supabase
                    .from('gallery_comments')
                    .select('*')
                    .eq('image_id', selectedImage.id)
                    .order('created_at', { ascending: true });
                if (data) setComments(data);
            };
            fetchComments();
        } else {
            setComments([]);
            setNewComment("");
        }
    }, [selectedImage?.id]);

    const handleLike = async () => {
        if (!selectedImage || isLiking || !selectedImage.id) return;
        setIsLiking(true);
        try {
            const newLikesCount = (selectedImage.likes_count || 0) + 1;
            const { error } = await supabase
                .from('gallery_images')
                .update({ likes_count: newLikesCount })
                .eq('id', selectedImage.id);

            if (!error) {
                setSelectedImage(prev => prev ? { ...prev, likes_count: newLikesCount } : null);
            }
        } finally {
            setIsLiking(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedImage || !selectedImage.id || !newComment.trim() || !newCommentName.trim()) return;

        try {
            const { data, error } = await supabase
                .from('gallery_comments')
                .insert([
                    { image_id: selectedImage.id, author_name: newCommentName, content: newComment }
                ])
                .select();

            if (!error && data) {
                setComments(prev => [...prev, data[0]]);
                setNewComment("");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const translations = {
        DE: {
            title: "Über mich",
            name: "Edis Muminović",
            role: data.bioData.DE.role,
            bio: data.bioData.DE.bio,
            experience: "Jahre Erfahrung",
            projects: "Erfolgreiche Projekte",
            clients: "Zufriedene Kunden",
            location: "Basiert in",
            city: "Bad Soden am Taunus, DE",
            currently: "Aktueller Fokus",
            focus: "Design Systeme & Micro-Interactions",
            stack: "Tech Stack",
            philosophy: "Design Philosophie",
            philosophyText: "Klarheit über Komplexität.",
            connect: "Lass uns zusammenarbeiten",
            galleryTitle: "Meine Kunst",
            gallerySubtitle: "Öl auf Leinwand"
        },
        EN: {
            title: "About Me",
            name: "Edis Muminović",
            role: data.bioData.EN.role,
            bio: data.bioData.EN.bio,
            experience: "Years Experience",
            projects: "Successful Projects",
            clients: "Happy Clients",
            location: "Based in",
            city: "Bad Soden am Taunus, DE",
            currently: "Currently Focusing On",
            focus: "Design Systems & Micro-Interactions",
            stack: "Tech Stack",
            philosophy: "Design Philosophy",
            philosophyText: "Clarity over complexity.",
            connect: "Let's work together",
            galleryTitle: "My Art",
            gallerySubtitle: "Oil on Canvas"
        },
        SR: {
            title: "O meni",
            name: "Edis Muminović",
            role: data.bioData.SR.role,
            bio: data.bioData.SR.bio,
            experience: "Godina Iskustva",
            projects: "Uspešnih Projekata",
            clients: "Zadovoljnih Klijenata",
            location: "Lokacija",
            city: "Bad Soden am Taunus, DE",
            currently: "Trenutni Fokus",
            focus: "Dizajn Sistemi & Mikro-interakcije",
            stack: "Tehnologije",
            philosophy: "Filozofija Dizajna",
            philosophyText: "Jasnoća ispred kompleksnosti.",
            connect: "Hajde da sarađujemo",
            galleryTitle: "Moja Umetnost",
            gallerySubtitle: "Ulje na platnu"
        }
    };

    const t = translations[language as keyof typeof translations];

    const galleryImages = data.galleryImages || [];

    const gridItems = [
        // 1. BIO CARD (Large)
        {
            id: "bio",
            className: "col-span-1 md:col-span-2 row-span-2 bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-colors",
            content: (
                <>
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity flex gap-2">
                        <Palette size={40} className="text-indigo-500" />
                        <Camera size={40} className="text-pink-500" />
                    </div>
                    <div>
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700 mb-6">
                            <img
                                src={data.heroImages[0]?.src || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60"}
                                alt="Edis"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">{t.name}</h3>
                        <p className="text-indigo-400 font-medium mb-4">{t.role}</p>
                        <p className="text-zinc-400 leading-relaxed max-w-md">
                            {t.bio}
                        </p>
                    </div>
                    <div className="mt-8">
                        <a href="#contact" className="inline-flex items-center gap-2 text-white font-semibold group-hover:text-indigo-400 transition-colors">
                            {t.connect} <ArrowUpRight size={18} />
                        </a>
                    </div>
                </>
            )
        },
        // 2. STATS (Small)
        {
            id: "stats1",
            className: "bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-center hover:bg-zinc-800/50 transition-colors",
            content: (
                <>
                    <h4 className="text-4xl font-bold text-white mb-1">10+</h4>
                    <p className="text-zinc-500 text-sm">{t.experience}</p>
                </>
            )
        },
        // 3. STATS (Small)
        {
            id: "stats2",
            className: "bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-center hover:bg-zinc-800/50 transition-colors",
            content: (
                <>
                    <h4 className="text-4xl font-bold text-white mb-1">80+</h4>
                    <p className="text-zinc-500 text-sm">{t.projects}</p>
                </>
            )
        },
        // 4. TECH STACK (Wide)
        {
            id: "stack",
            className: "col-span-1 md:col-span-2 bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-center relative overflow-hidden group",
            content: (
                <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-zinc-500 text-sm mb-3 uppercase tracking-wider">{t.stack}</p>
                            <div className="flex gap-4 text-zinc-300">
                                <Figma size={24} className="hover:text-pink-500 transition-colors" />
                                <PenTool size={24} className="hover:text-blue-500 transition-colors" />
                                <Layers size={24} className="hover:text-yellow-500 transition-colors" />
                                <Globe size={24} className="hover:text-green-500 transition-colors" />
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-zinc-400 text-xs">Figma • Adobe • Protopie • Webflow</p>
                        </div>
                    </div>
                </>
            )
        },
        // 5. LOCATION (Small)
        {
            id: "location",
            className: "bg-zinc-950 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden",
            content: (
                <>
                    {/* Decorative Map BG - Germany/Frankfurt Area */}
                    <div className="absolute inset-0 opacity-20 grayscale bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/8.5,50.1,11,0/300x300')] bg-cover bg-center" />

                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mb-4 text-white">
                            <MapPin size={20} />
                        </div>
                        <p className="text-zinc-500 text-xs uppercase mb-1">{t.location}</p>
                        <p className="text-white font-medium text-sm">{t.city}</p>
                    </div>
                </>
            )
        },
        // 6. PHILOSOPHY (Medium)
        {
            id: "focus",
            className: "md:col-span-1 bg-gradient-to-br from-indigo-900/20 to-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-center text-center hover:scale-[1.02] transition-transform",
            content: (
                <>
                    <Star className="text-yellow-500 mx-auto mb-4" fill="currentColor" size={24} />
                    <p className="text-zinc-400 text-xs uppercase mb-2">{t.philosophy}</p>
                    <p className="text-white font-serif italic text-lg">"{t.philosophyText}"</p>
                </>
            )
        },
        // 7. ART GALLERY PORTAL (Wide)
        {
            id: "gallery",
            className: "col-span-1 md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden group cursor-pointer p-0",
            content: (
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="w-full h-full flex items-center justify-center p-6 relative min-h-[200px]">
                            {/* Background Image with Blur */}
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-all duration-700 blur-sm group-hover:blur-0 scale-100 group-hover:scale-110"
                                style={{ backgroundImage: `url(${galleryImages[0]?.src})` }}
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />

                            <div className="relative z-10 text-center transform group-hover:translate-y-[-5px] transition-transform duration-500">
                                <Brush className="mx-auto mb-3 text-white drop-shadow-lg opacity-80 group-hover:opacity-100 transition-opacity" size={32} />
                                <h3 className="text-2xl font-serif font-bold text-white drop-shadow-md mb-1">{t.galleryTitle}</h3>
                                <p className="text-zinc-200 text-sm font-medium tracking-[0.2em] uppercase drop-shadow-md border-b border-white/30 inline-block pb-1">{t.gallerySubtitle}</p>
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl bg-zinc-950/95 border-zinc-800 backdrop-blur-xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                        <DialogTitle className="sr-only">{t.galleryTitle}</DialogTitle>
                        <DialogDescription className="sr-only">A collection of oil paintings created by Edis Muminović.</DialogDescription>

                        <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
                            <div>
                                <h2 className="text-2xl font-serif text-white">{t.galleryTitle}</h2>
                                <p className="text-zinc-400 text-sm">{t.gallerySubtitle}</p>
                            </div>
                            <DialogClose className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20">
                                <X size={24} />
                                <span className="sr-only">Close</span>
                            </DialogClose>
                        </div>

                        <div className="p-6 md:p-8">
                            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                                <Masonry gutter="24px">
                                    {galleryImages.map((img, i) => (
                                        <motion.div
                                            key={img.id || i}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1, duration: 0.5 }}
                                            className="group flex flex-col gap-3 cursor-pointer"
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <div className="relative overflow-hidden rounded-lg">
                                                <img
                                                    src={img.src}
                                                    alt={img.title || `Artwork ${i + 1}`}
                                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                            </div>
                                            <div className="px-2 pb-2 text-left bg-black/40 pt-2 backdrop-blur-sm group-hover:bg-black/80 transition-colors absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 duration-300">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        {img.title && <h4 className="text-white font-serif text-sm leading-tight transition-colors">{img.title}</h4>}
                                                        {img.description && <p className="text-zinc-400 text-[10px] mt-0.5 line-clamp-1">{img.description}</p>}
                                                    </div>
                                                    {(img.likes_count !== undefined && img.likes_count > 0) && (
                                                        <div className="flex items-center gap-1 text-red-400 text-[10px]">
                                                            <Heart size={12} className="fill-red-400" /> {img.likes_count}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </Masonry>
                            </ResponsiveMasonry>
                        </div>

                        {/* Lightbox / Selected Image View */}
                        <AnimatePresence>
                            {selectedImage && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-black/95 flex flex-col md:flex-row backdrop-blur-xl transition-all"
                                >
                                    <button
                                        className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                        onClick={() => setSelectedImage(null)}
                                    >
                                        <X size={24} />
                                    </button>

                                    <div className="flex-1 p-4 md:p-8 flex items-center justify-center relative min-h-[50vh] bg-black/50">
                                        <img
                                            src={selectedImage.src}
                                            alt={selectedImage.title}
                                            className="max-w-full max-h-[70vh] md:max-h-[85vh] w-auto h-auto object-contain rounded drop-shadow-2xl"
                                        />
                                    </div>

                                    {selectedImage && (
                                        <div className="w-full md:w-96 bg-zinc-950 flex flex-col border-l border-white/10 text-left h-[60vh] md:h-auto md:max-h-[90vh]">
                                            {/* Details Header */}
                                            <div className="p-6 border-b border-zinc-800 shrink-0 bg-zinc-900/30">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        {selectedImage.title ? (
                                                            <h3 className="text-2xl font-serif text-white leading-tight">{selectedImage.title}</h3>
                                                        ) : (
                                                            <h3 className="text-xl font-serif text-zinc-500 italic leading-tight">Untitled Artwork</h3>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={handleLike}
                                                        disabled={isLiking}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5 active:scale-95 group shrink-0"
                                                    >
                                                        <Heart size={16} className={`group-hover:fill-red-400 transition-all ${selectedImage.likes_count && selectedImage.likes_count > 0 ? 'fill-red-400 text-red-400' : ''}`} />
                                                        <span className="text-sm font-bold w-4 text-center">{selectedImage.likes_count || 0}</span>
                                                    </button>
                                                </div>
                                                {selectedImage.description && (
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Technique / Details</p>
                                                        <p className="text-zinc-300 text-sm">{selectedImage.description}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Comments List */}
                                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-zinc-950">
                                                <div className="flex items-center gap-2 text-zinc-400 mb-4 pb-2 border-b border-white/5">
                                                    <MessageSquare size={14} />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Comments ({comments.length})</span>
                                                </div>

                                                {comments.length === 0 ? (
                                                    <p className="text-zinc-600 text-sm italic text-center py-8">No comments yet. Be the first to share your thoughts!</p>
                                                ) : (
                                                    comments.map(comment => (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={comment.id} className="bg-zinc-900 p-3 rounded-lg border border-white/5">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-bold text-indigo-300 text-xs">{comment.author_name}</span>
                                                                <span className="text-[10px] text-zinc-600">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-zinc-300 text-sm leading-relaxed">{comment.content}</p>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>

                                            {/* Add Comment Form */}
                                            <div className="p-4 border-t border-zinc-800 shrink-0 bg-zinc-950">
                                                <form onSubmit={handleAddComment} className="flex flex-col gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Your name"
                                                        value={newCommentName}
                                                        onChange={(e) => setNewCommentName(e.target.value)}
                                                        className="w-full bg-zinc-900 border border-white/10 rounded px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                                        required
                                                    />
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Add a comment..."
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                            className="flex-1 bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                                            required
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={!newCommentName.trim() || !newComment.trim()}
                                                        >
                                                            <Send size={16} />
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </DialogContent>
                </Dialog>
            )
        }
    ];

    return (
        <section id="about" className="py-24 bg-zinc-950 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-white">{t.title}</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
                    {gridItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={item.className}
                        >
                            {item.content}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
