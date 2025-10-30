'use client';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChartData } from "@/types/barChartData";

interface ChartProps {
  data?: BarChartData[];
}

export const description = "An area chart with a legend";

const chartConfig = {
  income: { label: "income", color: "#4CAF50" },
  expenses: { label: "expenses", color: "#F44336"},
} satisfies ChartConfig;

export default function Chart({ data = [] }: ChartProps) {
  return (
    <Card className="w-full max-w-[600px] sm:w-1/2">
      <CardHeader>
        <CardTitle>Gráfico de barras (Entradas/Saídas)</CardTitle>
        <CardDescription>comparativo de entradas/saídas por mês</CardDescription>
      </CardHeader>
      <CardContent>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="#4CAF50" radius={4} />
            <Bar dataKey="expenses" fill="#F44336" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
