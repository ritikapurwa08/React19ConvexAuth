// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  userDetails: defineTable({
    userId: v.id("users"),
    FirstName: v.string(),
    lastName: v.optional(v.string()),
    address: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),
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
  carts: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  }),
  favorites: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
  }).index("userId", ["userId"]),
  blogs: defineTable({
    name: v.string(),
    image: v.optional(v.id("_storage")),
  }),

  // Your other tables...
});

export default schema;
