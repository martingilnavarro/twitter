import { ReactionDTO } from '../dto'
import { ReactionRepository } from '../repository'
import { ReactionService } from '.'


export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  async createReaction(userId: string, postId: string, like: boolean, retweet: boolean) : Promise<ReactionDTO> {
    return await this.repository.react(userId, postId, like, retweet)
  }

  async deleteReaction (userId: string, postId: string): Promise<void> {
    await this.repository.unreact(userId, postId)
  }

  async getLikesByUser (userId: string): Promise<ReactionDTO[]> {
    return await this.repository.getLikes(userId)
  }

}