import { TableWithDetail } from '@/components/SupabaseTremorTable'

import { Card, Title, Text, Grid } from "@tremor/react";

export default function Example() {
  const table = "jobs";
  const title = "Jobs";
  const details = "These are all the jobs and tasks that are in the system";
  const columns = ["task", "description","payment","city","date_needed"];
  const columnNames = ["Task", "Description", "Payment", "City", "Date Needed"]
  const createPath = "/jobs/create";
  const createLabel = "Create Job";
  const basePath = "/jobs"

  return (
    <main className='p-20'>
        <TableWithDetail 
            table={table}
            title={title}
            details={details}
            columns={columns}
            columnNames={columnNames}
            createPath={createPath}
            basePath={basePath}
            createLabel={createLabel}
            pageSize={5}
         />
    </main>
  );
}