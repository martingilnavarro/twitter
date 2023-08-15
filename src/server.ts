import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { createServer } from "http";
import { Server } from "socket.io";

const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");

import { Constants, NodeEnv, Logger } from '@utils'
import { router } from '@router'
import { ErrorHandling } from '@utils/errors'

const app = express()

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});
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
  //apis: [__filename],
  apis: ["./src/swagger.ts"],
};



const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`)
})