/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  // Need for <Image/>. make sure the hostname exists in this next.config.js file. But when next.config.js file changes we need to cut the dev server and run again.
  images: {
    domains: ['image.tmdb.org', 'rb.gy', 'assets.nflxext.com'],
  },
}
