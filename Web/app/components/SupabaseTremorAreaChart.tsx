'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import {
    AreaChart,
    BarChart,
    Color,
} from "@tremor/react";

type AllDataAreaChartProps = {
    table: string;
    indexCol: string;
    colours: string[];
    categories: string[];
    tailwindClass: string;
  };

function formatDate(date: Date): string {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
}


function useSupabaseData(table: string): any[] | null {
    const [data, setData] = useState<any[] | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getData = async () => {
            const { data } = await supabase.from(table).select();
            setData(data);
        }
        getData();
    }, [table]);  // Add table to dependency array to refetch if table changes

    return data;
}

function prepareChartData(data: any[], indexCol: string, categories: string[]): { [key: string]: any }[] {
    return data.map(item => {
        let result: { [key: string]: any } = {};
        result[indexCol] = formatDate(new Date(item.created_at));
        
        categories.forEach(category => {
            if (item[category] !== undefined) {
                result[category] = item[category];
            }
        });

        return result;
    });
}

export function AllDataAreaChart({
    table,
    indexCol,
    colours,
    categories,
    tailwindClass
  }: AllDataAreaChartProps) {
      const data = useSupabaseData(table);
      const chartData = prepareChartData(data || [], indexCol, categories);
      const areaChartArgs = {
          className: tailwindClass,
          data: chartData,
          index: indexCol,
          categories: categories,
          colors: colours as Color[],
          showLegend: false,
          yAxisWidth: 60,
      };
      return <AreaChart {...areaChartArgs} />;
  }


export function AllDataBarChart(table: string, indexCol: string, colours: string[], categories: string[], tailwindClass: string) {
    const data = useSupabaseData(table);
    const chartData = prepareChartData(data || [], indexCol, categories);
    const barChartArgs = {
        className: tailwindClass,
        data: chartData,
        index: indexCol,
        categories: categories,
        colors: colours as Color[],
        showLegend: false,
        yAxisWidth: 60,
      };
    return (
        <BarChart {...barChartArgs} />);
}
