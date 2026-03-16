// Default fallback data — used when PocketBase has no data yet
export const defaultHeroImages = [
    {
        id: "1",
        src: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop",
        type: "photo",
        label: "UX Design",
    },
    {
        id: "2",
        src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop",
        type: "photo",
        label: "Design System",
    },
    {
        id: "3",
        src: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&auto=format&fit=crop",
        type: "photo",
        label: "Typography",
    },
];

export const defaultProjectsData = {
    DE: [
        {
            id: 1,
            title: "Murphy's Agency",
            category: "Design, Animationen & Architektur",
            description: "Eine führende Kreativagentur. Ich war verantwortlich für das Webdesign, komplexe Animationen und die gesamte Seitenarchitektur.",
            challenge: "Die Agentur benötigte eine digitale Präsenz, die ihren Ruf für Innovation und Exzellenz widerspiegelt.",
            solution: "Ich entwickelte eine 'Dark-Mode'-Website mit WebGL-Effekten und sanften Übergängen.",
            roles: ["Lead Designer", "Animation Specialist", "Information Architecture"],
            tools: ["Figma", "React", "WebGL", "GSAP"],
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
            size: "large",
            link: "https://www.murphysagency.com/"
        },
        {
            id: 2,
            title: "Nutzerzentriert Entwickelt",
            category: "Webentwicklung & UX",
            description: "Eine Plattform für nutzerzentrierte Entwicklung und digitale Barrierefreiheit.",
            challenge: "Die Erstellung einer Ressource, die Zugänglichkeit und Performance in den Vordergrund stellt.",
            solution: "Eine leistungsstarke, barrierefreie Website mit Fokus auf klare Informationsstruktur.",
            roles: ["Frontend Developer", "UX Designer"],
            tools: ["React", "Tailwind", "Accessibility"],
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
            size: "normal",
            link: "https://nutzerzentriert-entwickelt.de/"
        },
        {
            id: 3,
            title: "MenschKi",
            category: "KI & Gesellschaft",
            description: "Eine Initiative für menschenzentrierte Künstliche Intelligenz und digitale Ethik.",
            challenge: "Die Komplexität von KI-Systemen verständlich zu machen.",
            solution: "Eine Bildungs- und Dialogplattform, die Technologie und Menschlichkeit verbindet.",
            roles: ["UI/UX Designer", "Concept Developer"],
            tools: ["Figma", "Webflow", "AI Tools"],
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
            size: "normal",
            link: "https://menschki.org/"
        },
        {
            id: 4,
            title: "Convaix",
            category: "Konversationelle KI",
            description: "Eine intelligente Plattform für automatisierte Kundenkommunikation und Workflow-Optimierung.",
            challenge: "Komplexe KI-Interaktionen für nicht-technische Benutzer zugänglich zu machen.",
            solution: "Ein visueller 'No-Code' Builder für Gesprächsabläufe mit Echtzeit-Analyse.",
            roles: ["Product Designer", "UI/UX"],
            tools: ["Figma", "React", "OpenAI API"],
            image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&auto=format&fit=crop",
            size: "large",
            link: "https://www.figma.com/design/zet5W4vr0i4kvTrKqaN77T/Convaix?t=NB8v3J9XDZGWtKVZ-0"
        },
    ],
    EN: [
        {
            id: 1,
            title: "Murphy's Agency",
            category: "Design, Animations & Architecture",
            description: "A leading creative agency. I was responsible for web design, complex animations, and overall site architecture.",
            challenge: "The agency needed a digital presence that reflected their reputation for innovation and excellence.",
            solution: "I developed a 'Dark-Mode' website with WebGL effects and smooth transitions.",
            roles: ["Lead Designer", "Animation Specialist", "Information Architecture"],
            tools: ["Figma", "React", "WebGL", "GSAP"],
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
            size: "large",
            link: "https://www.murphysagency.com/"
        },
        {
            id: 2,
            title: "Nutzerzentriert Entwickelt",
            category: "Web Development & UX",
            description: "A platform dedicated to user-centered development and digital accessibility.",
            challenge: "Creating a resource that prioritizes accessibility and performance.",
            solution: "A high-performance, accessible website focused on clear information structure.",
            roles: ["Frontend Developer", "UX Designer"],
            tools: ["React", "Tailwind", "Accessibility"],
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
            size: "normal",
            link: "https://nutzerzentriert-entwickelt.de/"
        },
        {
            id: 3,
            title: "MenschKi",
            category: "AI & Society",
            description: "An initiative for human-centric Artificial Intelligence and digital ethics.",
            challenge: "Making the complexity of AI systems understandable.",
            solution: "An educational and dialogue platform connecting technology with humanity.",
            roles: ["UI/UX Designer", "Concept Developer"],
            tools: ["Figma", "Webflow", "AI Tools"],
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
            size: "normal",
            link: "https://menschki.org/"
        },
        {
            id: 4,
            title: "Convaix",
            category: "Conversational AI",
            description: "An intelligent platform for automated customer communication and workflow optimization.",
            challenge: "Making complex AI interactions accessible for non-technical users.",
            solution: "A visual 'No-Code' builder for conversation flows with real-time analytics.",
            roles: ["Product Designer", "UI/UX"],
            tools: ["Figma", "React", "OpenAI API"],
            image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&auto=format&fit=crop",
            size: "large",
            link: "https://www.figma.com/design/zet5W4vr0i4kvTrKqaN77T/Convaix?t=NB8v3J9XDZGWtKVZ-0"
        },
    ],
    SR: [
        {
            id: 1,
            title: "Murphy's Agency",
            category: "Dizajn, Animacije & Arhitektura",
            description: "Vodeća kreativna agencija. Bio sam zadužen za web dizajn, kompleksne animacije i celokupnu arhitekturu sajta.",
            challenge: "Agenciji je bilo potrebno digitalno prisustvo koje odražava njihovu reputaciju za inovaciju.",
            solution: "Razvio sam 'Dark-Mode' sajt sa WebGL efektima i fluidnim tranzicijama.",
            roles: ["Vodeći Dizajner", "Ekspert za Animacije", "Arhitektura Informacija"],
            tools: ["Figma", "React", "WebGL", "GSAP"],
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
            size: "large",
            link: "https://www.murphysagency.com/"
        },
        {
            id: 2,
            title: "Nutzerzentriert Entwickelt",
            category: "Web Razvoj & UX",
            description: "Platforma posvećena razvoju usmerenom na korisnika i digitalnoj pristupačnosti.",
            challenge: "Kreiranje resursa koji stavlja pristupačnost i performanse u prvi plan.",
            solution: "Web sajt visokih performansi, pristupačan svima, sa fokusom na jasnu strukturu informacija.",
            roles: ["Frontend Developer", "UX Dizajner"],
            tools: ["React", "Tailwind", "Accessibility"],
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
            size: "normal",
            link: "https://nutzerzentriert-entwickelt.de/"
        },
        {
            id: 3,
            title: "MenschKi",
            category: "AI & Društvo",
            description: "Inicijativa za veštačku inteligenciju usmerenu na čoveka i digitalnu etiku.",
            challenge: "Učiniti kompleksnost AI sistema razumljivom.",
            solution: "Edukativna i dijaloška platforma koja povezuje tehnologiju i humanost.",
            roles: ["UI/UX Dizajner", "Koncept Developer"],
            tools: ["Figma", "Webflow", "AI Alati"],
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
            size: "normal",
            link: "https://menschki.org/"
        },
        {
            id: 4,
            title: "Convaix",
            category: "Konverzaciona AI",
            description: "Inteligentna platforma za automatizovanu komunikaciju sa klijentima i optimizaciju procesa.",
            challenge: "Učiniti složene AI interakcije pristupačnim za netehničke korisnike.",
            solution: "Vizuelni 'No-Code' kreator za tokove razgovora sa analitikom u realnom vremenu.",
            roles: ["Product Dizajner", "UI/UX"],
            tools: ["Figma", "React", "OpenAI API"],
            image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&auto=format&fit=crop",
            size: "large",
            link: "https://www.figma.com/design/zet5W4vr0i4kvTrKqaN77T/Convaix?t=NB8v3J9XDZGWtKVZ-0"
        },
    ],
};

