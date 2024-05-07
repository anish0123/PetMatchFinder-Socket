import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';
import { ClientToServerEvents, ServerToClientEvents } from './interfaces/Socket';

require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
  });

  socket.on('update', (msg) => {
    
    if (msg === 'animal') {
      socket.broadcast.emit('addAnimal', 'New animal added');
    } else if (msg === 'category') {
      socket.broadcast.emit('addCategory', 'New category added');
    } else if (msg === 'modifyAnimal') {
      socket.broadcast.emit('modifyAnimal', 'Animal updated');
    } else if(msg === 'modifyCategory') {
      socket.broadcast.emit('modifyCategory', 'Category updated');
    } else if(msg === 'deleteCategory') {
      socket.broadcast.emit('deleteCategory', 'Category deleted');
    } else if (msg === 'rating') {
      socket.broadcast.emit('addRating', 'New Rating added');
    } else if (msg === 'modifyRating') {
      socket.broadcast.emit('modifyRating', 'Rating updated')
    } else if (msg === 'deleteRating') {
      socket.broadcast.emit('deleteRating', 'Rating deleted')
    }
  });
});

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default httpServer;
