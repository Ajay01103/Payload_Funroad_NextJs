/** biome-ignore-all lint/style/useNodejsImportProtocol: Fine to not use node:path */
import { withPayload } from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"
// import path from "path"
// import { fileURLToPath } from "url"

// const __dirname = fileURLToPath(new URL(".", import.meta.url))

const nextConfig: NextConfig = {
  /* config options here */
}

export default withPayload(nextConfig)
