import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'


export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    // TODO: validate that the author has public profile or the user follows the author
    
    const post = await this.repository.getById(postId)
    
    if (!post) throw new NotFoundException('post')
    const author = await this.repository.getAuthor(post.authorId)
    const isFollowed = await this.repository.isFollowing(post.authorId, userId)
    
    
    if (author?.private && !isFollowed[0] && post.authorId !== userId ) throw new ForbiddenException()
    return post
  }
  

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    // TODO: filter post search to return posts from authors that the user follows
    const allPosts = await this.repository.getAllByDatePaginated(options)
    
    const allowedPosts = allPosts.filter(postAllowed)
    function postAllowed(post:PostDTO) {
      
      return true;
    }
    
    return allowedPosts
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    const author = await this.repository.getAuthor(authorId)
    const isFollowed = await this.repository.isFollowing(authorId, userId)
    if (author?.private && !isFollowed[0] && authorId !== userId ) throw new ForbiddenException()
    return await this.repository.getByAuthorId(authorId)
  }
}
