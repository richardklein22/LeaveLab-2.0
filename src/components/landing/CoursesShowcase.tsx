'use client';

import { motion } from 'framer-motion';
import { DollarSign, Bot, TrendingUp, Camera, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const courses = [
  {
    icon: DollarSign,
    title: 'Amazon FBA Mastery',
    description: 'Launch your profitable Amazon business from anywhere in the world',
    badge: 'Complete Course',
    badgeColor: 'bg-green-600',
    gradientFrom: 'from-brand-red',
    gradientTo: 'to-brand-red-800',
    categoryBadge: 'Full Access',
    categoryColor: 'brand-red'
  },
  {
    icon: Bot,
    title: 'AI Automation Agency',
    description: 'Build an AI agency serving global clients with cutting-edge automation',
    badge: 'Most Popular',
    badgeColor: 'bg-brand-accent',
    gradientFrom: 'from-brand-accent',
    gradientTo: 'to-brand-accent-pink',
    categoryBadge: 'Tech-Focused',
    categoryColor: 'brand-accent'
  },
  {
    icon: TrendingUp,
    title: 'Remote Sales',
    description: 'Master high-ticket remote sales and earn from anywhere',
    badge: 'High Income',
    badgeColor: 'bg-brand-accent-orange',
    gradientFrom: 'from-brand-accent-orange',
    gradientTo: 'to-brand-red',
    categoryBadge: 'High Income',
    categoryColor: 'brand-accent-orange'
  },
  {
    icon: Camera,
    title: 'Social Media Bootcamp',
    description: 'Build your personal brand and generate remote income via social media',
    badge: 'New',
    badgeColor: 'bg-brand-red',
    gradientFrom: 'from-pink-600',
    gradientTo: 'to-purple-600',
    categoryBadge: 'Content Creator',
    categoryColor: 'pink-400'
  }
];

export default function CoursesShowcase() {
  return (
    <section id="courses" className="py-20 sm:py-32 relative bg-brand-dark-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              Featured Courses
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white"
          >
            Start <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Learning</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Expert-led courses designed to help you earn from anywhere
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-brand-dark-900 border-white/10 overflow-hidden group hover:border-brand-red/50 transition-all duration-300 card-3d">
                  <div className={`h-56 bg-gradient-to-br ${course.gradientFrom} ${course.gradientTo} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20" 
                         style={{
                           backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                           backgroundSize: '20px 20px'
                         }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <Badge className={`absolute top-4 left-4 ${course.badgeColor} text-white border-0 animate-pulse-scale`}>
                      {course.badge}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className={`text-${course.categoryColor} border-${course.categoryColor}/50 bg-${course.categoryColor}/5`}>
                        {course.categoryBadge}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-white group-hover:text-brand-red transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-brand-red hover:bg-brand-red-600 magnetic-button text-white">
                      Start Course
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/signup">
            <Button size="lg" className="bg-brand-red hover:bg-brand-red-600 text-lg px-10 py-6 magnetic-button text-white">
              Start Learning Today
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Join 1,000+ students already learning these skills
          </p>
        </motion.div>
      </div>
    </section>
  );
}

