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

export const deleteProduct = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);

    if (!product) {
      throw new Error(`Product with ID ${args.id} not found`);
    }

    // 1. Delete Storage Objects
    if (product.imagesStorageIds && product.imagesStorageIds.length > 0) {
      await Promise.all(
        product.imagesStorageIds.map(async (storageId) => {
          try {
            await ctx.storage.delete(storageId);
          } catch (error) {
            console.error(`Error deleting storage object ${storageId}`, error);
            // Optionally you can choose to throw or ignore this error.
            // For this example, I'm choosing to log the error and continue.
          }
        })
      );
    }

    // 2. Delete Product
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
    const { id, ...rest } = args;
    await ctx.db.patch(id, {
      ...rest,
      updatedAt: currentTime,
    });

    return id;
  },
});
