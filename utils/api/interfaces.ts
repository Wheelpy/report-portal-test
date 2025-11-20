export interface Launch {
  owner: string;
  description: string;
  id: number;
  uuid: string;
  name: string;
  number: number;
  startTime: string;
  endTime: string;
  lastModified: string;
  status: string;
}

export interface LaunchesResponse {
  content: Launch[];

  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  id: number;
}
