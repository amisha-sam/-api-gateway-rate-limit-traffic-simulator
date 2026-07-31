import apiClient from './axios';
import type { Recommendation, ComparisonHistory } from '../types';

export const recommendationsApi = {
  getRecommendations: async (): Promise<Recommendation[]> => {
    const response = await apiClient.get<Recommendation[]>('/recommendations');
    return response.data;
  },

  generateDemoRecommendation: async (): Promise<Recommendation> => {
    const response = await apiClient.post<Recommendation>('/recommendations/generate-demo');
    return response.data;
  },

  applyRecommendation: async (id: string): Promise<{ message: string; gatewayRules: any }> => {
    const response = await apiClient.post<{ message: string; gatewayRules: any }>(
      `/recommendations/${id}/apply`
    );
    return response.data;
  },

  deleteRecommendation: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/recommendations/${id}`);
    return response.data;
  },

  deleteAllRecommendations: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>('/recommendations');
    return response.data;
  },

  reRunRecommendation: async (id: string): Promise<{ message: string; recommendation: Recommendation }> => {
    const response = await apiClient.post<{ message: string; recommendation: Recommendation }>(
      `/recommendations/${id}/re-run`
    );
    return response.data;
  },

  getComparisonHistory: async (): Promise<ComparisonHistory[]> => {
    const response = await apiClient.get<ComparisonHistory[]>('/comparison-history');
    return response.data;
  },
};
