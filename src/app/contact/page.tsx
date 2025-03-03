'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Twitter,
  Instagram,
  Linkedin,
  Github
} from 'lucide-react';
import ScrollReveal from '@/components/homepage/ScrollReveal';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (name: string) => {
    setActiveInput(name);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would send the form data to your backend
    setFormState('submitting');
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll just simulate a successful submission
      setFormState('success');
      
      // Reset form after success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset form state after 3 seconds
      setTimeout(() => {
        setFormState('idle');
      }, 3000);
    }, 1500);
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
                CONTACT
              </span>
              <span className="text-sm font-medium text-neutral-600">
                We&apos;d love to hear from you
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6">
              Get in Touch With <br />
              <span className="inline-block bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-clip-text text-transparent">
                Our Team
              </span>
            </h1>
            
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Have questions, feedback, or just want to say hello? We&apos;re here to help!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Form and Info Section */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary-100 text-primary-600">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">Email</h3>
                        <p className="text-neutral-600">hello@curiositymanager.com</p>
                        <p className="text-neutral-600">support@curiositymanager.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-secondary-100 text-secondary-600">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">Phone</h3>
                        <p className="text-neutral-600">+1 (555) 123-4567</p>
                        <p className="text-neutral-600">Mon-Fri, 9am-5pm PT</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">Office</h3>
                        <p className="text-neutral-600">123 Innovation Way</p>
                        <p className="text-neutral-600">San Francisco, CA 94107</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-green-100 text-green-600">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">Live Chat</h3>
                        <p className="text-neutral-600">Available on our website</p>
                        <p className="text-neutral-600">Mon-Fri, 9am-5pm PT</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-neutral-200">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                      Follow Us
                    </h3>
                    <div className="flex gap-4">
                      <a 
                        href="https://twitter.com/curiositymanager" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a 
                        href="https://instagram.com/curiositymanager" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a 
                        href="https://linkedin.com/company/curiositymanager" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a 
                        href="https://github.com/curiositymanager" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={200}>
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    Send Us a Message
                  </h2>
                  
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative">
                        <label 
                          htmlFor="name" 
                          className={`absolute left-4 transition-all duration-200 ${
                            activeInput === 'name' || formData.name 
                              ? '-top-2 text-xs bg-white px-1 text-primary-600' 
                              : 'top-3 text-neutral-500'
                          }`}
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={() => handleInputFocus('name')}
                          onBlur={handleInputBlur}
                          className={`w-full p-3 rounded-lg border ${
                            activeInput === 'name' 
                              ? 'border-primary-500 ring-1 ring-primary-500' 
                              : 'border-neutral-300'
                          } focus:outline-none`}
                          required
                        />
                      </div>
                      
                      <div className="relative">
                        <label 
                          htmlFor="email" 
                          className={`absolute left-4 transition-all duration-200 ${
                            activeInput === 'email' || formData.email 
                              ? '-top-2 text-xs bg-white px-1 text-primary-600' 
                              : 'top-3 text-neutral-500'
                          }`}
                        >
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={() => handleInputFocus('email')}
                          onBlur={handleInputBlur}
                          className={`w-full p-3 rounded-lg border ${
                            activeInput === 'email' 
                              ? 'border-primary-500 ring-1 ring-primary-500' 
                              : 'border-neutral-300'
                          } focus:outline-none`}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label 
                        htmlFor="subject" 
                        className={`absolute left-4 transition-all duration-200 ${
                          activeInput === 'subject' || formData.subject 
                            ? '-top-2 text-xs bg-white px-1 text-primary-600' 
                            : 'top-3 text-neutral-500'
                        }`}
                      >
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('subject')}
                        onBlur={handleInputBlur}
                        className={`w-full p-3 rounded-lg border ${
                          activeInput === 'subject' 
                            ? 'border-primary-500 ring-1 ring-primary-500' 
                            : 'border-neutral-300'
                        } focus:outline-none appearance-none bg-white`}
                        required
                      >
                        <option value="" disabled>Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="feedback">Product Feedback</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="relative">
                      <label 
                        htmlFor="message" 
                        className={`absolute left-4 transition-all duration-200 ${
                          activeInput === 'message' || formData.message 
                            ? '-top-2 text-xs bg-white px-1 text-primary-600' 
                            : 'top-3 text-neutral-500'
                        }`}
                      >
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('message')}
                        onBlur={handleInputBlur}
                        className={`w-full p-3 rounded-lg border ${
                          activeInput === 'message' 
                            ? 'border-primary-500 ring-1 ring-primary-500' 
                            : 'border-neutral-300'
                        } focus:outline-none min-h-[150px]`}
                        required
                      />
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={formState === 'submitting'}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                          formState === 'submitting'
                            ? 'bg-primary-400 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700'
                        }`}
                      >
                        {formState === 'submitting' ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : formState === 'success' ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Message Sent!
                          </>
                        ) : formState === 'error' ? (
                          <>
                            <AlertCircle className="w-5 h-5" />
                            Error Sending
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  
                  {formState === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Message sent successfully!</p>
                        <p className="text-sm">We'll get back to you as soon as possible.</p>
                      </div>
                    </motion.div>
                  )}
                  
                  {formState === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">There was an error sending your message.</p>
                        <p className="text-sm">Please try again or contact us directly via email.</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Find quick answers to common questions about contacting us.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            {contactFaqs.map((faq, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="bg-neutral-50 rounded-xl shadow-sm overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer">
                      <h3 className="text-lg font-semibold text-neutral-900">{faq.question}</h3>
                      <div className="ml-4 transition-transform duration-300 group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-neutral-500">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
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

      {/* Map Section */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Visit Our Office
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                We&apos;re located in the heart of San Francisco&apos;s tech district.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] relative">
            {/* In a real application, you would embed a Google Map or similar here */}
            <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
              <p className="text-neutral-600 text-lg">
                Interactive map would be embedded here
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-neutral-700">
              123 Innovation Way, San Francisco, CA 94107
            </p>
            <p className="text-neutral-600 mt-2">
              Open Monday-Friday, 9am-5pm PT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ data
const contactFaqs = [
  {
    question: 'What\'s the best way to contact support?',
    answer: 'For the fastest response, we recommend using the contact form on this page or emailing support@curiositymanager.com. For urgent issues, you can also call our support line at +1 (555) 123-4567 during business hours (Monday-Friday, 9am-5pm PT).'
  },
  {
    question: 'How quickly will I receive a response?',
    answer: 'We aim to respond to all inquiries within 24 business hours. For support requests, we prioritize based on urgency, but you can generally expect an initial response within a few hours during business hours.'
  },
  {
    question: 'Can I schedule a demo of your product?',
    answer: 'Absolutely! You can request a demo through the contact form (select &quot;Partnership Opportunity&quot; as the subject) or by emailing hello@curiositymanager.com. Please include your preferred date and time, and we\'ll do our best to accommodate your schedule.'
  },
  {
    question: 'Do you offer phone support?',
    answer: 'Yes, we offer phone support for all paid plans. Free users can access email support and our comprehensive knowledge base. Our phone support hours are Monday-Friday, 9am-5pm PT.'
  },
  {
    question: 'How can I provide feedback about the product?',
    answer: 'We love hearing from our users! You can provide feedback through the contact form (select &quot;Product Feedback&quot; as the subject), by emailing feedback@curiositymanager.com, or through the feedback option in the app itself.'
  }
]; 