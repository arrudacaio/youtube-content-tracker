import React from 'react';
import { Youtube } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="w-full py-6 px-8 flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Youtube size={24} className="animate-pulse-subtle" />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold text-balance">YouTube Journey</h1>
                    <p className="text-sm text-muted-foreground">Acompanhe seu consumo de conteúdo</p>
                </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
                <div className="p-1 px-3 rounded-full bg-primary/10 text-primary text-sm">
                    Beta
                </div>
            </div>
        </header>
    );
};

export default Header;
