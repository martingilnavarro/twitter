

import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db } from '@utils'

import { FollowerRepositoryImpl } from '../repository'
import { FollowerService, FollowerServiceImpl } from '../service'


export const followerRouter = Router()

// Use dependency injection
const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))


followerRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { user_id } = req.params

  const follower = await service.createFollow(userId, user_id)

  return res.status(HttpStatus.CREATED).json(follower)
})

followerRouter.post('/unfollow/:user_id', async (req: Request, res: Response) => {
  
  const { userId } = res.locals.context
  const { user_id } = req.params

  await service.deleteFollow(userId, user_id)

  return res.status(HttpStatus.OK).send(`Unfollow ${user_id}`)
})

