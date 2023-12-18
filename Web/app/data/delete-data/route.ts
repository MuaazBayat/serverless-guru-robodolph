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
    const deleteData = transformFormData(formData);

    // Retrieve tableName from the formData, which should not be inserted into the table.
    const tableName = deleteData.tableName as string;
    const redirectUrl = deleteData.redirectUrl as string;
    delete deleteData.tableName; // Ensure we don't attempt to insert the tableName into the database.
    delete deleteData.redirectUrl

    const { error } = await supabase.from(tableName).delete().eq('id', deleteData.id);
    if (error) {
        console.log(error);
        return NextResponse.redirect(
            `${requestUrl.origin}/dashboard`, {
                // a 301 status is required to redirect from a POST to a GET route
                status: 301,
            }
        );
    }
    return NextResponse.redirect(`${requestUrl.origin}/${redirectUrl}`, {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
    });
}