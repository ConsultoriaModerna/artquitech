'use client';

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronRight, Download, Lock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Material swatches for floor
const FLOOR_MATERIALS = [
  { name: 'Marble White', color: '#e8e0d4', hex: '#e8e0d4' },
  { name: 'Marble Black', color: '#1a1a1a', hex: '#1a1a1a' },
  { name: 'Porcelain Grey', color: '#9a9a9a', hex: '#9a9a9a' },
  { name: 'Wood Oak', color: '#b8864e', hex: '#b8864e' },
  { name: 'Microcement', color: '#8a8278', hex: '#8a8278' },
  { name: 'Terracotta', color: '#c4724a', hex: '#c4724a' },
];

// Wall color presets
const WALL_COLORS = [
  { name: 'Pure White', color: '#ffffff' },
  { name: 'Mineral Grey', color: '#808080' },
  { name: 'Sage Green', color: '#8fbc8f' },
  { name: 'Carbon Black', color: '#1a1a1a' },
  { name: 'Sand', color: '#d4c5a9' },
];

// Lighting presets
const LIGHTING_TEMPS = [
  { name: 'Warm', temp: 2700, label: '2700K' },
  { name: 'Neutral', temp: 4000, label: '4000K' },
  { name: 'Cool', temp: 6500, label: '6500K' },
];

// Shopping list items
const SHOPPING_LIST = [
  { item: 'Porcelanato 60x60', qty: '22 m²', priceARS: '$45,000/m²', priceChina: '$22,000/m²' },
  { item: 'Pintura latex', qty: '52 m²', priceARS: '$15,000/m²', priceChina: '-' },
  { item: 'Zocalo', qty: '18 ml', priceARS: '$8,000/ml', priceChina: '$4,000/ml' },
];

// Room component for 3D scene
function Room({
  floorColor,
  wallColor,
  lightTemp,
  lightIntensity,
}: {
  floorColor: string;
  wallColor: string;
  lightTemp: number;
  lightIntensity: number;
}) {
  // Dimensions: 5m x 2.8m height x 4m depth
  const width = 5;
  const height = 2.8;
  const depth = 4;

  // Convert color temperature to RGB
  const getTempColor = (temp: number): [number, number, number] => {
    if (temp <= 2700) return [1, 0.85, 0.6];
    if (temp <= 4000) return [1, 0.95, 0.85];
    return [0.9, 0.95, 1];
  };

  const lightColor = getTempColor(lightTemp);

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.3} />

      {/* Main light source */}
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

      {/* Secondary light for fill */}
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

