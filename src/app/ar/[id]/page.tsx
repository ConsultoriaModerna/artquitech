'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { X, Share2, Check } from 'lucide-react';

function PaywallModal({
  onClose,
  onUpgrade,
}: {
  onClose: () => void;
  onUpgrade: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1a1a] rounded-lg p-8 max-w-md w-full mx-4 relative border"
        style={{ borderColor: '#c9a96e' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:opacity-50 transition-opacity"
        >
          <X size={20} style={{ color: '#999' }} />
        </button>

        <h2 className="text-2xl font-bold mb-4" style={{ color: '#f5f0e8' }}>
          Unlock AR
        </h2>
        <p style={{ color: '#999' }} className="mb-6">
          Upgrade to Pro to view this room in augmented reality
        </p>

        <div className="mb-8">
          <div className="text-4xl font-bold mb-2" style={{ color: '#c9a96e' }}>
            $199
          </div>
          <p style={{ color: '#666' }} className="text-sm">
            One-time payment
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {[
            'Unlimited AR sessions',
            'Export PDF plans',
            'Full shopping list',
            'Priority support',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <Check size={16} style={{ color: '#c9a96e' }} />
              <span style={{ color: '#f5f0e8' }} className="text-sm">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onUpgrade}
          className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90 mb-3"
          style={{
            backgroundColor: '#c9a96e',
            color: '#0a0a0a',
          }}
        >
          Upgrade to Pro
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-semibold transition-all border"
          style={{
            borderColor: '#333',
            color: '#999',
          }}
        >
          Maybe Later
        </button>
      </motion.div>
    </motion.div>
  );
}

function FallbackARView() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }} className="flex items-center justify-center">
      <div className="text-center">
        <p style={{ color: '#999' }} className="text-lg mb-4">
          AR not supported on this device
        </p>
        <div className="border-2 border-dashed rounded-lg p-12" style={{ borderColor: '#333' }}>
          <div style={{ color: '#666' }} className="text-sm">
            Phone mockup would show here
          </div>
        </div>
      </div>
    </div>
  );
}

function ARContent({ id }: { id: string }) {
  const [isProUser, setIsProUser] = useState(id === 'demo');
  const [showPaywall, setShowPaywall] = useState(id !== 'demo');
  const [arSupported, setArSupported] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check AR support
    const checkAR = async () => {
      if ('xr' in navigator) {
        try {
          const supported = await (navigator as any).xr.isSessionSupported('immersive-ar');
          setArSupported(supported);
        } catch (e) {
          setArSupported(false);
        }
      } else {
        setArSupported(false);
      }
    };

    checkAR();
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpgrade = () => {
    window.location.href = '/checkout';
  };

  if (!isProUser && showPaywall) {
    return (
      <>
        <PaywallModal
          onClose={() => window.location.href = '/dashboard'}
          onUpgrade={handleUpgrade}
        />
        <FallbackARView />
      </>
    );
  }

  if (!arSupported) {
    return <FallbackARView />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }} className="flex items-center justify-center">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={handleShare}
          className="p-3 rounded-full transition-all hover:opacity-90"
          style={{
            backgroundColor: '#c9a96e',
            color: '#0a0a0a',
          }}
        >
          {copied ? <Check size={20} /> : <Share2 size={20} />}
        </button>
      </div>
      <div className="text-center">
        <p style={{ color: '#999' }}>AR View Active</p>
        <p style={{ color: '#666' }} className="text-sm">Room: {id}</p>
      </div>
    </div>
  );
}

export default function ARPage({ params }: { params: { id: string } }) {
  return (
    <Suspense>
      <ARContent id={params.id} />
    </Suspense>
  );
}
