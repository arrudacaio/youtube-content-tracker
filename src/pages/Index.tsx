import React from 'react';
import { VideoProvider } from '@/context/VideoContext';
import Header from '@/components/Header';
import GoalSetting from '@/components/GoalSetting';
import ProgressChart from '@/components/ProgressChart';
import VideoList from '@/components/VideoList';
import MonthlyWatchTimeChart from '@/components/MonthlyWatchTimeChart';

const Index: React.FC = () => {
    return (
        <VideoProvider>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Header />

                    <main className="py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-6">
                                <GoalSetting />
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="h-[350px]">
                                        <ProgressChart />
                                    </div>
                                    <div className="h-[350px]">
                                        <MonthlyWatchTimeChart />
                                    </div>
                                </div>
                                <VideoList />
                            </div>
                        </div>
                    </main>
                </div>

                {/* Decorative elements */}
                <div className="fixed -z-10 top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                <div className="fixed -z-10 top-40 left-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-spin-slow pointer-events-none"></div>
                <div className="fixed -z-10 bottom-40 right-10 w-80 h-80 bg-blue-400/10 rounded-full filter blur-3xl opacity-20 animate-spin-slow pointer-events-none"></div>
            </div>
        </VideoProvider>
    );
};

export default Index;