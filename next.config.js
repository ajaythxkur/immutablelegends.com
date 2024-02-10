/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["nftstorage.link"],
  },
  env: {
    LOCK_CONTRACT_ADDRESS: process.env.LOCK_CONTRACT_ADDRESS,
    CREATOR_ADDRESS: process.env.CREATOR_ADDRESS,
  },
};

module.exports = nextConfig;
