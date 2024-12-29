import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addToFavorites = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("favorites", {
      userId: args.userId,
      productId: args.productId,
    });

    return args.userId;
  },
});

export const removeFromFavorites = mutation({
  args: {
    id: v.id("favorites"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
