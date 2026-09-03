/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol:'https', hostname:'images.unsplash.com' },
      { protocol:'https', hostname:'picsum.photos' },
      { protocol:'https', hostname:'i.pravatar.cc' },
      { protocol:'https', hostname:'cdn.pixabay.com' },
      { protocol:'https', hostname:'via.placeholder.com' },
      { protocol:'https', hostname:'fastly.picsum.photos' },
    ],
  },
}

module.exports = nextConfig
