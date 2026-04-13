import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  Plus,
  Search,
  DollarSign,
  Bell,
  Trash2 } from
'lucide-react';
const faqs = [
{
  category: 'Getting Started',
  icon: Plus,
  questions: [
  {
    q: 'How do I add a transaction?',
    a: 'Tap the green + button in the bottom navigation bar. Enter the amount, name, and category, then tap "Save Transaction". You can also add tags, set it as recurring, and more.'
  },
  {
    q: 'How do I add a new account or wallet?',
    a: 'Go to the Accounts page, scroll down, and tap "Add new account". Choose the account type (Card, Cash, Bank, or Savings), enter a name and starting balance, then create it.'
  },
  {
    q: 'Can I edit or delete transactions?',
    a: 'Yes! Swipe left on any transaction to delete it, or swipe right to duplicate it. Tap on a transaction to expand it and see more options like pinning, adding notes, or attaching receipts.'
  }]

},
{
  category: 'Features',
  icon: Search,
  questions: [
  {
    q: 'What are tags and how do I use them?',
    a: 'Tags help you organize transactions. When adding a transaction, you can select from preset tags like "school", "work", or "personal", or create custom tags. Use tags to filter and search your transaction history.'
  },
  {
    q: 'How do recurring transactions work?',
    a: 'When adding a transaction, toggle "Recurring" and choose the interval (weekly, monthly, or yearly). Fintra will remember this pattern and suggest it for future entries.'
  },
  {
    q: 'What is the "Today\'s Story" feature?',
    a: "Today's Story gives you a quick summary of your financial activity for the day, highlighting spending patterns and categories. It helps you stay aware of your daily habits."
  }]

},
{
  category: 'Settings & Customization',
  icon: DollarSign,
  questions: [
  {
    q: 'How do I change the currency?',
    a: 'Go to Settings > Preferences > Currency. Select your preferred currency from the dropdown. All amounts throughout the app will update to use the new currency symbol.'
  },
  {
    q: 'Can I enable dark mode?',
    a: 'Yes! Go to Settings > Preferences > Theme and choose "Dark", "Light", or "System" (which follows your device settings).'
  },
  {
    q: 'How do I set a budget?',
    a: "Go to Settings > Notifications > Spending Alerts. Toggle it on and set your spending threshold. You'll receive notifications when you exceed your budget."
  }]

},
{
  category: 'Privacy & Security',
  icon: Bell,
  questions: [
  {
    q: 'Is my data safe?',
    a: 'Yes! All your data is stored locally on your device using browser local storage. We do not transmit your financial data to external servers. Your information never leaves your device.'
  },
  {
    q: 'Can I export my data?',
    a: "Data export functionality is coming soon. For now, your data is safely stored in your browser's local storage."
  },
  {
    q: 'What happens if I clear my browser data?',
    a: 'Clearing your browser data will delete all Fintra data. Make sure to export your data first (feature coming soon) if you need to preserve it.'
  }]

},
{
  category: 'Troubleshooting',
  icon: Trash2,
  questions: [
  {
    q: 'I accidentally deleted a transaction. Can I recover it?',
    a: 'When you delete a transaction, a toast notification appears with an "Undo" button. Tap it immediately to restore the transaction. Once dismissed, the deletion is permanent.'
  },
  {
    q: "Why aren't I receiving notifications?",
    a: "Make sure you've enabled Push Notifications in Settings > Notifications. Also check your browser settings to ensure notifications are allowed for this site."
  },
  {
    q: "The app looks broken or isn't loading properly.",
    a: 'Try refreshing the page. If issues persist, clear your browser cache or try a different browser. Contact support if the problem continues.'
  }]

}];

export function FAQPage() {
  const { setActivePage, goBack } = useFinance();
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredFaqs = faqs.
  map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).
  filter((category) => category.questions.length > 0);
  return (
    <div className="w-full min-h-screen bg-cream dark:bg-[#1C1C1E] pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 z-40 bg-cream dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-[#3A3A3C]">
        <div className="flex items-center mb-4">
          <button
            type="button"
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#3A3A3C] flex items-center justify-center text-charcoal dark:text-[#F5F5F7] shadow-sm hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors mr-4">
            
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-charcoal dark:text-[#F5F5F7]">
            FAQ & Tutorials
          </h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#3A3A3C] shadow-sm rounded-2xl pl-11 pr-4 py-3 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald/30 focus:ring-2 focus:ring-emerald/10 transition-all font-medium text-sm" />
          
        </div>
      </header>

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="px-6 pt-6 space-y-6">
        
        {filteredFaqs.length > 0 ?
        filteredFaqs.map((category, catIndex) =>
        <div
          key={catIndex}
          className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
          
              <div className="flex items-center gap-2 mb-4">
                <category.icon size={20} className="text-emerald" />
                <h2 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
                  {category.category}
                </h2>
              </div>
              <div className="space-y-2">
                {category.questions.map((faq, qIndex) => {
              const key = `${catIndex}-${qIndex}`;
              const isExpanded = expandedQuestion === key;
              return (
                <div key={qIndex}>
                      <button
                    type="button"
                    onClick={() =>
                    setExpandedQuestion(isExpanded ? null : key)
                    }
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-softgray dark:hover:bg-[#3A3A3C] transition-colors text-left">
                    
                        <div className="flex items-start gap-3 flex-1">
                          <HelpCircle
                        size={18}
                        className="text-emerald mt-0.5 flex-shrink-0" />
                      
                          <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                            {faq.q}
                          </span>
                        </div>
                        <ChevronDown
                      size={18}
                      className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`} />
                    
                      </button>
                      <AnimatePresence>
                        {isExpanded &&
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
                      
                            <div className="px-4 pb-4 pl-11 pr-4">
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                {faq.a}
                              </p>
                            </div>
                          </motion.div>
                    }
                      </AnimatePresence>
                    </div>);

            })}
              </div>
            </div>
        ) :

        <div className="text-center py-16 bg-white dark:bg-[#2C2C2E] rounded-[2rem] border border-dashed border-gray-200 dark:border-[#3A3A3C]">
            <Search
            size={48}
            className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          
            <p className="text-charcoal dark:text-[#F5F5F7] font-bold mb-1">
              No results found
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Try a different search term
            </p>
          </div>
        }

        {/* Still Need Help */}
        <div className="bg-emerald/5 dark:bg-emerald/10 border border-emerald/10 dark:border-emerald/20 rounded-[2rem] p-6">
          <h3 className="text-sm font-bold text-emerald mb-2">
            Still need help?
          </h3>
          <p className="text-xs text-emerald/80 dark:text-emerald/70 font-medium mb-3">
            Can't find what you're looking for? Contact our support team.
          </p>
          <a
            href="mailto:kzyaroudev@gmail.com?subject=Fintra%20Support"
            className="inline-block bg-emerald text-white font-bold py-2 px-4 rounded-xl hover:bg-emerald-600 transition-colors text-sm">
            
            Contact Support
          </a>
        </div>
      </motion.div>
    </div>);

}