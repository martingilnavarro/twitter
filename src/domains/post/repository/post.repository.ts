import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { UserDTO } from '../../user/dto'
import { FollowerDTO } from '@domains/follower/dto'


export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByAuthorId: (authorId: string) => Promise<PostDTO[]>
  followsByUser: (userId: string) => Promise<FollowerDTO[]>
  publicAuthors: () => Promise<UserDTO[]>
}
