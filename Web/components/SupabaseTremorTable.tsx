"use client"

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from "next/link";
import {
    Card,
    Title,
    Text,
    Flex,
    Subtitle,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableBody,
    Button,
} from "@tremor/react";

export function useSupabaseData(table: string, page: number, limit: number): [any[] | null, number] {
    const [data, setData] = useState<any[] | null>(null);
    const [total, setTotal] = useState<number>(0);
    const supabase = createClient();

    useEffect(() => {
        const getData = async () => {
            const startIndex = (page - 1) * limit;
            const { data, count } = await supabase.from(table)
                .select('*', { count: 'exact' })
                .range(startIndex, startIndex + limit - 1);
            setData(data);
            setTotal(count || 0);
        }
        getData();
    }, [table, page, limit]); 

    return [data, total];
}

type TableWithButtonsProps = {
    table: string;
    title: string;
    details: string;
    columns: string[];
    columnNames: string[];
    basePath: string;
    createPath: string;
    createLabel: string;
    pageSize: number;
}

type IncomingData = {
    [key: string]: string | number;
};

type Columns = keyof IncomingData;

function filterColumns(incoming: IncomingData[] | null, columns: Columns[]) {
    if (!incoming) return []; // Return an empty array if incoming is null

    return incoming.map(data => {
        let obj: Partial<IncomingData> = {};
        obj.id = data.id;
        columns.forEach(column => {
            if (data[column] !== undefined) {
                obj[column] = data[column];
            }
        });
        return obj;
    });
}

export function TableWithDetail({
    table,
    title,
    details,
    columns,
    columnNames,
    createPath,
    basePath,
    createLabel,
    pageSize
}: TableWithButtonsProps) {

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(pageSize); // Set your default page size here
    const [tableData, totalItems] = useSupabaseData(table, page, limit) || [[], 0];
    console.log(tableData, totalItems)
    const items = filterColumns(tableData, columns);

    const totalPages = Math.ceil(totalItems / limit);

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePrevious = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div className="p-5">
            <Card>
                <Flex justifyContent="between" className="space-x-2">
                    <Title>{title}</Title>
                    <Link href={createPath || ""}>
                        <Button size="xs" variant="secondary" color="slate">
                            {createLabel}
                        </Button>
                    </Link>
                </Flex>
                <Text className="mt-2">{details}</Text>
                <Table className="mt-10">
                    <TableHead>
                        <TableRow>
                            {columnNames.map(column => (
                                <TableHeaderCell key={column}>
                                    {column}
                                </TableHeaderCell>
                            ))}
                            <TableHeaderCell>More</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item, idx) => (
                            <TableRow key={idx}>
                                {columns.map(column => (
                                    <TableCell key={column}>{item[column]}</TableCell>
                                ))}
                                <TableCell>
                                    <Link href={`${basePath}/${item.id}`}>
                                        <Button size="xs" variant="secondary" color="gray">
                                            See more
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <hr className=" p-8" />
                <Flex justifyContent="between" className="space-x-2">
                    <Button size="xs" variant="secondary" color="slate" onClick={handlePrevious} disabled={page <= 1}>Prev</Button>
                    <Subtitle>Page {page} of {totalPages}</Subtitle>
                    <Button size="xs" variant="secondary" color="slate" onClick={handleNext} disabled={page >= totalPages}>Next</Button>
                </Flex>
            </Card>
        </div>
    );
}