export const defaultGalleryImages: any[] = [];

export const defaultBioData = {
    DE: {
        role: "Senior UX/UI Designer",
        bio: "Ich gestalte digitale Produkte, die nicht nur gut aussehen, sondern auch funktionieren. Wenn ich nicht designe, widme ich mich der Fotografie und Malerei.",
    },
    EN: {
        role: "Senior UX/UI Designer",
        bio: "I craft digital products that don't just look good—they work. When I'm not designing, I express my creativity through photography and painting.",
    },
    SR: {
        role: "Senior UX/UI Dizajner",
        bio: "Kreiram digitalne proizvode koji ne samo da izgledaju dobro, već i funkcionišu savršeno. Kada ne dizajniram, bavim se fotografijom i slikarstvom.",
    },
};

export const defaultStatusData = {
    DE: "Aktuell am Redesign des Design Systems für Convaix",
    EN: "Currently redesigning the Design System for Convaix",
    SR: "Trenutno redizajniram Design System za Convaix"
};

export const defaultExperienceData = {
    DE: [
        { id: "1", year: "2024", title: "Freelance Senior Designer", company: "Self-Employed", description: "Design Systems & High-Fidelity UI." },
        { id: "2", year: "2022", title: "Lead UX/UI Designer", company: "Murphy's Agency", description: "Complex animations and site architectures." },
        { id: "3", year: "2019", title: "UI Designer", company: "Creative Studio", description: "Concept development and prototyping." }
    ],
    EN: [
        { id: "1", year: "2024", title: "Freelance Senior Designer", company: "Self-Employed", description: "Design Systems & High-Fidelity UI." },
        { id: "2", year: "2022", title: "Lead UX/UI Designer", company: "Murphy's Agency", description: "Complex animations and site architectures." },
        { id: "3", year: "2019", title: "UI Designer", company: "Creative Studio", description: "Concept development and prototyping." }
    ],
    SR: [
        { id: "1", year: "2024", title: "Freelance Senior Dizajner", company: "Samozaposlen", description: "Dizajn sistemi i High-Fidelity UI." },
        { id: "2", year: "2022", title: "Lead UX/UI Dizajner", company: "Murphy's Agencija", description: "Kompleksne animacije i arhitektura sajtova." },
        { id: "3", year: "2019", title: "UI Dizajner", company: "Kreativni Studio", description: "Razvoj koncepata i prototipiranje." }
    ]
};
