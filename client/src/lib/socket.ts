import { io, Socket } from 'socket.io-client';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private clientId: string | null = null;

  private constructor() {
    const API_BASE_URL = import.meta.env.VITE_WS_URL
    this.socket = io(API_BASE_URL, {
      path: '/ws',
      transports: ['websocket'],
      autoConnect: true
    });

    this.setupEventListeners();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.dispatchWindowMessage('connected');
      if (this.clientId) {
        this.socket?.emit('restore_client_id', this.clientId);
      }
      if (this.clientId) {
        this.socket?.emit('restore_client_id', this.clientId);
      }
    });

    this.socket.on('client_id', (clientId: string) => {
      this.clientId = clientId;
      localStorage.setItem('socketClientId', clientId);
    });

    this.socket.on('message', (message: string) => {
      const data = this.safeParse(message);
      this.dispatchWindowMessage('message', data);
    });

    this.socket.on('disconnect', () => {
      this.clientId = null;

    });

    this.socket.on('error', () => {
      this.dispatchWindowMessage('error', 'Failed to connect to the server');
    });
  }

  private safeParse(data: string): any {
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }

  private dispatchWindowMessage(type: string, message?: string) {
    const event = new CustomEvent('socket-message', {
      detail: { type, message }
    });
    window.dispatchEvent(event);
  }

  public getClientId(): string | null {
    return this.clientId;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.clientId = null;
    }
  }
}

export const socketService = SocketService.getInstance();