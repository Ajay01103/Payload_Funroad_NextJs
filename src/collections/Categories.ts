import type { CollectionConfig } from "payload"

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
}
