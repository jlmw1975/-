
export interface PolicyItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  department?: string;
  category?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchResponse {
  policies: PolicyItem[];
  sources: GroundingSource[];
  rawText: string;
}

export enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
