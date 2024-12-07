import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query, action, internalAction } from "./_generated/server";
import { Device } from "../lib/types";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const ASSISTANT_ID = "asst_pKGNe7bM9JjMNq7lfGw2M4GG";

// Add new function to get or create thread
async function getOrCreateThread() {
  try {
    // Try to get existing thread from environment/storage
    let threadId = "thread_8adiWzrZoLsT0ANDaPuTYePL";
    
    if (!threadId) {
      // Create new thread if none exists
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      // In a real implementation, you'd want to persist this ID
      console.log("Thread ID:", threadId);
    }
    
    return threadId;
  } catch (error) {
    console.error("Error getting/creating thread:", error);
    throw error;
  }
}

// Update the existing logToAssistant function
export const logToAssistant = internalAction({
  args: { 
    action: v.string(),
    device: v.any()
  },
  handler: async (ctx, { action, device }) => {
    try {
      const message = `device ${action}:
      Device Name: ${device.name}
      Serial Number: ${device.serialNumber}
      Status: ${device.status}
      Action Details: ${JSON.stringify(device, null, 2)}
      Timestamp: ${new Date().toISOString()}
      Add to your knowledge base also retain the history of the device.
      `;

      const threadId = await getOrCreateThread();
      
      // Create message first
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
      });

      // Create run and wait for completion
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: ASSISTANT_ID,
      });

      // Wait for run to complete with timeout
      const startTime = Date.now();
      const TIMEOUT = 30000; // 30 seconds timeout
      
      while (Date.now() - startTime < TIMEOUT) {
        const runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
        if (runStatus.status === "completed") {
          break;
        }
        if (runStatus.status === "failed" || runStatus.status === "cancelled") {
          console.warn(`Run ended with status: ${runStatus.status}`);
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Return a success indicator
      return { success: true };
    } catch (error: any) {
      console.error("Error logging to OpenAI assistant:", error);
      return { success: false, error: error.message };
    }
  },
});

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
    status: v.union(v.literal("available"), v.literal("dispatched"), v.literal("repair"), v.literal("retired"), v.literal("missing")),
    assignedTo: v.optional(v.string()),
    history: v.array(v.null()),
  }) },
  handler: async (ctx, args) => {
    const deviceId = await ctx.db.insert("devices", args.device);
    
    // Now this will wait for the action to complete
    const result = await ctx.scheduler.runAfter(0, internal.devices.logToAssistant, { 
      action: "creation", 
      device: args.device 
    });
    
    
    return deviceId;
  },
});

export const update = mutation({
  args: { 
    _id: v.id("devices"),
    device: v.object({
      name: v.optional(v.string()),
      serialNumber: v.optional(v.string()),
      status: v.union(v.literal("available"), v.literal("dispatched"), v.literal("repair"), v.literal("retired"), v.literal("missing")),
      assignedTo: v.optional(v.string()),
      lastMaintenance: v.optional(v.string()),
      notes: v.optional(v.string()),
      history: v.array(v.object({
        type: v.union(
          v.literal("borrow"), 
          v.literal("return"), 
          v.literal("repair"), 
          v.literal("maintenance"),
          v.literal("retire"), 
          v.literal("missing")
        ),
        date: v.string(),
        user: v.optional(v.string()),
        notes: v.optional(v.string()),
        repairDetails: v.optional(v.object({
          issue: v.string(),
          solution: v.string(),
          cost: v.number(),
          technician: v.string(),
        })),
        retireDetails: v.optional(v.object({
          reason: v.union(v.literal("donated"), v.literal("sold")),
          value: v.optional(v.number()),
          recipient: v.optional(v.string()),
        })),
        receivedBy: v.optional(v.string()),
      })),
    }) 
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args._id, args.device);
    await ctx.scheduler.runAfter(0, internal.devices.logToAssistant, { 
      action: "update", 
      device: args.device 
    });
    return result;
  },
});

export const remove = mutation({
  args: { _id: v.id("devices") },
  handler: async (ctx, args) => {
    const device = await ctx.db.get(args._id);
    const result = await ctx.db.delete(args._id);
    await ctx.scheduler.runAfter(0, internal.devices.logToAssistant, { 
      action: "deletion", 
      device: device 
    });
    return result;
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
      retired: 0,
      missing: 0,
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

export const sendMessage = action({
  args: { message: v.string() },
  handler: async (ctx, args) => {
    try {
      const threadId = await getOrCreateThread();
      
      // Send the message
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: args.message,
      });

      // Create a run
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: ASSISTANT_ID,
      });

      // Wait for the run to complete
      let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      while (runStatus.status !== "completed") {
        if (runStatus.status === "failed" || runStatus.status === "cancelled") {
          throw new Error(`Run ${runStatus.status}: ${runStatus.last_error}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      }

      // Get the messages, focusing on the latest response
      const messages = await openai.beta.threads.messages.list(threadId);
      const lastMessage = messages.data[0]; // Latest message first

      return lastMessage;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      throw error;
    }
  },
});