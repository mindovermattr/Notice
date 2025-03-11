import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./src/assets"],
    prependData: `@import "vars.scss";`,
  },
  /* config options here */
};

export default nextConfig;
