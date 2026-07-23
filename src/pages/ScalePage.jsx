import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

export default function ScalePage() {
  const { id } = useParams();
  const [scale, setScale] = useState(null);
  const [styles, setStyles] = useState([]);
  const [songCounts, setSongCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scaleRes, stylesRes, songsRes] = await Promise.all([
          API.get(`/scales/${id}`),
          API.get(`/styles`),
          API.get(`/songs?scale=${id}`),
        ]);
        setScale(scaleRes.data);
        setStyles(stylesRes.data);

        // Style tokkoon tokkoon song meeqa akka qabu lakkaa'i
        const counts = {};
        songsRes.data.forEach((song) => {
          const styleId = song.style?._id;
          if (styleId) counts[styleId] = (counts[styleId] || 0) + 1;
        });
        setSongCounts(counts);
      } catch {
        setError("Odeeffannoo fiduu hin dandeenye.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Fe'aa jira...</p>
      </div>
    );
  }

  if (error || !scale) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-red-400">{error || "Scale hin argamne."}</p>
      </div>
    );
  }

  // Style kan faarfannoo qabu qofa agarsiisi
  const availableStyles = styles.filter((s) => songCounts[s._id] > 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HEADER */}
      <div
        className="px-6 py-10 text-center"
        style={{ background: `linear-gradient(to bottom, ${scale.color}33, #111827)` }}
      >
        <Link to="/" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
          ← Gara Home
        </Link>
        <h1 className="text-3xl font-bold mb-2" style={{ color: scale.color }}>
          {scale.name}
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto">{scale.description}</p>
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          {scale.intervals?.map((iv, i) => (
            <span
              key={i}
              className="text-sm px-3 py-1 rounded-full font-mono"
              style={{ backgroundColor: scale.color + "33", color: scale.color }}
            >
              {iv}
            </span>
          ))}
        </div>
      </div>

      {/* STYLES LIST */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold mb-5">🎼 Style Filadhu</h2>

        {availableStyles.length === 0 && (
          <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-400">
            Scale kanaaf faarfannaan ammaaf hin jiru.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {availableStyles.map((style) => (
            <Link
              key={style._id}
              to={`/scale/${id}/style/${style._id}`}
              className="scale-card bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-2xl border-l-4"
              style={{ borderColor: style.color }}
            >
              <h3 className="text-lg font-bold mb-1" style={{ color: style.color }}>
                {style.name}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-2">{style.description}</p>
              <span className="text-xs text-gray-500">
                🎵 {songCounts[style._id]} Faarfannaa
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
