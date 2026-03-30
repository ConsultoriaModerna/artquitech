'use client';

import { useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Eye, ShoppingCart, Home, Zap } from 'lucide-react';

const floorMaterials = [
  { name: 'Ceramic Tile', color: '#D4A574' },
  { name: 'Porcelain', color: '#9B9B9B' },
  { name: 'Wood', color: '#8B6F47' },
  { name: 'Laminate', color: '#A0A0A0' },
  { name: 'Concrete', color: '#7B7B7B' },
  { name: 'Marble', color: '#E8DCC8' },
];

const wallColors = [
  { name: 'Off-White', color: '#F5F0E8' },
  { name: 'Light Gray', color: '#D3D3D3' },
  { name: 'Soft Blue', color: '#B4D4E8' },
  { name: 'Warm Beige', color: '#E5D4B8' },
  { name: 'Sage Green', color: '#A8B8A0' },
];

const shoppingItems = [
  { id: 1, name: 'Ceramic Floor Tiles (per m²)', quantity: 20, priceARS: 1200, priceCNY: 45 },
  { id: 2, name: 'Wall Paint (5L)', quantity: 2, priceARS: 800, priceCNY: 25 },
  { id: 3, name: 'Interior Door', quantity: 2, priceARS: 3500, priceCNY: 120 },
  { id: 4, name: 'Light Fixtures', quantity: 4, priceARS: 600, priceCNY: 20 },
  { id: 5, name: 'Baseboards (linear m)', quantity: 15, priceARS: 200, priceCNY: 8 },
];

