/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML dışa aktarma için
  images: {
    unoptimized: true, // Statik dağıtım için gerekli
  },
  trailingSlash: true, // URL'lerin sonuna / ekler
};

export default nextConfig; 