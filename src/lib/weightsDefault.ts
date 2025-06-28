export type Weights = {
  priorityLevel: number;
  fulfillment:   number;
  fairness:      number;
  workload:      number;
  phasePref:     number;
};

export const WEIGHT_PRESETS: Record<string, Weights> = {
  "Maximize Fulfillment": { priorityLevel: 2, fulfillment: 5, fairness: 1, workload: 1, phasePref: 1 },
  "Fair Distribution":    { priorityLevel: 2, fulfillment: 3, fairness: 5, workload: 3, phasePref: 2 },
  "Minimize Workload":    { priorityLevel: 1, fulfillment: 2, fairness: 2, workload: 5, phasePref: 2 },
};

export const DEFAULT_WEIGHTS: Weights = WEIGHT_PRESETS["Maximize Fulfillment"];
