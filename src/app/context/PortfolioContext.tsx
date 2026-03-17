import React, { createContext, useContext, useState, useEffect } from "react";
import { defaultHeroImages, defaultProjectsData, defaultGalleryImages, defaultBioData, defaultStatusData, defaultExperienceData } from "../data/defaultData";

export interface Project {
    id: string | number;
    title: string;
    category: string;
    description: string;
    challenge: string;
    challenge_title?: string;
    solution: string;
    solution_title?: string;
    roles: string[];
    tools: string[];
    image: string;
    size: string;
    link: string;
}

export interface HeroImage {
    id: string;
    src: string;
    type: string;
    label: string;
}

export interface GalleryImage {
    id: string;
    src: string;
    title?: string;
    description?: string;
    likes_count?: number;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    date: string;
    author: string;
    language: 'DE' | 'EN' | 'SR';
}

export interface PortfolioData {
    heroImages: HeroImage[];
    projectsData: {
        DE: Project[];
        EN: Project[];
        SR: Project[];
    };
    galleryImages: GalleryImage[];
    bioData: {
        DE: { role: string; bio: string };
        EN: { role: string; bio: string };
        SR: { role: string; bio: string };
    };
    statusData: {
        DE: string;
        EN: string;
        SR: string;
    };
    experienceData: {
        DE: any[];
        EN: any[];
        SR: any[];
    };
    blogPosts: BlogPost[];
    avatar_url: string;
}

interface PortfolioContextType {
    data: PortfolioData;
    updateData: (newData: Partial<PortfolioData>) => void;
    isLoading: boolean;
    refreshData: () => Promise<void>;
}

const defaultData: PortfolioData = {
    heroImages: defaultHeroImages,
    projectsData: defaultProjectsData,
    galleryImages: defaultGalleryImages,
    bioData: defaultBioData,
    statusData: defaultStatusData,
    experienceData: defaultExperienceData,
    blogPosts: [],
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
};

const PortfolioContext = createContext<PortfolioContextType>({
    data: defaultData,
    updateData: () => { },
    isLoading: true,
    refreshData: async () => { },
});

import pb from "../lib/pocketbase";

