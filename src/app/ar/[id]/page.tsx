'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Lock, ArrowLeft, Share2, Smartphone, ZapOff } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Room component (same as studio)
function Room({
  floorColor = '#e8e0d4',
  wallColor = '#ffffff',
  lightTemp = 4000,
  lightIntensity = 0.8,
}: {
  floorColor?: string;
  wallColor?: string;
  lightTemp?: number;
  lightIntensity?: number;
}) {
  const width = 5;
  const height = 2.8;
  const depth = 4;

  const getTempColor = (temp: number): [number, number, number] => {
    if (temp <= 2700) return [1, 0.85, 0.6];
    if (temp <= 4000) return [1, 0.95, 0.85];
    return [0.9, 0.95, 1];
  };

  const lightColor = getTempColor(lightTemp);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight
        position={[2.5, 2, 2]}
        intensity={lightIntensity * 1.5}
        color={new THREE.Color(
          Math.min(lightColor[0], 1),
          Math.min(lightColor[1], 1),
          Math.min(lightColor[2], 1)
        )}
        distance={10}
        decay={1}
      />
      <pointLight
        position={[-2.5, 1.5, 1]}
        intensity={lightIntensity * 0.6}
        color={new THREE.Color(0.8, 0.8, 0.9)}
        distance={8}
        decay={1}
      />

      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshPhongMaterial color={floorColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshPhongMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, height / 2, depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshPhongMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshPhongMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshPhongMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

// Fallback 3D view with phone mockup
function FallbackARView() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 p-6">
      {/* 3D Canvas for desktop fallback */}
      <div className="w-full max-w-2xl aspect-video rounded-lg overflow-hidden border-2 border-[#c9a96e]/30">
        <Canvas camera={{ position: [4, 2, 3], fov: 50 }}>
          <PerspectiveCamera makeDefault position={[4, 2, 3]} fov={50} near={0.1} far={100} />
          <Room />
          <OrbitControls
            minDistance={3}
            maxDistance={12}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* Message and phone mockup for mobile */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-[#c9a96e]">
          <Smartphone size={20} />
          <p className="text-sm font-semibold">AR is available on compatible mobile devices</p>
        </div>
        <p className="text-xs text-[#999] max-w-md">
          View this 3D model on a mobile device with ARCore or ARKit for full augmented reality experience.
        </p>
      </div>

      {/* Phone frame mockup */}
      <div className="relative w-32 h-64 mx-auto">
        <div className="absolute inset-0 bg-[#1a1a1a] rounded-3xl border-8 border-[#333] shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Screen gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a96e]/20 via-[#0a0a0a] to-[#333]/20" />
          {/* AR indicator */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-[#c9a96e] flex items-center justify-center animate-pulse">
              <ZapOff size={20} className="text-[#c9a96e]" />
            </div>
            <p className="text-xs text-[#c9a96e] font-semibold">AR Ready</p>
          </div>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-[#1a1a1a] rounded-b-3xl z-20" />
        </div>
      </div>
    </div>
  );
}

// Paywall modal
function PaywallModal() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#1a1a1a] border border-[#c9a96e]/30 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
      >
        {/* Header with lock icon */}
        <div className="bg-gradient-to-r from-[#c9a96e]/20 to-[#0a0a0a] p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 mb-4">
            <Lock size={32} className="text-[#c9a96e]" />
          </div>
          <h2 className="text-2xl font-bold text-[#f5f0e8] mb-2">Unlock AR Experience</h2>
          <p className="text-sm text-[#999]">Upgrade to Pro to view your designs in augmented reality</p>
        </div>

        {/* Pricing section */}
        <div className="px-8 py-6">
          <div className="bg-[#0a0a0a] rounded-lg p-4 mb-6 border border-[#c9a96e]/20">
            <p className="text-center text-3xl font-bold text-[#c9a96e]">USD 199</p>
            <p className="text-center text-xs text-[#999] mt-1">one-time payment</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <h3 className="text-xs font-semibold text-[#c9a96e] uppercase tracking-wide mb-4">
              What you get
            </h3>
            {[
              'Unlimited AR sessions',
              'Export PDF plans',
              'Full shopping list',
              'Priority support',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-[#c9a96e] flex-shrink-0 mt-1" />
                <p className="text-sm text-[#f5f0e8]">{feature}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/checkout"
            className="w-full bg-[#c9a96e] text-[#0a0a0a] py-3 rounded-lg font-semibold text-sm hover:bg-[#d4b27f] transition-colors mb-3 block text-center"
          >
            Upgrade Now
          </Link>

          {/* Secondary link */}
          <Link
            href={`/studio/${typeof window !== 'undefined' ? new URL(window.location.href).pathname.split('/')[2] : 'demo'}`}
            className="w-full bg-[#0a0a0a] border border-[#333] text-[#c9a96e] py-3 rounded-lg font-semibold text-sm hover:border-[#c9a96e]/50 transition-colors block text-center"
          >
            Continue with 3D Preview
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Toast notification
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 bg-[#c9a96e] text-[#0a0a0a] px-4 py-3 rounded-lg font-semibold text-sm z-40 shadow-lg"
    >
      {message}
    </motion.div>
  );
}

export default function ARPage() {
  const params = useParams();
  const id = params?.id as string;

  const [isPro, setIsPro] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [webXRSupported, setWebXRSupported] = useState(false);
  const [isCheckingXR, setIsCheckingXR] = useState(true);

  // Check WebXR support on mount
  useEffect(() => {
    const checkWebXR = async () => {
      try {
        if (navigator.xr) {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setWebXRSupported(supported);
        }
      } catch (error) {
        console.log('WebXR check failed:', error);
      } finally {
        setIsCheckingXR(false);
      }
    };

    checkWebXR();
  }, []);

  // Demo mode bypasses paywall
  const isDemoMode = id === 'demo';
  const showPaywall = !isPro && !isDemoMode;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setToastMessage('Link copied to clipboard!');
    setShowToast(true);
  };

  const handleTryDemo = () => {
    setIsPro(true);
  };

  const handleARSession = async () => {
    try {
      if (!navigator.xr) {
        setToastMessage('WebXR not available');
        setShowToast(true);
        return;
      }

      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-dom', 'dom-overlay'],
      });

      if (session) {
        // AR session started successfully
        setToastMessage('AR session started!');
        setShowToast(true);
        // In a real implementation, you would manage the XR session here
      }
    } catch (error) {
      console.error('AR session error:', error);
      setToastMessage('Could not start AR session');
      setShowToast(true);
    }
  };

  if (isCheckingXR) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-[#c9a96e]">Loading AR...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      {/* Paywall Modal */}
      {showPaywall && <PaywallModal />}

      {/* Toast */}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}

      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#c9a96e]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/studio/${id}`}
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
              title="Back to Studio"
            >
              <ArrowLeft size={20} className="text-[#c9a96e]" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#c9a96e]">AR Experience</h1>
              <p className="text-xs text-[#999]">ID: {id}</p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            title="Share"
          >
            <Share2 size={20} className="text-[#c9a96e]" />
          </button>
        </div>
      </div>

      {/* Main content */}
      {showPaywall ? (
        // Blurred preview behind paywall
        <div className="relative h-[calc(100vh-80px)]">
          <div className="absolute inset-0 blur-md opacity-40">
            <FallbackARView />
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row">
          {/* AR Content Area */}
          <div className="flex-1 relative bg-[#0a0a0a] flex flex-col">
            {webXRSupported ? (
              // WebXR supported - show AR controls
              <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
                <div className="text-center space-y-2 mb-4">
                  <h2 className="text-2xl font-bold text-[#f5f0e8]">Ready for AR</h2>
                  <p className="text-sm text-[#999]">
                    Your device supports augmented reality
                  </p>
                </div>

                <motion.button
                  onClick={handleARSession}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#c9a96e] text-[#0a0a0a] rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-[#d4b27f] transition-colors shadow-lg shadow-[#c9a96e]/20"
                >
                  <ZapOff size={24} />
                  Start AR Experience
                </motion.button>

                <div className="max-w-md aspect-video bg-gradient-to-br from-[#c9a96e]/10 to-[#333]/10 rounded-lg border-2 border-[#c9a96e]/20 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full border-2 border-[#c9a96e] mx-auto flex items-center justify-center animate-pulse">
                      <Smartphone size={32} className="text-[#c9a96e]" />
                    </div>
                    <p className="text-sm text-[#c9a96e]">AR Preview Area</p>
                    <p className="text-xs text-[#999]">Point camera at a flat surface</p>
                  </div>
                </div>
              </div>
            ) : (
              // Desktop fallback - show 3D model
              <div className="flex-1 flex flex-col">
                <FallbackARView />
              </div>
            )}
          </div>

          {/* Mobile-only Demo Button */}
          {isDemoMode && !isPro && (
            <motion.button
              onClick={handleTryDemo}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute top-20 left-4 right-4 bg-[#c9a96e] text-[#0a0a0a] py-2 px-4 rounded-lg font-semibold text-sm hover:bg-[#d4b27f] transition-colors shadow-lg z-30 lg:hidden"
            >
              Try Demo Version
            </motion.button>
          )}
        </div>
      )}

      {/* Bottom bar - Mobile */}
      {!showPaywall && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#c9a96e]/20 p-4 flex gap-2">
          <Link
            href={`/studio/${id}`}
            className="flex-1 bg-[#0a0a0a] border border-[#333] text-[#f5f0e8] py-2 px-4 rounded-lg font-semibold text-sm hover:border-[#c9a96e]/50 transition-colors text-center"
          >
            Back to Studio
          </Link>
          <button
            onClick={handleShare}
            className="flex-1 bg-[#c9a96e] text-[#0a0a0a] py-2 px-4 rounded-lg font-semibold text-sm hover:bg-[#d4b27f] transition-colors text-center flex items-center justify-center gap-2"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      )}

      {/* Bottom bar - Desktop */}
      {!showPaywall && (
        <div className="hidden lg:block bg-[#1a1a1a] border-t border-[#c9a96e]/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href={`/studio/${id}`}
              className="text-sm font-semibold text-[#c9a96e] hover:text-[#d4b27f] transition-colors"
            >
              Back to Studio
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#333] text-[#f5f0e8] rounded-lg hover:border-[#c9a96e]/50 transition-colors text-sm font-semibold"
            >
              <Share2 size={16} />
              Share Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}