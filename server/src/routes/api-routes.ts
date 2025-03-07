import { Router } from 'express';
import { Server } from 'socket.io';
import { dbService } from '../services/db-service';
import ChatRoute from './chat-routes';
import FeedbackRoute from './feedback-route';

export function createApiRoutes(io: Server): Router {
  const router = Router();

  router.post('/chat', ChatRoute(io));

  router.get('/messages', async (req, res) => {
    const messages = await dbService.getMessages();
    res.json(messages);
  });

  router.post('/feedback', FeedbackRoute());

  return router;
}