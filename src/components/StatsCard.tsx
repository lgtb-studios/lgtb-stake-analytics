import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface StatsCardProps {
  label: string;
  value?: string;
  isLoading?: boolean;
}

export function StatsCard({ label, value, isLoading }: StatsCardProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-2">
        <div className="text-xs text-muted-foreground">{label}</div>
        {isLoading ? (

          <Skeleton className="h-4 w-full mt-1" />
        ) : (
          <div className="text-sm font-semibold mt-1">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}