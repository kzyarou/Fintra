import React, { useState, Component } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Bug,
  Lightbulb,
  Heart } from
'lucide-react';
import { toast } from 'sonner';
export function FAQPage() {
  const { setActivePage, goBack } = useFinance();
  const [feedbackType, setFeedbackType] = useState<
    'bug' | 'feature' | 'general'>(
    'general');
  const [feedbackText, setFeedbackText] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    const typeLabels = {
      bug: 'Bug Report',
      feature: 'Feature Request',
      general: 'General Feedback'
    };
    const subject = encodeURIComponent(`Fintra: ${typeLabels[feedbackType]}`);
    const body = encodeURIComponent(feedbackText);
    window.location.href = `mailto:kzyaroudev@gmail.com?subject=${subject}&body=${body}`;
    toast.success('Opening email client...');
    setFeedbackText('');
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
          Send Feedback
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
            <MessageSquare
              size={24}
              className="text-emerald mt-0.5 flex-shrink-0" />
            
            <div>
              <h2 className="text-lg font-bold text-emerald mb-2">
                We'd Love to Hear From You
              </h2>
              <p className="text-sm text-emerald/80 dark:text-emerald/70 leading-relaxed font-medium">
                Your feedback helps us improve Fintra. Report bugs, suggest
                features, or share your thoughts.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Type */}
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
          <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-3">
            Feedback Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFeedbackType('bug')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${feedbackType === 'bug' ? 'border-emerald bg-emerald/5 dark:bg-emerald/10 text-emerald' : 'border-transparent bg-softgray dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#4A4A4C]'}`}>
              
              <Bug size={20} />
              <span className="text-xs font-bold">Bug</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedbackType('feature')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${feedbackType === 'feature' ? 'border-emerald bg-emerald/5 dark:bg-emerald/10 text-emerald' : 'border-transparent bg-softgray dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#4A4A4C]'}`}>
              
              <Lightbulb size={20} />
              <span className="text-xs font-bold">Feature</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedbackType('general')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${feedbackType === 'general' ? 'border-emerald bg-emerald/5 dark:bg-emerald/10 text-emerald' : 'border-transparent bg-softgray dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#4A4A4C]'}`}>
              
              <Heart size={20} />
              <span className="text-xs font-bold">General</span>
            </button>
          </div>
        </div>

        {/* Feedback Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
          
          <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-3">
            Your Feedback
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Describe your bug, feature request, or feedback in detail..."
            className="w-full bg-softgray dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl p-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all min-h-[200px] font-medium text-sm resize-none"
            required />
          
          <button
            type="submit"
            disabled={!feedbackText.trim()}
            className={`w-full mt-4 font-bold py-4 rounded-2xl transition-colors shadow-card flex items-center justify-center gap-2 ${!feedbackText.trim() ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-emerald text-white hover:bg-emerald-600 active:scale-[0.98]'}`}>
            
            <Send size={20} />
            Send Feedback
          </button>
        </form>

        {/* Tips */}
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
          <h3 className="text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-3">
            Tips for Great Feedback
          </h3>
          <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-emerald mt-0.5">•</span>
              <span>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Be specific:
                </strong>{' '}
                Include steps to reproduce bugs or detailed feature descriptions
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald mt-0.5">•</span>
              <span>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Include context:
                </strong>{' '}
                Mention your device, browser, or app version if relevant
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald mt-0.5">•</span>
              <span>
                <strong className="text-charcoal dark:text-[#F5F5F7]">
                  Be constructive:
                </strong>{' '}
                Suggest solutions or alternatives when possible
              </span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>);

}
export function FeedbackPage() {
  return <FAQPage />;
}