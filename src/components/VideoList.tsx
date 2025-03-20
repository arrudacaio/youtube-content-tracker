import React, { useState } from 'react';
import { useVideoContext } from '@/context/VideoContext';
import { formatTime } from '@/utils/timeUtils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, ExternalLink, Clock, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AddVideoModal from './AddVideoModal';

const VideoList: React.FC = () => {
    const { videos, removeVideo } = useVideoContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

    // Filter videos based on search term
    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenVideo = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="w-full h-full glass-card p-6 rounded-2xl animate-slide-up delay-200">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium">Seus vídeos</h2>
                    <p className="text-sm text-muted-foreground">
                        {videos.length} vídeos assistidos
                    </p>
                </div>

                <Button
                    onClick={() => setIsAddVideoModalOpen(true)}
                    className="h-9 w-9 rounded-full p-0 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                >
                    <Plus size={20} />
                    <span className="sr-only">Adicionar vídeo</span>
                </Button>
            </div>

            <div className="relative mb-4">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Search size={16} />
                </div>
                <Input
                    type="text"
                    placeholder="Buscar vídeos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input pl-10 h-10 rounded-xl"
                />
            </div>

            {filteredVideos.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-26rem)] pr-4">
                    <div className="space-y-3">
                        {filteredVideos.map((video) => (
                            <div
                                key={video.id}
                                className="flex items-start space-x-3 p-3 rounded-xl bg-card hover:bg-muted/50 transition-all duration-300"
                            >
                                <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg">
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.title}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                                        <Clock size={10} className="mr-1" />
                                        {formatTime(video.duration)}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium truncate hover:text-clip hover:whitespace-normal transition-all duration-300">
                                        {video.title}
                                    </h3>
                                    <div className="flex mt-2 space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs rounded-lg hover:bg-primary/10 hover:text-primary"
                                            onClick={() => handleOpenVideo(video.url)}
                                        >
                                            <ExternalLink size={14} className="mr-1" />
                                            Abrir
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs rounded-lg hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => removeVideo(video.id)}
                                        >
                                            <Trash2 size={14} className="mr-1" />
                                            Remover
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            ) : (
                <div className="h-[calc(100vh-26rem)] flex flex-col items-center justify-center text-center p-6">
                    {videos.length === 0 ? (
                        <>
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Clock size={24} className="text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">Nenhum vídeo adicionado</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Adicione vídeos do YouTube para acompanhar seu progresso
                            </p>
                            <Button
                                onClick={() => setIsAddVideoModalOpen(true)}
                                className="mt-4 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                            >
                                <Plus size={18} className="mr-1" />
                                Adicionar vídeo
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Search size={24} className="text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">Nenhum resultado</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Nenhum vídeo encontrado para "{searchTerm}"
                            </p>
                        </>
                    )}
                </div>
            )}

            <AddVideoModal
                open={isAddVideoModalOpen}
                onOpenChange={setIsAddVideoModalOpen}
            />
        </div>
    );
};

export default VideoList;