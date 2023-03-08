/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  // Need for <Image/>?
  images: {
    domains: ['image.tmdb.org'],
  },
}
