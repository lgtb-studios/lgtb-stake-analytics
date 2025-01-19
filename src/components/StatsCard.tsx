import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface StatsCardProps {
  label: string;
  value?: string | number;
  previousValue?: number | null;
  currentPrice?: string | number;
  isLoading?: boolean;
}

export function StatsCard({ label, value, isLoading, currentPrice, previousValue }: StatsCardProps) {
  const determinePriceChangeStyle = () => {
    const isPriceLabel = [
      'USD Price',
      'Total Staked Value',
    ].some(indicator => label.toLowerCase().includes(indicator.toLowerCase()));

    if (!isPriceLabel || typeof currentPrice !== 'number' || typeof previousValue !== 'number') {
      return 'text-sm font-semibold mt-1';
    }
    if (currentPrice > previousValue) {
      return 'text-sm font-semibold mt-1 text-green-500';
    } else if (currentPrice < previousValue) {
      return 'text-sm font-semibold mt-1 text-red-500';
    }
    return 'text-sm font-semibold mt-1';
  };
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-2">
        <div className="text-xs text-muted-foreground">{label}</div>
        {isLoading ? (
          <Skeleton className="h-4 w-full mt-1" />
        ) : (
          <div className="text-sm font-semibold mt-1">
            {typeof value === 'string' && value.startsWith('$') ? '$' : ''}
            <span className={determinePriceChangeStyle()}>
              {typeof value === 'string' ? value.replace(/^\$/, '') : value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

