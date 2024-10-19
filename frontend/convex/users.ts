import {v} from "convex/values"
import { internalMutation,query } from "./_generated/server";
import { MutationCtx, QueryCtx } from "./_generated/server";

const FREE_CREDITS = 5
export const getUser = query({
    args: {},
    handler: async (ctx, args) => {
      const user = await ctx.auth.getUserIdentity();
  
      if (!user) {
        return undefined
      }
  
      return ctx.db.query("users").withIndex("by_userId", (q)=>q.eq("userId", user.subject)).first();
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
  
export function getFullUser(ctx: QueryCtx | MutationCtx, userId: string){
    return ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
} 