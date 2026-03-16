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

import { supabase } from "../lib/supabase";

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<PortfolioData>(defaultData);

    useEffect(() => {
        const fetchSupabaseData = async () => {
            try {
                // Fetch portfolio_content
                const { data: contentData, error: contentError } = await supabase
                    .from('portfolio_content')
                    .select('*')
                    .eq('id', '00000000-0000-0000-0000-000000000000')
                    .single();

                // Fetch projects
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects')
                    .select('*')
                    .order('sort_order', { ascending: true });

                // Fetch gallery
                const { data: galleryData, error: galleryError } = await supabase
                    .from('gallery_images')
                    .select('*')
                    .order('sort_order', { ascending: true });

                if (contentData && projectsData && galleryData) {
                    const formattedProjects = { DE: [], EN: [], SR: [] } as any;
                    projectsData.forEach(p => {
                        if (formattedProjects[p.language]) {
                            formattedProjects[p.language].push(p);
                        }
                    });

                    setData({
                        heroImages: contentData.hero_images || [],
                        projectsData: formattedProjects,
                        galleryImages: galleryData || [],
                        bioData: {
                            DE: contentData.bio_de || { role: "", bio: "" },
                            EN: contentData.bio_en || { role: "", bio: "" },
                            SR: contentData.bio_sr || { role: "", bio: "" }
                        },
                        blogPosts: contentData.blog_posts || []
                    });
                } else {
                    // Fallback to local storage if tables are empty
                    const saved = localStorage.getItem("portfolioData");
                    if (saved) {
                        setData(JSON.parse(saved));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch from Supabase:", error);
                const saved = localStorage.getItem("portfolioData");
                if (saved) {
                    setData(JSON.parse(saved));
                }
            }
        };

        fetchSupabaseData();
    }, []);

    const updateData = async (newData: Partial<PortfolioData>) => {
        setData((prev) => {
            const updated = { ...prev, ...newData };

            // Sync to Supabase in the background
            const syncToSupabase = async () => {
                try {
                    // 1. Content
                    await supabase.from('portfolio_content').upsert({
                        id: '00000000-0000-0000-0000-000000000000',
                        hero_images: updated.heroImages,
                        bio_de: updated.bioData.DE,
                        bio_en: updated.bioData.EN,
                        bio_sr: updated.bioData.SR,
                        blog_posts: updated.blogPosts
                    });

                    // 2. Projects
                    await supabase.from('projects').delete().neq('language', 'none');
                    const allProjects: any[] = [];
                    ['DE', 'EN', 'SR'].forEach(lang => {
                        updated.projectsData[lang as 'DE' | 'EN' | 'SR'].forEach((proj: any, index: number) => {
                            allProjects.push({
                                language: lang,
                                title: proj.title,
                                category: proj.category,
                                description: proj.description,
                                challenge: proj.challenge,
                                solution: proj.solution,
                                image: proj.image,
                                size: proj.size,
                                link: proj.link,
                                roles: proj.roles || [],
                                tools: proj.tools || [],
                                sort_order: index
                            });
                        });
                    });

                    if (allProjects.length > 0) {
                        // Insert sequentially to avoid hitting payload sizing limits on Vercel
                        for (const p of allProjects) {
                            await supabase.from('projects').insert([p]);
                        }
                    }

                    // 3. Gallery
                    await supabase.from('gallery_images').delete().neq('src', 'none');
                    const galleryPayload = updated.galleryImages.map((img: any, index: number) => ({
                        src: img.src,
                        title: img.title || '',
                        description: img.description || '',
                        sort_order: index
                    }));
                    if (galleryPayload.length > 0) {
                        // Insert sequentially to avoid hitting payload sizing limits
                        for (const gal of galleryPayload) {
                            await supabase.from('gallery_images').insert([gal]);
                        }
                    }
                } catch (error) {
                    console.error("Failed to sync to Supabase", error);
                }
            };

            syncToSupabase();

            // Optional local backup
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
