import { FollowerDTO } from '../dto'

export interface FollowerService {
  createFollow: (userId: string, followedId: string) => Promise<FollowerDTO>
  deleteFollow: (userId: string, followedId: string) => Promise<void>
}
