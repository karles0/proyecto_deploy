import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { countries } from "../data/countries";
import { updateMyProfile, getMyFollowStats } from "../Service/userService";
import { getMyFollowers, getMyFollowing } from "../Service/followService";
import { reviewService } from "../Service/reviewService";
import type { ReviewResponseDTO, User } from "../types";

export default function Profile() {
  const {
    nombre,
    apellido,
    username,
    country,
    bio,
    birthDate,
    profilePicture,
    numFollowers,
    numFollowing,
    updateSession,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [stats, setStats] = useState({ followers: numFollowers, following: numFollowing });
  const [myReviews, setMyReviews] = useState<ReviewResponseDTO[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [form, setForm] = useState({
    nombre: nombre || "",
    apellido: apellido || "",
    country: country || "",
    bio: bio || "",
    birthDate: birthDate || "",
  });

  // LOAD REVIEWS
  useEffect(() => {
    async function loadMyReviews() {
      try {
        const res = await reviewService.getMyReviews(0, 20);
        setMyReviews(res.reviews || []);
        
        const count =
          res.totalCount ??
          (res as any).totalElements ??
          (res.reviews?.length ?? 0);
        
        setReviewCount(count);
      } catch (err) {
        console.error("Error cargando mis reseñas:", err);
      }
    }
    loadMyReviews();
  }, []);

  // LOAD FOLLOW DATA
  useEffect(() => {
    async function loadFollowData() {
      try {
        const [followersData, followingData] = await Promise.all([
          getMyFollowers(0, 20),
          getMyFollowing(0, 20)
        ]);
        
        setFollowers(followersData.content || []);
        setFollowing(followingData.content || []);
      } catch (err) {
        console.error("Error loading followers:", err);
      }
    }
    loadFollowData();
  }, []);

  // LOAD STATS
  useEffect(() => {
    async function loadStats() {
      try {
        const s = await getMyFollowStats();
        setStats({
          followers: s.followers || 0,
          following: s.following || 0,
        });
      } catch (err) {
        console.error("Error cargando mis stats:", err);
      }
    }
    loadStats();
  }, []);

  const countryInfo =
    countries.find(
      (c) =>
        c.name.toLowerCase() === form.country.toLowerCase() ||
        c.code.toLowerCase() === form.country.toLowerCase()
    ) || { flag: "", name: "" };

  const handleSave = async () => {
    try {
      const updated = await updateMyProfile({
        country: form.country,
        bio: form.bio,
        birthDate: form.birthDate === "" ? undefined : form.birthDate,
      });

      updateSession({
        country: updated.country || null,
        bio: updated.bio || null,
        birthDate: updated.birthDate || null,
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 px-4">
        
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-8 border border-gray-200">
          <div className="flex flex-col items-center text-center">
            <img
              src={
                profilePicture ||
                `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=dc2626&color=fff&size=200`
              }
              alt="Avatar"
              className="w-32 h-32 rounded-xl border-4 border-red-500 shadow-md object-cover"
            />

            {!isEditing ? (
              <>
                <h2 className="text-3xl font-semibold mt-4">
                  {nombre} {apellido}
                </h2>
                <p className="text-gray-500">@{username}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-5 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
                >
                  Editar Perfil
                </button>
              </>
            ) : (
              <div className="mt-6 w-full max-w-lg">
                <div className="flex gap-4">
                  <input
                    type="text"
                    className="w-1/2 border p-2 rounded"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Nombre"
                  />
                  <input
                    type="text"
                    className="w-1/2 border p-2 rounded"
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                    placeholder="Apellido"
                  />
                </div>

                <input
                  type="text"
                  className="mt-4 w-full border p-2 rounded"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder="País (Ej: Perú)"
                />

                <textarea
                  className="mt-4 w-full border p-2 rounded h-24"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Descripción"
                />

                <div className="mt-4">
                  <label className="text-sm text-gray-600">Fecha de nacimiento</label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded mt-1"
                    value={form.birthDate || ""}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MÉTRICAS - CLICKEABLES */}
        {!isEditing && (
          <div className="grid grid-cols-3 gap-6 mt-10">
            <button
              onClick={() => setShowFollowers(!showFollowers)}
              className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow hover:shadow-md transition cursor-pointer"
            >
              <p className="text-3xl font-bold text-gray-900">{stats.followers}</p>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">Followers</p>
            </button>

            <button
              onClick={() => setShowFollowing(!showFollowing)}
              className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow hover:shadow-md transition cursor-pointer"
            >
              <p className="text-3xl font-bold text-gray-900">{stats.following}</p>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">Following</p>
            </button>

            <div className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow hover:shadow-md transition">
              <p className="text-3xl font-bold text-gray-900">{reviewCount}</p>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">Reseñas</p>
            </div>
          </div>
        )}

        {/* LISTA DE FOLLOWERS */}
        {showFollowers && !isEditing && (
          <div className="mt-6 bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Seguidores ({stats.followers})</h3>
              <button
                onClick={() => setShowFollowers(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {followers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tienes seguidores aún</p>
            ) : (
              <div className="space-y-3">
                {followers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <img
                      src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=dc2626&color=fff`}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{user.nombre} {user.apellido}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LISTA DE FOLLOWING */}
        {showFollowing && !isEditing && (
          <div className="mt-6 bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Siguiendo ({stats.following})</h3>
              <button
                onClick={() => setShowFollowing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {following.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sigues a nadie aún</p>
            ) : (
              <div className="space-y-3">
                {following.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <img
                      src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=dc2626&color=fff`}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{user.nombre} {user.apellido}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INFORMACIÓN */}
        {!isEditing && (
          <div className="mt-10 bg-white rounded-xl shadow p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-5">Información General</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-32 text-gray-500">Usuario:</span>
                <p className="font-medium">@{username}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-32 text-gray-500">País:</span>
                <p className="font-medium">
                  {countryInfo.flag ? `${countryInfo.flag} ${countryInfo.name}` : "—"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-32 text-gray-500">Cumpleaños:</span>
                <p className="font-medium">{birthDate ? birthDate : "No registrado"}</p>
              </div>
              <div className="flex gap-3">
                <span className="w-32 text-gray-500">Descripción:</span>
                <p className="font-medium whitespace-pre-line text-gray-700">
                  {bio && bio.trim() !== "" ? bio : "Sin descripción"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* RESEÑAS */}
        {!isEditing && myReviews.length > 0 && (
          <div className="mt-10 bg-white rounded-xl shadow p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-6">Mis Reseñas</h3>
            <div className="space-y-6">
              {myReviews.map((r) => (
                <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                  <h4 className="text-lg font-semibold text-gray-900">{r.libroTitulo}</h4>
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(r.rating) ? "text-red-600" : i < r.rating ? "text-red-600 opacity-40" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-1 text-sm text-gray-600 font-semibold">{r.rating}</span>
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">{r.comentario}</p>
                  <p className="text-xs text-gray-400 mt-4 border-t pt-3">
                    Publicado el {new Date(r.createdAt).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}