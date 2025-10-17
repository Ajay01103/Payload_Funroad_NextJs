import type { CollectionConfig } from "payload"

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      unique: true,
      required: true,
    },
    {
      name: "products",
      relationTo: "products",
      type: "relationship",
      hasMany: true,
    },
  ],
}
