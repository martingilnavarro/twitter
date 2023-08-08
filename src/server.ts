import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'


const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");

import { Constants, NodeEnv, Logger } from '@utils'
import { router } from '@router'
import { ErrorHandling } from '@utils/errors'

const app = express()

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')) // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()) // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()) // Parse cookies

// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST
  })
)

app.use('/api', router)

app.use(ErrorHandling)

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Twitter Express API with Swagger",
      version: "0.1.0",
      description:
        "Twitter challenge made with Express and documented with Swagger",
      
    },
    servers: [
      {
        url: "http://localhost:8080/api",
      },
    ],
  },
  apis: [__filename],
};

/**
 * @swagger
 * components:
 *   
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *           example: 2111ff7b-2f1b-4cee-8429-fa4ad9be9891
 *         username:
 *           type: string
 *           example: usuario1
 *         email:
 *           type: string
 *           example: uno@gmail.com 
 *         password:
 *           type: string
 *           example: Clave1111!
 *         private:
 *           type: boolean
 *           description: Whether the user's profile is private(true) or public(false)
 *           example: true
 *         createdAt:
 *           type: date
 *           description: The date the user was added
 *           example: 2023-07-18T15:05:02.756Z
 *       required:
 *         - username
 *         - email
 *         - password

 *     Post:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         authorId:
 *           type: string
 *           description: The id of the author of the post
 *         content:
 *           type: string
 *         images:
 *           type: string[]
 *         comment:
 *           type: boolean
 *           description: Whether the post is a comment to another post or not
 *         createdAt:
 *           type: date
 *           description: The date the user was added
 *         postCommentedId:
 *           type: string
 *           description: The id of the post commented (if it is a comment)
 *       example:
 *         id: 9d0f4e45-4afa-446a-bc86-767e4cff558c
 *         authorId: 2111ff7b-2f1b-4cee-8429-fa4ad9be9891
 *         content: post11
 *         images: []
 *         comment: false
 *         createdAt: 2023-07-18T15:05:02.756Z
 *         postCommentedId: null
 
 *     Follow:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the follow
 *         followerId:
 *           type: string
 *           description: The id of the user who follows
 *         followedId:
 *           type: string
 *           description: The id of the user who is followed
 *         createdAt:
 *           type: date
 *           description: The date the user was added
 *       example:
 *         id: 63ce101b-c091-4325-805a-9b4cafe49164
 *         followerId: 2111ff7b-2f1b-4cee-8429-fa4ad9be9891
 *         followedId: 3ec623bd-fe6c-408d-b9a6-a9ded7916ea3
 *         createdAt: 2023-07-18T15:38:51.972Z
 
 *     Reaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the reaction
 *         userId:
 *           type: string
 *           description: The id of the user who reacted to the post
 *         postId:
 *           type: string
 *           description: The id of the post which was reacted to
 *         like:
 *           type: boolean
 *           description: If the user reacted with a like
 *         retweet:
 *           type: boolean
 *           description: If the user reacted with a retweet
 *         createdAt:
 *           type: date
 *           description: The date the user was added
 *       example:
 *         id: 0380bfb4-1d77-44eb-9e8f-6c2fcfd1cef9
 *         userId: 2111ff7b-2f1b-4cee-8429-fa4ad9be9891
 *         postId: 0180151a-ec93-46c8-b52f-7a79e9c91e3b
 *         like: true
 *         retweet: false
 *         createdAt: 2023-07-28T20:28:43.777Z

 */

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Endpoints for checking server health
 * /health:
 *   get:
 *     summary: Check server health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: OK
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for user authentication
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: usuario1
 *             email: uno@gmail.com
 *             password: Clave1111!
 *          
 *     responses:
 *       201:
 *         description: created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlOWQ5OGE3Mi0xYjliLTRkZGMtYmU4MC1kNDUyMWNmZWMzZjkiLCJpYXQiOjE2OTE0OTM1OTEsImV4cCI6MTY5MTU3OTk5MX0.Sz9a4U3TXg7DRT-MwIitN243xrZChOJBfRDQ_Cxmwdg
 *                  
 *       409:
 *         description: Conflict. User already exists 
 *       400:
 *         description: Bad Request
 * 
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: usuario1
 *             email: uno@gmail.com
 *             password: Clave1111!
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlOWQ5OGE3Mi0xYjliLTRkZGMtYmU4MC1kNDUyMWNmZWMzZjkiLCJpYXQiOjE2OTE0OTM1OTEsImV4cCI6MTY5MTU3OTk5MX0.Sz9a4U3TXg7DRT-MwIitN243xrZChOJBfRDQ_Cxmwdg
 *       401:
 *         description: Unauthorized. Incorrect password
 *       404:
 *         description: Not found. Couldn't find user
 * 
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints for getting user information
 * /user:
 *   get:
 *     summary: returns recomended users paginated
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. Missing token
 * 
 *   delete:
 *     summary: Delete the logged user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 * 
 * /user/me:
 *   get:
 *     summary: Get the logged user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The logged user response
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   
 * /user/{userId}:
 *   get:
 *     summary: Get the user by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 * 
 * /user/profile/private:
 *   put:
 *     summary: Set the status of the logged user to private
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The status was set to private
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   
 * 
 * /user/profile/public:
 *   put:
 *     summary: Set the status of the logged user to public
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The status was set to public
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   
 
 *   

 */

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: The post managing API
 * /post:
 *   get:
 *     summary: Lists all the posts
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *   
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error 
 * 
 * /post/{postId}:
 *   get:
 *     summary: Get the post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The post response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The post was not found
 
 *   post:
 *     summary: Create a new comment
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error 
 * 
 *   delete:
 *     summary: Remove the post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The post was deleted
 *       404:
 *         description: The post was not found
 
 * /post/by_user/{userId}:
 *   get:
 *     summary: Get the posts of a user by his id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id
 *     responses:
 *       200:
 *         description: The posts response by user id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The user was not found
 * 
 * /post/by_user/comments/{userId}:
 *   get:
 *     summary: Get the comments of a user by his id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id
 *     responses:
 *       200:
 *         description: The comments response by user id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The user was not found

 */

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: The follow managing API
 * /follower/follow/{user_id}:
 *   post:
 *     summary: follow a user by id
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The created follow.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Follow'
 *       500:
 *         description: Some server error 
 * 
 * /follower/unfollow/{user_id}:
 *   post:
 *     summary: unfollow a user by id
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The deleted follow.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Follow'
 *       500:
 *         description: Some server error 
 */


/**
 * @swagger
 * tags:
 *   name: Reaction
 *   description: The reaction managing API
 * /reactions/likes/{user_id}:
 *   get:
 *     summary: Lists all the likes of the user
 *     tags: [Reaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the likes of the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reaction'
 * /reactions/retweets/{user_id}:
 *   get:
 *     summary: Lists all the retweets of the user
 *     tags: [Reaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the reactions of the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reaction'
 * /reaction/{post_id}:
 *   post:
 *     summary: React to a post
 *     tags: [Reaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reaction'
 *     responses:
 *       200:
 *         description: The created reaction.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reaction'
 *       500:
 *         description: Some server error 
 * 
 *   delete:
 *     summary: Remove the reaction from the post
 *     tags: [Reaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The reaction was deleted
 *       404:
 *         description: The post was not found
 
 * /post/by_user/{user_id}:
 *   get:
 *     summary: Get the posts of a user by his id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id
 *     responses:
 *       200:
 *         description: The posts response by user id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The user was not found

 */

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`)
})