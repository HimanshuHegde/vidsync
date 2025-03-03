"use client";
import YouTube from "react-youtube";
import getYoutubeData from "@/backend/search";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export default function Room() {
    const { roomCode } = useParams();
    const searchParams = useSearchParams();
    const name = searchParams.get("name");
    const [searchTerm, setSearchTerm] = useState("");
    const [videos, setVideos] = useState<any[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [socket, setSocket] = useState<any>(null);
    const status = useRef<number>(1);
    const instance = useRef<YouTube | null>(null);

    useEffect(() => {
        if (!socketUrl) return;

        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.on("connect", () => { 
            newSocket.emit("joinRoom", {roomCode,name});
        });


        newSocket.on("selectedVideo", (data) => {
            if(selectedVideo==null)
                setSelectedVideo(data);
            else if(selectedVideo!=data)
                setSelectedVideo(data);
        });

        newSocket.on("trigger", async ({data,time}:{data:number,time:number}) => {   
            if(status.current==data || data == 3)
                return;
            else if(status.current!=data){
                status.current = data;
                if(data==1){
                    let atime =await instance.current?.internalPlayer.getCurrentTime()-time; 
                    if(atime>5||atime<-5)    
                        instance?.current?.internalPlayer.seekTo(time,true);
                    instance?.current?.internalPlayer.playVideo();
                }else if(data == 2){
                    instance?.current?.internalPlayer.pauseVideo();
                }
            }
        }) 

    }, []);
    

   async function trigger({data}:{data:number}){ 
         let time = await instance.current?.internalPlayer.getCurrentTime(); 
        socket.emit("trigger", {data,roomCode,time});
    }

    const handleSearch = async () => {
        const results = await getYoutubeData(searchTerm);
        const result = results.map((item: any) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
        }));
        setVideos(result);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6 relative overflow-hidden">
            
            {/* Floating Neon Circle Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full top-[-50px] left-[-50px]"></div>
                <div className="absolute w-80 h-80 bg-purple-500 opacity-20 blur-3xl rounded-full bottom-[-50px] right-[-50px]"></div>
            </div>

            <div className="relative w-full max-w-3xl bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700 p-8 text-center z-10">
                
                {/* Room Code Header */}
                <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-md">Room: {roomCode}</h1>
                <p className="text-gray-400 mt-2 text-sm md:text-base">Share this code to invite others.</p>

                {/* Search Bar */}
                <div className="flex mt-6 w-full max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder="Search YouTube..."
                        className="flex-1 p-3 bg-gray-800 text-white border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold rounded-r-md hover:opacity-80 transition duration-300"
                    >
                        Search
                    </button>
                </div>

                {/* Video Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    {videos.map((video) => (
                        <div
                            key={video.videoId}
                            className="cursor-pointer border border-gray-700 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition shadow-md transform hover:scale-105 duration-300 overflow-hidden"
                            onClick={() =>{ setSelectedVideo(video.videoId)
                                socket.emit("selectedVideo", {videoId:video.videoId,roomCode});
                            }}
                        >
                            <img src={video.thumbnail} alt={video.title} className="w-full rounded-md" />
                            <p className="mt-2 text-sm font-semibold text-gray-200">{video.title}</p>
                        </div>
                    ))}
                </div>

                {/* Video Player */}
                {selectedVideo && (
                    <div className="mt-8 w-full max-w-3xl">
                        <h2 className="text-lg md:text-xl font-bold text-cyan-400 mb-2">Now Playing</h2>
                        <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-700">
                            <YouTube
                                videoId={selectedVideo}
                                onStateChange={trigger}
                                ref = {instance}
                                opts={{ width: "100%", height: "400", playerVars: { autoplay: 1} }}
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
