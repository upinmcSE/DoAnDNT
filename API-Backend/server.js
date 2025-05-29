import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { userRouter, authRouter, postRouter, commentRouter, chatRouter, notificationRouter } from './routes/index.js';
import { createServer } from 'http';
import connectDB from './database/database.js';
import socket from './config/socket/socket.js';
import authentication from './middlewares/authentication.js';
import swagger from './swagger.js';

dotenv.config();


const app = express();
const server = createServer(app); 
const PORT = process.env.PORT || 3002;

const { initSocket } = socket;
// socket
initSocket(server);

// swagger
swagger(app, PORT);

// cors
app.use(cors({
    origin: ['http://192.168.0.102:8081', 'http://localhost:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// middleware
app.use(authentication);
app.use(express.json());

// routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/notification', notificationRouter);

// root route
app.get('/api/v1/', (req, res) => {
    res.send('Hello World');
});

// start server
server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});


