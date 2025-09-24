// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb"
// import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { s3Storage } from "@payloadcms/storage-s3"
import path from "path"
import { buildConfig } from "payload"
import sharp from "sharp"
import { fileURLToPath } from "url"

import { Media } from "./collections/Media"
import { Users } from "./collections/Users"
import { Categories } from "./collections/Categories"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  cookiePrefix: "funroad",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      acl: "private",
      signedDownloads: {
        // filters mp4 files
        shouldUseSignedURL: ({ collection, filename, req }) => {
          return filename.endsWith(".mp4")
          // return true // to get Signed Url for all files
        },
        expiresIn: 3600,
      },
      bucket: process.env.S3_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        region: process.env.S3_REGION || "",
        // ... Other S3 configuration
      },
    }),
    // payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
