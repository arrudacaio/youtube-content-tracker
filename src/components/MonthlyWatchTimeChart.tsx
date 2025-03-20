import React from 'react';
import { useVideoContext } from '@/context/VideoContext';
import { formatTimeForDisplay } from '@/utils/timeUtils';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const MonthlyWatchTimeChart: React.FC = () => {
    const { monthlyProgress } = useVideoContext();

    // Sort progress data by month
    const sortedProgress = [...monthlyProgress].sort((a, b) => {
        return a.month.localeCompare(b.month);
    });

    // Format data for chart
    const chartData = sortedProgress.map(item => {
        const [year, month] = item.month.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1, 1)
            .toLocaleString('default', { month: 'short' });

        // Convert seconds to hours for better visualization
        const hoursWatched = Math.round((item.totalWatched / 3600) * 100) / 100;

        return {
            name: monthName,
            month: item.month,
            hoursWatched,
            fullMonth: new Date(parseInt(year), parseInt(month) - 1, 1)
                .toLocaleString('default', { month: 'long', year: 'numeric' })
        };
    });

    // Find max value for domain with some padding
    const maxHours = Math.max(...chartData.map(item => item.hoursWatched), 1) * 1.2;

    const chartConfig = {
        hoursWatched: {
            label: "Horas Assistidas",
            color: "#60A5FA"
        }
    };

    return (
        <Card className="w-full h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Tempo Assistido por Mês</CardTitle>
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Clock size={20} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${value}h`}
                                    domain={[0, maxHours]}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            formatter={(value) => [`${value} horas`, 'Tempo Assistido']}
                                            labelFormatter={(label) => {
                                                const item = chartData.find(d => d.name === label);
                                                return item ? item.fullMonth : label;
                                            }}
                                        />
                                    }
                                />
                                <Bar
                                    dataKey="hoursWatched"
                                    fill="var(--color-hoursWatched, #60A5FA)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default MonthlyWatchTimeChart;