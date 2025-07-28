import type { CollectionConfig } from "payload"

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
      defaultValue: "user",
    },
  ],
}
