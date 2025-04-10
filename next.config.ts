import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.1.17',
    'localhost'
  ],
  /* config options here */
};

export default nextConfig;
