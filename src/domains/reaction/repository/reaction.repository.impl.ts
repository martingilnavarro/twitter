import { PrismaClient } from '@prisma/client'


import { ReactionRepository } from '.'
import { ReactionDTO } from '../dto'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async react (userId: string, postId: string, like: boolean, retweet: boolean) : Promise<ReactionDTO> {
    const reaction = await this.db.reaction.create({
      data: {
        userId: userId,
        postId: postId,
        like: like,
        retweet: retweet
      }
    })
    return new ReactionDTO(reaction)
  }

  async unreact(userId: string, postId: string): Promise<void> {
    await this.db.reaction.deleteMany({
      where: {
        userId: userId ,
        postId: postId
      }
    })
  }

  async getLikes (userId: string): Promise<ReactionDTO[]> {
    const likes = await this.db.reaction.findMany({     
      where: {
        userId,
        like: true
      }
    })
    return likes.map(like => new ReactionDTO(like))
  }
  


}
