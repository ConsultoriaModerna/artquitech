'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'extracting' | 'analyzing' | 'generating' | 'complete';

export default function ScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const statusMessages: Record<UploadStatus, string> = {
    idle: 'Ready to upload',
    uploading: 'Uploading...',
    extracting: 'Extracting frames...',
    analyzing: 'Analyzing with AI...',
    generating: 'Generating floor plan...',
    complete: 'Complete!'
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      handleFileSelect(droppedFile);
    } else {
      setError('Please drop a valid video file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    simulateUpload(selectedFile);
  };

  const simulateUpload = async (selectedFile: File) => {
    setStatus('uploading');
    setProgress(0);

    try {
      // Simulate uploading with incremental progress
      await new Promise(resolve => setTimeout(resolve, 1200));
      setProgress(25);

      setStatus('extracting');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(50);

      setStatus('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1800));
      setProgress(75);

      setStatus('generating');
      await new Promise(resolve => setTimeout(resolve, 1200));
      setProgress(100);

      setStatus('complete');

      // Redirect to demo studio after a brief pause
      await new Promise(resolve => setTimeout(resolve, 800));
      router.push('/studio/demo');
    } catch (err) {
      setError('An error occurred during processing');
      setStatus('idle');
      setFile(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8] px-4 py-12">
      <motion.div
        className="max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-12" custom={0} variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#c9a96e]">
            Scan Your Space
          </h1>
          <p className="text-lg text-[#d4c5b9]">
            Record a 60-second walkthrough of your space
          </p>
        </motion.div>

        {/* Drop Zone */}
        <motion.div
          className={`relative mb-8 transition-all duration-300 ${
            status !== 'idle' ? 'opacity-60 pointer-events-none' : ''
          }`}
          custom={1}
          variants={itemVariants}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[#c9a96e] bg-[#1a1410]'
                : 'border-[#3a3530] hover:border-[#c9a96e] hover:bg-[#1a1410]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={status !== 'idle'}
            />

            <motion.div
              className="flex justify-center mb-4"
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            >
              <Camera size={48} className="text-[#c9a96e]" />
            </motion.div>

            <p className="text-lg font-medium mb-2 text-[#f5f0e8]">
              {file ? file.name : 'Drag and drop your video'}
            </p>
            <p className="text-sm text-[#a89968] mb-2">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'or click to browse'}
            </p>
            <p className="text-xs text-[#6b6560]">
              Supports MP4, WebM, and other video formats
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        {status !== 'idle' && file && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            custom={2}
            variants={itemVariants}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-[#c9a96e]">
                {statusMessages[status]}
              </span>
              <span className="text-sm text-[#a89968]">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#1a1410] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#c9a96e] to-[#e5c4a0]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        {status === 'idle' && (
          <motion.div
            className="bg-[#1a1410] border border-[#3a3530] rounded-lg p-6 mb-8"
            custom={3}
            variants={itemVariants}
          >
            <h3 className="font-semibold text-[#c9a96e] mb-3 flex items-center gap-2">
              <Upload size={18} />
              Tips for best results
            </h3>
            <div className="space-y-2 text-sm text-[#d4c5b9]">
              <p>• Move slowly through the space</p>
              <p>• Include all corners and walls</p>
              <p>• Show doors and windows clearly</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-950 border border-red-800 rounded-lg p-4 mb-8 flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {status === 'complete' && (
          <motion.div
            className="bg-green-950 border border-green-800 rounded-lg p-4 flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle2 size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-200 text-sm">
              Processing complete! Redirecting to your floor plan...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}