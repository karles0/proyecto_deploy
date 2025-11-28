import { api } from './api';
import type { PageResponse, User, FollowStatus, FollowToggleResponse } from '../types';

export const followService = {
  /**
   * Toggle follow/unfollow de un usuario
   */
  toggleFollow: async (username: string): Promise<FollowToggleResponse> => {
    const response = await api.post(`/api/follow/${username}/toggle`);
    return response.data;
  },

  /**
   * Obtener estado de follow de un usuario
   */
  getFollowStatus: async (username: string): Promise<FollowStatus> => {
    const response = await api.get(`/api/follow/${username}/status`);
    return response.data;
  },

  /**
   * Obtener usuarios que sigo
   */
  getFollowing: async (page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
    const response = await api.get('/api/follow/following', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener mis seguidores
   */
  getFollowers: async (page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
    const response = await api.get('/api/follow/followers', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener mis seguidores
   */
  getMyFollowers: async (page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
    const response = await api.get('/api/follow/my-followers', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener a quiénes sigo
   */
  getMyFollowing: async (page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
    const response = await api.get('/api/follow/my-following', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener seguidores de un usuario específico
   */
  getUserFollowers: async (username: string, page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
    const response = await api.get(`/api/follow/${username}/followers`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener usuarios que sigue un usuario específico
   */
  getUserFollowing: async (username: string, page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
    const response = await api.get(`/api/follow/${username}/following`, {
      params: { page, size }
    });
    return response.data;
  },
};

// ✅ EXPORTACIONES INDIVIDUALES
export const {
  toggleFollow,
  getFollowStatus,
  getFollowing,
  getFollowers,
  getMyFollowers,
  getMyFollowing,
  getUserFollowers,
  getUserFollowing
} = followService;