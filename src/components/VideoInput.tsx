import React, { useState } from 'react';
import { useVideoContext } from '@/context/VideoContext';
import { fetchVideoDetails, isYouTubeUrl } from '@/utils/youtube';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const VideoInput: React.FC = () => {
    const [url, setUrl] = useState('');
    const { addVideo, loading, setLoading } = useVideoContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url) {
            toast.error("Por favor, insira um link do YouTube.");
            return;
        }

        if (!isYouTubeUrl(url)) {
            toast.error("URL inválida. Por favor, insira um link válido do YouTube.");
            return;
        }

        try {
            setLoading(true);
            const videoDetails = await fetchVideoDetails(url);

            addVideo({
                title: videoDetails.title,
                url,
                thumbnailUrl: videoDetails.thumbnailUrl,
                duration: videoDetails.duration
            });

            toast.success("Vídeo adicionado com sucesso!");
            setUrl('');
        } catch (error) {
            console.error("Error adding video:", error);
            // Toast error is handled in fetchVideoDetails
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full glass-card p-6 rounded-2xl animate-slide-up">
            <div className="mb-4">
                <h2 className="text-lg font-medium">Adicionar novo vídeo</h2>
                <p className="text-sm text-muted-foreground">
                    Insira um link do YouTube para adicionar à sua jornada
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Search size={18} />
                    </div>

                    <Input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="glass-input pl-10 h-12 rounded-xl"
                        disabled={loading}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        <Plus className="w-5 h-5 mr-2" />
                    )}
                    Adicionar vídeo
                </Button>
            </form>
        </div>
    );
};

export default VideoInput;