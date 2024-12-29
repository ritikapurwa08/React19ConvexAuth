import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.float64(),
    category: v.string(),
    imagesStorageIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return;
    }
    const productId = await ctx.db.insert("products", {
      name: args.name,
      description: args.description,
      price: args.price,
      category: args.category,
      imagesStorageIds: args.imagesStorageIds,
    });

    return productId;
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    description: v.string(),
    price: v.float64(),
    category: v.string(),
    imagesStorageIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const currentTime = Date.now().toLocaleString();

    await ctx.db.patch(args.id, {
      ...args,
      updatedAt: currentTime,
    });

    return args.id;
  },
});

export const deleteProduct = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const getProductById = query({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getAllProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect();
  },
});

// convex/products/getImagesUrl.ts

export const getImagesUrl = query({
  args: { imageStorageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    const imagesUrl = await Promise.all(
      args.imageStorageIds.map(async (imageStorageId) => {
        return await ctx.storage.getUrl(imageStorageId);
      })
    );
    return imagesUrl;
  },
});
