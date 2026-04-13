import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import {
  Moon,
  Sun,
  Monitor,
  DollarSign,
  Calendar,
  Bell,
  Shield,
  Trash2,
  FileText,
  MessageCircle,
  Send,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Info } from
'lucide-react';
type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'PHP';
type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY';
const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  PHP: '₱'
};
const currencyOptions = [
{
  value: 'USD',
  label: 'USD - US Dollar',
  symbol: '$'
},
{
  value: 'EUR',
  label: 'EUR - Euro',
  symbol: '€'
},
{
  value: 'GBP',
  label: 'GBP - British Pound',
  symbol: '£'
},
{
  value: 'JPY',
  label: 'JPY - Japanese Yen',
  symbol: '¥'
},
{
  value: 'CAD',
  label: 'CAD - Canadian Dollar',
  symbol: 'C$'
},
{
  value: 'PHP',
  label: 'PHP - Philippine Peso',
  symbol: '₱'
}];

const Toggle = ({
  active,
  onClick



}: {active: boolean;onClick: () => void;}) =>
<button
  type="button"
  onClick={onClick}
  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${active ? 'bg-emerald' : 'bg-gray-200 dark:bg-gray-600'}`}>
  
    <div
    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
  
  </button>;

const SectionCard = ({
  title,
  children



}: {title: string;children: React.ReactNode;}) =>
<section className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-[#3A3A3C] mb-6">
    <h2 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7] mb-5">
      {title}
    </h2>
    {children}
  </section>;

export function SettingsPage() {
  const {
    settings,
    updateSetting,
    setActivePage,
    currencySymbol,
    openBudgetModal,
    budgetSettings
  } = useFinance();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | 'unsupported'>(
    'default');
  const [reminderInterval, setReminderInterval] =
  useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!('Notification' in window)) {
      setNotificationPermission('unsupported');
    } else {
      setNotificationPermission(Notification.permission);
    }
  }, []);
  useEffect(() => {
    if (
    settings.incomeReminders &&
    settings.pushNotifications &&
    notificationPermission === 'granted')
    {
      const interval = setInterval(
        () => {
          new Notification('Fintra Reminder', {
            body: "Don't forget to log your transactions for today!",
            icon: '/favicon.ico'
          });
        },
        60 * 60 * 1000
      );
      setReminderInterval(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (reminderInterval) {
        clearInterval(reminderInterval);
        setReminderInterval(null);
      }
    }
  }, [
  settings.incomeReminders,
  settings.pushNotifications,
  notificationPermission]
  );
  const handlePushNotificationToggle = async () => {
    if (notificationPermission === 'unsupported') {
      alert('Your browser does not support push notifications.');
      return;
    }
    if (!settings.pushNotifications) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        updateSetting('pushNotifications', true);
        new Notification('Fintra Notifications Enabled', {
          body: 'You will now receive alerts and reminders.'
        });
      } else if (permission === 'denied') {
        alert(
          'Notifications are blocked. Please enable them in your browser settings.'
        );
      }
    } else {
      updateSetting('pushNotifications', false);
    }
  };
  const handleSpendingAlertsToggle = () => {
    const newValue = !settings.spendingAlerts;
    updateSetting('spendingAlerts', newValue);
    if (
    newValue &&
    settings.pushNotifications &&
    notificationPermission === 'granted')
    {
      new Notification('Spending Alerts Enabled', {
        body: `We'll notify you when you exceed ${currencySymbols[settings.currency]}${settings.spendingThreshold}.`
      });
    }
  };
  const handleIncomeRemindersToggle = () => {
    const newValue = !settings.incomeReminders;
    updateSetting('incomeReminders', newValue);
    if (
    newValue &&
    settings.pushNotifications &&
    notificationPermission === 'granted')
    {
      new Notification('Daily Reminders Enabled', {
        body: "You'll receive hourly reminders to log your transactions."
      });
    }
  };
  const formatPreviewDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return settings.dateFormat === 'MM/DD/YYYY' ?
    `${mm}/${dd}/${yyyy}` :
    `${dd}/${mm}/${yyyy}`;
  };
  return (
    <div className="w-full">
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
          Settings
        </h1>
      </header>

      <div className="px-6">
        {/* Preferences Section */}
        <SectionCard title="Preferences">
          {/* Theme Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
              {
                id: 'light',
                icon: Sun,
                label: 'Light'
              },
              {
                id: 'dark',
                icon: Moon,
                label: 'Dark'
              },
              {
                id: 'system',
                icon: Monitor,
                label: 'System'
              }].
              map((t) =>
              <button
                key={t.id}
                type="button"
                onClick={() => updateSetting('theme', t.id as any)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${settings.theme === t.id ? 'border-emerald bg-emerald/5 dark:bg-emerald/10 text-emerald' : 'border-transparent bg-softgray dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#4A4A4C]'}`}>
                
                  <t.icon size={20} />
                  <span className="text-xs font-bold">{t.label}</span>
                </button>
              )}
            </div>
          </div>

          {/* Currency */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
              Currency
            </label>
            <div className="relative">
              <DollarSign
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
              
              <select
                value={settings.currency}
                onChange={(e) =>
                updateSetting('currency', e.target.value as Currency)
                }
                className="w-full bg-white dark:bg-[#2C2C2E] border-2 border-gray-100 dark:border-[#3A3A3C] rounded-2xl pl-11 pr-10 py-3.5 text-charcoal dark:text-[#F5F5F7] font-semibold appearance-none cursor-pointer focus:outline-none focus:border-emerald/30 focus:ring-2 focus:ring-emerald/10 transition-all shadow-sm">
                
                {currencyOptions.map((opt) =>
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                )}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1 font-medium">
              Preview: {currencySymbols[settings.currency]}1,234.56
            </p>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
              Date Format
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
              
              <select
                value={settings.dateFormat}
                onChange={(e) =>
                updateSetting('dateFormat', e.target.value as DateFormat)
                }
                className="w-full bg-white dark:bg-[#2C2C2E] border-2 border-gray-100 dark:border-[#3A3A3C] rounded-2xl pl-11 pr-10 py-3.5 text-charcoal dark:text-[#F5F5F7] font-semibold appearance-none cursor-pointer focus:outline-none focus:border-emerald/30 focus:ring-2 focus:ring-emerald/10 transition-all shadow-sm">
                
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1 font-medium">
              Preview: {formatPreviewDate()}
            </p>
          </div>
        </SectionCard>

        {/* Budgeting */}
        <SectionCard title="Budgeting">
          <div className="space-y-6">
            <div
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => openBudgetModal(undefined, 'settings')}>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center group-hover:bg-emerald/10 transition-colors">
                  <DollarSign
                    size={18}
                    className="text-charcoal dark:text-[#F5F5F7] group-hover:text-emerald transition-colors" />
                  
                </div>
                <div>
                  <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7] block group-hover:text-emerald transition-colors">
                    Rollover Budgets
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Carry over unused budget
                  </span>
                </div>
              </div>
              <Toggle
                active={budgetSettings.rolloverEnabled}
                onClick={() => {}} />
              
            </div>

            <div
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => openBudgetModal(undefined, 'settings')}>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center group-hover:bg-emerald/10 transition-colors">
                  <Calendar
                    size={18}
                    className="text-charcoal dark:text-[#F5F5F7] group-hover:text-emerald transition-colors" />
                  
                </div>
                <div>
                  <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7] block group-hover:text-emerald transition-colors">
                    Custom Cycles
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {budgetSettings.defaultCycle.charAt(0).toUpperCase() +
                    budgetSettings.defaultCycle.slice(1)}
                  </span>
                </div>
              </div>
              <ChevronRight
                size={20}
                className="text-gray-400 group-hover:text-emerald transition-colors" />
              
            </div>
          </div>
        </SectionCard>

        {/* Notifications Section */}
        <SectionCard title="Notifications">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center">
                  <Bell
                    size={18}
                    className="text-charcoal dark:text-[#F5F5F7]" />
                  
                </div>
                <div>
                  <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7] block">
                    Push Notifications
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Allow alerts and reminders
                  </span>
                </div>
              </div>
              <Toggle
                active={settings.pushNotifications}
                onClick={handlePushNotificationToggle} />
              
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center">
                  <DollarSign
                    size={18}
                    className="text-charcoal dark:text-[#F5F5F7]" />
                  
                </div>
                <div>
                  <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7] block">
                    Spending Alerts
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Notify when over budget
                  </span>
                </div>
              </div>
              <Toggle
                active={settings.spendingAlerts}
                onClick={handleSpendingAlertsToggle} />
              
            </div>

            <AnimatePresence>
              {settings.spendingAlerts &&
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
                
                  <div className="pl-14 pr-2 pb-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
                      Alert threshold ({currencySymbols[settings.currency]})
                    </label>
                    <input
                    type="number"
                    value={settings.spendingThreshold}
                    onChange={(e) =>
                    updateSetting(
                      'spendingThreshold',
                      Number(e.target.value)
                    )
                    }
                    className="w-full bg-softgray dark:bg-[#3A3A3C] border-2 border-transparent rounded-xl px-4 py-2.5 text-sm font-bold text-charcoal dark:text-[#F5F5F7] focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all" />
                  
                  </div>
                </motion.div>
              }
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center">
                  <Calendar
                    size={18}
                    className="text-charcoal dark:text-[#F5F5F7]" />
                  
                </div>
                <div>
                  <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7] block">
                    Daily Reminders
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Hourly reminders to log transactions
                  </span>
                </div>
              </div>
              <Toggle
                active={settings.incomeReminders}
                onClick={handleIncomeRemindersToggle} />
              
            </div>
          </div>
        </SectionCard>

        {/* Security & Privacy Section */}
        <SectionCard title="Security & Privacy">
          <div className="mb-5 p-4 bg-emerald/5 dark:bg-emerald/10 rounded-2xl border border-emerald/10 dark:border-emerald/20">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-emerald mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-emerald mb-1">
                  Protected & Compliant
                </h3>
                <p className="text-xs text-emerald/80 dark:text-emerald/70 leading-relaxed font-medium">
                  Your data is encrypted and stored locally. Compliant with RA
                  10173 and NPC guidelines.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setActivePage('privacy')}
              className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-softgray dark:hover:bg-[#3A3A3C] transition-colors">
              
              <div className="flex items-center gap-3">
                <FileText
                  size={18}
                  className="text-gray-500 dark:text-gray-400" />
                
                <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  Privacy Policy
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
              
              <Trash2 size={18} />
              <span className="text-sm font-bold">Delete Account</span>
            </button>
          </div>
        </SectionCard>

        {/* Support Section */}
        <SectionCard title="Support">
          <div className="space-y-2">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=kzyaroudev@gmail.com&su=Fintra%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-softgray dark:hover:bg-[#3A3A3C] transition-colors">
              
              <div className="flex items-center gap-3">
                <MessageCircle
                  size={18}
                  className="text-gray-500 dark:text-gray-400" />
                
                <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  Contact Support
                </span>
              </div>
              <ExternalLink size={16} className="text-gray-400" />
            </a>

            <button
              type="button"
              onClick={() => setActivePage('feedback')}
              className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-softgray dark:hover:bg-[#3A3A3C] transition-colors">
              
              <div className="flex items-center gap-3">
                <Send size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  Send Feedback
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => setActivePage('faq')}
              className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-softgray dark:hover:bg-[#3A3A3C] transition-colors">
              
              <div className="flex items-center gap-3">
                <HelpCircle
                  size={18}
                  className="text-gray-500 dark:text-gray-400" />
                
                <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  FAQ & Tutorials
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => setActivePage('about')}
              className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-softgray dark:hover:bg-[#3A3A3C] transition-colors">
              
              <div className="flex items-center gap-3">
                <Info size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                  About
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
        </SectionCard>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm &&
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
            onClick={() => setShowDeleteConfirm(false)}
            className="fixed inset-0 bg-charcoal/40 z-[100]" />
          
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
              initial={{
                scale: 0.9,
                opacity: 0
              }}
              animate={{
                scale: 1,
                opacity: 1
              }}
              exit={{
                scale: 0.9,
                opacity: 0
              }}
              className="bg-white dark:bg-[#2C2C2E] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl pointer-events-auto">
              
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                  <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-charcoal dark:text-[#F5F5F7] mb-2">
                  Delete Account?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
                  This action is permanent and will delete all your data. This
                  cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-softgray dark:bg-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] font-bold py-3.5 rounded-xl hover:bg-gray-200 dark:hover:bg-[#4A4A4C] transition-colors">
                  
                    Cancel
                  </button>
                  <button
                  type="button"
                  onClick={() => {
                    localStorage.clear();
                    setShowDeleteConfirm(false);
                    alert('Account deleted');
                    window.location.reload();
                  }}
                  className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors shadow-md">
                  
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        }
      </AnimatePresence>
    </div>);

}