'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'extracting' | 'analyzing' | 'generating' | 'complete';

const statusMessages: Record<UploadStatus, string> = {
  idle: 'Ready to upload',
  uploading: 'Uploading video...',
  extracting: 'Extracting frames...',
  analyzing: 'Analyzing space...',
  generating: 'Generating 3D model...',
  complete: 'Complete!',
};

const statusDurations: Record<UploadStatus, number> = {
  idle: 0,
  uploading: 2000,
  extracting: 2000,
  analyzing: 2000,
  generating: 2000,
  complete: 1000,
};

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('video/')) {
      setError('Please upload a video file');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setProgress(0);
    setStatus('uploading');

    try {
      // Simulate upload and processing pipeline
      const statuses: UploadStatus[] = ['uploading', 'extracting', 'analyzing', 'generating', 'complete'];
      let currentProgress = 0;

      for (const stat of statuses) {
        setStatus(stat);
        const duration = statusDurations[stat];
        const steps = 10;
        const increment = 100 / (statuses.length * steps);

        for (let i = 0; i < steps; i++) {
          await new Promise(resolve => setTimeout(resolve, duration / steps));
          currentProgress = Math.min(100, currentProgress + increment);
          setProgress(Math.floor(currentProgress));
        }
      }

      // Redirect to studio after completion
      setTimeout(() => {
        router.push('/studio/demo');
      }, 1000);
    } catch (err) {
      setError('Failed to process video. Please try again.');
      setStatus('idle');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
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
            Scan Your Space
          </h1>
          <p style={{ color: '#999' }} className="text-lg">
            Upload a 60-second video walkthrough of your room
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="rounded-lg border-2 p-12 text-center mb-8 transition-all cursor-pointer"
          style={{
            borderColor: isDragging ? '#c9a96e' : '#333',
            borderStyle: 'dashed',
            backgroundColor: isDragging ? 'rgba(201, 169, 110, 0.05)' : '#1a1a1a',
          }}
        >
          {status === 'idle' ? (
            <>
              <Upload size={48} style={{ color: '#c9a96e' }} className="mx-auto mb-4" />
              <h3 style={{ color: '#f5f0e8' }} className="text-xl font-bold mb-2">
                Drag and drop your video
              </h3>
              <p style={{ color: '#999' }} className="text-sm mb-6">
                or click to browse
              </p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input">
                <button
                  className="px-6 py-2 rounded-lg font-medium transition-all hover:opacity-90"
                  style={{
                    backgroundColor: '#c9a96e',
                    color: '#0a0a0a',
                  }}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  Select File
                </button>
              </label>
            </>
          ) : (
            <>
              {status === 'complete' ? (
                <CheckCircle size={48} style={{ color: '#c9a96e' }} className="mx-auto mb-4" />
              ) : (
                <div className="inline-block mb-4 p-3 rounded-full" style={{ backgroundColor: 'rgba(201, 169, 110, 0.1)' }}>
                  <div className="animate-spin" style={{ color: '#c9a96e' }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              )}
              <h3 style={{ color: '#f5f0e8' }} className="text-xl font-bold mb-2">
                {statusMessages[status]}
              </h3>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                <motion.div
                  className="h-2 rounded-full transition-all"
                  style={{ backgroundColor: '#c9a96e', width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p style={{ color: '#999' }} className="text-sm">
                {progress}% complete
              </p>
            </>
          )}
        </motion.div>

        {/* File Info */}
        {file && status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg p-4 mb-6"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderWidth: 1 }}
          >
            <p style={{ color: '#999' }} className="text-sm">
              <span style={{ color: '#f5f0e8' }} className="font-medium">
                {file.name}
              </span>
              {' '} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg p-4 mb-6 flex items-start gap-3"
            style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}
          >
            <AlertCircle size={20} style={{ color: '#dc2626' }} className="flex-shrink-0 mt-0.5" />
            <p style={{ color: '#dc2626' }} className="text-sm">
              {error}
            </p>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg p-6"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderWidth: 1 }}
        >
          <h3 style={{ color: '#f5f0e8' }} className="font-bold mb-4">
            Recording Tips
          </h3>
          <ul style={{ color: '#999' }} className="text-sm space-y-2">
            <li>Start with good lighting (natural light is best)</li>
            <li>Keep your phone steady or walk slowly</li>
            <li>Include walls, corners, windows, and doors</li>
            <li>Avoid quick pans or sudden movements</li>
            <li>Aim for 30-60 seconds of footage</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
