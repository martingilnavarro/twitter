import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException, PrivateAuthor } from '@utils'
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
    const publicAuthors = await this.repository.publicAuthors()
    const publicAuthorsId = publicAuthors.map(author => author.id)
    const follows = await this.repository.followsByUser(userId)
    const idFollowed = follows.map(follow => follow.followedId)
    
    const authorAllowed = 
    publicAuthorsId.includes(post.authorId) || idFollowed.includes(post.authorId) || post.authorId === userId
    if (!authorAllowed ) throw new PrivateAuthor()
    return post
  }
  

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    // TODO: filter post search to return posts from authors that the user follows
    const allPosts = await this.repository.getAllByDatePaginated(options)
    
    const publicAuthors = await this.repository.publicAuthors()
    const publicAuthorsId = publicAuthors.map(author => author.id)
    const follows = await this.repository.followsByUser(userId)
    const idFollowed = follows.map(follow => follow.followedId)

    const allowedPosts = allPosts.filter(postAllowed)
    function postAllowed(post:PostDTO) {
      return post.authorId === userId || publicAuthorsId.includes(post.authorId) || idFollowed.includes(post.authorId);
    }
    
    return allowedPosts
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    
    const publicAuthors = await this.repository.publicAuthors()
    const publicAuthorsId = publicAuthors.map(author => author.id)
    const follows = await this.repository.followsByUser(userId)
    const idFollowed = follows.map(follow => follow.followedId)
    
    const authorAllowed = 
    publicAuthorsId.includes(authorId) || idFollowed.includes(authorId) || authorId === userId
    if (!authorAllowed ) throw new PrivateAuthor()

    return await this.repository.getByAuthorId(authorId)
  }
}
