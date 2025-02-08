import { Card } from "../ui/card";

interface Metrics {
    label: string;
    value: number;
}

export function PercentChart({ label, value }: Metrics) {
    return (
        <div className="px-2">
            <Card className="p-2">
                <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                className="stroke-muted fill-none"
                                strokeWidth="10"
                                cx="50"
                                cy="50"
                                r="40"
                            />
                            <circle
                                className="stroke-primary fill-none"
                                strokeWidth="8"
                                strokeLinecap="round"
                                cx="50"
                                cy="50"
                                r="40"
                                strokeDasharray={`${(value / 100) * 283} 283`}
                                transform="rotate(-90 50% 50%)"
                                style={{
                                    transformOrigin: 'center',
                                    transition: 'stroke-dasharray 0.5s ease'
                                }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm font-semibold">{value}%</span>
                            <span className="text-xs text-muted-foreground">{label}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}