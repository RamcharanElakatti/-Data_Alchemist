import Papa from "papaparse";
import * as XLSX from "xlsx";
import { mapHeaders } from "./aiHeaderMap";
export type Entity="clients"|"workers"|"tasks";

function detectEntity(name:string,hdr:string[]):Entity{
  const n=name.toLowerCase();
  if(n.includes("client"))return"clients";
  if(n.includes("worker"))return"workers";
  if(n.includes("task"))return"tasks";
  const h=hdr.map(h=>h.toLowerCase());
  if(h.includes("clientid"))return"clients";
  if(h.includes("workerid"))return"workers";
  return"tasks";
}

export async function parseAnyFile(file:File){
  const buf=await file.arrayBuffer();
  const buckets:{clients:any[];workers:any[];tasks:any[]}={clients:[],workers:[],tasks:[]};

  const normalize=async(raw:any[],ref:string,hdr:string[])=>{
    const ent=detectEntity(ref,hdr);
    const map=await mapHeaders(ent,hdr);
    const rows=raw.map(r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[map[k]??k,v])));
    buckets[ent].push(...rows);
  };

  if(file.name.endsWith(".csv")){
    const txt=new TextDecoder().decode(buf);
    const {data,meta}=Papa.parse<any>(txt,{header:true,skipEmptyLines:true});
    await normalize(data,file.name,meta.fields??[]);
  }else{
    const wb=XLSX.read(buf);
    for(const s of wb.SheetNames){
      const rows=XLSX.utils.sheet_to_json<any>(wb.Sheets[s],{raw:false});
      if(rows.length) await normalize(rows,s,Object.keys(rows[0]));
    }
  }
  return buckets;
}
