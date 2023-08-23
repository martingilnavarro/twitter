import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}


const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");

import { Constants, NodeEnv, Logger } from '@utils'
import { router } from '@router'
import { ErrorHandling } from '@utils/errors'



const http = require('http');
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/socket.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});
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