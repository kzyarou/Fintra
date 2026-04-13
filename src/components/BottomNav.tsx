import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Wallet,
  ArrowLeftRight,
  Plus,
  MoreHorizontal,
  HandCoins,
  BarChart2,
  CreditCard,
  User,
  Settings,
  X } from
'lucide-react';
import { useFinance } from '../context/FinanceContext';
interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
}
const mainNavItems: NavItem[] = [
{
  id: 'home',
  icon: Home,
  label: 'Home'
},
{
  id: 'accounts',
  icon: Wallet,
  label: 'Wallets'
},
{
  id: 'history',
  icon: ArrowLeftRight,
  label: 'History'
}];

const moreNavItems: NavItem[] = [
{
  id: 'debts',
  icon: HandCoins,
  label: 'Debts'
},
{
  id: 'analytics',
  icon: BarChart2,
  label: 'Insights'
},
{
  id: 'cards',
  icon: CreditCard,
  label: 'Cards'
},
{
  id: 'profile',
  icon: User,
  label: 'Profile'
},
{
  id: 'settings',
  icon: Settings,
  label: 'Settings'
}];

export function BottomNav({ onAddClick }: {onAddClick: () => void;}) {
  const { activePage, setActivePage } = useFinance();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const isMoreActive = moreNavItems.some((item) => item.id === activePage);
  const handleNavClick = (id: string) => {
    setActivePage(id as any);
    setShowMoreMenu(false);
  };
  const renderNavItem = (item: NavItem, isInMoreMenu = false) => {
    const isActive = activePage === item.id;
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        className={`relative flex flex-col items-center justify-center z-10 ${isInMoreMenu ? 'w-full' : 'flex-1'} h-14`}>
        
        {!isInMoreMenu && isActive &&
        <motion.div
          layoutId="bottomNavPill"
          className="absolute inset-0 bg-emerald/10 dark:bg-emerald/20 rounded-2xl mx-2"
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30
          }} />

        }
        <motion.div
          animate={{
            y: isActive && !isInMoreMenu ? -2 : 0,
            color: isActive ? '#0D6B4B' : '#8E8E93'
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
          className={`relative z-10 ${isInMoreMenu ? 'flex items-center gap-4 w-full px-6 py-4' : 'flex flex-col items-center'}`}>
          
          <Icon
            size={20}
            strokeWidth={isActive ? 2.5 : 2}
            className={isInMoreMenu && isActive ? 'text-emerald' : ''} />
          
          <span
            className={`text-[9px] mt-0.5 font-semibold whitespace-nowrap ${isInMoreMenu ? 'text-sm mt-0 flex-1 text-left' : ''} ${isActive ? 'text-emerald' : 'text-gray-400 dark:text-gray-500'}`}>
            
            {item.label}
          </span>
        </motion.div>
      </button>);

  };
  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-safe pt-2 z-50 pointer-events-none">
        <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-gray-100/50 dark:border-[#3A3A3C]/50 rounded-3xl mb-4 mx-auto max-w-[360px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-between p-2 pointer-events-auto relative">
          {/* Left Nav Items */}
          {mainNavItems.map((item) => renderNavItem(item))}

          {/* Center Add Button */}
          <div className="px-2 z-30">
            <motion.button
              onClick={onAddClick}
              className="relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald text-white shadow-md flex-shrink-0"
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}>
              
              <Plus size={24} strokeWidth={2.5} />
            </motion.button>
          </div>

          {/* More Button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="relative flex flex-col items-center justify-center z-10 flex-1 h-14">
            
            {isMoreActive &&
            <motion.div
              layoutId="bottomNavPill"
              className="absolute inset-0 bg-emerald/10 dark:bg-emerald/20 rounded-2xl mx-2"
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30
              }} />

            }
            <motion.div
              animate={{
                y: isMoreActive ? -2 : 0,
                color: isMoreActive ? '#0D6B4B' : '#8E8E93',
                rotate: showMoreMenu ? 90 : 0
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              className="relative z-10">
              
              <MoreHorizontal size={20} strokeWidth={isMoreActive ? 2.5 : 2} />
            </motion.div>
            <motion.span
              className={`text-[9px] mt-0.5 font-semibold relative z-10 whitespace-nowrap ${isMoreActive ? 'text-emerald' : 'text-gray-400 dark:text-gray-500'}`}
              animate={{
                opacity: isMoreActive ? 1 : 0.7
              }}>
              
              More
            </motion.span>
          </button>
        </div>
      </div>

      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMoreMenu &&
        <>
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
            onClick={() => setShowMoreMenu(false)}
            className="fixed inset-0 bg-charcoal/40 z-[60]" />
          
            <div className="fixed inset-0 z-[61] flex items-end justify-center pointer-events-none">
              <motion.div
              initial={{
                y: '100%'
              }}
              animate={{
                y: 0
              }}
              exit={{
                y: '100%'
              }}
              transition={{
                type: 'tween',
                duration: 0.2
              }}
              className="bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-t-[2rem] shadow-2xl pointer-events-auto pb-safe">
              
                {/* Handle */}
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-[#3A3A3C] rounded-full mx-auto mt-4 mb-6" />

                {/* Header */}
                <div className="px-6 pb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
                    More Options
                  </h3>
                  <button
                  onClick={() => setShowMoreMenu(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2C2C2E] flex items-center justify-center text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7] transition-colors">
                  
                    <X size={18} />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="px-3 pb-6">
                  <div className="bg-gray-50 dark:bg-[#2C2C2E] rounded-2xl overflow-hidden">
                    {moreNavItems.map((item, index) =>
                  <div key={item.id}>
                        {renderNavItem(item, true)}
                        {index < moreNavItems.length - 1 &&
                    <div className="h-[1px] bg-gray-100 dark:bg-[#3A3A3C] mx-6" />
                    }
                      </div>
                  )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        }
      </AnimatePresence>
    </>);

}