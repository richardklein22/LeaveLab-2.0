'use client';

import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { stages } from '@/lib/landing-data';
import { useEffect, useState } from 'react';

interface StageCardProps {
  icon: string;
  title: string;
  subtitle: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  index: number;
}

function StageCard({ icon, title, subtitle, features, ctaText, ctaLink, index }: StageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl 
                 transition-all duration-300 border border-gray-100 
                 flex flex-col h-full min-h-[340px]"
    >
      {/* Icon */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 
                      flex items-center justify-center text-2xl sm:text-3xl mb-4 border border-green-100">
        {icon}
      </div>
      
      {/* Title */}
      <h3 className="text-xs sm:text-sm font-bold text-green-600 uppercase tracking-wide mb-2">
        {title}
      </h3>
      
      {/* Subtitle */}
      <p className="text-base sm:text-lg font-semibold text-gray-900 mb-4 leading-snug">
        {subtitle}
      </p>
      
      {/* Features list */}
      <ul className="space-y-2 mb-6 flex-grow">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
            <span className="text-green-500 mt-0.5">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* CTA Button */}
      <button 
        onClick={() => window.location.href = ctaLink}
        className="w-full py-2.5 px-4 rounded-lg border-2 border-gray-200 
                   text-gray-700 font-medium hover:border-green-500 
                   hover:text-green-600 hover:bg-green-50 
                   transition-all duration-200 text-xs sm:text-sm"
      >
        {ctaText}
      </button>
    </motion.div>
  );
}

export default function StageJourney() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    skipSnaps: false
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-3 sm:mb-4"
        >
          Your 90-Day Roadmap
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-base sm:text-xl text-gray-600 text-center mb-8 sm:mb-12 max-w-3xl mx-auto px-4"
        >
          Each stage unlocks the next—like a video game, but the prize is your new life
        </motion.p>
        
        {/* Desktop: Grid of all 4 cards */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {stages.map((stage, index) => (
            <StageCard key={index} {...stage} index={index} />
          ))}
        </div>

        {/* Mobile/Tablet: Carousel */}
        <div className="lg:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {stages.map((stage, index) => (
                <div key={index} className="flex-[0_0_85%] min-w-0 sm:flex-[0_0_70%] md:flex-[0_0_48%]">
                  <StageCard {...stage} index={index} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {stages.map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 rounded-full
                  ${index === selectedIndex 
                    ? 'w-8 h-2 bg-green-500' 
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to stage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

