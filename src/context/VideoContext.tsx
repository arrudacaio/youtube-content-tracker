import React, { createContext, useState, useContext, useEffect } from 'react';

export interface Video {
    id: string;
    title: string;
    url: string;
    thumbnailUrl: string;
    duration: number; // in seconds
    addedAt: Date;
}

export interface MonthlyProgress {
    month: string; // format: "YYYY-MM"
    totalWatched: number; // in seconds
    goal: number; // in minutes
}

interface VideoContextType {
    videos: Video[];
    addVideo: (video: Omit<Video, 'id' | 'addedAt'>) => void;
    removeVideo: (id: string) => void;
    goal: number; // in minutes
    setGoal: (minutes: number) => void;
    totalWatched: number; // in seconds
    loading: boolean;
    setLoading: (loading: boolean) => void;
    monthlyProgress: MonthlyProgress[];
    getCurrentMonthProgress: () => MonthlyProgress;
    setMonthlyGoal: (month: string, goal: number) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [videos, setVideos] = useState<Video[]>(() => {
        const savedVideos = localStorage.getItem('watchedVideos');
        return savedVideos ? JSON.parse(savedVideos) : [];
    });

    const [goal, setGoal] = useState<number>(() => {
        const savedGoal = localStorage.getItem('timeGoal');
        return savedGoal ? Number(savedGoal) : 120; // Default: 2 hours (120 minutes)
    });

    const [monthlyProgress, setMonthlyProgress] = useState<MonthlyProgress[]>(() => {
        const savedProgress = localStorage.getItem('monthlyProgress');
        return savedProgress ? JSON.parse(savedProgress) : [];
    });

    const [loading, setLoading] = useState<boolean>(false);

    // Calculate total watched time
    const totalWatched = videos.reduce((total, video) => total + video.duration, 0);

    // Get current month in YYYY-MM format
    const getCurrentMonth = (): string => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    // Get progress for current month
    const getCurrentMonthProgress = (): MonthlyProgress => {
        const currentMonth = getCurrentMonth();
        const existingProgress = monthlyProgress.find(p => p.month === currentMonth);

        if (existingProgress) {
            return existingProgress;
        }

        // If no progress exists for current month, create it
        const newProgress: MonthlyProgress = {
            month: currentMonth,
            totalWatched: 0,
            goal: goal // Use global goal as default
        };

        return newProgress;
    };

    // Update monthly progress when videos change
    useEffect(() => {
        const currentMonth = getCurrentMonth();
        const monthVideos = videos.filter(video => {
            const videoDate = new Date(video.addedAt);
            const videoMonth = `${videoDate.getFullYear()}-${String(videoDate.getMonth() + 1).padStart(2, '0')}`;
            return videoMonth === currentMonth;
        });

        const monthTotalWatched = monthVideos.reduce((total, video) => total + video.duration, 0);

        setMonthlyProgress(prev => {
            const existingIndex = prev.findIndex(p => p.month === currentMonth);

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    totalWatched: monthTotalWatched
                };
                return updated;
            } else {
                return [...prev, {
                    month: currentMonth,
                    totalWatched: monthTotalWatched,
                    goal: goal
                }];
            }
        });
    }, [videos, goal]);

    // Set goal for a specific month
    const setMonthlyGoal = (month: string, newGoal: number) => {
        setMonthlyProgress(prev => {
            const existingIndex = prev.findIndex(p => p.month === month);

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    goal: newGoal
                };
                return updated;
            } else {
                return [...prev, {
                    month,
                    totalWatched: 0,
                    goal: newGoal
                }];
            }
        });
    };

    // Save videos to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('watchedVideos', JSON.stringify(videos));
    }, [videos]);

    // Save goal to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('timeGoal', String(goal));
    }, [goal]);

    // Save monthly progress to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('monthlyProgress', JSON.stringify(monthlyProgress));
    }, [monthlyProgress]);

    // Add a new video
    const addVideo = (videoData: Omit<Video, 'id' | 'addedAt'>) => {
        const newVideo: Video = {
            ...videoData,
            id: crypto.randomUUID(),
            addedAt: new Date(),
        };

        setVideos((prev) => [newVideo, ...prev]);
    };

    // Remove a video
    const removeVideo = (id: string) => {
        setVideos((prev) => prev.filter((video) => video.id !== id));
    };

    return (
        <VideoContext.Provider
            value={{
                videos,
                addVideo,
                removeVideo,
                goal,
                setGoal,
                totalWatched,
                loading,
                setLoading,
                monthlyProgress,
                getCurrentMonthProgress,
                setMonthlyGoal
            }}
        >
            {children}
        </VideoContext.Provider>
    );
};

export const useVideoContext = (): VideoContextType => {
    const context = useContext(VideoContext);
    if (context === undefined) {
        throw new Error('useVideoContext must be used within a VideoProvider');
    }
    return context;
};