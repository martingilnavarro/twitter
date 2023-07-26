import { ReactionDTO } from '../dto'

export interface ReactionService {
  createReaction: (userId: string, postId: string, like: boolean, retweet: boolean) => Promise<ReactionDTO>
  deleteReaction: (userId: string, postId: string) => Promise<void>
}