/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'dolunayisitme.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Geçersiz resim URL'lerini önleme için
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'accept',
            value: 'image/(.*)',
          },
        ],
        destination: '/images/placeholder.jpg',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig; 