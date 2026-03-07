import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ChaosIntroProps {
  onComplete: () => void;
}

// Colors: White, Indigo-500, Indigo-400
const COLORS = ['#ffffff', '#6366f1', '#818cf8'];
const CIRCLE_COUNT = 35;

export const ChaosIntro: React.FC<ChaosIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'explode' | 'implode' | 'exit'>('explode');

  useEffect(() => {
    // Stage 1: Explode (0s - 1.2s)
    
    // Stage 2: Implode (1.2s)
    const timer1 = setTimeout(() => setStage('implode'), 1200);
    
    // Stage 3: Exit/Complete (2.0s)
    const timer2 = setTimeout(() => setStage('exit'), 2000);

    // Call onComplete (2.2s)
    const timer3 = setTimeout(onComplete, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Calculate explosion vectors and circle properties
  const circles = useMemo(() => {
    return Array.from({ length: CIRCLE_COUNT }).map((_, i) => {
        // Spiral distribution for more "chaotic but organized" feel, or just random angle
        const angle = (i / CIRCLE_COUNT) * 2 * Math.PI;
        // Vary distance slightly so they don't form a perfect circle
        const distance = 80 + Math.random() * 70; // 80vmin to 150vmin
        
        return {
            id: i,
            size: Math.random() * 4 + 0.5 + "rem", // 0.5rem to 4.5rem
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
        };
    });
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-zinc-950 flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <AnimatePresence>
        {stage !== 'exit' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {circles.map((circle) => (
              <motion.div
                key={circle.id}
                className="absolute rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0, 
                  opacity: 0 
                }}
                animate={
                  stage === 'explode' 
                    ? {
                        x: circle.x + "vmin",
                        y: circle.y + "vmin",
                        scale: [0, 1.5, 1],
                        opacity: [0, 1, 0.8],
                      } 
                    : {
                        // Implode stage: Snap back to center
                        x: 0,
                        y: 0,
                        scale: 0,   // Shrink to zero
                        opacity: 0, // Fade out
                    }
                }
                transition={
                  stage === 'explode' 
                    ? {
                        duration: 1.0,
                        ease: [0.16, 1, 0.3, 1], // Expo out
                      }
                    : {
                        duration: 0.8,
                        ease: [0.7, 0, 0.84, 0], // Slower snap in
                    }
                }
                style={{
                  width: circle.size,
                  height: circle.size,
                  backgroundColor: circle.color,
                  boxShadow: `0 0 20px ${circle.color}40`, // Soft glow
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
