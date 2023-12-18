import { useSupabaseDataSingle } from '@components/SupabaseFetchSingle'
import { Card, Title, Text, Grid, Col } from "@tremor/react";
import {UpdateForm} from '@components/Forms'

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const data = await useSupabaseDataSingle('accounts', id) || []
    const fields = [
        { inputName: "task", inputLabel: "Task", inputPlaceholder: "Mow the Lawn" },
        { inputName: "description", inputLabel: "Description", inputPlaceholder: "Small backyard" },
    ]
    const details = {
        tableName: "jobs",
        redirectUrl: `jobs`,
        id: id,
        idColName: 'id',
    }

    const detailsKeys = [
        "job_title",
        "job_description",
    ]

    return (
        <main className='p-20'>
                <Card className="h-full">
                        <UpdateForm fields={fields} details={details}/>
                    </Card>
        </main>
    )
}