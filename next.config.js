/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript:{
    ignoreBuildErrors:true,
  },
  eslint:{
    ignoreDuringBuilds:true,
  },
  images: {
    dangerouslyAllowSVG:true,
    domains: ['placehold.co'],
  },

 
  devIndicators:{
    Position:"bottom-right",}
};

module.exports = nextConfig;
