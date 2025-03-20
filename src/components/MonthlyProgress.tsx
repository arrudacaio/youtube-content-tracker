import React, { useState } from 'react';
import { useVideoContext } from '@/context/VideoContext';
import { formatMinutes, formatTimeForDisplay } from '@/utils/timeUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Timer, ChartBar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const MonthlyProgress: React.FC = () => {
    const { monthlyProgress, setMonthlyGoal } = useVideoContext();
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempGoal, setTempGoal] = useState('');

    // Get the current month's name
    const getMonthName = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    };

    // Sort progress data by month
    const sortedProgress = [...monthlyProgress].sort((a, b) => {
        return a.month.localeCompare(b.month);
    });

    // Format data for chart
    const chartData = sortedProgress.map(item => {
        const [year, month] = item.month.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1, 1)
            .toLocaleString('pt-BR', { month: 'short' });
        const goalInSeconds = item.goal * 60;
        const percentComplete = Math.min(100, (item.totalWatched / goalInSeconds) * 100);

        return {
            name: monthName,
            month: item.month,
            progresso: Math.round(percentComplete),
            'meta': 100
        };
    });

    // Get current month's progress
    const currentMonthProgress = monthlyProgress.find(p => p.month === selectedMonth) || {
        month: selectedMonth,
        totalWatched: 0,
        goal: 0
    };

    // Handle goal change
    const handleGoalChange = (e: React.FormEvent) => {
        e.preventDefault();

        const newGoal = parseInt(tempGoal, 10);

        if (isNaN(newGoal) || newGoal <= 0) {
            toast.error("Por favor, insira um número positivo válido.");
            return;
        }

        setMonthlyGoal(selectedMonth, newGoal);
        setIsEditing(false);
        toast.success(`Meta atualizada para ${formatMinutes(newGoal)}!`);
    };

    return (
        <div className="w-full glass-card p-6 rounded-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-medium">Progresso Mensal</h2>
                    <p className="text-sm text-muted-foreground">
                        Acompanhe seu consumo de conteúdo por mês
                    </p>
                </div>

                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <ChartBar size={20} />
                </div>
            </div>

            <div className="space-y-6">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                                formatter={(value) => [`${value}%`, 'Progresso']}
                                labelFormatter={(label) => {
                                    const item = chartData.find(d => d.name === label);
                                    return item ? getMonthName(item.month) : label;
                                }}
                            />
                            <Bar
                                dataKey="progresso"
                                radius={[4, 4, 0, 0]}
                                fill="#60A5FA"
                                background={{ fill: '#f5f5f5', radius: [4, 4, 0, 0] }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                        <Select
                            value={selectedMonth}
                            onValueChange={setSelectedMonth}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecione um mês" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortedProgress.map(item => (
                                    <SelectItem key={item.month} value={item.month}>
                                        {getMonthName(item.month)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {!isEditing && (
                            <Button
                                variant="outline"
                                className="h-10 rounded-xl border-primary/20 text-primary hover:bg-primary/10"
                                onClick={() => {
                                    setTempGoal(currentMonthProgress.goal.toString());
                                    setIsEditing(true);
                                }}
                            >
                                <Timer className="w-4 h-4 mr-2" />
                                Alterar meta
                            </Button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleGoalChange} className="space-y-4">
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="Minutos"
                                    value={tempGoal}
                                    onChange={(e) => setTempGoal(e.target.value)}
                                    className="glass-input h-12 rounded-xl"
                                    min="1"
                                />
                            </div>

                            <div className="flex space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-12 rounded-xl"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setTempGoal(currentMonthProgress.goal.toString());
                                    }}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300"
                                >
                                    Salvar
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <Card className="border-primary/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{getMonthName(selectedMonth)}</CardTitle>
                                <CardDescription>Resumo do seu progresso</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <Timer className="w-4 h-4 mr-1 text-primary/70" />
                                            Meta
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {formatMinutes(currentMonthProgress.goal)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <Calendar className="w-4 h-4 mr-1 text-primary/70" />
                                            Assistido
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {formatTimeForDisplay(currentMonthProgress.totalWatched)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MonthlyProgress;