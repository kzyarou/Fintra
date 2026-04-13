import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Settings,
  Shield,
  Fingerprint,
  LogOut,
  ChevronRight } from
'lucide-react';
export function ProfilePage() {
  const { setActivePage, goBack } = useFinance();
  const { user, isGuest, signOut } = useAuth();
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {}
  };
  const displayName = isGuest ? 'Guest' : user?.displayName || 'User';
  const displayEmail = isGuest ? 'Not signed in' : user?.email || 'No email';
  return (
    <div className="w-full min-h-screen bg-cream dark:bg-[#1C1C1E] pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 z-40 bg-cream dark:bg-[#1C1C1E] flex items-center">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#3A3A3C] flex items-center justify-center text-charcoal dark:text-[#F5F5F7] shadow-sm hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors mr-4">
          
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-charcoal dark:text-[#F5F5F7]">
          Profile
        </h1>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 space-y-8">
        
        {/* Avatar & Info */}
        <motion.section
          variants={itemVariants}
          className="flex flex-col items-center">
          
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full border-4 border-white dark:border-[#2C2C2E] shadow-md bg-emerald flex items-center justify-center text-white font-bold text-4xl overflow-hidden">
              {user?.photoURL ?
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover" /> :


              displayName.charAt(0).toUpperCase()
              }
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald rounded-full border-4 border-cream dark:border-[#1C1C1E] flex items-center justify-center text-white">
              <User size={14} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
            {displayName}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {displayEmail}
          </p>
          {!isGuest &&
          <div className="mt-3">
              <div className="bg-emerald/10 text-emerald px-3 py-1 rounded-full text-xs font-bold">
                Member since{' '}
                {user?.metadata?.creationTime ?
              new Date(user.metadata.creationTime).getFullYear() :
              new Date().getFullYear()}
              </div>
            </div>
          }
        </motion.section>

        {/* Account Details */}
        <motion.section variants={itemVariants}>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
            Account Details
          </h3>
          <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-2 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center mr-4 text-charcoal dark:text-[#F5F5F7]">
                <User size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Full Name
                </p>
                <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  {displayName}
                </p>
              </div>
            </div>
            <div className="h-[1px] bg-gray-50 dark:bg-[#3A3A3C] mx-4" />
            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center mr-4 text-charcoal dark:text-[#F5F5F7]">
                <Mail size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Email Address
                </p>
                <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  {displayEmail}
                </p>
              </div>
            </div>
            <div className="h-[1px] bg-gray-50 dark:bg-[#3A3A3C] mx-4" />
            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center mr-4 text-charcoal dark:text-[#F5F5F7]">
                <Phone size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Phone Number
                </p>
                <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Preferences & Security */}
        <motion.section variants={itemVariants}>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
            Preferences & Security
          </h3>
          <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-2 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
            <button
              onClick={() => setActivePage('settings')}
              className="w-full flex items-center p-4 hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors rounded-xl text-left">
              
              <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center mr-4 text-charcoal dark:text-[#F5F5F7]">
                <Settings size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  App Settings
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Theme, currency, notifications
                </p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <div className="h-[1px] bg-gray-50 dark:bg-[#3A3A3C] mx-4" />
            <button className="w-full flex items-center p-4 hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors rounded-xl text-left">
              <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center mr-4 text-charcoal dark:text-[#F5F5F7]">
                <Shield size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  Change Password
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Update your security credentials
                </p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <div className="h-[1px] bg-gray-50 dark:bg-[#3A3A3C] mx-4" />
            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center mr-4 text-charcoal dark:text-[#F5F5F7]">
                <Fingerprint size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  Biometric Login
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Use Face ID or Touch ID
                </p>
              </div>
              <div className="relative w-12 h-6 rounded-full bg-emerald transition-colors duration-300">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 translate-x-6" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Sign Out */}
        <motion.section variants={itemVariants} className="pt-4">
          <button
            onClick={handleSignOut}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2">
            
            <LogOut size={20} /> Sign Out
          </button>
        </motion.section>
      </motion.div>
    </div>);

}