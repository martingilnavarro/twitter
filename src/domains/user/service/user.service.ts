import { OffsetPagination } from '@types'
import { UserDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  setUserPrivate: (userId: any) => Promise<void>
  setUserPublic: (userId: any) => Promise<void>
  setImage: (userId: any, image: string) => Promise<void>
}
