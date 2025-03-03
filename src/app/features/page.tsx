'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Brain, Sparkles, Timer, Zap, Target, Heart, Lightbulb, CheckCircle, Plus, Minus, ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/homepage/ScrollReveal';

// Feature highlights for the rotating feature section
const features = [
  {
    title: "Adaptive Task System",
    description: "Tasks that adapt to your energy levels and focus state",
    icon: Zap,
    color: "bg-amber-500"
  },
  {
    title: "Visual Mind Mapping",
    description: "Organize your thoughts spatially the way your brain works",
    icon: Brain,
    color: "bg-blue-500"
  },
  {
    title: "Flexible Time Blocking",
    description: "Time management that works with your natural rhythms",
    icon: Timer,
    color: "bg-green-500"
  },
  {
    title: "Dopamine-Driven Rewards",
    description: "Motivation systems designed for the neurodivergent brain",
    icon: Sparkles,
    color: "bg-purple-500"
  }
];

// Feature categories for detailed sections
const categories = [
  {
    title: "Visual Thinking Tools",
    description: "Transform abstract thoughts into concrete visual elements you can manipulate, connect, and organize.",
    badge: "Visual Processing",
    icon: Brain,
    image: "/features/visual-thinking.jpg",
    points: [
      {
        title: "Spatial Organization",
        description: "Arrange thoughts spatially to match your mental models instead of forcing linear organization."
      },
      {
        title: "Color Coding & Patterns",
        description: "Use colors and visual patterns to create intuitive organization systems that make sense to you."
      },
      {
        title: "Zoom Levels",
        description: "Easily zoom in for details or out for the big picture, reducing overwhelm while maintaining context."
      },
      {
        title: "Visual Relationships",
        description: "Create visible connections between related ideas, projects, and tasks to see how everything fits together."
      }
    ]
  },
  {
    title: "Energy-Aware Productivity",
    description: "Work with your natural energy fluctuations instead of fighting against them for sustainable productivity.",
    badge: "Energy Management",
    icon: Zap,
    image: "/features/energy-productivity.jpg",
    points: [
      {
        title: "Energy Tracking",
        description: "Log and visualize your energy patterns to identify your optimal working hours and conditions."
      },
      {
        title: "Task Matching",
        description: "Match tasks to your current energy level - creative work when you&apos;re inspired, routine tasks when you&apos;re not."
      },
      {
        title: "Adaptive Scheduling",
        description: "Flexible schedules that adapt to your changing energy levels and focus capacity throughout the day."
      },
      {
        title: "Recovery Optimization",
        description: "Strategic breaks and recovery periods designed to restore energy and prevent burnout."
      }
    ]
  },
  {
    title: "Hyperfocus Support",
    description: "Tools designed to help you harness the power of hyperfocus while managing its challenges.",
    badge: "Focus Enhancement",
    icon: Target,
    image: "/features/hyperfocus.jpg",
    points: [
      {
        title: "Distraction Blocking",
        description: "Customizable environments that minimize external and internal distractions during focus periods."
      },
      {
        title: "Time Awareness",
        description: "Gentle time tracking and reminders that keep you aware of time passing without breaking your flow."
      },
      {
        title: "Task Boundaries",
        description: "Clear start/end parameters to help channel hyperfocus productively and prevent overworking."
      },
      {
        title: "Transition Support",
        description: "Tools to help you smoothly transition between tasks when hyperfocus makes switching difficult."
      }
    ]
  },
  {
    title: "Emotional Regulation Tools",
    description: "Features that help manage the emotional aspects of productivity and reduce anxiety around tasks.",
    badge: "Emotional Support",
    icon: Heart,
    image: "/features/emotional-tools.jpg",
    points: [
      {
        title: "Rejection Sensitivity Protection",
        description: "Positive reinforcement systems that reduce fear of failure and rejection around tasks."
      },
      {
        title: "Overwhelm Prevention",
        description: "Smart filtering and progressive disclosure to prevent the paralysis of seeing too many tasks at once."
      },
      {
        title: "Celebration Systems",
        description: "Meaningful reward mechanisms that provide dopamine boosts for completed tasks and milestones."
      },
      {
        title: "Shame-Free Resets",
        description: "Easy ways to reset and restart when you&apos;ve fallen behind, without judgment or penalty."
      }
    ]
  }
];

