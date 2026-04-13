import React, { useState, Children } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import {
  ArrowLeft,
  Code,
  Heart,
  User,
  Globe,
  Smartphone,
  Shield,
  Zap,
  ChevronDown,
  Mail,
  Github,
  ExternalLink } from
'lucide-react';
import { Logo } from '../components/Logo';
export function AboutPage() {
  const { goBack } = useFinance();
  const [expandedSection, setExpandedSection] = useState<string | null>('app');
  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 0.2
      }
    }
  };
  return (
    <div className="w-full min-h-screen bg-cream dark:bg-[#1C1C1E] pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 z-40 bg-cream dark:bg-[#1C1C1E] flex items-center border-b border-gray-100 dark:border-[#3A3A3C]">
        <button
          type="button"
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#3A3A3C] flex items-center justify-center text-charcoal dark:text-[#F5F5F7] shadow-sm hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors mr-4">
          
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-charcoal dark:text-[#F5F5F7]">
          About
        </h1>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 pt-6 space-y-6">
        
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-emerald to-emerald-700 text-white rounded-[2rem] p-8 shadow-card relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="absolute bottom-0 right-4 z-10 opacity-90">
            <img
              src="/4.png"
              alt="Walking Fox"
              className="w-[100px] h-[100px] object-contain" />
            
          </div>

          <div className="flex items-center gap-4 mb-4 relative z-10">
            <Logo size={32} className="shadow-none" />
            <div>
              <h2 className="text-3xl font-bold">Fintra</h2>
              <p className="text-white/80 text-sm font-medium">Version 2.0.0</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed font-medium relative z-10 max-w-[70%]">
            Financial clarity, elevated.
          </p>
        </motion.div>

        {/* About the App */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] shadow-sm border border-gray-50 dark:border-[#3A3A3C] overflow-hidden">
          
          <button
            onClick={() => toggleSection('app')}
            className="w-full flex items-center justify-between p-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center">
                <Smartphone size={20} className="text-emerald" />
              </div>
              <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
                About the App
              </h3>
            </div>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform duration-300 ${expandedSection === 'app' ? 'rotate-180' : ''}`} />
            
          </button>
          <AnimatePresence>
            {expandedSection === 'app' &&
            <motion.div
              initial={{
                height: 0,
                opacity: 0
              }}
              animate={{
                height: 'auto',
                opacity: 1
              }}
              exit={{
                height: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.3
              }}
              className="overflow-hidden">
              
                <div className="px-6 pb-6 space-y-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
                  <p>
                    Fintra began as a simple problem—one that wasn't unique to
                    us, but shared by millions of people everywhere. Managing
                    money felt unnecessarily complicated, overwhelming, and
                    often frustrating. In a conversation between Kzyarou and his
                    brother, a question came up: "What if tracking finances
                    didn't have to feel like work?" From that moment, Fintra was
                    born.
                  </p>
                  <p>
                    The journey started with Trackr, a feature-packed financial
                    tracker designed to include everything a user could possibly
                    need. But over time, something became clear—more features
                    didn't always mean a better experience. The app became
                    cluttered, tiring to use, and lost its purpose.
                  </p>
                  <p>So Fintra was rebuilt from the ground up.</p>
                  <p>
                    It became a stripped-down, focused version of
                    Trackr—centered on clarity, usability, and purpose. Guided
                    by the philosophy "Do less, be more," Fintra removed the
                    noise and focused on what truly mattered: helping users
                    understand and manage their finances effortlessly.
                  </p>
                  <p>
                    When Fintra launched in 2024, it quietly gained traction,
                    reaching over 200 users locally. As the community grew, so
                    did the demand for more control and flexibility. Instead of
                    ignoring this, Fintra evolved—this time with intention.
                  </p>
                  <p>
                    Today, Fintra follows a new principle:{' '}
                    <span className="text-charcoal dark:text-[#F5F5F7] font-bold">
                      Build what matters. Refine it. Then expand with intention.
                    </span>
                  </p>
                  <p>
                    Now trusted by users across Dolores, Eastern Samar, Fintra
                    has become more than just an app—it's a daily companion for
                    people working toward better financial habits and long-term
                    growth.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-softgray dark:bg-[#3A3A3C] rounded-xl p-4 text-center">
                      <Zap size={20} className="text-emerald mx-auto mb-2" />
                      <p className="text-xs font-bold text-charcoal dark:text-[#F5F5F7]">
                        Fast & Intuitive
                      </p>
                    </div>
                    <div className="bg-softgray dark:bg-[#3A3A3C] rounded-xl p-4 text-center">
                      <Shield size={20} className="text-emerald mx-auto mb-2" />
                      <p className="text-xs font-bold text-charcoal dark:text-[#F5F5F7]">
                        Privacy First
                      </p>
                    </div>
                  </div>

                  <p className="italic text-emerald">
                    P.S. Enjoy the experience.
                  </p>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </motion.div>

        {/* About the Developer */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] shadow-sm border border-gray-50 dark:border-[#3A3A3C] overflow-hidden">
          
          <button
            onClick={() => toggleSection('developer')}
            className="w-full flex items-center justify-between p-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <User size={20} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
                About the Developer
              </h3>
            </div>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform duration-300 ${expandedSection === 'developer' ? 'rotate-180' : ''}`} />
            
          </button>
          <AnimatePresence>
            {expandedSection === 'developer' &&
            <motion.div
              initial={{
                height: 0,
                opacity: 0
              }}
              animate={{
                height: 'auto',
                opacity: 1
              }}
              exit={{
                height: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.3
              }}
              className="overflow-hidden">
              
                <div className="px-6 pb-6 space-y-4">
                  <div className="flex items-center gap-4 bg-softgray dark:bg-[#3A3A3C] rounded-2xl p-4">
                    <div className="w-16 h-16 rounded-full bg-emerald flex items-center justify-center text-white font-bold text-2xl shrink-0">
                      Z
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal dark:text-[#F5F5F7] text-lg">
                        Zachary Rapis
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        aka kzyarou
                      </p>
                      <p className="text-xs text-emerald font-bold mt-1">
                        Full-Stack Developer
                      </p>
                    </div>
                  </div>

                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium space-y-3">
                    <p>
                      A multidisciplinary Full-Stack Developer who believes that
                      great software doesn't just simplify life—it elevates it.
                    </p>
                    <p>
                      Zachary specializes in building polished, user-centric
                      applications with a focus on design quality and thoughtful
                      interactions. His work spans frontend and backend
                      development, with a passion for creating tools that
                      genuinely help people.
                    </p>
                    <p>
                      Fintra represents his philosophy of building with
                      purpose—every detail, from how transactions are logged to
                      how data is visualized, is designed to keep users focused,
                      informed, and in control.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <a
                    href="mailto:kzyaroudev@gmail.com"
                    className="flex items-center gap-3 p-3 bg-softgray dark:bg-[#3A3A3C] rounded-xl hover:bg-gray-200 dark:hover:bg-[#4A4A4C] transition-colors">
                    
                      <Mail size={18} className="text-emerald" />
                      <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                        kzyaroudev@gmail.com
                      </span>
                    </a>
                    <a
                    href="https://kzyarou.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-softgray dark:bg-[#3A3A3C] rounded-xl hover:bg-gray-200 dark:hover:bg-[#4A4A4C] transition-colors">
                    
                      <Globe size={18} className="text-emerald" />
                      <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7] flex-1">
                        kzyarou.vercel.app
                      </span>
                      <ExternalLink size={14} className="text-gray-400" />
                    </a>
                  </div>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] shadow-sm border border-gray-50 dark:border-[#3A3A3C] overflow-hidden">
          
          <button
            onClick={() => toggleSection('technical')}
            className="w-full flex items-center justify-between p-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Code size={20} className="text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
                Technical Details
              </h3>
            </div>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform duration-300 ${expandedSection === 'technical' ? 'rotate-180' : ''}`} />
            
          </button>
          <AnimatePresence>
            {expandedSection === 'technical' &&
            <motion.div
              initial={{
                height: 0,
                opacity: 0
              }}
              animate={{
                height: 'auto',
                opacity: 1
              }}
              exit={{
                height: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.3
              }}
              className="overflow-hidden">
              
                <div className="px-6 pb-6">
                  <div className="space-y-3">
                    {[
                  {
                    label: 'Version',
                    value: '2.0.0'
                  },
                  {
                    label: 'Release Date',
                    value: 'January 2024'
                  },
                  {
                    label: 'Built with',
                    value: 'React + TypeScript'
                  },
                  {
                    label: 'Styling',
                    value: 'Tailwind CSS'
                  },
                  {
                    label: 'Animations',
                    value: 'Framer Motion'
                  },
                  {
                    label: 'Data Storage',
                    value: 'Local Storage (on-device)'
                  },
                  {
                    label: 'Authentication',
                    value: 'Firebase Auth'
                  },
                  {
                    label: 'License',
                    value: 'Proprietary'
                  }].
                  map((item, idx) =>
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-[#3A3A3C] last:border-0">
                    
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                          {item.value}
                        </span>
                      </div>
                  )}
                  </div>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </motion.div>

        {/* Key Features */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] shadow-sm border border-gray-50 dark:border-[#3A3A3C] overflow-hidden">
          
          <button
            onClick={() => toggleSection('features')}
            className="w-full flex items-center justify-between p-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <Zap size={20} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
                Key Features
              </h3>
            </div>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform duration-300 ${expandedSection === 'features' ? 'rotate-180' : ''}`} />
            
          </button>
          <AnimatePresence>
            {expandedSection === 'features' &&
            <motion.div
              initial={{
                height: 0,
                opacity: 0
              }}
              animate={{
                height: 'auto',
                opacity: 1
              }}
              exit={{
                height: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.3
              }}
              className="overflow-hidden">
              
                <div className="px-6 pb-6">
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {[
                  'Multi-wallet tracking with custom account types',
                  'Smart transaction management with tags, categories & recurring entries',
                  'Advanced budgeting with rollover and custom cycles',
                  'Debt manager to track money owed to you',
                  'Analytics with category breakdowns and spending trends',
                  'Dark mode and theme customization',
                  'Gesture-based interactions (swipe, long-press, double-tap)',
                  'Real-time balance impact preview',
                  'Offline-first with local data storage',
                  'Firebase authentication with Google sign-in'].
                  map((feature, idx) =>
                  <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald mt-0.5 shrink-0">•</span>
                        <span>{feature}</span>
                      </li>
                  )}
                  </ul>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </motion.div>

        {/* Credits */}
        <motion.div
          variants={itemVariants}
          className="bg-emerald/5 dark:bg-emerald/10 border border-emerald/10 dark:border-emerald/20 rounded-[2rem] p-6">
          
          <p className="text-center text-sm text-emerald font-bold">
            Made with ❤️ by Zachary Rapis (kzyarou)
          </p>
          <p className="text-center text-xs text-emerald/70 mt-2 font-medium">
            © 2024 Fintra. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>);

}