"use client";

import {
  ColumnDef, flexRender,
  getCoreRowModel, useReactTable,
} from "@tanstack/react-table";
import { useDataStore } from "@/lib/store";
import { runValidations } from "@/lib/validators";
import type { Entity } from "@/lib/parse";

export default function DataGrid({sheet}:{sheet:Entity}){
  const s=useDataStore();
  const rows=s[sheet];
  const cellErrs=s.cellErrors[sheet];

  const columns:ColumnDef<any>[] = rows[0]
    ? Object.keys(rows[0]).map(col=>({
        id:col, accessorKey:col, header:col,
        cell: ({row,column})=>(
          <input
            defaultValue={row.getValue(column.id) as string}
            className="w-full p-1 bg-white border rounded text-sm"
            onBlur={e=>{
              const upd=[...rows]; upd[row.index][column.id]=e.target.value;
              s.setData(sheet,upd);
              const errs=runValidations(s.clients,s.workers,s.tasks);
              s.setCellErrors("clients",errs.clients);
              s.setCellErrors("workers",errs.workers);
              s.setCellErrors("tasks",errs.tasks);
              s.setErrors(sheet,errs[sheet].map(er=>er.msg));
            }}
          />
        ),
      }))
    : [];

  const table=useReactTable({data:rows,columns,getCoreRowModel:getCoreRowModel()});
  if(!rows.length)return null;

  const isErr=(r:number,c:string)=>cellErrs.some(e=>e.row===r&&e.col===c);

  return(
    <>
      {s.errors[sheet].length>0&&(
        <div className="mb-2">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded-full">
            {s.errors[sheet].length} issues
          </span>
        </div>
      )}

      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-100">
            {table.getHeaderGroups().map(hg=>(
              <tr key={hg.id}>
                {hg.headers.map(h=>(
                  <th key={h.id} className="p-2 font-semibold text-left">
                    {flexRender(h.column.columnDef.header,h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(r=>(
              <tr key={r.id} className="even:bg-gray-50">
                {r.getVisibleCells().map(c=>(
                  <td key={c.id}
                      className={`p-2 border-t ${isErr(r.index,c.column.id)?"bg-red-100":""}`}>
                    {flexRender(c.column.columnDef.cell,c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
