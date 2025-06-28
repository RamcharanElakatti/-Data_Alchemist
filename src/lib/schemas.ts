import { z } from "zod";

export const ClientSchema = z.object({
  ClientID: z.string(),
  ClientName: z.string(),
  PriorityLevel: z.coerce.number().int().min(1).max(5),
  RequestedTaskIDs: z.string(),
  GroupTag: z.string().optional(),
  AttributesJSON: z.string().default("{}"),
});
export type Client = z.infer<typeof ClientSchema>;

export const WorkerSchema = z.object({
  WorkerID: z.string(),
  WorkerName: z.string(),
  Skills: z.string(),
  AvailableSlots: z.string(),
  MaxLoadPerPhase: z.coerce.number().int().min(1),
  WorkerGroup: z.string().optional(),
  QualificationLevel: z.string().optional(),
});
export type Worker = z.infer<typeof WorkerSchema>;

export const TaskSchema = z.object({
  TaskID: z.string(),
  TaskName: z.string(),
  Category: z.string(),
  Duration: z.coerce.number().int().min(1),
  RequiredSkills: z.string(),
  PreferredPhases: z.string(),
  MaxConcurrent: z.coerce.number().int().min(1),
});
export type Task = z.infer<typeof TaskSchema>;
