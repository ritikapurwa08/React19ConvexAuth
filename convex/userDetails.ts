import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUserDetails = mutation({
  args: {
    userId: v.id("users"),
    FirstName: v.string(),
    lastName: v.optional(v.string()),
    address: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("userDetails", args);
  },
});
export const updateUserDetails = mutation({
  args: {
    id: v.id("userDetails"),
    FirstName: v.string(),
    lastName: v.optional(v.string()),
    address: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);

    return args.id;
  },
});
