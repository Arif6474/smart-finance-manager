import withPWA from 'next-pwa';

const withPWAConfig = withPWA({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200
        }
      }
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWAConfig(nextConfig);
