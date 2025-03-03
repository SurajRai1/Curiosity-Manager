'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Heart, Lightbulb, Brain, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/homepage/ScrollReveal';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]" ref={containerRef}>
      {/* Hero Section with Parallax */}
      <div className="relative h-[70vh] overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y, opacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary-600/20 to-secondary-500/20" />
          <Image
            src="/about/team-hero.jpg" 
            alt="Our diverse team collaborating"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-3 py-1 space-x-2 bg-white rounded-full shadow-md mb-6">
              <span className="px-2 py-0.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
                ABOUT US
              </span>
              <span className="text-sm font-medium text-neutral-600">
                Our story and mission
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 drop-shadow-md">
              Reimagining Productivity for <br />
              <span className="inline-block bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
                Neurodivergent Minds
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-sm">
              We&apos;re building tools that work with your brain, not against it.
              Founded by neurodivergent individuals for neurodivergent individuals.
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
      </div>

      {/* Our Story Section */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-neutral-700">
                  <p>
                    Curiosity Manager was born from frustration. As individuals with ADHD, we struggled with traditional productivity tools that seemed designed for neurotypical brains. They were either too rigid, too complex, or simply didn&apos;t account for how our minds actually work.
                  </p>
                  <p>
                    In 2022, our founder, who had spent years trying to &quot;fix&quot; their productivity challenges, had a realization: the problem wasn&apos;t their brain - it was the tools. What if, instead of forcing neurodivergent people to adapt to neurotypical systems, we created tools specifically designed for how our minds naturally function?
                  </p>
                  <p>
                    That question led to months of research, interviews with hundreds of neurodivergent individuals, and countless prototypes. The result is Curiosity Manager—a productivity platform that embraces neurodivergent traits as strengths rather than weaknesses.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <Image
                  src="/about/founder-story.jpg"
                  alt="Our founder working on early prototypes"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent flex items-end">
                  <div className="p-6">
                    <p className="text-white text-lg font-medium">
                      &quot;We&apos;re not just building software; we&apos;re creating a new paradigm for productivity.&quot;
                    </p>
                    <p className="text-white/80 mt-2">
                      — Alex Chen, Founder
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                We&apos;re on a mission to transform how neurodivergent individuals interact with productivity tools.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {missionPoints.map((point, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="bg-neutral-50 rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className={`p-3 rounded-lg ${point.iconBg} ${point.iconColor} w-fit mb-6`}>
                    <point.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {point.title}
                  </h3>
                  <p className="text-neutral-700">
                    {point.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                We&apos;re a diverse group of neurodivergent thinkers, designers, and engineers passionate about creating tools that work for all types of minds.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <ScrollReveal key={idx} delay={idx * 50}>
                <div className="group">
                  <div className="relative rounded-xl overflow-hidden aspect-square mb-4 shadow-md">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4">
                        <p className="text-white text-sm">
                          {member.funFact}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    {member.name}
                  </h3>
                  <p className="text-neutral-600">
                    {member.role}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Our Values
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                These core principles guide everything we do at Curiosity Manager.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 hover:border-primary-300 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 flex items-center">
                    <span className="text-3xl text-primary-500 mr-2">{idx + 1}.</span>
                    {value.title}
                  </h3>
                  <p className="text-neutral-700">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 shadow-xl">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative px-6 py-24 sm:px-24 text-center">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Join Our Mission
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  We&apos;re always looking for passionate individuals to join our team. Check out our open positions or reach out to learn more.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/careers"
                    className="px-8 py-4 bg-white rounded-xl text-neutral-900 font-semibold hover:bg-neutral-50 transition-colors shadow-lg w-full sm:w-auto"
                  >
                    View Open Positions
                  </Link>
                  <Link
                    href="/contact"
                    className="px-8 py-4 bg-white/10 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto"
                  >
                    Contact Us
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

// Mission points data
const missionPoints = [
  {
    title: 'Embrace Neurodiversity',
    description: 'We believe neurodivergent traits are strengths to be harnessed, not problems to be fixed. Our tools are designed to work with different cognitive styles, not against them.',
    icon: Brain,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600'
  },
  {
    title: 'Empower Through Design',
    description: 'We create intuitive, flexible tools that adapt to your unique way of thinking and working, helping you harness your natural strengths and manage challenges.',
    icon: Lightbulb,
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600'
  },
  {
    title: 'Build Community',
    description: 'We\'re fostering a supportive community where neurodivergent individuals can connect, share strategies, and celebrate their unique perspectives.',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  }
];

// Team members data
const teamMembers = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    image: '/about/team-1.jpg',
    funFact: 'Has 17 different hobbies and rotates through them based on current hyperfocus.'
  },
  {
    name: 'Jamie Rodriguez',
    role: 'Chief Product Officer',
    image: '/about/team-2.jpg',
    funFact: 'Can explain complex systems with perfect clarity but often forgets where they put their keys.'
  },
  {
    name: 'Sam Washington',
    role: 'Lead Designer',
    image: '/about/team-3.jpg',
    funFact: 'Creates the most organized designs while maintaining a chaotically creative workspace.'
  },
  {
    name: 'Taylor Kim',
    role: 'Head of Engineering',
    image: '/about/team-4.jpg',
    funFact: 'Writes code in 4-hour bursts of hyperfocus, usually between midnight and 4 AM.'
  },
  {
    name: 'Jordan Patel',
    role: 'User Research Lead',
    image: '/about/team-5.jpg',
    funFact: 'Has interviewed over 500 neurodivergent individuals to understand their unique workflows.'
  },
  {
    name: 'Morgan Lee',
    role: 'Community Manager',
    image: '/about/team-6.jpg',
    funFact: 'Can remember every community member\'s name but often forgets what day it is.'
  },
  {
    name: 'Casey Wilson',
    role: 'Content Strategist',
    image: '/about/team-7.jpg',
    funFact: 'Writes the most engaging content when bouncing on an exercise ball.'
  },
  {
    name: 'Riley Johnson',
    role: 'Customer Success',
    image: '/about/team-8.jpg',
    funFact: 'Has created 27 different organizational systems and uses them all simultaneously.'
  }
];

// Values data
const values = [
  {
    title: 'Neurodiversity as Strength',
    description: 'We see neurodivergent traits as valuable perspectives that drive innovation and creativity. Our products are built on the premise that different cognitive styles are assets, not liabilities.'
  },
  {
    title: 'Adaptability Over Rigidity',
    description: 'We design flexible systems that adapt to how you work, not the other way around. Our tools mold to your natural workflows and preferences.'
  },
  {
    title: 'Transparency and Honesty',
    description: 'We\'re committed to clear communication and ethical practices in everything we do, from how we build our products to how we interact with our community.'
  },
  {
    title: 'Continuous Learning',
    description: 'We\'re constantly researching, testing, and refining our understanding of neurodivergent needs to create better, more intuitive tools.'
  },
  {
    title: 'Accessibility First',
    description: 'We believe productivity tools should be accessible to everyone. We design with accessibility as a core principle, not an afterthought.'
  },
  {
    title: 'Community-Driven',
    description: 'Our users are our partners in development. We actively seek and incorporate feedback from our community to ensure our tools truly meet their needs.'
  }
]; 