import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Transaction } from '../types/finance';
import { useFinance } from '../context/FinanceContext';
import {
  Music,
  ShoppingBag,
  Twitter,
  HelpCircle,
  Coffee,
  Smartphone,
  Zap,
  Landmark,
  Banknote,
  RefreshCw,
  Trash2,
  Copy,
  Pin,
  ChevronDown,
  ChevronUp,
  MapPin,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Edit2 } from
'lucide-react';
const iconMap: Record<
  string,
  {
    icon: React.ReactNode;
    bg: string;
    color: string;
  }> =
{
  music: {
    icon: <Music size={20} />,
    bg: 'bg-purple-100',
    color: 'text-purple-600'
  },
  'shopping-bag': {
    icon: <ShoppingBag size={20} />,
    bg: 'bg-orange-100',
    color: 'text-orange-600'
  },
  twitter: {
    icon: <Twitter size={20} />,
    bg: 'bg-blue-100',
    color: 'text-blue-600'
  },
  coffee: {
    icon: <Coffee size={20} />,
    bg: 'bg-amber-100',
    color: 'text-amber-600'
  },
  smartphone: {
    icon: <Smartphone size={20} />,
    bg: 'bg-indigo-100',
    color: 'text-indigo-600'
  },
  zap: {
    icon: <Zap size={20} />,
    bg: 'bg-yellow-100',
    color: 'text-yellow-600'
  },
  landmark: {
    icon: <Landmark size={20} />,
    bg: 'bg-teal-100',
    color: 'text-teal-600'
  },
  banknote: {
    icon: <Banknote size={20} />,
    bg: 'bg-emerald-100',
    color: 'text-emerald-600'
  }
};
const defaultIcon = {
  icon: <HelpCircle size={20} />,
  bg: 'bg-gray-100',
  color: 'text-gray-600'
};
interface TransactionItemProps {
  transaction: Transaction;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}
