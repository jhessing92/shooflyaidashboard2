import toast from 'react-hot-toast';

export interface MakeScenario {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastRun?: string;
}

export interface MakeCredentials {
  apiKey: string;
  organizationId: string;
}

export const getMakeCredentials = (): MakeCredentials | null => {
  try {
    const stored = localStorage.getItem('make_credentials');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading Make.com credentials:', error);
    return null;
  }
};

export const validateMakeCredentials = async (credentials: MakeCredentials): Promise<boolean> => {
  if (!credentials?.apiKey || !credentials?.organizationId) {
    console.error('Missing required credentials');
    return false;
  }

  try {
    const response = await fetch(
      `https://us1.make.com/api/v2/organizations/${credentials.organizationId}/scenarios`,
      {
        headers: {
          'Authorization': `Token ${credentials.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'API validation failed');
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to validate Make.com credentials:', errorMessage);
    return false;
  }
};

export const fetchMakeScenarios = async (): Promise<MakeScenario[]> => {
  const credentials = getMakeCredentials();
  
  // Return empty array if no credentials are found
  if (!credentials) {
    return [];
  }

  if (!credentials.apiKey || !credentials.organizationId) {
    console.warn('Invalid Make.com credentials');
    return [];
  }

  try {
    const response = await fetch(
      `https://us1.make.com/api/v2/organizations/${credentials.organizationId}/scenarios`,
      {
        headers: {
          'Authorization': `Token ${credentials.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch scenarios');
    }

    if (!Array.isArray(data.scenarios)) {
      return [];
    }

    return data.scenarios.map((scenario: any) => ({
      id: scenario.id || 'unknown',
      name: scenario.name || 'Unnamed Scenario',
      status: scenario.active ? 'active' : 'inactive',
      lastRun: scenario.lastExecution?.startedAt || null
    }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Make.com scenarios';
    console.error('Failed to fetch Make.com scenarios:', errorMessage);
    // Don't show error toast when credentials aren't configured
    if (credentials.apiKey && credentials.organizationId) {
      toast.error(errorMessage);
    }
    return [];
  }
};

export const storeMakeCredentials = (credentials: MakeCredentials): void => {
  if (!credentials?.apiKey || !credentials?.organizationId) {
    throw new Error('Invalid credentials: API key and organization ID are required');
  }

  try {
    localStorage.setItem('make_credentials', JSON.stringify(credentials));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to store Make.com credentials';
    console.error('Error storing Make.com credentials:', errorMessage);
    toast.error('Failed to store Make.com credentials');
    throw error;
  }
};