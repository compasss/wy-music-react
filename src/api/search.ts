import axios from './http'

import { HttpResponse, SearchParams, songInfoSearchParams } from './types'

export class SearchService {
  static async search(params: SearchParams): Promise<HttpResponse> {
    return axios('cloudsearch', {
      method: 'POST',
      data: {
        ...params
      }
    })
  }

  static async getSongInfoById(params:songInfoSearchParams): Promise<HttpResponse> {
    return axios('song/url', {
      method: 'POST',
      data: {
        ...params
      }
    })
  }
}