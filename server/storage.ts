import { type User, type InsertUser, type TeamMember, type InsertTeamMember, users, teamMembers, visitorCounter } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getTeamMembers(): Promise<TeamMember[]>;
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember>;
  removeTeamMember(id: number): Promise<void>;
  initializeVisitorCount(): Promise<void>;
  getVisitorCount(): Promise<number>;
  incrementVisitorCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(teamMembers.id);
  }

  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [created] = await db.insert(teamMembers).values(member).returning();
    return created;
  }

  async updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [updated] = await db.update(teamMembers).set(member).where(eq(teamMembers.id, id)).returning();
    return updated;
  }

  async removeTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  async initializeVisitorCount(): Promise<void> {
    const rows = await db.select().from(visitorCounter);
    if (rows.length === 0) {
      await db.insert(visitorCounter).values({ count: 70 });
    } else if (rows[0].count < 70) {
      await db.update(visitorCounter).set({ count: 70 }).where(eq(visitorCounter.id, rows[0].id));
    }
  }

  async getVisitorCount(): Promise<number> {
    const rows = await db.select().from(visitorCounter);
    if (rows.length === 0) {
      const [row] = await db.insert(visitorCounter).values({ count: 70 }).returning();
      return row.count;
    }
    return rows[0].count;
  }

  async incrementVisitorCount(): Promise<number> {
    const rows = await db.select().from(visitorCounter);
    if (rows.length === 0) {
      const [row] = await db.insert(visitorCounter).values({ count: 71 }).returning();
      return row.count;
    }
    const newCount = rows[0].count + 1;
    await db.update(visitorCounter).set({ count: newCount }).where(eq(visitorCounter.id, rows[0].id));
    return newCount;
  }
}

export const storage = new DatabaseStorage();
