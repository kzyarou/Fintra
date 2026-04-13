import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
const slides = [
{
  id: 'welcome',
  title: 'Welcome to Fintra',
  description:
  'Your personal finance companion designed for clarity and control.',
  icon:
  <img
    src="/4.png"
    alt="Walking Fox"
    className="w-[150px] h-[150px] object-contain" />,


  color: 'bg-transparent'
},
{
  id: 'track',
  title: 'Track Every Penny',
  description:
  'Easily log your income and expenses. Categorize them to see where your money goes.',
  icon:
  <img
    src="/2.png"
    alt="Running Fox"
    className="w-[150px] h-[150px] object-contain" />,


  color: 'bg-blue-500/10'
},
{
  id: 'alerts',
  title: 'Stay on Budget',
  description: 'Set spending limits and get notified before you overspend.',
  icon:
  <img
    src="/1.png"
    alt="Sleeping Fox"
    className="w-[150px] h-[150px] object-contain" />,


  color: 'bg-amber-500/10'
}];

export function Onboarding({ onComplete }: {onComplete: () => void;}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      onComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };
  return (
    <div className="fixed inset-0 z-[150] bg-cream dark:bg-[#1C1C1E] flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{
              opacity: 0,
              x: 50
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -50
            }}
            transition={{
              duration: 0.3
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            
            <div
              className={`w-40 h-40 rounded-full ${slides[currentSlide].color} flex items-center justify-center mb-10`}>
              
              {slides[currentSlide].icon}
            </div>
            <h2 className="text-3xl font-bold text-charcoal dark:text-[#F5F5F7] mb-4">
              {slides[currentSlide].title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-xs">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 pb-12">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, idx) =>
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-emerald' : 'w-2 bg-gray-300 dark:bg-gray-600'}`} />

          )}
        </div>

        <div className="flex gap-4">
          {currentSlide < slides.length - 1 &&
          <button
            onClick={onComplete}
            className="flex-1 py-4 font-bold text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-colors">
            
              Skip
            </button>
          }
          <button
            onClick={nextSlide}
            className={`flex-[2] bg-emerald text-white font-bold py-4 rounded-2xl shadow-card active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${currentSlide === slides.length - 1 ? 'flex-1' : ''}`}>
            
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>);

}