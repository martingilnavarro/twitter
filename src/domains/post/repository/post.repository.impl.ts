import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { UserDTO } from '../../user/dto'
import { FollowerDTO } from '@domains/follower/dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async comment (userId: string, postId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        comment: true,
        postCommentedId: postId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
      
      
    })
    
    return posts.map(post => new PostDTO(post))
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getCommentsPost (postId: string): Promise<PostDTO[]> {
    const comments = await this.db.post.findMany({
      where: {
        postCommentedId: postId
      },
      
    })
    return comments.map(comment => new PostDTO(comment))
  }

  async getById (postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      
    })
    return (post != null) ? new PostDTO(post) : null
  }

  async getByAuthorId (authorId: string, options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      where: {
        authorId
      }
    })
    return posts.map(post => new PostDTO(post))
  }

  

  async followsByUser (userId: string): Promise<FollowerDTO[]> {
    const followers = await this.db.follow.findMany({
      where: {
        followerId: userId
      }
    })
    return followers.map(follower => new FollowerDTO(follower))
  }

  async publicAuthors (): Promise<UserDTO[]> {
    const publicAuthors = await this.db.user.findMany({
      where: {
        private: false,
        
      }
    })
    return publicAuthors.map(author => new UserDTO(author))
  }
}
