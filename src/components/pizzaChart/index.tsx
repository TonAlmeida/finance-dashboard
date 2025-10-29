'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PizzaChartData } from '@/types/pizzaChartData';

// 🎨 Paleta de cores moderna e vibrante
const COLORS = [
  '#16A34A', // verde escuro
  '#22C55E', // verde médio
  '#10B981', // verde água
  '#F59E0B', // laranja
  '#FB923C', // laranja claro
  '#FACC15', // amarelo
  '#3B82F6', // azul suave
  '#0EA5E9', // azul celeste
  '#A855F7', // roxo
  '#EC4899', // rosa
  '#E11D48', // vermelho
];

interface CategoryPieChartProps {
  data?: PizzaChartData[];
  title?: string;
  description?: string;
}

export default function CategoryPieChart({
  data = [],
  title = 'Distribuição por Categoria',
  description = 'Cada fatia representa o total de valores em uma categoria',
}: CategoryPieChartProps) {
  // ⚙️ Garante dados válidos e remove itens sem valor
  const chartData =
    data && data.length > 0
      ? data.filter((d) => d.value > 0)
      : [{ name: 'Sem dados', value: 1 }];

  // 🧮 Soma total (para depuração ou legenda)
  const total = chartData.reduce((acc, cur) => acc + cur.value, 0);

  // 🎯 Labels customizados
  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
    const radius = outerRadius + 14;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--foreground))"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={10}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="w-full max-w-[900px] sm:w-1/2 shadow-md border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              labelLine={false}
              label={renderLabel}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(v: number, name: string) => [`R$ ${v.toFixed(2)}`, name]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          Total: <span className="font-semibold">R$ {total.toFixed(2)}</span>
        </p>
      </CardContent>
    </Card>
  );
}
