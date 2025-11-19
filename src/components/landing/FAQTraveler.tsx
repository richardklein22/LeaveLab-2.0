'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What\'s included in the Traveler Premium membership?',
    answer: 'You get direct access to our founders and Thailand expats, exclusive partner discounts (Skyscanner, Hostel World, Genki, Worldpacker), automatic visa reminders, personalized travel itineraries, hostel recommendations, and 24/7 support from Thailand experts.'
  },
  {
    question: 'How do the partner discounts work?',
    answer: 'Once you become a member, you\'ll receive unique discount codes and partner links for all our partner services. Simply use these when booking through Skyscanner, Hostel World, Genki, or Worldpacker to get your member discount.'
  },
  {
    question: 'Do I need a visa to visit Thailand?',
    answer: 'It depends on your nationality and length of stay. Many nationalities get a 30-day visa exemption on arrival. For longer stays, you can apply for a 60-day tourist visa. We provide automatic reminders and guidance for both options.'
  },
  {
    question: 'Can I extend my stay in Thailand?',
    answer: 'Yes! Both visa exemptions and tourist visas can be extended for an additional 30 days at Thai immigration offices. We\'ll send you reminders 7 days before your visa expires and provide step-by-step extension instructions.'
  },
  {
    question: 'How does the community access work?',
    answer: 'You\'ll get access to our private community chat where you can ask questions directly to our founders who live in Thailand, as well as other digital nomads and expats. It\'s like having local friends before you even arrive!'
  },
  {
    question: 'What if I\'ve never been to Thailand before?',
    answer: 'Perfect! Our platform is specifically designed for first-time visitors. We provide personalized itineraries, hostel recommendations, insider tips, and 24/7 support to make your first Thailand trip amazing and stress-free.'
  },
  {
    question: 'Can I cancel my membership anytime?',
    answer: 'Absolutely! There\'s no long-term commitment. You can cancel your membership at any time, and you won\'t be charged for the next billing cycle.'
  },
  {
    question: 'How are the personalized itineraries created?',
    answer: 'Based on your interests, travel dates, and budget, we create custom itineraries that include recommended destinations, activities, accommodation options, and insider tips that you won\'t find in regular guidebooks.'
  }
];

export default function FAQTraveler() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            <HelpCircle className="w-3 h-3 mr-1.5 inline" />
            Common Questions
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about traveling to Thailand with LeaveLab
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl border-2 border-blue-200 overflow-hidden
                           hover:border-blue-300 transition-colors"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-gray-900 hover:no-underline hover:text-blue-600">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button
            onClick={() => window.location.href = '#contact'}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Contact our support team →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

