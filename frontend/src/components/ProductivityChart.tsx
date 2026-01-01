import React from 'react';

interface ProductivityChartProps {
  productiveSeconds: number;
  unproductiveSeconds: number;
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({
  productiveSeconds,
  unproductiveSeconds,
}) => {
  const total = productiveSeconds + unproductiveSeconds;
  const productivePercent =
    total > 0 ? Math.round((productiveSeconds / total) * 100) : 0;
  const productiveMinutes = Math.round(productiveSeconds / 60);
  const unproductiveMinutes = Math.round(unproductiveSeconds / 60);

  return (
    <div className="focus-card">
      <h3 className="text-sm text-muted-foreground mb-2">Productive vs Unproductive Time</h3>
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-display font-bold text-success">{productivePercent}%</span>
          <span className="text-success font-medium">Productive</span>
        </div>
        <p className="text-xs text-muted-foreground">of total focus time</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Productive minutes</p>
            <p className="text-lg font-semibold text-success">{productiveMinutes} min</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Unproductive minutes</p>
            <p className="text-lg font-semibold text-muted-foreground">{unproductiveMinutes} min</p>
          </div>
        </div>
        <p className="text-xs text-success">↑ 12% Compared to previous period</p>
      </div>
    </div>
  );
};
