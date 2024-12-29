import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addToCard = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("carts", {
      userId: args.userId,
      productId: args.productId,
      quantity: args.quantity,
    });

    return args.userId;
  },
});

export const updateCartItem = mutation({
  args: {
    id: v.id("carts"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      quantity: args.quantity,
    });
    return args.id;
  },
});

export const removeFromCart = mutation({
  args: {
    id: v.id("carts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
