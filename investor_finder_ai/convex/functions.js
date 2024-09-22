import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Mutation to handle form data
export const createFormData = mutation({
  args: {
    industry: v.string(),
    stage: v.string(),
    description: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert form data into the "formvalues" table
    await ctx.db.insert("formvalues", {
      industry: args.industry,
      stage: args.stage,
      description: args.description,
      location: args.location,
      
    });
  },
});
