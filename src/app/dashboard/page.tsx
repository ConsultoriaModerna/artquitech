'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Crown } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const searchParams = useSearchParams();
  const showUpgradeBanner = searchParams.get('upgraded') === 'true';
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user tier from API/auth context
    // For now, check if there's a flag in localStorage or session
    const tier = localStorage.getItem('userTier') as 'free' | 'pro' | null;
    setUserTier(tier || 'free');
    setIsLoading(false);
  }, [showUpgradeBanner]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Upgrade Success Banner */}
      {showUpgradeBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b"
          style={{
            borderColor: '#c9a96e',
            backgroundColor: 'rgba(201, 169, 110, 0.1)',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <p style={{ color: '#c9a96e' }} className="font-medium">
              Welcome to Pro! AR and all premium features are now unlocked.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-12"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <LayoutDashboard size={32} style={{ color: '#c9a96e' }} />
            <h1 className="text-4xl font-bold" style={{ color: '#f5f0e8' }}>
              My Projects
            </h1>
          </motion.div>

          <div className="flex items-center gap-4">
            {/* Tier Badge */}
            <motion.div
              variants={itemVariants}
              className="px-4 py-2 rounded-lg border flex items-center gap-2"
              style={{
                borderColor: userTier === 'pro' ? '#c9a96e' : '#333',
                backgroundColor:
                  userTier === 'pro' ? 'rgba(201, 169, 110, 0.1)' : 'rgba(51, 51, 51, 0.5)',
              }}
            >
              {userTier === 'pro' && <Crown size={16} style={{ color: '#c9a96e' }} />}
              <span
                style={{
                  color: userTier === 'pro' ? '#c9a96e' : '#999',
                }}
                className="text-sm font-medium"
              >
                {userTier === 'pro' ? 'Pro' : 'Free'}
              </span>
            </motion.div>

            {/* New Scan Button */}
            <motion.div variants={itemVariants}>
              <Link
                href="/scan"
                className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all hover:opacity-90"
                style={{
                  backgroundColor: '#c9a96e',
                  color: '#0a0a0a',
                }}
              >
                <Plus size={18} />
                New Scan
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Demo Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-lg overflow-hidden border transition-all hover:border-opacity-100"
            style={{
              borderColor: '#333',
              backgroundColor: '#1a1a1a',
            }}
          >
            {/* Thumbnail */}
            <div
              className="h-48 flex items-center justify-center"
              style={{ backgroundColor: '#2a2a2a' }}
            >
              <span style={{ color: '#666' }} className="text-sm">
                Demo Living Room
              </span>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#f5f0e8' }}>
                Demo Living Room
              </h3>
              <p style={{ color: '#999' }} className="text-sm mb-4">
                20 m²
              </p>
              <div className="flex items-center justify-between">
                <span style={{ color: '#666' }} className="text-xs">
                  {new Date().toLocaleDateString()}
                </span>
                <Link
                  href="/studio/demo"
                  className="px-3 py-1 rounded text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    backgroundColor: '#c9a96e',
                    color: '#0a0a0a',
                  }}
                >
                  Open
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Empty State Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-lg border-2 transition-all hover:border-opacity-100 cursor-pointer"
            style={{
              borderColor: '#333',
              borderStyle: 'dashed',
              backgroundColor: 'rgba(201, 169, 110, 0.05)',
            }}
          >
            <Link href="/scan" className="h-full p-6 flex flex-col items-center justify-center">
              <Plus
                size={40}
                style={{ color: '#c9a96e' }}
                className="mb-3"
              />
              <span style={{ color: '#f5f0e8' }} className="font-medium text-center">
                Start a new scan
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }} />}>
      <DashboardContent />
    </Suspense>
  );
}