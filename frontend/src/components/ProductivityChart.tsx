import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProductivityChartProps {
  productiveSeconds: number;
  unproductiveSeconds: number;
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({
  productiveSeconds,
  unproductiveSeconds,
}) => {
  const total = productiveSeconds + unproductiveSeconds;
  const productivePercent = Math.round((productiveSeconds / total) * 100);
  
  const data = [
    { name: 'Productive', value: productiveSeconds },
    { name: 'Unproductive', value: unproductiveSeconds },
  ];

  const COLORS = ['hsl(var(--success))', 'hsl(var(--chart-neutral))'];

  return (
    <div className="focus-card">
      <h3 className="text-sm text-muted-foreground mb-2">Productive vs Unproductive Time</h3>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={25}
                outerRadius={40}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold text-success">{productivePercent}%</span>
            <span className="text-success font-medium">Productive</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">of total focus time</p>
          <p className="text-xs text-success mt-1">↑ 12% Compared to previous period</p>
        </div>
      </div>
    </div>
  );
};
