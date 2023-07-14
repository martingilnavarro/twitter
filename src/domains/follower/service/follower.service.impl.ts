import { FollowerDTO } from '../dto'
import { FollowerRepository } from '../repository'
import { FollowerService } from '.'


export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}

  async createFollow(userId: string, followedId: string) : Promise<FollowerDTO> {
    return await this.repository.follow(userId, followedId)
  }

}