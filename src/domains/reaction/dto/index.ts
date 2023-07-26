export class ReactionDTO {
    constructor (reaction: ReactionDTO) {
      this.id = reaction.id
      this.userId = reaction.userId
      this.postId = reaction.postId
      this.like = reaction.like
      this.retweet = reaction.retweet
      this.createdAt = reaction.createdAt
    }
  
    id: string
    userId: string
    postId: string
    createdAt: Date
    like: Boolean
    retweet: Boolean
  }
  