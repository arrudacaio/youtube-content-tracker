import { toast } from "sonner";

// Extracts the video ID from a YouTube URL
// export function extractVideoId(url: string): string | null {
//     const regexPatterns = [
//         // Standard YouTube URL
//         /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
//         // Shortened YouTube URL
//         /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
//         // YouTube Embed URL
//         /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
//     ];

//     for (const pattern of regexPatterns) {
//         const match = url.match(pattern);
//         if (match && match[1]) {
//             return match[1];
//         }
//     }

//     return null;
// }

export function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    console.log(match)
    return match ? match[1] : null;
  }
  

// Checks if a given URL is a valid YouTube URL
export function isYouTubeUrl(url: string): boolean {
    return extractVideoId(url) !== null;
}

// Interface for YouTube API response
interface YouTubeVideoDetails {
    title: string;
    thumbnailUrl: string;
    duration: number; // in seconds
}

// Fetches video details from the YouTube API
export async function fetchVideoDetails(url: string): Promise<YouTubeVideoDetails> {
    try {
        const videoId = extractVideoId(url);

        if (!videoId) {
            throw new Error("URL inválida. Por favor, insira um link válido do YouTube.");
        }

        // First, we need to get video details including duration
        const apiKey = 'AIzaSyAuZKM1jAK3ZQqKRIdl9X0mz-XZqZ4cxv0'; // This is a demo key, ideal to replace with your own
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error("Vídeo não encontrado. Por favor, verifique o link e tente novamente.");
        }

        const videoData = data.items[0];
        const title = videoData.snippet.title;
        const thumbnailUrl = videoData.snippet.thumbnails.medium.url;
        const durationString = videoData.contentDetails.duration;

        // Parse duration from ISO 8601 format to seconds
        const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const match = durationString.match(durationRegex);

        if (!match) {
            throw new Error("Não foi possível analisar a duração do vídeo.");
        }

        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        const seconds = parseInt(match[3] || '0', 10);

        const duration = hours * 3600 + minutes * 60 + seconds;

        return {
            title,
            thumbnailUrl,
            duration
        };
    } catch (error) {
        console.error("Error fetching video details:", error);
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error("Ocorreu um erro ao buscar detalhes do vídeo.");
        }
        throw error;
    }
}
