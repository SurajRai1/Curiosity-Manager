import Image from "next/image";
import Link from 'next/link';
import { ArrowRight, Brain, Sparkles, Timer, Zap, Target, Heart, Star, Lightbulb, Rocket, CheckCircle, ArrowUpRight, Plus, Minus, Users } from 'lucide-react';
import SmoothScroll from '@/components/homepage/SmoothScroll';
import ScrollToTopButton from '@/components/homepage/ScrollToTopButton';
import SectionNav from '@/components/homepage/SectionNav';
import ScrollReveal from '@/components/homepage/ScrollReveal';

// Define sections for navigation
const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFAFA] selection:bg-primary-200 selection:text-primary-900 w-full">
      {/* Add smooth scrolling behavior */}
      <SmoothScroll />
      
      {/* Add section navigation */}
      <SectionNav sections={sections} />
      
      {/* Add scroll to top button */}
      <ScrollToTopButton />
      
      {/* Decorative Elements - Optimized for performance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Reduced number of decorative elements and optimized animations */}
        <div className="absolute left-8 top-32 will-change-transform contain-paint">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-200/20 to-primary-200/20 blur-lg transform-gpu animate-float-slow" />
        </div>
        <div className="absolute right-12 top-48 will-change-transform contain-paint">
          <div className="w-36 h-36 rounded-full bg-gradient-to-r from-orange-200/20 to-yellow-200/20 blur-lg transform-gpu animate-float" />
        </div>
        <div className="absolute right-8 bottom-48 will-change-transform contain-paint">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-200/20 to-blue-200/20 blur-lg transform-gpu animate-bounce-subtle" />
        </div>
      </div>

      {/* Morphing Background Shapes - Optimized */}
      <div className="absolute inset-0 overflow-hidden w-full contain-paint">
        {/* Simplified gradient blob with reduced opacity */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] aspect-[1/0.7] bg-gradient-conic from-primary-100/30 via-secondary-50/30 to-primary-50/30 opacity-30 blur-3xl transform-gpu" />
      </div>

      {/* Main Content */}
      <div className="relative w-full">
        {/* Hero Section - Adding content-visibility for better performance */}
        <section id="hero" className="px-6 pt-32 pb-20 mx-auto w-full sm:pt-40 lg:px-8 content-visibility-auto contain-layout">
          <div className="relative z-10 w-full max-w-[2000px] mx-auto">
            {/* Enhanced Badge */}
            <ScrollReveal>
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center px-3 py-1 space-x-2 bg-white rounded-full shadow-md">
                  <span className="px-2 py-0.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
                    NEW
                  </span>
                  <span className="text-sm font-medium text-neutral-600">
                    Designed for ADHD & Neurodivergent Minds
                  </span>
                  <Sparkles className="w-4 h-4 text-secondary-500 animate-pulse" />
                </div>
              </div>
            </ScrollReveal>

            {/* Main Heading */}
            <ScrollReveal delay={200}>
              <div className="text-center">
                <h1 className="text-5xl font-bold tracking-tight text-neutral-900 sm:text-7xl">
                  <span className="inline-block mb-2 text-neutral-600">Transform Chaos into</span>
                  <br />
                  <span className="inline-block bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-clip-text text-transparent pb-4">
                    Structured Progress
                  </span>
                </h1>
                <p className="mt-6 text-xl leading-8 text-neutral-600 max-w-2xl mx-auto">
                  Curiosity Manager helps you harness your ADHD superpowers. Turn scattered thoughts into actionable plans, without fighting against your natural workflow.
                </p>
              </div>
            </ScrollReveal>

            {/* CTA Section */}
            <ScrollReveal delay={400}>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
                >
                  Start Free Trial
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </Link>
                <div className="relative group">
                  <Link 
                    href="#demo" 
                    className="inline-flex items-center gap-2 px-6 py-4 text-neutral-700 font-semibold transition-colors duration-300 group-hover:text-primary-600"
                  >
                    Watch Demo
                    <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-300">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Stats Section */}
            <ScrollReveal delay={600}>
              <div className="mt-16 pt-8 border-t border-neutral-200">
                <dl className="grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-3 text-center">
                  {stats.map((stat) => (
                    <div key={stat.name} className="mx-auto">
                      <dt className="text-base leading-7 text-neutral-600">{stat.name}</dt>
                      <dd className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features Grid - Adding containment */}
        <section id="features" className="relative py-24 sm:py-32 bg-white w-full contain-layout">
          <div className="mx-auto w-full px-6 lg:px-8 max-w-[2000px]">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center">
                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-primary-50 text-primary-600">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">Smart Features for Your Mind</span>
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-neutral-900">
                  Tools That Understand
                  <br />
                  <span className="text-primary-600">How You Think</span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, idx) => (
                <ScrollReveal key={feature.name} delay={idx * 100}>
                  <div className="relative group">
                    <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 blur-xl transition duration-300 group-hover:opacity-10" />
                    <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:shadow-xl">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900">{feature.name}</h3>
                      </div>
                      <p className="mt-4 text-neutral-600 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {feature.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section - Adding containment */}
        <section id="benefits" className="relative py-24 sm:py-32 w-full contain-layout">
          <div className="mx-auto w-full px-6 lg:px-8 max-w-[2000px]">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 px-6 py-20 shadow-2xl sm:px-24 xl:py-32">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,50%,white)]" />
              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Embrace Your Natural Flow
                </h2>
                <p className="mt-6 text-lg leading-8 text-neutral-300">
                  We believe ADHD isn't a deficit – it's a different way of processing the world. Our tools are designed to enhance your natural strengths.
                </p>
              </div>
              <div className="mx-auto mt-16 grid max-w-lg gap-8 sm:mt-20 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.name}
                    className="relative overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-600">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold leading-8 text-white">
                          {benefit.name}
                        </h3>
                        <p className="mt-2 text-base leading-7 text-neutral-300">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Adding containment and optimizing animations */}
        <section id="testimonials" className="relative py-24 sm:py-32 bg-gradient-to-b from-white to-neutral-50 contain-layout">
          <div className="mx-auto w-full px-6 lg:px-8 max-w-[2000px]">
            <div className="mx-auto max-w-2xl text-center mb-20">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-secondary-50 text-secondary-600 hover:bg-secondary-100 transition-colors duration-300 cursor-default group">
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium">From Our Community</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-neutral-900 mb-6">
                Stories from
                <br />
                <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
                  People Like You
                </span>
              </h2>
              <p className="text-lg text-neutral-600 max-w-xl mx-auto">
                Join thousands of neurodivergent minds who've found their flow with Curiosity Manager
              </p>
            </div>

            <div className="mx-auto mt-16 grid gap-8 sm:mt-20 md:grid-cols-2 lg:grid-cols-3 perspective-1000">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="relative group transform-gpu transition-transform duration-300 hover:scale-105 contain-paint"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-10 transform transition-all duration-300 blur-xl" />
                  <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative w-12 h-12 ring-2 ring-primary-100 rounded-full">
        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">{testimonial.name}</h3>
                        <p className="text-sm text-neutral-600">{testimonial.title}</p>
                      </div>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{testimonial.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section - Adding containment and optimizing transforms */}
        <section id="pricing" className="relative py-24 sm:py-32 w-full overflow-hidden contain-layout">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/50 to-white/50 backdrop-blur-3xl" />
          <div className="relative mx-auto w-full px-6 lg:px-8 max-w-[2000px]">
            <div className="mx-auto max-w-2xl text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight text-neutral-900 mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-neutral-600 max-w-xl mx-auto">
                Start free, upgrade when you're ready. No hidden fees or surprises.
              </p>
            </div>

            <div className="mx-auto grid max-w-lg gap-8 lg:max-w-none lg:grid-cols-3 perspective-1000">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative group transform-gpu transition-transform duration-300 hover:scale-105 ${
                    plan.featured ? 'lg:-translate-y-4' : ''
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`relative rounded-2xl p-8 ${
                    plan.featured
                      ? 'bg-gradient-to-br from-primary-900 to-secondary-900 text-white shadow-xl'
                      : 'bg-white text-neutral-900 shadow-lg'
                  }`}
                >
                    {plan.featured && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white text-sm font-semibold shadow-lg">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                    <p className={`text-sm mb-8 ${plan.featured ? 'text-neutral-200' : 'text-neutral-600'}`}>
                      {plan.description}
                    </p>
                    <div className="mb-8">
                      <span className="text-5xl font-bold">${plan.price}</span>
                      <span className={`${plan.featured ? 'text-neutral-200' : 'text-neutral-600'}`}>/month</span>
                    </div>
                    <ul className="mb-8 space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.featured ? 'text-primary-300' : 'text-primary-600'}`} />
                          <span className={`${plan.featured ? 'text-neutral-200' : 'text-neutral-700'}`}>{feature}</span>
          </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.href}
                      className={`block w-full rounded-xl px-6 py-4 text-center text-sm font-semibold transition-all duration-300 ${
                        plan.featured
                          ? 'bg-white text-neutral-900 hover:bg-neutral-100 hover:scale-105 transform'
                          : 'bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-105 transform'
                      }`}
                    >
                      {plan.buttonText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - Adding containment */}
        <section id="faq" className="relative py-24 sm:py-32 bg-white contain-layout">
          <div className="mx-auto w-full px-6 lg:px-8 max-w-[2000px]">
            <div className="mx-auto max-w-2xl text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight text-neutral-900 mb-6">
                Common Questions
              </h2>
              <p className="text-lg text-neutral-600 max-w-xl mx-auto">
                Everything you need to know about getting started
              </p>
            </div>

            <div className="mx-auto max-w-3xl divide-y divide-neutral-200">
              {faqs.map((faq, index) => (
                <div 
                  key={faq.question} 
                  className="py-6"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <details className="group">
                    <summary className="flex w-full cursor-pointer items-center justify-between text-lg font-semibold text-neutral-900 hover:text-primary-600 transition-colors duration-300">
                      {faq.question}
                      <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full border-2 border-neutral-200 bg-white group-open:bg-primary-50 group-open:border-primary-200 transition-all duration-300">
                        <Plus className="h-5 w-5 text-neutral-600 group-open:hidden transition-transform duration-300" />
                        <Minus className="hidden h-5 w-5 text-primary-600 group-open:block transition-transform duration-300" />
                      </span>
                    </summary>
                    <p className="mt-4 text-neutral-600 leading-relaxed pl-0 lg:pl-6 animate-fadeDown">
                      {faq.answer}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section - Optimizing transform */}
        <section id="cta" className="relative py-24 sm:py-32 w-full overflow-hidden contain-layout">
          <div className="mx-auto w-full px-6 lg:px-8 max-w-[2000px]">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 transform-gpu transition-transform duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-grid-white/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 backdrop-blur-3xl" />
              <div className="relative px-6 py-24 sm:px-24 sm:py-32">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                    Ready to Transform Your Workflow?
                  </h2>
                  <p className="text-lg text-neutral-100 mb-10 max-w-xl mx-auto">
                    Join thousands of ADHD minds who've found their flow with Curiosity Manager.
                  </p>
                  <div className="flex items-center justify-center gap-6 flex-col sm:flex-row">
                    <Link
                      href="/signup"
                      className="rounded-xl bg-white px-8 py-4 text-base font-semibold text-neutral-900 shadow-lg hover:bg-neutral-50 transition-all duration-300 hover:scale-105 hover:shadow-xl w-full sm:w-auto"
                    >
                      Start Free Trial
                    </Link>
                    <Link
                      href="/contact"
                      className="text-base font-semibold text-white hover:text-neutral-100 transition-colors duration-300 flex items-center gap-2 group w-full sm:w-auto justify-center"
                    >
                      Contact Sales
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative w-full bg-neutral-900 text-neutral-200 pt-16 pb-8 overflow-hidden">
          <div className="mx-auto w-full px-6 lg:px-8 max-w-[2000px]">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 mb-12">
              {/* Brand Column */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-x-2 mb-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                    Curiosity Manager
                  </span>
                </div>
                <p className="text-neutral-400 max-w-sm mb-6">
                  Empowering ADHD and neurodivergent minds to harness their unique strengths and transform chaos into structured progress.
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200"
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5 text-neutral-400 hover:text-white transition-colors duration-200" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-3">
                  {productLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-neutral-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-3">
                  {companyLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-neutral-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Stay Updated</h3>
                <p className="text-neutral-400 mb-4">
                  Get tips, updates, and neurodiversity insights in your inbox.
                </p>
                <form className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold hover:opacity-90 transition-opacity duration-200"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 mt-8 border-t border-neutral-800">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-neutral-500 text-sm">
                  © {new Date().getFullYear()} Curiosity Manager. All rights reserved.
                </p>
                <div className="flex gap-6">
                  {legalLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </footer>
      </div>
    </div>
  );
}

const stats = [
  { name: 'Active Users', value: '20,000+' },
  { name: 'Tasks Completed', value: '1.2M+' },
  { name: 'Time Saved', value: '40%' },
];

const features = [
  {
    name: 'Smart Time Blocks',
    description: "AI-powered scheduling that adapts to your energy levels and focus patterns. Work when you're at your best.",
    icon: Timer,
    tags: ['AI-Powered', 'Energy-Aware', 'Flexible'],
  },
  {
    name: 'Thought Catcher',
    description: 'Capture ideas instantly without losing focus. Our smart system categorizes and prioritizes them for you.',
    icon: Sparkles,
    tags: ['Quick Capture', 'Auto-Organize', 'Distraction-Free'],
  },
  {
    name: 'Flow State Tools',
    description: 'Visual workflows and dopamine-friendly progress tracking that keeps you motivated and focused.',
    icon: Brain,
    tags: ['Visual Progress', 'Gamified', 'Adaptive'],
  },
];

const benefits = [
  {
    name: 'Hyperfocus Mode',
    description: 'Harness your hyperfocus with tools that eliminate distractions and maximize your peak productivity periods.',
    icon: Target,
  },
  {
    name: 'Guilt-Free Progress',
    description: "No more shame spirals. Our system celebrates progress over perfection, helping you build consistent habits.",
    icon: Heart,
  },
  {
    name: 'Energy Mapping',
    description: 'Match tasks to your energy levels. Work with your natural rhythms instead of fighting against them.',
    icon: Zap,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    title: "Software Developer",
    avatar: "/avatars/sarah.jpg",
    content: "Finally, a tool that understands how my ADHD brain works! The visual workflows and flexible scheduling have been game-changing for my productivity."
  },
  {
    name: "Marcus Rodriguez",
    title: "Creative Director",
    avatar: "/avatars/marcus.jpg",
    content: "The Thought Catcher feature is brilliant. I can capture ideas without breaking focus, and the AI helps me organize them naturally."
  },
  {
    name: "Alex Thompson",
    title: "Product Manager",
    avatar: "/avatars/alex.jpg",
    content: "As someone with ADHD, traditional task managers never worked for me. Curiosity Manager's energy-aware scheduling is exactly what I needed."
  },
];

const plans = [
  {
    name: "Starter",
    description: "Perfect for getting started with basic organization",
    price: "0",
    featured: false,
    href: "/signup",
    buttonText: "Start Free",
    features: [
      "Basic task management",
      "Simple time blocking",
      "3 project spaces",
      "Community support"
    ]
  },
  {
    name: "Pro",
    description: "Everything you need for peak productivity",
    price: "12",
    featured: true,
    href: "/signup/pro",
    buttonText: "Start Free Trial",
    features: [
      "Advanced AI scheduling",
      "Unlimited project spaces",
      "Energy mapping tools",
      "Priority support",
      "Custom workflows",
      "Analytics dashboard"
    ]
  },
  {
    name: "Team",
    description: "Collaborative features for teams",
    price: "29",
    featured: false,
    href: "/signup/team",
    buttonText: "Contact Sales",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Admin controls",
      "Custom integrations",
      "Training sessions"
    ]
  }
];

const faqs = [
  {
    question: "How is this different from other task managers?",
    answer: "Curiosity Manager is specifically designed for ADHD and neurodivergent minds. We focus on flexible workflows, energy-based scheduling, and reducing cognitive load - rather than rigid systems that fight against your natural way of thinking."
  },
  {
    question: "Do I need to be diagnosed with ADHD to use this?",
    answer: "Not at all! While we designed Curiosity Manager with ADHD minds in mind, our tools are helpful for anyone who wants a more flexible, intuitive way to manage tasks and projects."
  },
  {
    question: "Can I try it before committing?",
    answer: "Yes! We offer a fully-featured 14-day trial of our Pro plan, no credit card required. You can also start with our free Starter plan and upgrade whenever you're ready."
  },
  {
    question: "What if I need help getting started?",
    answer: "We provide extensive onboarding support, including guided tutorials, video walkthroughs, and direct access to our support team. We're here to help you succeed!"
  }
];

const socialLinks = [
  { name: 'Twitter', href: '#', icon: (props) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg> },
  { name: 'GitHub', href: '#', icon: (props) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg> },
  { name: 'LinkedIn', href: '#', icon: (props) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
];

const productLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Resources', href: '/resources' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Support', href: '/support' },
];

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Careers', href: '/careers' },
  { name: 'Press', href: '/press' },
  { name: 'Partners', href: '/partners' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
  { name: 'Accessibility', href: '/accessibility' },
];
