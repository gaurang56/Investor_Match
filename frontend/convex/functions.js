import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getFullUser } from "./users";
import { api } from "./_generated/api";
import { useQuery } from "convex/react";
import Stripe from "stripe";



export const createFormData = mutation({
  args: {
    industry: v.string(),
    stage: v.string(),
    description: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    
    if (!user) {
      throw new Error("Not authenticated");
    }
    
    const userRecord = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", user.subject))
    .first();

    if (!userRecord){
      throw new Error("no user with that id found")
  }

    const isSubscribed = userRecord.endsOn ? userRecord.endsOn > Date.now() : false;
      
    if (!isSubscribed && userRecord.credits <=0){
      throw new Error("Please upgrade to continue using")
    }

    if (!isSubscribed) {
      await ctx.db.patch(userRecord._id, {
        credits: Math.max(0, userRecord.credits - 1),
      });
    }
  
    
  

    

    await ctx.db.insert("formvalues", {
      industry: args.industry,
      stage: args.stage,
      description: args.description,
      location: args.location,
      userId: user.subject
      
    });
  },
});


export const storeInvestorData = mutation({
    args: {
      investors: v.string(),
    },
    handler: async (ctx, args) => {
      const user = await ctx.auth.getUserIdentity();
  
      if (!user) {
        throw new Error("You must be logged in to store investor data!");
      }
  
      await ctx.db.insert("investors", {
        data: args.investors,
        userId: user.subject,
        
      });
  
      
    },
  });

  export const getInvestors = query({
    
    args: {},
    handler: async (ctx, args) => {
      const user = await ctx.auth.getUserIdentity();
  
      if (!user){
         return [];
      }
  
      return await ctx.db.query('investors').filter(q=>
        q.eq(q.field('userId'), user.subject)
      ).collect()
    },
  
})

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

    return userRecord.credits;
  },
});

