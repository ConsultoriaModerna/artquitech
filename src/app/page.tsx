'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Video,
  Cpu,
  Hammer,
  Ruler,
  Box,
  Glasses,
  ShoppingCart,
  Globe,
  Move,
  Check,
} from 'lucide-react';

// Animated Counter Component
function AnimatedCounter() {
  const [count, setCount] = useState(0);
  const target = 12847;

  useEffect(() => {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="text-center mt-16"
    >
      <p className="text-sm uppercase tracking-widest text-gray-400">This month</p>
      <p className="text-4xl md:text-5xl font-playfair font-bold text-[#c9a96e] mt-2">
        {count.toLocaleString()}
      </p>
      <p className="text-gray-400 mt-2">m² designed</p>
    </motion.div>
  );
}

// Section with scroll animation
function AnimatedSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Grid background pattern
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(201, 169, 110, 0.05) 25%, rgba(201, 169, 110, 0.05) 26%, transparent 27%, transparent 74%, rgba(201, 169, 110, 0.05) 75%, rgba(201, 169, 110, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(201, 169, 110, 0.05) 25%, rgba(201, 169, 110, 0.05) 26%, transparent 27%, transparent 74%, rgba(201, 169, 110, 0.05) 75%, rgba(201, 169, 110, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <motion.div
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(201, 169, 110, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}

// Step Card Component
function StepCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative text-center"
    >
      {/* Large number background */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -z-10">
        <p className="text-7xl md:text-8xl font-playfair font-bold text-[#c9a96e] opacity-10">
          {number}
        </p>
      </div>

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-[#111111] border border-gray-800 rounded-lg">
          <Icon size={32} className="text-[#c9a96e]" />
        </div>
      </div>

      {/* Title and description */}
      <h3 className="text-xl font-playfair font-bold text-[#f5f0e8] mb-3">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="p-8 bg-[#111111] border border-gray-800 rounded-lg hover:border-[#c9a96e] transition-colors duration-300 h-full flex flex-col">
        {badge && (
          <div className="inline-flex items-center gap-1 mb-4 w-fit">
            <span className="text-xs uppercase font-bold text-[#c9a96e] tracking-widest">
              {badge}
            </span>
          </div>
        )}

        <Icon size={28} className="text-[#c9a96e] mb-4" />
        <h3 className="text-lg font-playfair font-bold text-[#f5f0e8] mb-2">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed flex-grow">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// Pricing Card Component
function PricingCard({
  plan,
  price,
  badge,
  features,
  isPrimary,
}: {
  plan: string;
  price?: string;
  badge?: string;
  features: string[];
  isPrimary?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative ${isPrimary ? 'md:scale-105' : ''}`}
    >
      <div
        className={`p-8 rounded-lg border ${
          isPrimary
            ? 'border-[#c9a96e] bg-[#0f0f0f]'
            : 'border-gray-800 bg-[#111111]'
        } flex flex-col h-full`}
      >
        {badge && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#c9a96e] text-[#0a0a0a] text-xs uppercase font-bold rounded-full">
              {badge}
            </span>
          </div>
        )}

        <h3 className="text-2xl font-playfair font-bold text-[#f5f0e8] mb-2">
          {plan}
        </h3>

        {price && (
          <div className="mb-6">
            <span className="text-4xl font-playfair font-bold text-[#c9a96e]">
              ${price}
            </span>
            <span className="text-gray-400 text-sm ml-2">one-time</span>
          </div>
        )}

        <div className="space-y-4 flex-grow mb-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check size={20} className="text-[#c9a96e] flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Link
          href={isPrimary ? '/checkout' : '/scan'}
          className={`w-full py-3 px-6 rounded-lg font-semibold uppercase tracking-widest text-sm transition-all duration-300 ${
            isPrimary
              ? 'bg-[#c9a96e] text-[#0a0a0a] hover:bg-white'
              : 'border border-gray-700 text-[#f5f0e8] hover:border-[#c9a96e] hover:text-[#c9a96e]'
          }`}
        >
          {isPrimary ? 'Upgrade to Pro' : 'Start Free'}
        </Link>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden">
        <GridBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold leading-tight mb-6">
              Scan. Design.{' '}
              <span className="text-[#c9a96e]">Build.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Turn any space into a renovation plan in minutes
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <Link
              href="/scan"
              className="px-8 py-4 bg-[#c9a96e] text-[#0a0a0a] font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors duration-300"
            >
              Start Free Scan
            </Link>
            <Link
              href="/ar/demo"
              className="px-8 py-4 border-2 border-[#c9a96e] text-[#c9a96e] font-bold uppercase tracking-widest rounded-lg hover:bg-[#c9a96e] hover:text-[#0a0a0a] transition-all duration-300"
            >
              See it in AR
            </Link>
          </motion.div>

          {/* Animated Counter */}
          <AnimatedCounter />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-32 px-6 md:px-8 max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
              How it Works
            </h2>
            <div className="w-16 h-1 bg-[#c9a96e] mx-auto" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <AnimatedSection>
            <StepCard
              number="01"
              icon={Video}
              title="Record"
              description="Walk through your space with your phone. 60 seconds."
            />
          </AnimatedSection>

          <AnimatedSection>
            <StepCard
              number="02"
              icon={Cpu}
              title="Design"
              description="AI generates your floor plan and 3D model instantly."
            />
          </AnimatedSection>

          <AnimatedSection>
            <StepCard
              number="03"
              icon={Hammer}
              title="Build"
              description="Configure materials, get your shopping list, go."
            />
          </AnimatedSection>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-6 md:px-8 max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
              Powerful Features
            </h2>
            <div className="w-16 h-1 bg-[#c9a96e] mx-auto" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Ruler}
            title="2D Floor Plan"
            description="Auto-generated from your video walkthrough"
          />

          <FeatureCard
            icon={Box}
            title="3D Walkthrough"
            description="Explore your space in full 3D with real materials"
          />

          <FeatureCard
            icon={Glasses}
            title="AR Preview"
            description="See your design in augmented reality"
            badge="PRO"
          />

          <FeatureCard
            icon={ShoppingCart}
            title="Smart Shopping List"
            description="Every item, quantity and price calculated"
          />

          <FeatureCard
            icon={Globe}
            title="Global Sourcing"
            description="Compare local vs imported materials, save up to 50%"
          />

          <FeatureCard
            icon={Move}
            title="Measurements"
            description="Accurate m², quantities and specifications"
          />
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-32 px-6 md:px-8 max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
              Simple Pricing
            </h2>
            <div className="w-16 h-1 bg-[#c9a96e] mx-auto" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            plan="Free"
            features={[
              '1 project',
              '2D floor plan',
              '3D preview (limited)',
              'Basic measurements',
            ]}
          />

          <PricingCard
            plan="Pro"
            price="199"
            badge="Most Popular"
            isPrimary={true}
            features={[
              'Unlimited projects',
              'AR unlimited',
              'Export PDF',
              'Full shopping list with prices',
              'China vs local comparison',
              'Priority support',
            ]}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 md:px-8 border-t border-gray-800">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <p className="text-gray-400 mb-4">
            ArtquiTech © 2026
          </p>
          <p className="text-sm text-gray-500">
            Part of the{' '}
            <Link
              href="https://inmofindr.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c9a96e] hover:text-white transition-colors duration-300"
            >
              InmoFindr
            </Link>{' '}
            ecosystem
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
