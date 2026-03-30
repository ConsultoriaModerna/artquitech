'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL provided');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#f5f0e8' }}>
            Upgrade to Pro
          </h1>
          <p style={{ color: '#999' }} className="text-lg">
            Unlock AR visualization and all premium features
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border p-8 mb-8"
          style={{
            borderColor: '#c9a96e',
            backgroundColor: '#1a1a1a',
          }}
        >
          {/* Plan Header */}
          <div className="flex items-center gap-3 mb-8">
            <Crown size={28} style={{ color: '#c9a96e' }} />
            <h2 className="text-3xl font-bold" style={{ color: '#f5f0e8' }}>
              Pro Plan
            </h2>
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="text-5xl font-bold mb-2" style={{ color: '#c9a96e' }}>
              $199
            </div>
            <p style={{ color: '#999' }} className="text-sm">
              One-time payment
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#c9a96e' }}
              >
                <span style={{ color: '#0a0a0a' }} className="text-xs font-bold">
                  ✓
                </span>
              </div>
              <span style={{ color: '#f5f0e8' }}>AR Visualization</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#c9a96e' }}
              >
                <span style={{ color: '#0a0a0a' }} className="text-xs font-bold">
                  ✓
                </span>
              </div>
              <span style={{ color: '#f5f0e8' }}>Unlimited Scans</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#c9a96e' }}
              >
                <span style={{ color: '#0a0a0a' }} className="text-xs font-bold">
                  ✓
                </span>
              </div>
              <span style={{ color: '#f5f0e8' }}>High-Resolution Images</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#c9a96e' }}
              >
                <span style={{ color: '#0a0a0a' }} className="text-xs font-bold">
                  ✓
                </span>
              </div>
              <span style={{ color: '#f5f0e8' }}>Advanced Export Formats</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#c9a96e' }}
              >
                <span style={{ color: '#0a0a0a' }} className="text-xs font-bold">
                  ✓
                </span>
              </div>
              <span style={{ color: '#f5f0e8' }}>Priority Support</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 rounded-lg"
              style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}
            >
              <p style={{ color: '#dc2626' }} className="text-sm">
                {error}
              </p>
            </motion.div>
          )}

          {/* Complete Purchase Button */}
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: '#c9a96e',
              color: '#0a0a0a',
            }}
          >
            {isLoading ? (
              <>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Complete Purchase</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </motion.div>

        {/* Back to Dashboard Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Link
            href="/dashboard"
            style={{ color: '#c9a96e' }}
            className="text-sm hover:opacity-80 transition-opacity"
          >
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}