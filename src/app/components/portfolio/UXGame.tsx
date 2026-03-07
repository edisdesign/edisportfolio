import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles, RefreshCw, Trophy } from "lucide-react";

interface UXGameProps {
  language: string;
}

type ShapeType = "circle" | "square" | "triangle";

interface DraggableShape {
  id: ShapeType;
  initialIndex: number; // 0, 1, 2
}

export const UXGame = ({ language }: UXGameProps) => {
  const [matchedShapes, setMatchedShapes] = useState<Record<ShapeType, boolean>>({
    circle: false,
    square: false,
    triangle: false,
  });
  
  const [hasWon, setHasWon] = useState(false);
  const [shuffledShapes, setShuffledShapes] = useState<DraggableShape[]>([]);

  // Fixed order for targets: Circle (0), Square (1), Triangle (2)
  const targets: ShapeType[] = ["circle", "square", "triangle"];

  const shuffleShapes = () => {
    const shapes: ShapeType[] = ["circle", "square", "triangle"];
    // Fisher-Yates Shuffle
    for (let i = shapes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shapes[i], shapes[j]] = [shapes[j], shapes[i]];
    }
    
    // Map to objects with initial indices to track their position in the dock
    setShuffledShapes(shapes.map((id, index) => ({ id, initialIndex: index })));
    setMatchedShapes({ circle: false, square: false, triangle: false });
    setHasWon(false);
  };

  useEffect(() => {
    shuffleShapes();
  }, []);

  useEffect(() => {
    if (Object.values(matchedShapes).every(Boolean)) {
        setHasWon(true);
    }
  }, [matchedShapes]);

  const labels = {
    DE: {
      title: "Die Kunst des UX",
      instruction: "Finde die perfekte Passform",
      success: "Harmonie erreicht.",
      reset: "Neu gestalten"
    },
    EN: {
      title: "The Art of UX",
      instruction: "Find the perfect fit",
      success: "Harmony achieved.",
      reset: "Redesign"
    },
    SR: {
      title: "Umetnost UX-a",
      instruction: "Pronađi savršen oblik",
      success: "Harmonija postignuta.",
      reset: "Dizajniraj ponovo"
    }
  };

  const t = labels[language as keyof typeof labels];

  const gradients: Record<ShapeType, string> = {
      circle: "bg-gradient-to-br from-pink-500 to-rose-600",
      square: "bg-gradient-to-br from-indigo-500 to-violet-600",
      triangle: "bg-gradient-to-br from-amber-400 to-orange-500"
  };

  const shadows: Record<ShapeType, string> = {
      circle: "shadow-[0_0_30px_-5px_rgba(244,63,94,0.6)]",
      square: "shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)]",
      triangle: "shadow-[0_0_30px_-5px_rgba(245,158,11,0.6)]"
  };

  const renderShape = (type: ShapeType, isTarget: boolean = false) => {
    const baseClasses = "flex items-center justify-center transition-all duration-300 relative overflow-hidden";
    const sizeClasses = "w-24 h-24 md:w-32 md:h-32";
    
    // Shape styling
    let shapeStyles = "";
    if (type === "circle") shapeStyles = "rounded-full";
    if (type === "square") shapeStyles = "rounded-3xl rotate-3"; // Slight rotation for artistic feel
    if (type === "triangle") shapeStyles = "[clip-path:polygon(50%_0%,0%_100%,100%_100%)] rounded-none";

    // Visual styling
    let visualStyles = "";
    
    if (isTarget) {
        // Target Slots (Neumorphic / Inset look)
        visualStyles = matchedShapes[type] 
            ? "bg-zinc-900/50" // Matched state handled by the filled content
            : "border-2 border-dashed border-zinc-800 bg-zinc-900/30 opacity-50";
            
        if (matchedShapes[type]) {
            // When matched, show the full glorious shape in place
            return (
                <motion.div 
                    initial={{ scale: 0, rotate: -180 }} 
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`${baseClasses} ${sizeClasses} ${shapeStyles} ${gradients[type]} ${shadows[type]}`}
                >
                    <Check className="text-white drop-shadow-md" size={40} />
                </motion.div>
            );
        }
    } else {
        // Draggable Item (Glassy Gem look)
        visualStyles = `${gradients[type]} ${shadows[type]} cursor-grab active:cursor-grabbing backdrop-blur-md z-20 border border-white/20`;
    }

    // Default return for Target (Empty) or Draggable
    return (
        <div className={`${baseClasses} ${sizeClasses} ${shapeStyles} ${visualStyles}`}>
             {isTarget && !matchedShapes[type] && (
                 <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity bg-[rgba(255,255,255,0.04)]" />
             )}
        </div>
    );
  };

  return (
    <section className="py-32 bg-zinc-950 border-t border-zinc-900 overflow-hidden relative select-none">
       {/* Artistic Background Splashes */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1], 
                    rotate: [0, 90, 0]
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.05, 0.1, 0.05],
                    rotate: [0, -45, 0]
                }}
                transition={{ duration: 25, repeat: Infinity, delay: 2 }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px]" 
            />
       </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
        >
            <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="text-indigo-400" size={20} />
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em]">{t.title}</h2>
                <Sparkles className="text-indigo-400" size={20} />
            </div>
            
            {!hasWon && (
                <p className="text-zinc-500 font-serif italic text-lg">{t.instruction}</p>
            )}
        </motion.div>

        <div className="flex flex-col items-center justify-center min-h-[500px] relative max-w-4xl mx-auto">
            
            {/* TARGETS ROW */}
            <div className="flex gap-6 md:gap-16 mb-32 relative z-0">
                {targets.map((shape) => (
                     <div key={`target-${shape}`} className="relative group">
                        {/* Target Glow on Hover */}
                        <div className="absolute inset-0 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        {renderShape(shape, true)}
                     </div>
                ))}
            </div>

            {/* DRAGGABLES ROW */}
            <div className="flex gap-6 md:gap-16 absolute bottom-0 left-1/2 -translate-x-1/2 z-20">
                <AnimatePresence>
                {shuffledShapes.map((shape, index) => {
                    if (matchedShapes[shape.id]) {
                        // Placeholder to maintain spacing
                        return <div key={shape.id} className="w-24 h-24 md:w-32 md:h-32 pointer-events-none" />;
                    }

                    return (
                        <motion.div
                            key={shape.id}
                            drag
                            dragConstraints={{ left: -400, right: 400, top: -400, bottom: 0 }}
                            dragElastic={0.1}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileDrag={{ scale: 1.2, zIndex: 100, rotate: 0 }}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
                            onDragEnd={(e, info) => {
                                const draggedY = info.offset.y;
                                const draggedX = info.offset.x;
                                
                                const targetIndex = targets.indexOf(shape.id);
                                const currentIndex = index;
                                
                                const isDesktop = window.innerWidth >= 768;
                                // 32 (w-32) + 16 (gap-16) = 128 + 64 = 192 approx
                                const slotStride = isDesktop ? 192 : 120; // Adjusted for new larger sizes
                                
                                const slotDiff = targetIndex - currentIndex;
                                const expectedX = slotDiff * slotStride;
                                
                                const xThreshold = 80; 
                                const isVerticalMatch = draggedY < -150 && draggedY > -450;
                                const isHorizontalMatch = Math.abs(draggedX - expectedX) < xThreshold;
                                
                                if (isVerticalMatch && isHorizontalMatch) {
                                    setMatchedShapes(prev => ({ ...prev, [shape.id]: true }));
                                }
                            }}
                        >
                            {renderShape(shape.id, false)}
                        </motion.div>
                    );
                })}
                </AnimatePresence>
            </div>

            {/* Success Overlay - Artistic Style */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none z-30">
                {hasWon && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="mx-auto flex flex-col items-center gap-6 pointer-events-auto w-full max-w-lg p-12 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        {/* Success Colors Background Glow inside the card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl -z-10" />

                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-[50px] opacity-50" />
                            <Trophy className="text-yellow-400 relative z-10 drop-shadow-lg" size={80} strokeWidth={1} />
                        </div>
                        
                        <div className="text-center space-y-2">
                            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                {t.success}
                            </h3>
                            <p className="text-zinc-400 font-serif italic">
                                "Design is intelligence made visible."
                            </p>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={shuffleShapes}
                            className="mt-8 px-8 py-4 bg-white text-zinc-950 rounded-full font-bold uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-xl shadow-white/10"
                        >
                            {t.reset}
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};
