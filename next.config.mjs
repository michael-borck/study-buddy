/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // pdf-parse (pdfjs) must load its worker from node_modules at runtime;
    // bundling it breaks the worker path.
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  images: {
    remotePatterns: [
      {
        hostname: "www.google.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // @xenova/transformers uses onnxruntime-web in browser, but webpack
    // also tries to resolve onnxruntime-node (native bindings).
    // Exclude it so the build doesn't fail on .node binary files.
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node": false,
    };

    // Also ignore .node native addon files
    config.module.rules.push({
      test: /\.node$/,
      use: "ignore-loader",
    });

    return config;
  },
};

export default nextConfig;
