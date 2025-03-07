import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { dbService } from './services/db-service';
import { wsService } from './services/websocket-service';
import { createApiRoutes } from './routes/api-routes';

// Initialize database service
dbService.initialize();

// Create Express app
const app = express();

// Create HTTP server and Socket.IO instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: '/ws',
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS']
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable CORS for HTTP requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  next();
});

// Socket.IO connection handling
io.on('connection', async (socket) => {
  const clientId = await wsService.handleConnection(socket);

  // Attach clientId to socket instance for reference
  socket.data.clientId = clientId;

  // Send clientId to the connected client
  socket.emit('client_id', clientId);

  // Join a room with the client ID
  socket.join(clientId);
});

// Use API routes
app.use('/api', createApiRoutes(io));

// Start the server
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
