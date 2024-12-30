import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const upsertUserDetails = mutation({
  args: {
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
      customProfilePicture: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not logged in");
    }
    const existingDetails = await ctx.db
      .query("userDetails")
      .filter((q) => q.eq(q.field("existingUserId"), userId))
      .unique();

    if (existingDetails) {
      await ctx.db.patch(existingDetails._id, {
        ...args.extraUserDetais,
        existingUserId: args.existingUserId,
      });
    } else {
      const userDetails = await ctx.db.insert("userDetails", {
        ...args,
      });
      return userDetails;
    }
  },
});

export const getUserDetailsById = mutation({
  args: {
    userDetailsId: v.id("userDetails"),
  },
  handler: async (ctx, args) => {
    const userDetails = await ctx.db.get(args.userDetailsId);
    if (!userDetails) {
      throw new Error("User details not found");
    }
    return userDetails;
  },
});

export const updateUserDetails = mutation({
  args: {
    userDetailsId: v.id("userDetails"),
    extraUserDetails: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      addAdditionalName: v.optional(v.string()),
      addAdditionalEmail: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      address: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      customProfilePicture: v.optional(v.string()), // Consider removing if you're using profilePicture
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not logged in");
    }

    const existingUserDetails = await ctx.db.get(args.userDetailsId);
    if (!existingUserDetails) {
      throw new Error("User details not found");
    }

    // Authorization check: Ensure the user owns these details
    if (existingUserDetails.existingUserId !== userId) {
      throw new Error("Unauthorized: You can only update your own details.");
    }

    // Merge the existing extraUserDetails with the new ones
    const updatedExtraUserDetails = {
      ...existingUserDetails.extraUserDetais, // Note: Still using extraUserDetais from your schema
      ...args.extraUserDetails,
    };

    // Update the user details
    await ctx.db.patch(args.userDetailsId, {
      existingUserId: userId,
      extraUserDetais: updatedExtraUserDetails, // Using extraUserDetais to match your schema
    });

    // Return the updated details

    return args.userDetailsId;
  },
});

export const addToFavorites = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    // Find the user details
    const userDetails = await ctx.db
      .query("userDetails")
      .withIndex("by_user_id", (q) => q.eq("existingUserId", userId))
      .unique();

    if (!userDetails) {
      throw new Error("User details not found");
    }

    // Check if the product is already in favorites
    const currentFavorites = userDetails.extraUserDetais.favorites || [];
    if (currentFavorites.includes(args.productId)) {
      return { success: false, message: "Product already in favorites" };
    }

    // Add the product to favorites
    const updatedFavorites = [...currentFavorites, args.productId];

    // Update the user details
    await ctx.db.patch(userDetails._id, {
      extraUserDetais: {
        ...userDetails.extraUserDetais,
        favorites: updatedFavorites,
      },
    });

    return { success: true, message: "Product added to favorites" };
  },
});

// convex/userDetails.ts (or wherever you define your mutations)

export const removeFromFavorites = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const userDetails = await ctx.db
      .query("userDetails")
      .withIndex("by_user_id", (q) => q.eq("existingUserId", userId))
      .unique();

    if (!userDetails) {
      throw new Error("User details not found");
    }

    const currentFavorites = userDetails.extraUserDetais.favorites || [];
    const updatedFavorites = currentFavorites.filter(
      (id) => id !== args.productId
    );

    await ctx.db.patch(userDetails._id, {
      extraUserDetais: {
        ...userDetails.extraUserDetais,
        favorites: updatedFavorites,
      },
    });

    return { success: true, message: "Product removed from favorites" };
  },
});

export const isProductFavorite = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    // Find the user details
    const userDetails = await ctx.db
      .query("userDetails")
      .withIndex("by_user_id", (q) => q.eq("existingUserId", userId))
      .unique();

    if (!userDetails) {
      throw new Error("User details not found");
    }

    // Check if the product is in favorites
    const favorites = userDetails.extraUserDetais.favorites || [];
    const isFavorite = favorites.includes(args.productId);

    return isFavorite;
  },
});

export const getAllFavoriteProducts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    // Find the user details
    const userDetails = await ctx.db
      .query("userDetails")
      .withIndex("by_user_id", (q) => q.eq("existingUserId", userId))
      .unique();

    if (!userDetails) {
      throw new Error("User details not found");
    }

    const favoriteIds = userDetails.extraUserDetais.favorites || [];

    // Fetch all favorite products
    const favoriteProducts = await Promise.all(
      favoriteIds.map(async (productId) => {
        const product = await ctx.db.get(productId);
        return product;
      })
    );

    if (!favoriteProducts) {
      return null;
    }

    return favoriteProducts; // Remove any null values if a product was deleted
  },
});

// export const removeFavorite = mutation({
//   args: { productId: v.id("products") },
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx);
//     if (!userId) {
//       throw new Error("Not logged in");
//     }

//     const existingDetails = await ctx.db
//       .query("userDetails")
//       .filter((q) => q.eq(q.field("attachedUserId"), userId))
//       .unique();
//     if (!existingDetails) {
//       throw new Error("User details not found");
//     }
//     let newFavorites = existingDetails?.favorites || [];
//     newFavorites = newFavorites.filter((id) => id !== args.productId);
//     await ctx.db.patch(existingDetails._id, {
//       favorites: newFavorites,
//     });
//     return existingDetails;
//   },
// });

// export const addCartItem = mutation({
//   args: { productId: v.id("products") },
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx);
//     if (!userId) {
//       throw new Error("Not logged in");
//     }

//     const existingDetails = await ctx.db
//       .query("userDetails")
//       .filter((q) => q.eq(q.field("attachedUserId"), userId))
//       .unique();
//     if (!existingDetails) {
//       throw new Error("User details not found");
//     }
//     const newCartItem = existingDetails?.cartItem || [];
//     newCartItem.push(args.productId);
//     await ctx.db.patch(existingDetails._id, {
//       cartItem: newCartItem,
//     });
//     return existingDetails;
//   },
// });

// export const removeCartItem = mutation({
//   args: { productId: v.id("products") },
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx);
//     if (!userId) {
//       throw new Error("Not logged in");
//     }

//     const existingDetails = await ctx.db
//       .query("userDetails")
//       .filter((q) => q.eq(q.field("attachedUserId"), userId))
//       .unique();
//     if (!existingDetails) {
//       throw new Error("User details not found");
//     }
//     let newCartItem = existingDetails?.cartItem || [];
//     newCartItem = newCartItem.filter((id) => id !== args.productId);
//     await ctx.db.patch(existingDetails._id, {
//       cartItem: newCartItem,
//     });
//     return existingDetails;
//   },
// });

export const getUserDetails = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("userDetails")
      .filter((q) => q.eq(q.field("existingUserId"), userId))
      .unique();
  },
});
