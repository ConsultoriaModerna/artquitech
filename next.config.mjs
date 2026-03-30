/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'three': 'three',
    });
    return config;
  },
  transpilePackages: ['three'],
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
