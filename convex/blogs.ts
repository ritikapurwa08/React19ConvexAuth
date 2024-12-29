// convex/blogs.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateBlog = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const newBlog = await ctx.db.insert("blogs", args);
    return newBlog;
  },
});
