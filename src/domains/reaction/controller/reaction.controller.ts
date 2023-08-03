import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db } from '@utils'

import { ReactionRepositoryImpl } from '../repository'
import { ReactionService, ReactionServiceImpl } from '../service'


export const reactionRouter = Router()

// Use dependency injection
const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))


reactionRouter.post('/:post_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { post_id } = req.params
  const {like} = req.body
  const {retweet} = req.body

  const reaction = await service.createReaction(userId, post_id, like, retweet)

  return res.status(HttpStatus.CREATED).json(reaction)
})

reactionRouter.delete('/:post_id', async (req: Request, res: Response) => {
  
  const { userId } = res.locals.context
  const { post_id } = req.params

  await service.deleteReaction(userId, post_id)

  return res.status(HttpStatus.OK).send(`Deleted reaction to post ${post_id}`)
})

reactionRouter.get('/likes/:user_id', async (req: Request, res: Response) => {
  
  const { user_id } = req.params

  const likes = await service.getLikesByUser(user_id)

  return res.status(HttpStatus.OK).json(likes)
})

reactionRouter.get('/retweets/:user_id', async (req: Request, res: Response) => {
  
  const { user_id } = req.params

  const retweets = await service.getRetweetsByUser(user_id)

  return res.status(HttpStatus.OK).json(retweets)
})

