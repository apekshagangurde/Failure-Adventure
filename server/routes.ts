import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scenarioSchema, createScenarioSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // Helper function to shuffle array
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get all scenarios (shuffled)
  app.get("/api/scenarios", async (req, res) => {
    try {
      const allScenarios = await storage.getAllScenarios();
      
      // Filter out custom scenarios unless specifically requested
      const includeCustom = req.query.includeCustom === 'true';
      const filteredScenarios = includeCustom 
        ? allScenarios 
        : allScenarios.filter(s => !s.isCustom);
      
      // Get the count parameter, limit to maximum 20 scenarios
      const count = Math.min(
        parseInt(req.query.count as string) || 10,
        20
      );
      
      // Shuffle the scenarios and return requested number
      const shuffled = shuffleArray(filteredScenarios);
      const scenarios = shuffled.slice(0, count);
      
      res.json(scenarios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scenarios" });
    }
  });

  // Get a specific scenario by ID
  app.get("/api/scenarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid scenario ID" });
      }

      const scenario = await storage.getScenario(id);
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }

      res.json(scenario);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scenario" });
    }
  });

  // Route to create a custom scenario
  app.post("/api/custom-scenarios", async (req, res) => {
    try {
      // Validate the request body against the schema
      const result = createScenarioSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid scenario data", 
          errors: result.error.format() 
        });
      }
      
      // Create the custom scenario
      const scenario = await storage.createCustomScenario(result.data);
      
      res.status(201).json(scenario);
    } catch (error) {
      console.error("Error creating custom scenario:", error);
      res.status(500).json({ message: "Failed to create custom scenario" });
    }
  });
  
  // Route to get all custom scenarios
  app.get("/api/custom-scenarios", async (req, res) => {
    try {
      const customScenarios = await storage.getCustomScenarios();
      res.json(customScenarios);
    } catch (error) {
      console.error("Error fetching custom scenarios:", error);
      res.status(500).json({ message: "Failed to fetch custom scenarios" });
    }
  });
  
  // Route to get a scenario by its share ID
  app.get("/api/shared-scenarios/:shareId", async (req, res) => {
    try {
      const shareId = req.params.shareId;
      const scenario = await storage.getScenarioByShareId(shareId);
      
      if (!scenario) {
        return res.status(404).json({ message: "Shared scenario not found" });
      }
      
      res.json(scenario);
    } catch (error) {
      console.error("Error fetching shared scenario:", error);
      res.status(500).json({ message: "Failed to fetch shared scenario" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
