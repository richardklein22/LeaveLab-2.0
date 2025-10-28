'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { testimonials } from '@/lib/landing-data';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  location: string;
  date: string;
  badge: string;
  imageUrl?: string;
}

function TestimonialCard({ quote, name, title, location, date, badge, imageUrl }: TestimonialProps) {
  // Get initials for avatar placeholder
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 
                 hover:shadow-2xl transition-all duration-300 
                 border border-white/10 flex flex-col h-full
                 card-3d hover:border-brand-red/30"
    >
      {/* Profile section */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        {/* Profile image - use placeholder if imageUrl not provided */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-brand-red to-brand-accent 
                        flex items-center justify-center text-white font-bold text-lg sm:text-xl 
                        overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <Image src={imageUrl} alt={name} width={56} height={56} className="object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <h4 className="font-semibold text-white text-sm sm:text-base truncate">{name}</h4>
          <p className="text-xs sm:text-sm text-gray-400 truncate">{title}</p>
        </div>
      </div>
      
      {/* Quote */}
      <blockquote className="text-gray-300 leading-relaxed mb-4 flex-grow 
                            text-sm sm:text-base italic">
        &quot;{quote}&quot;
      </blockquote>
      
      {/* Location & Date */}
      <div className="text-xs sm:text-sm text-gray-500 mb-3">
        <p>{location}</p>
        <p>{date}</p>
      </div>
      
      {/* Badge */}
      <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium 
                     text-brand-red bg-brand-red/10 px-3 py-1.5 rounded-full w-fit
                     border border-brand-red/20">
        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>{badge}</span>
      </div>
    </motion.div>
  );
}

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto-rotate every 5 seconds (only on mobile)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && window.innerWidth < 1024) {
        setActiveIndex((current) => (current + 1) % testimonials.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="py-16 sm:py-20 bg-brand-dark-900/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-white mb-3 sm:mb-4"
        >
          Join <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">1,247 Nomads</span> Already Living in Thailand
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-base sm:text-xl text-gray-400 text-center mb-8 sm:mb-12"
        >
          Real people. Real relocations. Real results.
        </motion.p>
        
        {/* Desktop: Show all 3 testimonials in a row */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet: Auto-rotating single card */}
        <div 
          className="lg:hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative min-h-[340px] sm:min-h-[360px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 
                           ${index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
          
          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 rounded-full
                           ${index === activeIndex 
                             ? 'bg-brand-red w-8 h-2' 
                             : 'bg-gray-600 hover:bg-brand-red/50 w-2 h-2'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
