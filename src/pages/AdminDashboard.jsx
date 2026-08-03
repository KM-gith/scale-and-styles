import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [scales, setScales] = useState([]);
  const [styles, setStyles] = useState([]);
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingSongId, setEditingSongId] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [scaleId, setScaleId] = useState("");
  const [styleId, setStyleId] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
  
  }, [user]);

  const fetchData = async () => {
    try {
      const [scalesRes, stylesRes, songsRes] = await Promise.all([
        API.get("/scales"),
        API.get("/styles"),
        API.get("/songs"),
      ]);
      setScales(scalesRes.data);
      setStyles(stylesRes.data);
      setSongs(songsRes.data);
      if (scalesRes.data.length > 0 && !scaleId) {
        setScaleId(scalesRes.data[0]._id);
      }
      if (stylesRes.data.length > 0 && !styleId) {
        setStyleId(stylesRes.data[0]._id);
      }
    } catch {
      setError("Odeeffannoo fiduu hin dandeenye.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setArtist("");
    setDescription("");
    setTags("");
    setAudioFile(null);
    setEditingSongId(null);
  };

  const handleEditClick = (song) => {
    setEditingSongId(song._id);
    setTitle(song.title || "");
    setArtist(song.artist || "");
    setScaleId(song.scale?._id || "");
    setStyleId(song.style?._id || "");
    setDescription(song.description || "");
    setTags(song.tags?.join(", ") || "");
    setAudioFile(null);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const isEditing = Boolean(editingSongId);

    // Audio file haaraa isa "add" (create) qofa dirqama; "edit" keessatti filatamaa (optional)
    if (!isEditing && !audioFile) {
      setError("Audio file filadhu.");
      return;
    }
    if (!scaleId || !styleId) {
      setError("Scale fi Style lachuu filadhu.");
      return;
    }

    setUploading(true);
    try {
      let audioUrl;

      // Audio file haaraa yoo filatame (edit keessattis ta'e, create keessattis), upload godhi
      if (audioFile) {
        const formData = new FormData();
        formData.append("audio", audioFile);
        const uploadRes = await API.post("/upload/audio", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        audioUrl = uploadRes.data.audioUrl;
      }

      const payload = {
        title,
        artist,
        scale: scaleId,
        style: styleId,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (audioUrl) payload.audioUrl = audioUrl;

      if (isEditing) {
        await API.put(`/songs/${editingSongId}`, payload);
        setSuccess("Faarfannaan milkaa'inaan sirreeffame! ");
      } else {
        await API.post("/songs", payload);
        setSuccess("Faarfannaan milkaa'inaan dabalame! ");
      }

      resetForm();
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isEditing ? "Sirreessuu hin dandeenye." : "Dabaluu hin dandeenye.")
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (songId) => {
    if (!confirm("Faarfannaa kana haquuf mirkaneessitaa?")) return;
    try {
      await API.delete(`/songs/${songId}`);
      setSuccess("faarfannichi haqamee jira.");
      fetchData();
    } catch {
      setError("Haquu hin dandeenye.");
    }
  };

  const handleDeleteScale = async (scale) => {
    if (!confirm(`Scale "${scale.name}" haquuf mirkaneessitaa?`)) return;
    try {
      await API.delete(`/scales/${scale._id}`);
      setSuccess(`Scale "${scale.name}" haqamee jira.`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Scale haquu hin dandeenye.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6"> Admin Dashboard</h1>

        {error && (
          <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-900/50 text-green-300 p-3 rounded-lg mb-4 text-sm">{success}</div>
        )}

        {/* UPLOAD FORM */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-lg font-bold mb-4">
            {editingSongId ? "✏️ Faarfannaa Sirreessi" : "➕ Faarfannaa Haaraa Dabalii"}
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1">Maqaa Faarfannaa *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1">Maqaa Faarfataa</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1">Scale *</label>
                <select
                  value={scaleId}
                  onChange={(e) => setScaleId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {scales.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.origin})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1">Style *</label>
                <select
                  value={styleId}
                  onChange={(e) => setStyleId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {styles.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-1">Ibsa (description)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

      

            <div>
              <label className="text-gray-300 text-sm block mb-1">
                Audio File (MP3/WAV/M4A) {editingSongId ? "(filachuun barbaachisaa miti)" : "*"}
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
                required={!editingSongId}
                className="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer"
              />
              {editingSongId && (
                <p className="text-gray-500 text-xs mt-1">
                  Yoo file haaraa hin filatin, audio-n durii akkuma jirutti hafa.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
              >
                {uploading
                  ? "Fe'aa jira..."
                  : editingSongId
                  ? "Sirreessa Ol Kaa'i"
                  : "Dabali"}
              </button>
              {editingSongId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition"
                >
                  Dhiisi
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SCALES LIST */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-lg font-bold mb-4"> Scale Jiran ({scales.length})</h2>
          <div className="space-y-2">
            {scales.map((scale) => (
              <div
                key={scale._id}
                className="flex justify-between items-center bg-gray-700 rounded-lg p-3"
              >
                <div>
                  <p className="font-medium" style={{ color: scale.color }}>
                    {scale.name}
                  </p>
                  <p className="text-gray-400 text-xs">{scale.origin}</p>
                </div>
                <button
                  onClick={() => handleDeleteScale(scale)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition"
                >
                  Haqi
                </button>
              </div>
            ))}
            {scales.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">
                Scale hin jiru ammaaf.
              </p>
            )}
          </div>
        </div>

        {/* SONGS LIST */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold mb-4"> Faarfannoota Jiran ({songs.length})</h2>
          <div className="space-y-2">
            {songs.map((song) => (
              <div
                key={song._id}
                className="flex justify-between items-center bg-gray-700 rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-gray-400 text-xs">
                    {song.scale?.name} · {song.style?.name} | {song.artist} | ▶ {song.plays || 0}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditClick(song)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition"
                  >
                    Sirreessi
                  </button>
                  <button
                    onClick={() => handleDelete(song._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition"
                  >
                    Haqi
                  </button>
                </div>
              </div>
            ))}
            {songs.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">
                Faarfannaan hin jiru ammaaf.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
