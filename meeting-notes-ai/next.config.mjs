/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
    optimizePackageImports: [],
    reactCompiler: false,
    turbo: {
      resolveAlias: {},
    },
  },
};

export default nextConfig;
