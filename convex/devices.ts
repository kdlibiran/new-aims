import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Device } from "../lib/types";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("devices").collect() as unknown as Device[];
  },
}); 

export const create = mutation({
  args: { device: v.object({
    name: v.string(),
    serialNumber: v.string(),
    status: v.union(v.literal("available"), v.literal("dispatched"), v.literal("repair"), v.literal("maintenance")),
    history: v.array(v.null()),
  }) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("devices", args.device);
  },
});

export const update = mutation({
  args: { 
    _id: v.id("devices"),
    device: v.object({
      name: v.optional(v.string()),
      serialNumber: v.optional(v.string()),
      status: v.union(v.literal("available"), v.literal("dispatched"), v.literal("repair"), v.literal("maintenance")),
      assignedTo: v.optional(v.string()),
      lastMaintenance: v.optional(v.string()),
      notes: v.optional(v.string()),
      history: v.array(v.object({
        type: v.union(v.literal("borrow"), v.literal("return"), v.literal("repair"), v.literal("maintenance")),
        date: v.string(),
        user: v.optional(v.string()),
        notes: v.optional(v.string()),
        repairDetails: v.optional(v.object({
          issue: v.string(),
          solution: v.string(),
          cost: v.number(),
          technician: v.string(),
        })),
      })),
    }) 
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args._id, args.device);
  },
});

export const remove = mutation({
  args: { _id: v.id("devices") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args._id);
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const device = await ctx.db
      .query("devices")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();
    
    if (!device) return null;
    
    // Destructure to exclude _creationTime
    const { _creationTime, ...deviceWithoutCreationTime } = device;
    return deviceWithoutCreationTime as Device;
  },
});