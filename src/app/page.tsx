"use client";

import UploadDrop from "@/components/UploadDrop";
import DataGrid from "@/components/DataGrid";
import RulesPanel from "@/components/RulesPanel";
import WeightsPanel from "@/components/WeightsPanel";
import AddRuleFAB from "@/components/AddRuleFAB";
import { useDataStore } from "@/lib/store";

export default function Home(){
  const {clients,workers,tasks}=useDataStore();
  return(
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold">Data Alchemist – Milestone 2 (+ Weights)</h1>

      <UploadDrop/>

      <Section title="Clients" filled={!!clients.length}><DataGrid sheet="clients"/></Section>
      <Section title="Workers" filled={!!workers.length}><DataGrid sheet="workers"/></Section>
      <Section title="Tasks"   filled={!!tasks.length}><DataGrid sheet="tasks"/></Section>

      <WeightsPanel/>
      <RulesPanel/>

      <AddRuleFAB/>
    </main>
  );
}

function Section({title,filled,children}:{title:string;filled:boolean;children:React.ReactNode}){
  return(
    <section>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {filled?children:<p className="text-sm text-gray-400">Upload file to view.</p>}
    </section>
  );
}
