import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
export default defineSchema({
  ...authTables,
  messages: defineTable({
    userId: v.id("users"),
    body: v.string(),
  }),
  devices: defineTable({
    name: v.string(),
    serialNumber: v.string(),
    status: v.union(
      v.literal("available"),
      v.literal("dispatched"),
      v.literal("repair"),
      v.literal("maintenance")
    ),
    assignedTo: v.optional(v.string()),
    lastMaintenance: v.optional(v.string()), // ISO string
    notes: v.optional(v.string()),
    history: v.array(v.union(v.object({
      type: v.string(),
      date: v.string(),
      user: v.optional(v.string()),
      notes: v.optional(v.string()),
      repairDetails: v.optional(v.object({
        issue: v.string(),
        solution: v.string(),
        cost: v.optional(v.number()),
        technician: v.optional(v.string()),
      })),
    }), v.null())),
  }),
});
