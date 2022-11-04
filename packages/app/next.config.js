/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ethRPC: 'https://api.mycryptoapi.com/eth'
  }
}

module.exports = nextConfig
