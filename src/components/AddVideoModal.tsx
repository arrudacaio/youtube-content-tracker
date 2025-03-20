import React, { useState } from 'react';
import { useVideoContext } from '@/context/VideoContext';
import { fetchVideoDetails, isYouTubeUrl } from '@/utils/youtube';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from '@/components/ui/dialog';

interface AddVideoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AddVideoModal: React.FC<AddVideoModalProps> = ({ open, onOpenChange }) => {
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
            onOpenChange(false);
        } catch (error) {
            console.error("Error adding video:", error);
            // Toast error is handled in fetchVideoDetails
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md glass-card">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium">Adicionar novo vídeo</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Insira um link do YouTube para adicionar à sua jornada
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" className="h-10 rounded-xl">
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            className="h-10 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <Plus className="w-5 h-5 mr-2" />
                            )}
                            Adicionar vídeo
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddVideoModal;