import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://proyecto-backend-proyectdbp-production.up.railway.app';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ======================================
// INTERFACES
// ======================================

export interface GoogleBookRequest {
  volumeId: string;
}

export interface UpdateBookRequest {
  titulo?: string;
  autor?: string;
  sinopsis?: string;
  genero?: string;
  anioPublicacion?: string; // ✅ STRING
}

export interface PromoteUserResponse {
  message: string;
  userId: number;
  username: string;
  email: string;
  newToken: string;
  expiresIn: number;
}

export interface SearchResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ======================================
// ADMIN SERVICE
// ======================================

export const adminService = {
  // ==================== LIBROS ====================

  /**
   * ✅ Añadir libro desde Google Books API
   */
  async addBookFromGoogle(request: GoogleBookRequest): Promise<any> {
    console.log('📚 Agregando libro desde Google Books:', request.volumeId);
    
    try {
      const response = await axios.post(
        `${API_URL}/libro/add-from-google`,
        request,
        { 
          headers: getAuthHeaders(),
          timeout: 30000, // 30 segundos
        }
      );
      
      console.log('✅ Libro agregado exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al agregar libro:', error);
      console.error('❌ Response:', error.response?.data);
      throw error;
    }
  },

  /**
   * ✅ Actualizar libro (PATCH)
   */
  async updateBook(bookId: number, updates: UpdateBookRequest): Promise<any> {
    console.log('📝 Actualizando libro:', bookId, updates);
    
    try {
      const response = await axios.patch(
        `${API_URL}/libro/${bookId}`,
        updates,
        { headers: getAuthHeaders() }
      );
      
      console.log('✅ Libro actualizado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al actualizar libro:', error);
      console.error('❌ Response:', error.response?.data);
      throw error;
    }
  },

  /**
   * ✅ Eliminar libro
   */
  async deleteBook(bookId: number): Promise<{ message: string }> {
    console.log('🗑️ Eliminando libro:', bookId);
    
    try {
      const response = await axios.delete(
        `${API_URL}/libro/${bookId}`,
        { headers: getAuthHeaders() }
      );
      
      console.log('✅ Libro eliminado');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al eliminar libro:', error);
      throw error;
    }
  },

  /**
   * ✅ Buscar libros
   */
  async searchBooks(query: string, page = 0, size = 20): Promise<any> {
    console.log('🔍 Buscando libros:', query);
    
    try {
      const response = await axios.get(
        `${API_URL}/libro/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al buscar libros:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener todos los libros (paginado)
   */
  async getAllBooks(page = 0, size = 20): Promise<any> {
    try {
      const response = await axios.get(
        `${API_URL}/libro?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener libros:', error);
      throw error;
    }
  },

  // ==================== RESEÑAS ====================

  /**
   * ✅ Eliminar reseña (Admin)
   */
  async deleteReview(reviewId: number): Promise<void> {
    console.log('🗑️ Eliminando reseña:', reviewId);
    
    try {
      await axios.delete(
        `${API_URL}/api/review/${reviewId}`,
        { headers: getAuthHeaders() }
      );
      
      console.log('✅ Reseña eliminada');
    } catch (error: any) {
      console.error('❌ Error al eliminar reseña:', error);
      throw error;
    }
  },

  /**
   * ✅ Buscar reseñas
   */
  async searchReviews(query: string, page = 0, size = 20): Promise<any> {
    console.log('🔍 Buscando reseñas:', query);
    
    try {
      const response = await axios.get(
        `${API_URL}/api/review/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al buscar reseñas:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener todas las reseñas (paginado)
   */
  async getAllReviews(page = 0, size = 20): Promise<any> {
    try {
      const response = await axios.get(
        `${API_URL}/api/review?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener reseñas:', error);
      throw error;
    }
  },

  // ==================== COMENTARIOS ====================

  /**
   * ✅ Eliminar comentario (Admin)
   */
  async deleteComment(commentId: number): Promise<void> {
    console.log('🗑️ Eliminando comentario:', commentId);
    
    try {
      await axios.delete(
        `${API_URL}/comentar/${commentId}`,
        { headers: getAuthHeaders() }
      );
      
      console.log('✅ Comentario eliminado');
    } catch (error: any) {
      console.error('❌ Error al eliminar comentario:', error);
      throw error;
    }
  },

  // ==================== USUARIOS ====================

  /**
   * ✅ Eliminar usuario (Admin)
   */
  async deleteUser(userId: number): Promise<{ message: string }> {
    console.log('🗑️ Eliminando usuario:', userId);
    
    try {
      const response = await axios.delete(
        `${API_URL}/api/usuarios/${userId}`,
        { headers: getAuthHeaders() }
      );
      
      console.log('✅ Usuario eliminado');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al eliminar usuario:', error);
      throw error;
    }
  },

  /**
   * ✅ Promover usuario a admin
   */
  async promoteToAdmin(userId: number): Promise<PromoteUserResponse> {
    console.log('⬆️ Promoviendo usuario a admin:', userId);
    
    try {
      const response = await axios.put(
        `${API_URL}/api/usuarios/promote-to-admin/${userId}`,
        {},
        { headers: getAuthHeaders() }
      );
      
      console.log('✅ Usuario promovido a admin');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al promover usuario:', error);
      throw error;
    }
  },

  /**
   * ✅ Degradar admin a usuario normal
   */
  async demoteToUser(userId: number): Promise<{ message: string }> {
    console.log('⬇️ Degradando admin a usuario:', userId);
    
    try {
      const response = await axios.put(
        `${API_URL}/api/usuarios/demote-to-user/${userId}`,
        {},
        { headers: getAuthHeaders() }
      );
      
      console.log('✅ Usuario degradado');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al degradar usuario:', error);
      throw error;
    }
  },

  /**
   * ✅ Buscar usuarios (para acciones de admin)
   */
  async searchUsers(query: string, page = 0, size = 20): Promise<any> {
    console.log('🔍 Buscando usuarios:', query);
    
    try {
      const response = await axios.get(
        `${API_URL}/api/usuarios/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al buscar usuarios:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener todos los usuarios (paginado - solo admin)
   */
  async getAllUsers(page = 0, size = 20): Promise<any> {
    try {
      const response = await axios.get(
        `${API_URL}/api/usuarios?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener usuarios:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener detalles de un usuario específico
   */
  async getUserById(userId: number): Promise<any> {
    try {
      const response = await axios.get(
        `${API_URL}/api/usuarios/${userId}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener usuario:', error);
      throw error;
    }
  },

  // ==================== ESTADÍSTICAS ====================

  /**
   * ✅ Obtener estadísticas generales del sistema
   */
  async getSystemStats(): Promise<any> {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/stats`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener estadísticas:', error);
      // Retornar estadísticas por defecto si el endpoint no existe aún
      return {
        totalUsers: 0,
        totalBooks: 0,
        totalReviews: 0,
        totalComments: 0,
      };
    }
  },

  // ==================== MODERACIÓN ====================

  /**
   * ✅ Obtener contenido reportado (si tienes sistema de reportes)
   */
  async getReportedContent(page = 0, size = 20): Promise<any> {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/reports?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener contenido reportado:', error);
      return { content: [], totalElements: 0 };
    }
  },

  /**
   * ✅ Marcar reporte como resuelto
   */
  async resolveReport(reportId: number): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/api/admin/reports/${reportId}/resolve`,
        {},
        { headers: getAuthHeaders() }
      );
      
      console.log('✅ Reporte resuelto');
    } catch (error: any) {
      console.error('❌ Error al resolver reporte:', error);
      throw error;
    }
  },
};