import type { Server } from 'socket.io';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { processWithAI } from '../services/main-service';
import { dbService } from '../services/db-service';
import { wsService } from '../services/websocket-service';
import { ChatSchema } from '../tools/chat';

export default function ChatRoute(io: Server) {
  return async (req: Request, res: Response) => {
    try {
      const { message } = ChatSchema.parse(req.body);

      const { clientId, socket } = await getClientId(req, io);

      // Process the message with AI
      const responseId = Date.now().toString();
      await wsService.sendUpdate(responseId, 'thinking', clientId, socket);
      const prevMessages = (await dbService.getClientMessage(clientId)) ?? [];
      const formatMessages = prevMessages.map(m => ({ role: m.role, content: m.content }));

      const result = await processWithAI([...formatMessages, { role: 'user', content: message }], message);
      if (!result) {
        await wsService.sendUpdate(responseId, 'error', clientId, socket, undefined, 'Failed to process message');
        throw new Error('Failed to process message');
      }

      wsService.sendUpdate(responseId, 'generating', clientId, socket, result.result ?? '');

      const response = { responseId, response: result };

      // Store messages
      await dbService.addMessages([
        { id: Date.now().toString(), role: 'user', content: message, result: '' },
        { id: responseId, role: 'assistant', content: result?.result ?? '', result: JSON.stringify(result.result) }
      ]);
      wsService.sendUpdate(responseId, 'complete', clientId, socket);
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      console.error('API Error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal Server Error'
      });
    }
  };
}

const getClientId = async (req: Request, io: Server) => {
  // Get client ID from the Socket.IO connection
  const socket = Array.from(io.sockets.sockets.values()).find(
    socket => socket.data.clientId === req.headers['x-client-id']
  );
  const clientId = socket?.data.clientId;

  if (!clientId) {
    throw new Error('No WebSocket connection found');
  }

  // Validate client exists in database
  const client = await dbService.getClient(clientId);
  if (!client) {
    throw new Error('Invalid client connection');
  }
  return { clientId, socket };
}