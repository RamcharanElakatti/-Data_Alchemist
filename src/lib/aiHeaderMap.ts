import type { Entity } from "./parse";
import OpenAI from "openai";

function createClient() {
  const key = process.env.OPENAI_API_KEY;
  return key ? new OpenAI({ apiKey: key }) : null;
}
const openai = createClient();

const CANONICAL: Record<Entity, string[]> = {
  clients:["ClientID","ClientName","PriorityLevel","RequestedTaskIDs","GroupTag","AttributesJSON"],
  workers:["WorkerID","WorkerName","Skills","AvailableSlots","MaxLoadPerPhase","WorkerGroup","QualificationLevel"],
  tasks:["TaskID","TaskName","Category","Duration","RequiredSkills","PreferredPhases","MaxConcurrent"],
};

export async function mapHeaders(entity: Entity, headers: string[]){
  if(!openai){
    return Object.fromEntries(headers.map(h=>[h,h])); // identity fallback
  }
  const sys="Return ONLY minified JSON mapping each incoming header to a canonical header or \"UNKNOWN\".";
  const user=`canonical=${JSON.stringify(CANONICAL[entity])}\nincoming=${JSON.stringify(headers)}`;

  const res=await openai.chat.completions.create({
    model:"gpt-4o-mini",
    temperature:0,
    messages:[{role:"system",content:sys},{role:"user",content:user}],
  });
  try{ return JSON.parse(res.choices[0].message.content??"{}"); }
  catch{ return Object.fromEntries(headers.map(h=>[h,h])); }
}
