
import { ReactionDTO } from '../dto'

export interface ReactionRepository {
  react: (userId: string, postId: string, like: boolean, retweet: boolean) => Promise<ReactionDTO>
  unreact: (userId: string, postId: string) => Promise<void>
}