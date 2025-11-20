/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || 'demo',
    NEWS_API_KEY: process.env.NEWS_API_KEY || '',
    FINNHUB_API_KEY: process.env.FINNHUB_API_KEY || '',
  },
}

module.exports = nextConfig

