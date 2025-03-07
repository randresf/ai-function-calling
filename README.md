# AI Agents Chat Application

A modern web application featuring an AI-powered chat interface with real-time communication capabilities. The project consists of a React-based frontend client and a Node.js backend server.

## Project Structure

```
├── client/          # Frontend React application
│   ├── src/         # Source code
│   ├── public/      # Static assets
│   └── components/  # React components
└── server/          # Backend Node.js server
    ├── src/         # Source code
    ├── routes/      # API routes
    ├── services/    # Business logic
    ├── tools/       # AI tools implementation
    └── utils/       # Utility functions
```

## Features

- Real-time chat interface
- WebSocket communication
- AI-powered message interpretation
- Modern UI with Tailwind CSS
- TypeScript support

## Technology Stack

### Frontend (Client)
- React
- TypeScript
- Tailwind CSS
- Vite (Build tool)
- WebSocket for real-time communication

### Backend (Server)
- Node.js
- TypeScript
- OpenAI integration
- WebSocket server
- Zod for schema validation

## Setup Instructions

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn

### Client Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The client will be available at http://localhost:5173

### Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:3000

## Environment Configuration

### Client (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```

### Server
```env
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```

## Development

The project uses TypeScript for both frontend and backend, ensuring type safety and better developer experience. The client-server communication is handled through both REST API and WebSocket connections for real-time updates.

## License

MIT License