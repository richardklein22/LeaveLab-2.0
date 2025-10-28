'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@/lib/landing-data';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      initial={false}
      className="glass rounded-lg sm:rounded-xl overflow-hidden 
                 border border-white/10 hover:border-brand-red/30 transition-colors duration-200"
    >
      {/* Question button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left 
                   hover:bg-white/5 active:bg-white/5 transition-colors duration-150"
      >
        <span className="font-semibold text-white text-base sm:text-lg pr-3 sm:pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-brand-red flex-shrink-0 transition-transform duration-300 
                     ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {/* Answer */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 text-gray-300 text-sm sm:text-base leading-relaxed bg-white/5">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-900/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12"
        >
          Frequently Asked <span className="text-brand-red">Questions</span>
        </motion.h2>
        
        {/* Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FAQItem {...faq} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
