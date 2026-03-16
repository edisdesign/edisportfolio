import React, { createContext, useContext, useState, useEffect } from "react";
import { defaultHeroImages, defaultProjectsData, defaultGalleryImages, defaultBioData } from "../data/defaultData";

export interface Project {
    id: string | number;
    title: string;
    category: string;
    description: string;
    challenge: string;
    solution: string;
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
    blogPosts: BlogPost[];
}

interface PortfolioContextType {
    data: PortfolioData;
    updateData: (newData: Partial<PortfolioData>) => void;
}

const defaultData: PortfolioData = {
    heroImages: defaultHeroImages,
    projectsData: defaultProjectsData,
    galleryImages: defaultGalleryImages,
    bioData: defaultBioData,
    blogPosts: [],
};

const PortfolioContext = createContext<PortfolioContextType>({
    data: defaultData,
    updateData: () => { },
});

import pb from "../lib/pocketbase";

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<PortfolioData>(defaultData);

    useEffect(() => {
        const fetchPocketBaseData = async () => {
            try {
                // PocketBase usually uses collections. We'll fetch from 'portfolio_data'
                // or similar. For now, we'll try to fetch all at once or handle errors.
                const content = await pb.collection('portfolio_content').getFirstListItem('id="000000000000000"').catch(() => null);
                const projects = await pb.collection('projects').getFullList({ sort: 'sort_order' }).catch(() => []);
                const gallery = await pb.collection('gallery_images').getFullList({ sort: 'sort_order' }).catch(() => []);
                const blog = await pb.collection('blog_posts').getFullList({ sort: '-date' }).catch(() => []);

                if (content || projects.length > 0 || gallery.length > 0 || blog.length > 0) {
                    const formattedProjects = { DE: [], EN: [], SR: [] } as any;
                    projects.forEach((p: any) => {
                        if (formattedProjects[p.language]) {
                            formattedProjects[p.language].push(p);
                        }
                    });

                    setData({
                        heroImages: content?.hero_images || [],
                        projectsData: formattedProjects,
                        galleryImages: gallery as unknown as GalleryImage[] || [],
                        bioData: {
                            DE: content?.bio_de || { role: "", bio: "" },
                            EN: content?.bio_en || { role: "", bio: "" },
                            SR: content?.bio_sr || { role: "", bio: "" }
                        },
                        blogPosts: blog as unknown as BlogPost[] || []
                    });
                } else {
                    console.log("PocketBase is empty, loading from localStorage fallback");
                    const saved = localStorage.getItem("portfolioData");
                    if (saved) setData(JSON.parse(saved));
                }
            } catch (error) {
                console.error("Failed to fetch from PocketBase:", error);
                const saved = localStorage.getItem("portfolioData");
                if (saved) setData(JSON.parse(saved));
            }
        };

        fetchPocketBaseData();
    }, []);

    const updateData = async (newData: Partial<PortfolioData>) => {
        setData((prev) => {
            const updated = { ...prev, ...newData };

            const syncToPocketBase = async () => {
                try {
                    // 1. Content (Bio & Hero)
                    if (newData.bioData || newData.heroImages) {
                        const contentPayload = {
                            hero_images: updated.heroImages,
                            bio_de: updated.bioData.DE,
                            bio_en: updated.bioData.EN,
                            bio_sr: updated.bioData.SR
                        };
                        
                        try {
                            const existing = await pb.collection('portfolio_content').getFirstListItem('id!="invalid"');
                            await pb.collection('portfolio_content').update(existing.id, contentPayload);
                        } catch {
                            await pb.collection('portfolio_content').create(contentPayload);
                        }
                    }

                    // 2. Projects
                    if (newData.projectsData) {
                        const existingProjects = await pb.collection('projects').getFullList().catch(() => []);
                        
                        // Flatten incoming projects to gather IDs
                        const incomingProjects = ['DE', 'EN', 'SR'].flatMap(lang => 
                            updated.projectsData[lang as any].map((p: any) => ({ ...p, language: lang }))
                        );
                        const incomingIds = incomingProjects.map(p => p.id);

                        for (const p of existingProjects) {
                            if (!incomingIds.includes(p.id)) {
                                await pb.collection('projects').delete(p.id).catch(() => {});
                            }
                        }

                        for (const lang of ['DE', 'EN', 'SR']) {
                            for (const [index, proj] of updated.projectsData[lang as any].entries()) {
                                const payload = { ...proj, language: lang, sort_order: index };
                                const exists = existingProjects.some(ep => ep.id === proj.id);
                                if (exists) {
                                    await pb.collection('projects').update(proj.id, payload).catch(() => {});
                                } else {
                                    // Make sure not to pass an invalid ID on create
                                    const { id, ...createPayload } = payload;
                                    await pb.collection('projects').create(createPayload).catch(() => {});
                                }
                            }
                        }
                    }

                    // 3. Gallery
                    if (newData.galleryImages) {
                         const existingGallery = await pb.collection('gallery_images').getFullList().catch(() => []);
                         const incomingIds = updated.galleryImages.map(g => g.id);
                         
                         for (const g of existingGallery) {
                             if (!incomingIds.includes(g.id)) {
                                 await pb.collection('gallery_images').delete(g.id).catch(() => {});
                             }
                         }
                        
                         for (const [index, img] of updated.galleryImages.entries()) {
                             const payload = { ...img, sort_order: index };
                             const exists = existingGallery.some(eg => eg.id === img.id);
                             if (exists) {
                                 await pb.collection('gallery_images').update(img.id, payload).catch(() => {});
                             } else {
                                 const { id, ...createPayload } = payload;
                                 await pb.collection('gallery_images').create(createPayload).catch(() => {});
                             }
                         }
                    }
                    // 4. Blog Posts
                    if (newData.blogPosts) {
                        const existingPosts = await pb.collection('blog_posts').getFullList().catch(() => []);
                        const incomingIds = updated.blogPosts.map(p => p.id);

                        for (const p of existingPosts) {
                            if (!incomingIds.includes(p.id)) {
                                await pb.collection('blog_posts').delete(p.id).catch(() => {});
                            }
                        }

                        for (const post of updated.blogPosts) {
                             const exists = existingPosts.some(ep => ep.id === post.id);
                             if (exists) {
                                 await pb.collection('blog_posts').update(post.id, post).catch(() => {});
                             } else {
                                 const { id, ...createPayload } = post;
                                 await pb.collection('blog_posts').create(createPayload).catch(() => {});
                             }
                        }
                    }

                } catch (error) {
                    console.error("Failed to sync to PocketBase", error);
                }
            };

            syncToPocketBase();
            localStorage.setItem("portfolioData", JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <PortfolioContext.Provider value={{ data, updateData }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolioData = () => useContext(PortfolioContext);
