import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
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
});

// Define the scenarios table
export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  choices: jsonb("choices").notNull(),
  responses: jsonb("responses").notNull(),
  images: jsonb("images").notNull(),
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

// Export types
export type Choice = z.infer<typeof choiceSchema>;
export type Response = z.infer<typeof responseSchema>;
export type Image = z.infer<typeof imageSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