// Viewport controller for orbit limits
function CameraController() {
  return (
    <OrbitControls
      minDistance={3}
      maxDistance={12}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      autoRotate={false}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}

// Floor plan SVG component
function FloorPlanSVG() {
  return (
    <svg
      width="100%"
      height="300"
      viewBox="0 0 600 500"
      className="bg-[#1a1a1a] rounded-lg border border-[#c9a96e]/20"
    >
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#444" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="600" height="500" fill="url(#grid)" />

      {/* Room outline - 5m x 4m (scaled to 1m = 60px) */}
      <g>
        {/* Main room */}
        <rect x="100" y="100" width="300" height="240" fill="none" stroke="#c9a96e" strokeWidth="3" />

        {/* Windows (2) */}
        <rect x="130" y="100" width="50" height="8" fill="none" stroke="#6ba3ff" strokeWidth="2" />
        <rect x="250" y="100" width="50" height="8" fill="none" stroke="#6ba3ff" strokeWidth="2" />

        {/* Door */}
        <path
          d="M 100 250 Q 100 320 150 320"
          fill="none"
          stroke="#c9a96e"
          strokeWidth="2"
          strokeDasharray="4"
        />

        {/* Dimension annotations */}
        {/* Width dimension */}
        <g>
          <line x1="100" y1="370" x2="400" y2="370" stroke="#999" strokeWidth="1" />
          <circle cx="100" cy="370" r="2" fill="#999" />
          <circle cx="400" cy="370" r="2" fill="#999" />
          <text x="250" y="390" textAnchor="middle" fill="#c9a96e" fontSize="14" fontWeight="bold">
            5.0m
          </text>
        </g>

        {/* Depth dimension */}
        <g>
          <line x1="50" y1="100" x2="50" y2="340" stroke="#999" strokeWidth="1" />
          <circle cx="50" cy="100" r="2" fill="#999" />
          <circle cx="50" cy="340" r="2" fill="#999" />
          <text x="30" y="225" textAnchor="middle" fill="#c9a96e" fontSize="14" fontWeight="bold" transform="rotate(-90 30 225)">
            4.0m
          </text>
        </g>

        {/* Height annotation */}
        <text x="450" y="220" fill="#c9a96e" fontSize="12">
          h: 2.8m
        </text>

        {/* Legend */}
        <rect x="450" y="80" width="120" height="60" fill="#0a0a0a" stroke="#666" strokeWidth="1" rx="4" />
        <line x1="460" y1="90" x2="475" y2="90" stroke="#6ba3ff" strokeWidth="2" />
        <text x="480" y="95" fill="#f5f0e8" fontSize="11">
          Windows
        </text>
        <line x1="460" y1="110" x2="475" y2="110" stroke="#c9a96e" strokeWidth="2" strokeDasharray="2" />
        <text x="480" y="115" fill="#f5f0e8" fontSize="11">
          Door
        </text>
      </g>
    </svg>
  );
}

// Color temperature indicator function
function getTempColor(temp: number): string {
  if (temp <= 2700) return 'bg-orange-300';
  if (temp <= 4000) return 'bg-yellow-100';
  return 'bg-blue-100';
}

export default function StudioPage({ params }: { params: { id: string } }) {
  const [selectedFloor, setSelectedFloor] = useState(FLOOR_MATERIALS[0]);
  const [selectedWall, setSelectedWall] = useState(WALL_COLORS[0]);
  const [lightTemp, setLightTemp] = useState(4000);
  const [lightIntensity, setLightIntensity] = useState(0.8);
  const [activeTab, setActiveTab] = useState<'floorplan' | 'materials' | 'shopping'>('floorplan');

  // Mobile state for tab switching
  const [mobileView, setMobileView] = useState<'controls' | '3d'>('3d');

  // Calculate shopping list totals
  const shoppingTotals = useMemo(() => {
    const items = [
      { qty: 22, priceARS: 45000, priceChina: 22000 },
      { qty: 52, priceARS: 15000, priceChina: 0 },
      { qty: 18, priceARS: 8000, priceChina: 4000 },
    ];

    const totalARS = items.reduce((sum, item) => sum + item.qty * item.priceARS, 0);
    const totalChina = items.reduce((sum, item) => sum + (item.priceChina > 0 ? item.qty * item.priceChina : 0), 0);
    const savings = totalARS - totalChina;

    return { totalARS, totalChina, savings };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[350px_1fr] lg:h-screen">
        {/* LEFT PANEL - CONTROLS */}
        <div className="bg-[#1a1a1a] border-r border-[#c9a96e]/20 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#c9a96e]/20 p-6 z-10">
            <h1 className="text-2xl font-bold text-[#c9a96e] mb-2">Studio</h1>
            <p className="text-sm text-[#999]">ID: {params.id}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-4 border-b border-[#333]">
            {(['floorplan', 'materials', 'shopping'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-xs font-semibold rounded transition-colors ${
                  activeTab === tab
                    ? 'bg-[#c9a96e] text-[#0a0a0a]'
                    : 'text-[#999] hover:text-[#c9a96e]'
                }`}
              >
                {tab === 'floorplan' && 'Floor Plan'}
                {tab === 'materials' && 'Materials'}
                {tab === 'shopping' && 'List'}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="p-6">
            {/* FLOOR PLAN TAB */}
            {activeTab === 'floorplan' && (
              <div className="space-y-4">
                <FloorPlanSVG />
                <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#333]">
                  <h3 className="text-sm font-semibold text-[#c9a96e] mb-3">Room Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-[#999]">Floor Area</span>
                      <span className="font-mono">20 m²</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-[#999]">Height</span>
                      <span className="font-mono">2.8 m</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-[#999]">Windows</span>
                      <span className="font-mono">2</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-[#999]">Doors</span>
                      <span className="font-mono">1</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MATERIALS TAB */}
            {activeTab === 'materials' && (
              <div className="space-y-6">
                {/* Floor Materials */}
                <div>
                  <h3 className="text-sm font-semibold text-[#c9a96e] mb-3">Floor Materials</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {FLOOR_MATERIALS.map((material) => (
                      <button
                        key={material.name}
                        onClick={() => setSelectedFloor(material)}
                        className={`relative p-1 rounded-lg transition-all group ${
                          selectedFloor.name === material.name
                            ? 'ring-2 ring-[#c9a96e] ring-offset-2 ring-offset-[#1a1a1a]'
                            : 'hover:ring-1 hover:ring-[#c9a96e]/50'
                        }`}
                      >
                        <div
                          className="w-full aspect-square rounded-md border border-[#333]"
                          style={{ backgroundColor: material.color }}
                        />
                        <p className="text-xs text-center mt-2 text-[#999] group-hover:text-[#c9a96e]">
                          {material.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wall Colors */}
                <div>
                  <h3 className="text-sm font-semibold text-[#c9a96e] mb-3">Wall Colors</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {WALL_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedWall(color)}
                        className={`relative transition-all ${
                          selectedWall.name === color.name
                            ? 'ring-2 ring-[#c9a96e] ring-offset-2 ring-offset-[#1a1a1a]'
                            : 'hover:ring-1 hover:ring-[#c9a96e]/50'
                        }`}
                      >
                        <div
                          className="w-full aspect-square rounded-lg border border-[#333]"
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lighting */}
                <div>
                  <h3 className="text-sm font-semibold text-[#c9a96e] mb-3">Lighting Temperature</h3>
                  <div className="flex gap-2">
                    {LIGHTING_TEMPS.map((preset) => (
                      <button
                        key={preset.temp}
                        onClick={() => setLightTemp(preset.temp)}
                        className={`flex-1 py-2 px-3 rounded text-xs font-semibold transition-all ${
                          lightTemp === preset.temp
                            ? `${getTempColor(preset.temp)} text-[#0a0a0a]`
                            : 'bg-[#0a0a0a] border border-[#333] text-[#999] hover:border-[#c9a96e]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimmer */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-[#c9a96e]">Intensity</h3>
                    <span className="text-xs text-[#999]">{(lightIntensity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={lightIntensity}
                    onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#0a0a0a] rounded-lg appearance-none cursor-pointer accent-[#c9a96e]"
                  />
                </div>
              </div>
            )}

            {/* SHOPPING LIST TAB */}
            {activeTab === 'shopping' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#333]">
                        <th className="text-left py-2 px-2 text-[#999]">Item</th>
                        <th className="text-right py-2 px-2 text-[#999]">Qty</th>
                        <th className="text-right py-2 px-2 text-[#999]">ARS</th>
                        <th className="text-right py-2 px-2 text-[#999]">China</th>
                        <th className="text-center py-2 px-2 text-[#999]">Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SHOPPING_LIST.map((row, idx) => (
                        <tr key={idx} className="border-b border-[#222] hover:bg-[#0a0a0a]">
                          <td className="py-3 px-2 text-[#f5f0e8]">{row.item}</td>
                          <td className="py-3 px-2 text-right text-[#999]">{row.qty}</td>
                          <td className="py-3 px-2 text-right text-[#f5f0e8]">{row.priceARS}</td>
                          <td className="py-3 px-2 text-right text-[#999]">{row.priceChina}</td>
                          <td className="py-3 px-2 text-center">
                            <button className="p-1 hover:text-[#c9a96e] transition-colors">
                              <ExternalLink size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#333] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#999]">Total (ARS)</span>
                    <span className="font-mono text-[#f5f0e8]">
                      ${shoppingTotals.totalARS.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#999]">Total (China)</span>
                    <span className="font-mono text-[#f5f0e8]">
                      ${shoppingTotals.totalChina.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="border-t border-[#333] pt-2 flex justify-between text-xs font-semibold">
                    <span className="text-[#c9a96e]">Savings</span>
                    <span className="text-[#c9a96e] font-mono">
                      ${shoppingTotals.savings.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {/* Export button */}
                <button
                  disabled
                  className="w-full py-2 bg-[#0a0a0a] border border-[#333] rounded text-xs font-semibold text-[#999] flex items-center justify-center gap-2 opacity-50 cursor-not-allowed hover:border-[#c9a96e]/30"
                  title="Available in Pro plan"
                >
                  <Download size={14} />
                  Export PDF
                  <Lock size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - 3D VIEWPORT */}
        <div className="relative bg-[#0a0a0a]">
          <Canvas camera={{ position: [4, 2, 3], fov: 50 }}>
            <PerspectiveCamera makeDefault position={[4, 2, 3]} fov={50} near={0.1} far={100} />
            <Room
              floorColor={selectedFloor.color}
              wallColor={selectedWall.color}
              lightTemp={lightTemp}
              lightIntensity={lightIntensity}
            />
            <CameraController />
          </Canvas>

          {/* AR Button */}
          <Link
            href={`/ar/${params.id}`}
            className="absolute bottom-6 right-6 bg-[#c9a96e] text-[#0a0a0a] px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-[#d4b27f] transition-colors shadow-lg"
          >
            View in AR
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Mobile header */}
        <div className="bg-[#1a1a1a] border-b border-[#c9a96e]/20 p-4">
          <h1 className="text-xl font-bold text-[#c9a96e] mb-2">Studio</h1>
          <p className="text-xs text-[#999]">ID: {params.id}</p>
        </div>

        {/* Mobile tab toggle */}
        <div className="flex gap-2 p-4 bg-[#0a0a0a] border-b border-[#333]">
          <button
            onClick={() => setMobileView('3d')}
            className={`flex-1 py-2 px-3 rounded text-xs font-semibold transition-colors ${
              mobileView === '3d'
                ? 'bg-[#c9a96e] text-[#0a0a0a]'
                : 'bg-[#1a1a1a] text-[#999] border border-[#333]'
            }`}
          >
            3D View
          </button>
          <button
            onClick={() => setMobileView('controls')}
            className={`flex-1 py-2 px-3 rounded text-xs font-semibold transition-colors ${
              mobileView === 'controls'
                ? 'bg-[#c9a96e] text-[#0a0a0a]'
                : 'bg-[#1a1a1a] text-[#999] border border-[#333]'
            }`}
          >
            Controls
          </button>
        </div>

        {/* Mobile content */}
        {mobileView === '3d' ? (
          <div className="flex-1 relative">
            <Canvas camera={{ position: [4, 2, 3], fov: 50 }}>
              <PerspectiveCamera makeDefault position={[4, 2, 3]} fov={50} near={0.1} far={100} />
              <Room
                floorColor={selectedFloor.color}
                wallColor={selectedWall.color}
                lightTemp={lightTemp}
                lightIntensity={lightIntensity}
              />
              <CameraController />
            </Canvas>

            {/* Mobile AR Button */}
            <Link
              href={`/ar/${params.id}`}
              className="absolute bottom-4 right-4 bg-[#c9a96e] text-[#0a0a0a] px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 hover:bg-[#d4b27f] transition-colors shadow-lg"
            >
              View in AR
              <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Tab navigation */}
              <div className="flex gap-1 bg-[#1a1a1a] rounded p-1">
                {(['floorplan', 'materials', 'shopping'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-2 py-1 text-xs font-semibold rounded transition-colors ${
                      activeTab === tab
                        ? 'bg-[#c9a96e] text-[#0a0a0a]'
                        : 'text-[#999]'
                    }`}
                  >
                    {tab === 'floorplan' && 'Floor'}
                    {tab === 'materials' && 'Mat'}
                    {tab === 'shopping' && 'List'}
                  </button>
                ))}
              </div>

              {/* Floor Plan Tab */}
              {activeTab === 'floorplan' && (
                <div className="space-y-4">
                  <FloorPlanSVG />
                  <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
                    <h3 className="text-xs font-semibold text-[#c9a96e] mb-3">Summary</h3>
                    <div className="space-y-2 text-xs">
                      <p className="flex justify-between">
                        <span className="text-[#999]">Floor Area</span>
                        <span className="font-mono">20 m²</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-[#999]">Height</span>
                        <span className="font-mono">2.8 m</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-[#999]">Windows</span>
                        <span className="font-mono">2</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-[#999]">Doors</span>
                        <span className="font-mono">1</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Materials Tab */}
              {activeTab === 'materials' && (
                <div className="space-y-6 pb-8">
                  <div>
                    <h3 className="text-xs font-semibold text-[#c9a96e] mb-3">Floor Materials</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {FLOOR_MATERIALS.map((material) => (
                        <button
                          key={material.name}
                          onClick={() => setSelectedFloor(material)}
                          className={`relative transition-all ${
                            selectedFloor.name === material.name
                              ? 'ring-2 ring-[#c9a96e]'
                              : ''
                          }`}
                        >
                          <div
                            className="w-full aspect-square rounded-md border border-[#333]"
                            style={{ backgroundColor: material.color }}
                          />
                          <p className="text-xs text-center mt-1 text-[#999]">
                            {material.name.split(' ')[0]}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-[#c9a96e] mb-3">Wall Colors</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {WALL_COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedWall(color)}
                          className={`relative transition-all ${
                            selectedWall.name === color.name ? 'ring-2 ring-[#c9a96e]' : ''
                          }`}
                        >
                          <div
                            className="w-full aspect-square rounded-lg border border-[#333]"
                            style={{ backgroundColor: color.color }}
                            title={color.name}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-[#c9a96e] mb-3">Lighting</h3>
                    <div className="flex gap-2 mb-4">
                      {LIGHTING_TEMPS.map((preset) => (
                        <button
                          key={preset.temp}
                          onClick={() => setLightTemp(preset.temp)}
                          className={`flex-1 py-2 px-2 rounded text-xs font-semibold transition-all ${
                            lightTemp === preset.temp
                              ? `${getTempColor(preset.temp)} text-[#0a0a0a]`
                              : 'bg-[#1a1a1a] border border-[#333] text-[#999]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#999]">Intensity</span>
                        <span className="text-xs text-[#c9a96e]">{(lightIntensity * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1.0"
                        step="0.05"
                        value={lightIntensity}
                        onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                        className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#c9a96e]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shopping List Tab */}
              {activeTab === 'shopping' && (
                <div className="space-y-4 pb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#333]">
                          <th className="text-left py-2 px-2 text-[#999]">Item</th>
                          <th className="text-right py-2 px-2 text-[#999]">Qty</th>
                          <th className="text-right py-2 px-2 text-[#999]">ARS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SHOPPING_LIST.map((row, idx) => (
                          <tr key={idx} className="border-b border-[#222]">
                            <td className="py-3 px-2 text-[#f5f0e8] text-xs">{row.item}</td>
                            <td className="py-3 px-2 text-right text-[#999] text-xs">{row.qty}</td>
                            <td className="py-3 px-2 text-right text-[#f5f0e8] text-xs">{row.priceARS}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333] space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#999]">Total (ARS)</span>
                      <span className="font-mono text-[#f5f0e8]">
                        ${shoppingTotals.totalARS.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="border-t border-[#333] pt-2 flex justify-between text-xs font-semibold">
                      <span className="text-[#c9a96e]">Savings vs China</span>
                      <span className="text-[#c9a96e] font-mono">
                        ${shoppingTotals.savings.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled
                    className="w-full py-2 bg-[#1a1a1a] border border-[#333] rounded text-xs font-semibold text-[#999] flex items-center justify-center gap-2 opacity-50"
                  >
                    <Download size={12} />
                    Export PDF
                    <Lock size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}