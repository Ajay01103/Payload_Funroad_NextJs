/** biome-ignore-all lint/style/useNodejsImportProtocol: Fine to not use node:path */
import { withPayload } from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
    // enable this rule if using svg somewhere in the next js app
    //  rules: {
    //   '*.svg': {
    //     loaders: ['@svgr/webpack'],
    //     as: '*.js',
    //   },
    // },
  },
}

export default withPayload(nextConfig)
