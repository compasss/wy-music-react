import axios from './http'

import { HttpResponse, LoginParams } from './types'

//封装User类型的接口方法
export class LoginService {
  /**
   * @description 查询User的信息
   * @param {number} teamId - 所要查询的团队ID
   * @return {HttpResponse} result
   */
  static async login(params: LoginParams): Promise<HttpResponse> {
    return axios('login', {
      method: 'POST',
      responseType: 'json',
      params: {
        ...params
      }
    })
  }
}