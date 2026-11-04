const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

const reactPath = require.resolve("react", { paths: [__dirname] })
const reactDomPath = require.resolve("react-dom", { paths: [__dirname] })

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  transpilePackages: ["@medusajs/icons"],
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
        ...config.resolve.alias,
        "react$": reactPath,
        "react/jsx-runtime$": require.resolve("react/jsx-runtime", {
          paths: [__dirname],
        }),
        "react/jsx-dev-runtime$": require.resolve("react/jsx-dev-runtime", {
          paths: [__dirname],
        }),
        "react-dom$": reactDomPath,
        "react-dom/client$": require.resolve("react-dom/client", {
          paths: [__dirname],
        }),
        "react-dom/server$": require.resolve("react-dom/server", {
          paths: [__dirname],
        }),
    }

    return config
  },
}

module.exports = nextConfig
