import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

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
