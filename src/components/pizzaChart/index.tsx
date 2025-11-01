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

// 🎨 Paleta de cores
const COLORS = [
  '#16A34A', '#22C55E', '#10B981', '#F59E0B', '#FB923C',
  '#FACC15', '#3B82F6', '#0EA5E9', '#A855F7', '#EC4899', '#E11D48',
];

interface CategoryPieChartProps {
  data?: PizzaChartData[];
  title?: string;
  description?: string;
}

/**
 * Tipagem local para o renderLabel — evita depender dos tipos do `recharts`
 * e permite tratar strings como "50%".
 */
interface RenderLabelProps {
  cx: number | string | undefined;
  cy: number | string | undefined;
  midAngle: number | undefined;
  outerRadius: number | undefined;
  percent: number | undefined;
  name?: string | number | undefined;
}

export default function CategoryPieChart({
  data = [],
  title = 'Distribuição por Categoria',
  description = 'Cada fatia representa o total de valores em uma categoria',
}: CategoryPieChartProps) {
  // Filtra somente valores positivos — fallback se não houver dados
  const chartData =
    data && data.length > 0
      ? data.filter((d) => typeof d.value === 'number' && d.value > 0)
      : [{ name: 'Sem dados', value: 1 }];

  const RADIAN = Math.PI / 180;

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
  }: RenderLabelProps) => {
    // Segurança: defaults para variáveis possivelmente undefined
    const cxNum = typeof cx === 'string' ? parseFloat(cx) : cx ?? 0;
    const cyNum = typeof cy === 'string' ? parseFloat(cy) : cy ?? 0;
    const mid = typeof midAngle === 'number' ? midAngle : 0;
    const outer = typeof outerRadius === 'number' ? outerRadius : 70;
    const pct = typeof percent === 'number' ? percent : 0;
    const labelName = name ?? '';

    const radius = outer + 14;
    const x = cxNum + radius * Math.cos(-mid * RADIAN);
    const y = cyNum + radius * Math.sin(-mid * RADIAN);

    // Se x/y for NaN (por alguma razão), evita renderizar texto inválido
    if (!isFinite(x) || !isFinite(y)) return null;

    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--foreground))"
        textAnchor={x > cxNum ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={10}
      >
        {`${String(labelName)} ${(pct * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="w-full max-w-[900px] sm:w-1/2 shadow-md border border-border bg-transparent">
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
      </CardContent>
    </Card>
  );
}
