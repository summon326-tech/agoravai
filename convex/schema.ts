import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  cinemas: defineTable({
    name: v.string(),
    location: v.string(),
    totalRooms: v.optional(v.number()),
    activeRooms: v.optional(v.number()),
    availability: v.optional(v.number()),
  }),
  
  rooms: defineTable({
    cinemaId: v.id("cinemas"),
    number: v.number(),
    status: v.union(v.literal("active"), v.literal("maintenance"), v.literal("stopped")),
    projector: v.string(),
    soundSystem: v.string(),
    projectorLampModel: v.optional(v.string()),
    projectorLampHours: v.optional(v.number()),
    projectorLampMaxHours: v.optional(v.number()),
    projectorType: v.optional(v.union(v.literal("lamp"), v.literal("laser"))),
    // Preventive maintenance fields
    lastMaintenanceA: v.optional(v.number()), // 30 days
    lastMaintenanceB: v.optional(v.number()), // 90 days
    lastMaintenanceC: v.optional(v.number()), // 365 days
    // Temporary fields for migration
    additionalInfo: v.optional(v.string()),
    amplifiers: v.optional(v.string()),
    projectorIp: v.optional(v.string()),
    server: v.optional(v.string()),
    serverIp: v.optional(v.string()),
  }).index("by_cinema", ["cinemaId"]),

  // New table for custom equipment
  equipment: defineTable({
    roomId: v.id("rooms"),
    cinemaId: v.id("cinemas"),
    name: v.string(),
    description: v.string(),
    ipAddress: v.optional(v.string()),
    status: v.union(v.literal("operational"), v.literal("maintenance"), v.literal("replacement")),
    category: v.union(
      v.literal("projection"), 
      v.literal("sound"), 
      v.literal("climate"), 
      v.literal("electrical"), 
      v.literal("network"),
      v.literal("other")
    ),
    installDate: v.optional(v.number()),
    lastMaintenance: v.optional(v.number()),
    nextMaintenance: v.optional(v.number()),
    warrantyExpiry: v.optional(v.number()),
    cost: v.optional(v.number()),
  }).index("by_room", ["roomId"])
    .index("by_cinema", ["cinemaId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"]),

  // Enhanced maintenance records
  maintenanceRecords: defineTable({
    equipmentId: v.optional(v.id("equipment")),
    roomId: v.id("rooms"),
    cinemaId: v.id("cinemas"),
    type: v.union(v.literal("preventive"), v.literal("corrective"), v.literal("emergency")),
    category: v.union(
      v.literal("projection"), 
      v.literal("sound"), 
      v.literal("climate"), 
      v.literal("electrical"), 
      v.literal("network"),
      v.literal("cleaning"),
      v.literal("other")
    ),
    description: v.string(),
    cost: v.optional(v.number()),
    downtime: v.optional(v.number()), // minutes
    technician: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.union(v.literal("scheduled"), v.literal("in-progress"), v.literal("completed"), v.literal("cancelled")),
    notes: v.optional(v.string()),
  }).index("by_room", ["roomId"])
    .index("by_cinema", ["cinemaId"])
    .index("by_date", ["startTime"])
    .index("by_type", ["type"])
    .index("by_category", ["category"]),

  // Session impact tracking
  sessionImpacts: defineTable({
    roomId: v.id("rooms"),
    cinemaId: v.id("cinemas"),
    date: v.number(),
    sessionTime: v.string(),
    impactType: v.union(v.literal("cancelled"), v.literal("delayed"), v.literal("interrupted")),
    cause: v.union(
      v.literal("projection"), 
      v.literal("sound"), 
      v.literal("climate"), 
      v.literal("electrical"), 
      v.literal("network"),
      v.literal("other")
    ),
    delayMinutes: v.optional(v.number()),
    description: v.string(),
    resolved: v.boolean(),
    resolutionTime: v.optional(v.number()),
  }).index("by_room", ["roomId"])
    .index("by_cinema", ["cinemaId"])
    .index("by_date", ["date"]),
  
  tasks: defineTable({
    cinemaId: v.id("cinemas"),
    roomId: v.optional(v.id("rooms")),
    equipmentId: v.optional(v.id("equipment")),
    title: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
    assignedTo: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    category: v.optional(v.union(
      v.literal("maintenance"), 
      v.literal("cleaning"), 
      v.literal("technical"), 
      v.literal("administrative")
    )),
  }).index("by_cinema", ["cinemaId"])
    .index("by_room", ["roomId"])
    .index("by_status", ["status"]),
  
  events: defineTable({
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
    status: v.union(v.literal("scheduled"), v.literal("in-progress"), v.literal("completed"), v.literal("cancelled")),
  }).index("by_cinema", ["cinemaId"])
    .index("by_room", ["roomId"])
    .index("by_date", ["startTime"]),
  
  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
