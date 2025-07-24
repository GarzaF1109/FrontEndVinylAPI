// src/services/vinylApi.js
const API_BASE_URL = 'http://localhost:5065/api/vinyls';

class VinylApiService {
  // Obtener todos los vinilos
  async getAllVinyls() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo vinilos:', error);
      throw error;
    }
  }

  // Crear un nuevo vinilo
  async createVinyl(vinyl) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vinyl)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando vinilo:', error);
      throw error;
    }
  }

  // Actualizar un vinilo existente
  async updateVinyl(id, vinyl) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vinyl)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando vinilo:', error);
      throw error;
    }
  }

  // Eliminar un vinilo
  async deleteVinyl(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error eliminando vinilo:', error);
      throw error;
    }
  }
}

export default new VinylApiService();