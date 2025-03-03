'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, Zap, Shield, ArrowRight, HelpCircle } from 'lucide-react';
import ScrollReveal from '@/components/homepage/ScrollReveal';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Calculate savings percentage
  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12;
    const yearlyCost = yearlyPrice;
    const savings = ((monthlyCost - yearlyCost) / monthlyCost) * 100;
    return Math.round(savings);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-6 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[150%] aspect-[1/0.7] bg-gradient-conic from-primary-100/30 via-secondary-50/30 to-primary-50/30 opacity-30 blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1 space-x-2 bg-white rounded-full shadow-md mb-6">
              <span className="px-2 py-0.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
                PRICING
              </span>
              <span className="text-sm font-medium text-neutral-600">
                Simple, transparent plans
              </span>
              <Sparkles className="w-4 h-4 text-secondary-500 animate-pulse" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6">
              Find the Perfect Plan for <br />
              <span className="inline-block bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-clip-text text-transparent">
                Your Unique Mind
              </span>
            </h1>
            
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-12">
              All plans include a 14-day free trial. No credit card required to start.
              Cancel anytime with zero hassle.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 bg-neutral-100 rounded-full mb-16">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-white shadow-md text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-white shadow-md text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold text-white rounded-full bg-green-500 shadow-sm">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => {
              const isHovered = hoveredPlan === plan.id;
              const monthlyPrice = plan.price.monthly;
              const yearlyPrice = plan.price.yearly;
              const currentPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;
              const savingsPercentage = calculateSavings(monthlyPrice, yearlyPrice);
              
              return (
                <ScrollReveal key={plan.id} delay={plan.id === 'starter' ? 0 : plan.id === 'pro' ? 100 : 200}>
                  <motion.div
                    className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                      plan.popular
                        ? 'border-2 border-primary-500 shadow-xl'
                        : 'border border-neutral-200 shadow-lg'
                    }`}
                    onMouseEnter={() => setHoveredPlan(plan.id)}
                    onMouseLeave={() => setHoveredPlan(null)}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-primary-500 text-white text-center py-1.5 text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    
                    <div className={`p-8 ${plan.popular ? 'pt-12' : ''} bg-white`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${plan.iconBg} ${plan.iconColor}`}>
                          <plan.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900">{plan.name}</h3>
                      </div>
                      
                      <p className="text-neutral-600 mb-6">{plan.description}</p>
                      
                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-neutral-900">${currentPrice}</span>
                          <span className="text-neutral-500 ml-2">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                        </div>
                        
                        {billingCycle === 'yearly' && (
                          <div className="text-green-600 text-sm font-medium mt-1">
                            Save {savingsPercentage}% with annual billing
                          </div>
                        )}
                      </div>
                      
                      <Link
                        href={plan.id === 'starter' ? '/signup?plan=starter' : `/signup?plan=${plan.id}`}
                        className={`block w-full py-3 px-4 rounded-lg text-center font-medium transition-colors duration-300 ${
                          plan.popular
                            ? 'bg-primary-600 hover:bg-primary-700 text-white'
                            : plan.id === 'starter'
                              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                        }`}
                      >
                        {plan.id === 'starter' ? 'Start Free' : 'Start Free Trial'}
                      </Link>
                    </div>
                    
                    <div className="p-8 bg-neutral-50 border-t border-neutral-200">
                      <h4 className="font-semibold text-neutral-900 mb-4">What's included:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-neutral-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {plan.limitations && (
                        <>
                          <h4 className="font-semibold text-neutral-900 mt-6 mb-4">Limitations:</h4>
                          <ul className="space-y-3">
                            {plan.limitations.map((limitation, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <X className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
                                <span className="text-neutral-500">{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                    
                    {/* Hover animation */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Compare Plan Features
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Find the plan that best fits your needs with our detailed feature comparison.
              </p>
            </div>
          </ScrollReveal>

          <div className="overflow-x-auto pb-6">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left text-neutral-600 font-medium">Feature</th>
                  <th className="p-4 text-center bg-neutral-100 text-neutral-700 font-medium">
                    Starter
                  </th>
                  <th className="p-4 text-center bg-primary-50 text-primary-700 font-semibold">
                    Pro
                  </th>
                  <th className="p-4 text-center bg-neutral-900 text-white font-medium">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((feature, idx) => (
                  <tr key={feature.name} className={idx % 2 === 0 ? 'bg-neutral-50/50' : ''}>
                    <td className="p-4 text-neutral-900 font-medium border-t border-neutral-200 relative group">
                      {feature.name}
                      {feature.tooltip && (
                        <>
                          <button
                            className="ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                            onClick={() => setShowTooltip(showTooltip === feature.name ? null : feature.name)}
                            aria-label="Show more information"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>
                          
                          {showTooltip === feature.name && (
                            <div className="absolute left-0 top-full mt-2 z-10 p-3 bg-white rounded-lg shadow-lg text-sm text-neutral-700 w-64">
                              {feature.tooltip}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                    <td className="p-4 text-center border-t border-neutral-200 bg-neutral-100/50">
                      {renderFeatureValue(feature.starter)}
                    </td>
                    <td className="p-4 text-center border-t border-neutral-200 bg-primary-50/50">
                      {renderFeatureValue(feature.pro)}
                    </td>
                    <td className="p-4 text-center border-t border-neutral-200 bg-neutral-900/5">
                      {renderFeatureValue(feature.enterprise)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Have questions about our pricing? Find answers to common questions below.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer">
                      <h3 className="text-lg font-semibold text-neutral-900">{faq.question}</h3>
                      <div className="ml-4 transition-transform duration-300 group-open:rotate-180">
                        <ArrowRight className="w-5 h-5 text-neutral-500" />
                      </div>
                    </summary>
                    <div className="px-6 pb-6 text-neutral-700">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 shadow-xl">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative px-6 py-24 sm:px-24 text-center">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  Start your 14-day free trial today. No credit card required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/signup"
                    className="px-8 py-4 bg-white rounded-xl text-neutral-900 font-semibold hover:bg-neutral-50 transition-colors shadow-lg w-full sm:w-auto"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="/contact"
                    className="px-8 py-4 bg-white/10 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto"
                  >
                    Contact Sales
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

// Helper function to render feature values
function renderFeatureValue(value: boolean | string | number) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-green-500 mx-auto" />
    ) : (
      <X className="w-5 h-5 text-neutral-400 mx-auto" />
    );
  }
  
  if (typeof value === 'string') {
    return <span className="text-neutral-700">{value}</span>;
  }
  
  return <span className="text-neutral-700">{value}</span>;
}

// Pricing plan data
const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals just getting started with productivity tools.',
    price: {
      monthly: 0,
      yearly: 0
    },
    icon: Sparkles,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    popular: false,
    features: [
      'Basic task management',
      'Simple focus timer',
      'Limited mind mapping',
      'Mobile app access',
      '5 projects',
      'Community support'
    ],
    limitations: [
      'No energy tracking',
      'Limited integrations',
      'Basic analytics only'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Designed for individuals who need advanced productivity features.',
    price: {
      monthly: 12,
      yearly: 120
    },
    icon: Zap,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    popular: true,
    features: [
      'Everything in Starter',
      'Advanced task management',
      'Energy level tracking',
      'Full mind mapping capabilities',
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'All integrations'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations that need collaborative features and admin controls.',
    price: {
      monthly: 29,
      yearly: 290
    },
    icon: Shield,
    iconBg: 'bg-neutral-900',
    iconColor: 'text-white',
    popular: false,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Admin dashboard',
      'User management',
      'Advanced security',
      'Custom integrations',
      'Dedicated support',
      'Training sessions',
      'Custom branding'
    ]
  }
];

// Feature comparison data
const featureComparison = [
  {
    name: 'Task Management',
    starter: 'Basic',
    pro: 'Advanced',
    enterprise: 'Advanced + Team',
    tooltip: 'Task management includes creating, organizing, and tracking tasks.'
  },
  {
    name: 'Projects',
    starter: '5',
    pro: 'Unlimited',
    enterprise: 'Unlimited'
  },
  {
    name: 'Mind Mapping',
    starter: 'Limited',
    pro: 'Full',
    enterprise: 'Full + Collaboration',
    tooltip: 'Mind mapping allows you to visually organize your thoughts and ideas.'
  },
  {
    name: 'Focus Timer',
    starter: 'Basic',
    pro: 'Advanced',
    enterprise: 'Advanced'
  },
  {
    name: 'Energy Tracking',
    starter: false,
    pro: true,
    enterprise: true,
    tooltip: 'Track your energy levels throughout the day to optimize your productivity.'
  },
  {
    name: 'Analytics',
    starter: 'Basic',
    pro: 'Advanced',
    enterprise: 'Advanced + Team'
  },
  {
    name: 'Integrations',
    starter: '3',
    pro: 'All',
    enterprise: 'All + Custom'
  },
  {
    name: 'Mobile App',
    starter: true,
    pro: true,
    enterprise: true
  },
  {
    name: 'Team Collaboration',
    starter: false,
    pro: false,
    enterprise: true
  },
  {
    name: 'Admin Controls',
    starter: false,
    pro: false,
    enterprise: true
  },
  {
    name: 'Support',
    starter: 'Community',
    pro: 'Priority',
    enterprise: 'Dedicated'
  }
];

// FAQ data
const faqs = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new features will be immediately available. If you downgrade, the changes will take effect at the end of your current billing cycle.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, all paid plans come with a 14-day free trial. No credit card is required to start your trial. You'll only be charged if you decide to continue using the service after the trial period ends.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. For Enterprise plans, we also offer invoice-based payment options.'
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your paid features until the end of your current billing cycle. We don't offer refunds for partial billing periods.'
  },
  {
    question: 'Do you offer discounts for students or non-profits?',
    answer: 'Yes, we offer special pricing for students, educators, and non-profit organizations. Please contact our support team with verification of your status to learn more about these discounts.'
  },
  {
    question: 'What happens to my data if I downgrade?',
    answer: 'If you downgrade to a plan that has lower limits (e.g., fewer projects), you'll need to reduce your usage to meet the new plan's limits. We'll guide you through this process and give you time to make adjustments before the downgrade takes effect.'
  }
]; 