import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
export function ProgressBar({ isNavigating }: {isNavigating: boolean;}) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;
    if (isNavigating) {
      setIsVisible(true);
      setProgress(0);
      // Fast initial progress
      timeout = setTimeout(() => {
        setProgress(60);
        // Slow progress after initial jump
        interval = setInterval(() => {
          setProgress((p) => {
            if (p >= 90) return 90;
            return p + Math.random() * 5;
          });
        }, 300);
      }, 50);
    } else {
      // Complete the progress bar when navigation finishes
      if (isVisible) {
        setProgress(100);
        timeout = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => setProgress(0), 200); // Reset after fade out
        }, 300);
      }
    }
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isNavigating, isVisible]);
  return (
    <AnimatePresence>
      {isVisible &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        transition={{
          duration: 0.2
        }}
        className="fixed top-0 left-0 right-0 z-[9999] h-1 pointer-events-none">
        
          <motion.div
          className="h-full bg-emerald"
          initial={{
            width: '0%'
          }}
          animate={{
            width: `${progress}%`
          }}
          transition={{
            ease: 'easeOut',
            duration: 0.2
          }}>
          
            <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30 blur-[2px]" />
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}