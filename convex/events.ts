import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

export const listByCinema = query({
  args: { cinemaId: v.id("cinemas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_cinema", (q) => q.eq("cinemaId", args.cinemaId))
      .collect();
  },
});

export const listByRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

export const listByDateRange = query({
  args: {
    cinemaId: v.optional(v.id("cinemas")),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const events = args.cinemaId
      ? await ctx.db
          .query("events")
          .withIndex("by_cinema", (q) => q.eq("cinemaId", args.cinemaId!))
          .collect()
      : await ctx.db.query("events").collect();
    
    return events.filter(event => 
      event.startTime >= args.startDate && event.startTime <= args.endDate
    ).sort((a, b) => a.startTime - b.startTime);
  },
});

export const create = mutation({
  args: {
    cinemaId: v.id("cinemas"),
    roomId: v.optional(v.id("rooms")),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    type: v.union(
      v.literal("maintenance"), 
      v.literal("cleaning"), 
      v.literal("inspection"), 
      v.literal("meeting")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", {
      ...args,
      status: "scheduled",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    type: v.optional(v.union(
      v.literal("maintenance"), 
      v.literal("cleaning"), 
      v.literal("inspection"), 
      v.literal("meeting")
    )),
    status: v.optional(v.union(v.literal("scheduled"), v.literal("in-progress"), v.literal("completed"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("events"),
    status: v.union(v.literal("scheduled"), v.literal("in-progress"), v.literal("completed"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { status: args.status });
  },
});
