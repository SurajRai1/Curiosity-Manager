'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Brain, Sparkles, Timer, Zap, Target, Heart, Lightbulb, CheckCircle, Plus, Minus, ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/homepage/ScrollReveal';

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
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1 space-x-2 bg-white rounded-full shadow-md mb-6">
              <span className="px-2 py-0.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
                FEATURES
              </span>
              <span className="text-sm font-medium text-neutral-600">
                Designed for neurodivergent minds
              </span>
              <Sparkles className="w-4 h-4 text-secondary-500 animate-pulse" />
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-neutral-900 mb-6">
              <span className="inline-block bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-clip-text text-transparent">
                Tools That Work With Your Brain
              </span>
            </h1>
            
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              We've designed every feature to complement neurodivergent thinking patterns, not fight against them. Discover how Curiosity Manager adapts to your unique mind.
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
      </div>

      {/* Interactive Feature Showcase */}
      <div className="py-24 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-primary-50 text-primary-600">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">Explore Our Features</span>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Designed for <span className="text-primary-600">Your Unique Mind</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Click on any feature to see it in action, or simply watch as we showcase each one.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <div className="lg:col-span-1 space-y-4">
            {features.map((feature, idx) => (
              <ScrollReveal key={feature.title} delay={idx * 100}>
                <motion.div
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeFeature === idx 
                      ? 'bg-white shadow-lg scale-105' 
                      : 'bg-neutral-50 hover:bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveFeature(idx)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${activeFeature === idx ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">{feature.title}</h3>
                      <p className="text-neutral-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-8 h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                      <features[activeFeature].icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900">{features[activeFeature].title}</h3>
                  </div>
                  
                  <div className="relative flex-1 rounded-xl overflow-hidden bg-neutral-50 mb-6">
                    <Image
                      src={features[activeFeature].image}
                      alt={features[activeFeature].title}
                      width={800}
                      height={500}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 mb-3">Key Benefits:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {features[activeFeature].benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-neutral-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="space-y-32">
          {categories.map((category, idx) => (
            <ScrollReveal key={category.title} delay={150}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                idx % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}>
                <div className={idx % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-secondary-50 text-secondary-600">
                    <category.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.badge}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-900 mb-4">{category.title}</h2>
                  <p className="text-lg text-neutral-600 mb-6">{category.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    {category.points.map((point, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="p-1 rounded-full bg-primary-100 text-primary-600 mt-1">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-900">{point.title}</h4>
                          <p className="text-neutral-600">{point.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 rounded-lg text-white font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Try It Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="relative">
                  <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl" />
                  <div className="relative rounded-xl overflow-hidden shadow-xl">
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Interactive Feature Comparison */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-secondary-50 text-secondary-600">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Why We're Different</span>
              </div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                Designed <span className="text-primary-600">Differently</span>
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                See how our features compare to traditional productivity tools that weren't designed for neurodivergent minds.
              </p>
            </div>
          </ScrollReveal>

          <div className="overflow-x-auto pb-6">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left text-neutral-600 font-medium">Feature</th>
                  <th className="p-4 text-center bg-primary-50 rounded-tl-lg text-primary-700 font-semibold">
                    Curiosity Manager
                  </th>
                  <th className="p-4 text-center bg-neutral-100 rounded-tr-lg text-neutral-700 font-medium">
                    Traditional Tools
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr key={feature.name} className={idx % 2 === 0 ? 'bg-neutral-50/50' : ''}>
                    <td className="p-4 text-neutral-900 font-medium border-t border-neutral-200">
                      {feature.name}
                    </td>
                    <td className="p-4 text-center border-t border-neutral-200 bg-primary-50/50">
                      <div className="flex items-center justify-center">
                        <span className="text-primary-700">{feature.ours}</span>
                        {feature.oursBadge && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
                            {feature.oursBadge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center border-t border-neutral-200 bg-neutral-100/50 text-neutral-600">
                      {feature.theirs}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="p-4 border-t border-neutral-200"></td>
                  <td className="p-4 text-center border-t border-neutral-200 bg-primary-50 rounded-bl-lg">
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 rounded-lg text-white font-medium hover:bg-primary-700 transition-colors w-full"
                    >
                      Try For Free
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </td>
                  <td className="p-4 text-center border-t border-neutral-200 bg-neutral-100 rounded-br-lg"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 shadow-xl">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative px-6 py-24 sm:px-24 text-center">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Ready to Experience the Difference?
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  Join thousands of neurodivergent minds who've found their flow with Curiosity Manager.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/signup"
                    className="px-8 py-4 bg-white rounded-xl text-neutral-900 font-semibold hover:bg-neutral-50 transition-colors shadow-lg w-full sm:w-auto"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="/pricing"
                    className="px-8 py-4 bg-white/10 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto"
                  >
                    View Pricing
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature data
const features = [
  {
    title: "Adaptive Task System",
    description: "Tasks that adapt to your energy levels and focus state",
    icon: Zap,
    image: "/features/adaptive-tasks.jpg",
    benefits: [
      "Matches tasks to your current energy level",
      "Reduces overwhelm with smart prioritization",
      "Adapts deadlines based on your work patterns",
      "Visual progress tracking for dopamine boosts"
    ]
  },
  {
    title: "Mind Space",
    description: "Visual thought organization that works like your brain does",
    icon: Brain,
    image: "/features/mind-space.jpg",
    benefits: [
      "Capture thoughts in any format (text, image, audio)",
      "Connect ideas visually with flexible linking",
      "Zoom in/out to manage detail overwhelm",
      "AI-assisted organization of scattered thoughts"
    ]
  },
  {
    title: "Focus Timer",
    description: "Customizable focus sessions with built-in dopamine rewards",
    icon: Timer,
    image: "/features/focus-timer.jpg",
    benefits: [
      "Adjustable time blocks for different attention spans",
      "Visual and audio cues to maintain engagement",
      "Integrated breaks with movement prompts",
      "Streak tracking for motivation and consistency"
    ]
  },
  {
    title: "Energy Mapping",
    description: "Track and leverage your natural energy patterns",
    icon: Target,
    image: "/features/energy-mapping.jpg",
    benefits: [
      "Visualize your energy patterns over time",
      "Schedule tasks during your optimal hours",
      "Reduce guilt by working with your rhythms",
      "Identify factors affecting your productivity"
    ]
  },
  {
    title: "Thought Catcher",
    description: "Capture ideas instantly without losing focus",
    icon: Sparkles,
    image: "/features/thought-catcher.jpg",
    benefits: [
      "Quick-capture interface for fleeting thoughts",
      "Auto-categorization of captured ideas",
      "Distraction-free input methods",
      "Seamless integration with your projects"
    ]
  },
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
        description: "Match tasks to your current energy level - creative work when you're inspired, routine tasks when you're not."
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
        description: "Easy ways to reset and restart when you've fallen behind, without judgment or penalty."
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