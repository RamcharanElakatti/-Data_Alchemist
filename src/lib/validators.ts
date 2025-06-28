import { ClientSchema, WorkerSchema, TaskSchema } from "./schemas";
import type { CellErr } from "./store";

export function runValidations(
  clients:any[], workers:any[], tasks:any[]
):Record<"clients"|"workers"|"tasks",CellErr[]>{
  const out={clients:[] as CellErr[],workers:[] as CellErr[],tasks:[] as CellErr[]};

  /* 1  schema */
  clients.forEach((r,i)=>{
    const res=ClientSchema.safeParse(r);
    if(!res.success) res.error.errors.forEach(e=>
      out.clients.push({row:i,col:e.path[0] as string,msg:e.message}));
  });
  workers.forEach((r,i)=>{
    const res=WorkerSchema.safeParse(r);
    if(!res.success) res.error.errors.forEach(e=>
      out.workers.push({row:i,col:e.path[0] as string,msg:e.message}));
  });
  tasks.forEach((r,i)=>{
    const res=TaskSchema.safeParse(r);
    if(!res.success) res.error.errors.forEach(e=>
      out.tasks.push({row:i,col:e.path[0] as string,msg:e.message}));
  });

  /* 2 duplicate IDs */
  dup(clients,"ClientID").forEach(i=>out.clients.push({row:i,col:"ClientID",msg:"Duplicate"}));
  dup(workers,"WorkerID").forEach(i=>out.workers.push({row:i,col:"WorkerID",msg:"Duplicate"}));
  dup(tasks,"TaskID").forEach(i=>out.tasks.push({row:i,col:"TaskID",msg:"Duplicate"}));

  /* 3 malformed AvailableSlots */
  workers.forEach((r,i)=>{
    try{
      const arr=JSON.parse(r.AvailableSlots);
      if(!Array.isArray(arr)||!arr.every((n:any)=>Number.isInteger(n))){
        throw 0;
      }
    }catch{
      out.workers.push({row:i,col:"AvailableSlots",msg:"Malformed list"});
    }
  });

  /* 4 out-of-range fields */
  clients.forEach((r,i)=>{ if(r.PriorityLevel<1||r.PriorityLevel>5)
    out.clients.push({row:i,col:"PriorityLevel",msg:"1-5 only"}); });
  tasks.forEach((r,i)=>{ if(r.Duration<1)
    out.tasks.push({row:i,col:"Duration",msg:"<1"}); });

  /* 5 broken JSON */
  clients.forEach((r,i)=>{try{JSON.parse(r.AttributesJSON);}
    catch{out.clients.push({row:i,col:"AttributesJSON",msg:"Bad JSON"});} });

  /* 6 unknown task refs */
  const taskIDs=new Set(tasks.map(t=>t.TaskID));
  clients.forEach((r,i)=>{
    const ids=r.RequestedTaskIDs.split(",").map((s:string)=>s.trim());
    const bad=ids.filter((id:string)=>!taskIDs.has(id));
    if(bad.length) out.clients.push({row:i,col:"RequestedTaskIDs",msg:`Unknown ${bad.join(" ")}`});
  });

  /* 7 overloaded workers */
  workers.forEach((r,i)=>{
    try{ const len=JSON.parse(r.AvailableSlots).length;
      if(len<r.MaxLoadPerPhase) out.workers.push({row:i,col:"MaxLoadPerPhase",msg:"Load>slots"}); }
    catch{/* handled above */}
  });

  /* 8 skill coverage */
  const skills=new Set(workers.flatMap((w)=>w.Skills.split(",").map((s:string)=>s.trim())));
  tasks.forEach((r,i)=>{
    const need=r.RequiredSkills.split(",").map((s:string)=>s.trim());
    const miss=need.filter((x:string)=>!skills.has(x));
    if(miss.length) out.tasks.push({row:i,col:"RequiredSkills",msg:`Missing ${miss.join(" ")}`});
  });

  return out;
}

function dup(arr:any[], key:string){
  const seen=new Map<string,number>(); const d:number[]=[];
  arr.forEach((r,i)=>{ if(seen.has(r[key])) d.push(i); else seen.set(r[key],i);});
  return d;
}
