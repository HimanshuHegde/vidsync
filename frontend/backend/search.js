'use server';
const API_KEY = process.env.YOUTUBE_KEY;
export default async function getYoutubeData(searchValue) {
    if(searchValue == null) return null;
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&q=${searchValue}&key=${API_KEY}`);
    const data = await response.json();
    return data.items
}