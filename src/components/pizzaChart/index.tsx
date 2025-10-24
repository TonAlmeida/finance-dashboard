'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Transaction } from '@/types/transaction';

interface TransactionsPieChartProps {
  transactions?: Transaction[];
}

// 🎨 Paleta equilibrada e moderna (verde = receita, laranja = despesa, tons neutros de apoio)
const COLORS = [
  '#16A34A', // verde escuro
  '#22C55E', // verde médio
  '#10B981', // verde água
  '#F59E0B', // laranja
  '#FB923C', // laranja claro
  '#FACC15', // amarelo
  '#3B82F6', // azul suave
  '#0EA5E9', // azul celeste
];

export default function TransactionsPieChart({
  transactions = [],
}: TransactionsPieChartProps) {
  // Agrupa as transações por categoria
  const grouped: Record<string, number> = {};

  transactions.forEach((t) => {
    if (!grouped[t.category]) grouped[t.category] = 0;
    grouped[t.category] += Math.abs(t.amount);
  });

  const chartData = Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);

  if (chartData.length === 0) {
    chartData.push({ name: 'Sem dados', value: 1 });
  }

  // Destaque levemente as fatias
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
  }: any) => {
    const radius = outerRadius + 16; // distância do centro
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--foreground))"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="10"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="w-full max-w-[900px] sm:w-1/2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Gráfico de pizza (Categorias)
        </CardTitle>
        <CardDescription className="text-xs">
          cada fatia representa uma categoria registrada
        </CardDescription>
      </CardHeader>

      <CardContent className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={COLORS[i % COLORS.length]}
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
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
