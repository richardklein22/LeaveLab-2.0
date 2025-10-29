'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 sm:py-20 relative bg-brand-dark-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              Get In Touch
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-white"
          >
            Ready to Start Your <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Journey?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 mb-8"
          >
            Contact us to learn more about living and working from Thailand
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl p-8 border border-brand-red/20"
          >
            <p className="text-gray-300 mb-4">
              Email us at: <a href="mailto:hello@leavelab.com" className="text-brand-red hover:underline font-semibold">hello@leavelab.com</a>
            </p>
            <p className="text-gray-400 text-sm">
              We typically respond within 24 hours
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

