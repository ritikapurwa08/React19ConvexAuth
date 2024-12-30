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

// export const updateUserDetails = mutation({
//   args: {
//     firstName: v.optional(v.string()),
//     lastName: v.optional(v.string()),
//     address: v.optional(v.string()),
//     phoneNumber: v.optional(v.string()),
//     profilePicture: v.optional(v.id("_storage")),
//     customProfilePicture: v.optional(v.string()),
//     favorites: v.optional(v.array(v.id("products"))),
//     cartItem: v.optional(v.array(v.id("products"))),
//   },
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
//     await ctx.db.patch(existingDetails._id, { ...args });
//     return existingDetails;
//   },
// });
// export const removeUserDetails = mutation({
//   args: { field: v.string() },
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
//     const field = args.field as keyof typeof existingDetails;
//     if (field && existingDetails[field]) {
//       delete existingDetails[field];

//       await ctx.db.patch(existingDetails._id, existingDetails);

//       return existingDetails;
//     }
//   },
// });

// export const addFavorite = mutation({
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
//     const newFavorites = existingDetails?.favorites || [];
//     newFavorites.push(args.productId);
//     await ctx.db.patch(existingDetails._id, {
//       favorites: newFavorites,
//     });
//     return existingDetails;
//   },
// });

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
