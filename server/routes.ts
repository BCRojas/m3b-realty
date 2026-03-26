import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTeamMemberSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await storage.initializeVisitorCount();

  app.post("/api/admin/verify", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return res.status(500).json({ message: "Admin password not configured" });
    }
    if (password === adminPassword) {
      return res.json({ success: true });
    }
    return res.status(401).json({ success: false, message: "Incorrect password" });
  });

  app.post("/api/upload", upload.single("photo"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const base64 = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;
    const imageUrl = `data:${mimeType};base64,${base64}`;
    res.json({ imageUrl });
  });

  app.get("/api/team", async (_req, res) => {
    const members = await storage.getTeamMembers();
    res.json(members);
  });

  app.post("/api/team", async (req, res) => {
    const parsed = insertTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid team member data" });
    }
    const member = await storage.addTeamMember(parsed.data);
    res.status(201).json(member);
  });

  app.patch("/api/team/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const { name, role, imageUrl, portfolioUrl } = req.body;
    const updates: Record<string, string> = {};
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (portfolioUrl !== undefined) updates.portfolioUrl = portfolioUrl;
    const member = await storage.updateTeamMember(id, updates);
    res.json(member);
  });

  app.delete("/api/team/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    await storage.removeTeamMember(id);
    res.status(204).send();
  });

  app.get("/api/visitors", async (_req, res) => {
    const count = await storage.getVisitorCount();
    res.json({ count });
  });

  app.post("/api/visitors/increment", async (_req, res) => {
    const count = await storage.incrementVisitorCount();
    res.json({ count });
  });

  return httpServer;
}
