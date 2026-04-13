import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
export function PrivacyPage() {
  const { setActivePage, goBack } = useFinance();
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
          Privacy Policy
        </h1>
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
        
        {/* Hero */}
        <div className="bg-emerald/5 dark:bg-emerald/10 border border-emerald/10 dark:border-emerald/20 rounded-[2rem] p-6">
          <div className="flex items-start gap-3">
            <Shield size={24} className="text-emerald mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-emerald mb-2">
                Your Privacy Matters
              </h2>
              <p className="text-sm text-emerald/80 dark:text-emerald/70 leading-relaxed font-medium">
                We respect your privacy and are committed to protecting your
                personal data. This policy explains how we handle your
                information.
              </p>
            </div>
          </div>
        </div>

        {/* Data Collection */}
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
          <div className="flex items-center gap-2 mb-4">
            <Database size={20} className="text-emerald" />
            <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
              Data Collection
            </h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
            <p>
              Fintra collects only the data necessary to provide you with
              financial tracking services:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Transaction Data:
                </strong>{' '}
                Information about your income and expenses that you manually
                enter
              </li>
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Account Information:
                </strong>{' '}
                Details about your wallets, cards, and savings accounts
              </li>
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Preferences:
                </strong>{' '}
                Your app settings, theme, currency, and notification preferences
              </li>
            </ul>
            <p className="text-emerald font-bold">
              All data is stored locally on your device. We do not transmit your
              financial data to external servers.
            </p>
          </div>
        </div>

        {/* Data Storage */}
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={20} className="text-emerald" />
            <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
              Data Storage & Security
            </h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
            <p>Your data security is our top priority:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Local Storage:
                </strong>{' '}
                All your financial data is stored in your browser's local
                storage
              </li>
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  No Cloud Sync:
                </strong>{' '}
                We do not sync your data to cloud servers
              </li>
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Encryption:
                </strong>{' '}
                Browser-level encryption protects your data at rest
              </li>
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  No Third Parties:
                </strong>{' '}
                We do not share your data with third-party services
              </li>
            </ul>
          </div>
        </div>

        {/* User Rights */}
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck size={20} className="text-emerald" />
            <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
              Your Rights
            </h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
            <p>
              Under data protection laws (including RA 10173 - Data Privacy Act
              of 2012), you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Access:
                </strong>{' '}
                View all your stored data at any time
              </li>
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Correction:
                </strong>{' '}
                Edit or update your information
              </li>
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Erasure:
                </strong>{' '}
                Delete your account and all associated data
              </li>
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Portability:
                </strong>{' '}
                Export your data (feature coming soon)
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={20} className="text-emerald" />
            <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
              Compliance
            </h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
            <p>Fintra is compliant with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  RA 10173:
                </strong>{' '}
                Data Privacy Act of 2012 (Philippines)
              </li>
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  NPC Guidelines:
                </strong>{' '}
                National Privacy Commission implementing rules
              </li>
              <li>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Best Practices:
                </strong>{' '}
                Industry-standard security measures
              </li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-emerald/5 dark:bg-emerald/10 border border-emerald/10 dark:border-emerald/20 rounded-[2rem] p-6">
          <h3 className="text-sm font-bold text-emerald mb-2">Questions?</h3>
          <p className="text-xs text-emerald/80 dark:text-emerald/70 font-medium mb-3">
            If you have any questions about this privacy policy, please contact
            us at:
          </p>
          <a
            href="mailto:kzyaroudev@gmail.com?subject=Privacy%20Policy%20Inquiry"
            className="text-sm font-bold text-emerald hover:text-emerald-600 transition-colors">
            
            kzyaroudev@gmail.com
          </a>
          <p className="text-xs text-emerald/70 mt-4 font-medium">
            Last updated: January 2024
          </p>
        </div>
      </motion.div>
    </div>);

}