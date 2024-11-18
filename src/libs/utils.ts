export function convertToEmbedUrl(url: string): string | null {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);

    if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];
        return `https://www.youtube.com/embed/${videoId}?controls=0&autoplay=1&mute=1&loop=1&playlist=${videoId}`;
    }

    return null;
}
