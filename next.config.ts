/** biome-ignore-all lint/style/useNodejsImportProtocol: Fine to not use node:path */
import { withPayload } from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname, ".."),
  },
}

export default withPayload(nextConfig)
