import { PrismaClient } from '@prisma/client'


import { FollowerRepository } from '.'
import { FollowerDTO } from '../dto'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}

  async follow (userId: string, followedId: string) : Promise<FollowerDTO> {
    const follow = await this.db.follow.create({
      data: {
        followerId: userId,
        followedId: followedId,
      }
    })
    return new FollowerDTO(follow)
  }


  


}
