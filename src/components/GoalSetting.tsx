import React, { useState } from 'react';
import { useVideoContext } from '@/context/VideoContext';
import { formatMinutes } from '@/utils/timeUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

const GoalSetting: React.FC = () => {
    const { goal, setGoal } = useVideoContext();
    const [tempGoal, setTempGoal] = useState(goal.toString());
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newGoal = parseInt(tempGoal, 10);

        if (isNaN(newGoal) || newGoal <= 0) {
            toast.error("Por favor, insira um número positivo válido.");
            return;
        }

        setGoal(newGoal);
        setIsEditing(false);
        toast.success(`Meta atualizada para ${formatMinutes(newGoal)}!`);
    };

    return (
        <div className="w-full glass-card p-6 rounded-2xl animate-slide-up delay-100">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-medium">Sua meta de tempo</h2>
                    <p className="text-sm text-muted-foreground">
                        Quanto conteúdo você quer consumir
                    </p>
                </div>

                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Clock size={20} />
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                                setTempGoal(goal.toString());
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Salvar
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold mb-2 text-primary">
                        {formatMinutes(goal)}
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/10"
                        onClick={() => setIsEditing(true)}
                    >
                        Alterar meta
                    </Button>
                </div>
            )}
        </div>
    );
};

export default GoalSetting;