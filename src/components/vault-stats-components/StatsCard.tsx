import { Card, CardContent } from "../ui/card";

export const StatsCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Card className="min-w-[130px] shadow-sm">
    <CardContent className="p-2">
      <div className="text-[10px]">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </CardContent>
  </Card>
);
