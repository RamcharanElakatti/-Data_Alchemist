import { create } from "zustand";
import type { Client, Worker, Task } from "./schemas";
import type { AnyRule } from "./ruleTypes";
import { nanoid } from "nanoid";
import { DEFAULT_WEIGHTS, Weights } from "./weightsDefault";

export interface CellErr {
  row: number;
  col: string;
  msg: string;
}

interface State {
  /* data + errors */
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  errors: Record<"clients" | "workers" | "tasks", string[]>;
  cellErrors: Record<"clients" | "workers" | "tasks", CellErr[]>;

  /* rules */
  rules: AnyRule[];

  /* weights */
  weights: Weights;

  /* mutators */
  setData: (k: "clients" | "workers" | "tasks", rows: any[]) => void;
  setErrors: (k: "clients" | "workers" | "tasks", errs: string[]) => void;
  setCellErrors: (k: "clients" | "workers" | "tasks", errs: CellErr[]) => void;

  addRule: (r: Omit<AnyRule, "id">) => void;
  deleteRule: (id: string) => void;

  setWeight: (k: keyof Weights, v: number) => void;
  setPreset: (p: Weights) => void;
}

export const useDataStore = create<State>((set) => ({
  /* ---------- initial state ---------- */
  clients: [],
  workers: [],
  tasks: [],
  errors: { clients: [], workers: [], tasks: [] },
  cellErrors: { clients: [], workers: [], tasks: [] },
  rules: [],
  weights: { ...DEFAULT_WEIGHTS },

  /* ---------- mutators ---------- */
  setData: (k, rows) => set({ [k]: rows } as any),
  setErrors: (k, errs) => set((s) => ({ errors: { ...s.errors, [k]: errs } })),
  setCellErrors: (k, errs) =>
    set((s) => ({ cellErrors: { ...s.cellErrors, [k]: errs } })),

  // ---- UPDATED: cast payload back to AnyRule after adding id ----
  addRule: (r) =>
    set((s) => ({
      rules: [...s.rules, { ...(r as any), id: nanoid(6) } as AnyRule],
    })),

  deleteRule: (id) =>
    set((s) => ({ rules: s.rules.filter((r) => r.id !== id) })),

  setWeight: (k, v) =>
    set((s) => ({ weights: { ...s.weights, [k]: v } })),

  setPreset: (p) => set({ weights: { ...p } }),
}));
