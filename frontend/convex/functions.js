import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createFormData = mutation({
  args: {
    industry: v.string(),
    stage: v.string(),
    description: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user){
        throw new Error("you must be logged in to get suggested investors!")
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