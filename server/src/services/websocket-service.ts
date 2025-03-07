import { Socket } from 'socket.io';
import { dbService } from './db-service';

export class WebSocketService {
  private static instance: WebSocketService;

  private constructor() { }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public async handleConnection(socket: Socket): Promise<string> {
    const clientId = Date.now().toString();
    // Initialize client in the database
    await dbService.addClient({
      id: clientId,
      messageIds: [],
      lastSeen: new Date().toISOString()
    });

    // Setup connection monitoring
    this.setupConnectionMonitoring(socket, clientId);

    return clientId;
  }

  private setupConnectionMonitoring(socket: Socket, clientId: string): void {
    socket.on('disconnect', async () => {
      await dbService.removeClient(clientId);
    });

    socket.on('error', async () => {
      await dbService.removeClient(clientId);
    });
  }

  public async sendUpdate(messageId: string, type: string, clientId: string, socket: Socket, content?: string, error?: string): Promise<void> {
    const clients = await dbService.getClients();
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const message = JSON.stringify({ messageId, status: type, content, error });
    try {
      if (socket && socket.data.clientId === clientId) {
        socket.emit('message', message);
        await dbService.updateClient(clientId, messageId);
      }
    } catch (err) {
      console.error('Failed to send message to client:', err);
      await dbService.removeClient(clientId);
    }
  }
}

export const wsService = WebSocketService.getInstance();