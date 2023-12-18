import {
    Card,
    Title,
    Text,
    Flex,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableBody,
    Badge,
    Button,
} from "@tremor/react";

import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'


export async function useSupabaseDataSingle(table: string, id: string): Promise<any[] | null> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
  
    const {data} = await supabase.from(table).select().eq('id', id) || [];
    return data;
  }
