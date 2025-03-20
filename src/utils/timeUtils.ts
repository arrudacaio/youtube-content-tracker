
/**
 * Formats seconds into a readable time string (HH:MM:SS)
 */
export function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
}

/**
 * Formats seconds into hours and minutes for display
 */
export function formatTimeForDisplay(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

/**
 * Formats minutes into a readable time string (Xh Ym)
 */
export function formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
    } else {
        return `${remainingMinutes}m`;
    }
}

/**
 * Parses a YouTube duration string (ISO 8601) into seconds
 * Example: "PT1H30M15S" => 5415 seconds (1h 30m 15s)
 */
export function parseYouTubeDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (!match) {
        return 0;
    }

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Calculates the percentage of completion
 */
export function calculatePercentComplete(current: number, goal: number): number {
    // Convert goal from minutes to seconds for comparison
    const goalInSeconds = goal * 60;

    // Calculate percentage
    const percentage = (current / goalInSeconds) * 100;

    // Cap at a maximum of 100%
    return Math.min(percentage, 100);
}
