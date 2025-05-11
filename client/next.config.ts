import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./src/assets"],
    prependData: `@use "vars.scss" as *;`,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/api/yandex-disk/file/**",
      },
    ],
  },
};

export default nextConfig;
