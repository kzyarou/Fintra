import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Wallet,
  ArrowLeftRight,
  Plus,
  Settings,
  BarChart2,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  HandCoins,
  ShieldAlert } from
'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Logo } from './Logo';
interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
}
export function SideNav({ onAddClick }: {onAddClick: () => void;}) {
  const { activePage, setActivePage } = useFinance();
  const { isDeveloper } = useAuth();
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    'fintra_sidenav_collapsed',
    false
  );
  const navGroups = [
  {
    items: [
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
    }]

  },
  {
    items: [
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
    }]

  },
  {
    items: [
    {
      id: 'profile',
      icon: User,
      label: 'Profile'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings'
    }]

  }];

  if (isDeveloper) {
    navGroups.push({
      items: [
      {
        id: 'admin',
        icon: ShieldAlert,
        label: 'Dev Dashboard'
      }]

    });
  }
  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 88 : 260
      }}
      className="hidden lg:flex flex-col bg-white dark:bg-[#1C1C1E] border-r border-gray-200 dark:border-[#3A3A3C] h-screen sticky top-0 z-50 shadow-soft shrink-0">
      
      {/* Header */}
      <div
        className={`p-6 flex items-center justify-between shrink-0 transition-all duration-300 ${isCollapsed ? 'px-4' : 'px-6'}`}>
        
        <div className="flex items-center gap-3 overflow-hidden w-full justify-center lg:justify-start">
          <motion.div
            layout
            className="shrink-0 flex items-center justify-center">
            
            <Logo
              size={isCollapsed ? 20 : 28}
              className="transition-all duration-300" />
            
          </motion.div>
          <AnimatePresence>
            {!isCollapsed &&
            <motion.span
              initial={{
                opacity: 0,
                width: 0
              }}
              animate={{
                opacity: 1,
                width: 'auto'
              }}
              exit={{
                opacity: 0,
                width: 0
              }}
              className="font-bold text-xl text-charcoal dark:text-[#F5F5F7] whitespace-nowrap tracking-tight">
              
                Fintra
              </motion.span>
            }
          </AnimatePresence>
        </div>
      </div>

      {/* Add Button */}
      <div
        className={`px-4 mb-6 shrink-0 transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-6'}`}>
        
        <motion.button
          onClick={onAddClick}
          whileHover={{
            scale: 1.02
          }}
          whileTap={{
            scale: 0.98
          }}
          className={`w-full bg-emerald text-white rounded-2xl flex items-center justify-center gap-2 shadow-card transition-all overflow-hidden ${isCollapsed ? 'py-3.5 px-0' : 'py-3.5 px-4'}`}>
          
          <Plus size={20} strokeWidth={2.5} className="shrink-0" />
          <AnimatePresence>
            {!isCollapsed &&
            <motion.span
              initial={{
                opacity: 0,
                width: 0
              }}
              animate={{
                opacity: 1,
                width: 'auto'
              }}
              exit={{
                opacity: 0,
                width: 0
              }}
              className="font-bold text-sm whitespace-nowrap">
              
                New Transaction
              </motion.span>
            }
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Navigation Links */}
      <div
        className={`flex-1 overflow-y-auto space-y-6 hide-scrollbar pb-6 transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-4'}`}>
        
        {navGroups.map((group, groupIdx) =>
        <div key={groupIdx} className="space-y-1 relative">
            {groupIdx > 0 &&
          <div className="absolute -top-3 left-4 right-4 h-px bg-gray-100 dark:bg-[#3A3A3C]" />
          }
            {group.items.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as any)}
                className={`relative w-full flex items-center gap-3 rounded-xl transition-colors group ${isCollapsed ? 'px-0 py-3 justify-center' : 'px-4 py-3'}`}
                title={isCollapsed ? item.label : undefined}>
                
                  {isActive &&
                <motion.div
                  layoutId="sideNavActive"
                  className="absolute inset-0 bg-emerald/10 dark:bg-emerald/20 rounded-xl"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30
                  }} />

                }

                  <div className="relative z-10 flex items-center justify-center shrink-0">
                    <Icon
                    size={20}
                    className={
                    isActive ?
                    'text-emerald' :
                    'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors'
                    }
                    strokeWidth={isActive ? 2.5 : 2} />
                  
                  </div>

                  <AnimatePresence>
                    {!isCollapsed &&
                  <motion.span
                    initial={{
                      opacity: 0,
                      width: 0
                    }}
                    animate={{
                      opacity: 1,
                      width: 'auto'
                    }}
                    exit={{
                      opacity: 0,
                      width: 0
                    }}
                    className={`relative z-10 font-bold text-sm whitespace-nowrap ${isActive ? 'text-emerald' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                    
                        {item.label}
                      </motion.span>
                  }
                  </AnimatePresence>
                </button>);

          })}
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <div
        className={`p-4 shrink-0 border-t border-gray-100 dark:border-[#3A3A3C] transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-4'}`}>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2.5 rounded-xl text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7] hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.div>);

}