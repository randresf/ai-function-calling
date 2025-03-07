import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import * as path from 'path';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  result: string;
  clientId?: string;
}

interface ScoreResult {
  id: string;
  score: number;
  response: string;
  recomendedPrompt: string;
}

interface Scoring {
  id: string;
  feedback: string;
  originalResponse: string;
  results: ScoreResult[];
}

interface WSClient {
  id: string;
  messageIds: string[];
  lastSeen: string;
}

interface Schema {
  messages: Message[];
  clients: WSClient[];
  scoring: Scoring[];
}

const defaultData: Schema = {
  messages: [],
  clients: [],
  scoring: [],
};

class DatabaseService {
  private static instance: DatabaseService;
  private db: Low<Schema>;

  private constructor() {
    const file = path.join(process.cwd(), 'db.json');
    const adapter = new JSONFile<Schema>(file);
    this.db = new Low<Schema>(adapter, defaultData);
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initialize(): Promise<void> {
    await this.db.read();
    this.db.data ||= defaultData;
    await this.db.write();
  }

  public async getMessages(): Promise<Message[]> {
    return this.db.data.messages;
  }

  public async getClientMessage(clientId: string): Promise<Message[] | undefined> {
    return this.db.data.messages.filter(m => m.clientId === clientId);
  }

  public async addMessage(message: Message): Promise<void> {
    this.db.data.messages.push(message);
    await this.db.write();
  }

  public async addMessages(messages: Message[]): Promise<void> {
    this.db.data.messages.push(...messages);
    await this.db.write();
  }

  public async getClients(): Promise<WSClient[]> {
    return this.db.data.clients;
  }

  public async getClient(clientId: string): Promise<WSClient | undefined> {
    return this.db.data.clients.find(c => c.id === clientId);
  }

  public async addClient(client: WSClient): Promise<void> {
    this.db.data.clients.push(client);
    await this.db.write();
  }

  public async updateClient(clientId: string, messageId: string): Promise<void> {
    const client = this.db.data.clients.find(c => c.id === clientId);
    if (client) {
      client.messageIds.push(messageId);
      client.lastSeen = new Date().toISOString();
      await this.db.write();
    }
  }

  public async removeClient(clientId: string): Promise<void> {
    this.db.data.clients = this.db.data.clients.filter(c => c.id !== clientId);
    await this.db.write();
  }

  public async saveScore(score: Scoring): Promise<void> {
    this.db.data.scoring.push(score);
    await this.db.write();
  }


}

export const dbService = DatabaseService.getInstance();