import { Card, CardContent } from "./ui/card";

export const StatsCard = ({
  label,
  value,
}: {
  label: string | undefined;
  value: string | number | undefined;
}) => (
  <Card className="bg-muted/50">
    <CardContent className="p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold mt-1">{value}</div>
    </CardContent>
  </Card>
);
