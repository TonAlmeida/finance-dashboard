'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PizzaChartData } from '@/types/pizzaChartData';

const COLORS = [
  '#16A34A', '#22C55E', '#10B981', '#F59E0B', '#FB923C',
  '#FACC15', '#3B82F6', '#0EA5E9', '#A855F7', '#EC4899', '#E11D48',
];

interface CategoryBarChartProps {
  data?: PizzaChartData[];
  title?: string;
  description?: string;
}

export default function CategoryBarChart({
  data = [],
  title = 'Distribuição por Categoria',
  description = 'Comparação dos valores totais por categoria',
}: CategoryBarChartProps) {

  const chartData =
    data && data.length > 0
      ? data
          .filter((d) => typeof d.value === 'number' && d.value > 0)
          .sort((a, b) => b.value - a.value)
      : [{ name: 'Sem dados', value: 0 }];

  return (
    <Card className="w-full max-w-full shadow-md border border-border bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      {/* RESPONSIVE HEIGHT */}
      <CardContent className="h-[260px] sm:h-[300px] md:h-[360px] lg:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <XAxis type="number" />

            {/* RESPONSIVE LABEL WIDTH + FONT */}
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fontSize: 10 }}
              tickMargin={8}
            />

            <Tooltip
              formatter={(v: number, name: string) => [`R$ ${v.toFixed(2)}`, name]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />

            <Legend />

            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
