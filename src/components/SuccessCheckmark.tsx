import React from 'react';
import { motion } from 'framer-motion';
export function SuccessCheckmark() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{
          scale: 0
        }}
        animate={{
          scale: 1
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20
        }}
        className="w-24 h-24 bg-emerald rounded-full flex items-center justify-center shadow-lg">
        
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-12 h-12"
          initial={{
            pathLength: 0
          }}
          animate={{
            pathLength: 1
          }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: 'easeOut'
          }}>
          
          <motion.polyline points="20 6 9 17 4 12" />
        </motion.svg>
      </motion.div>
    </div>);

}