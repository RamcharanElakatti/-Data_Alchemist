"use client";
import { useDataStore } from "@/lib/store";
import { Download, Trash } from "lucide-react";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export default function RulesPanel(){
  const {rules,deleteRule,clients,workers,tasks,weights}=useDataStore();

  function exportAll(){
    // rules + weights
    const ruleBlob=new Blob([JSON.stringify({rules,weights},null,2)],{type:"application/json"});
    saveAs(ruleBlob,"rules.json");

    // cleaned CSVs
    saveAs(new Blob([Papa.unparse(clients)],{type:"text/csv"}),"clients_clean.csv");
    saveAs(new Blob([Papa.unparse(workers)],{type:"text/csv"}),"workers_clean.csv");
    saveAs(new Blob([Papa.unparse(tasks)],{type:"text/csv"}),"tasks_clean.csv");
  }

  return(
    <div className="border rounded p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Rules ({rules.length})</h3>
        <button onClick={exportAll}
          className="flex items-center gap-1 text-sm text-indigo-600">
          <Download size={16}/> Export package
        </button>
      </div>
      <ul className="text-sm space-y-2">
        {rules.map(r=>(
          <li key={r.id} className="flex justify-between items-center border p-2 rounded">
            <span>{r.type}</span>
            <button onClick={()=>deleteRule(r.id)} title="delete">
              <Trash size={14}/>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
