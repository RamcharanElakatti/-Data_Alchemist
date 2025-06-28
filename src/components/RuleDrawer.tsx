"use client";

import { useState, useMemo } from "react";
import { useDataStore } from "@/lib/store";
import type { AnyRule } from "@/lib/ruleTypes";

export default function RuleDrawer({ onClose }: { onClose: () => void }) {
  /* ----------------------------- UI state ----------------------------- */
  const [step, setStep]       = useState<1 | 2>(1);
  const [type, setType]       = useState<AnyRule["type"] | "">("");
  const [payload, setPayload] = useState<any>({});
  const addRule               = useDataStore((s) => s.addRule);

  /* --------------------- read stable arrays from store ---------------- */
  const tasksRaw   = useDataStore((s) => s.tasks);   // stable ref
  const workersRaw = useDataStore((s) => s.workers); // stable ref

  /* --------------------- derive IDs / groups once --------------------- */
  const tasks = useMemo(
    () => tasksRaw.map((t) => t.TaskID),
    [tasksRaw]
  );

  const workerGroups = useMemo(
    () =>
      Array.from(
        new Set(
          workersRaw
            .map((w) => w.WorkerGroup)
            .filter(Boolean)           // remove empty strings / undefined
        )
      ),
    [workersRaw]
  );

  /* ---------------------------- helpers ------------------------------ */
  function save() {
    addRule({ type, ...payload } as AnyRule);
    onClose();
  }

  /* ----------------------------- JSX --------------------------------- */
  return (
    <div className="fixed inset-0 bg-black/20 flex justify-end z-50">
      <div className="w-[380px] bg-white h-full p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-semibold">New Rule</h3>

        {/* Step 1 – choose type */}
        {step === 1 && (
          <>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AnyRule["type"])}
              className="border p-2 w-full"
            >
              <option value="">Select rule type</option>
              <option value="coRun">Co‑run</option>
              <option value="slotRestriction">Slot Restriction</option>
              <option value="loadLimit">Load Limit</option>
              <option value="phaseWindow">Phase Window</option>
            </select>
            <button
              disabled={!type}
              onClick={() => setStep(2)}
              className="bg-indigo-600 text-white w-full py-2 rounded disabled:opacity-40 mt-3"
            >
              Next
            </button>
          </>
        )}

        {/* Step 2 – param forms */}
        {step === 2 && type === "coRun" && (
          <>
            <label className="block text-sm">Tasks (multi‑select)</label>
            <select
              multiple
              size={6}
              onChange={(e) =>
                setPayload({
                  tasks: [...e.currentTarget.selectedOptions].map((o) => o.value),
                })
              }
              className="border p-2 w-full"
            >
              {tasks.map((id) => (
                <option key={id}>{id}</option>
              ))}
            </select>
            <button
              onClick={save}
              className="bg-green-600 text-white w-full py-2 rounded mt-4"
            >
              Save Rule
            </button>
          </>
        )}

        {step === 2 && type === "loadLimit" && (
          <>
            <label className="block text-sm">Worker Group</label>
            <select
              onChange={(e) =>
                setPayload((p: any) => ({ ...p, workerGroup: e.target.value }))
              }
              className="border p-2 w-full mb-3"
            >
              <option value="">—</option>
              {workerGroups.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            <label className="block text-sm">Max Slots / Phase</label>
            <input
              type="number"
              min={1}
              onChange={(e) =>
                setPayload((p: any) => ({ ...p, maxSlotsPerPhase: +e.target.value }))
              }
              className="border p-2 w-full"
            />

            <button
              onClick={save}
              className="bg-green-600 text-white w-full py-2 rounded mt-4"
            >
              Save Rule
            </button>
          </>
        )}

        {/* TODO: slotRestriction & phaseWindow forms */}

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
