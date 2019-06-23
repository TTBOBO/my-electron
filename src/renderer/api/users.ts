import { UserPayload } from './../store/modules/users';
import axios from './axios'
import { User } from '../store/'


export default {
  getLoginUser() {
    return axios.get<UserPayload>('/v1/user_name')
  }
}
