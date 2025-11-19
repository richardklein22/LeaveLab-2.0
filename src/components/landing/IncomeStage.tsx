'use client';

import { motion } from 'framer-motion';
import { DollarSign, Bot, TrendingUp, Camera, Laptop, BookOpen, Star, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

const mentorshipPrograms = [
  {
    icon: DollarSign,
    title: 'Amazon FBA Mastery',
    description: 'Launch your profitable Amazon business from anywhere in the world',
    badge: 'Complete Program',
    badgeColor: 'bg-green-600',
    gradientFrom: 'from-brand-red',
    gradientTo: 'to-brand-red-800'
  },
  {
    icon: Bot,
    title: 'AI Automation Agency',
    description: 'Build an AI agency serving global clients with cutting-edge automation',
    badge: 'Most Popular',
    badgeColor: 'bg-brand-accent',
    gradientFrom: 'from-brand-accent',
    gradientTo: 'to-brand-accent-pink'
  },
  {
    icon: TrendingUp,
    title: 'Remote Sales',
    description: 'Master high-ticket remote sales and earn from anywhere',
    badge: 'High Income',
    badgeColor: 'bg-brand-accent-orange',
    gradientFrom: 'from-brand-accent-orange',
    gradientTo: 'to-brand-red'
  },
  {
    icon: Camera,
    title: 'Social Media Bootcamp',
    description: 'Build your personal brand and generate remote income via social media',
    badge: 'New',
    badgeColor: 'bg-brand-red',
    gradientFrom: 'from-pink-600',
    gradientTo: 'to-purple-600'
  }
];

const jobCategories = [
  {
    id: 'online',
    title: 'Online Jobs',
    icon: Laptop,
    description: 'Remote positions from verified employers',
    features: [
      '200+ remote positions',
      'Vetted employers only',
      'Application support',
      'Resume optimization'
    ]
  },
  {
    id: 'teaching',
    title: 'Teaching',
    icon: BookOpen,
    description: '£18-25/hour teaching English online',
    features: [
      'No degree required (some roles)',
      'Flexible hours',
      '50+ schools hiring',
      'Interview preparation'
    ]
  },
  {
    id: 'priority',
    title: 'Priority',
    icon: Star,
    description: 'Exclusive jobs from LeaveLab partners',
    features: [
      'Early access to positions',
      'Partner company jobs',
      'Higher acceptance rates',
      'Direct employer contact'
    ]
  },
  {
    id: 'remote',
    title: 'Remote',
    icon: Globe,
    description: 'Work from anywhere positions',
    features: [
      'Tech, design, marketing',
      'Customer service roles',
      'Writing & content',
      'Virtual assistant'
    ]
  }
];

export default function IncomeStage() {
  const [activeJobTab, setActiveJobTab] = useState('online');
  const activeCategory = jobCategories.find(cat => cat.id === activeJobTab) || jobCategories[0];
  const ActiveIcon = activeCategory.icon;

  return (
    <section id="income" className="py-16 sm:py-20 bg-brand-dark-950 relative">
      {/* Stage Header */}
      <div className="container mx-auto px-4 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              STAGE 1: <span className="text-brand-red">INCOME</span>
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Mentorship Programs - Gradient Cards */}
      <div className="container mx-auto px-4 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Expert <span className="text-brand-red">Mentorship</span>
          </h3>
          <p className="text-gray-400">
            1-on-1 guidance to launch your online business
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {mentorshipPrograms.map((program, index) => {
            const Icon = program.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="bg-brand-dark-900 border-white/10 overflow-hidden group hover:border-brand-red/50 transition-all duration-300 card-3d h-full">
                  <div className={`h-32 lg:h-48 bg-gradient-to-br ${program.gradientFrom} ${program.gradientTo} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20" 
                         style={{
                           backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                           backgroundSize: '20px 20px'
                         }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 lg:w-10 lg:h-10 text-white" />
                      </div>
                    </div>
                    <Badge className={`absolute top-2 left-2 lg:top-4 lg:left-4 ${program.badgeColor} text-white border-0 text-[10px] lg:text-xs px-2 py-0.5`}>
                      {program.badge}
                    </Badge>
                  </div>
                  <CardHeader className="p-3 lg:p-6">
                    <CardTitle className="text-sm lg:text-lg text-white group-hover:text-brand-red transition-colors line-clamp-2">
                      {program.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-xs lg:text-sm line-clamp-2">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Job Opportunities - Tabbed Interface */}
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Job <span className="text-brand-red">Opportunities</span>
          </h3>
          <p className="text-gray-400">
            Multiple paths to secure your income
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl border border-brand-red/20 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {jobCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveJobTab(category.id)}
                  className={`flex-1 px-2 lg:px-4 py-3 lg:py-4 flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 transition-all
                             ${activeJobTab === category.id 
                               ? 'bg-brand-red/20 border-b-2 border-brand-red text-white' 
                               : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] lg:text-sm font-semibold whitespace-nowrap">{category.title}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 
                              flex items-center justify-center border border-brand-red/20 flex-shrink-0">
                <ActiveIcon className="h-6 w-6 text-brand-red" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">{activeCategory.title}</h4>
                <p className="text-gray-400 text-sm">{activeCategory.description}</p>
              </div>
            </div>

            <ul className="space-y-3">
              {activeCategory.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

