/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as blogs from "../blogs.js";
import type * as carts from "../carts.js";
import type * as favorites from "../favorites.js";
import type * as http from "../http.js";
import type * as products from "../products.js";
import type * as upload from "../upload.js";
import type * as userDetails from "../userDetails.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  blogs: typeof blogs;
  carts: typeof carts;
  favorites: typeof favorites;
  http: typeof http;
  products: typeof products;
  upload: typeof upload;
  userDetails: typeof userDetails;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;