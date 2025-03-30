import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./src/assets"],
    prependData: `@use "vars.scss" as *;`,
  },
  /* config options here */
};

export default nextConfig;
