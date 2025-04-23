import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scenarioSchema } from "@shared/schema";

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
      
      // Get the count parameter, limit to maximum 20 scenarios
      const count = Math.min(
        parseInt(req.query.count as string) || 10,
        20
      );
      
      // Shuffle the scenarios and return requested number
      const shuffled = shuffleArray(allScenarios);
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

  const httpServer = createServer(app);

  return httpServer;
}
