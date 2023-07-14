import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db, BodyValidation } from '@utils'

import { FollowerRepositoryImpl } from '../repository'
import { FollowerService, FollowerServiceImpl } from '../service'


export const postRouter = Router()

// Use dependency injection
const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))


postRouter.post('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const follower = await service.createFollow(userId, data)

  return res.status(HttpStatus.CREATED).json(follower)
})

