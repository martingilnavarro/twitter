import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { UserDTO } from '../../user/dto'
import { FollowerDTO } from '@domains/follower/dto'


export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  comment: (userId: string, postId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getCommentsPost: (postId: string) => Promise<PostDTO[]>
  getByAuthorId: (authorId: string, options: CursorPagination) => Promise<PostDTO[]>
  getCommentsByAuthorId: (authorId: string, options: CursorPagination) => Promise<PostDTO[]>
  followsByUser: (userId: string) => Promise<FollowerDTO[]>
  publicAuthors: () => Promise<UserDTO[]>
}
