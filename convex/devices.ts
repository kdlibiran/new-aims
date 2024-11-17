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

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const devices = await ctx.db.query("devices").collect();
    
    // Calculate status counts
    const statuses = {
      available: 0,
      dispatched: 0,
      repair: 0,
      maintenance: 0,
    };
    
    devices.forEach(device => {
      statuses[device.status as keyof typeof statuses]++;
    });

    // Calculate most repaired devices
    const repairCounts = new Map<string, number>();
    devices.forEach(device => {
      const repairs = device.history.filter(h => h?.type === 'repair').length;
      if (repairs > 0) {
        repairCounts.set(device.name, repairs);
      }
    });

    const mostRepaired = Array.from(repairCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Calculate most used devices (based on borrow history)
    const usageCounts = devices.map(device => ({
      name: device.name,
      usageHours: device.history.filter(h => h?.type === 'borrow').length * 24, // Rough estimate
      status: device.status
    })).sort((a, b) => b.usageHours - a.usageHours).slice(0, 5);

    // Get recent activity
    const recentActivity = devices.flatMap(device => 
      device.history
        .filter(h => h !== null)
        .map(h => ({
          id: Math.random().toString(), // You might want to use a better ID strategy
          device: device.name,
          action: h!.type,
          date: h!.date
        }))
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

    // Get maintenance schedule
    const maintenanceSchedule = devices
      .filter(device => device.lastMaintenance)
      .map(device => {
        const lastMaintenance = new Date(device.lastMaintenance!);
        const nextMaintenance = new Date(lastMaintenance);
        nextMaintenance.setMonth(nextMaintenance.getMonth() + 3); // Assuming 3-month maintenance cycle
        
        const now = new Date();
        let status: 'On Schedule' | 'Due Soon' | 'Overdue';
        const daysUntilNext = Math.floor((nextMaintenance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilNext < 0) status = 'Overdue';
        else if (daysUntilNext < 14) status = 'Due Soon';
        else status = 'On Schedule';

        return {
          device: device.name,
          lastMaintenance: device.lastMaintenance,
          nextMaintenance: nextMaintenance.toISOString().split('T')[0],
          status
        };
      })
      .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
      .slice(0, 3);

    return {
      total: devices.length,
      statuses,
      mostRepaired,
      mostUsed: usageCounts,
      recentActivity,
      maintenanceSchedule
    };
  },
});