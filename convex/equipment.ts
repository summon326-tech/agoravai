import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipment")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

export const listByCinema = query({
  args: { cinemaId: v.id("cinemas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipment")
      .withIndex("by_cinema", (q) => q.eq("cinemaId", args.cinemaId))
      .collect();
  },
});

export const create = mutation({
  args: {
    roomId: v.id("rooms"),
    cinemaId: v.id("cinemas"),
    name: v.string(),
    description: v.string(),
    ipAddress: v.optional(v.string()),
    category: v.union(
      v.literal("projection"), 
      v.literal("sound"), 
      v.literal("climate"), 
      v.literal("electrical"), 
      v.literal("network"),
      v.literal("other")
    ),
    installDate: v.optional(v.number()),
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("equipment", {
      ...args,
      status: "operational",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("equipment"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    status: v.optional(v.union(v.literal("operational"), v.literal("maintenance"), v.literal("replacement"))),
    category: v.optional(v.union(
      v.literal("projection"), 
      v.literal("sound"), 
      v.literal("climate"), 
      v.literal("electrical"), 
      v.literal("network"),
      v.literal("other")
    )),
    lastMaintenance: v.optional(v.number()),
    nextMaintenance: v.optional(v.number()),
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("equipment") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const getCriticalAlerts = query({
  args: { cinemaId: v.optional(v.id("cinemas")) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const thirtyDaysFromNow = now + (30 * 24 * 60 * 60 * 1000);
    
    let equipment;
    
    if (args.cinemaId) {
      equipment = await ctx.db
        .query("equipment")
        .withIndex("by_cinema", (q) => q.eq("cinemaId", args.cinemaId!))
        .collect();
    } else {
      equipment = await ctx.db.query("equipment").collect();
    }
    
    return equipment.filter(eq => {
      // Equipment needing maintenance soon
      if (eq.nextMaintenance && eq.nextMaintenance <= thirtyDaysFromNow) {
        return true;
      }
      
      // Equipment in maintenance status
      if (eq.status === "maintenance" || eq.status === "replacement") {
        return true;
      }
      
      return false;
    });
  },
});
