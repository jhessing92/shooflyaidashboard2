export const OPENAI_CONFIG = {
apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Load API key from .env
  organization: '', // Optional: Your OpenAI organization ID
};

export interface APICallMetrics {
  total: number;
  successful: number;
  failed: number;
  tokensUsed: number;
  costEstimate: number;
}

export const getAPICallMetrics = async (): Promise<APICallMetrics> => {
  // This would typically fetch from your backend
  // For now, returning mock data
  return {
    total: 1250,
    successful: 1180,
    failed: 70,
    tokensUsed: 125000,
    costEstimate: 2.50
  };
};