// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  userDetails: defineTable({
    existingUserId: v.optional(v.id("users")),
    extraUserDetais: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      addAdditionalName: v.optional(v.string()),
      addAdditionalEmail: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      address: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      profilePicture: v.optional(v.id("_storage")),
      customProfilePicture: v.optional(v.string()),
      favorites: v.optional(v.array(v.id("products"))),
      cartItem: v.optional(v.array(v.id("products"))),
    }),
  }).index("by_user_id", ["existingUserId"]),
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.float64(),
    category: v.string(),
    updatedAt: v.optional(v.string()),
    imagesStorageIds: v.optional(v.array(v.id("_storage"))),
  })
    .index("price", ["price"])
    .index("category", ["category"]),

  blogs: defineTable({
    name: v.string(),
    image: v.optional(v.id("_storage")),
  }),

  // Your other tables...
});

export default schema;
