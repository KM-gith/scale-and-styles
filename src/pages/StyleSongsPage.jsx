import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import AudioPlayer from "../components/AudioPlayer";

export default function StyleSongsPage() {
  const { scaleId, styleId } = useParams();
  const [scale, setScale] = useState(null);
  const [style, setStyle] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scaleRes, styleRes, songsRes] = await Promise.all([
          API.get(`/scales/${scaleId}`),
          API.get(`/styles/${styleId}`),
          API.get(`/songs?scale=${scaleId}&style=${styleId}`),
        ]);
        setScale(scaleRes.data);
        setStyle(styleRes.data);
        setSongs(songsRes.data);
      } catch {
        setError("Odeeffannoo fiduu hin dandeenye.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [scaleId, styleId]);

  const handlePlay = async (songId) => {
    try {
      await API.put(`/songs/${songId}/play`);
    } catch {
      // silent fail
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Fe'aa jira...</p>
      </div>
    );
  }

  if (error || !scale || !style) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-red-400">{error || "Odeeffannoo hin argamne."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HEADER */}
      <div
        className="px-6 py-10 text-center"
        style={{ background: `linear-gradient(to bottom, ${style.color}33, #111827)` }}
      >
        <Link to={`/scale/${scaleId}`} className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
          ← Gara {scale.name}
        </Link>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{ backgroundColor: scale.color + "33", color: scale.color }}
          >
            {scale.name}
          </span>
          <span className="text-gray-500">×</span>
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{ backgroundColor: style.color + "33", color: style.color }}
          >
            {style.name}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: style.color }}>
          {style.name}
        </h1>
      </div>

      {/* SONGS LIST */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold mb-5">
          🎶 Faarfannoota ({songs.length})
        </h2>

        {songs.length === 0 && (
          <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-400">
            Faarfannaan combination kanaaf ammaaf hin jiru.
          </div>
        )}

        <div className="space-y-4">
          {songs.map((song) => (
            <div key={song._id} className="bg-gray-800 rounded-xl p-5 shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold">{song.title}</h3>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                </div>
                <span className="text-xs text-gray-500">▶ {song.plays || 0}</span>
              </div>

              {song.description && (
                <p className="text-gray-400 text-sm mb-3">{song.description}</p>
              )}

              <AudioPlayer src={song.audioUrl} onPlay={() => handlePlay(song._id)} />

              {song.tags?.length > 0 && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {song.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
