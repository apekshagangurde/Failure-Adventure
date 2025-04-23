import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the choices for a scenario
export const choiceSchema = z.object({
  A: z.string(),
  B: z.string(),
});

// Define the responses for a scenario
export const responseSchema = z.object({
  A: z.string(),
  B: z.string(),
});

// Define the images for a scenario
export const imageSchema = z.object({
  A: z.string(),
  B: z.string(),
});

// Define the schema for a scenario
export const scenarioSchema = z.object({
  id: z.number(),
  question: z.string(),
  choices: choiceSchema,
  responses: responseSchema,
  images: imageSchema,
  isCustom: z.boolean().optional().default(false),
  createdBy: z.string().optional(),
  shareId: z.string().optional()
});

// Define the scenarios table
export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  choices: jsonb("choices").notNull(),
  responses: jsonb("responses").notNull(),
  images: jsonb("images").notNull(),
  isCustom: boolean("is_custom").default(false),
  createdBy: text("created_by"),
  shareId: text("share_id"),
  createdAt: timestamp("created_at").defaultNow()
});

// Define the users table (just for reference, not actually used in this app)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Create schemas for inserting data
export const insertScenarioSchema = createInsertSchema(scenarios).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Custom scenario creation schema with validation
export const createScenarioSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  choices: choiceSchema,
  responses: responseSchema,
  images: imageSchema.optional().default({
    A: "https://images.unsplash.com/photo-1555116505-38ab61800975?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    B: "https://images.unsplash.com/photo-1555116505-38ab61800975?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }),
  createdBy: z.string().optional(),
  creatorName: z.string().min(2, "Creator name must be at least 2 characters").optional()
});

// Export types
export type Choice = z.infer<typeof choiceSchema>;
export type Response = z.infer<typeof responseSchema>;
export type Image = z.infer<typeof imageSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CreateScenario = z.infer<typeof createScenarioSchema>;
