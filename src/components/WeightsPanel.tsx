"use client";
import { useDataStore } from "@/lib/store";
import { WEIGHT_PRESETS } from "@/lib/weightsDefault";

export default function WeightsPanel() {
  const { weights, setWeight, setPreset } = useDataStore();

  const sliders: [keyof typeof weights, string][] = [
    ["priorityLevel", "Priority Level"],
    ["fulfillment",   "Task Fulfillment"],
    ["fairness",      "Fairness"],
    ["workload",      "Minimize Workload"],
    ["phasePref",     "Phase Preference"],
  ];

  return (
    <div className="border rounded p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Prioritization Weights</h3>
        <select
          className="border p-1 text-sm"
          defaultValue=""
          onChange={(e) => {
            const preset = WEIGHT_PRESETS[e.target.value];
            if (preset) setPreset(preset);
          }}
        >
          <option value="" disabled>Presets</option>
          {Object.keys(WEIGHT_PRESETS).map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </div>

      {sliders.map(([key, label]) => (
        <div key={key}>
          <label className="flex justify-between text-sm mb-1">
            <span>{label}</span>
            <span className="font-mono">{weights[key]}</span>
          </label>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={weights[key]}
            onChange={(e) => setWeight(key, +e.target.value)}
            className="w-full accent-indigo-600"
          />
        </div>
      ))}
    </div>
  );
}
