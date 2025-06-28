"use client";
import { useRef, useState } from "react";
import { parseAnyFile } from "@/lib/parse";
import { runValidations } from "@/lib/validators";
import { useDataStore } from "@/lib/store";

export default function UploadDrop(){
  const input=useRef<HTMLInputElement>(null);
  const [names,setNames]=useState<string[]>([]);
  const store=useDataStore();

  async function ingest(list:FileList|null){
    if(!list) return;
    setNames(Array.from(list).map(f=>f.name));

    for(const f of Array.from(list)){
      const parsed=await parseAnyFile(f);
      store.setData("clients",parsed.clients);
      store.setData("workers",parsed.workers);
      store.setData("tasks",parsed.tasks);

      const errs=runValidations(parsed.clients,parsed.workers,parsed.tasks);
      store.setCellErrors("clients",errs.clients);
      store.setCellErrors("workers",errs.workers);
      store.setCellErrors("tasks",errs.tasks);
      store.setErrors("clients",errs.clients.map(e=>e.msg));
      store.setErrors("workers",errs.workers.map(e=>e.msg));
      store.setErrors("tasks",errs.tasks.map(e=>e.msg));
    }
  }

  return(
    <div
      className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer"
      onClick={()=>input.current?.click()}
      onDragOver={e=>e.preventDefault()}
      onDrop={e=>{e.preventDefault();ingest(e.dataTransfer.files);}}
    >
      <p className="text-lg">Drag & drop or click to upload CSV / XLSX</p>
      <p className="text-xs text-gray-500">(AI fixes wrong headers)</p>
      {names.length>0&&<ul className="mt-3 text-sm text-green-700">{names.map(n=><li key={n}>✔ {n}</li>)}</ul>}
      <input ref={input} type="file" multiple accept=".csv,.xlsx" className="hidden"
             onChange={e=>ingest(e.target.files)}/>
    </div>
  );
}
