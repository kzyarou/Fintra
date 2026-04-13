import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
export function SplashScreen({ onComplete }: {onComplete: () => void;}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <motion.div
      initial={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      transition={{
        duration: 0.5
      }}
      className="fixed inset-0 z-[200] bg-emerald flex flex-col items-center justify-center">
      
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        className="flex flex-col items-center">
        
        <motion.div
          animate={{
            y: [0, -8, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut'
          }}
          className="mb-4">
          
          <img
            src="/3.png"
            alt="Fintra Fox Mascot"
            className="w-[120px] h-[120px] object-contain" />
          
        </motion.div>
        <div className="mb-6 rotate-3">
          <Logo size={48} />
        </div>
        <motion.h1
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.4
          }}
          className="text-4xl font-bold text-white tracking-tight">
          
          Fintra
        </motion.h1>
        <motion.p
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.5
          }}
          className="text-emerald-100 font-medium mt-2">
          
          Financial clarity, elevated.
        </motion.p>
      </motion.div>
    </motion.div>);

}