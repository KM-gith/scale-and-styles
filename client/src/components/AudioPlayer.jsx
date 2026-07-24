import { useState, useRef } from "react";

export default function AudioPlayer({ src, onPlay }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      if (onPlay) onPlay();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-2">
      <button
        onClick={togglePlay}
        className="w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 rounded-full text-white transition flex-shrink-0"
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
      <audio
        ref={audioRef}
        src={`http://localhost:5000${src}`}
        onEnded={() => setIsPlaying(false)}
        className="flex-1 h-8"
        controls
      />
    </div>
  );
}