function StudioContent({ id }: { id: string }) {
  const [selectedTab, setSelectedTab] = useState<'plan' | 'materials' | 'shopping'>('plan');
  const [selectedWallColor, setSelectedWallColor] = useState('#F5F0E8');
  const [selectedFloorColor, setSelectedFloorColor] = useState('#D4A574');
  const [lightingTemp, setLightingTemp] = useState(4000);
  const [lightingIntensity, setLightingIntensity] = useState(0.8);
  const [isMobile, setIsMobile] = useState(false);

  const totalARS = shoppingItems.reduce((sum, item) => sum + (item.priceARS * item.quantity), 0);
  const totalCNY = shoppingItems.reduce((sum, item) => sum + (item.priceCNY * item.quantity), 0);
  const savings = totalARS - (totalCNY * 35); // Rough conversion

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b"
        style={{ borderColor: '#333' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home size={24} style={{ color: '#c9a96e' }} />
            <h1 className="text-2xl font-bold" style={{ color: '#f5f0e8' }}>
              Studio: Demo Room
            </h1>
          </div>
          <Link
            href={`/ar/${id}`}
            className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all hover:opacity-90"
            style={{
              backgroundColor: '#c9a96e',
              color: '#0a0a0a',
            }}
          >
            <Eye size={18} />
            View in AR
          </Link>
        </div>
      </motion.div>

      {/* Tabs (Mobile) */}
      <div className="md:hidden border-b" style={{ borderColor: '#333' }}>
        <div className="max-w-7xl mx-auto px-6 flex gap-4 overflow-x-auto">
          {(['plan', 'materials', 'shopping'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className="py-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2"
              style={{
                color: selectedTab === tab ? '#c9a96e' : '#999',
                borderColor: selectedTab === tab ? '#c9a96e' : 'transparent',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[calc(100vh-120px)]">
        {/* Left Panel */}
        <div
          className={`${isMobile && selectedTab !== 'plan' ? 'hidden' : ''} md:block md:col-span-1 border-r p-6 overflow-y-auto`}
          style={{ borderColor: '#333', backgroundColor: '#1a1a1a' }}
        >
          {selectedTab === 'plan' || !isMobile ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#f5f0e8' }}>
                Floor Plan
              </h3>
              <svg
                viewBox="0 0 500 400"
                className="w-full mb-6 border rounded"
                style={{ borderColor: '#333' }}
              >
                {/* Floor */}
                <rect x="50" y="50" width="400" height="300" fill="#D4A574" stroke="#333" strokeWidth="2" />

                {/* Walls */}
                <rect x="50" y="50" width="400" height="8" fill="#666" />
                <rect x="50" y="50" width="8" height="300" fill="#666" />
                <rect x="442" y="50" width="8" height="300" fill="#666" />
                <rect x="50" y="342" width="400" height="8" fill="#666" />

                {/* Doors */}
                <circle cx="200" cy="350" r="25" fill="none" stroke="#999" strokeWidth="2" />
                <circle cx="400" cy="100" r="25" fill="none" stroke="#999" strokeWidth="2" />

                {/* Windows */}
                <rect x="70" y="50" width="80" height="8" fill="#87CEEB" stroke="#333" strokeWidth="1" />
                <rect x="350" y="50" width="80" height="8" fill="#87CEEB" stroke="#333" strokeWidth="1" />

                {/* Electrical outlets */}
                <circle cx="100" cy="120" r="8" fill="#FFD700" />
                <circle cx="100" cy="200" r="8" fill="#FFD700" />
                <circle cx="300" cy="150" r="8" fill="#FFD700" />

                {/* Light fixtures */}
                <circle cx="250" cy="150" r="12" fill="none" stroke="#FF6B6B" strokeWidth="2" />
                <line x1="250" y1="138" x2="250" y2="162" stroke="#FF6B6B" strokeWidth="2" />
                <line x1="238" y1="150" x2="262" y2="150" stroke="#FF6B6B" strokeWidth="2" />

                {/* Dimensions */}
                <text x="250" y="410" textAnchor="middle" fill="#999" fontSize="12">
                  5m x 4m x 2.8m
                </text>
              </svg>

              <div className="grid grid-cols-2 gap-4 text-xs text-center">
                <div style={{ color: '#999' }}>Width: 5m</div>
                <div style={{ color: '#999' }}>Length: 4m</div>
                <div style={{ color: '#999' }}>Height: 2.8m</div>
                <div style={{ color: '#999' }}>Area: 20 m²</div>
              </div>
            </motion.div>
          ) : selectedTab === 'materials' || !isMobile ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#f5f0e8' }}>
                Floor Materials
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {floorMaterials.map(mat => (
                  <motion.button
                    key={mat.name}
                    onClick={() => setSelectedFloorColor(mat.color)}
                    className="p-3 rounded-lg border-2 transition-all text-xs"
                    style={{
                      borderColor: selectedFloorColor === mat.color ? '#c9a96e' : '#333',
                      backgroundColor: mat.color,
                      color: mat.color === '#8B6F47' ? '#f5f0e8' : '#0a0a0a',
                    }}
                  >
                    {mat.name}
                  </motion.button>
                ))}
              </div>

              <h3 className="text-lg font-bold mb-4" style={{ color: '#f5f0e8' }}>
                Wall Colors
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {wallColors.map(color => (
                  <motion.button
                    key={color.name}
                    onClick={() => setSelectedWallColor(color.color)}
                    className="p-3 rounded-lg border-2 transition-all text-xs"
                    style={{
                      borderColor: selectedWallColor === color.color ? '#c9a96e' : '#333',
                      backgroundColor: color.color,
                      color: color.color === '#F5F0E8' || color.color === '#E8DCC8' || color.color === '#E5D4B8' ? '#0a0a0a' : '#f5f0e8',
                    }}
                  >
                    {color.name}
                  </motion.button>
                ))}
              </div>

              <h3 className="text-lg font-bold mb-4" style={{ color: '#f5f0e8' }}>
                Lighting
              </h3>
              <div className="space-y-4">
                <div>
                  <label style={{ color: '#999' }} className="text-xs block mb-2">
                    Color Temp: {lightingTemp}K
                  </label>
                  <input
                    type="range"
                    min="2700"
                    max="6500"
                    value={lightingTemp}
                    onChange={e => setLightingTemp(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label style={{ color: '#999' }} className="text-xs block mb-2">
                    Intensity: {lightingIntensity.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.1"
                    value={lightingIntensity}
                    onChange={e => setLightingIntensity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#f5f0e8' }}>
                Shopping List
              </h3>
              <div className="space-y-3 mb-6">
                {shoppingItems.map(item => (
                  <div key={item.id} className="rounded p-3" style={{ backgroundColor: '#0f0f0f' }}>
                    <div className="flex justify-between items-start mb-2">
                      <span style={{ color: '#f5f0e8' }} className="text-sm font-medium">
                        {item.name}
                      </span>
                      <span style={{ color: '#999' }} className="text-xs">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: '#c9a96e' }}>AR${item.priceARS * item.quantity}</span>
                      <span style={{ color: '#666' }}>¥{item.priceCNY * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t" style={{ borderColor: '#333' }}>
                <div className="py-3 flex justify-between">
                  <span style={{ color: '#999' }}>Total ARS:</span>
                  <span style={{ color: '#c9a96e' }} className="font-bold">
                    AR${totalARS.toLocaleString()}
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span style={{ color: '#999' }}>Total CNY:</span>
                  <span style={{ color: '#666' }} className="font-bold">
                    ¥{totalCNY.toLocaleString()}
                  </span>
                </div>
                <div className="py-3 flex justify-between border-t" style={{ borderColor: '#333' }}>
                  <span style={{ color: '#999' }}>Savings:</span>
                  <span style={{ color: '#4ade80' }} className="font-bold">
                    AR${savings.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Panel (Desktop Only) - Placeholder for 3D Canvas */}
        <div className="hidden md:flex md:col-span-2 items-center justify-center" style={{ backgroundColor: '#0f0f0f' }}>
          <div className="text-center">
            <Zap size={48} style={{ color: '#c9a96e' }} className="mx-auto mb-4" />
            <p style={{ color: '#999' }}>3D Canvas</p>
            <p style={{ color: '#666' }} className="text-sm">Room dimensions: 5m x 4m x 2.8m</p>
            <p style={{ color: '#666' }} className="text-sm">Wall: {selectedWallColor} | Floor: {selectedFloorColor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage({ params }: { params: { id: string } }) {
  return (
    <Suspense>
      <StudioContent id={params.id} />
    </Suspense>
  );
}
