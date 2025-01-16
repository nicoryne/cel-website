/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uqulenyafyepinfweagp.supabase.co']
  },
  redirects() {
    return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === '1'
      ? [
          {
            source: '/((?!maintenance|dashboard)).*)',
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
