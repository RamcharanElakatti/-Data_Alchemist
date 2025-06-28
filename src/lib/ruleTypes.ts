export type CoRunRule = {
  id: string;
  type: "coRun";
  tasks: string[];
};

export type SlotRestrictionRule = {
  id: string;
  type: "slotRestriction";
  group: string;
  minCommonSlots: number;
};

export type LoadLimitRule = {
  id: string;
  type: "loadLimit";
  workerGroup: string;
  maxSlotsPerPhase: number;
};

export type PhaseWindowRule = {
  id: string;
  type: "phaseWindow";
  task: string;
  allowed: number[];
};

export type AnyRule =
  | CoRunRule
  | SlotRestrictionRule
  | LoadLimitRule
  | PhaseWindowRule;
