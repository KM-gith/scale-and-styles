import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Home() {
  const [scales, setScales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScales = async () => {
      try {
        const res = await API.get("/scales");
        setScales(res.data);
      } catch {
        setError("Scales fiduu hin dandeenye.");
      } finally {
        setLoading(false);
      }
    };
    fetchScales();
  }, []);

  const ethiopianScales = scales.filter((s) => s.origin === "Ethiopian");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HERO */}
      <div className="bg-gradient-to-b from-indigo-900 to-gray-900 px-6 py-12 text-center">
        <h1 className="text-4xl font-bold mb-3">🎵 Faarfannoota Scale fi Style-tiin</h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Scale fedhii kee filadhu — Tizita, Baati, Ambassel, Anchihoye fi natural irraa faarfannoota argadhu.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading && (
          <p className="text-center text-gray-400">Fe'aa jira...</p>
        )}
        {error && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {/* ETHIOPIAN SCALES */}
        {ethiopianScales.length > 0 && (
          <div className="mt-16 mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
               Ethiopian Scales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {ethiopianScales.map((scale) => (
                <ScaleCard key={scale._id} scale={scale} />
              ))}
            </div>
          </div>
        )}

      

        {!loading && scales.length === 0 && !error && (
          <p className="text-center text-gray-400 py-10">
            Scale ammaaf hin jiru — admin haa dabalu.
          </p>
        )}
      </div>
    </div>
  );
}

function ScaleCard({ scale }) {
  return (
    <Link
      to={`/scale/${scale._id}`}
      className="scale-card bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl border-l-4 flex items-center justify-center min-h-[140px] transition hover:-translate-y-1"
      style={{ borderColor: scale.color }}
    >
      <h3 className="text-2xl font-bold text-center" style={{ color: scale.color }}>
        {scale.name}
      </h3>
    </Link>
  );
}
