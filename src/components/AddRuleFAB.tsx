"use client";
import { useState } from "react";
import RuleDrawer from "./RuleDrawer";
import { Plus } from "lucide-react";

export default function AddRuleFAB(){
  const [open,setOpen]=useState(false);
  return(
    <>
      <button onClick={()=>setOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg"
        aria-label="add rule">
        <Plus/>
      </button>
      {open&&<RuleDrawer onClose={()=>setOpen(false)}/>}
    </>
  );
}
