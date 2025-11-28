import { api } from './api';
import type { User, PageResponse, UserSearchResult, ProfileResponse, UserStats } from '../types';

export const userService = {
  // ==================== PERFIL DE USUARIO ====================

  /**
   * Obtener perfil de usuario por username
   */
  getUserByUsername: async (username: string): Promise<ProfileResponse> => {
    const response = await api.get(`/api/usuario/profile/${username}`);
    return response.data;
  },

  /**
   * Obtener estadísticas del usuario
   */
  getUserStats: async (username: string): Promise<UserStats> => {
    const response = await api.get(`/api/usuario/${username}/stats`);
    return response.data;
  },

  /**
   * Obtener usuario actual autenticado
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/usuario/me');
    return response.data;
  },

  /**
   * Actualizar perfil del usuario
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch('/api/usuario/profile', data);
    return response.data;
  },

  /**
   * Actualizar mi perfil
   */
  updateMyProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch('/api/usuario/me', data);
    return response.data;
  },

  /**
   * Obtener mis estadísticas de follow
   */
  getMyFollowStats: async (): Promise<UserStats> => {
    const response = await api.get('/api/usuario/me/stats');
    return response.data;
  },

  /**
   * Actualizar foto de perfil
   */
  updateProfilePicture: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/usuario/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ==================== BÚSQUEDA DE USUARIOS ====================

  /**
   * Buscar usuarios
   */
  searchUsers: async (query: string, page: number = 0, size: number = 20): Promise<PageResponse<UserSearchResult>> => {
    const response = await api.get('/api/usuarios/search', {
      params: { query, page, size }
    });
    return response.data;
  },

  /**
   * Autocompletado de usernames
   */
  getUsernameSuggestions: async (query: string): Promise<string[]> => {
    const response = await api.get('/api/usuarios/search/autocomplete', {
      params: { query }
    });
    return response.data;
  },

  /**
   * Obtener perfil completo de un usuario
   */
  getProfile: async (username: string): Promise<ProfileResponse> => {
    const response = await api.get(`/api/usuarios/${username}/profile`);
    return response.data;
  },

  /**
   * Obtener todos los usuarios (paginado)
   */
  getAllUsers: async (page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
    const response = await api.get('/api/usuario', {
      params: { page, size }
    });
    return response.data;
  },

  // ==================== SEGUIMIENTO ====================

  /**
   * Seguir a un usuario
   */
  followUser: async (username: string): Promise<void> => {
    await api.post(`/api/usuario/${username}/follow`);
  },

  /**
   * Dejar de seguir a un usuario
   */
  unfollowUser: async (username: string): Promise<void> => {
    await api.delete(`/api/usuario/${username}/follow`);
  },

  /**
   * Verificar si sigo a un usuario
   */
  isFollowing: async (username: string): Promise<boolean> => {
    const response = await api.get(`/api/usuario/${username}/is-following`);
    return response.data.isFollowing;
  },

  /**
   * Obtener seguidores de un usuario
   */
  getFollowers: async (username: string, page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
    const response = await api.get(`/api/usuario/${username}/followers`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener usuarios que sigue un usuario
   */
  getFollowing: async (username: string, page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
    const response = await api.get(`/api/usuario/${username}/following`, {
      params: { page, size }
    });
    return response.data;
  },

  // ==================== ACTIVIDAD ====================

  /**
   * Obtener actividad reciente del usuario
   */
  getRecentActivity: async (username: string, limit: number = 10) => {
    const response = await api.get(`/api/usuario/${username}/activity`, {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Obtener libros leídos por el usuario
   */
  getReadBooks: async (username: string, page: number = 0, size: number = 20) => {
    const response = await api.get(`/api/usuario/${username}/books/read`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener reseñas del usuario
   */
  getUserReviews: async (username: string, page: number = 0, size: number = 20) => {
    const response = await api.get(`/api/usuario/${username}/reviews`, {
      params: { page, size }
    });
    return response.data;
  },
};

// ✅ EXPORTACIONES INDIVIDUALES
export const { 
  getUserByUsername, 
  getUserStats,
  getCurrentUser,
  updateProfile,
  updateMyProfile,
  getMyFollowStats,
  updateProfilePicture,
  searchUsers,
  getUsernameSuggestions,
  getProfile,
  getAllUsers,
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  getFollowing,
  getRecentActivity,
  getReadBooks,
  getUserReviews
} = userService;