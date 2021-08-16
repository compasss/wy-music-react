export interface HttpResponse {
  status: number
  statusText: string
  data: {
    code: number
    [key: string]: any
  }
}

export interface LoginParams {
  email: string
  password: string
}

export interface SearchParams{
  keywords: string
  limit?: number
  offset?: number
  type?: number
}

export interface arInterface {
  alias: string[];
  id: number;
  name: string;
  tns: string[];
}

export interface songInfoSearchParams{
  id: number | string,
  br?: number
}