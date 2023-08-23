
import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from 'process'



const client = new S3Client({
  region:'eu-west-1',
  credentials:{
      accessKeyId:'test',
      secretAccessKey:'test',
      
  },
  
})

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))


userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params

  const user = await service.getUser(otherUserId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK).send('user deleted')
})

userRouter.put('/profile/private', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.setUserPrivate(userId)

  return res.status(HttpStatus.OK).send(`Profile: private`)
})

userRouter.put('/profile/public', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.setUserPublic(userId)

  return res.status(HttpStatus.OK).send(`Profile: public`)
})


userRouter.put('/image', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const { image } = req.body

  const input = {
    "Body": "userImage.jpg",
    "Bucket": "myBucket",
    "Key": "userImage.jpg"
  };
  const command = new PutObjectCommand(input);
  const response = await client.send(command);

  await service.setImage(userId, image)

  return res.status(HttpStatus.OK).send(response)
})
