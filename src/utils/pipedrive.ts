import toast from 'react-hot-toast';

export interface PipedriveCredentials {
  apiKey: string;
  orgId: string;
  userId: string;
  dealIds?: string[];
  selectedPipelineId?: string;
}

export interface PipedriveDeal {
  id: number;
  title: string;
  value: number;
  weighted_value: number;
  currency: string;
  stage_order_nr: number;
  pipeline_stage_count: number;
  org_name: string;
  owner_name: string;
  status: string;
  pipeline_id: string;
  stage_id: string;
  stage_name: string;
}

export interface PipedrivePipeline {
  id: number;
  name: string;
  url_title: string;
  order_nr: number;
  active: boolean;
  deals_count: number;
  stages: PipedriveStage[];
}

export interface PipedriveStage {
  id: number;
  name: string;
  order_nr: number;
  pipeline_id: number;
}

export const getPipedriveStatus = async (credentials: PipedriveCredentials): Promise<{
  apiConnection: string;
  syncStatus: string;
}> => {
  try {
    const isValid = await validatePipedriveCredentials(credentials);
    return {
      apiConnection: isValid ? 'Active' : 'Error',
      syncStatus: isValid ? 'Ready' : 'Error',
    };
  } catch (error) {
    console.error('Failed to get Pipedrive status:', error);
    return {
      apiConnection: 'Error',
      syncStatus: 'Error',
    };
  }
};

export const getPipedriveCredentials = (): PipedriveCredentials | null => {
  try {
    const stored = localStorage.getItem('pipedrive_credentials');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading Pipedrive credentials:', error);
    return null;
  }
};

export const validatePipedriveCredentials = async (credentials: PipedriveCredentials): Promise<boolean> => {
  if (!credentials?.apiKey) {
    console.error('No API key provided');
    return false;
  }
  
  try {
    const response = await fetch(`https://api.pipedrive.com/v1/users/me?api_token=${credentials.apiKey}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Validation error:', errorData);
      throw new Error(errorData.error || 'Invalid credentials');
    }
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Failed to validate Pipedrive credentials:', error);
    return false;
  }
};

export const fetchPipedrivePipelines = async (): Promise<PipedrivePipeline[]> => {
  const credentials = getPipedriveCredentials();
  if (!credentials?.apiKey) {
    throw new Error('No Pipedrive credentials found');
  }

  try {
    const response = await fetch(
      `https://api.pipedrive.com/v1/pipelines?api_token=${credentials.apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (!data.success) {
      console.error('Pipedrive API error:', data);
      throw new Error(data.error || 'Failed to fetch pipelines');
    }

    // Fetch stages for each pipeline
    const pipelines = await Promise.all(data.data.map(async (pipeline: any) => {
      const stagesResponse = await fetch(
        `https://api.pipedrive.com/v1/stages?pipeline_id=${pipeline.id}&api_token=${credentials.apiKey}`
      );
      const stagesData = await stagesResponse.json();
      return {
        ...pipeline,
        stages: stagesData.data || []
      };
    }));

    return pipelines;
  } catch (error) {
    console.error('Failed to fetch Pipedrive pipelines:', error);
    throw error;
  }
};

export const fetchPipelineDeals = async (pipelineId: string): Promise<PipedriveDeal[]> => {
  const credentials = getPipedriveCredentials();
  if (!credentials?.apiKey) {
    throw new Error('No Pipedrive credentials found');
  }

  try {
    // First fetch the pipeline stages
    const stagesResponse = await fetch(
      `https://api.pipedrive.com/v1/stages?pipeline_id=${pipelineId}&api_token=${credentials.apiKey}`
    );
    const stagesData = await stagesResponse.json();
    const stages = stagesData.data || [];

    // Then fetch the deals
    const response = await fetch(
      `https://api.pipedrive.com/v1/deals?pipeline_id=${pipelineId}&status=open&sort=weighted_value%20DESC&api_token=${credentials.apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (!data.success) {
      console.error('Pipedrive API error:', data);
      throw new Error(data.error || 'Failed to fetch pipeline deals');
    }

    return data.data.map((deal: any) => {
      const stage = stages.find((s: any) => s.id === deal.stage_id);
      return {
        id: deal.id,
        title: deal.title || 'Untitled Deal',
        value: parseFloat(deal.value) || 0,
        weighted_value: parseFloat(deal.weighted_value) || parseFloat(deal.value) || 0,
        currency: deal.currency || 'USD',
        stage_order_nr: parseInt(deal.stage_order_nr) || 0,
        pipeline_stage_count: stages.length,
        org_name: deal.org_name || deal.organization?.name || 'No Organization',
        owner_name: deal.owner_name || deal.user?.name || 'Unassigned',
        status: deal.status || 'open',
        pipeline_id: deal.pipeline_id,
        stage_id: deal.stage_id,
        stage_name: stage?.name || `Stage ${deal.stage_order_nr + 1}`
      };
    });
  } catch (error) {
    console.error('Failed to fetch pipeline deals:', error);
    throw error;
  }
};

export const fetchPipedriveDeals = async (): Promise<PipedriveDeal[]> => {
  const credentials = getPipedriveCredentials();
  if (!credentials?.apiKey) {
    throw new Error('No Pipedrive credentials found');
  }

  try {
    const deals: PipedriveDeal[] = [];
    
    if (credentials.dealIds && credentials.dealIds.length > 0) {
      for (const dealId of credentials.dealIds) {
        const response = await fetch(
          `https://api.pipedrive.com/v1/deals/${dealId}?api_token=${credentials.apiKey}`,
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        const data = await response.json();
        
        if (!data.success) {
          console.error(`Failed to fetch deal ${dealId}:`, data);
          continue;
        }

        // Fetch stage information
        const stageResponse = await fetch(
          `https://api.pipedrive.com/v1/stages/${data.data.stage_id}?api_token=${credentials.apiKey}`
        );
        const stageData = await stageResponse.json();

        deals.push({
          id: data.data.id,
          title: data.data.title || 'Untitled Deal',
          value: parseFloat(data.data.value) || 0,
          weighted_value: parseFloat(data.data.weighted_value) || parseFloat(data.data.value) || 0,
          currency: data.data.currency || 'USD',
          stage_order_nr: parseInt(data.data.stage_order_nr) || 0,
          pipeline_stage_count: 5,
          org_name: data.data.org_name || data.data.organization?.name || 'No Organization',
          owner_name: data.data.owner_name || data.data.user?.name || 'Unassigned',
          status: data.data.status || 'open',
          pipeline_id: data.data.pipeline_id,
          stage_id: data.data.stage_id,
          stage_name: stageData.data?.name || `Stage ${data.data.stage_order_nr + 1}`
        });
      }
    } else if (credentials.selectedPipelineId) {
      return await fetchPipelineDeals(credentials.selectedPipelineId);
    }

    return deals;
  } catch (error) {
    console.error('Failed to fetch Pipedrive deals:', error);
    throw error;
  }
};

export const storePipedriveCredentials = (credentials: PipedriveCredentials): void => {
  try {
    localStorage.setItem('pipedrive_credentials', JSON.stringify(credentials));
  } catch (error) {
    console.error('Error storing Pipedrive credentials:', error);
    toast.error('Failed to store Pipedrive credentials');
  }
};