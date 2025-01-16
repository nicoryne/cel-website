/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uqulenyafyepinfweagp.supabase.co']
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false };
    return config;
  },
  redirects() {
    return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === '1'
      ? [
          {
            source: '/((?!maintenance|dashboard(?:/.*)?|login).*)', // Allow `/maintenance` and `/dashboard` and `/login`
            destination: '/maintenance',
            permanent: false
          }
        ]
      : [
          {
            source: '/maintenance',
            destination: '/',
            permanent: false
          }
        ];
  }
};

export default nextConfig;