// Helper: get file URL from PocketBase record
const getFileUrl = (record: any, filename: any): string => {
    if (!filename) return "";
    const name = Array.isArray(filename) ? filename[0] : filename;
    if (!name || typeof name !== 'string') return "";
    if (name.startsWith('http')) return name;
    return pb.files.getURL(record, name);
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<PortfolioData>(defaultData);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPocketBaseData = async () => {
        try {
            // 1. Portfolio Content (bio, status, avatar)
            const content = await pb.collection('portfolio_content').getList(1, 1).then(res => res.items[0]).catch(() => null);

            // 2. Hero Images — now a dedicated collection with file uploads
            const heroRecords = await pb.collection('hero_images').getList(1, 100, { sort: 'sort_order' }).then(res => res.items).catch(() => []);

            // 3. Projects
            const projects = await pb.collection('projects').getList(1, 100, { sort: 'sort_order' }).then(res => res.items).catch(() => []);

            // 4. Gallery
            const gallery = await pb.collection('gallery_images').getList(1, 200, { sort: 'sort_order' }).then(res => res.items).catch(() => []);

            // 5. Blog
            const blog = await pb.collection('blog_posts').getList(1, 100, { sort: '-date' }).then(res => res.items).catch(() => []);

            // 6. Experience Timeline
            const timeline = await pb.collection('experience_timeline').getList(1, 100, { sort: 'sort_order' }).then(res => res.items).catch(() => []);

            const hasData = content || heroRecords.length > 0 || projects.length > 0 || gallery.length > 0 || blog.length > 0 || timeline.length > 0;

            if (hasData) {
                // Format hero images — use PocketBase file URL
                const formattedHeroImages: HeroImage[] = heroRecords.map((rec: any, i: number) => ({
                    id: rec.id,
                    src: rec.image ? getFileUrl(rec, rec.image) : (rec.src || ""),
                    type: rec.type || "image",
                    label: rec.label || ""
                }));

                // Format projects — use file URL if available, fall back to image text field
                const formattedProjects = { DE: [] as any[], EN: [] as any[], SR: [] as any[] };
                projects.forEach((p: any) => {
                    const lang = p.language as 'DE' | 'EN' | 'SR';
                    if (formattedProjects[lang]) {
                        formattedProjects[lang].push({
                            ...p,
                            image: p.image_file ? getFileUrl(p, p.image_file) : (p.image || "")
                        });
                    }
                });

                // Format gallery — use file URL if available, fall back to src text field
                const formattedGallery: GalleryImage[] = gallery.map((img: any) => ({
                    id: img.id,
                    src: img.image ? getFileUrl(img, img.image) : (img.src || ""),
                    title: img.title || "",
                    description: img.description || "",
                    likes_count: img.likes_count || 0
                }));

                // Format timeline
                const formattedTimeline = { DE: [] as any[], EN: [] as any[], SR: [] as any[] };
                timeline.forEach((t: any) => {
                    const lang = t.language as 'DE' | 'EN' | 'SR';
                    if (formattedTimeline[lang]) {
                        formattedTimeline[lang].push(t);
                    }
                });
                
                const formattedBlog: BlogPost[] = blog.map((p: any) => {
                    return {
                        id: p.id,
                        title: p.title || "",
                        slug: p.slug || "",
                        excerpt: p.excerpt || "",
                        content: p.content || "",
                        image: p.image ? getFileUrl(p, p.image) : p.image_url,
                        date: p.date || new Date().toISOString(),
                        author: p.author || "Edi",
                        language: p.language || "DE"
                    };
                });

                const freshData: PortfolioData = {
                    heroImages: formattedHeroImages.length > 0 ? formattedHeroImages : defaultData.heroImages,
                    projectsData: (formattedProjects.DE.length || formattedProjects.EN.length || formattedProjects.SR.length) ? formattedProjects : defaultData.projectsData,
                    galleryImages: formattedGallery.length > 0 ? formattedGallery : defaultData.galleryImages,
                    bioData: {
                        DE: content?.bio_de || defaultData.bioData.DE,
                        EN: content?.bio_en || defaultData.bioData.EN,
                        SR: content?.bio_sr || defaultData.bioData.SR
                    },
                    statusData: {
                        DE: content?.status_de || defaultData.statusData.DE,
                        EN: content?.status_en || defaultData.statusData.EN,
                        SR: content?.status_sr || defaultData.statusData.SR
                    },
                    experienceData: (formattedTimeline.DE.length || formattedTimeline.EN.length || formattedTimeline.SR.length) ? formattedTimeline : defaultExperienceData,
                    blogPosts: formattedBlog,
                    avatar_url: (content?.avatar ? getFileUrl(content, content.avatar) : null) || content?.avatar_url || defaultData.avatar_url
                };
                setData(freshData);
            } else {
                console.log("PocketBase is empty, using default data");
            }
        } catch (error) {
            console.error("Failed to fetch from PocketBase:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPocketBaseData();
    }, []);

    const updateData = async (newData: Partial<PortfolioData>) => {
        setData((prev) => {
            const updated = { ...prev, ...newData };

            const syncToPocketBase = async () => {
                try {
                    // 1. Content (Bio, Status, Avatar)
                    if (newData.bioData || newData.statusData || newData.avatar_url !== undefined) {
                        const contentPayload = {
                            bio_de: updated.bioData.DE,
                            bio_en: updated.bioData.EN,
                            bio_sr: updated.bioData.SR,
                            status_de: updated.statusData.DE,
                            status_en: updated.statusData.EN,
                            status_sr: updated.statusData.SR,
                            avatar_url: updated.avatar_url
                        };

                        try {
                            const existing = await pb.collection('portfolio_content').getFirstListItem('id!="invalid"');
                            await pb.collection('portfolio_content').update(existing.id, contentPayload);
                        } catch {
                            await pb.collection('portfolio_content').create(contentPayload);
                        }
                    }

                    // NOTE: Hero images, gallery, and projects are now managed directly
                    // through their own collections via the Admin panel editors.
                    // They use FormData file uploads, not JSON updates.

                    // NOTE: Hero images, gallery, projects, and BLOG POSTS are now managed directly
                    // through their own collections via the Admin panel editors.
                    // They use FormData file uploads, not JSON updates.

                    // 3. Experience Timeline
                    if (newData.experienceData) {
                        const existingTimeline = await pb.collection('experience_timeline').getFullList().catch(() => []);

                        const incomingTimeline = (['DE', 'EN', 'SR'] as const).flatMap(lang =>
                            updated.experienceData[lang].map((t: any) => ({ ...t, language: lang }))
                        );
                        const incomingIds = incomingTimeline.map(t => t.id);

                        for (const t of existingTimeline) {
                            if (!incomingIds.includes(t.id)) {
                                await pb.collection('experience_timeline').delete(t.id).catch(() => { });
                            }
                        }

                        for (const lang of (['DE', 'EN', 'SR'] as const)) {
                            for (const [index, item] of updated.experienceData[lang].entries()) {
                                const payload = { ...item, language: lang, sort_order: index };
                                const exists = existingTimeline.some(et => et.id === item.id);
                                if (exists) {
                                    await pb.collection('experience_timeline').update(item.id, payload).catch(() => { });
                                } else {
                                    const { id, ...createPayload } = payload;
                                    await pb.collection('experience_timeline').create(createPayload).catch(() => { });
                                }
                            }
                        }
                    }

                } catch (error) {
                    console.error("Failed to sync to PocketBase", error);
                }
            };

            syncToPocketBase();
            return updated;
        });
    };

    return (
        <PortfolioContext.Provider value={{ data, updateData, isLoading, refreshData: fetchPocketBaseData }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolioData = () => useContext(PortfolioContext);
