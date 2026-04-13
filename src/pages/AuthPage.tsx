import React, { useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform } from
'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';
import { Logo } from '../components/Logo';
// Floating shapes for background
const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(5)].map((_, i) =>
      <motion.div
        key={i}
        className="absolute bg-emerald/5 dark:bg-emerald/10 rounded-full"
        style={{
          width: Math.random() * 100 + 50,
          height: Math.random() * 100 + 50,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }}
        animate={{
          y: [0, Math.random() * 100 - 50, 0],
          x: [0, Math.random() * 100 - 50, 0],
          scale: [1, Math.random() * 0.5 + 1, 1],
          rotate: [0, Math.random() * 360, 0]
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          ease: 'linear'
        }} />

      )}
    </div>);

};
export function AuthPage() {
  const { signIn, signUp, signInWithGoogle, signInAsGuest } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-500, 500], [5, -5]);
  const rotateY = useTransform(x, [-500, 500], [-5, 5]);
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name, phone);
      }
    } catch (error) {

      // Error handled in context
    } finally {setLoading(false);
    }
  };
  const formVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  };
  return (
    <div className="min-h-screen bg-cream dark:bg-[#1C1C1E] flex flex-col lg:flex-row relative overflow-hidden">
      <FloatingShapes />

      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      {/* Desktop Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative z-10 border-r border-gray-200 dark:border-[#3A3A3C]">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 0.8,
            type: 'spring'
          }}
          className="text-center max-w-md">
          
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{
                y: [0, -8, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: 'easeInOut'
              }}>
              
              <img
                src="/3.png"
                alt="Fintra Fox Mascot"
                className="w-[160px] h-[160px] object-contain drop-shadow-2xl" />
              
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold text-charcoal dark:text-[#F5F5F7] mb-6 tracking-tight">
            Financial clarity, <br />
            <span className="text-emerald">elevated.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed">
            Track your spending, set smart budgets, and gain deep insights into
            your financial habits.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 relative z-10 min-h-screen lg:min-h-0">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            perspective: 1000
          }}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5
          }}
          className="w-full max-w-md mx-auto">
          
          <div className="text-center mb-10 lg:hidden">
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{
                  y: [0, -4, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut'
                }}>
                
                <img
                  src="/3.png"
                  alt="Fintra Fox Mascot"
                  className="w-[80px] h-[80px] object-contain" />
                
              </motion.div>
            </div>
            <motion.h1
              key={isLogin ? 'login' : 'signup'}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="text-3xl font-bold text-charcoal dark:text-[#F5F5F7] mb-2">
              
              {isLogin ? 'Welcome back' : 'Create an account'}
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {isLogin ?
              'Enter your details to access your account.' :
              'Start managing your finances today.'}
            </p>
          </div>

          <div className="hidden lg:block text-center mb-8">
            <motion.h2
              key={isLogin ? 'login-desk' : 'signup-desk'}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="text-3xl font-bold text-charcoal dark:text-[#F5F5F7] mb-2">
              
              {isLogin ? 'Welcome back' : 'Create an account'}
            </motion.h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {isLogin ?
              'Enter your details to access your account.' :
              'Start managing your finances today.'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-xl border border-gray-50 dark:border-[#3A3A3C]">
            <div className="relative flex bg-gray-50 dark:bg-[#3A3A3C] p-1 rounded-xl mb-6">
              <motion.div
                className="absolute inset-y-1 w-[calc(50%-4px)] bg-white dark:bg-[#2C2C2E] rounded-lg shadow-sm"
                animate={{
                  left: isLogin ? '4px' : 'calc(50%)'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }} />
              
              <button
                onClick={() => setIsLogin(true)}
                className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${isLogin ? 'text-charcoal dark:text-[#F5F5F7]' : 'text-gray-500 dark:text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7]'}`}>
                
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${!isLogin ? 'text-charcoal dark:text-[#F5F5F7]' : 'text-gray-500 dark:text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7]'}`}>
                
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {!isLogin &&
                <motion.div
                  key="name"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    duration: 0.2
                  }}
                  className="relative">
                  
                    <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  
                    <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full bg-softgray dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-12 pr-4 py-3.5 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-medium" />
                  
                  </motion.div>
                }
                {!isLogin &&
                <motion.div
                  key="phone"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    duration: 0.2,
                    delay: 0.05
                  }}
                  className="relative">
                  
                    <Phone
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  
                    <input
                    type="tel"
                    inputMode="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-softgray dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-12 pr-4 py-3.5 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-medium" />
                  
                  </motion.div>
                }
              </AnimatePresence>

              <motion.div layout className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-softgray dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-12 pr-4 py-3.5 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-medium" />
                
              </motion.div>

              <motion.div layout className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-softgray dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-12 pr-4 py-3.5 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-medium" />
                
              </motion.div>

              <motion.button
                layout
                type="submit"
                disabled={loading}
                className="w-full bg-emerald text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-colors shadow-card active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
                
                {loading ?
                'Please wait...' :
                isLogin ?
                'Sign In' :
                'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </motion.button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100 dark:border-[#3A3A3C]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-[#2C2C2E] text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  onClick={signInWithGoogle}
                  type="button"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-100 dark:border-[#3A3A3C] rounded-2xl hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors font-bold text-charcoal dark:text-[#F5F5F7]">
                  
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4" />
                    
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853" />
                    
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05" />
                    
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335" />
                    
                  </svg>
                  Google
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={signInAsGuest}
              className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors">
              
              Continue as Guest
            </button>
          </div>
        </motion.div>
      </div>
    </div>);

}