export function TransactionItem({
  transaction,
  isSelectable = false,
  isSelected = false,
  onSelect
}: TransactionItemProps) {
  const {
    deleteTransaction,
    duplicateTransaction,
    togglePinTransaction,
    currencySymbol
  } = useFinance();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const controls = useAnimation();
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTap = useRef<number>(0);
  const isNegative = transaction.amount < 0;
  const amountStr = `${isNegative ? '-' : '+'}${currencySymbol}${Math.abs(transaction.amount).toFixed(2)}`;
  const iconConfig = iconMap[transaction.icon] || defaultIcon;
  const handleTouchStart = () => {
    if (isSelectable) return;
    pressTimer.current = setTimeout(() => {
      setShowContextMenu(true);
      navigator.vibrate?.(50); // Haptic feedback if supported
    }, 500); // 500ms long press
  };
  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };
  const handleTap = () => {
    if (isSelectable) {
      onSelect?.(transaction.id);
      return;
    }
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double tap
      togglePinTransaction(transaction.id);
      navigator.vibrate?.(50);
    } else {
      // Single tap
      setIsExpanded(!isExpanded);
    }
    lastTap.current = now;
  };
  const handleDragEnd = async (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -100 || velocity < -500) {
      // Swipe left -> Duplicate
      await controls.start({
        x: -1000,
        opacity: 0
      });
      duplicateTransaction(transaction.id);
      controls.start({
        x: 0,
        opacity: 1
      });
    } else if (offset > 100 || velocity > 500) {
      // Swipe right -> Delete
      await controls.start({
        x: 1000,
        opacity: 0
      });
      deleteTransaction(transaction.id);
    } else {
      // Reset
      controls.start({
        x: 0
      });
    }
  };
  return (
    <div className="relative mb-2">
      {/* Context Menu Overlay */}
      <AnimatePresence>
        {showContextMenu &&
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
            onClick={() => setShowContextMenu(false)}
            className="fixed inset-0 z-40 bg-black/20" />
          
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            className="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-xl border border-gray-100 dark:border-[#3A3A3C] p-2 min-w-[200px]">
            
              <button
              onClick={() => {
                togglePinTransaction(transaction.id);
                setShowContextMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#3A3A3C] rounded-xl text-sm font-bold text-charcoal dark:text-[#F5F5F7] transition-colors">
              
                <Pin
                size={18}
                className={
                transaction.pinned ?
                'fill-amber-500 text-amber-500' :
                'text-gray-400'
                } />
              
                {transaction.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button
              onClick={() => {
                duplicateTransaction(transaction.id);
                setShowContextMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#3A3A3C] rounded-xl text-sm font-bold text-charcoal dark:text-[#F5F5F7] transition-colors">
              
                <Copy size={18} className="text-gray-400" />
                Duplicate
              </button>
              <div className="h-[1px] bg-gray-100 dark:bg-[#3A3A3C] my-1 mx-2" />
              <button
              onClick={() => {
                deleteTransaction(transaction.id);
                setShowContextMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-bold text-red-500 transition-colors">
              
                <Trash2 size={18} />
                Delete
              </button>
            </motion.div>
          </>
        }
      </AnimatePresence>

      {/* Background Actions */}
      <div className="absolute inset-0 flex justify-between items-center px-6 rounded-2xl overflow-hidden pointer-events-none">
        <div className="flex items-center gap-2 text-emerald">
          <Copy size={24} />
          <span className="font-bold text-sm">Duplicate</span>
        </div>
        <div className="flex items-center gap-2 text-red-500">
          <span className="font-bold text-sm">Delete</span>
          <Trash2 size={24} />
        </div>
      </div>

      <motion.div
        drag={!isSelectable ? 'x' : false}
        dragConstraints={{
          left: 0,
          right: 0
        }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        animate={controls}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        className={`relative flex flex-col py-3.5 px-4 bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-sm border ${transaction.pinned ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/10' : 'border-gray-50 dark:border-[#3A3A3C]'} hover:shadow-md transition-shadow z-10 ${showContextMenu ? 'z-50 relative' : ''}`}>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSelectable &&
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(transaction.id);
              }}
              className="mr-1 text-gray-400 hover:text-emerald transition-colors">
              
                {isSelected ?
              <CheckSquare size={20} className="text-emerald" /> :

              <Square size={20} />
              }
              </button>
            }

            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconConfig.bg} ${iconConfig.color}`}>
              
              {iconConfig.icon}
            </div>
            <div className="cursor-pointer select-none" onClick={handleTap}>
              <div className="flex items-center gap-2">
                <h4 className="text-charcoal dark:text-[#F5F5F7] font-semibold text-base leading-tight">
                  {transaction.name}
                </h4>
                {transaction.recurring &&
                <RefreshCw size={12} className="text-emerald" />
                }
                {transaction.pinned &&
                <Pin size={12} className="text-amber-500 fill-amber-500" />
                }
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-medium line-clamp-1">
                {transaction.description}
              </p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span
              className={`font-bold text-base ${isNegative ? 'text-charcoal dark:text-[#F5F5F7]' : 'text-emerald'}`}>
              
              {amountStr}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <p className="text-gray-400 text-xs font-medium">
                {transaction.date === 'Today' ? 'Today' : transaction.date}
              </p>
              {!isSelectable &&
              <button
                onClick={handleTap}
                className="text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7]">
                
                  {isExpanded ?
                <ChevronUp size={14} /> :

                <ChevronDown size={14} />
                }
                </button>
              }
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && !isSelectable &&
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
            className="overflow-hidden">
            
              <div className="pt-4 mt-3 border-t border-gray-100 dark:border-[#3A3A3C] space-y-3">
                {/* Tags */}
                {transaction.tags && transaction.tags.length > 0 &&
              <div className="flex flex-wrap gap-1.5">
                    {transaction.tags.map((tag) =>
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  
                        #{tag}
                      </span>
                )}
                  </div>
              }

                {/* Notes */}
                {transaction.notes &&
              <div className="bg-softgray dark:bg-[#3A3A3C] p-3 rounded-xl text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {transaction.notes}
                  </div>
              }

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                  onClick={() => togglePinTransaction(transaction.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${transaction.pinned ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500' : 'bg-gray-100 dark:bg-[#3A3A3C] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#4A4A4C]'}`}>
                  
                    <Pin
                    size={14}
                    className={
                    transaction.pinned ?
                    'fill-amber-700 dark:fill-amber-500' :
                    ''
                    } />
                  
                    {transaction.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button className="flex-1 py-2 bg-gray-100 dark:bg-[#3A3A3C] text-gray-600 dark:text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-[#4A4A4C] flex items-center justify-center gap-1.5 transition-colors">
                    <MapPin size={14} />
                    Location
                  </button>
                  <button className="flex-1 py-2 bg-gray-100 dark:bg-[#3A3A3C] text-gray-600 dark:text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-[#4A4A4C] flex items-center justify-center gap-1.5 transition-colors">
                    <ImageIcon size={14} />
                    Receipt
                  </button>
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </motion.div>
    </div>);

}