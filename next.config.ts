import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Standalone mode for smaller builds & faster cold starts on Appwrite Sites */
  output: "standalone",
  reactCompiler: true,
};

export default nextConfig;
