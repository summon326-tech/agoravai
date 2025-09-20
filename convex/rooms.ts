import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rooms").collect();
  },
});

export const listByCinema = query({
  args: { cinemaId: v.id("cinemas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_cinema", (q) => q.eq("cinemaId", args.cinemaId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    cinemaId: v.id("cinemas"),
    number: v.number(),
    projector: v.string(),
    soundSystem: v.string(),
    projectorLampModel: v.optional(v.string()),
    projectorLampHours: v.optional(v.number()),
    projectorLampMaxHours: v.optional(v.number()),
    projectorType: v.optional(v.union(v.literal("lamp"), v.literal("laser"))),
    additionalInfo: v.optional(v.string()),
    amplifiers: v.optional(v.string()),
    projectorIp: v.optional(v.string()),
    server: v.optional(v.string()),
    serverIp: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("rooms", {
      ...args,
      status: "active",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("rooms"),
    number: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("maintenance"), v.literal("stopped"))),
    projector: v.optional(v.string()),
    soundSystem: v.optional(v.string()),
    projectorLampModel: v.optional(v.string()),
    projectorLampHours: v.optional(v.number()),
    projectorLampMaxHours: v.optional(v.number()),
    projectorType: v.optional(v.union(v.literal("lamp"), v.literal("laser"))),
    lastMaintenanceA: v.optional(v.number()),
    lastMaintenanceB: v.optional(v.number()),
    lastMaintenanceC: v.optional(v.number()),
    additionalInfo: v.optional(v.string()),
    amplifiers: v.optional(v.string()),
    projectorIp: v.optional(v.string()),
    server: v.optional(v.string()),
    serverIp: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    // Remove related equipment first
    const equipment = await ctx.db
      .query("equipment")
      .withIndex("by_room", (q) => q.eq("roomId", args.id))
      .collect();
    
    for (const eq of equipment) {
      await ctx.db.delete(eq._id);
    }

    // Remove related maintenance records
    const maintenanceRecords = await ctx.db
      .query("maintenanceRecords")
      .withIndex("by_room", (q) => q.eq("roomId", args.id))
      .collect();
    
    for (const record of maintenanceRecords) {
      await ctx.db.delete(record._id);
    }

    // Remove related session impacts
    const sessionImpacts = await ctx.db
      .query("sessionImpacts")
      .withIndex("by_room", (q) => q.eq("roomId", args.id))
      .collect();
    
    for (const impact of sessionImpacts) {
      await ctx.db.delete(impact._id);
    }

    // Remove related tasks
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_room", (q) => q.eq("roomId", args.id))
      .collect();
    
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // Remove related events
    const events = await ctx.db
      .query("events")
      .withIndex("by_room", (q) => q.eq("roomId", args.id))
      .collect();
    
    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    // Finally remove the room
    return await ctx.db.delete(args.id);
  },
});

export const getMaintenanceAlerts = query({
  args: { cinemaId: v.optional(v.id("cinemas")) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
    const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);

    const rooms = args.cinemaId
      ? await ctx.db
          .query("rooms")
          .withIndex("by_cinema", (q) => q.eq("cinemaId", args.cinemaId!))
          .collect()
      : await ctx.db.query("rooms").collect();
    
    return rooms.filter(room => {
      // Check for overdue maintenance
      if (room.lastMaintenanceA && room.lastMaintenanceA < thirtyDaysAgo) return true;
      if (room.lastMaintenanceB && room.lastMaintenanceB < ninetyDaysAgo) return true;
      if (room.lastMaintenanceC && room.lastMaintenanceC < oneYearAgo) return true;
      
      // Check for projector lamp hours
      if (room.projectorLampHours && room.projectorLampMaxHours) {
        const usagePercent = (room.projectorLampHours / room.projectorLampMaxHours) * 100;
        if (usagePercent > 80) return true;
      }
      
      return false;
    });
  },
});
