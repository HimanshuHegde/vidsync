"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
    const [roomCode, setRoomCode] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const router = useRouter();

    // Generate a unique 6-character room code
    const generateRoomCode = () => {
        const newRoomCode = uuidv4().substring(0, 6).toUpperCase();
        setRoomCode(newRoomCode);
    };

    // Navigate to the room
    const handleJoinRoom = () => {
        if (!roomCode.trim() || !userName.trim()) return;
        router.push(`/room/${roomCode}?name=${encodeURIComponent(userName)}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white px-6 relative overflow-hidden">
            
            {/* Floating Neon Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute w-96 h-96 bg-cyan-500 opacity-20 blur-3xl rounded-full top-[-50px] left-[-50px]"></div>
                <div className="absolute w-80 h-80 bg-purple-500 opacity-20 blur-3xl rounded-full bottom-[-50px] right-[-50px]"></div>
            </div>

            {/* Main Content */}
            <div className="relative bg-gray-900 bg-opacity-90 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-lg border border-gray-700 w-full max-w-lg text-center z-10">
                
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 drop-shadow-md">Join or Create a Room</h1>
                <p className="text-gray-400 mt-2 text-sm">Enter your name and room code to continue.</p>

                {/* User Name Input */}
                <input
                    type="text"
                    className="mt-6 w-full p-3 border border-gray-600 rounded-md text-center text-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 transition-all"
                    placeholder="Enter Your Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />

                {/* Room Code Input */}
                <input
                    type="text"
                    className="mt-4 w-full p-3 border border-gray-600 rounded-md text-center text-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 transition-all"
                    placeholder="Enter Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                />

                {/* Buttons */}
                <div className="mt-6 flex flex-col space-y-3">
                    <button
                        onClick={handleJoinRoom}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold p-3 rounded-md hover:opacity-80 transition duration-300 shadow-md shadow-cyan-500/20 active:scale-95"
                    >
                        Join Room
                    </button>
                    <button
                        onClick={generateRoomCode}
                        className="w-full bg-gray-800 text-gray-300 font-semibold p-3 rounded-md hover:bg-gray-700 transition duration-300 shadow-md shadow-gray-600/20 active:scale-95"
                    >
                        Generate Room Code
                    </button>
                </div>
            </div>
        </div>
    );
}
