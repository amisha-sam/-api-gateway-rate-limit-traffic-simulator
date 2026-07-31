import apiClient from './axios';
import type { Simulation, CreateSimulationRequest } from '../types';

export const simulationsApi = {
  getSimulations: async (): Promise<Simulation[]> => {
    const response = await apiClient.get<Simulation[]>('/simulations');
    return response.data;
  },

  getSimulationHistory: async (): Promise<Simulation[]> => {
    try {
      const res = await fetch('http://127.0.0.1:8000/history/simulations');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback to Express endpoint
    }
    const response = await apiClient.get<Simulation[]>('/simulations');
    return response.data;
  },

  createSimulation: async (data: CreateSimulationRequest): Promise<Simulation> => {
    const response = await apiClient.post<Simulation>('/simulations', data);
    return response.data;
  },

  deleteSimulation: async (id: string): Promise<void> => {
    await apiClient.delete(`/simulations/${id}`);
  },

  stopSimulation: async (id: string): Promise<Simulation> => {
    const response = await apiClient.post<Simulation>(`/simulations/${id}/stop`);
    return response.data;
  },
};
