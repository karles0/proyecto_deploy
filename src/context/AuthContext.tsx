import { createContext, useContext, useMemo, useCallback, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api, handleApiError } from "../Service/api";
import { useLocalStorage } from "../hook/useLocalStorage";

interface AuthProviderProps {
  children: ReactNode;
}

export interface IAuthContext {
  // User fields
  userId: number;
  nombre: string | null;
  apellido: string | null;
  username: string | null;
  email: string | null;
  country: string | null;
  bio: string | null;
  birthDate: string | null;
  profilePicture: string | null;
  role: string | null;
  numFollowers: number;
  numFollowing: number;
  
  // Auth fields
  token: string;
  expiresOn: number;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Methods
  register: (nombre: string, apellido: string, username: string, email: string, password: string, country: string, bio?: string, birthDate?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateSession: (data: Partial<{
    country: string | null;
    bio: string | null;
    birthDate: string | null;
    profilePicture: string | null;
  }>) => void;
}

export const AuthContext = createContext<IAuthContext>({
  userId: 0,
  nombre: null,
  apellido: null,
  username: null,
  email: null,
  country: null,
  bio: null,
  birthDate: null,
  profilePicture: null,
  role: null,
  numFollowers: 0,
  numFollowing: 0,
  token: "",
  expiresOn: -1,
  isAuthenticated: false,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},
  updateSession: () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useLocalStorage("session", "");
  const [token, setToken] = useLocalStorage("token", "");
  const [expiresOn, setExpiresOn] = useLocalStorage("expiresOn", "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // ======================================
  // REGISTER
  // ======================================
  const register = async (
    nombre: string,
    apellido: string,
    username: string,
    email: string,
    password: string,
    country: string,
    bio?: string,
    birthDate?: string
  ) => {
    try {
      console.debug("Registrando usuario:", username);

      const { data } = await api.post("/auth/register", {
        nombre,
        apellido,
        username,
        email,
        password,
        country,
        bio,
        birthDate,
      });

      console.debug("Usuario registrado:", data);

      setSession(
        JSON.stringify({
          userId: data.user.id,
          nombre: data.user.nombre,
          apellido: data.user.apellido,
          username: data.user.username,
          email: data.user.email,
          country: data.user.country,
          bio: data.user.bio || "",
          birthDate: data.user.birthDate || "",
          profilePicture: data.user.profilePicture || "",
          role: data.user.role,
          numFollowers: data.user.numFollowers || 0,
          numFollowing: data.user.numFollowing || 0,
        })
      );

      setToken(data.token);
      
      const expirationTimestamp = new Date().getTime() + data.expirationTime;
      setExpiresOn(expirationTimestamp.toString());
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

  // ======================================
  // LOGIN
  // ======================================
  const login = async (email: string, password: string) => {
    try {
      console.debug("Autenticando usuario:", email);

      const { data } = await api.post("/auth/login", { email, password });

      console.debug("Usuario autenticado:", data);

      setSession(
        JSON.stringify({
          userId: data.user.id,
          nombre: data.user.nombre,
          apellido: data.user.apellido,
          username: data.user.username,
          email: data.user.email,
          country: data.user.country,
          bio: data.user.bio || "",
          birthDate: data.user.birthDate || "",
          profilePicture: data.user.profilePicture || "",
          role: data.user.role,
          numFollowers: data.user.numFollowers || 0,
          numFollowing: data.user.numFollowing || 0,
        })
      );

      setToken(data.token);
      
      const expirationTimestamp = new Date().getTime() + data.expirationTime;
      setExpiresOn(expirationTimestamp.toString());
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

  // ======================================
  // LOGOUT
  // ======================================
  const logout = () => {
    setSession("");
    setToken("");
    setExpiresOn("");
  };

  // ======================================
  // UPDATE SESSION
  // ======================================
  const updateSession = useCallback((data: Partial<{
    country: string | null;
    bio: string | null;
    birthDate: string | null;
    profilePicture: string | null;
  }>) => {
    try {
      const currentSession = session ? JSON.parse(session) : {};
      const updatedSession = {
        ...currentSession,
        ...data
      };
      setSession(JSON.stringify(updatedSession));
      console.debug("✅ Session actualizada:", updatedSession);
    } catch (error) {
      console.error("Error al actualizar sesión:", error);
    }
  }, [session, setSession]);

  // ======================================
  // REFRESH USER
  // ======================================
  const refreshUser = useCallback(async () => {
    try {
      if (!token) {
        console.warn("No hay token, no se puede refrescar usuario");
        return;
      }

      console.debug("Refrescando datos del usuario...");

      const { data } = await api.get("/api/usuarios/me");

      console.debug("Datos actualizados recibidos:", data);

      const updatedSession = {
        userId: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        username: data.username,
        email: data.email,
        country: data.country,
        bio: data.bio || "",
        birthDate: data.birthDate || "",
        profilePicture: data.profilePicture || "",
        role: data.role,
        numFollowers: data.numFollowers || 0,
        numFollowing: data.numFollowing || 0,
      };

      console.debug("Actualizando session con:", updatedSession);
      
      setSession(JSON.stringify(updatedSession));
      
      console.debug("✅ Session actualizada exitosamente");
    } catch (error) {
      console.error("Error al refrescar usuario:", error);
      if ((error as any)?.response?.status === 401) {
        logout();
      }
    }
  }, [token, setSession]);

  // ======================================
  // VALOR MEMOIZADO DEL CONTEXT
  // ======================================
  const value = useMemo(() => {
    let sess: any = null;

    if (session) {
      try {
        sess = JSON.parse(session);
      } catch (err) {
        console.error("Error parsing session:", err);
      }
    }

    return {
      userId: sess?.userId || 0,
      nombre: sess?.nombre || null,
      apellido: sess?.apellido || null,
      username: sess?.username || null,
      email: sess?.email || null,
      country: sess?.country || null,
      bio: sess?.bio || null,
      birthDate: sess?.birthDate || null,
      profilePicture: sess?.profilePicture || null,
      role: sess?.role || null,
      numFollowers: sess?.numFollowers || 0,
      numFollowing: sess?.numFollowing || 0,
      token: token || "",
      expiresOn: expiresOn ? parseInt(expiresOn, 10) : -1,
      isAuthenticated: !!token,
      loading,
      register,
      login,
      logout,
      refreshUser,
      updateSession,
    };
  }, [session, token, expiresOn, loading, refreshUser, updateSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}