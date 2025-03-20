import React, { useEffect, useState } from 'react';
import { useVideoContext } from '@/context/VideoContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatTimeForDisplay, calculatePercentComplete } from '@/utils/timeUtils';

const ProgressChart: React.FC = () => {
    const { totalWatched, goal } = useVideoContext();
    const percentComplete = calculatePercentComplete(totalWatched, goal);

    // For animation effect
    const [animatedPercent, setAnimatedPercent] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedPercent(percentComplete);
        }, 300);

        return () => clearTimeout(timer);
    }, [percentComplete]);

    // Convert goal to seconds for comparison
    const goalInSeconds = goal * 60;

    // Create data for the pie chart
    const data = [
        { name: 'Watched', value: totalWatched },
        { name: 'Remaining', value: Math.max(goalInSeconds - totalWatched, 0) }
    ];

    // If over goal, adjust the chart
    const isOverGoal = totalWatched > goalInSeconds;
    const chartData = isOverGoal
        ? [{ name: 'Watched', value: totalWatched }]
        : data;

    // Colors for the chart
    const COLORS = ['#60A5FA', '#E5E7EB'];
    const OVER_GOAL_COLORS = ['#34D399'];

    return (
        <div className="w-full h-full glass-card rounded-2xl p-6 flex flex-col items-center justify-center animate-scale-in">
            <div className="text-center mb-4">
                <h2 className="text-lg font-medium">Seu progresso</h2>
                <p className="text-sm text-muted-foreground">
                    {isOverGoal
                        ? 'Meta atingida! Continue assistindo!'
                        : 'Você está no caminho certo'}
                </p>
            </div>

            <div className="relative w-full h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={0}
                            dataKey="value"
                            animationDuration={1000}
                            animationBegin={300}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={isOverGoal ? OVER_GOAL_COLORS[index % OVER_GOAL_COLORS.length] : COLORS[index % COLORS.length]}
                                    strokeWidth={0}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-4xl font-bold">
                        {Math.round(animatedPercent)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                        concluído
                    </div>
                </div>
            </div>

            <div className="w-full mt-4 flex justify-between items-center">
                <div className="text-center">
                    <div className="text-sm text-muted-foreground">Assistido</div>
                    <div className="text-xl font-semibold text-primary">
                        {formatTimeForDisplay(totalWatched)}
                    </div>
                </div>

                <div className="h-10 w-px bg-border"></div>

                <div className="text-center">
                    <div className="text-sm text-muted-foreground">Meta</div>
                    <div className="text-xl font-semibold">
                        {formatTimeForDisplay(goalInSeconds)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressChart;