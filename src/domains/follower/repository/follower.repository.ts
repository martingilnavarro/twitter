
import { FollowerDTO } from '../dto'

export interface FollowerRepository {
  follow: (userId: string, followedId: string) => Promise<FollowerDTO>

}