// Comparison features
const comparisonFeatures = [
  {
    name: "Task Organization",
    ours: "Energy-based & visual",
    oursBadge: "ADAPTIVE",
    theirs: "Linear lists & calendars"
  },
  {
    name: "Focus Support",
    ours: "Customized to attention span",
    oursBadge: "PERSONALIZED",
    theirs: "One-size-fits-all timers"
  },
  {
    name: "Thought Capture",
    ours: "Multi-format, instant capture",
    theirs: "Text-based notes only"
  },
  {
    name: "Deadline Approach",
    ours: "Flexible with smart reminders",
    theirs: "Rigid with punitive reminders"
  },
  {
    name: "Visual Thinking",
    ours: "Spatial organization & connections",
    oursBadge: "INTUITIVE",
    theirs: "Linear organization only"
  },
  {
    name: "Overwhelm Management",
    ours: "Progressive disclosure & filtering",
    theirs: "All tasks visible at once"
  },
  {
    name: "Motivation System",
    ours: "Dopamine-optimized rewards",
    oursBadge: "ENGAGING",
    theirs: "Checkbox completion only"
  }
];

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax effect for hero section
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Auto-rotate features every 5 seconds if not hovering
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div className="relative min-h-screen bg-[#FAFAFA]" ref={containerRef}>
      {/* Hero Section with Parallax */}
      <div className="relative h-[70vh] overflow-hidden flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y, opacity }}
        >
          <div className="absolute inset-0 bg-gradient-conic from-primary-100/40 via-secondary-50/40 to-primary-50/40 opacity-40 blur-3xl" />
          <div className="absolute left-1/4 top-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-200/30 to-primary-200/30 blur-xl" />
          <div className="absolute right-1/4 bottom-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-orange-200/30 to-yellow-200/30 blur-xl" />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              Features Designed for <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Neurodivergent Minds</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-12">
              Our tools are built specifically for how ADHD and neurodivergent brains actually work, not how neurotypical productivity systems think they should work.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 font-medium hover:bg-neutral-50 transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Rotating Feature Highlights */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Key Features
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Designed specifically for neurodivergent brains, our features work with your natural thinking patterns, not against them.
              </p>
            </div>
          </ScrollReveal>
          
          <div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <ScrollReveal>
              <div className="relative">
                <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl" />
                <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-neutral-200/50">
                  <div className="p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFeature}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-[300px] flex flex-col items-center justify-center text-center"
                      >
                        <div className={`w-16 h-16 rounded-full ${features[activeFeature].color} flex items-center justify-center mb-6`}>
                          {(() => {
                            const Icon = features[activeFeature].icon;
                            return <Icon className="w-8 h-8 text-white" />;
                          })()}
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                          {features[activeFeature].title}
                        </h3>
                        <p className="text-neutral-600">
                          {features[activeFeature].description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex border-t border-neutral-200">
                    {features.map((feature, idx) => (
                      <button
                        key={idx}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${
                          activeFeature === idx 
                            ? 'bg-neutral-100 text-neutral-900' 
                            : 'text-neutral-500 hover:text-neutral-700'
                        }`}
                        onClick={() => setActiveFeature(idx)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={100}>
              <div className="space-y-6">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className={`p-6 rounded-lg border transition-all cursor-pointer ${
                      activeFeature === idx
                        ? 'border-primary-500 bg-white shadow-md'
                        : 'border-neutral-200 bg-white/50 hover:bg-white hover:shadow-sm'
                    }`}
                    onClick={() => setActiveFeature(idx)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full ${feature.color} flex items-center justify-center flex-shrink-0`}>
                        {(() => {
                          const Icon = feature.icon;
                          return <Icon className="w-5 h-5 text-white" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-neutral-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      
      {/* Detailed Feature Categories */}
      <div className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Designed for Your Brain
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Our features are specifically designed to work with neurodivergent thinking patterns, not against them.
              </p>
            </div>
          </ScrollReveal>
          
          {categories.map((category, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <div className={`mb-24 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''} flex flex-col lg:flex-row gap-12 items-center`}>
                <div className="lg:w-1/2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-200 text-neutral-800 mb-4">
                    {category.badge}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                    {category.title}
                  </h3>
                  <p className="text-neutral-600 mb-8">
                    {category.description}
                  </p>
                  
                  <div className="space-y-6">
                    {category.points.map((point, pointIdx) => (
                      <motion.div
                        key={pointIdx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: pointIdx * 0.1 }}
                        viewport={{ once: true, margin: "-100px" }}
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <CheckCircle className="w-5 h-5 text-primary-500" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-neutral-900 mb-1">
                              {point.title}
                            </h4>
                            <p className="text-neutral-600">{point.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 rounded-lg text-white font-medium hover:bg-neutral-800 transition-colors mt-8"
                  >
                    Try It Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="relative lg:w-1/2">
                  <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl" />
                  <div className="relative rounded-xl overflow-hidden shadow-xl">
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
      
      {/* Comparison Table */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                How We Compare
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                See how our neurodivergent-focused approach differs from traditional productivity tools.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-lg">
            <div className="grid grid-cols-3 bg-neutral-900 text-white p-6">
              <div className="col-span-1">
                <h3 className="text-lg font-semibold">Feature</h3>
              </div>
              <div className="col-span-1 text-center">
                <h3 className="text-lg font-semibold text-primary-400">Curiosity Manager</h3>
              </div>
              <div className="col-span-1 text-center">
                <h3 className="text-lg font-semibold text-neutral-400">Traditional Tools</h3>
              </div>
            </div>
            
            {comparisonFeatures.map((feature, idx) => (
              <ScrollReveal key={idx} delay={idx * 50}>
                <div className={`grid grid-cols-3 p-6 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                  <div className="col-span-1">
                    <p className="font-medium text-neutral-900">{feature.name}</p>
                  </div>
                  <div className="col-span-1 text-center">
                    <div className="inline-flex flex-col items-center">
                      <p className="text-primary-600 font-medium">{feature.ours}</p>
                      {feature.oursBadge && (
                        <span className="mt-1 px-2 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                          {feature.oursBadge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <p className="text-neutral-500">{feature.theirs}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Try Curiosity Manager Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Have questions about our features? Find answers to common questions below.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="space-y-6">
            {/* FAQ items would go here */}
            <ScrollReveal>
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-medium text-neutral-900">
                      How is this different from other task managers?
                    </h3>
                    <span className="ml-6 flex-shrink-0 flex items-center justify-center">
                      <Plus className="h-5 w-5 text-neutral-500 group-open:hidden" />
                      <Minus className="h-5 w-5 text-neutral-500 hidden group-open:block" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-neutral-600">
                      Unlike traditional task managers that force you into rigid systems, Curiosity Manager adapts to how your brain naturally works. We offer visual organization, energy-based scheduling, and dopamine-optimized reward systems specifically designed for neurodivergent thinking patterns.
                    </p>
                  </div>
                </details>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={50}>
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-medium text-neutral-900">
                      Do I need to be diagnosed with ADHD to benefit from these features?
                    </h3>
                    <span className="ml-6 flex-shrink-0 flex items-center justify-center">
                      <Plus className="h-5 w-5 text-neutral-500 group-open:hidden" />
                      <Minus className="h-5 w-5 text-neutral-500 hidden group-open:block" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-neutral-600">
                      Not at all! While our tools are designed with neurodivergent minds in mind, many people find our flexible, visual, and adaptive approach more intuitive than traditional productivity systems. If you&apos;ve ever felt that conventional tools don&apos;t quite work for you, Curiosity Manager might be a better fit.
                    </p>
                  </div>
                </details>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-medium text-neutral-900">
                      Can I customize the features to my specific needs?
                    </h3>
                    <span className="ml-6 flex-shrink-0 flex items-center justify-center">
                      <Plus className="h-5 w-5 text-neutral-500 group-open:hidden" />
                      <Minus className="h-5 w-5 text-neutral-500 hidden group-open:block" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-neutral-600">
                      Absolutely! Customization is at the core of our philosophy. You can adjust visual elements, notification styles, reward systems, and energy tracking to match your unique cognitive style. Our Pro and Team plans offer even more advanced customization options.
                    </p>
                  </div>
                </details>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-6">
              Ready to try a productivity system that works with your brain?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start your free 14-day trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-white rounded-lg text-primary-600 font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent border border-white rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200"
              >
                Contact Sales
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
} 