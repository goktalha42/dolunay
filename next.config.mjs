/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML dışa aktarma için
  images: {
    unoptimized: true, // Statik dağıtım için gerekli
    domains: ['localhost'], // Gerekliyse domainleri ekleyin
  },
  trailingSlash: true, // URL'lerin sonuna / ekler
  assetPrefix: '', // Prod modda, varlıkların önekini ayarlar (CDN için kullanışlı)
  optimizeFonts: true, // Font optimizasyonu
  swcMinify: true, // Daha iyi minification için
};

export default nextConfig; 