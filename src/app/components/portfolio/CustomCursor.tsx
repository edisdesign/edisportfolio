import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useTransform, animate } from 'motion/react';

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Velocity tracking
  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, smoothOptions);
  const smoothY = useSpring(cursorY, smoothOptions);
  
  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);
  
  const speed = useTransform<number, number>(
    [velocityX, velocityY], 
    ([vx, vy]) => Math.hypot(vx, vy)
  );
  
  // Velocity adds extra scale (0 to 1500px/s maps to 0 to 0.5 extra scale)
  const velocityScale = useTransform(speed, [0, 1500], [0, 0.8]);
  
  const baseScale = useMotionValue(1);
  
  useEffect(() => {
    // Smoothly animate the base scale when hover state changes
    animate(baseScale, isHovering ? 2.5 : 1, { 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
    });
  }, [isHovering, baseScale]);

  // Combine base scale + velocity scale
  // If hovering, velocity effect is minimized to keep text readable
  const finalScale = useTransform(
      [baseScale, velocityScale], 
      ([base, vel]) => {
          if (base > 1.5) return base; // If hovering, lock scale for readability
          return base + vel; // If navigating, add "speed stretch"
      }
  );

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // 48px cursor -> center is 24px
      cursorX.set(e.clientX - 24);
      cursorY.set(e.clientY - 24);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main cursor - The "Inverter" */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference bg-white"
        style={{
          x: smoothX,
          y: smoothY,
          scale: finalScale,
        }}
      />
      
      {/* Optional: Small center dot for precision (also inverting) */}
      <motion.div 
         className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
         style={{
            x: useSpring(cursorX, { damping: 40, stiffness: 1000 }), 
            y: useSpring(cursorY, { damping: 40, stiffness: 1000 }),
            translateX: 20, // Center inside the 48px circle (24 - 4 = 20)
            translateY: 20
         }}
      />
    </>
  );
};
