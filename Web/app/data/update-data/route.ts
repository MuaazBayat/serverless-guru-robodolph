'use server';

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function transformFormData(formData: FormData): Record<string, FormDataEntryValue> {
    let data = Array.from(formData.entries()).reduce((acc, [key, value]) => {
        let newKey = key.replace('account', '');
        newKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);

        acc[newKey] = value;
        return acc;
    }, {} as Record<string, FormDataEntryValue>);

    return data;
}

export async function POST(request: Request) {
    const requestUrl = new URL(request.url);
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const formData = await request.formData();
    const updateData = transformFormData(formData);

    // Retrieve tableName from the formData, which should not be inserted into the table.
    const tableName = updateData.tableName as string;
    const redirectUrl = updateData.redirectUrl as string;
    const id = updateData.id as string;
    const idColName = updateData.idColName as string;
    delete updateData.tableName; // Ensure we don't attempt to insert the tableName into the database.
    delete updateData.redirectUrl;
    delete updateData.id;
    delete updateData.idColName;

    console.log(updateData)
    console.log(tableName)
    console.log(id)

    const {data, error } = await supabase.from(tableName).update(updateData).eq(idColName, id).select();
    if (error) {
        console.log(error);
        return NextResponse.redirect(
            `${requestUrl.origin}/dashboard`, {
                // a 301 status is required to redirect from a POST to a GET route
                status: 301,
            }
        );
    }
    console.log(data)
    return NextResponse.redirect(`${requestUrl.origin}/${redirectUrl}`, {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
    });
}