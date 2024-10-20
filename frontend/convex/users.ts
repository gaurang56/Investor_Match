import {v} from "convex/values"
import { internalMutation,query } from "./_generated/server";
import { MutationCtx, QueryCtx } from "./_generated/server";

const FREE_CREDITS = 5
export const getUser = query({
    args: {},
    handler: async (ctx, args) => {
      const user = await ctx.auth.getUserIdentity();

      if (!user) {
        return undefined;
      }

      const dbUser = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", user.subject))
        .first();

      if (!dbUser) {
        return undefined;
      }

      return {
        ...dbUser,
        credits: dbUser.credits || 0,
      };
    },
  });

export const createUser = internalMutation({
    args: {email: v.string(), userId: v.string()},
    handler: async(ctx, args) => {
        await ctx.db.insert("users", {
            email: args.email,
            userId: args.userId,
            credits: FREE_CREDITS
        })
    }
})

export const updateSubscription = internalMutation({
    args: {subscriptionId: v.string(), userId: v.string(), endsOn: v.number()},
    handler: async(ctx, args) => {
        const user = await ctx.db.query('users').withIndex('by_userId', q=>q.eq('userId', args.userId)).first();

        if (!user) {
            throw new Error("no user found with that user id")
        }

        await ctx.db.patch(user._id, {
            subscriptionId: args.subscriptionId,
            endsOn: args.endsOn
        })

    }

})
export const removeSubscription = internalMutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
      const user = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      await ctx.db.patch(user._id, {
        subscriptionId: undefined,
        endsOn: undefined,
      });
    },
  });

export const updateSubscriptionBySubId = internalMutation({
    args: { subscriptionId: v.string(), endsOn: v.number() },
    handler: async (ctx, args) => {
      const user = await ctx.db
        .query("users")
        .withIndex("by_subscriptionId", (q) =>
          q.eq("subscriptionId", args.subscriptionId)
        )
        .first();

      if (!user) {
        throw new Error("no user found with that user id");
      }

      await ctx.db.patch(user._id, {
        endsOn: args.endsOn,
      });
    },
  });

  export const getUserCredits = query({
    args: {},
    handler: async (ctx) => {
      const user = await ctx.auth.getUserIdentity();

      if (!user) {
        return 0;
      }

      const userRecord = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", user.subject))
        .first();

      if (!userRecord) {
        return 0;
      }

      return userRecord.credits || 0;
    },
  });

  export const increaseCredits = internalMutation({
    args: { userId: v.string(), amount: v.number() },
    handler: async (ctx, args) => {
      const user = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      const updatedCredits = (user.credits || 0) + args.amount;

      await ctx.db.patch(user._id, { credits: updatedCredits });

      return updatedCredits;
    },
  });

export function getFullUser(ctx: QueryCtx | MutationCtx, userId: string){
    return ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
}